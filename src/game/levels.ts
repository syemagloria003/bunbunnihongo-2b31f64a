import type { Kana, KanaGroup, KanaType } from "./kana-data";
import type { WorldTheme } from "./themes";
import {
  KANJI_N1, KANJI_N2, KANJI_ELEM,
  KANJI_L4, KANJI_L5, KANJI_L6, KANJI_L7, KANJI_L8, KANJI_L9,
} from "./kanji-data";

export interface LevelDef {
  id: string;
  name: string;
  subtitle: string;
  bg: string;
  ground: string;
  tiles: string[];
  // Hiragana/Katakana levels filter ALL_KANA via these. Optional because
  // kanji levels supply `customPool` directly.
  kanaTypes?: KanaType[];
  kanaGroups?: KanaGroup[];
  theme: WorldTheme;
  // Kanji levels (and any future custom-pool world) provide entries directly.
  customPool?: Kana[];
  // When set to 1, each gate shows one character with its meaning options.
  wordLen?: number;
  // Modal label switch: "kana" (default) or "kanji" (asks for meaning).
  mode?: "kana" | "kanji";
}

/*
  Tile legend (chars):
    .  empty       #  ground       =  floating platform
    M  honey coin  E  enemy spawn  ?  kana gate
    P  player spawn               G  goal (beehive)
*/

interface GenOpts {
  length: number;
  gates: number;
  coins: number;
  enemies: number;
  pits?: number[]; // x positions where ground is missing (1-tile-wide pits)
}

function genTiles(opts: GenOpts): string[] {
  const rows = 13;
  const grid: string[][] = Array.from({ length: rows }, () => Array(opts.length).fill("."));

  // Ground at rows 11..12 (bottom two rows)
  const pits = new Set(opts.pits ?? []);
  for (let x = 0; x < opts.length; x++) {
    if (pits.has(x)) continue;
    grid[11][x] = "#";
    grid[12][x] = "#";
  }

  // Stepping platforms across pits
  for (const px of pits) {
    if (grid[9][px] === ".") grid[9][px] = "=";
  }

  // Floating platforms scattered
  const platCount = Math.floor(opts.length / 10);
  for (let i = 0; i < platCount; i++) {
    const x = 4 + Math.floor(((i + 1) * opts.length) / (platCount + 1));
    const y = 6 + (i % 3);
    for (let dx = 0; dx < 3; dx++) {
      if (x + dx < opts.length && grid[y][x + dx] === ".") grid[y][x + dx] = "=";
    }
  }

  // Player spawn (top-left walkable area)
  grid[10][1] = "P";

  // Goal at far right (above ground)
  const goalX = opts.length - 3;
  grid[10][goalX] = "G";

  // Gates evenly between spawn and goal
  const start = 5, end = goalX - 2;
  const span = end - start;
  for (let i = 0; i < opts.gates; i++) {
    const x = Math.round(start + ((i + 1) * span) / (opts.gates + 1));
    if (grid[10][x] === ".") grid[10][x] = "?";
  }

  // Coins on platforms / above ground
  for (let i = 0; i < opts.coins; i++) {
    const x = 3 + Math.floor(((i + 0.5) * (opts.length - 6)) / opts.coins);
    const y = 7 + (i % 4);
    if (grid[y]?.[x] === ".") grid[y][x] = "M";
  }

  // Enemies on ground level
  for (let i = 0; i < opts.enemies; i++) {
    const x = 4 + Math.floor(((i + 0.5) * (opts.length - 8)) / opts.enemies);
    if (grid[10][x] === ".") grid[10][x] = "E";
  }

  return grid.map((r) => r.join(""));
}

function pitsEvery(length: number, step: number, start = 12): number[] {
  const out: number[] = [];
  for (let x = start; x < length - 6; x += step) out.push(x);
  return out;
}

