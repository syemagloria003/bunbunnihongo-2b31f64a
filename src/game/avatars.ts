import bee from "@/assets/avatars/bee.png";
import fox from "@/assets/avatars/fox.png";
import panda from "@/assets/avatars/panda.png";
import cat from "@/assets/avatars/cat.png";
import owl from "@/assets/avatars/owl.png";
import bunny from "@/assets/avatars/bunny.png";
import hamster from "@/assets/avatars/hamster.png";
import penguin from "@/assets/avatars/penguin.png";

export interface AvatarDef {
  id: string;
  name: string;
  src: string;
}

export const AVATARS: AvatarDef[] = [
  { id: "bee", name: "Lebah Madu", src: bee },
  { id: "fox", name: "Rubah Karang", src: fox },
  { id: "panda", name: "Panda Sage", src: panda },
  { id: "cat", name: "Kucing Lavender", src: cat },
  { id: "owl", name: "Burung Hantu Teal", src: owl },
  { id: "bunny", name: "Kelinci Persik", src: bunny },
  { id: "hamster", name: "Hamster Mentega", src: hamster },
  { id: "penguin", name: "Penguin Indigo", src: penguin },
];

export function getAvatarSrc(id?: string | null): string {
  if (!id) return bee;
  return AVATARS.find((a) => a.id === id)?.src ?? bee;
}
