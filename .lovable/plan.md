
# BeeGana — Petualangan Lebah Belajar Kana

Game platformer 2D ala Mario di mana pemain mengendalikan lebah lucu bernama **Buzu** yang terbang dan melompat di taman bunga. Untuk membuka pintu antar area, Buzu harus menjawab pertanyaan Hiragana/Katakana.

## Konsep Inti

- **Karakter**: Lebah bulat lucu, sayap bergetar (animasi), bisa jalan, lompat, dan "double-flap" (lompat ganda pakai sayap).
- **Tema visual**: Taman bunga + sarang lebah. Palet madu (kuning-emas), hijau daun, langit pastel. Tile berbentuk sarang heksagonal & kelopak bunga.
- **Musuh**: Laba-laba, lalat nakal, tawon. Bisa di-stomp dari atas seperti Goomba.
- **Item**: Tetes madu (koin), bunga bonus (1-up), sari bunga (power-up sementara — terbang lebih lama).
- **Gimmick edukasi**: Beberapa platform/pintu terkunci dengan **Kana Gate** — muncul karakter ã²ã‚‰ãŒãª/ã‚«ã‚¿ã‚«ãƒŠ, pemain pilih romaji yang benar dari 4 opsi.

## Level

1. **Level 1 — Padang Bunga (Hiragana Vokal)**: a i u e o + ka ki ku ke ko.
2. **Level 2 — Hutan Madu (Hiragana lanjutan)**: sa-shi-su, ta-chi-tsu, na-ni-nu, dll.
3. **Level 3 — Sarang Lebah (Hiragana penuh + dakuten)**: ga, za, da, ba, pa.
4. **Level 4 — Gua Kristal (Katakana dasar)**: ã‚¢ ã‚¤ ã‚¦ ã‚¨ ã‚ª + baris ka/sa.
5. **Level 5 — Langit Senja (Katakana penuh)**: campur semua.
6. **Boss Level — Ratu Tawon**: jawab 5 kana berturut-turut tanpa salah untuk mengalahkan.

Setiap level: kumpulkan madu, hindari musuh, lewati 2â€“3 Kana Gate, sampai ke sarang tujuan di akhir.

## Mekanik Game

- **Kontrol**: â† â†’ jalan, Space lompat (tekan 2x untuk flap), â†‘ untuk interaksi/Kana Gate.
- **Nyawa**: 3 hati. Salah jawab kana = kehilangan 1 hati. Kena musuh = 1 hati.
- **Skor**: madu Ã— 10, jawaban benar Ã— 50, bonus level selesai.
- **Progress tersimpan** di localStorage (level terbuka, skor tertinggi, kana yang sudah dikuasai).
- **Mode latihan**: dari menu utama bisa latihan kana tanpa platforming.

## Halaman & Routing (TanStack Start)

```
src/routes/
  index.tsx          â†’ Landing + tombol Main, About, Tentang Kana
  play.tsx           â†’ Pilih level (peta dunia ala Mario)
  play.$levelId.tsx  â†’ Canvas game untuk level tsb
  practice.tsx       â†’ Mode latihan kana (kuis murni)
  about.tsx          â†’ Cara main + cara baca kana
```

## Detail Teknis

- **Render game**: HTML5 Canvas via React (`<canvas ref>`), game loop dengan `requestAnimationFrame`. Tidak pakai library berat â€” fisika sederhana (gravity, velocity, AABB collision) ditulis manual.
- **State engine**: kelas TypeScript `GameEngine` (player, enemies, tiles, gates) di `src/game/`. React hanya untuk HUD (hati, skor, modal Kana Gate).
- **Kana Gate**: ketika collision dengan gate, engine pause â†’ React modal muncul â†’ jawaban dikirim balik ke engine.
- **Data kana**: file `src/game/kana-data.ts` â€” array `{char, romaji, type: 'hiragana'|'katakana', group}`.
- **Level data**: array tile per level di `src/game/levels/level-1.ts` dst (grid sederhana â€” `.` udara, `#` tanah, `?` gate, `M` madu, `E` musuh, `G` goal).
- **Aset**: sprite lebah, musuh, bunga, tile sarang dibuat via `imagegen` (PNG transparan, gaya kartun lucu). Background per level juga di-generate.
- **Audio**: efek lompat/koin/benar/salah pakai file kecil atau Web Audio API tone sederhana (opsional, bisa di-skip versi awal).
- **Design system**: token warna madu/taman ditambahkan di `src/styles.css` (oklch), font display playful (mis. *Fredoka* atau *Baloo 2*) + body sans bersih.

## Ruang Lingkup Implementasi (1 iterasi pertama)

1. Setup routing + landing + halaman pilih level.
2. Mesin game inti (player, gravity, lompat, tile collision, kamera scroll).
3. Musuh dasar + tetes madu + sistem nyawa/skor + HUD.
4. Kana Gate + modal kuis + data kana lengkap.
5. **Level 1 & 2** playable end-to-end, level lain stub "Coming soon".
6. Mode latihan kana sederhana.
7. localStorage untuk progress.

Level 3â€“5 + boss bisa ditambahkan di iterasi berikutnya setelah loop utamanya terasa enak.

## Pertanyaan untuk Kamu

1. Setuju mulai dengan Level 1 & 2 dulu (sisanya menyusul), atau mau semua 5 level sekaligus walau lebih lama?
2. Mau ada **mode pilihan**: kuis tipe "lihat kana â†’ pilih romaji" saja, atau juga sebaliknya "lihat romaji â†’ pilih kana"?
3. Suara/musik latar: skip dulu, atau aktifkan dengan tone sintetis sederhana?
