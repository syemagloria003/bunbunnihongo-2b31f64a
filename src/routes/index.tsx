import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/bunbun-logo.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bunbun Nihongo Kana's Game — Belajar Hiragana & Katakana" },
      { name: "description", content: "Game platformer lebah lucu untuk belajar Hiragana dan Katakana." },
      { property: "og:title", content: "Bunbun Nihongo Kana's Game" },
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
          <img src={logo} alt="Bunbun Nihongo" className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-xl mb-4 wiggle" />
          <h1 className="text-4xl md:text-6xl font-bold mb-3 font-display">
            Bunbun Nihongo <span className="text-primary">Kana's Game</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            Petualangan lebah Buzu di taman bunga & sarang madu.
          </p>
          <p className="text-base md:text-lg text-foreground/80 mb-8">
            Lompat, kumpulkan tetes madu, dan buka <strong>Kana Gate</strong> dengan menjawab
            Hiragana & Katakana. <em>Belajar sambil main!</em>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/play" className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105 transition wiggle">
              🎮 Mulai Main
            </Link>
            <Link to="/practice" className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10 transition">
              📝 Latihan Kana
            </Link>
            <Link to="/about" className="px-6 py-3 rounded-2xl border-2 border-border bg-background font-bold text-lg hover:bg-muted transition">
              ℹ️ Cara Main
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-14 max-w-4xl w-full">
          <Feature icon="🌼" title="14 Level + 2 Boss" desc="Hiragana lalu Katakana, tiap dunia berbeda suasananya." />
          <Feature icon="🍯" title="Kumpul Madu" desc="Tetes madu jadi mata uang untuk beli bee, topi, & perabot sarang." />
          <Feature icon="🈂️" title="Belajar Kana" desc="Tiap pintu menguji kata multi-kana. Semua huruf wajib keluar." />
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
      <Link to="/" className="font-display font-bold text-xl md:text-2xl flex items-center gap-2">
        <img src={logo} alt="" className="w-9 h-9 rounded-lg" />
        <span>Bunbun Nihongo</span>
      </Link>
      <nav className="flex gap-3 text-sm font-semibold">
        <Link to="/play" className="hover:text-primary">Main</Link>
        <Link to="/practice" className="hover:text-primary">Latihan</Link>
        <Link to="/about" className="hover:text-primary">Tentang</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-6 text-center text-xs text-muted-foreground">
      Dibuat dengan 🍯 untuk pembelajar Bahasa Jepang · <a href="https://bunbunnihongo.my.id" className="font-semibold hover:text-primary">bunbunnihongo.my.id</a>
    </footer>
  );
}
