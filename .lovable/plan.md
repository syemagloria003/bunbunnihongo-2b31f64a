## Perubahan

**1. Anchor FAQ — naikkan sedikit**
- `src/routes/index.tsx` baris 391: ubah `scroll-mt-4` → `scroll-mt-12` supaya posisi anchor naik sedikit (tidak terlalu turun) tapi tetap di bawah header sticky.

**2. Warning "Hindari Penipuan" jadi running text di header**
- Hapus blok section warning (baris 427–455) yang besar di atas footer.
- Tambah marquee tipis menempel di bawah header sticky (jadi ikut freeze saat scroll, sebaris dengan "Bunbun Nihongo / Beranda / Kelas Dibuka / dll").
- Struktur baru `Header`:
  ```
  <div className="sticky top-0 z-30">
    <header>...</header>               // header existing
    <div role="marquee">…teks berjalan…</div>
  </div>
  ```
- Marquee: background merah lembut, teks kecil (`text-xs`), satu baris, overflow-hidden, animasi `marquee` linear infinite ~40s. Tetap accessible (pause on hover).
- Isi teks (loop, dipisah •):
  > ⚠️ Hindari Penipuan: Pembayaran HANYA via BCA a.n SYEMA GLORIA — 0332170528 • Admin Resmi WhatsApp: +62 895-3286-71000 • Di luar itu bukan tanggung jawab Bunbun Nihongo.

**3. Animasi marquee**
- Tambah keyframes `marquee` di `src/styles.css` (translateX 0 → -50%) + utility class `.animate-marquee` agar bisa dipakai inline. Konten teks digandakan 2x supaya loop mulus.

## Detail teknis
- Marquee container: `overflow-hidden bg-red-500/95 text-white border-b border-red-700/40`
- Inner track: `flex gap-12 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]`
- Tidak mengubah logic lain, tidak ada perubahan backend.
