# Animasi Urutan Goresan Kanji

Menampilkan animasi cara menulis kanji (urutan goresan yang benar) di dalam `KanaGateModal` saat pemain bertemu gerbang di level kanji. Auto-play, bisa di-replay, tanpa interaksi tracing.

## Sumber data: KanjiVG

KanjiVG menyediakan file SVG per-kanji dengan tiap `<path>` adalah satu goresan, sudah berurutan. Lisensi CC BY-SA 3.0 (cukup dengan atribusi di halaman About).

Hanya ~130 kanji yang dipakai game ini (level kn1–kn9), jadi kita **bundle subset KanjiVG** ke dalam project, bukan semua 11.000 file.

## Yang akan dibangun

1. **Skrip build subset KanjiVG** (`scripts/fetch-kanjivg.mjs`)
   - Baca semua karakter dari `src/game/kanji-data.ts`.
   - Untuk tiap kanji, ambil file SVG dari repo KanjiVG (GitHub raw / release zip) berdasarkan codepoint hex (mis. `5c71.svg` untuk 山).
   - Simpan SVG yang sudah dibersihkan ke `src/assets/kanjivg/<hex>.svg`.
   - Dijalankan manual sekali (`bun run scripts/fetch-kanjivg.mjs`), hasilnya di-commit.

2. **Komponen `<KanjiStrokeOrder />`** (`src/components/KanjiStrokeOrder.tsx`)
   - Props: `char: string`, `size?: number`, `speed?: number`.
   - Load SVG via Vite glob import (`import.meta.glob('@/assets/kanjivg/*.svg', { as: 'raw', eager: true })`) → tidak ada fetch runtime.
   - Parse SVG, ambil grup `<g id="kvg:StrokePaths_...">`, untuk tiap `<path>` set `stroke-dasharray = pathLength` + `stroke-dashoffset = pathLength`, lalu animasi `stroke-dashoffset → 0` berurutan via CSS animation + `animation-delay`.
   - Goresan yang sudah selesai tetap tampak (stroke hitam solid); goresan berikutnya muncul dengan warna aksen lalu memudar ke hitam.
   - Tombol kecil “▶ ulangi” untuk replay (re-mount via key).
   - Nomor urut goresan opsional (dari grup `<text id="kvg:StrokeNumbers_...">` yang sudah ada di KanjiVG) — bisa di-toggle.

3. **Integrasi di `KanaGateModal.tsx`**
   - Hanya saat `mode === "kanji"`.
   - Tampilkan `<KanjiStrokeOrder char={word.kana} />` di atas opsi jawaban, di samping kanji besar.
   - Auto-play sekali begitu modal terbuka, lalu diam sampai user klik replay.
   - Tidak mengubah logika jawaban — murni visual.

4. **Fallback**
   - Jika SVG untuk karakter tidak ada di bundle (mis. kanji baru ditambah tapi belum di-fetch), komponen menampilkan kanji statis besar tanpa animasi dan tidak error.

5. **Atribusi**
   - Tambah satu baris kredit “Data goresan: KanjiVG (CC BY-SA 3.0)” di `src/routes/about.tsx`.

## Detail teknis

- **Ukuran bundle**: ~130 SVG × rata-rata 3–6 KB = ~0.5–1 MB mentah, ~150–300 KB setelah gzip. Acceptable.
- **Tidak butuh library tambahan** (tanpa hanzi-writer). DOMParser bawaan browser cukup untuk parse SVG.
- **Animasi pakai CSS murni** (`@keyframes draw`) bukan JS rAF, supaya hemat CPU saat modal terbuka.
- **Tidak menyentuh** `engine.ts`, `levels.ts`, `progress.ts`, atau logika game lainnya.

## File yang akan diubah/dibuat

- created  `scripts/fetch-kanjivg.mjs`
- created  `src/assets/kanjivg/*.svg` (subset, ~130 file)
- created  `src/components/KanjiStrokeOrder.tsx`
- edited   `src/components/KanaGateModal.tsx` (tampilkan komponen saat mode kanji)
- edited   `src/routes/about.tsx` (atribusi KanjiVG)

## Di luar scope (bisa nanti)

- Mode tracing dengan mouse/jari.
- Kuis “tebak goresan berikutnya”.
- Halaman practice goresan terpisah.
- Animasi goresan untuk hiragana/katakana (KanjiVG juga punya data kana, mudah diperluas nanti).
