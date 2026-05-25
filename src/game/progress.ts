const KEY = "beegana_progress_v1";

export interface Progress {
  unlocked: string[];
  bestScore: Record<string, number>;
  bestCoins: Record<string, number>;
}

const DEFAULT: Progress = {
  unlocked: ["1"],
  bestScore: {},
  bestCoins: {},
};

export function loadProgress(): Progress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { return DEFAULT; }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function completeLevel(id: string, score: number, coins: number, nextId?: string) {
  const p = loadProgress();
  p.bestScore[id] = Math.max(p.bestScore[id] ?? 0, score);
  p.bestCoins[id] = Math.max(p.bestCoins[id] ?? 0, coins);
  if (nextId && !p.unlocked.includes(nextId)) p.unlocked.push(nextId);
  saveProgress(p);
  return p;
}
