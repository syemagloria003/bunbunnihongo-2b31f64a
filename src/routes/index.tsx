import { createFileRoute, Link } from "@tanstack/react-router";
import { UserGreeting } from "@/components/UserGreeting";
import logo from "@/assets/logo-bunbun.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bunbun Nihongo — Kursus Online Bahasa Jepang" },
      { name: "description", content: "Kursus Online Bahasa Jepang. Belajar Hiragana & Katakana sambil main game petualangan lebah Bunbun." },
      { property: "og:title", content: "Bunbun Nihongo — Kursus Online Bahasa Jepang" },
      { property: "og:description", content: "Belajar Bahasa Jepang sambil main. Hiragana, Katakana, dan petualangan seru." },
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
          <img
            src={logo}
            alt="Bunbun Nihongo"
            className="float-bee mx-auto w-48 md:w-64 h-auto rounded-3xl shadow-xl mb-6"
          />
          <h1 className="sr-only">Bunbun Nihongo</h1>
          <p className="text-xl md:text-2xl font-display font-bold text-primary mb-3">
            Kursus Online Bahasa Jepang
          </p>
          <p className="text-base md:text-lg text-foreground/80 mb-8">
            Belajar Hiragana & Katakana sambil bermain. Lompat, kumpulkan tetes madu, dan buka{" "}
            <strong>Kana Gate</strong> dengan menjawab kana yang benar. <em>Belajar sambil main!</em>
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
      <Link to="/" className="font-display font-bold text-xl md:text-2xl flex items-center gap-2">
        <img src={logo} alt="" className="w-9 h-9 rounded-lg" />
        Bunbun Nihongo
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
