import type { KanaGroup, KanaType } from "./kana-data";

export interface LevelDef {
  id: string;
  name: string;
  subtitle: string;
  bg: string;        // CSS gradient for sky
  ground: string;    // CSS color for ground tiles
  tiles: string[];   // rows top-down; chars: '.', '#', '=', '?', 'M', 'E', 'G', 'P' (player spawn)
  kanaTypes: KanaType[];
  kanaGroups: KanaGroup[];
}

/*
 Legend:
   .  empty
   #  ground/solid block
   =  floating platform
   M  honey drop (coin)
   E  enemy spawn (spider/fly)
   ?  Kana Gate (must answer to remove)
   G  goal (beehive)
   P  player spawn
*/

const L1 = [
  "................................................................",
  "................................................................",
  "................................................................",
  "....................M.M.........................................",
  "...........====...............===...............................",
  "..............................==..........MMM..................",
  "......M.................................========...............",
  "....=====...........E........?..........................?......",
  "................==.....==...................==..........==.....",
  "P............M.....M........M.....E.......M..M.M..........G....",
  "##################..##################..########################",
  "##################..##################..########################",
];

const L2 = [
  ".........................................................................",
  ".........................................................................",
  "........................M.M.M............................................",
  ".....................==========..........................................",
  "...............M.M............................M..........................",
  ".............======.................==.....=====.........................",
  "..........................E................................?.............",
  "........?................==................................==............",
  "....=====.......==..............==..............==......==..............=",
  "..............M..M..............E..........M.M.....E....................",
  "P.......M..........E....................................................G",
  "################...################...########...##################.....#",
  "################...################...########...##################.....#",
];

export const LEVELS: LevelDef[] = [
  {
    id: "1",
    name: "Padang Bunga",
    subtitle: "Vokal Hiragana + baris K",
    bg: "linear-gradient(180deg, #bfe3ff 0%, #ffe8b3 100%)",
    ground: "#7bc46c",
    tiles: L1,
    kanaTypes: ["hiragana"],
    kanaGroups: ["vowel", "k"],
  },
  {
    id: "2",
    name: "Hutan Madu",
    subtitle: "Hiragana S, T, N, M",
    bg: "linear-gradient(180deg, #ffd29e 0%, #ffe8b3 100%)",
    ground: "#5fa84c",
    tiles: L2,
    kanaTypes: ["hiragana"],
    kanaGroups: ["s", "t", "n", "m", "vowel", "k"],
  },
];

export const LOCKED_LEVELS = [
  { id: "3", name: "Sarang Lebah", subtitle: "Hiragana penuh + dakuten" },
  { id: "4", name: "Gua Kristal", subtitle: "Katakana dasar" },
  { id: "5", name: "Langit Senja", subtitle: "Katakana penuh" },
  { id: "boss", name: "Ratu Tawon", subtitle: "Boss — 5 kana beruntun" },
];

export function getLevel(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id);
}
