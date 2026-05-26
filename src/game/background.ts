// Procedural parallax background — themed per world.
import { getTheme, type WorldTheme } from "./themes";

function rand(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, theme: WorldTheme, t: number) {
  const p = getTheme(theme);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, p.skyTop);
  g.addColorStop(1, p.skyBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // background stars / glints (cave, sea, nebula, void)
  if (["crystal_cave", "starry_sea", "nebula_sky", "cosmic_void"].includes(theme)) {
    const r = rand(99);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < 60; i++) {
      const x = r() * w;
      const y = r() * h * 0.7;
      const s = r() * 1.4 + 0.3;
      const tw = 0.5 + 0.5 * Math.sin(t / 20 + i);
      ctx.globalAlpha = 0.4 + tw * 0.6;
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawLight(ctx, w, h, p.lightStyle, p.light, t);
}

function drawLight(ctx: CanvasRenderingContext2D, w: number, h: number, style: string, color: string, t: number) {
  const sx = w - 110, sy = 90;
  if (style === "void") return; // void: no central light source
  if (style === "aurora") {
    // ribbon waves across top
    for (let layer = 0; layer < 3; layer++) {
      const g = ctx.createLinearGradient(0, 30 + layer * 25, 0, 90 + layer * 25);
      g.addColorStop(0, layer === 0 ? "rgba(184,137,255,0.55)" : layer === 1 ? "rgba(122,208,255,0.5)" : "rgba(255,176,255,0.4)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 50 + layer * 25);
      for (let x = 0; x <= w; x += 20) {
        const y = 50 + layer * 25 + Math.sin((x + t * 0.6) / 80 + layer) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0); ctx.lineTo(0, 0); ctx.closePath();
      ctx.fill();
    }
    return;
  }
  if (style === "comet") {
    // streaking comet
    const cx = ((t * 1.2) % (w + 300)) - 150;
    const cy = 70 + Math.sin(t / 40) * 12;
    const g = ctx.createLinearGradient(cx - 120, cy, cx, cy);
    g.addColorStop(0, "rgba(255,200,100,0)");
    g.addColorStop(1, "rgba(255,220,140,0.9)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - 120, cy - 3, 120, 6);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    // sun glow
    const grad = ctx.createRadialGradient(sx, sy, 8, sx, sy, 130);
    grad.addColorStop(0, "rgba(255,180,80,0.7)");
    grad.addColorStop(1, "rgba(255,180,80,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(sx, sy, 130, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (style === "fog") {
    // diffuse misty sun
    const grad = ctx.createRadialGradient(sx, sy + 30, 20, sx, sy + 30, 180);
    grad.addColorStop(0, "rgba(220,225,235,0.7)");
    grad.addColorStop(1, "rgba(220,225,235,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(sx, sy + 30, 180, 0, Math.PI * 2); ctx.fill();
    return;
  }
  // sun / moon / paleSun / crystal — generic disc with glow
  const isCrescent = style === "moon";
  const radius = style === "paleSun" ? 22 : 28;
  const grad = ctx.createRadialGradient(sx, sy, 8, sx, sy, 100);
  grad.addColorStop(0, hexA(color, 0.85));
  grad.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(sx, sy, 100, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(sx, sy, radius, 0, Math.PI * 2); ctx.fill();
  if (isCrescent) {
    ctx.fillStyle = "rgba(10,10,42,1)";
    ctx.beginPath(); ctx.arc(sx + 8, sy - 2, radius - 2, 0, Math.PI * 2); ctx.fill();
  }
  if (style === "crystal") {
    // diamond shape over the disc
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.moveTo(sx, sy - 12); ctx.lineTo(sx + 8, sy); ctx.lineTo(sx, sy + 12); ctx.lineTo(sx - 8, sy);
    ctx.closePath(); ctx.fill();
  }
}

function hexA(hex: string, a: number): string {
  // convert #rrggbb to rgba(...)
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function drawFar(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number, theme: WorldTheme) {
  const p = getTheme(theme);
  const ox = -cameraX * 0.2;
  const baseY = h - 140;

  switch (p.farStyle) {
    case "stalactites": {
      // hanging stalactites from top + glowing ground stalagmites at base
      ctx.fillStyle = p.farBack;
      for (let i = -1; i < 18; i++) {
        const r = rand(i * 11 + 5);
        const x = i * 90 + ox * 0.7 + r() * 30;
        const w2 = 30 + r() * 30;
        const hh = 80 + r() * 60;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + w2 / 2, hh); ctx.lineTo(x + w2, 0);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = p.farFront;
      for (let i = -1; i < 16; i++) {
        const r = rand(i * 17 + 3);
        const x = i * 110 + ox + r() * 40;
        const w2 = 40 + r() * 30;
        const hh = 60 + r() * 100;
        ctx.beginPath();
        ctx.moveTo(x, h); ctx.lineTo(x + w2 / 2, h - hh); ctx.lineTo(x + w2, h);
        ctx.closePath(); ctx.fill();
      }
      return;
    }
    case "waves": {
      // distant island + horizontal wave bands
      ctx.fillStyle = p.farBack;
      for (let band = 0; band < 4; band++) {
        const by = baseY + band * 18;
        ctx.beginPath();
        ctx.moveTo(0, by);
        for (let x = 0; x <= w; x += 16) {
          ctx.lineTo(x, by + Math.sin((x + ox + band * 30) / 24) * 4);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.globalAlpha = 0.35;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // distant islands
      ctx.fillStyle = p.farFront;
      for (let i = -1; i < 10; i++) {
        const r = rand(i * 23 + 1);
        const x = i * 280 + ox + r() * 40;
        ctx.beginPath(); ctx.arc(x, baseY + 10, 70 + r() * 30, Math.PI, 0); ctx.fill();
      }
      return;
    }
    case "floatingIslands": {
      // chunks floating with roots
      for (let i = -1; i < 10; i++) {
        const r = rand(i * 19 + 9);
        const x = i * 220 + ox + r() * 60;
        const y = 140 + r() * 200;
        const w2 = 90 + r() * 50;
        ctx.fillStyle = p.farFront;
        ctx.beginPath(); ctx.ellipse(x, y, w2 / 2, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = p.farBack;
        ctx.beginPath();
        ctx.moveTo(x - w2 / 2, y);
        ctx.lineTo(x, y + 40 + r() * 30);
        ctx.lineTo(x + w2 / 2, y);
        ctx.closePath(); ctx.fill();
      }
      return;
    }
    case "snowHills": {
      ctx.fillStyle = p.farBack;
      for (let i = -1; i < 12; i++) {
        const r = rand(i * 13 + 7);
        const x = i * 220 + ox + r() * 40;
        ctx.beginPath(); ctx.arc(x, baseY + 30, 110 + r() * 50, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = p.farFront;
      for (let i = -1; i < 14; i++) {
        const r = rand(i * 19 + 3);
        const x = i * 180 + ox * 0.7 + r() * 30;
        ctx.beginPath(); ctx.arc(x, baseY + 60, 90 + r() * 40, Math.PI, 0); ctx.fill();
      }
      // distant pines
      ctx.fillStyle = "rgba(40,70,55,0.7)";
      for (let i = -1; i < 30; i++) {
        const r = rand(i * 29 + 11);
        const x = i * 70 + ox * 0.9 + r() * 20;
        const y = baseY + 50 - r() * 20;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 22); ctx.lineTo(x + 12, y);
        ctx.closePath(); ctx.fill();
      }
      return;
    }
    case "ruins": {
      ctx.fillStyle = p.farBack;
      for (let i = -1; i < 12; i++) {
        const r = rand(i * 17 + 5);
        const x = i * 160 + ox + r() * 50;
        const w2 = 24 + r() * 22;
        const hh = 90 + r() * 110;
        ctx.fillRect(x, baseY + 70 - hh, w2, hh);
        // cracked top
        ctx.fillRect(x - 6, baseY + 70 - hh, w2 + 12, 6);
      }
      ctx.fillStyle = p.farFront;
      for (let i = -1; i < 10; i++) {
        const r = rand(i * 31 + 7);
        const x = i * 200 + ox * 1.1 + r() * 40;
        const w2 = 36 + r() * 30;
        const hh = 60 + r() * 70;
        ctx.fillRect(x, baseY + 80 - hh, w2, hh);
      }
      return;
    }
    case "magmaMtns": {
      ctx.fillStyle = p.farBack;
      for (let i = -1; i < 10; i++) {
        const r = rand(i * 19 + 5);
        const x = i * 220 + ox + r() * 40;
        ctx.beginPath();
        ctx.moveTo(x, baseY + 80);
        ctx.lineTo(x + 90 + r() * 30, baseY - 60 - r() * 40);
        ctx.lineTo(x + 200 + r() * 40, baseY + 80);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = p.farFront;
      for (let i = -1; i < 8; i++) {
        const r = rand(i * 23 + 9);
        const x = i * 280 + ox * 1.05 + r() * 40;
        ctx.beginPath();
        ctx.moveTo(x, baseY + 90);
        ctx.lineTo(x + 110, baseY - 40 - r() * 40);
        ctx.lineTo(x + 230, baseY + 90);
        ctx.closePath(); ctx.fill();
      }
      // lava cap glow
      ctx.fillStyle = "rgba(255,200,80,0.7)";
      for (let i = -1; i < 8; i++) {
        const r = rand(i * 23 + 9);
        const x = i * 280 + ox * 1.05 + r() * 40 + 110;
        const y = baseY - 40 - r() * 40;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "galaxy": {
      // distant spiral galaxies
      for (let i = -1; i < 6; i++) {
        const r = rand(i * 41 + 1);
        const x = i * 320 + ox + r() * 80;
        const y = 110 + r() * 200;
        const size = 40 + r() * 30;
        const grad = ctx.createRadialGradient(x, y, 4, x, y, size);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(0.4, "rgba(184,137,255,0.6)");
        grad.addColorStop(1, "rgba(184,137,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(x, y, size, size * 0.45, r() * Math.PI, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "hills":
    default: {
      ctx.fillStyle = p.farFront;
      for (let i = -1; i < 12; i++) {
        const r = rand(i * 13 + 7);
        const x = i * 220 + ox + r() * 40;
        const radius = 110 + r() * 50;
        ctx.beginPath(); ctx.arc(x, baseY + 30, radius, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = p.farBack;
      for (let i = -1; i < 14; i++) {
        const r = rand(i * 19 + 3);
        const x = i * 180 + ox * 0.7 + r() * 30;
        ctx.beginPath(); ctx.arc(x, baseY + 60, 90 + r() * 40, Math.PI, 0); ctx.fill();
      }
      return;
    }
  }
}

export function drawMid(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number, theme: WorldTheme, t: number) {
  const p = getTheme(theme);
  const ox = -cameraX * 0.5;
  const baseY = h - 90;
  void w;

  switch (p.midStyle) {
    case "crystals": {
      for (let i = -1; i < 22; i++) {
        const r = rand(i * 29 + 11);
        const x = i * 130 + ox + r() * 60;
        const y = baseY - r() * 30;
        const s = 0.7 + r() * 0.5;
        const col = r() > 0.5 ? p.midAccent : p.midAccent2;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 10 * s, y - 30 * s); ctx.lineTo(x + 20 * s, y);
        ctx.closePath(); ctx.fill();
        // glow
        ctx.fillStyle = hexA(col, 0.4);
        ctx.beginPath(); ctx.arc(x + 10 * s, y - 18 * s, 14 * s, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "jellyfish": {
      for (let i = -1; i < 14; i++) {
        const r = rand(i * 37 + 13);
        const x = i * 180 + ox + r() * 60;
        const y = 200 + r() * 180 + Math.sin(t / 40 + i) * 8;
        const s = 0.7 + r() * 0.6;
        const col = r() > 0.5 ? p.midAccent : p.midAccent2;
        ctx.fillStyle = hexA(col, 0.6);
        ctx.beginPath(); ctx.ellipse(x, y, 22 * s, 14 * s, 0, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = hexA(col, 0.5);
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 5; k++) {
          const tx = x - 14 * s + k * 7 * s;
          ctx.beginPath();
          ctx.moveTo(tx, y);
          ctx.quadraticCurveTo(tx + Math.sin(t / 18 + k) * 4, y + 18 * s, tx, y + 30 * s);
          ctx.stroke();
        }
      }
      return;
    }
    case "nebula": {
      for (let i = -1; i < 10; i++) {
        const r = rand(i * 41 + 19);
        const x = i * 240 + ox + r() * 100;
        const y = 160 + r() * 220;
        const s = 60 + r() * 60;
        const col = r() > 0.5 ? p.midAccent : p.midAccent2;
        const grad = ctx.createRadialGradient(x, y, 6, x, y, s);
        grad.addColorStop(0, hexA(col, 0.75));
        grad.addColorStop(1, hexA(col, 0));
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "pines": {
      for (let i = -1; i < 22; i++) {
        const r = rand(i * 29 + 11);
        const x = i * 110 + ox + r() * 40;
        const y = baseY + r() * 14;
        const hh = 60 + r() * 30;
        // trunk
        ctx.fillStyle = "#4a2a1a";
        ctx.fillRect(x - 3, y - 10, 6, 14);
        // pine triangles stacked
        ctx.fillStyle = p.midAccent;
        for (let k = 0; k < 3; k++) {
          const yy = y - 10 - k * (hh / 3);
          const ww = 22 - k * 4;
          ctx.beginPath();
          ctx.moveTo(x - ww, yy); ctx.lineTo(x, yy - hh / 3 - 4); ctx.lineTo(x + ww, yy);
          ctx.closePath(); ctx.fill();
        }
        // snow tips
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x, y - 10 - hh + 4, 4, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "pillars": {
      for (let i = -1; i < 14; i++) {
        const r = rand(i * 37 + 5);
        const x = i * 180 + ox + r() * 60;
        const hh = 120 + r() * 80;
        const y = baseY - hh;
        ctx.fillStyle = p.midAccent;
        ctx.fillRect(x, y, 22, hh);
        ctx.fillStyle = p.midAccent2;
        ctx.fillRect(x - 4, y, 30, 8); // capital
        ctx.fillRect(x - 4, y + hh - 10, 30, 8); // base
        // shadow grooves
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(x + 6, y + 8, 2, hh - 18);
        ctx.fillRect(x + 14, y + 8, 2, hh - 18);
      }
      return;
    }
    case "lava": {
      // bubbling lava puddles + ember columns
      for (let i = -1; i < 14; i++) {
        const r = rand(i * 23 + 11);
        const x = i * 180 + ox + r() * 60;
        const y = baseY + 14;
        const ww = 60 + r() * 40;
        ctx.fillStyle = p.midAccent;
        ctx.beginPath(); ctx.ellipse(x, y, ww / 2, 8, 0, 0, Math.PI * 2); ctx.fill();
        // bubble
        const bx = x + Math.sin(t / 14 + i) * 10;
        const by = y - 8 - Math.abs(Math.sin(t / 18 + i)) * 6;
        ctx.fillStyle = p.midAccent2;
        ctx.beginPath(); ctx.arc(bx, by, 4 + (i % 3), 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "planets": {
      for (let i = -1; i < 8; i++) {
        const r = rand(i * 53 + 7);
        const x = i * 280 + ox + r() * 80;
        const y = 200 + r() * 200;
        const radius = 26 + r() * 26;
        const col = r() > 0.5 ? p.midAccent : p.midAccent2;
        const grad = ctx.createRadialGradient(x - radius / 3, y - radius / 3, 2, x, y, radius);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.4, col);
        grad.addColorStop(1, "rgba(0,0,0,0.6)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
        // ring
        if (r() > 0.5) {
          ctx.strokeStyle = hexA(col, 0.7);
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(x, y, radius * 1.6, radius * 0.4, 0.4, 0, Math.PI * 2); ctx.stroke();
        }
      }
      return;
    }
    case "flowers":
    default: {
      for (let i = -1; i < 18; i++) {
        const r = rand(i * 29 + 11);
        const x = i * 160 + ox + r() * 60;
        const y = baseY - r() * 20;
        const s = 0.7 + r() * 0.5;
        drawBigFlower(ctx, x, y, s, r() > 0.5 ? p.midAccent : p.midAccent2);
      }
      return;
    }
  }
}

function drawBigFlower(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = "#4a8a4c";
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.moveTo(x, y + 40 * s);
  ctx.quadraticCurveTo(x + 6 * s, y + 20 * s, x, y);
  ctx.stroke();
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

export function drawClouds(ctx: CanvasRenderingContext2D, cameraX: number, w: number, t: number, theme: WorldTheme) {
  const p = getTheme(theme);
  const ox = -cameraX * 0.15 + (t * 0.3);
  ctx.fillStyle = p.cloudColor || "rgba(255,255,255,0.85)";
  const count = theme === "cosmic_void" || theme === "starry_sea" ? 4 : 10;
  for (let i = 0; i < count; i++) {
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

export function drawForeground(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number, theme: WorldTheme, t: number) {
  const p = getTheme(theme);
  const ox = -cameraX * 0.9;
  void w;

  switch (p.foregroundStyle) {
    case "snow": {
      ctx.fillStyle = p.foreground;
      for (let i = 0; i < 60; i++) {
        const r = rand(i * 17 + 3);
        const x = ((i * 30 + t * 0.6 + r() * 20) % (1200)) - 100;
        const y = ((i * 60 + t * 0.8) % h);
        const s = 1 + r() * 2;
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "bubble": {
      ctx.fillStyle = p.foreground;
      for (let i = 0; i < 30; i++) {
        const r = rand(i * 13 + 9);
        const x = ((i * 50 + ox + r() * 30) % 1200);
        const y = ((h - (t * 0.4 + i * 60) % h) + h) % h;
        const s = 2 + r() * 4;
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath(); ctx.arc(x - s / 3, y - s / 3, s / 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = p.foreground;
      }
      return;
    }
    case "dust": {
      ctx.fillStyle = p.foreground;
      for (let i = 0; i < 40; i++) {
        const r = rand(i * 7 + 1);
        const x = ((i * 40 + ox * 0.5 + t * 0.2) % 1200);
        const y = h - 20 - r() * 80;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      return;
    }
    case "ember": {
      for (let i = 0; i < 28; i++) {
        const r = rand(i * 11 + 3);
        const x = ((i * 50 + ox + r() * 20) % 1200);
        const y = ((h - (t * 0.9 + i * 50) % (h + 100)) + h) % h;
        const s = 1.5 + r() * 2;
        ctx.fillStyle = i % 2 ? "#ffcb3a" : "#ff7a3a";
        ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      return;
    }
    case "stardust": {
      for (let i = 0; i < 30; i++) {
        const r = rand(i * 19 + 5);
        const x = ((i * 60 + ox + r() * 30) % 1200);
        const y = ((i * 47 + t * 0.4) % h);
        const s = 0.6 + r() * 1.6;
        ctx.fillStyle = i % 2 ? "#ffffff" : "#b889ff";
        ctx.globalAlpha = 0.4 + 0.6 * Math.sin(t / 20 + i);
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      return;
    }
    case "crystal": {
      ctx.fillStyle = p.foreground;
      for (let i = -1; i < 30; i++) {
        const r = rand(i * 13 + 1);
        const x = i * 50 + ox + r() * 20;
        const y = h - 8 - r() * 8;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 3, y - 14); ctx.lineTo(x + 6, y);
        ctx.closePath(); ctx.fill();
      }
      return;
    }
    case "cloud": {
      ctx.fillStyle = p.foreground;
      for (let i = 0; i < 8; i++) {
        const r = rand(i * 53 + 1);
        const x = ((i * 200 + ox) % 1400) - 200;
        const y = h - 30 - r() * 20;
        ctx.beginPath();
        ctx.ellipse(x, y, 70, 16, 0, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }
    case "grass":
    default: {
      ctx.fillStyle = p.foreground;
      for (let i = -1; i < 60; i++) {
        const r = rand(i * 7 + 5);
        const x = i * 60 + ox + r() * 30;
        const y = h - 14 - r() * 6;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 4, y - 12); ctx.lineTo(x + 8, y);
        ctx.closePath(); ctx.fill();
      }
      return;
    }
  }
}
