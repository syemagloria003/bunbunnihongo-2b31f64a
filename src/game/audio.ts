// Tiny WebAudio SFX synthesizer — no external assets, runs in browser only.

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function unlockAudio() { getCtx(); }
export function setMuted(m: boolean) { muted = m; }
export function isMuted() { return muted; }

function beep(freq: number, dur: number, type: OscillatorType = "square", vol = 0.12, sweepTo?: number) {
  if (muted) return;
  const c = getCtx(); if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (sweepTo !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), c.currentTime + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

function chord(freqs: number[], dur: number, type: OscillatorType = "triangle", vol = 0.1) {
  freqs.forEach((f) => beep(f, dur, type, vol));
}

function seq(notes: Array<[number, number]>, type: OscillatorType = "triangle", vol = 0.14) {
  let t = 0;
  for (const [f, d] of notes) {
    setTimeout(() => beep(f, d, type, vol), t * 1000);
    t += d * 0.85;
  }
}

export const sfx = {
  jump:   () => beep(520, 0.12, "square", 0.10, 760),
  flap:   () => beep(720, 0.07, "sine",   0.08, 980),
  coin:   () => seq([[988, 0.06], [1319, 0.12]], "square", 0.12),
  hit:    () => beep(180, 0.28, "sawtooth", 0.18, 80),
  stomp:  () => beep(320, 0.10, "triangle", 0.16, 120),
  correct:() => seq([[659, 0.09], [988, 0.18]], "triangle", 0.16),
  wrong:  () => seq([[220, 0.13], [165, 0.22]], "sawtooth", 0.14),
  win:    () => seq([[523, 0.14], [659, 0.14], [784, 0.14], [1047, 0.28]], "triangle", 0.16),
  lose:   () => seq([[440, 0.18], [330, 0.18], [220, 0.30]], "sawtooth", 0.16),
  gate:   () => chord([440, 660], 0.18, "triangle", 0.10),
};
