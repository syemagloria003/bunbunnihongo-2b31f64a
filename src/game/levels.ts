import type { KanaGroup, KanaType } from "./kana-data";

export interface LevelDef {
  id: string;
  name: string;
  subtitle: string;
  bg: string;
  ground: string;
  tiles: string[];
  kanaTypes: KanaType[];
  kanaGroups: KanaGroup[];
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

// Katakana arc (unlocked by crystal)
export const KATAKANA_LEVELS_PREVIEW = [
  { id: "k1", name: "Gua Kristal", subtitle: "Katakana — vokal + K" },
  { id: "k2", name: "Lautan Bintang", subtitle: "Katakana — S & T" },
  { id: "boss", name: "Ratu Bintang", subtitle: "Boss Katakana" },
];

export function getLevel(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function nextLevelId(id: string): string | undefined {
  const i = LEVELS.findIndex((l) => l.id === id);
  if (i < 0) return undefined;
  return LEVELS[i + 1]?.id;
}

export function isFinalLevel(id: string): boolean {
  return LEVELS[LEVELS.length - 1].id === id;
}
