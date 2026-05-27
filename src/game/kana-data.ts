export type KanaType = "hiragana" | "katakana" | "kanji";
export type KanaGroup =
  | "vowel" | "k" | "s" | "t" | "n" | "h" | "m" | "y" | "r" | "w"
  | "g" | "z" | "d" | "b" | "p"
  | "youon" | "sokuon" | "choon"
  | "kanji";

export interface Kana {
  char: string;   // may be multi-char for youon/sokuon
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
  { char: "ん", romaji: "n",  type: "hiragana", group: "w" },

  // Dakuon
  { char: "が", romaji: "ga", type: "hiragana", group: "g" },
  { char: "ぎ", romaji: "gi", type: "hiragana", group: "g" },
  { char: "ぐ", romaji: "gu", type: "hiragana", group: "g" },
  { char: "げ", romaji: "ge", type: "hiragana", group: "g" },
  { char: "ご", romaji: "go", type: "hiragana", group: "g" },
  { char: "ざ", romaji: "za", type: "hiragana", group: "z" },
  { char: "じ", romaji: "ji", type: "hiragana", group: "z" },
  { char: "ず", romaji: "zu", type: "hiragana", group: "z" },
  { char: "ぜ", romaji: "ze", type: "hiragana", group: "z" },
  { char: "ぞ", romaji: "zo", type: "hiragana", group: "z" },
  { char: "だ", romaji: "da", type: "hiragana", group: "d" },
  { char: "で", romaji: "de", type: "hiragana", group: "d" },
  { char: "ど", romaji: "do", type: "hiragana", group: "d" },
  { char: "ば", romaji: "ba", type: "hiragana", group: "b" },
  { char: "び", romaji: "bi", type: "hiragana", group: "b" },
  { char: "ぶ", romaji: "bu", type: "hiragana", group: "b" },
  { char: "べ", romaji: "be", type: "hiragana", group: "b" },
  { char: "ぼ", romaji: "bo", type: "hiragana", group: "b" },
  // Handakuon (treated as 'p' group)
  { char: "ぱ", romaji: "pa", type: "hiragana", group: "p" },
  { char: "ぴ", romaji: "pi", type: "hiragana", group: "p" },
  { char: "ぷ", romaji: "pu", type: "hiragana", group: "p" },
  { char: "ぺ", romaji: "pe", type: "hiragana", group: "p" },
  { char: "ぽ", romaji: "po", type: "hiragana", group: "p" },
];

// Youon (i-row + small ya/yu/yo)
const YOUON_BASE: Array<[string, string]> = [
  ["き", "k"], ["し", "sh"], ["ち", "ch"], ["に", "n"], ["ひ", "h"],
  ["み", "m"], ["り", "r"], ["ぎ", "g"], ["じ", "j"], ["び", "b"], ["ぴ", "p"],
];
const YOUON_SUFFIX: Array<[string, string]> = [["ゃ", "ya"], ["ゅ", "yu"], ["ょ", "yo"]];

export const YOUON: Kana[] = YOUON_BASE.flatMap(([ch, pre]) =>
  YOUON_SUFFIX.map(([sf, rsuf]) => {
    // ji+ya => ja, chi+ya => cha, shi+ya => sha
    let rom: string;
    if (pre === "sh" || pre === "ch" || pre === "j") {
      rom = pre + rsuf.slice(1); // sh + a => sha
    } else {
      rom = pre + rsuf;          // k + ya => kya
    }
    return { char: ch + sf, romaji: rom, type: "hiragana" as const, group: "youon" as const };
  })
);

// Sokuon (small tsu doubling consonant) — combine with common kana
const SOKUON_TARGETS: Array<[string, string]> = [
  ["か", "ka"], ["き", "ki"], ["く", "ku"], ["こ", "ko"],
  ["さ", "sa"], ["し", "shi"], ["す", "su"], ["せ", "se"],
  ["た", "ta"], ["ち", "chi"], ["つ", "tsu"], ["て", "te"], ["と", "to"],
  ["は", "ha"], ["ぱ", "pa"], ["ぴ", "pi"], ["ぷ", "pu"], ["ぽ", "po"],
];

