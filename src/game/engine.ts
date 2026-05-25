import type { LevelDef } from "./levels";

export const TILE = 40;
export const GRAVITY = 0.55;
export const JUMP_V = -14;
export const FLAP_V = -12;
export const MOVE_SPEED = 4.8;
export const MAX_FALL = 13;

export interface Entity {
  x: number; y: number; w: number; h: number;
  vx: number; vy: number;
  alive: boolean;
}

export interface Enemy extends Entity {
  dir: 1 | -1;
  kind: "spider" | "fly";
}

export interface Coin {
  x: number; y: number; w: number; h: number;
  taken: boolean;
}

export interface Gate {
  x: number; y: number; w: number; h: number;
  open: boolean;
  triggered: boolean;
}

export interface Goal { x: number; y: number; w: number; h: number; }

export type GameState = "playing" | "quiz" | "won" | "lost";

export interface EngineCallbacks {
  onScore: (s: number) => void;
  onLives: (l: number) => void;
  onCoins: (c: number) => void;
  onQuiz: () => void;
  onWin: () => void;
  onLose: () => void;
}

export class GameEngine {
  level: LevelDef;
  cols: number;
  rows: number;
  solids: boolean[][] = [];
  platforms: boolean[][] = [];

  player: Entity & { onGround: boolean; jumpsLeft: number; flapCooldown: number; invuln: number };
  enemies: Enemy[] = [];
  coins: Coin[] = [];
  gates: Gate[] = [];
  goal: Goal = { x: 0, y: 0, w: TILE, h: TILE };

  camera = { x: 0, y: 0 };
  keys: Record<string, boolean> = {};

  score = 0;
  lives = 3;
  coinsTaken = 0;
  state: GameState = "playing";
  pendingGate: Gate | null = null;

  cbs: EngineCallbacks;

  constructor(level: LevelDef, cbs: EngineCallbacks) {
    this.level = level;
    this.cbs = cbs;
    this.cols = level.tiles[0].length;
    this.rows = level.tiles.length;

    for (let y = 0; y < this.rows; y++) {
      this.solids[y] = [];
      this.platforms[y] = [];
      for (let x = 0; x < this.cols; x++) {
        const c = level.tiles[y][x];
        this.solids[y][x] = c === "#";
        this.platforms[y][x] = c === "=";
        if (c === "P") this.spawnPlayer = { x: x * TILE, y: y * TILE };
        if (c === "M") this.coins.push({ x: x * TILE + 8, y: y * TILE + 8, w: 24, h: 24, taken: false });
        if (c === "E") this.enemies.push({
          x: x * TILE, y: y * TILE, w: TILE - 6, h: TILE - 6,
          vx: 1.4, vy: 0, dir: 1, alive: true, kind: Math.random() > 0.5 ? "spider" : "fly",
        });
        if (c === "?") this.gates.push({ x: x * TILE, y: y * TILE - TILE, w: TILE, h: TILE * 2, open: false, triggered: false });
        if (c === "G") this.goal = { x: x * TILE, y: y * TILE - TILE, w: TILE, h: TILE * 2 };
      }
    }

    const sp = this.spawnPlayer ?? { x: TILE, y: TILE * 5 };
    this.player = {
      x: sp.x, y: sp.y, w: 32, h: 30,
      vx: 0, vy: 0, alive: true,
      onGround: false, jumpsLeft: 2, flapCooldown: 0, invuln: 0,
    };
  }

  spawnPlayer?: { x: number; y: number };

  setKey(k: string, down: boolean) { this.keys[k] = down; }

  resumeFromQuiz(correct: boolean) {
    if (this.pendingGate) {
      if (correct) {
        this.pendingGate.open = true;
        this.score += 50;
        this.cbs.onScore(this.score);
      } else {
        this.lives = Math.max(0, this.lives - 1);
        this.cbs.onLives(this.lives);
        this.pendingGate.triggered = false; // can retry
        if (this.lives <= 0) { this.state = "lost"; this.cbs.onLose(); return; }
      }
      this.pendingGate = null;
    }
    this.state = "playing";
  }

