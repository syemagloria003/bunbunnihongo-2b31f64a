import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-bunbun.jpg";
import galN5Absen from "@/assets/gallery/kelas-n5-absen.jpg";
import galN3Jan from "@/assets/gallery/kelas-n3-jan26.jpeg";
import galPrivate from "@/assets/gallery/kelas-private.png";
import galWeekend from "@/assets/gallery/kelas-weekend-n5.jpg";
import galRegN5 from "@/assets/gallery/kelas-reg-n5.png";
import galRegN3 from "@/assets/gallery/kelas-reg-n3.png";
import galN3Absen from "@/assets/gallery/kelas-n3-absen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bunbun Nihongo — Kursus Online Bahasa Jepang" },
      { name: "description", content: "Kursus online Bahasa Jepang interaktif via Zoom. Kelas N5, N4, N3, privat, dan weekend. Belajar dari nol bareng sensei berpengalaman." },
      { property: "og:title", content: "Bunbun Nihongo — Kursus Online Bahasa Jepang" },
      { property: "og:description", content: "Kelas Bahasa Jepang via Zoom dengan sensei berpengalaman. N5 sampai N3, privat & weekend. Daftar sekarang!" },
      { property: "og:image", content: "/logo-bunbun.jpg" },
    ],
  }),
  component: Landing,
});

const gallery = [
  { src: galN5Absen, label: "Kelas Reguler N5" },
  { src: galN3Jan, label: "Kelas N3 — Batch Januari" },
  { src: galRegN3, label: "Belajar Kanji bareng" },
  { src: galRegN5, label: "Latihan Hiragana" },
  { src: galPrivate, label: "Kelas Privat" },
  { src: galWeekend, label: "Kelas Weekend" },
  { src: galN3Absen, label: "Momen seru bareng sensei" },
];

function Landing() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header loggedIn={loggedIn} />

      {/* Hero */}
      <section className="px-6 py-12 md:py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-primary/15 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
              はじめまして! Yoroshiku 🌸
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight mb-3">
              Bunbun Nihongo
            </h1>
            <p className="text-xl md:text-2xl font-display font-bold text-primary mb-4">
              Kursus Online Bahasa Jepang
            </p>
            <p className="text-base md:text-lg text-foreground/80 mb-6">
              Belajar Bahasa Jepang dari <strong>nol sampai mahir</strong> bareng sensei berpengalaman.
              Kelas <strong>via Zoom</strong>, suasana asyik, materi lengkap dari Hiragana
              sampai persiapan JLPT N3.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/?text=Halo%20Bunbun%20Nihongo,%20saya%20mau%20tanya%20kelas%20yang%20sedang%20dibuka."
                target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105 transition"
              >
                💬 Tanya Kelas
              </a>
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10 transition"
              >
                🔑 Login Murid
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Sudah jadi murid? <Link to="/login" className="text-primary font-semibold underline">Masuk di sini</Link> untuk latihan tambahan & main game.
            </p>
          </div>
          <div className="relative">
            <img
              src={logo}
              alt="Logo Bunbun Nihongo"
              className="float-bee mx-auto w-56 md:w-72 h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
            Kenapa pilih Bunbun? 🐰
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Feature icon="🎌" title="Sensei berpengalaman" desc="Diajar langsung oleh pengajar yang ramah dan sabar, fokus bikin kamu paham." />
            <Feature icon="💻" title="100% Online via Zoom" desc="Belajar dari mana aja. Materi & rekaman dibagikan tiap pertemuan." />
            <Feature icon="🎮" title="Latihan interaktif" desc="Murid dapat akses game latihan kana & kanji untuk reinforcement setelah kelas." />
          </div>
        </div>
      </section>

      {/* Programs / Kelas yang dibuka */}
      <section className="px-6 py-14 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-2">
            Kelas yang dibuka
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Pilih level & jadwal yang cocok buat kamu
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Program level="N5" title="Pemula" desc="Hiragana, Katakana, tata bahasa dasar. Cocok yang baru mulai." />
            <Program level="N4" title="Menengah Awal" desc="Kanji dasar & percakapan sehari-hari." />
            <Program level="N3" title="Menengah" desc="Persiapan JLPT N3 dengan latihan soal intensif." />
            <Program level="Privat" title="1-on-1" desc="Jadwal fleksibel, materi disesuaikan kebutuhanmu." />
            <Program level="Weekend" title="Akhir Pekan" desc="Buat yang sibuk kerja/sekolah weekday." />
            <Program level="Soon" title="Poster Kelas Baru" desc="Poster kelas yang sedang dibuka akan dipasang di sini." muted />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-2">
            Suasana kelas 📸
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Cuplikan dari batch-batch sebelumnya
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((g) => (
              <figure key={g.src} className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm">
                <img
                  src={g.src}
                  alt={g.label}
                  loading="lazy"
                  className="w-full h-40 md:h-44 object-cover group-hover:scale-105 transition duration-300"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-semibold px-3 py-2">
                  {g.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto text-center honey-card rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
            Siap mulai perjalanan Bahasa Jepangmu? 🚀
          </h2>
          <p className="text-foreground/80 mb-6">
            Chat admin untuk info biaya, jadwal, dan kelas yang sedang dibuka.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/?text=Halo%20Bunbun%20Nihongo,%20saya%20mau%20daftar%20kelas."
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105"
            >
              💬 Daftar via WhatsApp
            </a>
            {loggedIn && (
              <Link
                to="/play"
                className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10"
              >
                🎮 Lanjut Latihan
              </Link>
            )}
          </div>
        </div>
      </section>

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

function Program({ level, title, desc, muted }: { level: string; title: string; desc: string; muted?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border-2 ${muted ? "border-dashed border-border bg-background/50" : "border-primary/30 bg-card shadow-sm"}`}>
      <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${muted ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
        {level}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Header({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-30">
      <Link to="/" className="font-display font-bold text-xl md:text-2xl flex items-center gap-2">
        <img src={logo} alt="" className="w-9 h-9 rounded-lg" />
        Bunbun Nihongo
      </Link>
      <nav className="flex gap-3 text-sm font-semibold items-center">
        <a href="#kelas" className="hidden sm:inline hover:text-primary">Kelas</a>
        {loggedIn ? (
          <>
            <Link to="/play" className="hover:text-primary">Latihan</Link>
            <Link to="/leaderboard" className="hover:text-primary">Peringkat</Link>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110"
          >
            Login Murid
          </Link>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-8 text-center text-xs text-muted-foreground border-t border-border/50">
      © {new Date().getFullYear()} Bunbun Nihongo — Kursus Online Bahasa Jepang. Dibuat dengan 🍯.
    </footer>
  );
}
