# Rebrand: BeeGana → Bunbun Nihongo

## Tujuan
Ganti semua tulisan "BeeGana" jadi **Bunbun Nihongo** dengan sub judul **"Kursus Online Bahasa Jepang"**, dan pasang logo lebah orange yang kamu upload sebagai logo resmi.

## Yang akan diubah

### 1. Pasang logo
- Copy `logo_compressed-2.jpeg` ke `src/assets/logo-bunbun.jpg` (dipakai di komponen React, di-import sebagai modul).
- Copy juga ke `public/logo-bunbun.jpg` + jadikan `favicon` di `__root.tsx` (biar tab browser pakai logo lebah, bukan icon default).

### 2. Halaman & teks (ganti "BeeGana" → "Bunbun Nihongo")
- **`src/routes/index.tsx`** (landing): ganti emoji 🐝 di hero jadi `<img>` logo besar, judul "Bunbun Nihongo", sub judul "Kursus Online Bahasa Jepang", update meta title/description/og. Footer/header kecil juga ganti logo + nama.
- **`src/routes/login.tsx`**: ganti header "Bee Gana" jadi logo + "Bunbun Nihongo" + sub judul kecil "Kursus Online Bahasa Jepang". Update meta title.
- **`src/routes/about.tsx`**: ganti judul & meta "BeeGana" → "Bunbun Nihongo".
- **`src/routes/__root.tsx`**: update meta global (title, og:title, twitter:title, description) jadi "Bunbun Nihongo — Kursus Online Bahasa Jepang", tambah `<link rel="icon">` ke logo.

### 3. Konsistensi
Sapuan terakhir: `rg -i "beegana|bee gana"` untuk memastikan tidak ada sisa.

## Yang TIDAK diubah
- Logika game, database, auth, level — semua tetap.
- Nama internal mascot "Buzu" di game tetap (atau mau ganti juga? bilang saja).
- Tema warna saat ini tetap. Kalau mau palette diselaraskan dengan orange logo, bisa di putaran berikutnya.

## Catatan
- Logo aslinya sudah memuat tulisan "BUNBUN NIHONGO" — jadi di hero saya tampilkan **logo besar** lalu sub judul "Kursus Online Bahasa Jepang" di bawahnya (tidak menulis ulang "Bunbun Nihongo" di samping logo supaya tidak dobel).
- Di tempat kecil (header navigasi, footer, login card) saya pakai logo kecil + teks "Bunbun Nihongo" karena tulisan di dalam logo tidak terbaca di ukuran kecil.

Klik **Implement plan** kalau sudah oke.
