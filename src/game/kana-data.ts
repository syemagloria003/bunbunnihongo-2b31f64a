export type KanaType = "hiragana" | "katakana";
export type KanaGroup =
  | "vowel" | "k" | "s" | "t" | "n" | "h" | "m" | "y" | "r" | "w"
  | "g" | "z" | "d" | "b" | "p";

export interface Kana {
  char: string;
  romaji: string;
  type: KanaType;
  group: KanaGroup;
}

export const HIRAGANA: Kana[] = [
  { char: "あ", romaji: "a", type: "hiragana", group: "vowel" },
  { char: "い", romaji: "i", type: "hiragana", group: "vowel" },
  { char: "う", romaji: "u", type: "hiragana", group: "vowel" },
  { char: "え", romaji: "e", type: "hiragana", group: "vowel" },
  { char: "お", romaji: "o", type: "hiragana", group: "vowel" },
  { char: "か", romaji: "ka", type: "hiragana", group: "k" },
  { char: "き", romaji: "ki", type: "hiragana", group: "k" },
  { char: "く", romaji: "ku", type: "hiragana", group: "k" },
  { char: "け", romaji: "ke", type: "hiragana", group: "k" },
  { char: "こ", romaji: "ko", type: "hiragana", group: "k" },
  { char: "さ", romaji: "sa", type: "hiragana", group: "s" },
  { char: "し", romaji: "shi", type: "hiragana", group: "s" },
  { char: "す", romaji: "su", type: "hiragana", group: "s" },
  { char: "せ", romaji: "se", type: "hiragana", group: "s" },
  { char: "そ", romaji: "so", type: "hiragana", group: "s" },
  { char: "た", romaji: "ta", type: "hiragana", group: "t" },
  { char: "ち", romaji: "chi", type: "hiragana", group: "t" },
  { char: "つ", romaji: "tsu", type: "hiragana", group: "t" },
  { char: "て", romaji: "te", type: "hiragana", group: "t" },
  { char: "と", romaji: "to", type: "hiragana", group: "t" },
  { char: "な", romaji: "na", type: "hiragana", group: "n" },
  { char: "に", romaji: "ni", type: "hiragana", group: "n" },
  { char: "ぬ", romaji: "nu", type: "hiragana", group: "n" },
  { char: "ね", romaji: "ne", type: "hiragana", group: "n" },
  { char: "の", romaji: "no", type: "hiragana", group: "n" },
  { char: "は", romaji: "ha", type: "hiragana", group: "h" },
  { char: "ひ", romaji: "hi", type: "hiragana", group: "h" },
  { char: "ふ", romaji: "fu", type: "hiragana", group: "h" },
  { char: "へ", romaji: "he", type: "hiragana", group: "h" },
  { char: "ほ", romaji: "ho", type: "hiragana", group: "h" },
  { char: "ま", romaji: "ma", type: "hiragana", group: "m" },
  { char: "み", romaji: "mi", type: "hiragana", group: "m" },
  { char: "む", romaji: "mu", type: "hiragana", group: "m" },
  { char: "め", romaji: "me", type: "hiragana", group: "m" },
  { char: "も", romaji: "mo", type: "hiragana", group: "m" },
  { char: "や", romaji: "ya", type: "hiragana", group: "y" },
  { char: "ゆ", romaji: "yu", type: "hiragana", group: "y" },
  { char: "よ", romaji: "yo", type: "hiragana", group: "y" },
  { char: "ら", romaji: "ra", type: "hiragana", group: "r" },
  { char: "り", romaji: "ri", type: "hiragana", group: "r" },
  { char: "る", romaji: "ru", type: "hiragana", group: "r" },
  { char: "れ", romaji: "re", type: "hiragana", group: "r" },
  { char: "ろ", romaji: "ro", type: "hiragana", group: "r" },
  { char: "わ", romaji: "wa", type: "hiragana", group: "w" },
  { char: "を", romaji: "wo", type: "hiragana", group: "w" },
  { char: "ん", romaji: "n", type: "hiragana", group: "w" },
];

export const KATAKANA: Kana[] = [
  { char: "ア", romaji: "a", type: "katakana", group: "vowel" },
  { char: "イ", romaji: "i", type: "katakana", group: "vowel" },
  { char: "ウ", romaji: "u", type: "katakana", group: "vowel" },
  { char: "エ", romaji: "e", type: "katakana", group: "vowel" },
  { char: "オ", romaji: "o", type: "katakana", group: "vowel" },
  { char: "カ", romaji: "ka", type: "katakana", group: "k" },
  { char: "キ", romaji: "ki", type: "katakana", group: "k" },
  { char: "ク", romaji: "ku", type: "katakana", group: "k" },
  { char: "ケ", romaji: "ke", type: "katakana", group: "k" },
  { char: "コ", romaji: "ko", type: "katakana", group: "k" },
  { char: "サ", romaji: "sa", type: "katakana", group: "s" },
  { char: "シ", romaji: "shi", type: "katakana", group: "s" },
  { char: "ス", romaji: "su", type: "katakana", group: "s" },
  { char: "セ", romaji: "se", type: "katakana", group: "s" },
  { char: "ソ", romaji: "so", type: "katakana", group: "s" },
  { char: "タ", romaji: "ta", type: "katakana", group: "t" },
  { char: "チ", romaji: "chi", type: "katakana", group: "t" },
  { char: "ツ", romaji: "tsu", type: "katakana", group: "t" },
  { char: "テ", romaji: "te", type: "katakana", group: "t" },
  { char: "ト", romaji: "to", type: "katakana", group: "t" },
  { char: "ナ", romaji: "na", type: "katakana", group: "n" },
  { char: "ニ", romaji: "ni", type: "katakana", group: "n" },
  { char: "ヌ", romaji: "nu", type: "katakana", group: "n" },
  { char: "ネ", romaji: "ne", type: "katakana", group: "n" },
  { char: "ノ", romaji: "no", type: "katakana", group: "n" },
  { char: "ハ", romaji: "ha", type: "katakana", group: "h" },
  { char: "ヒ", romaji: "hi", type: "katakana", group: "h" },
  { char: "フ", romaji: "fu", type: "katakana", group: "h" },
  { char: "ヘ", romaji: "he", type: "katakana", group: "h" },
  { char: "ホ", romaji: "ho", type: "katakana", group: "h" },
  { char: "マ", romaji: "ma", type: "katakana", group: "m" },
  { char: "ミ", romaji: "mi", type: "katakana", group: "m" },
  { char: "ム", romaji: "mu", type: "katakana", group: "m" },
  { char: "メ", romaji: "me", type: "katakana", group: "m" },
  { char: "モ", romaji: "mo", type: "katakana", group: "m" },
];

export const ALL_KANA: Kana[] = [...HIRAGANA, ...KATAKANA];

export function pickKanaPool(types: KanaType[], groups: KanaGroup[]): Kana[] {
  return ALL_KANA.filter((k) => types.includes(k.type) && groups.includes(k.group));
}

export function makeQuestion(pool: Kana[], all: Kana[] = ALL_KANA) {
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const wrongPool = all.filter((k) => k.romaji !== correct.romaji);
  const wrongs: Kana[] = [];
  while (wrongs.length < 3) {
    const cand = wrongPool[Math.floor(Math.random() * wrongPool.length)];
    if (!wrongs.find((w) => w.romaji === cand.romaji)) wrongs.push(cand);
  }
  const options = [correct, ...wrongs]
    .map((k) => k.romaji)
    .sort(() => Math.random() - 0.5);
  return { kana: correct, options };
}
