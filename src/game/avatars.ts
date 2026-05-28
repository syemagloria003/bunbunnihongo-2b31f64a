import bee from "@/assets/avatars/bee.png";
import fox from "@/assets/avatars/fox.png";
import panda from "@/assets/avatars/panda.png";
import cat from "@/assets/avatars/cat.png";
import owl from "@/assets/avatars/owl.png";
import bunny from "@/assets/avatars/bunny.png";
import hamster from "@/assets/avatars/hamster.png";
import penguin from "@/assets/avatars/penguin.png";
import dragon from "@/assets/avatars/dragon.png";
import phoenix from "@/assets/avatars/phoenix.png";
import kitsune from "@/assets/avatars/kitsune.png";

export type AvatarRarity = "common" | "rare";

export interface AvatarDef {
  id: string;
  name: string;
  src: string;
  rarity: AvatarRarity;
  /** Storage key flag yang harus bernilai "1" agar terbuka. */
  unlockKey?: string;
  /** Petunjuk bagaimana cara membukanya, ditampilkan di tooltip/modal. */
  unlockHint?: string;
}

export const AVATARS: AvatarDef[] = [
  { id: "bee", name: "Lebah Madu", src: bee, rarity: "common" },
  { id: "fox", name: "Rubah Karang", src: fox, rarity: "common" },
  { id: "panda", name: "Panda Sage", src: panda, rarity: "common" },
  { id: "cat", name: "Kucing Lavender", src: cat, rarity: "common" },
  { id: "owl", name: "Burung Hantu Teal", src: owl, rarity: "common" },
  { id: "bunny", name: "Kelinci Persik", src: bunny, rarity: "common" },
  { id: "hamster", name: "Hamster Mentega", src: hamster, rarity: "common" },
  { id: "penguin", name: "Penguin Indigo", src: penguin, rarity: "common" },
  // 🏆 Langka — hanya bisa dibuka lewat Bonus Game Aisatsu.
  {
    id: "dragon",
    name: "Naga Sakura ✨",
    src: dragon,
    rarity: "rare",
    unlockKey: "unlock_avatar_dragon",
    unlockHint: "Selesaikan Bonus Game Aisatsu dengan skor ≥ 80% di Taman Hiragana.",
  },
  {
    id: "phoenix",
    name: "Phoenix Aurora ✨",
    src: phoenix,
    rarity: "rare",
    unlockKey: "unlock_avatar_phoenix",
    unlockHint: "Selesaikan Bonus Game Aisatsu dengan skor SEMPURNA (100%) di Taman Hiragana.",
  },
  {
    id: "kitsune",
    name: "Kitsune Roh ✨",
    src: kitsune,
    rarity: "rare",
    unlockKey: "unlock_avatar_kitsune",
    unlockHint: "Selesaikan Bonus Game Aisatsu (lulus minimal 1×) di Taman Hiragana.",
  },
];

export function getAvatarSrc(id?: string | null): string {
  if (!id) return bee;
  return AVATARS.find((a) => a.id === id)?.src ?? bee;
}

/** Cek apakah avatar sudah terbuka untuk user ini (berdasarkan localStorage). */
export function isAvatarUnlocked(a: AvatarDef): boolean {
  if (a.rarity === "common" || !a.unlockKey) return true;
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(a.unlockKey) === "1";
  } catch {
    return false;
  }
}

/** Tandai avatar sebagai terbuka. */
export function unlockAvatar(id: string): void {
  if (typeof window === "undefined") return;
  const a = AVATARS.find((x) => x.id === id);
  if (!a?.unlockKey) return;
  try {
    window.localStorage.setItem(a.unlockKey, "1");
  } catch {
    /* ignore */
  }
}
