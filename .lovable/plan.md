# Plan: Login Khusus Murid + Admin Panel

Pakai **Lovable Cloud** (built-in, no cPanel/PHP). Lebih simpel: kamu cuma perlu klik Publish, semua sudah jalan.

## Cara kerja

- **Bukan signup terbuka.** Murid TIDAK bisa daftar sendiri.
- **Hanya kamu (admin)** yang bisa bikin akun murid dari halaman Admin.
- Murid login pakai email + password yang kamu kasih.
- Skor otomatis tersimpan ke database Lovable Cloud, leaderboard real-time.

## Email admin

Kamu kasih tahu aku 1 email yang mau jadi admin (misal `syema@bunbun.com`). Email itu yang punya akses ke halaman `/admin`.

## Yang akan aku buat

### 1. Aktifkan Lovable Cloud
Database + Auth + Storage langsung jalan, tanpa setup.

### 2. Database
- `profiles` — nama lengkap murid, email
- `user_roles` — siapa admin, siapa murid (pakai pola aman, bukan di profile)
- `scores` — skor + tanggal main + level

### 3. Halaman
- `/login` — form login email + password
- `/` — game (wajib login)
- `/leaderboard` — ranking real-time top 20
- `/admin` — **khusus admin**: form tambah murid (nama, email, password), list semua murid, hapus murid, reset password murid

### 4. Auth Guard
- Belum login → auto redirect ke `/login`
- Bukan admin buka `/admin` → ditolak
- Signup publik dimatikan (cuma admin yang bisa create user via admin panel)

### 5. Hapus barang PHP/cPanel
Folder `cpanel/`, `PANDUAN-UPLOAD.md`, file `src/game/leaderboard.ts` versi PHP — semua dibuang karena nggak dipakai lagi.

## Setelah selesai

Tinggal klik tombol **Publish** di Lovable, game langsung live di URL `bunbunnihongo-kana-game.lovable.app`. Nggak perlu upload ke cPanel, nggak perlu phpMyAdmin.

## Yang aku butuh dari kamu

1. **Email admin** kamu (yang akan jadi satu-satunya akun yang bisa tambah murid)
2. Konfirmasi: oke hapus semua file PHP/cPanel yang sudah dibuat sebelumnya?

Begitu kamu approve plan ini dan kasih email admin, aku langsung kerjakan.