  isSolidAt(px: number, py: number, includePlatform = false, prevBottom?: number) {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || ty >= this.rows || tx >= this.cols) {
      if (tx < 0) return true; // left wall
      return false;
    }
    if (this.solids[ty]?.[tx]) return true;
    if (includePlatform && this.platforms[ty]?.[tx]) {
      // one-way platform: only collide when falling from above
      const platformTop = ty * TILE;
      if (prevBottom !== undefined && prevBottom <= platformTop + 1) return true;
    }
    return false;
  }

  moveEntity(e: Entity, withPlatforms: boolean) {
    // X
    const newX = e.x + e.vx;
    const stepsX = Math.ceil(Math.abs(e.vx));
    let curX = e.x;
    for (let i = 0; i < stepsX; i++) {
      const dx = Math.sign(e.vx);
      const test = curX + dx;
      const probeX = e.vx > 0 ? test + e.w : test;
      const blocked =
        this.isSolidAt(probeX, e.y + 2) ||
        this.isSolidAt(probeX, e.y + e.h - 2);
      if (blocked) { e.vx = 0; break; }
      curX = test;
    }
    e.x = e.vx === 0 ? curX : newX;

    // Y
    const prevBottom = e.y + e.h;
    const newY = e.y + e.vy;
    const stepsY = Math.ceil(Math.abs(e.vy));
    let curY = e.y;
    let landed = false;
    for (let i = 0; i < stepsY; i++) {
      const dy = Math.sign(e.vy);
      const test = curY + dy;
      const probeY = e.vy > 0 ? test + e.h : test;
      const blocked =
        this.isSolidAt(e.x + 2, probeY, withPlatforms && e.vy > 0, prevBottom) ||
        this.isSolidAt(e.x + e.w - 2, probeY, withPlatforms && e.vy > 0, prevBottom);
      if (blocked) {
        if (e.vy > 0) landed = true;
        e.vy = 0;
        break;
      }
      curY = test;
    }
    e.y = e.vy === 0 ? curY : newY;
    return landed;
  }

  update() {
    if (this.state !== "playing") return;
    const p = this.player;

    // input
    let ax = 0;
    if (this.keys["ArrowLeft"] || this.keys["a"]) ax -= 1;
    if (this.keys["ArrowRight"] || this.keys["d"]) ax += 1;
    p.vx = ax * MOVE_SPEED;

    // jump (edge-detect via flapCooldown decay)
    if (p.flapCooldown > 0) p.flapCooldown--;
    if (p.invuln > 0) p.invuln--;

    // gravity
    p.vy += GRAVITY;
    if (p.vy > MAX_FALL) p.vy = MAX_FALL;

    const landed = this.moveEntity(p, true);
    if (landed) { p.onGround = true; p.jumpsLeft = 2; }
    else p.onGround = false;

    // fell off
    if (p.y > this.rows * TILE + 80) {
      this.lives--; this.cbs.onLives(this.lives);
      if (this.lives <= 0) { this.state = "lost"; this.cbs.onLose(); return; }
      this.respawn();
    }

    // enemies
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (e.kind === "fly") {
        e.vy = Math.sin((Date.now() + e.x) / 300) * 1.2;
      } else {
        e.vy += GRAVITY;
        if (e.vy > 10) e.vy = 10;
      }
      // turn around at edges / walls
      const aheadX = e.dir > 0 ? e.x + e.w + 1 : e.x - 1;
      const wall = this.isSolidAt(aheadX, e.y + e.h - 4);
      const floorAhead = e.kind === "fly" ? true : this.isSolidAt(aheadX, e.y + e.h + 4);
      if (wall || !floorAhead) { e.dir = (e.dir === 1 ? -1 : 1); }
      e.vx = e.dir * 1.4;
      this.moveEntity(e, false);
    }

    // coin collisions
    for (const c of this.coins) {
      if (c.taken) continue;
      if (aabb(p, c)) {
        c.taken = true;
        this.coinsTaken++;
        this.score += 10;
        this.cbs.onCoins(this.coinsTaken);
        this.cbs.onScore(this.score);
      }
    }

    // enemy collisions
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (aabb(p, e)) {
        // stomp if falling and above
        if (p.vy > 1 && p.y + p.h - e.y < 18) {
          e.alive = false;
          p.vy = JUMP_V * 0.7;
          this.score += 30;
          this.cbs.onScore(this.score);
        } else if (p.invuln === 0) {
          this.lives--; this.cbs.onLives(this.lives);
          p.invuln = 80;
          p.vy = -8;
          if (this.lives <= 0) { this.state = "lost"; this.cbs.onLose(); return; }
        }
      }
    }

    // gate
    for (const g of this.gates) {
      if (g.open || g.triggered) continue;
      if (aabb(p, g)) {
        g.triggered = true;
        this.pendingGate = g;
        this.state = "quiz";
        this.cbs.onQuiz();
        return;
      }
    }
    // closed gates block movement
    for (const g of this.gates) {
      if (g.open) continue;
      if (aabb(p, { x: g.x, y: g.y, w: g.w, h: g.h })) {
        // push player back
        if (p.x + p.w / 2 < g.x + g.w / 2) p.x = g.x - p.w - 1;
        else p.x = g.x + g.w + 1;
      }
    }

    // goal
    if (aabb(p, this.goal)) {
      this.score += 200;
      this.cbs.onScore(this.score);
      this.state = "won";
      this.cbs.onWin();
    }

    // camera
    this.camera.x = Math.max(0, Math.min(p.x - 320, this.cols * TILE - 800));
  }

  respawn() {
    const sp = this.spawnPlayer ?? { x: TILE, y: TILE * 5 };
    this.player.x = sp.x; this.player.y = sp.y;
    this.player.vx = 0; this.player.vy = 0;
    this.player.invuln = 60;
  }

  tryJump() {
    if (this.state !== "playing") return;
    const p = this.player;
    if (p.flapCooldown > 0) return;
    if (p.onGround) {
      p.vy = JUMP_V;
      p.onGround = false;
      p.jumpsLeft = 1;
      p.flapCooldown = 8;
    } else if (p.jumpsLeft > 0) {
      p.vy = FLAP_V;
      p.jumpsLeft--;
      p.flapCooldown = 10;
    }
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h);
    // sky gradient is drawn via CSS background of canvas wrapper

    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    // tiles
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const px = x * TILE, py = y * TILE;
        if (px + TILE < this.camera.x - 40 || px > this.camera.x + w + 40) continue;
        if (this.solids[y][x]) {
          // hex sarang lebah ground
          ctx.fillStyle = this.level.ground;
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = "rgba(0,0,0,0.12)";
          ctx.fillRect(px, py, TILE, 6);
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.beginPath();
          ctx.arc(px + 12, py + 16, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.platforms[y][x]) {
          ctx.fillStyle = "#f0b94a";
          ctx.fillRect(px, py + 8, TILE, 14);
          ctx.fillStyle = "#c98c2a";
          ctx.fillRect(px, py + 18, TILE, 4);
        }
      }
    }

    // goal — beehive
    drawHive(ctx, this.goal.x, this.goal.y);

    // gates
    for (const g of this.gates) {
      if (g.open) continue;
      ctx.fillStyle = "rgba(199,120,40,0.85)";
      ctx.fillRect(g.x + 4, g.y, g.w - 8, g.h);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", g.x + g.w / 2, g.y + g.h / 2);
    }

    // coins — honey drops
    for (const c of this.coins) {
      if (c.taken) continue;
      ctx.fillStyle = "#ffcb3a";
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 2, c.y + c.h / 2 + 2, c.w / 2 - 2, c.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff7c2";
      ctx.beginPath();
      ctx.arc(c.x + c.w / 2 - 4, c.y + c.h / 2 - 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // enemies
    for (const e of this.enemies) {
      if (!e.alive) continue;
      drawEnemy(ctx, e);
    }

    // player (bee)
    drawBee(ctx, this.player.x, this.player.y, this.player.vx, this.player.invuln > 0 && Math.floor(this.player.invuln / 6) % 2 === 0);

    ctx.restore();
  }
}

