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
import posterTim from "@/assets/tim-pengajar.png";

import face13 from "@/assets/testimoni-faces/13.jpg";
import face14 from "@/assets/testimoni-faces/14.jpg";
import face15 from "@/assets/testimoni-faces/15.jpg";
import face16 from "@/assets/testimoni-faces/16.jpg";
import face17 from "@/assets/testimoni-faces/17.jpg";
import face18 from "@/assets/testimoni-faces/18.jpg";
import face19 from "@/assets/testimoni-faces/19.jpg";
import face20 from "@/assets/testimoni-faces/20.jpg";
import face21 from "@/assets/testimoni-faces/21.jpg";

type Testimoni = {
  foto: string;
  nama: string;
  ig?: string;
  batch: string;
  level: "N5" | "N3";
  isi: string;
};

const TESTIMONI: Testimoni[] = [
  {
    foto: face13, nama: "Esia Nuur Muttaqin", ig: "theyluv_hwa", batch: "Batch 1", level: "N5",
    isi: "Aku cepet paham sama sukaa cara belajar nya senseii, cuma akunya aja yang jarang nimbrung karena jam nya tabrakan sama kuliah/jam pulang. (Tapi aman ya ada record xixi)",
  },
  {
    foto: face14, nama: "Ennova Dianita", ig: "ennvd", batch: "Batch 1", level: "N5",
    isi: "Suka banget karena ngebut dan jelas. Temanku bilang mau ikut kalo senseinya ini (Syema Sensei) wkwkk, request. Terus kurangku choukai sih Sensei (kurang tugas tambahan ini mah ya wkwkk), dokkai aman.",
  },
  {
    foto: face15, nama: "Novianta Yonantias", batch: "Batch 1", level: "N5",
    isi: "Ngikutin kelas sensei seneng banget, karna banyak banget ilmu yang dikasih. Nggak melulu terpatok sama text yang ada di buku. Sering ngingetin sama catatan² penting saat belajar bahasa jepang, jadinya akunya juga terbantu mengingat dan memahaminya. Terkadang juga ngasih motivasi belajar bahasa Jepang yang bikin hati tercambuk..wkkwkw. Saran: banyakin PR please…. (emang murid langka wkwk)",
  },
  {
    foto: face16, nama: "Muhammad Fannan Syakur Ma'mun", ig: "muh_fannan", batch: "Batch 1", level: "N5",
    isi: "Kelasnya nya asik, Materi nya jelas dan mudah di pahami. Cara ngajar sensei juga unik. Kalau jarang hadir aman, ada record nya. Saya jarang hadir karna kadang ada matkul sama kegiatan kampus, jangan di tiru ya.",
  },
  {
    foto: face17, nama: "Aruni Rensi Triana", ig: "arunirenstr", batch: "Batch 1", level: "N3",
    isi: "Belajar JLPT N3 di Bunbun seru banget! Syema sensei super baik dan jelasin materinya detail. Apalagi kalau bahas kanji, bushunya dibedah satu-satu, jadi kalo nemu jukugo baru bisa ngira-ngira makna kanjinya 🥰 Metode ngajarnya juga cocok banget, bikin aku fokus nyimak dan satu kelas jadi aktif semua. Pokoknya recommended banget! 💖",
  },
  {
    foto: face18, nama: "Aisyah Amartya Hayyu", ig: "sasyamhyyu", batch: "Batch 1", level: "N3",
    isi: "Seneng banget join kelas di bunbun bareng Syema sensei~! 😍💕 Kelasnya fun, interaktif, penjelasan jelas dan detail tanpa bikin pusing. Banyak insight di luar buku yang bikin ilmu nancep banget. Makanya sayang kalo sampe skip kelas. Terima kasih sensei! 😄🧸 Ini feedback nya sensei.. sudah sangat jujur karna merasa saangaaat sangaaat terbantu buat mahamin bunpou",
  },
  {
    foto: face19, nama: "Shofiyya Qonitina Denillah", ig: "shofiy25", batch: "Batch 1", level: "N3",
    isi: "Diantara yang lain disini pertemuannya yang paling banyak (N3-100 pertemuan) dan harganya dibilang terjangkau apalagi kemarin daftar pas grand opening hehe. Senseinya juga detail banget kalo ngajarin. Dapet record sama buku kanji berkarakter juga. Pokoknya mantapppp. Buruan deh join 🤩",
  },
  {
    foto: face20, nama: "Adi Antoro", ig: "adiantoro86", batch: "Batch 1", level: "N3",
    isi: "Kelas nya telah selesai 🏠. Saya join kelas N3 yang batch 1, diajar oleh Syema sensei. Pengetahuan nya bukan yg kaleng-kaleng loh. Saat ku sodorin sebuah kalimat utk di translate pun langsung capciscus no loading no waiting list. Jadi kalo aku, gak nyesel sih diajar oleh syema sensei. Harapan dan impian saya, masih boleh bertanya lewat wa chat walau kelas nya sdh selesai 😍. Oh 1 lagi, benefit join di bunbun ini ada grup wa untuk kaiwa. Grup kaiwa ini bebas jam nya dan free for life.",
  },
  {
    foto: face21, nama: "Gabrella Prananda Claudia", batch: "Batch 2", level: "N5",
    isi: "Bunbun menurutku salah satu bimbel online yang ngebantu aku buat bisa ngerti bahasa jepang. Yang awalnya menurutku sulit, tapi sejak di Bunbun aku jadi banyak paham dan udah mulai bisa kaiwa. Karena Senseinya selalu memberikan contoh kalimat, terus kita nerjemahin kebahasa jepang, penjelasannya cukup sederhana sehingga kita mudah paham, the best bunbun, bahasa jepang terasa mudah, 日本語をおもしろいです bersama Bunbun 🎀",
  },
];

