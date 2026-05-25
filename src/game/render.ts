import { TILE } from "./engine";
import { getTheme, type WorldTheme } from "./themes";

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  topCap: boolean,
  theme: WorldTheme,
) {
  const p = getTheme(theme);
  const g = ctx.createLinearGradient(x, y, x, y + TILE);
  g.addColorStop(0, p.groundTop);
  g.addColorStop(1, p.groundBottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, TILE, TILE);

  // deco dots — interpret per theme
  switch (theme) {
    case "crystal_cave":
      // tiny crystal shards
      ctx.fillStyle = p.groundDeco;
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 26); ctx.lineTo(x + 12, y + 18); ctx.lineTo(x + 14, y + 26);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 26, y + 32); ctx.lineTo(x + 28, y + 24); ctx.lineTo(x + 30, y + 32);
      ctx.closePath(); ctx.fill();
      break;
    case "starry_sea":
      // tiny shells / coral
      ctx.fillStyle = p.groundDeco;
      ctx.beginPath(); ctx.arc(x + 12, y + 26, 3, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath(); ctx.arc(x + 28, y + 18, 1.6, 0, Math.PI * 2); ctx.fill();
      break;
    case "snow_field":
      // bluish ice flecks
      ctx.fillStyle = p.groundDeco;
      ctx.beginPath(); ctx.arc(x + 10, y + 24, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 26, y + 30, 1.4, 0, Math.PI * 2); ctx.fill();
      break;
    case "silver_ruins":
      // rivets
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x + 4, y + 6, 2, 2); ctx.fillRect(x + TILE - 6, y + 6, 2, 2);
      ctx.fillRect(x + 4, y + TILE - 8, 2, 2); ctx.fillRect(x + TILE - 6, y + TILE - 8, 2, 2);
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y + TILE / 2); ctx.lineTo(x + TILE, y + TILE / 2); ctx.stroke();
      break;
    case "comet_nest":
      // glowing magma cracks
      ctx.strokeStyle = p.groundDeco;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 30); ctx.lineTo(x + 14, y + 22); ctx.lineTo(x + 22, y + 30); ctx.lineTo(x + 36, y + 18);
      ctx.stroke();
      break;
    case "cosmic_void":
      // stardust on void rock
      ctx.fillStyle = p.groundDeco;
      ctx.beginPath(); ctx.arc(x + 8, y + 18, 1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 22, y + 28, 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 32, y + 14, 1, 0, Math.PI * 2); ctx.fill();
      break;
    case "nebula_sky":
      ctx.fillStyle = p.groundDeco;
      ctx.beginPath(); ctx.arc(x + 14, y + 22, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 28, y + 30, 1.6, 0, Math.PI * 2); ctx.fill();
      break;
    case "garden":
    default:
      ctx.fillStyle = p.groundDeco;
      ctx.beginPath(); ctx.arc(x + 10, y + 22, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 28, y + 30, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.arc(x + 22, y + 14, 1.4, 0, Math.PI * 2); ctx.fill();
      break;
  }

  // tile separators
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);

  if (topCap && p.cap) {
    const gg = ctx.createLinearGradient(x, y, x, y + 12);
    gg.addColorStop(0, p.cap);
    gg.addColorStop(1, p.capDark);
    ctx.fillStyle = gg;
    ctx.fillRect(x, y, TILE, 10);

    // theme-aware top decorations
    if (theme === "garden") {
      ctx.fillStyle = "#6dc456";
      for (let i = 0; i < 4; i++) {
        const bx = x + 4 + i * 9;
        ctx.beginPath();
        ctx.moveTo(bx, y + 10); ctx.lineTo(bx + 3, y + 2); ctx.lineTo(bx + 6, y + 10);
        ctx.closePath(); ctx.fill();
      }
    } else if (theme === "snow_field") {
      // bumpy snow top
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(x + 8 + i * 12, y + 6, 6, Math.PI, 0); ctx.fill();
      }
    } else if (theme === "starry_sea") {
      // wet sand sheen
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(x, y, TILE, 2);
    } else if (theme === "comet_nest") {
      // glowing edge
      ctx.fillStyle = "#ffd070";
      ctx.fillRect(x, y, TILE, 2);
    } else if (theme === "nebula_sky") {
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillRect(x, y, TILE, 2);
    } else if (theme === "cosmic_void") {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(x, y, TILE, 1);
    }
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x, y, TILE, 1);
  }
}

