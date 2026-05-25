// Procedural parallax background — 3 layers + clouds.
// Deterministic via simple PRNG so hills/flowers don't flicker.

function rand(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, level: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  if (level >= 3) {
    g.addColorStop(0, "#ffb27a");
    g.addColorStop(1, "#ffe6a8");
  } else {
    g.addColorStop(0, "#b8e3ff");
    g.addColorStop(0.6, "#ffe2a8");
    g.addColorStop(1, "#ffd07a");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // sun
  const sx = w - 110, sy = 90;
  const grad = ctx.createRadialGradient(sx, sy, 8, sx, sy, 90);
  grad.addColorStop(0, "rgba(255,240,180,0.95)");
  grad.addColorStop(1, "rgba(255,240,180,0)");
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(sx, sy, 90, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff6c2";
  ctx.beginPath(); ctx.arc(sx, sy, 28, 0, Math.PI * 2); ctx.fill();
}

export function drawFar(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number) {
  const ox = -cameraX * 0.2;
  const baseY = h - 140;
  ctx.fillStyle = "#8fc4a6";
  for (let i = -1; i < 12; i++) {
    const r = rand(i * 13 + 7);
    const x = i * 220 + ox + r() * 40;
    const radius = 110 + r() * 50;
    ctx.beginPath();
    ctx.arc(x, baseY + 30, radius, Math.PI, 0);
    ctx.fill();
  }
  // back layer hills
  ctx.fillStyle = "#a8d4b8";
  for (let i = -1; i < 14; i++) {
    const r = rand(i * 19 + 3);
    const x = i * 180 + ox * 0.7 + r() * 30;
    ctx.beginPath();
    ctx.arc(x, baseY + 60, 90 + r() * 40, Math.PI, 0);
    ctx.fill();
  }
}

export function drawMid(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number) {
  const ox = -cameraX * 0.5;
  const baseY = h - 90;
  // big flowers
  for (let i = -1; i < 18; i++) {
    const r = rand(i * 29 + 11);
    const x = i * 160 + ox + r() * 60;
    const y = baseY - r() * 20;
    const scale = 0.7 + r() * 0.5;
    drawBigFlower(ctx, x, y, scale, r() > 0.5 ? "#ff7aa8" : "#ffc24a");
  }
}

function drawBigFlower(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = "#4a8a4c";
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 40 * s);
  ctx.quadraticCurveTo(x + 6 * s, y + 20 * s, x, y);
  ctx.stroke();
  // petals
  ctx.fillStyle = color;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const px = x + Math.cos(a) * 10 * s;
    const py = y + Math.sin(a) * 10 * s;
    ctx.beginPath(); ctx.ellipse(px, py, 8 * s, 6 * s, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = "#ffe070";
  ctx.beginPath(); ctx.arc(x, y, 6 * s, 0, Math.PI * 2); ctx.fill();
}

export function drawClouds(ctx: CanvasRenderingContext2D, cameraX: number, w: number, t: number) {
  const ox = -cameraX * 0.15 + (t * 0.3);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < 10; i++) {
    const r = rand(i * 41 + 1);
    const x = ((i * 260 + ox) % (w + 400) + w + 400) % (w + 400) - 200;
    const y = 40 + r() * 100;
    const s = 0.6 + r() * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 22 * s, y + 4, 18 * s, 0, Math.PI * 2);
    ctx.arc(x - 20 * s, y + 6, 16 * s, 0, Math.PI * 2);
    ctx.arc(x + 8 * s, y - 8, 16 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawForeground(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number) {
  const ox = -cameraX * 0.9;
  // little grass tufts near bottom
  ctx.fillStyle = "rgba(60, 130, 60, 0.5)";
  for (let i = -1; i < 60; i++) {
    const r = rand(i * 7 + 5);
    const x = i * 60 + ox + r() * 30;
    const y = h - 14 - r() * 6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y - 12);
    ctx.lineTo(x + 8, y);
    ctx.closePath();
    ctx.fill();
  }
}
