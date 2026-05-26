## Tujuan

Game kana Bunbun Nihongo bisa dijalankan di hosting cPanel-mu, hanya bisa diakses murid yang sudah login lewat `login.php`-mu, dan punya **leaderboard real-time** yang menampilkan ranking skor antar murid biar mereka semangat saling salip.

---

## Arsitektur akhir

```
┌─────────────────────────────────────────────────────────┐
│  cPanel bunbunnihongo.my.id                             │
│                                                         │
│  /login.php        ← (sudah ada, tidak diubah)          │
│  /dashboard.php    ← (sudah ada, tambah link ke game)   │
│  /config.php       ← (sudah ada)                        │
│                                                         │
│  /game/            ← FOLDER BARU                        │
│    ├── index.php   ← guard: cek session, lalu render    │
│    │                  game.html                         │
│    ├── game.html   ← hasil build React (di-rename       │
│    │                  dari dist/index.html)             │
│    ├── assets/     ← JS, CSS, gambar dari build         │
│    ├── api/                                             │
│    │   ├── me.php       ← return JSON nama user login   │
│    │   ├── save-score.php ← simpan skor ke MySQL        │
│    │   └── leaderboard.php ← ambil top 20 skor          │
│    └── .htaccess   ← SPA routing fallback               │
└─────────────────────────────────────────────────────────┘
```

Game React jadi static SPA (HTML+JS+CSS murni), dibungkus PHP guard. Komunikasi data lewat 3 endpoint PHP.

---

## Bagian 1 — Perubahan di project React (Lovable)

### 1.1 Hapus auth React
- Hapus `src/routes/login.tsx` (kalau ada) dan semua kode auth React
- Hapus `_authenticated/` layout dan pindahkan halaman game ke route publik (karena perlindungan sekarang dari PHP, bukan React)
- Hapus integrasi Lovable Cloud / Supabase kalau dipakai untuk auth

### 1.2 Ubah jadi SPA static
- Ganti config Vite jadi mode SPA (bukan SSR)
- Build output: 1 `index.html` + folder `assets/`
- Atur `base` di Vite config jadi `/game/` supaya path asset benar di subfolder

### 1.3 Fitur baru: tampilan nama user + skor + leaderboard
- Saat game load, fetch `api/me.php` → tampilkan "Halo, [Nama]!"
- Saat game selesai, fetch `api/save-score.php` dengan skor
- Halaman/komponen Leaderboard: fetch `api/leaderboard.php` setiap 10 detik (polling) → tampilkan top 20 skor real-time
- Tombol "Leaderboard" di menu utama game

### 1.4 Routing
- Hapus React Router auth guard
- Tambah route `/leaderboard` untuk halaman ranking

---

## Bagian 2 — File PHP yang aku buatkan (tinggal copas)

### 2.1 `game/index.php` (guard)
Cek session, kalau belum login redirect ke `../login.php`. Kalau sudah login, baca `game.html` dan output-kan.

### 2.2 `game/api/me.php`
Return JSON: `{"nama": "Syema", "email": "syema@bunbun.com"}` dari session. Game pakai ini untuk tampilkan nama.

### 2.3 `game/api/save-score.php`
Terima POST `{score: 85}`. Cek session. Insert ke tabel `scores` (email, nama, skor, tanggal). Aman dari SQL injection (prepared statement).

### 2.4 `game/api/leaderboard.php`
Return JSON top 20 skor tertinggi all-time: `[{nama, skor, tanggal}, ...]`. Bisa difilter mingguan/harian nanti kalau mau.

### 2.5 `game/.htaccess`
SPA fallback supaya refresh halaman tidak 404, dan blokir akses langsung ke `game.html`.

---

## Bagian 3 — SQL yang kamu jalankan di phpMyAdmin

Satu tabel baru di database yang sama:

```sql
CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  skor INT NOT NULL,
  tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_skor (skor DESC),
  INDEX idx_email (email)
);
```

---

## Bagian 4 — Panduan upload (akan aku tulis di file `PANDUAN-UPLOAD.md`)

Langkah-langkah untuk kamu:

1. Download project dari Lovable (tombol GitHub atau Download ZIP)
2. Di komputer: jalankan `npm install` lalu `npm run build`
3. Buka folder `dist/` hasil build
4. Rename `dist/index.html` → `game.html`
5. Login cPanel → File Manager → buat folder baru `game/` di `public_html`
6. Upload isi `dist/` ke folder `game/`
7. Upload 5 file PHP yang aku buatkan ke folder `game/` dan `game/api/`
8. Buka phpMyAdmin → jalankan SQL di Bagian 3
9. Edit `dashboard.php`: tambah link `<a href="game/">Main Game Kana</a>`
10. Test: `bunbunnihongo.my.id/game/` → harus redirect ke login kalau belum login

---

## Yang mungkin perlu kamu siapkan

- **Path database**: file PHP-ku akan `include("../config.php")` — pastikan `config.php` ada di `public_html/`. Kalau di tempat lain, kasih tahu aku path-nya
- **Nama kolom di tabel `users`**: aku asumsikan `email`, `nama_lengkap`, `password`, `status`, `expired_date` (sesuai kode yang kamu kirim). Kalau beda, kasih tahu
- **Node.js & npm di komputer kamu** untuk build. Kalau belum punya, nanti aku kasih instruksi install

---

## Yang TIDAK termasuk di plan ini (bisa ditambah nanti)

- Filter leaderboard per minggu/bulan
- Admin panel lihat semua skor murid
- Achievement / badge
- Statistik per huruf kana

Setelah kamu approve, aku langsung kerjakan semuanya dalam 1 batch: ubah project React + bikin file PHP + tulis panduan upload.