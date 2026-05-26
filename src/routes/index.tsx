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
import posterRegN4 from "@/assets/posters/kelas-reguler-n4.png";
import posterJlptN3 from "@/assets/posters/kelas-jlpt-n3.png";
import posterSensei from "@/assets/sensei-syema.png";
import wa1 from "@/assets/testimoni/wa1.jpeg";
import wa2 from "@/assets/testimoni/wa2.jpeg";
import wa3 from "@/assets/testimoni/wa3.jpeg";
import wa4 from "@/assets/testimoni/wa4.jpeg";

const WA_LINK = "https://wa.me/6289532867100?text=Halo%20Bunbun%20Nihongo,%20saya%20mau%20tanya%20kelas%20yang%20sedang%20dibuka.";
const IG_LINK = "https://instagram.com/bunbun_nihongo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bunbun Nihongo — Kursus Online Bahasa Jepang JLPT N5 N4 N3" },
      { name: "description", content: "Kursus online Bahasa Jepang via Zoom. Kelas Reguler dari 0 sampai JLPT N4 & kelas JLPT N3. Sensei minimal N2, kurikulum standar internasional, maksimal 10 murid per kelas." },
      { property: "og:title", content: "Bunbun Nihongo — Kursus Online Bahasa Jepang" },
      { property: "og:description", content: "Kelas Bahasa Jepang via Zoom. Sensei minimal N2, kurikulum standar internasional, maksimal 10 murid per kelas. Daftar sekarang!" },
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
  { src: galPrivate, label: "Sesi belajar intensif" },
  { src: galWeekend, label: "Materi interaktif" },
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
              Belajar Bahasa Jepang <strong>dari nol sampai JLPT N3</strong> via Zoom,
              bareng <strong>sensei minimal JLPT N2</strong>, kurikulum standar internasional,
              dan <strong>maksimal 10 murid per kelas</strong>. Pertemuan banyak, harga
              terjangkau.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={WA_LINK}
                target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105 transition"
              >
                💬 Chat Admin
              </a>
              <a
                href="#kelas"
                className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10 transition"
              >
                📚 Lihat Kelas
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Sudah jadi murid? <Link to="/login" className="text-primary font-semibold underline">Login di sini</Link> untuk latihan tambahan & main game.
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
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Feature icon="🎓" title="Sensei terjamin" desc="Minimal lulusan JLPT N2. Sudah pasti paham seluk-beluk Bahasa Jepang." />
            <Feature icon="📖" title="Kurikulum standar internasional" desc="Materi terstruktur, sesuai standar JLPT — bukan asal-asalan." />
            <Feature icon="👥" title="Maksimal 10 murid" desc="Kelas kecil & efektif. Sensei kenal tiap murid, kamu bebas tanya." />
            <Feature icon="💸" title="Meet banyak, terjangkau" desc="Senin–Jumat full ketemu sensei, harga ramah kantong." />
          </div>
        </div>
      </section>

      {/* Perks — trust builders */}
      <section className="px-6 py-14 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-2">
            Lebih dari sekadar kelas Zoom ✨
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm max-w-2xl mx-auto">
            Kami pastikan kamu nggak belajar sendirian. Ada support penuh dari sensei & sistem belajar yang fleksibel.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <Perk
              icon="💬"
              title="Bebas tanya di luar jam kelas"
              desc="Stuck di tengah malam? Tinggal japri di WhatsApp grup — sensei & teman sekelas siap bantu."
            />
            <Perk
              icon="🎥"
              title="Rekaman Zoom tiap pertemuan"
              desc="Ketinggalan kelas atau mau review materi? Tenang, semua sesi direkam dan dibagikan."
            />
            <Perk
              icon="🎮"
              title="Latihan tambahan interaktif"
              desc="Setelah Zoom, lanjut latihan kana di platform khusus murid biar makin nempel."
            />
          </div>
        </div>
      </section>

      {/* Team / Meet the Sensei */}
      <section className="px-6 py-16 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-accent/15 text-accent text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">
              Meet the Sensei
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Diajar langsung oleh sensei bersertifikat 🎓
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Semua sensei kami minimal lulusan <strong>JLPT N2</strong> & berpengalaman mengajar online.
            </p>
          </div>

          {/* Founder card */}
          <div className="honey-card rounded-3xl p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-display font-extrabold text-primary-foreground shadow-lg ring-4 ring-background">
                  S
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Founder</span>
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">JLPT N2</span>
                </div>
                <h3 className="text-2xl font-display font-extrabold">Syema Sensei</h3>
                <p className="text-sm text-muted-foreground mb-4">Syema Gloria · Founder & Lead Teacher</p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-primary mb-1">🎓 Pendidikan</h4>
                    <ul className="space-y-1 text-foreground/80">
                      <li>S1 Pendidikan Bahasa Jepang — Universitas Negeri Surabaya (UNESA)</li>
                      <li><strong>Wisudawan Terbaik UNESA</strong> Periode 114, IPK <strong>3,94</strong></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">💼 Pengalaman</h4>
                    <ul className="space-y-1 text-foreground/80">
                      <li>±2 tahun mengajar Bahasa Jepang online (privat & grup) sejak 2024</li>
                      <li>Juara Favorit Lomba Pidato Bahasa Jepang UNESA 2021</li>
                      <li>Internship guru di SD Labschool UNESA 2 (Agt–Des 2024)</li>
                      <li>Kampus Mengajar 7 — SMP PGRI 1 Kediri (Jan–Jun 2024)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other senseis */}
          <div className="grid sm:grid-cols-3 gap-4">
            <SenseiCard initial="S" name="Sashy Sensei" />
            <SenseiCard initial="N" name="Nita Sensei" />
            <SenseiCard initial="M" name="Mira Sensei" />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Profil lengkap tim sensei menyusul ✨
          </p>
        </div>
      </section>

      {/* Programs / Kelas yang dibuka — posters */}
      <section id="kelas" className="px-6 py-14 bg-muted/30 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-2">
            Kelas yang dibuka 📣
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Saat ini hanya tersedia 2 kelas reguler. Belum ada kelas privat.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <PosterCard
              src={posterRegN4}
              alt="Poster Kelas Reguler — Dari 0 sampai JLPT N4"
              title="Kelas Reguler"
              subtitle="Dari 0 — JLPT N4"
              schedule="Senin–Jumat · 16.00–17.30 WIB"
            />
            <PosterCard
              src={posterJlptN3}
              alt="Poster Kelas JLPT N3"
              title="Kelas JLPT N3"
              subtitle="Lanjutan untuk lulusan N4"
              schedule="Senin–Jumat · 19.00–20.30 WIB"
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            * Kelas privat belum tersedia saat ini.
          </p>
          <div className="text-center mt-6">
            <a
              href={WA_LINK}
              target="_blank" rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg hover:brightness-105"
            >
              💬 Tanya & Daftar via WhatsApp
            </a>
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
            Chat admin atau follow Instagram kami untuk info kelas terbaru.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={WA_LINK}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-105"
            >
              💬 Daftar via WhatsApp
            </a>
            <a
              href={IG_LINK}
              target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl border-2 border-primary bg-background font-bold text-lg hover:bg-primary/10"
            >
              📷 @bunbun_nihongo
            </a>
            {loggedIn && (
              <Link
                to="/play"
                className="px-6 py-3 rounded-2xl border-2 border-border bg-background font-bold text-lg hover:bg-muted"
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
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Perk({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-6 bg-card border-2 border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
      <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-2xl mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function SenseiCard({ initial, name }: { initial: string; name: string }) {
  return (
    <div className="rounded-2xl p-5 bg-card border-2 border-border/60 text-center shadow-sm">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-3xl font-display font-extrabold text-primary-foreground ring-4 ring-background shadow">
        {initial}
      </div>
      <h3 className="font-display font-bold text-lg mt-3">{name}</h3>
      <span className="inline-block mt-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">JLPT N2</span>
    </div>
  );
}

function PosterCard({
  src, alt, title, subtitle, schedule,
}: { src: string; alt: string; title: string; subtitle: string; schedule: string }) {
  return (
    <div className="rounded-3xl overflow-hidden border-2 border-primary/30 bg-card shadow-lg flex flex-col">
      <a href={src} target="_blank" rel="noopener noreferrer" className="block bg-muted">
        <img src={src} alt={alt} loading="lazy" className="w-full h-auto object-contain" />
      </a>
      <div className="p-5">
        <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full mb-2">
          PENDAFTARAN DIBUKA
        </div>
        <h3 className="font-display font-bold text-xl">{title}</h3>
        <p className="text-primary font-semibold text-sm">{subtitle}</p>
        <p className="text-sm text-muted-foreground mt-1">{schedule}</p>
        <a
          href={WA_LINK}
          target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:brightness-105"
        >
          💬 Daftar kelas ini
        </a>
      </div>
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
        <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-primary">Instagram</a>
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
    <footer className="px-6 py-8 text-center text-xs text-muted-foreground border-t border-border/50 space-y-2">
      <p>
        📱 WhatsApp: <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">+62 895-3286-71000</a>
        {" · "}
        📷 Instagram: <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">@bunbun_nihongo</a>
      </p>
      <p>© {new Date().getFullYear()} Bunbun Nihongo — Kursus Online Bahasa Jepang. Dibuat dengan 🍯.</p>
    </footer>
  );
}