const WA_LINK = "https://wa.me/62895328671000?text=Halo%20Bunbun%20Nihongo,%20saya%20mau%20tanya%20kelas%20yang%20sedang%20dibuka.";
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
      <section className="px-6 py-6 md:py-8 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.45fr_1fr] gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 md:gap-4 mb-3">
              <img
                src={logo}
                alt="Logo Bunbun Nihongo"
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-md shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-display font-extrabold leading-tight">
                  Bunbun Nihongo
                </h1>
                <p className="text-sm md:text-lg font-display font-bold text-primary leading-tight">
                  Kursus Online Bahasa Jepang
                </p>
              </div>
            </div>
            <p className="text-sm md:text-base text-foreground/80 mb-3">
              Yuk wujudkan mimpimu fasih Bahasa Jepang bareng Bunbun! Ini yang bikin
              belajar di sini beda 👇
            </p>
            <ul className="space-y-1.5 mb-4 text-sm md:text-[15px]">
              {[
                <><strong>Sensei terjamin</strong> — minimal lulusan JLPT N2</>,
                <><strong>Kurikulum standar internasional</strong> sesuai level JLPT (N5 → N3)</>,
                <><strong>Belajar dari mana saja</strong> via Zoom — nggak terbatas tempat</>,
                <><strong>Maksimal 10 murid</strong> per kelas, kecil & efektif</>,
                <><strong>Senin–Jumat</strong> ketemu sensei — intensif tapi ramah kantong</>,
                <><strong>Kelas direkam</strong>, bisa di-review kapan saja</>,
                <><strong>Bebas tanya di luar jam kelas</strong> via WhatsApp</>,
                <><strong>Latihan ala game</strong> di platform Bunbun biar materi makin nempel</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold">✓</span>
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                href={WA_LINK}
                target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg hover:brightness-105 transition"
              >
                💬 Tanya & Daftar via WhatsApp
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Sudah jadi murid Bunbun? <Link to="/login" className="text-primary font-semibold underline">Login di sini</Link> untuk akses game latihan setelah kelas.
            </p>
          </div>

          {/* Vertical marquee — suasana kelas */}
          <div className="hidden md:block">
            <div className="relative h-[520px] overflow-hidden rounded-3xl border-2 border-primary/20 bg-card shadow-xl [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]">
              <div className="flex flex-col gap-3 p-3 animate-marquee-y">
                {[...gallery, ...gallery].map((g, i) => (
                  <figure
                    key={`hero-${g.src}-${i}`}
                    className="relative shrink-0 w-full h-44 rounded-2xl overflow-hidden bg-muted"
                  >
                    <img
                      src={g.src}
                      alt={g.label}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[11px] font-semibold px-2.5 py-1.5">
                      {g.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Kelas Dibuka + Testimoni — side by side seperti marketplace */}
      <section id="kelas" className="px-6 py-12 bg-muted/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Kiri: kelas yang dibuka — stacked seperti marketplace */}
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold mb-1">
              Kelas yang dibuka 📣
            </h2>
            <p className="text-muted-foreground mb-5 text-xs md:text-sm">
              Saat ini tersedia 2 kelas reguler. Belum ada kelas privat.
            </p>
            <div className="flex flex-col gap-4">
              <PosterCard
                src={posterRegN4}
                alt="Poster Kelas Reguler — Dari 0 sampai JLPT N4"
                title="Kelas Reguler"
                subtitle="Dari 0 — JLPT N4"
                schedule="Senin–Jumat · 16.00–17.30 WIB"
                details={[
                  "124x pertemuan via Zoom (Senin–Jumat)",
                  "Materi dari nol hingga setara JLPT N4",
                  "Maksimal 10 murid per kelas",
                  "Rekaman kelas tersedia untuk di-review",
                  "Sensei minimal bersertifikat JLPT N2",
                  "Bebas tanya di luar jam kelas via WhatsApp",
                  "Akses platform latihan ala game Bunbun",
                ]}
              />
              <PosterCard
                src={posterJlptN3}
                alt="Poster Kelas JLPT N3"
                title="Kelas JLPT N3"
                subtitle="Lanjutan untuk lulusan N4"
                schedule="Senin–Jumat · 19.00–20.30 WIB"
                details={[
                  "100x pertemuan via Zoom (Senin–Jumat)",
                  "Persiapan menyeluruh untuk JLPT N3",
                  "Maksimal 10 murid per kelas",
                  "Rekaman kelas tersedia untuk di-review",
                  "Sensei minimal bersertifikat JLPT N2",
                  "Bebas tanya di luar jam kelas via WhatsApp",
                  "Bonus buku Kanji berkarakter Bunbun",
                ]}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Kelas privat belum tersedia saat ini.
            </p>
          </div>

          {/* Kanan: testimoni vertical marquee */}
          <div id="testimoni" className="scroll-mt-20">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-1">
              Kata murid Bunbun 💌
            </h2>
            <p className="text-muted-foreground mb-5 text-xs md:text-sm">
              Cerita jujur dari murid batch sebelumnya.
            </p>
            <div className="relative h-[560px] md:h-[640px] overflow-hidden rounded-3xl border-2 border-primary/20 bg-card/60 [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]">
              <div className="flex flex-col gap-4 p-4 animate-marquee-y hover:[animation-play-state:paused]">
                {[...TESTIMONI, ...TESTIMONI].map((t, i) => (
                  <article
                    key={i}
                    className="shrink-0 rounded-2xl border border-primary/15 bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={t.foto}
                        alt={`Foto ${t.nama}`}
                        loading="lazy"
                        className="w-11 h-11 rounded-full object-cover border-2 border-primary shrink-0"
                        style={{ objectPosition: "center 25%" }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm leading-tight truncate">{t.nama}</h3>
                        {t.ig ? (
                          <a
                            href={`https://instagram.com/${t.ig}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[11px] text-primary hover:underline"
                          >
                            @{t.ig}
                          </a>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Murid Bunbun</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                        Reg {t.level}
                      </span>
                    </div>
                    <p className="text-xs md:text-[13px] text-foreground/80 leading-relaxed">
                      <span className="text-primary font-bold">“</span>
                      {t.isi}
                      <span className="text-primary font-bold">”</span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Lebih banyak testimoni di{" "}
              <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                @bunbun_nihongo
              </a>{" "}
              ✨
            </p>
          </div>
        </div>
      </section>

      {/* Sensei + CTA — side by side */}
      <section id="sensei" className="px-6 py-12 bg-muted/20 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Kiri: founder + tim tumpuk */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="inline-block bg-accent/15 text-accent text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 tracking-wider uppercase">
                Meet the Sensei
              </span>
              <h2 className="text-xl md:text-2xl font-display font-bold mb-1">
                Diajar langsung oleh founder kami 🎓
              </h2>
              <p className="text-muted-foreground text-xs md:text-sm">
                <strong>Syema Sensei</strong>, lulusan terbaik UNESA & bersertifikat <strong>JLPT N2</strong> — sabar, detail, paham banget cara ngajar dari nol sampai mahir.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg bg-card">
              <img
                src={posterSensei}
                alt="Profil Syema Sensei — Founder Bunbun Nihongo"
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-display font-bold mb-1">
                Tim pengajar Bunbun 🐝
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Didukung pengajar JLPT bersertifikat <strong>(N2 / N1 Only!)</strong> yang lolos seleksi & pelatihan metode Bunbun.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg bg-card">
              <img
                src={posterTim}
                alt="Tim pengajar Bunbun Nihongo — bersertifikat JLPT N2 / N1"
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Kanan: CTA + kontak — sticky di desktop */}
          <div className="md:sticky md:top-24">
            <div className="honey-card rounded-3xl p-6 md:p-7 text-center">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
                Siap mulai perjalanan Bahasa Jepangmu? 🚀
              </h2>
              <p className="text-foreground/80 text-sm mb-5">
                Chat admin sekarang untuk konsultasi gratis & daftar kelas.
              </p>
              <a
                href={WA_LINK}
                target="_blank" rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-2xl bg-green-600 text-white font-bold text-base shadow-lg hover:bg-green-700 transition"
              >
                💬 Tanya & Daftar via WhatsApp
              </a>
              <div className="mt-6 pt-5 border-t border-border/60 text-left text-sm space-y-2">
                <p className="font-semibold text-center mb-3">Kepoin Bunbun Nihongo juga di:</p>
                <p className="flex items-center gap-2 flex-wrap">
                  <span>📷</span>
                  <span className="font-semibold">Instagram:</span>
                  <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@bunbun_nihongo</a>
                </p>
                <p className="flex items-center gap-2 flex-wrap">
                  <span>🌐</span>
                  <span className="font-semibold">Website:</span>
                  <a href="https://www.bunbunnihongo.my.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">www.bunbunnihongo.my.id</a>
                </p>
                <p className="flex items-center gap-2 flex-wrap">
                  <span>📱</span>
                  <span className="font-semibold">WhatsApp:</span>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+62 895-3286-71000</a>
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-5">
                Sudah jadi murid Bunbun?{" "}
                <Link to="/login" className="text-primary font-semibold underline">Login</Link>{" "}
                untuk akses game latihan.
              </p>
            </div>
          </div>
        </div>
      </section>





      <Footer />
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
        <a href="#kelas" className="hidden sm:inline hover:text-primary">Kelas Dibuka</a>
        <a href="#testimoni" className="hidden sm:inline hover:text-primary">Testimoni</a>
        <a href="#sensei" className="hidden sm:inline hover:text-primary">Sensei</a>
        {loggedIn ? (
          <Link to="/play" className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110">
            LOGIN
          </Link>
        ) : (
          <>
            <span className="hidden md:inline text-xs text-muted-foreground">Sudah jadi murid Bunbun?</span>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110"
            >
              Login
            </Link>
          </>
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
      <p>© {new Date().getFullYear()} Bunbun Nihongo — Kursus Online Bahasa Jepang.</p>
    </footer>
  );
}
