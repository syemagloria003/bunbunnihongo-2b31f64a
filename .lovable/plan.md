Saya akan memperbaiki anchor Sensei dan FAQ dengan arah yang benar:

1. Biarkan anchor **Kelas Dibuka** dan **Testimoni** tetap seperti sekarang karena sudah sesuai.
2. Untuk **Sensei** dan **FAQ**, saya akan membuat posisi hasil klik anchor berhenti lebih atas, bukan lebih bawah.
3. Secara teknis, ini berarti nilai `scroll-mt` untuk `#sensei` dan `#faq` akan **diperkecil** dari posisi sekarang, supaya judul merah “Meet the Sensei” dan “FAQ” berada dekat area atas dengan jarak kecil dari tulisan merah berjalan.
4. Saya hanya akan mengubah class anchor di `src/routes/index.tsx`, tanpa mengubah layout, teks, navbar, marquee/tulisan berjalan, atau section lain.
5. Setelah itu saya akan cek ulang supaya hasilnya tidak kebalik lagi.