export function drawPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, theme: WorldTheme) {
  const p = getTheme(theme);
  const g = ctx.createLinearGradient(x, y + 8, x, y + 24);
  g.addColorStop(0, p.platformTop);
  g.addColorStop(1, p.platformBottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y + 8, TILE, 16);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(x, y + 22, TILE, 2);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x, y + 8, TILE, 2);
  // bolts / studs
  ctx.fillStyle = p.platformBolt;
  ctx.beginPath(); ctx.arc(x + 5, y + 16, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + TILE - 5, y + 16, 1.8, 0, Math.PI * 2); ctx.fill();

  // theme-specific accent on platform top
  if (theme === "crystal_cave") {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 8); ctx.lineTo(x + 16, y + 2); ctx.lineTo(x + 18, y + 8);
    ctx.closePath(); ctx.fill();
  } else if (theme === "snow_field") {
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x + 10, y + 8, 4, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 28, y + 8, 4, Math.PI, 0); ctx.fill();
  } else if (theme === "comet_nest") {
    ctx.fillStyle = "rgba(255,200,80,0.5)";
    ctx.fillRect(x, y + 8, TILE, 1);
  }
}

export function drawHoney(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number, theme: WorldTheme) {
  const p = getTheme(theme);
  const bob = Math.sin(t / 18) * 2;
  const cx = x + w / 2;
  const cy = y + h / 2 + bob;

  // glow
  const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18);
  glow.addColorStop(0, p.coinGlow);
  glow.addColorStop(1, hexA(p.coinEdge, 0));
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();

  switch (theme) {
    case "crystal_cave":
    case "silver_ruins": {
      // diamond crystal / cog-ish
      const grad = ctx.createLinearGradient(cx, cy - 12, cx, cy + 12);
      grad.addColorStop(0, p.coinCore);
      grad.addColorStop(1, p.coinEdge);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 12); ctx.lineTo(cx + 9, cy);
      ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 9, cy);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - 12); ctx.lineTo(cx + 4, cy - 4); ctx.lineTo(cx - 4, cy - 4);
      ctx.closePath(); ctx.fill();
      break;
    }
    case "starry_sea":
    case "cosmic_void": {
      // 5-point star
      ctx.fillStyle = p.coinCore;
      drawStar(ctx, cx, cy, 5, 10, 4);
      ctx.fillStyle = hexA(p.coinEdge, 0.85);
      drawStar(ctx, cx, cy, 5, 6, 2);
      break;
    }
    case "nebula_sky": {
      // glowing orb with ring
      const grad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, 10);
      grad.addColorStop(0, p.coinCore);
      grad.addColorStop(1, p.coinEdge);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(p.coinEdge, 0.8);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(cx, cy, 12, 4, 0.3, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case "snow_field": {
      // snowflake
      ctx.strokeStyle = p.coinEdge;
      ctx.fillStyle = p.coinCore;
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "comet_nest": {
      // glowing ember
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 11);
      grad.addColorStop(0, "#fff0a0");
      grad.addColorStop(0.5, p.coinCore);
      grad.addColorStop(1, p.coinEdge);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
      // tail
      ctx.fillStyle = hexA(p.coinEdge, 0.5);
      ctx.beginPath(); ctx.ellipse(cx - 5, cy + 4, 6, 2, -0.4, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "garden":
    default: {
      // honey teardrop
      const grad = ctx.createLinearGradient(cx, cy - 10, cx, cy + 10);
      grad.addColorStop(0, p.coinCore);
      grad.addColorStop(1, p.coinEdge);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 11);
      ctx.bezierCurveTo(cx + 10, cy - 4, cx + 9, cy + 9, cx, cy + 10);
      ctx.bezierCurveTo(cx - 9, cy + 9, cx - 10, cy - 4, cx, cy - 11);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath(); ctx.ellipse(cx - 3, cy - 2, 2.2, 4, -0.3, 0, Math.PI * 2); ctx.fill();
      break;
    }
  }
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, points: number, outer: number, inner: number) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fill();
}

