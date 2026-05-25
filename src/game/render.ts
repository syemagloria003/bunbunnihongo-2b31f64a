import { TILE } from "./engine";

export function drawGround(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  topGrass: boolean,
) {
  // dirt base
  const g = ctx.createLinearGradient(x, y, x, y + TILE);
  g.addColorStop(0, "#a36a3a");
  g.addColorStop(1, "#6e4422");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, TILE, TILE);

  // pebble dots
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath(); ctx.arc(x + 10, y + 22, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 28, y + 30, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath(); ctx.arc(x + 22, y + 14, 1.4, 0, Math.PI * 2); ctx.fill();

  // tile separators
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);

  if (topGrass) {
    // grass top
    const gg = ctx.createLinearGradient(x, y, x, y + 12);
    gg.addColorStop(0, "#8edc6a");
    gg.addColorStop(1, "#4fa44a");
    ctx.fillStyle = gg;
    ctx.fillRect(x, y, TILE, 10);
    // grass blades
    ctx.fillStyle = "#6dc456";
    for (let i = 0; i < 4; i++) {
      const bx = x + 4 + i * 9;
      ctx.beginPath();
      ctx.moveTo(bx, y + 10);
      ctx.lineTo(bx + 3, y + 2);
      ctx.lineTo(bx + 6, y + 10);
      ctx.closePath();
      ctx.fill();
    }
    // highlight
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(x, y, TILE, 2);
  }
}

export function drawPlatform(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // wooden honey plank
  const g = ctx.createLinearGradient(x, y + 8, x, y + 24);
  g.addColorStop(0, "#ffd56a");
  g.addColorStop(1, "#d49232");
  ctx.fillStyle = g;
  ctx.fillRect(x, y + 8, TILE, 16);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(x, y + 22, TILE, 2);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x, y + 8, TILE, 2);
  // bolts
  ctx.fillStyle = "#8a5a1a";
  ctx.beginPath(); ctx.arc(x + 5, y + 16, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + TILE - 5, y + 16, 1.6, 0, Math.PI * 2); ctx.fill();
}

export function drawHoney(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number) {
  const bob = Math.sin(t / 18) * 2;
  const cx = x + w / 2;
  const cy = y + h / 2 + bob;
  // glow
  const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18);
  glow.addColorStop(0, "rgba(255,220,90,0.55)");
  glow.addColorStop(1, "rgba(255,220,90,0)");
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
  // drop body (teardrop)
  const grad = ctx.createLinearGradient(cx, cy - 10, cx, cy + 10);
  grad.addColorStop(0, "#fff1a8");
  grad.addColorStop(1, "#e8a020");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 11);
  ctx.bezierCurveTo(cx + 10, cy - 4, cx + 9, cy + 9, cx, cy + 10);
  ctx.bezierCurveTo(cx - 9, cy + 9, cx - 10, cy - 4, cx, cy - 11);
  ctx.fill();
  // shine
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath(); ctx.ellipse(cx - 3, cy - 2, 2.2, 4, -0.3, 0, Math.PI * 2); ctx.fill();
}

export function drawGate(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, t: number,
) {
  // hex portal frame
  const cx = x + w / 2;
  ctx.fillStyle = "#5a2f12";
  ctx.fillRect(x + 4, y + 6, w - 8, h - 6);
  // honeycomb pattern inside
  ctx.fillStyle = "rgba(255,200,60,0.85)";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const hx = x + 12 + col * 16 + (row % 2 ? 8 : 0);
      const hy = y + 14 + row * 22;
      drawHex(ctx, hx, hy, 8);
    }
  }
  // gold border
  ctx.strokeStyle = "#ffcb3a";
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 4.5, y + 6.5, w - 9, h - 7);

  // floating ? above
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

export function drawHive(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  // pole
  ctx.fillStyle = "#5a3a1a";
  ctx.fillRect(x + 18, y - 30, 4, 34);
  // flag waving
  const wave = Math.sin(t / 10) * 3;
  ctx.fillStyle = "#e94e87";
  ctx.beginPath();
  ctx.moveTo(x + 22, y - 30);
  ctx.lineTo(x + 50 + wave, y - 24);
  ctx.lineTo(x + 22, y - 18);
  ctx.closePath();
  ctx.fill();

  // hive body
  const g = ctx.createLinearGradient(x, y, x, y + 80);
  g.addColorStop(0, "#ffce5a");
  g.addColorStop(1, "#c97a18");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 80);
  ctx.lineTo(x + 36, y + 80);
  ctx.lineTo(x + 40, y + 40);
  ctx.lineTo(x + 20, y + 4);
  ctx.lineTo(x, y + 40);
  ctx.closePath();
  ctx.fill();

  // hive bands
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x + 2, y + 20 + i * 14, 36, 3);
  }
  // entrance
  ctx.fillStyle = "#2a1a0a";
  ctx.beginPath(); ctx.arc(x + 20, y + 60, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffcb3a";
  ctx.beginPath(); ctx.arc(x + 20, y + 62, 3, 0, Math.PI * 2); ctx.fill();

  // outline
  ctx.strokeStyle = "rgba(80,40,10,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 80);
  ctx.lineTo(x + 36, y + 80);
  ctx.lineTo(x + 40, y + 40);
  ctx.lineTo(x + 20, y + 4);
  ctx.lineTo(x, y + 40);
  ctx.closePath();
  ctx.stroke();
}