export const SOKUON: Kana[] = SOKUON_TARGETS.map(([ch, rom]) => {
  // double first consonant; for chi -> tchi, for tsu -> ttsu, for shi -> sshi
  let prefix: string;
  if (rom.startsWith("ch")) prefix = "t";
  else prefix = rom[0];
  return { char: "っ" + ch, romaji: prefix + rom, type: "hiragana" as const, group: "sokuon" as const };
});

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

  { char: "ヤ", romaji: "ya", type: "katakana", group: "y" },
  { char: "ユ", romaji: "yu", type: "katakana", group: "y" },
  { char: "ヨ", romaji: "yo", type: "katakana", group: "y" },

  { char: "ラ", romaji: "ra", type: "katakana", group: "r" },
  { char: "リ", romaji: "ri", type: "katakana", group: "r" },
  { char: "ル", romaji: "ru", type: "katakana", group: "r" },
  { char: "レ", romaji: "re", type: "katakana", group: "r" },
  { char: "ロ", romaji: "ro", type: "katakana", group: "r" },

  { char: "ワ", romaji: "wa", type: "katakana", group: "w" },
  { char: "ヲ", romaji: "wo", type: "katakana", group: "w" },
  { char: "ン", romaji: "n",  type: "katakana", group: "w" },

  // Dakuon
  { char: "ガ", romaji: "ga", type: "katakana", group: "g" },
  { char: "ギ", romaji: "gi", type: "katakana", group: "g" },
  { char: "グ", romaji: "gu", type: "katakana", group: "g" },
  { char: "ゲ", romaji: "ge", type: "katakana", group: "g" },
  { char: "ゴ", romaji: "go", type: "katakana", group: "g" },
  { char: "ザ", romaji: "za", type: "katakana", group: "z" },
  { char: "ジ", romaji: "ji", type: "katakana", group: "z" },
  { char: "ズ", romaji: "zu", type: "katakana", group: "z" },
  { char: "ゼ", romaji: "ze", type: "katakana", group: "z" },
  { char: "ゾ", romaji: "zo", type: "katakana", group: "z" },
  { char: "ダ", romaji: "da", type: "katakana", group: "d" },
  { char: "デ", romaji: "de", type: "katakana", group: "d" },
  { char: "ド", romaji: "do", type: "katakana", group: "d" },
  { char: "バ", romaji: "ba", type: "katakana", group: "b" },
  { char: "ビ", romaji: "bi", type: "katakana", group: "b" },
  { char: "ブ", romaji: "bu", type: "katakana", group: "b" },
  { char: "ベ", romaji: "be", type: "katakana", group: "b" },
  { char: "ボ", romaji: "bo", type: "katakana", group: "b" },
  // Handakuon
  { char: "パ", romaji: "pa", type: "katakana", group: "p" },
  { char: "ピ", romaji: "pi", type: "katakana", group: "p" },
  { char: "プ", romaji: "pu", type: "katakana", group: "p" },
  { char: "ペ", romaji: "pe", type: "katakana", group: "p" },
  { char: "ポ", romaji: "po", type: "katakana", group: "p" },

  // Chōonpu (long-vowel marker) — special: romaji resolved from previous kana
  { char: "ー", romaji: "-", type: "katakana", group: "choon" },
];

// Katakana youon (i-row + small ャュョ)
const K_YOUON_BASE: Array<[string, string]> = [
  ["キ", "k"], ["シ", "sh"], ["チ", "ch"], ["ニ", "n"], ["ヒ", "h"],
  ["ミ", "m"], ["リ", "r"], ["ギ", "g"], ["ジ", "j"], ["ビ", "b"], ["ピ", "p"],
];
const K_YOUON_SUFFIX: Array<[string, string]> = [["ャ", "ya"], ["ュ", "yu"], ["ョ", "yo"]];

export const KATAKANA_YOUON: Kana[] = K_YOUON_BASE.flatMap(([ch, pre]) =>
  K_YOUON_SUFFIX.map(([sf, rsuf]) => {
    let rom: string;
    if (pre === "sh" || pre === "ch" || pre === "j") rom = pre + rsuf.slice(1);
    else rom = pre + rsuf;
    return { char: ch + sf, romaji: rom, type: "katakana" as const, group: "youon" as const };
  })
);

// Katakana sokuon (small ッ + consonant doubling)
const K_SOKUON_TARGETS: Array<[string, string]> = [
  ["カ", "ka"], ["キ", "ki"], ["ク", "ku"], ["コ", "ko"],
  ["サ", "sa"], ["シ", "shi"], ["ス", "su"], ["セ", "se"],
  ["タ", "ta"], ["チ", "chi"], ["ツ", "tsu"], ["テ", "te"], ["ト", "to"],
  ["ハ", "ha"], ["パ", "pa"], ["ピ", "pi"], ["プ", "pu"], ["ポ", "po"],
];
export const KATAKANA_SOKUON: Kana[] = K_SOKUON_TARGETS.map(([ch, rom]) => {
  const prefix = rom.startsWith("ch") ? "t" : rom[0];
  return { char: "ッ" + ch, romaji: prefix + rom, type: "katakana" as const, group: "sokuon" as const };
});

// Katakana gairaigo — special combos for foreign sounds (e.g., ファ, ヴィ, ティ, ウォ).
// Group reused as "youon" so they share styling.
const K_GAIRAIGO_RAW: Array<[string, string]> = [
  ["ファ", "fa"], ["フィ", "fi"], ["フェ", "fe"], ["フォ", "fo"], ["フュ", "fyu"],
  ["ヴァ", "va"], ["ヴィ", "vi"], ["ヴ", "vu"], ["ヴェ", "ve"], ["ヴォ", "vo"],
  ["ティ", "ti"], ["ディ", "di"], ["トゥ", "tu"], ["ドゥ", "du"],
  ["ウィ", "wi"], ["ウェ", "we"], ["ウォ", "wo"],
  ["シェ", "she"], ["ジェ", "je"], ["チェ", "che"],
  ["ツァ", "tsa"], ["ツィ", "tsi"], ["ツェ", "tse"], ["ツォ", "tso"],
];
export const KATAKANA_GAIRAIGO: Kana[] = K_GAIRAIGO_RAW.map(([ch, rom]) => ({
  char: ch, romaji: rom, type: "katakana" as const, group: "youon" as const,
}));

export const ALL_HIRAGANA: Kana[] = [...HIRAGANA, ...YOUON, ...SOKUON];
export const ALL_KATAKANA: Kana[] = [...KATAKANA, ...KATAKANA_YOUON, ...KATAKANA_SOKUON, ...KATAKANA_GAIRAIGO];
export const ALL_KANA: Kana[] = [...ALL_HIRAGANA, ...ALL_KATAKANA];

export function pickKanaPool(types: KanaType[], groups: KanaGroup[]): Kana[] {
  return ALL_KANA.filter((k) => types.includes(k.type) && groups.includes(k.group));
}

// Legacy single-kana question (still used by practice mode)
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
