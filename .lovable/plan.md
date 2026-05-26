## Tujuan

Buat dunia Katakana konsisten seperti Taman Hiragana — satu identitas visual ("Gua Kristal") di seluruh 7 level, dengan **hanya langit (sky gradient + cahaya)** yang berubah per level untuk menandai progres. Tema lain (Lautan Bintang, Nebula, Salju, Reruntuhan, Komet, Void) **disimpan** untuk arc Kanji di masa depan, tidak dihapus.

## Perubahan

### 1. `src/game/levels.ts`
- Semua 7 level Katakana (`k1`–`k7`) → `theme: "crystal_cave"`.
- Nama level tetap sama (Gua Kristal, Lautan Bintang, dst.) — narasi tetap, hanya skin yang seragam. *(Atau: rename semuanya jadi varian Gua Kristal — tunggu konfirmasi, default: nama tetap.)*
- Field `bg` per level diisi gradient langit unik (7 variasi) — dipakai sebagai overlay sky, mirip cara `LEVELS` Hiragana punya `bg` berbeda-beda meski tema sama.

### 2. `src/game/themes.ts`
- Tema `crystal_cave` **dipoles** agar setara Taman Hiragana yang berwarna-warni:
  - Tambah aksen warna (cyan + ungu + pink lembut) pada kristal mid-layer.
  - Coin kristal lebih cerah & berkilau (glow lebih kuat).
  - Stalactite/stalagmite far-layer dapat highlight glow tepi.
  - Foreground crystal shards lebih rapat & sedikit warna-warni.
  - Cap/grass band tetap kosong (gua tidak punya rumput) — tapi tambah "moss glow" tipis di atas ground supaya tidak terasa gersang.
- Tema lain (`starry_sea`, `nebula_sky`, `snow_field`, `silver_ruins`, `comet_nest`, `cosmic_void`) **dibiarkan utuh** di file — siap dipakai untuk Kanji nanti. Tipe `WorldTheme` tidak berubah.

### 3. `src/game/background.ts` — fungsi `drawSky`
- Tambah parameter opsional `bgOverride?: string` (gradient CSS) **atau** baca `level.bg` dan parse top/bottom warna untuk override `skyTop`/`skyBottom` saat menggambar.
- Pendekatan paling rapi: ubah `drawSky(ctx, w, h, theme, t, skyOverride?: {top:string, bottom:string})`. Jika ada override, pakai itu; jika tidak, pakai palet tema.
- `lightStyle` (crystal) tetap dari tema → cahaya kristal yang sama di semua level untuk identitas.

### 4. `src/game/engine.ts`
- Saat memanggil `drawSky`, parse `this.level.bg` (format `linear-gradient(180deg, #aaa 0%, #bbb 100%)`) → ekstrak dua warna hex → kirim sebagai override.
- Helper kecil `parseBgGradient(bg: string)` di engine atau themes.ts.

### 5. Variasi langit per level Katakana (7 gradien)
Progresi dari terang → gelap → magis, semua tetap "feels like crystal cave":

| Level | Nama | bg (top → bottom) |
|---|---|---|
| k1 | Gua Kristal | `#0a1a3a → #4a7ab8` (biru gua dasar) |
| k2 | Lorong Safir | `#0a1438 → #2a5a9a` (lebih dalam) |
| k3 | Aula Ametis | `#1a0a3a → #6a3aa0` (semburat ungu) |
| k4 | Sungai Es | `#0a2a4a → #7ac8e8` (sejuk cyan terang) |
| k5 | Kubah Berlian | `#0a1a4a → #b8d0ff` (langit terang berkilau) |
| k6 | Inti Geode | `#1a0828 → #8a3acf` (ungu pekat) |
| k7 | Tahta Kristal | `#050a28 → #c89aff` (boss — magis) |

Nama bisa di-rename agar narasi konsisten "satu dunia gua". *Default: rename ke daftar di atas; bilang kalau mau pertahankan nama lama.*

### 6. `src/game/render.ts` & `src/game/particles.ts`
- Tidak diubah. Sudah pakai `theme` → otomatis konsisten Gua Kristal.

## Yang TIDAK diubah

- Mekanik gameplay, level layout, kana groups, modal gate, Buzu, musuh.
- Struktur tipe `WorldTheme` (semua tema lain tetap ada untuk Kanji).
- Tema Hiragana `garden`.

## Hasil

Pemain naik level Katakana → suasana Gua Kristal konsisten (stalactite, kristal, partikel kristal), tapi **langitnya berubah** seperti progres warna langit di taman Hiragana. Ide tema dunia lain aman tersimpan di `themes.ts` untuk dipakai pada arc Kanji.
