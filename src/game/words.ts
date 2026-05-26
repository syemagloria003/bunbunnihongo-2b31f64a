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

    // Fix chōonpu (ー) positions: must follow a vowel-bearing kana, never at start
    // or consecutive. If invalid, swap with the next non-choon entry.
    chunk = fixChoon(chunk, pool);

    words.push({
      chars: chunk.map((k) => k.char).join(""),
      romaji: chunk.map((k, idx) => resolveRomaji(k, chunk, idx)).join(""),
      entries: chunk,
    });
  }
  return words;
}

function isChoon(k: Kana): boolean {
  return k.group === "choon";
}

/** Return last vowel character (a/i/u/e/o) of a romaji string, or "" if none. */
function lastVowel(rom: string): string {
  for (let i = rom.length - 1; i >= 0; i--) {
    const c = rom[i];
    if ("aiueo".includes(c)) return c;
  }
  return "";
}

function resolveRomaji(k: Kana, chunk: Kana[], idx: number): string {
  if (!isChoon(k)) return k.romaji;
  // chōon: repeat the last vowel of the previous entry's resolved romaji
  if (idx === 0) return "";
  const prev = chunk[idx - 1];
  return lastVowel(prev.romaji);
}

function fixChoon(chunk: Kana[], pool: Kana[]): Kana[] {
  const out = chunk.slice();
  const nonChoonPool = pool.filter((p) => !isChoon(p));
  for (let i = 0; i < out.length; i++) {
    if (!isChoon(out[i])) continue;
    const badStart = i === 0;
    const badAfterChoon = i > 0 && isChoon(out[i - 1]);
    const prevNoVowel = i > 0 && !isChoon(out[i - 1]) && lastVowel(out[i - 1].romaji) === "";
    if (badStart || badAfterChoon || prevNoVowel) {
      // find a later non-choon to swap with
      let j = -1;
      for (let k = i + 1; k < out.length; k++) {
        if (!isChoon(out[k]) && lastVowel(out[k].romaji) !== "") { j = k; break; }
      }
      if (j > -1) {
        [out[i], out[j]] = [out[j], out[i]];
      } else if (nonChoonPool.length > 0) {
        // no swap target; replace with a random non-choon
        out[i] = nonChoonPool[Math.floor(Math.random() * nonChoonPool.length)];
      }
    }
  }
  return out;
}

/**
 * Build 4 multiple-choice options for a word. The correct romaji is included;
 * distractors are produced by swapping ONE entry's romaji with another kana from `allKana`.
 */
export function makeOptionsForWord(word: KanaWord, allKana: Kana[]): string[] {
  const opts = new Set<string>([word.romaji]);
  const swapPool = allKana.filter((k) => k.group !== "choon");
  let tries = 0;
  while (opts.size < 4 && tries++ < 80) {
    // pick a non-choon index to mutate
    const swappable = word.entries
      .map((e, i) => (isChoon(e) ? -1 : i))
      .filter((i) => i >= 0);
    if (swappable.length === 0) break;
    const idx = swappable[Math.floor(Math.random() * swappable.length)];
    const swap = swapPool[Math.floor(Math.random() * swapPool.length)];
    if (swap.romaji === word.entries[idx].romaji) continue;
    const newEntries = word.entries.map((e, i) => (i === idx ? swap : e));
    const newRom = newEntries
      .map((e, i) => (isChoon(e) ? lastVowel(newEntries[i - 1]?.romaji ?? "") : e.romaji))
      .join("");
    if (newRom !== word.romaji && newRom.length > 0) opts.add(newRom);
  }
  // pad with random if still short
  while (opts.size < 4) {
    const r = swapPool[Math.floor(Math.random() * swapPool.length)].romaji
      + swapPool[Math.floor(Math.random() * swapPool.length)].romaji;
    if (r !== word.romaji) opts.add(r);
  }
  return shuffle(Array.from(opts));
}
