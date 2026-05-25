import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Cara Main — BeeGana" },
      { name: "description", content: "Cara bermain BeeGana dan pengenalan singkat Hiragana & Katakana." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold hover:text-primary">← Beranda</Link>
          <h1 className="font-display text-3xl font-bold">Cara Main</h1>
          <div className="w-16" />
        </div>

        <section className="honey-card rounded-2xl p-5">
          <h2 className="font-display text-xl font-bold mb-2">🎮 Kontrol</h2>
          <ul className="text-sm space-y-1.5">
            <li><kbd className="px-2 py-0.5 bg-muted rounded">←</kbd> <kbd className="px-2 py-0.5 bg-muted rounded">→</kbd> — bergerak</li>
            <li><kbd className="px-2 py-0.5 bg-muted rounded">Space</kbd> / <kbd className="px-2 py-0.5 bg-muted rounded">↑</kbd> — lompat. Tekan dua kali untuk <em>double flap</em> sayap.</li>
            <li>Stomp musuh dari atas. Jangan kena dari samping!</li>
            <li>Kumpulkan tetes madu 🍯 untuk skor.</li>
          </ul>
        </section>

        <section className="honey-card rounded-2xl p-5">
          <h2 className="font-display text-xl font-bold mb-2">🚪 Kana Gate</h2>
          <p className="text-sm">
            Pintu bertanda <strong>?</strong> akan menampilkan satu karakter Hiragana atau Katakana.
            Pilih romaji yang benar untuk membukanya. <strong>Salah jawab = kehilangan 1 hati ❤️</strong>.
          </p>
        </section>

        <section className="honey-card rounded-2xl p-5">
          <h2 className="font-display text-xl font-bold mb-2">🈂️ Tentang Kana</h2>
          <p className="text-sm mb-3">
            Bahasa Jepang punya dua sistem aksara fonetik dasar:
          </p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-background rounded-xl p-3 border-2 border-border">
              <div className="text-3xl mb-1" style={{ fontFamily: "serif" }}>あいうえお</div>
              <div className="text-xs font-bold">Hiragana</div>
              <div className="text-xs text-muted-foreground">untuk kata Jepang asli</div>
            </div>
            <div className="bg-background rounded-xl p-3 border-2 border-border">
              <div className="text-3xl mb-1" style={{ fontFamily: "serif" }}>アイウエオ</div>
              <div className="text-xs font-bold">Katakana</div>
              <div className="text-xs text-muted-foreground">untuk kata serapan</div>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Link to="/play" className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105">
            🎮 Siap Main!
          </Link>
        </div>
      </div>
    </div>
  );
}
