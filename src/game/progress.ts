const KEY = "beegana_progress_v2";

export interface Progress {
  unlocked: string[];
  bestStars: Record<string, number>;
  bestScore: Record<string, number>;
  bestCoins: Record<string, number>;
  crystal: boolean; // earned after clearing final hiragana level — unlocks katakana arc
  meteor: boolean;  // earned after clearing final katakana level — unlocks kanji arc
}

const DEFAULT: Progress = {
  unlocked: ["1"],
  bestStars: {},
  bestScore: {},
  bestCoins: {},
  crystal: false,
  meteor: false,
};

export function loadProgress(): Progress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p: Progress = { ...DEFAULT, ...JSON.parse(raw) };
    // Migration: if crystal earned, ensure k1 is unlocked
    if (p.crystal && !p.unlocked.includes("k1")) p.unlocked = [...p.unlocked, "k1"];
    if (p.meteor && !p.unlocked.includes("kn1")) p.unlocked = [...p.unlocked, "kn1"];
    return p;
  } catch { return DEFAULT; }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function computeStars(correct: number, total: number): number {
  if (total <= 0) return 0;
  // Linear: total/5 jawaban benar = 1 bintang. Max 5.
  const perStar = total / 5;
  return Math.max(0, Math.min(5, Math.floor(correct / perStar)));
}


export function completeLevel(
  id: string,
  score: number,
  coins: number,
  stars: number,
  nextId?: string,
  isFinalHiragana?: boolean,
  isFinalKatakana?: boolean,
) {
  const p = loadProgress();
  p.bestScore[id] = Math.max(p.bestScore[id] ?? 0, score);
  p.bestCoins[id] = Math.max(p.bestCoins[id] ?? 0, coins);
  p.bestStars[id] = Math.max(p.bestStars[id] ?? 0, stars);
  if (nextId && stars >= 3 && !p.unlocked.includes(nextId)) p.unlocked.push(nextId);
  if (isFinalHiragana && stars >= 3) {
    p.crystal = true;
    if (!p.unlocked.includes("k1")) p.unlocked.push("k1");
  }
  if (isFinalKatakana && stars >= 3) {
    p.meteor = true;
    if (!p.unlocked.includes("kn1")) p.unlocked.push("kn1");
  }
  saveProgress(p);
  return p;
}