export function drawGate(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number, theme: WorldTheme,
) {
  const p = getTheme(theme);
  const cx = x + w / 2;
  ctx.fillStyle = p.gateFrame;
  ctx.fillRect(x + 4, y + 6, w - 8, h - 6);

  // inner pattern
  if (theme === "garden") {
    ctx.fillStyle = p.gateInner;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        const hx = x + 12 + col * 16 + (row % 2 ? 8 : 0);
        const hy = y + 14 + row * 22;
        drawHex(ctx, hx, hy, 8);
      }
    }
  } else {
    // generic glowing inner
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, p.gateInner);
    grad.addColorStop(1, hexA(p.gateBorder, 0.2));
    ctx.fillStyle = grad;
    ctx.fillRect(x + 8, y + 10, w - 16, h - 14);
    // sparkle dots
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    for (let i = 0; i < 5; i++) {
      const sx = x + 12 + ((t / 6 + i * 19) % (w - 24));
      const sy = y + 14 + ((i * 17 + Math.floor(t / 12)) % (h - 22));
      ctx.beginPath(); ctx.arc(sx, sy, 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }

  ctx.strokeStyle = p.gateBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 4.5, y + 6.5, w - 9, h - 7);

  // floating ?
  const bob = Math.sin(t / 12) * 3;
  ctx.save();
  ctx.translate(cx, y - 6 + bob);
  ctx.rotate(Math.sin(t / 24) * 0.15);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#2a1a0a";
  ctx.lineWidth = 3;
  ctx.font = "bold 22px Fredoka, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText("?", 0, 0);
  ctx.fillText("?", 0, 0);
  ctx.restore();
}