export const LEVELS: LevelDef[] = [
  {
    id: "1",
    theme: "garden",
    name: "Padang Bunga",
    subtitle: "Vokal + baris K",
    bg: "linear-gradient(180deg, #bfe3ff 0%, #ffe8b3 100%)",
    ground: "#7bc46c",
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k"],
    tiles: genTiles({ length: 50, gates: 5, coins: 8, enemies: 2 }),
  },
  {
    id: "2",
    theme: "garden",
    name: "Hutan Madu",
    subtitle: "+ baris S & T",
    bg: "linear-gradient(180deg, #ffd29e 0%, #ffe8b3 100%)",
    ground: "#5fa84c",
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k", "s", "t"],
    tiles: genTiles({ length: 70, gates: 8, coins: 10, enemies: 4, pits: pitsEvery(70, 18) }),
  },
  {
    id: "3",
    theme: "garden",
    name: "Sungai Polen",
    subtitle: "+ baris N & H",
    bg: "linear-gradient(180deg, #a5d8ff 0%, #d4f1c5 100%)",
    ground: "#4a9d72",
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h"],
    tiles: genTiles({ length: 85, gates: 10, coins: 12, enemies: 5, pits: pitsEvery(85, 16) }),
  },
  {
    id: "4",
    theme: "garden",
    name: "Bukit Liar",
    subtitle: "+ baris M & Y",
    bg: "linear-gradient(180deg, #ffb380 0%, #ffd4a3 100%)",
    ground: "#a88547",
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h", "m", "y"],
    tiles: genTiles({ length: 100, gates: 12, coins: 14, enemies: 7, pits: pitsEvery(100, 14) }),
  },
  {
    id: "5",
    theme: "garden",
    name: "Lembah Senja",
    subtitle: "+ baris R & W",
    bg: "linear-gradient(180deg, #6f5fa8 0%, #ffb3a3 100%)",
    ground: "#5d3a78",
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"],
    tiles: genTiles({ length: 115, gates: 14, coins: 16, enemies: 8, pits: pitsEvery(115, 12) }),
  },
  {
    id: "6",
    theme: "garden",
    name: "Sarang Dakuon",
    subtitle: "+ Dakuon ﾞ & Handakuon ﾟ",
    bg: "linear-gradient(180deg, #2a2a4a 0%, #8a5a9a 100%)",
    ground: "#3a2a4a",
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w", "g", "z", "d", "b", "p"],
    tiles: genTiles({ length: 130, gates: 18, coins: 18, enemies: 10, pits: pitsEvery(130, 10) }),
  },
  {
    id: "7",
    theme: "garden",
    name: "Ratu Tawon",
    subtitle: "+ Youon ゃゅょ & Sokuon っ",
    bg: "linear-gradient(180deg, #1a0a2e 0%, #c44569 100%)",
    ground: "#3a1a4a",
    kanaTypes: ["hiragana"],
    kanaGroups: [
      "vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w",
      "g", "z", "d", "b", "p", "youon", "sokuon",
    ],
    tiles: genTiles({ length: 150, gates: 22, coins: 20, enemies: 12, pits: pitsEvery(150, 9) }),
  },
];

// Kanji arc — Dunia Galaksi Meteor. Each level uses a per-level customPool
// of kanji and word length 1 (one glyph per gate, answer in Indonesian).
interface KanjiLevelSeed {
  id: string;
  name: string;
  subtitle: string;
  bg: string;
  pool: Kana[];
  length: number;
  enemies: number;
  pits?: number[];
}

const KANJI_SEEDS: KanjiLevelSeed[] = [
  {
    id: "kn1", name: "Sabuk Asteroid", subtitle: "Angka 一 〜 十",
    bg: "linear-gradient(180deg, #02030f 0%, #1a0838 100%)",
    pool: KANJI_N1, length: 78, enemies: 3,
  },
  {
    id: "kn2", name: "Nebula Angka", subtitle: "百 千 万 億",
    bg: "linear-gradient(180deg, #050218 0%, #2a1060 100%)",
    pool: KANJI_N2, length: 64, enemies: 3,
  },
  {
    id: "kn3", name: "Planet Elemen", subtitle: "月 日 水 火 木 土",
    bg: "linear-gradient(180deg, #0a0428 0%, #3a1860 100%)",
    pool: KANJI_ELEM, length: 78, enemies: 4,
  },
  {
    id: "kn4", name: "Kuil Bintang", subtitle: "Keluarga, orang, negara…",
    bg: "linear-gradient(180deg, #02030f 0%, #4a1a7a 100%)",
    pool: KANJI_L4, length: 110, enemies: 6,
    pits: pitsEvery(110, 14),
  },
  {
    id: "kn5", name: "Pusaran Waktu", subtitle: "Jam, menit, sekarang, tahun…",
    bg: "linear-gradient(180deg, #08051a 0%, #5a2a8a 100%)",
    pool: KANJI_L5, length: 102, enemies: 6,
    pits: pitsEvery(102, 14),
  },
  {
    id: "kn6", name: "Bulan Pasar", subtitle: "Besar/kecil, mahal/murah…",
    bg: "linear-gradient(180deg, #0a0428 0%, #7a3aa0 100%)",
    pool: KANJI_L6, length: 118, enemies: 7,
    pits: pitsEvery(118, 12),
  },
  {
    id: "kn7", name: "Stasiun Komet", subtitle: "Arah & tempat",
    bg: "linear-gradient(180deg, #050218 0%, #2a5aaf 100%)",
    pool: KANJI_L7, length: 108, enemies: 7,
    pits: pitsEvery(108, 12),
  },
  {
    id: "kn8", name: "Kota Gravitasi", subtitle: "Aktivitas sehari-hari",
    bg: "linear-gradient(180deg, #02030f 0%, #c44518 100%)",
    pool: KANJI_L8, length: 124, enemies: 9,
    pits: pitsEvery(124, 11),
  },
  {
    id: "kn9", name: "Pusat Galaksi", subtitle: "Alam, tubuh & langit",
    bg: "linear-gradient(180deg, #050218 0%, #ff7a3a 100%)",
    pool: KANJI_L9, length: 140, enemies: 10,
    pits: pitsEvery(140, 10),
  },
];

