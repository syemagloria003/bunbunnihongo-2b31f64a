// Kanji entries for the "Galaksi Meteor" world.
// Field naming follows the existing Kana shape so the same word/option
// machinery can be reused: `char` is the kanji glyph, `romaji` holds the
// Indonesian meaning (the answer the player must pick), and `group` is a
// flat "kanji" tag because grouping per level is handled via `customPool`
// on the LevelDef.
import type { Kana } from "./kana-data";

function mk(char: string, meaning: string): Kana {
  return { char, romaji: meaning, type: "kanji", group: "kanji" };
}

// L1 — angka 1-10
export const KANJI_N1: Kana[] = [
  mk("一", "Satu"), mk("二", "Dua"), mk("三", "Tiga"), mk("四", "Empat"),
  mk("五", "Lima"), mk("六", "Enam"), mk("七", "Tujuh"), mk("八", "Delapan"),
  mk("九", "Sembilan"), mk("十", "Sepuluh"),
];

// L2 — hyaku / sen / man / oku
export const KANJI_N2: Kana[] = [
  mk("百", "Ratus"),
  mk("千", "Ribu"),
  mk("万", "Sepuluh Ribu"),
  mk("億", "Seratus Juta"),
];

// L3 — elemen hari-hari
export const KANJI_ELEM: Kana[] = [
  mk("月", "Bulan"),
  mk("日", "Matahari / Hari"),
  mk("水", "Air"),
  mk("火", "Api"),
  mk("木", "Pohon / Kayu"),
  mk("土", "Tanah"),
];

// L4
export const KANJI_L4: Kana[] = [
  mk("先", "Terdahulu / Depan"),
  mk("生", "Hidup / Lahir"),
  mk("学", "Belajar"),
  mk("人", "Orang"),
  mk("国", "Negara"),
  mk("男", "Laki-laki"),
  mk("女", "Perempuan"),
  mk("子", "Anak"),
  mk("友", "Teman"),
  mk("父", "Ayah"),
  mk("母", "Ibu"),
  mk("名", "Nama"),
  mk("田", "Sawah"),
  mk("山", "Gunung"),
  mk("語", "Bahasa / Kata"),
  mk("本", "Buku / Asal / Dasar"),
];

// L5 — waktu
export const KANJI_L5: Kana[] = [
  mk("何", "Apa"),
  mk("時", "Waktu / Jam"),
  mk("分", "Menit / Bagian"),
  mk("間", "Antara / Jeda"),
  mk("半", "Setengah"),
  mk("午", "Siang"),
  mk("前", "Depan / Sebelum"),
  mk("後", "Belakang / Sesudah"),
  mk("今", "Sekarang"),
  mk("週", "Minggu (Pekan)"),
  mk("年", "Tahun"),
  mk("毎", "Setiap"),
];

// L6 — ukuran & lawan kata
export const KANJI_L6: Kana[] = [
  mk("少", "Sedikit"),
  mk("多", "Banyak"),
  mk("小", "Kecil"),
  mk("大", "Besar"),
  mk("安", "Murah / Aman"),
  mk("高", "Tinggi / Mahal"),
  mk("新", "Baru"),
  mk("古", "Lama / Kuno"),
  mk("早", "Cepat / Awal"),
  mk("長", "Panjang"),
  mk("円", "Yen / Bulat"),
  mk("校", "Sekolah"),
  mk("社", "Perusahaan"),
  mk("中", "Tengah / Dalam"),
  mk("聞", "Mendengar"),
];

// L7 — arah & tempat
export const KANJI_L7: Kana[] = [
  mk("駅", "Stasiun"),
  mk("口", "Mulut"),
  mk("出", "Keluar"),
  mk("入", "Masuk"),
  mk("東", "Timur"),
  mk("西", "Barat"),
  mk("南", "Selatan"),
  mk("北", "Utara"),
  mk("上", "Atas"),
  mk("下", "Bawah"),
  mk("左", "Kiri"),
  mk("右", "Kanan"),
  mk("外", "Luar"),
];

// L8 — aktivitas
export const KANJI_L8: Kana[] = [
  mk("休", "Istirahat"),
  mk("見", "Melihat"),
  mk("言", "Berkata"),
  mk("行", "Pergi"),
  mk("書", "Menulis"),
  mk("読", "Membaca"),
  mk("買", "Membeli"),
  mk("来", "Datang"),
  mk("立", "Berdiri"),
  mk("食", "Makan"),
  mk("飲", "Minum"),
  mk("会", "Bertemu"),
  mk("電", "Listrik"),
  mk("話", "Berbicara / Cerita"),
  mk("車", "Mobil / Kendaraan"),
];

// L9 — alam & tubuh
export const KANJI_L9: Kana[] = [
  mk("花", "Bunga"),
  mk("天", "Langit / Surga"),
  mk("気", "Udara / Semangat"),
  mk("耳", "Telinga"),
  mk("手", "Tangan"),
  mk("足", "Kaki"),
  mk("目", "Mata"),
  mk("力", "Kekuatan"),
  mk("川", "Sungai"),
  mk("牛", "Sapi"),
  mk("魚", "Ikan"),
  mk("店", "Toko"),
  mk("道", "Jalan"),
  mk("門", "Gerbang"),
  mk("雨", "Hujan"),
  mk("空", "Langit / Kosong"),
  mk("白", "Putih"),
];

export const ALL_KANJI: Kana[] = [
  ...KANJI_N1, ...KANJI_N2, ...KANJI_ELEM,
  ...KANJI_L4, ...KANJI_L5, ...KANJI_L6,
  ...KANJI_L7, ...KANJI_L8, ...KANJI_L9,
];
