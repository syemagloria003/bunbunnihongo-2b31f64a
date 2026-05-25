import type { Kana } from "./kana-data";

export interface KanaWord {
  chars: string;
  romaji: string;
  entries: Kana[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a sequence of `gateCount` words. The union of all entries used
 * across the returned words is guaranteed to cover every kana in `pool`
 * (each at least once), assuming gateCount * maxLen >= pool.length.
 *
 * Word length adapts to fit coverage in the available gates (clamped 2..4).
 */
export function generateWords(pool: Kana[], gateCount: number): KanaWord[] {
  if (gateCount <= 0 || pool.length === 0) return [];
  const maxLen = 4;
  const minLen = 2;

  // Choose a word length that covers the pool across the gates.
  const needed = Math.max(minLen, Math.min(maxLen, Math.ceil(pool.length / gateCount)));

  // Build base sequence: every kana exactly once (shuffled), then pad
  // with random kana from the pool to reach gateCount * needed length.
  const target = Math.max(pool.length, gateCount * needed);
  const seq: Kana[] = shuffle(pool);
  while (seq.length < target) {
    seq.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Light shuffle to avoid all "new" kana clumped at the start, while
  // keeping coverage intact (we don't remove any).
  // Swap pairs randomly a few times.
  for (let i = 0; i < seq.length; i++) {
    if (Math.random() < 0.3) {
      const j = Math.floor(Math.random() * seq.length);
      [seq[i], seq[j]] = [seq[j], seq[i]];
    }
  }

  // Split into roughly equal chunks of size `needed`.
  const perWord = Math.ceil(seq.length / gateCount);
  const words: KanaWord[] = [];
  for (let i = 0; i < gateCount; i++) {
    let chunk = seq.slice(i * perWord, (i + 1) * perWord);
    if (chunk.length < minLen) {
      while (chunk.length < minLen) chunk.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    if (chunk.length > maxLen) chunk = chunk.slice(0, maxLen);
    words.push({
      chars: chunk.map((k) => k.char).join(""),
      romaji: chunk.map((k) => k.romaji).join(""),
      entries: chunk,
    });
  }
  return words;
}

/**
 * Build 4 multiple-choice options for a word. The correct romaji is included;
 * distractors are produced by swapping ONE entry's romaji with another kana from `allKana`.
 */
export function makeOptionsForWord(word: KanaWord, allKana: Kana[]): string[] {
  const opts = new Set<string>([word.romaji]);
  let tries = 0;
  while (opts.size < 4 && tries++ < 80) {
    const idx = Math.floor(Math.random() * word.entries.length);
    const swap = allKana[Math.floor(Math.random() * allKana.length)];
    if (swap.romaji === word.entries[idx].romaji) continue;
    const newRom = word.entries
      .map((e, i) => (i === idx ? swap.romaji : e.romaji))
      .join("");
    if (newRom !== word.romaji) opts.add(newRom);
  }
  // pad with random if still short
  while (opts.size < 4) {
    const r = allKana[Math.floor(Math.random() * allKana.length)].romaji + allKana[Math.floor(Math.random() * allKana.length)].romaji;
    if (r !== word.romaji) opts.add(r);
  }
  return shuffle(Array.from(opts));
}