export const KANJI_LEVELS: LevelDef[] = KANJI_SEEDS.map((s) => {
  const gates = s.pool.length; // 1 gate per kanji → guaranteed full coverage
  const coins = Math.max(8, Math.round(s.pool.length * 0.8));
  return {
    id: s.id,
    theme: "meteor_galaxy",
    name: s.name,
    subtitle: s.subtitle,
    bg: s.bg,
    ground: "#2a1048",
    tiles: genTiles({ length: s.length, gates, coins, enemies: s.enemies, pits: s.pits }),
    customPool: s.pool,
    wordLen: 1,
    mode: "kanji",
  };
});

// Katakana arc — semua level pakai tema Gua Kristal (konsisten); hanya langit yang berubah per level.
export const KATAKANA_LEVELS: LevelDef[] = [
  {
    id: "k1",
    theme: "crystal_cave",
    name: "Gua Kristal",
    subtitle: "Katakana — vokal + K",
    bg: "linear-gradient(180deg, #0a1a3a 0%, #4a7ab8 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: ["vowel", "k"],
    tiles: genTiles({ length: 55, gates: 5, coins: 8, enemies: 2 }),
  },
  {
    id: "k2",
    theme: "crystal_cave",
    name: "Lorong Safir",
    subtitle: "+ baris S & T",
    bg: "linear-gradient(180deg, #0a1438 0%, #2a5a9a 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: ["vowel", "k", "s", "t"],
    tiles: genTiles({ length: 72, gates: 8, coins: 10, enemies: 4, pits: pitsEvery(72, 18) }),
  },
  {
    id: "k3",
    theme: "crystal_cave",
    name: "Aula Ametis",
    subtitle: "+ baris N & H",
    bg: "linear-gradient(180deg, #1a0a3a 0%, #6a3aa0 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h"],
    tiles: genTiles({ length: 88, gates: 10, coins: 12, enemies: 5, pits: pitsEvery(88, 16) }),
  },
  {
    id: "k4",
    theme: "crystal_cave",
    name: "Sungai Es",
    subtitle: "+ baris M & Y",
    bg: "linear-gradient(180deg, #0a2a4a 0%, #7ac8e8 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h", "m", "y"],
    tiles: genTiles({ length: 102, gates: 12, coins: 14, enemies: 7, pits: pitsEvery(102, 14) }),
  },
  {
    id: "k5",
    theme: "crystal_cave",
    name: "Kubah Berlian",
    subtitle: "+ baris R & W",
    bg: "linear-gradient(180deg, #0a1a4a 0%, #b8d0ff 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"],
    tiles: genTiles({ length: 118, gates: 14, coins: 16, enemies: 8, pits: pitsEvery(118, 12) }),
  },
  {
    id: "k6",
    theme: "crystal_cave",
    name: "Inti Geode",
    subtitle: "+ Dakuon ﾞﾟ & vokal panjang ー",
    bg: "linear-gradient(180deg, #1a0828 0%, #8a3acf 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w", "g", "z", "d", "b", "p", "choon"],
    tiles: genTiles({ length: 134, gates: 18, coins: 18, enemies: 10, pits: pitsEvery(134, 10) }),
  },
  {
    id: "k7",
    theme: "crystal_cave",
    name: "Tahta Kristal",
    subtitle: "+ Youon ャュョ & Sokuon ッ",
    bg: "linear-gradient(180deg, #050a28 0%, #c89aff 100%)",
    ground: "#3a4a6a",
    kanaTypes: ["katakana"],
    kanaGroups: [
      "vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w",
      "g", "z", "d", "b", "p", "choon", "youon", "sokuon",
    ],
    tiles: genTiles({ length: 154, gates: 22, coins: 20, enemies: 12, pits: pitsEvery(154, 9) }),
  },
];

export const ALL_LEVELS: LevelDef[] = [...LEVELS, ...KATAKANA_LEVELS, ...KANJI_LEVELS];

export function getLevel(id: string): LevelDef | undefined {
  return ALL_LEVELS.find((l) => l.id === id);
}

export function nextLevelId(id: string): string | undefined {
  const i = ALL_LEVELS.findIndex((l) => l.id === id);
  if (i < 0) return undefined;
  return ALL_LEVELS[i + 1]?.id;
}

// Final Hiragana boss — clearing this awards the crystal that unlocks Katakana.
export function isFinalLevel(id: string): boolean {
  return LEVELS[LEVELS.length - 1].id === id;
}

// Final Katakana boss — clearing this awards the meteor that unlocks Kanji.
export function isFinalKatakanaLevel(id: string): boolean {
  return KATAKANA_LEVELS[KATAKANA_LEVELS.length - 1].id === id;
}

export function isFinalKanjiLevel(id: string): boolean {
  return KANJI_LEVELS[KANJI_LEVELS.length - 1].id === id;
}