function aabb(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawBee(ctx: CanvasRenderingContext2D, x: number, y: number, vx: number, blink: boolean) {
  if (blink) ctx.globalAlpha = 0.4;
  const cx = x + 16, cy = y + 15;
  // wings
  ctx.fillStyle = "rgba(220,240,255,0.85)";
  const t = Date.now() / 40;
  const wingY = cy - 10 + Math.sin(t) * 2;
  ctx.beginPath(); ctx.ellipse(cx - 6, wingY, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 6, wingY, 8, 5, 0.3, 0, Math.PI * 2); ctx.fill();
  // body
  ctx.fillStyle = "#ffcc33";
  ctx.beginPath(); ctx.ellipse(cx, cy, 16, 13, 0, 0, Math.PI * 2); ctx.fill();
  // stripes
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(cx - 8, cy - 6, 4, 14);
  ctx.fillRect(cx + 2, cy - 7, 4, 15);
  // face direction
  const faceX = vx >= 0 ? cx + 8 : cx - 8;
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(faceX, cy - 2, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(faceX + (vx >= 0 ? 1 : -1), cy - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  // smile
  ctx.strokeStyle = "#222"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(faceX - (vx >= 0 ? 1 : -1), cy + 3, 2.5, 0, Math.PI); ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
  if (e.kind === "spider") {
    ctx.fillStyle = "#5a2a6e";
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#3a1a4a"; ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 10, cy); ctx.lineTo(cx - 18, cy + i * 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 10, cy); ctx.lineTo(cx + 18, cy + i * 4); ctx.stroke();
    }
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(cx - 4, cy - 3, 2.5, 0, Math.PI * 2); ctx.arc(cx + 4, cy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(cx - 4, cy - 3, 1, 0, Math.PI * 2); ctx.arc(cx + 4, cy - 3, 1, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = "#444";
    ctx.beginPath(); ctx.ellipse(cx, cy, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(180,220,255,0.8)";
    ctx.beginPath(); ctx.ellipse(cx - 4, cy - 8, 6, 4, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 4, cy - 8, 6, 4, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff5252";
    ctx.beginPath(); ctx.arc(cx - 3, cy - 1, 2, 0, Math.PI * 2); ctx.arc(cx + 3, cy - 1, 2, 0, Math.PI * 2); ctx.fill();
  }
}

function drawHive(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#e0a040";
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 80);
  ctx.lineTo(x + 36, y + 80);
  ctx.lineTo(x + 40, y + 40);
  ctx.lineTo(x + 20, y + 4);
  ctx.lineTo(x, y + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c98430";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x + 2, y + 18 + i * 16, 36, 4);
  }
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(x + 20, y + 60, 6, 0, Math.PI * 2); ctx.fill();
}
