# Membuka Arc Katakana

## Masalah saat ini
Setelah menamatkan Ratu Tawon dan mendapat 💎 Kristal, kartu Katakana di peta tetap terkunci. Penyebabnya: `KATAKANA_LEVELS_PREVIEW` di `src/game/levels.ts` cuma 3 entri preview dan di `src/routes/play.tsx` di-hardcode `unlocked={false}` dengan label "SEGERA". Belum ada level Katakana yang benar-benar bisa dimainkan.

## Tujuan
- Tambahkan **7 level Katakana** yang strukturnya mirror Hiragana.
- Sisipkan **chōonpu (ー)** — tanda perpanjangan vokal seperti ケーキ (keeki), コーヒー (koohii) — di level Dakuon (level Katakana ke‑6), supaya kata memanjang ikut diuji.
- Kristal dari Ratu Tawon **otomatis membuka** Katakana level 1.
- Cukup suasana + huruf baru; mekanik gameplay tetap sama.

## Struktur 7 Level Katakana

| # | id | Nama | Suasana | Kana pool |
|---|----|------|---------|-----------|
| 1 | k1 | Gua Kristal | gua biru berkilau | vokal + K |
| 2 | k2 | Lautan Bintang | laut malam berbintang | + S, T |
| 3 | k3 | Awan Nebula | langit ungu nebula | + N, H |
| 4 | k4 | Padang Salju | tundra putih‑biru | + M, Y |
| 5 | k5 | Reruntuhan Perak | reruntuhan metalik | + R, W |
| 6 | k6 | Sarang Komet | merah‑oranye komet | + Dakuon/Handakuon **+ chōonpu (ー)** → kata memanjang seperti ケーキ, コーヒー, ビール |
| 7 | k7 | Ratu Bintang | nebula gelap, boss final | + Youon + Sokuon (semua) |

Palette `bg`/`ground` per level disesuaikan suasananya (dingin/kristal di awal, makin hangat ke arah boss).

## Yang perlu diubah

### 1. `src/game/kana-data.ts`
- Tambah set Katakana lengkap (gojuuon, dakuon, handakuon, youon, sokuon ッ) dengan `type: "katakana"`.
- Tambah penanda chōonpu `ー` sebagai entri khusus (atau group `"choon"`).

### 2. `src/game/words.ts`
- `generateWords` untuk pool yang berisi `ー` harus menyisipkan `ー` setelah kana bervokal (mis. ケ + ー → ケー, lalu + キ → ケーキ).
- Romaji target ikut memanjang: `ke` + `ー` → `kee`. Opsi jawaban tetap dibuat oleh `makeOptionsForWord` tapi membaca panjang yang sudah benar.
- Jaminan "setiap kana keluar minimal sekali" tetap berlaku, dan saat pool memuat `ー`, minimal 1 kata memanjang muncul.

### 3. `src/game/levels.ts`
- Tambah `KATAKANA_LEVELS: LevelDef[]` berisi 7 entri di atas (pakai helper `genTiles` yang sudah ada, panjang/pits naik bertahap mirip Hiragana).
- Update `nextLevelId` supaya setelah `7` (Ratu Tawon) lanjut ke `k1`, dan `k7` jadi level terakhir.
- Tambah `isFinalLevel` varian untuk `k7` (boss Katakana) — beri reward khusus (mis. 💎 Kristal Bintang) atau cukup layar tamat.
- Hapus/ganti `KATAKANA_LEVELS_PREVIEW`.

### 4. `src/game/progress.ts`
- Saat `crystal === true`, otomatis tambahkan `"k1"` ke `unlocked` (lakukan migrasi ringan di `loadProgress`).
- `completeLevel` untuk level Katakana ikut aturan ≥3⭐ untuk buka level berikutnya, sama seperti Hiragana.

### 5. `src/routes/play.tsx`
- Render `LEVELS` + `KATAKANA_LEVELS` dengan logika `unlocked` yang sama (baca dari `progress.unlocked`), bukan hardcoded `false`.
- Pisahkan jadi 2 section visual: **Taman Hiragana 🌻** dan **Dunia Kristal 💎** (section kedua hanya muncul kalau `p.crystal` true, atau tetap muncul tapi terkunci dengan ikon 🔒 sebelum kristal didapat).
- Hapus label "SEGERA".

### 6. `src/components/GameCanvas.tsx`
- Tidak ada perubahan mekanik. Pastikan `nextLevelId` dari engine sudah mengarah ke level Katakana setelah Ratu Tawon, supaya tombol "Level berikutnya →" otomatis lompat ke Gua Kristal.

## Di luar scope
- Tidak menambah mekanik baru (es licin, kristal pecah, bos terbang, dll).
- Tidak mengubah engine/fisika, audio, atau sistem partikel.
- Tidak menambah aset gambar eksternal — semua tetap procedural Canvas.
