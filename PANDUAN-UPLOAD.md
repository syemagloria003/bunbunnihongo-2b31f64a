# 📦 PANDUAN UPLOAD KE CPANEL — BUNBUN NIHONGO GAME

Panduan lengkap upload game kana ke `bunbunnihongo.my.id/game/` dengan login terintegrasi PHP + leaderboard real-time MySQL.

---

## 🗂️ Yang sudah aku siapkan

Di folder `cpanel/` proyek ini ada:

```
cpanel/
├── index.php           ← Guard login + serve game
├── .htaccess           ← SPA routing + blokir akses langsung
├── schema.sql          ← SQL untuk bikin tabel scores
└── api/
    ├── me.php          ← Endpoint: data user login
    ├── save-score.php  ← Endpoint: simpan skor
    └── leaderboard.php ← Endpoint: ambil ranking
```

---

## 🛠️ Langkah 1 — Build game di komputer kamu

> Karena hosting LiteSpeed tidak bisa jalanin Node.js, kita harus build dulu di komputer biar jadi HTML+CSS+JS murni.

### 1a. Install Node.js (kalau belum)

Download dari https://nodejs.org → pilih versi LTS → install.

### 1b. Download project ini

- Di Lovable, klik **GitHub** → Connect → push ke repo, lalu clone, ATAU
- Klik **⋯ → Download ZIP** → extract.

### 1c. Aktifkan mode SPA (penting!)

Buka `vite.config.ts` di project, ganti isinya jadi:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/game/",
  },
  tanstackStart: {
    spa: { enabled: true },
    server: { entry: "server" },
  },
});
```

**Catatan:**
- `base: "/game/"` → karena game akan diletakkan di subfolder `/game/`. Kalau kamu mau folder lain (misal `/kana/`), ganti di sini DAN di `cpanel/.htaccess` (baris `RewriteBase`).
- `spa: { enabled: true }` → bilang TanStack Start untuk build static, bukan server.

### 1d. Build

Buka terminal di folder project:

```bash
npm install
npm run build
```

Tunggu sampai selesai. Hasilnya ada di folder `dist/` (atau `.output/public/`, tergantung versi).

### 1e. Rename `index.html` → `game.html`

Di folder hasil build, **rename** file `index.html` menjadi `game.html`.

Kenapa? Karena `index.php` (guard) yang akan dibaca duluan oleh Apache, lalu dia yang serve `game.html` setelah cek login. Kalau dua-duanya bernama `index.*`, akan bentrok.

---

## 🛠️ Langkah 2 — Setup database di cPanel

1. Login cPanel → **phpMyAdmin**
2. Pilih database yang sama dengan login.php-mu (yang ada tabel `users`)
3. Klik tab **SQL**
4. Copy-paste isi file `cpanel/schema.sql`
5. Klik **Go**

Cek tab **Structure** — harus muncul tabel baru `scores`.

---

## 🛠️ Langkah 3 — Upload ke cPanel

### 3a. Buat folder `game/`

cPanel → **File Manager** → masuk ke `public_html/` → klik **+ Folder** → nama: `game`

### 3b. Upload hasil build

Masuk ke folder `game/`. Upload SEMUA isi folder `dist/` (atau `.output/public/`) ke sini.

Strukturnya jadi:
```
public_html/
├── login.php          (sudah ada)
├── dashboard.php      (sudah ada)
├── config.php         (sudah ada)
└── game/              (baru)
    ├── game.html      ← hasil rename index.html
    ├── assets/        ← JS, CSS
    └── ... (file lain dari build)
```

### 3c. Upload file PHP & .htaccess

Masuk folder `game/`, upload dari folder `cpanel/` proyekmu:

| Upload ke              | File                    |
| ---------------------- | ----------------------- |
| `public_html/game/`    | `index.php`             |
| `public_html/game/`    | `.htaccess`             |
| `public_html/game/api/`| `me.php`                |
| `public_html/game/api/`| `save-score.php`        |
| `public_html/game/api/`| `leaderboard.php`       |

> File `.htaccess` mulai dengan titik — kalau di File Manager tidak kelihatan, klik **Settings** → centang **Show Hidden Files**.

> Buat folder `api/` dulu di dalam `game/` sebelum upload 3 file PHP-nya.

### 3d. Cek path `config.php` di file PHP

Aku asumsikan `config.php` ada di `public_html/`. File-file PHP-ku akan `include("../config.php")` (untuk `index.php`) dan `include("../../config.php")` (untuk file di `api/`).

Kalau `config.php` di tempat lain, edit baris `include_once(...)` di:
- `cpanel/index.php` baris 19
- `cpanel/api/save-score.php` baris 25
- `cpanel/api/leaderboard.php` baris 20

---

## 🛠️ Langkah 4 — Tambah link di dashboard.php

Buka `dashboard.php` di File Manager, tambah tombol/link:

```html
<a href="game/" class="tombol-game">
  🎮 Main Game Kana
</a>
```

---

## ✅ Langkah 5 — Test!

1. Buka `https://bunbunnihongo.my.id/game/` di browser **incognito** (biar belum login)
2. Harus auto-redirect ke `login.php` ✓
3. Login pakai akun murid → kembali buka `/game/`
4. Game muncul, di atas ada tulisan "🐝 Halo, [Nama]!" ✓
5. Main satu level sampai menang
6. Buka `/game/leaderboard` — skormu harus muncul ✓
7. Suruh murid lain main juga → leaderboard auto-refresh tiap 10 detik

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---|---|
| Buka `/game/` malah 404 | Cek `.htaccess` ter-upload dan `mod_rewrite` aktif (biasanya default di LiteSpeed) |
| Halo "[Nama]" tidak muncul | Buka `/game/api/me.php` di browser — harus return JSON. Kalau 500, cek error di cPanel → Error Log |
| Skor tidak masuk database | Buka DevTools (F12) → tab Network → main game sampai menang → cek apakah request ke `save-score.php` return `{ok: true}` |
| Leaderboard kosong terus | Cek tabel `scores` di phpMyAdmin — apakah ada baris masuk? Kalau tidak, masalah di `save-score.php` (lihat baris atas) |
| Refresh `/game/leaderboard` jadi 404 | `.htaccess` belum aktif. Hubungi support hosting untuk aktifkan `mod_rewrite` |
| "include failed" error | Path `config.php` salah — sesuaikan langkah 3d |

---

## 🔄 Update game di masa depan

Tiap kali kamu edit game di Lovable:
1. Download project lagi (atau `git pull`)
2. `npm run build`
3. Rename `index.html` → `game.html`
4. Upload ulang HANYA folder hasil build ke `public_html/game/` (overwrite)
5. **JANGAN** overwrite file `.php` dan `.htaccess` — biarkan apa adanya

---

## 🎯 Cara kerja singkat (untuk paham arsitekturnya)

```
Murid buka bunbunnihongo.my.id/game/
        ↓
Apache cari index.html → tidak ada, ada index.php
        ↓
index.php cek $_SESSION["email"]
   ├─ belum login → redirect ke login.php
   └─ sudah login → output isi game.html (game React)
        ↓
Game React di browser fetch /game/api/me.php
        ↓ JSON
"Halo, [Nama]!" tampil
        ↓
Murid main → menang → fetch POST /game/api/save-score.php
        ↓
PHP cek session lagi → INSERT ke MySQL
        ↓
Murid buka /game/leaderboard → fetch /game/api/leaderboard.php
        ↓ JSON top 20
Tampil ranking, refresh tiap 10 detik
```

Selesai. Happy mengajar! 🐝🍯