export function drawBee(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  vx: number, vy: number, onGround: boolean, t: number, blink: boolean,
) {
  if (blink) ctx.globalAlpha = 0.45;

  const facing = vx >= 0 ? 1 : -1;
  // squash & stretch
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

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath(); ctx.ellipse(0, h / 2 + 4, 14, 3, 0, 0, Math.PI * 2); ctx.fill();

  // wings (behind body)
  const flap = Math.sin(t / 2) * (onGround ? 0.4 : 1);
  ctx.fillStyle = "rgba(220,240,255,0.78)";
  ctx.strokeStyle = "rgba(120,170,220,0.6)";
  ctx.lineWidth = 1;
  // back wing
  ctx.save();
  ctx.translate(-2, -10);
  ctx.rotate(-0.4 + flap * 0.5);
  ctx.beginPath(); ctx.ellipse(0, 0, 11, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  // front wing
  ctx.save();
  ctx.translate(4, -10);
  ctx.rotate(0.4 - flap * 0.5);
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();

  // body gradient
  const g = ctx.createRadialGradient(-3, -3, 2, 0, 0, 18);
  g.addColorStop(0, "#fff0a0");
  g.addColorStop(1, "#f5b400");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2); ctx.fill();

  // stripes (clipped to body)
  ctx.save();
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = "#2a2018";
  ctx.fillRect(-9, -13, 5, 26);
  ctx.fillRect(2, -13, 5, 26);
  ctx.restore();

  // body outline
  ctx.strokeStyle = "rgba(60,40,10,0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2); ctx.stroke();

  // antennae
  ctx.strokeStyle = "#2a2018";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(6, -10); ctx.quadraticCurveTo(10, -16, 12, -18);
  ctx.moveTo(9, -9); ctx.quadraticCurveTo(14, -14, 16, -16);
  ctx.stroke();
  ctx.fillStyle = "#2a2018";
  ctx.beginPath(); ctx.arc(12, -18, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(16, -16, 1.4, 0, Math.PI * 2); ctx.fill();

  // eye
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(7, -2, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(8, -2, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(8.4, -2.6, 0.7, 0, Math.PI * 2); ctx.fill();

  // smile
  ctx.strokeStyle = "#2a1a0a";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(5, 3, 2.2, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // cheek
  ctx.fillStyle = "rgba(255,120,120,0.55)";
  ctx.beginPath(); ctx.arc(3, 4, 2, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
  ctx.globalAlpha = 1;
}

export function drawSpider(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number, dir: number) {
  const cx = x + w / 2, cy = y + h / 2;
  const legPhase = Math.sin(t / 4);
  // legs
  ctx.strokeStyle = "#2a0e3a";
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
  // body
  const g = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 16);
  g.addColorStop(0, "#8a4ca0");
  g.addColorStop(1, "#3a1a4a");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
  // eyes
  const ex = dir > 0 ? 2 : -2;
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(cx - 5 + ex, cy - 4, 3, 0, Math.PI * 2);
  ctx.arc(cx + 5 + ex, cy - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#222";
  ctx.beginPath(); ctx.arc(cx - 5 + ex + 0.6 * dir, cy - 4, 1.4, 0, Math.PI * 2);
  ctx.arc(cx + 5 + ex + 0.6 * dir, cy - 4, 1.4, 0, Math.PI * 2); ctx.fill();
  // fangs
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.moveTo(cx - 2, cy + 6); ctx.lineTo(cx - 1, cy + 10); ctx.lineTo(cx, cy + 6); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 0, cy + 6); ctx.lineTo(cx + 1, cy + 10); ctx.lineTo(cx + 2, cy + 6); ctx.fill();
}

export function drawFly(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number) {
  const cx = x + w / 2, cy = y + h / 2;
  // wings
  ctx.fillStyle = "rgba(180,220,255,0.7)";
  const wf = Math.sin(t) * 0.4;
  ctx.save(); ctx.translate(cx - 4, cy - 8); ctx.rotate(-0.4 + wf);
  ctx.beginPath(); ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(cx + 4, cy - 8); ctx.rotate(0.4 - wf);
  ctx.beginPath(); ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  // body
  ctx.fillStyle = "#2a2a2a";
  ctx.beginPath(); ctx.ellipse(cx, cy, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#555";
  ctx.beginPath(); ctx.ellipse(cx, cy - 4, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
  // big red eyes
  ctx.fillStyle = "#ff3a3a";
  ctx.beginPath(); ctx.arc(cx - 4, cy - 3, 2.8, 0, Math.PI * 2);
  ctx.arc(cx + 4, cy - 3, 2.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(cx - 4.5, cy - 3.5, 0.8, 0, Math.PI * 2);
  ctx.arc(cx + 3.5, cy - 3.5, 0.8, 0, Math.PI * 2); ctx.fill();
}