function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawHive(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, theme: WorldTheme) {
  const p = getTheme(theme);
  // pole + flag (consistent across themes)
  ctx.fillStyle = "#5a3a1a";
  ctx.fillRect(x + 18, y - 30, 4, 34);
  const wave = Math.sin(t / 10) * 3;
  ctx.fillStyle = p.goalFlag;
  ctx.beginPath();
  ctx.moveTo(x + 22, y - 30);
  ctx.lineTo(x + 50 + wave, y - 24);
  ctx.lineTo(x + 22, y - 18);
  ctx.closePath();
  ctx.fill();

  // body shape per theme
  ctx.save();
  switch (theme) {
    case "crystal_cave": {
      // crystal portal
      const g = ctx.createLinearGradient(x, y, x, y + 80);
      g.addColorStop(0, p.goalA); g.addColorStop(1, p.goalB);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 80); ctx.lineTo(x + 36, y + 80);
      ctx.lineTo(x + 40, y + 30); ctx.lineTo(x + 20, y + 2); ctx.lineTo(x, y + 30);
      ctx.closePath(); ctx.fill();
      // inner shimmer
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath(); ctx.ellipse(x + 20, y + 46, 8, 22, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "starry_sea": {
      // lighthouse
      ctx.fillStyle = p.goalA;
      ctx.fillRect(x + 6, y + 24, 28, 56);
      ctx.fillStyle = p.goalB;
      for (let i = 0; i < 4; i++) ctx.fillRect(x + 6, y + 30 + i * 14, 28, 4);
      // top lamp
      ctx.fillStyle = "rgba(255,240,160,0.9)";
      ctx.beginPath(); ctx.arc(x + 20, y + 18, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = p.goalAccent;
      ctx.fillRect(x + 10, y + 10, 20, 6);
      break;
    }
    case "nebula_sky": {
      // cloud arch portal
      ctx.fillStyle = p.goalA;
      ctx.beginPath();
      ctx.arc(x + 20, y + 50, 22, Math.PI, 0); ctx.lineTo(x + 42, y + 80); ctx.lineTo(x - 2, y + 80);
      ctx.closePath(); ctx.fill();
      // swirling center
      ctx.fillStyle = p.goalB;
      ctx.beginPath(); ctx.arc(x + 20, y + 56, 10, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + 20, y + 56, 6 + Math.sin(t / 10) * 2, 0, Math.PI * 1.5); ctx.stroke();
      break;
    }
    case "snow_field": {
      // igloo
      ctx.fillStyle = p.goalA;
      ctx.beginPath(); ctx.arc(x + 20, y + 56, 28, Math.PI, 0); ctx.fill();
      ctx.fillRect(x - 8, y + 56, 56, 24);
      // brick lines
      ctx.strokeStyle = p.goalB;
      ctx.lineWidth = 1;
      for (let r = 0; r < 4; r++) {
        ctx.beginPath(); ctx.arc(x + 20, y + 56, 8 + r * 5, Math.PI, 0); ctx.stroke();
      }
      // entrance
      ctx.fillStyle = p.goalAccent;
      ctx.fillRect(x + 14, y + 60, 12, 18);
      break;
    }
    case "silver_ruins": {
      // monolith
      ctx.fillStyle = p.goalB;
      ctx.fillRect(x + 4, y + 8, 32, 72);
      ctx.fillStyle = p.goalA;
      ctx.fillRect(x + 8, y + 12, 24, 64);
      ctx.fillStyle = p.goalAccent;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 24); ctx.lineTo(x + 26, y + 36); ctx.lineTo(x + 20, y + 48);
      ctx.lineTo(x + 14, y + 36); ctx.closePath(); ctx.fill();
      break;
    }
    case "comet_nest": {
      // glowing portal of magma
      const g = ctx.createRadialGradient(x + 20, y + 50, 4, x + 20, y + 50, 36);
      g.addColorStop(0, "#fff0a0"); g.addColorStop(0.5, p.goalA); g.addColorStop(1, p.goalB);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x + 20, y + 50, 32, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = p.goalAccent;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + 20, y + 50, 24 + Math.sin(t / 8) * 3, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case "cosmic_void": {
      // star throne
      ctx.fillStyle = p.goalB;
      ctx.fillRect(x + 4, y + 50, 32, 30);
      ctx.fillStyle = p.goalA;
      drawStar(ctx, x + 20, y + 30, 5, 22, 9);
      ctx.fillStyle = "#fff";
      drawStar(ctx, x + 20, y + 30, 5, 12, 5);
      break;
    }
    case "garden":
    default: {
      // beehive (original)
      const g = ctx.createLinearGradient(x, y, x, y + 80);
      g.addColorStop(0, p.goalA); g.addColorStop(1, p.goalB);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 80); ctx.lineTo(x + 36, y + 80);
      ctx.lineTo(x + 40, y + 40); ctx.lineTo(x + 20, y + 4); ctx.lineTo(x, y + 40);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      for (let i = 0; i < 4; i++) ctx.fillRect(x + 2, y + 20 + i * 14, 36, 3);
      ctx.fillStyle = p.goalAccent;
      ctx.beginPath(); ctx.arc(x + 20, y + 60, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffcb3a";
      ctx.beginPath(); ctx.arc(x + 20, y + 62, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(80,40,10,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 80); ctx.lineTo(x + 36, y + 80);
      ctx.lineTo(x + 40, y + 40); ctx.lineTo(x + 20, y + 4); ctx.lineTo(x, y + 40);
      ctx.closePath(); ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

export function drawBee(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  vx: number, vy: number, onGround: boolean, t: number, blink: boolean,
) {
  if (blink) ctx.globalAlpha = 0.45;

  const facing = vx >= 0 ? 1 : -1;
  let sx = 1, sy = 1;
  if (!onGround) {
    if (vy < -2) { sx = 0.88; sy = 1.18; }
    else if (vy > 4) { sx = 1.12; sy = 0.9; }
  } else if (Math.abs(vx) > 0.5) {
    const bob = Math.sin(t / 4) * 0.04;
    sy = 1 + bob; sx = 1 - bob;
  }

  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(facing * sx, sy);

  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath(); ctx.ellipse(0, h / 2 + 4, 14, 3, 0, 0, Math.PI * 2); ctx.fill();

  const flap = Math.sin(t / 2) * (onGround ? 0.4 : 1);
  ctx.fillStyle = "rgba(220,240,255,0.78)";
  ctx.strokeStyle = "rgba(120,170,220,0.6)";
  ctx.lineWidth = 1;
  ctx.save();
  ctx.translate(-2, -10); ctx.rotate(-0.4 + flap * 0.5);
  ctx.beginPath(); ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(4, -10); ctx.rotate(0.4 - flap * 0.5);
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();

  const g = ctx.createRadialGradient(-3, -3, 2, 0, 0, 18);
  g.addColorStop(0, "#fff0a0");
  g.addColorStop(1, "#f5b400");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = "#2a2018";
  ctx.fillRect(-9, -13, 5, 26);
  ctx.fillRect(2, -13, 5, 26);
  ctx.restore();

  ctx.strokeStyle = "rgba(60,40,10,0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2); ctx.stroke();

  ctx.strokeStyle = "#2a2018";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(6, -10); ctx.quadraticCurveTo(10, -16, 12, -18);
  ctx.moveTo(9, -9); ctx.quadraticCurveTo(14, -14, 16, -16);
  ctx.stroke();
  ctx.fillStyle = "#2a2018";
  ctx.beginPath(); ctx.arc(12, -18, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(16, -16, 1.4, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(7, -2, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(8, -2, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(8.4, -2.6, 0.7, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = "#2a1a0a";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(5, 3, 2.2, 0.1, Math.PI - 0.1);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,120,120,0.55)";
  ctx.beginPath(); ctx.arc(3, 4, 2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
  ctx.globalAlpha = 1;
}

export function drawSpider(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number, dir: number, theme: WorldTheme,
) {
  const p = getTheme(theme);
  const cx = x + w / 2, cy = y + h / 2;
  const legPhase = Math.sin(t / 4);

  // theme accent: bat wings (cave), jelly tendrils (sea), robot plates (ruins), fire trail (comet)
  if (theme === "crystal_cave") {
    ctx.fillStyle = "rgba(20,10,40,0.85)";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.quadraticCurveTo(cx - 22, cy - 16, cx - 24, cy);
    ctx.lineTo(cx - 18, cy - 2); ctx.lineTo(cx - 14, cy + 2); ctx.lineTo(cx - 8, cy);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 4);
    ctx.quadraticCurveTo(cx + 22, cy - 16, cx + 24, cy);
    ctx.lineTo(cx + 18, cy - 2); ctx.lineTo(cx + 14, cy + 2); ctx.lineTo(cx + 8, cy);
    ctx.closePath(); ctx.fill();
  } else if (theme === "comet_nest") {
    ctx.fillStyle = "rgba(255,160,60,0.5)";
    ctx.beginPath(); ctx.ellipse(cx - 14 * dir, cy + 2, 16, 4, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    // legs
    ctx.strokeStyle = hexA(p.walkerB, 1);
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const off = (i - 1.5) * 4;
      const lift = i % 2 === 0 ? legPhase * 2 : -legPhase * 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + off);
      ctx.quadraticCurveTo(cx - 16, cy + off + lift, cx - 18, cy + 8 + off);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy + off);
      ctx.quadraticCurveTo(cx + 16, cy + off - lift, cx + 18, cy + 8 + off);
      ctx.stroke();
    }
  }

  // body
  const g = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 16);
  g.addColorStop(0, p.walkerA);
  g.addColorStop(1, p.walkerB);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();

  // eyes
  const ex = dir > 0 ? 2 : -2;
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(cx - 5 + ex, cy - 4, 3, 0, Math.PI * 2);
  ctx.arc(cx + 5 + ex, cy - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = p.walkerAccent;
  ctx.beginPath(); ctx.arc(cx - 5 + ex + 0.6 * dir, cy - 4, 1.4, 0, Math.PI * 2);
  ctx.arc(cx + 5 + ex + 0.6 * dir, cy - 4, 1.4, 0, Math.PI * 2); ctx.fill();

  // fangs / accent
  if (theme !== "crystal_cave") {
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.moveTo(cx - 2, cy + 6); ctx.lineTo(cx - 1, cy + 10); ctx.lineTo(cx, cy + 6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 0, cy + 6); ctx.lineTo(cx + 1, cy + 10); ctx.lineTo(cx + 2, cy + 6); ctx.fill();
  }
}

export function drawFly(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number, theme: WorldTheme,
) {
  const p = getTheme(theme);
  const cx = x + w / 2, cy = y + h / 2;
  const wf = Math.sin(t) * 0.4;

  if (theme === "starry_sea") {
    // jellyfish-like
    ctx.fillStyle = hexA(p.flyerBody, 0.85);
    ctx.beginPath(); ctx.ellipse(cx, cy - 2, 13, 9, 0, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = hexA(p.flyerBody, 0.7);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const tx = cx - 10 + i * 5;
      ctx.beginPath();
      ctx.moveTo(tx, cy);
      ctx.quadraticCurveTo(tx + Math.sin(t / 4 + i) * 3, cy + 8, tx, cy + 14);
      ctx.stroke();
    }
    // bright dot
    ctx.fillStyle = p.flyerAccent;
    ctx.beginPath(); ctx.arc(cx, cy - 2, 3, 0, Math.PI * 2); ctx.fill();
    return;
  }

  // wings (generic)
  ctx.fillStyle = p.flyerWing;
  ctx.save(); ctx.translate(cx - 4, cy - 8); ctx.rotate(-0.4 + wf);
  ctx.beginPath(); ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(cx + 4, cy - 8); ctx.rotate(0.4 - wf);
  ctx.beginPath(); ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  // body
  ctx.fillStyle = p.flyerBody;
  ctx.beginPath(); ctx.ellipse(cx, cy, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hexA(p.flyerBody, 0.6);
  ctx.beginPath(); ctx.ellipse(cx, cy - 4, 8, 5, 0, 0, Math.PI * 2); ctx.fill();

  // big eyes
  ctx.fillStyle = p.flyerAccent;
  ctx.beginPath(); ctx.arc(cx - 4, cy - 3, 2.8, 0, Math.PI * 2);
  ctx.arc(cx + 4, cy - 3, 2.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(cx - 4.5, cy - 3.5, 0.8, 0, Math.PI * 2);
  ctx.arc(cx + 3.5, cy - 3.5, 0.8, 0, Math.PI * 2); ctx.fill();
}
