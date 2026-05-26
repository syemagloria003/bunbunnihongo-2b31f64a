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
 * Build a sequence of `gateCount` words.
 *
 * When `fixedLen === 1` (used by kanji levels), each gate is a single
 * entry from the pool and `romaji` carries that entry's answer (the
 * Indonesian meaning for kanji). Pool coverage is guaranteed: the first
 * `pool.length` gates are a shuffled permutation; any extra gates are
 * filled with random picks.
 *
 * Otherwise the original kana behaviour applies: 2-4 entries per word,
 * coverage of the pool across all gates, and chōonpu (ー) placement fixes.
 */
export function generateWords(pool: Kana[], gateCount: number, fixedLen?: number): KanaWord[] {
  if (gateCount <= 0 || pool.length === 0) return [];

  if (fixedLen === 1) {
    const seq: Kana[] = shuffle(pool);
    while (seq.length < gateCount) {
      seq.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return seq.slice(0, gateCount).map((k) => ({
      chars: k.char,
      romaji: k.romaji,
      entries: [k],
    }));
  }

  const maxLen = 4;
  const minLen = 2;

  // Choose a word length that covers the pool across the gates.
  const needed = Math.max(minLen, Math.min(maxLen, Math.ceil(pool.length / gateCount)));

  const target = Math.max(pool.length, gateCount * needed);
  const seq: Kana[] = shuffle(pool);
  while (seq.length < target) {
    seq.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  for (let i = 0; i < seq.length; i++) {
    if (Math.random() < 0.3) {
      const j = Math.floor(Math.random() * seq.length);
      [seq[i], seq[j]] = [seq[j], seq[i]];
    }
  }

  const perWord = Math.ceil(seq.length / gateCount);
  const words: KanaWord[] = [];
  for (let i = 0; i < gateCount; i++) {
    let chunk = seq.slice(i * perWord, (i + 1) * perWord);
    if (chunk.length < minLen) {
      while (chunk.length < minLen) chunk.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    if (chunk.length > maxLen) chunk = chunk.slice(0, maxLen);

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

function lastVowel(rom: string): string {
  for (let i = rom.length - 1; i >= 0; i--) {
    const c = rom[i];
    if ("aiueo".includes(c)) return c;
  }
  return "";
}

function resolveRomaji(k: Kana, chunk: Kana[], idx: number): string {
  if (!isChoon(k)) return k.romaji;
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
      let j = -1;
      for (let k = i + 1; k < out.length; k++) {
        if (!isChoon(out[k]) && lastVowel(out[k].romaji) !== "") { j = k; break; }
      }
      if (j > -1) {
        [out[i], out[j]] = [out[j], out[i]];
      } else if (nonChoonPool.length > 0) {
        out[i] = nonChoonPool[Math.floor(Math.random() * nonChoonPool.length)];
      }
    }
  }
  return out;
}

/**
 * Build 4 multiple-choice options for a word.
 *
 * For single-entry words (kanji), pick 3 distinct distractors from
 * `distractorPool`. For multi-entry kana words, swap one entry's romaji
 * with another kana from the pool to keep distractors plausible.
 */
export function makeOptionsForWord(word: KanaWord, distractorPool: Kana[]): string[] {
  const opts = new Set<string>([word.romaji]);

  if (word.entries.length === 1) {
    let tries = 0;
    while (opts.size < 4 && tries++ < 200) {
      const cand = distractorPool[Math.floor(Math.random() * distractorPool.length)];
      if (cand.romaji && cand.romaji !== word.romaji) opts.add(cand.romaji);
    }
    while (opts.size < 4) opts.add(word.romaji + " ?" + opts.size);
    return shuffle(Array.from(opts));
  }

  const swapPool = distractorPool.filter((k) => k.group !== "choon");
  let tries = 0;
  while (opts.size < 4 && tries++ < 80) {
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
  while (opts.size < 4) {
    const r = swapPool[Math.floor(Math.random() * swapPool.length)].romaji
      + swapPool[Math.floor(Math.random() * swapPool.length)].romaji;
    if (r !== word.romaji) opts.add(r);
  }
  return shuffle(Array.from(opts));
}
