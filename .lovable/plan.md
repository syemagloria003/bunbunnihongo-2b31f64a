## Masalah
Card "Lv BONUS" masih tampil tosca/gelap padahal sudah diberi class Tailwind `bg-gradient-to-br from-violet-600 via-rose-500 to-amber-400`.

Penyebab: di `src/styles.css` ada rule global `.game-theme .honey-card { background: linear-gradient(...) }` yang menimpa kelas Tailwind karena CSS biasa kalah spesifisitas dengan class utility. Akibatnya gradient violet-rose-amber tidak pernah muncul — yang terlihat hanya background default honey-card (kebetulan tampak tosca/gelap di mata).

## Solusi
Bikin varian dedicated `.honey-card.world-bonus` di `src/styles.css` dengan gradient pelangi menyala + glow ungu/magenta/amber, lalu pakai class itu di `BonusAisatsuCard` (gantikan utility Tailwind `bg-gradient-*` yang ter-override).

### Perubahan

1. **`src/styles.css`** — tambah blok baru setelah `.world-meteor`:
   ```css
   .game-theme .honey-card.world-bonus {
     background:
       linear-gradient(135deg,
         oklch(0.55 0.25 300) 0%,    /* violet menyala */
         oklch(0.62 0.26 15) 45%,    /* rose/pink */
         oklch(0.78 0.20 70) 100%);  /* amber/gold */
     border-color: oklch(0.90 0.18 50);
     box-shadow:
       inset 0 1px 0 color-mix(in oklab, white 30%, transparent),
       0 0 0 1px oklch(0.85 0.22 340 / 0.6),
       0 0 30px -2px oklch(0.70 0.28 330 / 0.75),
       0 0 60px -8px oklch(0.78 0.25 60 / 0.55),
       0 18px 45px -14px oklch(0.55 0.25 320 / 0.8);
     animation: bonus-rainbow-pulse 4s ease-in-out infinite;
   }
   @keyframes bonus-rainbow-pulse {
     0%, 100% { filter: saturate(1.05) brightness(1); }
     50%      { filter: saturate(1.35) brightness(1.12); }
   }
   ```

2. **`src/routes/play.tsx`** (di `BonusAisatsuCard`, baris 552-561) — hapus utility Tailwind `bg-gradient-to-br from-violet-600 via-rose-500 to-amber-400 border border-white/20 shadow-[...]` dan ganti dengan `world-bonus`:
   ```tsx
   className={[
     "honey-card world-bonus rounded-2xl p-5 transition-all relative overflow-hidden",
     "hover:-translate-y-1 cursor-pointer",
   ].join(" ")}
   ```

Tulisan "🎁 Avatar Langka" yang sudah pakai `animate-tease-glow` dibiarkan apa adanya.

## Tidak diubah
- Struktur card (LevelPreview, badge, judul, deskripsi, bintang) tetap sama
- Animasi `tease-glow` pada "Avatar Langka" tetap
- Card level lain tidak terdampak (kelas `world-bonus` baru, tidak mengganggu garden/crystal/meteor)
