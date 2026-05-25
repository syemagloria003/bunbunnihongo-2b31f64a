export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
  gravity: number;
  shape: "circle" | "square" | "star";
}

export class Particles {
  list: Particle[] = [];

  spawn(opts: Partial<Particle> & { x: number; y: number }) {
    this.list.push({
      vx: 0, vy: 0, life: 30, maxLife: 30,
      size: 3, color: "#ffcb3a", gravity: 0.15, shape: "circle",
      ...opts,
    } as Particle);
  }

  burst(x: number, y: number, count: number, color: string, opts: Partial<Particle> = {}) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.5 + Math.random() * 3;
      this.spawn({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 1,
        life: 28 + Math.random() * 18,
        maxLife: 40,
        size: 2 + Math.random() * 3,
        color,
        gravity: 0.18,
        shape: "circle",
        ...opts,
      });
    }
  }

  confetti(x: number, y: number, count: number) {
    const colors = ["#ffcb3a", "#ff7a3a", "#7bc46c", "#5ec1ff", "#e94e87"];
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const s = 4 + Math.random() * 5;
      this.spawn({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 70 + Math.random() * 40,
        maxLife: 110,
        size: 3 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.22,
        shape: Math.random() > 0.5 ? "square" : "circle",
      });
    }
  }

  update() {
    for (const p of this.list) {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    }
    this.list = this.list.filter(p => p.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.list) {
      const a = Math.max(0, Math.min(1, p.life / p.maxLife));
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.shape === "square") {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
}
