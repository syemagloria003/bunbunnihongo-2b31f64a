## Penyebab lag

Setelah memeriksa kode, biang lag-nya ada di **tombol joystick on-screen** (`TouchControls` di `src/components/GameCanvas.tsx`) dan tombol bantu di pojok kanan atas:

- Tombol kiri/kanan, tombol lompat, tombol `?`, dan tombol layar penuh semuanya memakai class `backdrop-blur-sm` / `backdrop-blur`.
- Tombol-tombol itu menempel **di atas canvas game yang menggambar ulang setiap frame** (langit animasi, awan, partikel, lebah, dll).
- Setiap frame, browser harus me-render ulang area buram di belakang tombol — efek `backdrop-filter: blur(...)` sangat mahal di HP/laptop kentang dan langsung menurunkan FPS dari ±60 jadi terasa patah-patah.

Game `engine.update()` + `engine.draw()` sendiri sudah dijalankan via `requestAnimationFrame` dengan benar dan tidak ada loop tak terbatas; jadi sumber lag bukan logika game, melainkan efek visual backdrop blur di lapisan UI.

## Yang akan diubah (UI saja)

File: `src/components/GameCanvas.tsx`

1. **TouchControls (← → ↑)**: hapus `backdrop-blur-sm` dari `dirBtn` dan dari tombol lompat. Ganti background semi-transparan menjadi warna solid lembut (mis. `bg-background/85`) supaya tetap terlihat jelas tanpa biaya blur per frame. Pertahankan `shadow-lg/shadow-xl`, `border-2`, dan `active:scale-95` agar tampilan tombol tetap sama.
2. **Tombol `?` dan `⛶` di pojok kanan-atas**: hapus `backdrop-blur` dari kedua tombol, naikkan opacity background (`bg-background/85`) supaya tetap kontras di atas latar canvas.
3. **Tidak menyentuh** logika game, kontrol keyboard, perhitungan benar/salah, tetes madu, HUD, modal kuis, maupun animasi card "Lv BONUS" / "Avatar Langka" yang sudah disepakati sebelumnya.

## Verifikasi

- Pastikan build & typecheck lulus.
- Buka level mana pun di preview, jalankan beberapa detik, gerakkan karakter — gerakan harusnya kembali halus dan tombol joystick tetap terbaca jelas.
