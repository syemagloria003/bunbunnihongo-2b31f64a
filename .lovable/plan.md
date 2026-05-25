# Bikin BeeGana Secantik Mario Bros 🎨

Sekarang game-nya masih pakai kotak-kotak warna polos. Mario Bros cantik karena: **sprite art**, **parallax background**, **tile yang detail**, **animasi karakter**, dan **partikel/efek**. Saya akan upgrade semua ini sambil tetap pakai canvas (tidak ganti engine).

## Yang akan diubah

### 1. Karakter Buzu (lebah) — dari kotak kuning → sprite lucu
- Badan bulat dengan stripe hitam-kuning, mata besar, sayap transparan
- Frame animasi: idle (sayap getar), walk (kaki ayun), jump (sayap kepak besar), hurt (kedip merah)
- Sayap di-render terpisah dengan animasi flap cepat (4 frame, ~60ms)
- Arah hadap kiri/kanan (flip horizontal)

### 2. Tile & dunia — dari rectangle solid → tile bertekstur
- **Ground**: rumput hijau di atas + tanah cokelat berlapis (seperti Mario), dengan garis tile halus dan bintik kerikil
- **Platform (`=`)**: papan kayu madu / sarang heksagon dengan border emas
- **Honey drop (`M`)**: tetes madu animasi (bobbing + glow pulse) bukan lingkaran statis
- **Gate (`?`)**: pintu sarang heksagon dengan tanda tanya berputar di atas
- **Goal (`G`)**: sarang lebah besar dengan bendera bergoyang
- **Musuh (`E`)**: sprite laba-laba/lalat sederhana dengan animasi jalan 2-frame

### 3. Background parallax (3 layer)
- Layer jauh: bukit + matahari (gerak 0.2x)
- Layer tengah: pohon + bunga raksasa (gerak 0.5x)
- Layer dekat: rumput depan + bunga kecil (gerak 0.9x)
- Awan animasi melintas pelan

### 4. Efek & juice
- Partikel saat ambil madu (kuning berhamburan)
- Squash & stretch saat lompat & mendarat
- Screen shake kecil saat kena musuh
- Trail kuning samar saat double-flap
- Confetti saat menang level

### 5. UI polish
- HUD dengan ikon (hati pixel, tetes madu, bintang) bukan emoji
- Font display Fredoka dengan outline tebal seperti game retro
- Frame canvas dengan border bergaya kayu/madu

## Cara teknis (singkat, non-teknis bisa skip)

- Tetap pakai Canvas 2D — semua sprite di-**generate procedural** lewat fungsi `drawBee`, `drawTile`, `drawEnemy` dengan path & gradient (tidak perlu file PNG eksternal). Ini lebih ringan dan tetap crisp.
- Tambah `assets.ts` berisi fungsi render untuk tiap entity, dipanggil dari `engine.draw()`.
- Tambah `particles.ts` untuk sistem partikel sederhana (array of `{x,y,vx,vy,life,color}`).
- Background parallax: 3 fungsi `drawBgFar/Mid/Near(ctx, cameraX)`.
- Frame animasi pakai counter `engine.frame % N` untuk pilih pose.

## File yang berubah

```text
src/game/engine.ts        → tambah frame counter, particles, screen shake, squash/stretch
src/game/render.ts (new)  → drawBee, drawTile, drawEnemy, drawHoney, drawGate, drawGoal
src/game/background.ts(new)→ parallax layers (bukit, pohon, awan)
src/game/particles.ts(new)→ sistem partikel
src/components/GameCanvas.tsx → HUD ikon SVG (ganti emoji)
src/styles.css            → font outline utility, sedikit polish
```

## Scope iterasi ini

Fokus ke **visual + juice**, tidak menyentuh gameplay/level/kana logic. Setelah ini Buzu akan terasa hidup dan dunianya layak disebut "platformer cantik".

Boleh saya mulai bangun?