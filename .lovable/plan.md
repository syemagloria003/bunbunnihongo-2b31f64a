Saya akan memperbaiki perubahan terakhir yang arahnya terbalik:

1. Biarkan anchor **Kelas Dibuka** dan **Testimoni** tetap seperti sekarang karena sudah benar.
2. Untuk **Sensei** dan **FAQ**, turunkan posisi hasil klik anchor dengan cara **mengurangi offset scroll margin** dari nilai saat ini.
3. Target perubahan: ubah `scroll-mt-32` pada section **Sensei** dan **FAQ** menjadi nilai yang lebih kecil, kemungkinan kembali ke sekitar `scroll-mt-24` agar tidak terlalu naik tapi tetap tidak ketutup running text/header.

Detail teknis:
- File yang akan diubah: `src/routes/index.tsx`
- Perubahan hanya pada class anchor section Sensei dan FAQ.
- Tidak mengubah layout, teks, header, marquee, Kelas Dibuka, atau Testimoni.