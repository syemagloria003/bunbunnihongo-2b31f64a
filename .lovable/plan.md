## Perubahan di `src/routes/index.tsx`

### 1. `#kelas` mendarat persis di posisi yang sama dengan `#testimoni`
Saat ini `id="kelas"` ada di `<section>` (yang punya padding `py-8`), sedangkan `id="testimoni"` ada di `<h2>` di dalamnya. Akibatnya saat klik "Kelas Dibuka" heading muncul sedikit lebih ke atas dibanding klik "Testimoni".

Fix: pindahkan `id="kelas"` ke `<h2>` "Kelas yang dibuka 📣" dan beri `scroll-mt-20` — identik dengan setup `#testimoni`. Hapus `id="kelas"` + `scroll-mt-20` dari `<section>`.

### 2. `#sensei` turun sedikit
Naikkan `scroll-mt-20` → `scroll-mt-28` (5rem → 7rem) pada `<section id="sensei">` supaya saat di-anchor, foto Syema Sensei dan card berada lebih ke bawah, sesuai screenshot referensi.

### Catatan
Hanya 2 baris diubah. Tidak ada perubahan layout, hanya posisi scroll-target. Setelah implementasi, akan saya verifikasi dengan klik nav "Kelas Dibuka" dan "Meet The Teacher" di preview.