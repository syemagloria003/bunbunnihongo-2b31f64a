import { createFileRoute, Link } from "@tanstack/react-router";
import { UserGreeting } from "@/components/UserGreeting";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeeGana — Petualangan Lebah Belajar Hiragana & Katakana" },
      { name: "description", content: "Game platformer lucu di mana lebah Buzu belajar Hiragana dan Katakana lewat petualangan di taman bunga." },
      { property: "og:title", content: "BeeGana — Belajar Kana sambil Main" },
      { property: "og:description", content: "Lompat, kumpulkan madu, jawab kana, taklukkan tiap level." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <section className="max-w-3xl text-center">
          <UserGreeting />
          <div className="float-bee inline-block text-7xl md:text-8xl mb-4">🐝</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Bee<span className="text-primary">Gana</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            Petualangan lebah lucu di taman bunga & sarang madu.
          </p>
          <p className="text-base md:text-lg text-foreground/80 mb-8">
            Lompat, kumpulkan tetes madu, dan buka <strong>Kana Gate</strong> dengan menjawab
            Hiragana & Katakana yang benar. <em>Belajar sambil main!</em>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/play"
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105 transition wiggle"
            >
              🎮 Mulai Main
            </Link>
            <Link
              to="/leaderboard"
              className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10 transition"
            >
              🏆 Peringkat
            </Link>
            <Link
              to="/practice"
              className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10 transition"
            >
              📝 Latihan Kana
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-2xl border-2 border-border bg-background font-bold text-lg hover:bg-muted transition"
            >
              ℹ️ Cara Main
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-14 max-w-4xl w-full">
          <Feature icon="🌼" title="5 Level + Boss" desc="Padang Bunga, Hutan Madu, Sarang, Gua Kristal, Langit Senja." />
          <Feature icon="🍯" title="Kumpul Madu" desc="Tetes madu = poin. Cari rute tersembunyi untuk skor maksimal." />
          <Feature icon="🈂️" title="Belajar Kana" desc="Tiap pintu menguji bacaan kana. Salah jawab? Hilang 1 hati!" />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="honey-card rounded-2xl p-5">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Header() {
  return (
    <header className="px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-display font-bold text-2xl flex items-center gap-2">
        <span className="text-3xl">🐝</span> BeeGana
      </Link>
      <nav className="flex gap-3 text-sm font-semibold">
        <Link to="/play" className="hover:text-primary">Main</Link>
        <Link to="/leaderboard" className="hover:text-primary">Peringkat</Link>
        <Link to="/practice" className="hover:text-primary">Latihan</Link>
        <Link to="/about" className="hover:text-primary">Tentang</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-6 text-center text-xs text-muted-foreground">
      Dibuat dengan 🍯 untuk pembelajar Bahasa Jepang.
    </footer>
  );
}
