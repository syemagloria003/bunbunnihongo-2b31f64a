import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { KanjiStrokeOrder } from "@/components/KanjiStrokeOrder";

/** Mini interactive quiz: user types an answer, we check against accepted list. */
function Quiz({
  question,
  placeholder,
  accept,
  successMsg,
  errorMsg,
}: {
  question: ReactNode;
  placeholder: string;
  accept: string[];
  successMsg: string;
  errorMsg: string;
}) {
  const [val, setVal] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "no">("idle");
  const norm = (s: string) => s.trim().toLowerCase().replace(/[.\s!?'"`]/g, "");
  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!val.trim()) return;
    setState(accept.map(norm).includes(norm(val)) ? "ok" : "no");
  }
  return (
    <div className="space-y-2">
      <div className="text-sm">{question}</div>
      <form onSubmit={check} className="flex gap-2">
        <input
          value={val}
          onChange={(e) => { setVal(e.target.value); setState("idle"); }}
          placeholder={placeholder}
          className="flex-1 h-10 px-3 rounded-lg border-2 border-border bg-background text-sm focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:brightness-110"
        >
          Cek
        </button>
      </form>
      {state === "ok" && (
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/40 rounded-lg p-2">
          ✅ {successMsg}
        </p>
      )}
      {state === "no" && (
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/40 rounded-lg p-2">
          ❌ {errorMsg}
        </p>
      )}
    </div>
  );
}

export const Route = createFileRoute("/belajar/kanji")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Belajar Kanji — BeeGana" },
      { name: "description", content: "Pengenalan Kanji: asal-usul gambar, radikal puzzle, kun'yomi & on'yomi, aturan urutan goresan, dan kuis logika." },
    ],
  }),
  component: BelajarKanji,
});

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 mt-10" aria-hidden>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary/70" />
      <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-primary px-3 py-1 rounded-full border-2 border-dashed border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.55)]">
        ⬇ {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary/70" />
    </div>
  );
}

function KanjiShowcase({ char, caption }: { char: string; caption: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-background/70 border border-border p-3">
      <KanjiStrokeOrder char={char} size={110} strokeDuration={800} strokeGap={200} />
      <p className="text-sm leading-relaxed flex-1">{caption}</p>
    </div>
  );
}

function BelajarKanji() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/play" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs sm:text-sm hover:bg-primary/20 transition">
            ← Kembali
          </Link>
        </div>

        <header className="text-center space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Belajar Kanji ☄️</h1>
          <p className="text-sm text-muted-foreground">
            Bukan dihafal mati — dipahami logikanya, jadi gampang diingat.
          </p>
        </header>

        {/* Rahasia 1 */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">⛰️ Rahasia 1: Kanji Itu "Emoji" Zaman Purba!</h2>
          <p className="text-sm leading-relaxed">
            Banyak yang takut belajar Kanji karena bentuknya kelihatan ruwet.
            Padahal, duluuu sekali, Kanji itu asalnya cuma dari <b>gambar benda asli</b> yang
            digambar oleh orang-orang zaman kuno! Lama-kelamaan, gambar itu disederhanakan
            jadi huruf biar lebih gampang ditulis.
          </p>
          <p className="text-sm leading-relaxed">
            Beda sama Hiragana dan Katakana yang cuma mewakili suara, setiap satu karakter
            Kanji itu <b>membawa maknanya sendiri</b>. Kanji dari Tiongkok ini biasanya
            digunakan untuk mewakili kata-kata penting di dalam kalimat.
          </p>

          <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-3 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
            <p className="font-bold">Coba Pakai Imajinasimu!</p>
            <KanjiShowcase
              char="川"
              caption={<>Gambar aliran air sungai 🌊 berubah pelan-pelan jadi <b style={{ fontFamily: "serif" }} className="text-xl">川</b> (kawa = sungai).</>}
            />
            <KanjiShowcase
              char="田"
              caption={<>Gambar petak sawah 🟩 disederhanakan jadi <b style={{ fontFamily: "serif" }} className="text-xl">田</b> (ta = sawah).</>}
            />
            <KanjiShowcase
              char="人"
              caption={<>Gambar orang yang sedang melangkah 🚶 berubah jadi <b style={{ fontFamily: "serif" }} className="text-xl">人</b> (hito = orang).</>}
            />
          </div>
        </section>

        <SectionDivider label="Main Puzzle" />

        {/* Rahasia 2 */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">🧩 Rahasia 2: Hack Susunan Kanji (Main Puzzle!)</h2>
          <p className="text-sm leading-relaxed">
            Jangan pusing ngafalin Kanji satu-satu dari nol. Kanji itu sebetulnya bisa
            dibongkar jadi <b>bagian-bagian kecil</b> yang disebut <b>radikal</b>.
            Anggap aja radikal ini kayak potongan puzzle.
          </p>
          <p className="text-sm leading-relaxed">
            Nah, beberapa potongan puzzle ini bisa digabung untuk membuat satu kanji baru
            dengan arti yang baru juga! Kalau kamu tahu potongan-potongan kecilnya,
            menghafal kanji baru bakal jauh lebih gampang.
          </p>

          <div className="rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 p-3 space-y-3 shadow-[0_0_12px_rgba(16,185,129,0.55)] dark:shadow-[0_0_16px_rgba(16,185,129,0.65)]">
            <p className="font-bold">Buktikan Sendiri:</p>
            <div className="flex items-center justify-center gap-2 text-2xl flex-wrap" style={{ fontFamily: "serif" }}>
              <span>人</span><span className="text-base">(orang)</span>
              <span>+</span>
              <span>木</span><span className="text-base">(pohon)</span>
              <span>=</span>
              <KanjiStrokeOrder char="休" size={90} strokeDuration={800} strokeGap={200} />
            </div>
            <p className="text-sm leading-relaxed text-center">
              <b style={{ fontFamily: "serif" }} className="text-lg">休</b> — Tebak artinya apa?
              <b> Beristirahat!</b> (Masuk akal kan, orang lagi nyender santai di bawah pohon
              buat istirahat? 😌)
            </p>

            <div className="flex items-center justify-center gap-2 text-2xl flex-wrap pt-2" style={{ fontFamily: "serif" }}>
              <span>木</span><span className="text-base">(pohon)</span>
              <span>+</span>
              <span>木</span><span className="text-base">(pohon)</span>
              <span>=</span>
              <span className="text-4xl">林</span>
            </div>
            <p className="text-sm leading-relaxed text-center">
              Pohon kumpul sama pohon jadinya apa? Yep, <b>Hutan</b>! 🌳🌳
            </p>
          </div>
        </section>

        <SectionDivider label="Dua Cara Baca" />

        {/* Rahasia 3 */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">🗣️ Rahasia 3: Satu Kanji, Dua Identitas (Cara Baca)</h2>
          <p className="text-sm leading-relaxed">
            Kenapa belajar Kanji terasa menantang? Karena setiap kanji biasanya memiliki
            <b> dua jenis bacaan</b>:
          </p>

          <div className="rounded-xl border-2 border-dashed border-pink-400 dark:border-pink-400 bg-pink-100 dark:bg-pink-900/50 p-3 space-y-1 text-sm shadow-[0_0_12px_rgba(244,114,182,0.55)] dark:shadow-[0_0_16px_rgba(244,114,182,0.65)]">
            <p className="font-bold">Kun'yomi (Bacaan Asli Jepang) 🌸</p>
            <p>
              Biasanya digunakan saat kanji itu berdiri sendiri alias <i>jomblo</i>, atau
              saat digabung dengan <b>okurigana</b> (akhiran kana).
            </p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-sky-400 dark:border-sky-400 bg-sky-100 dark:bg-sky-900/50 p-3 space-y-1 text-sm shadow-[0_0_12px_rgba(56,189,248,0.55)] dark:shadow-[0_0_16px_rgba(56,189,248,0.65)]">
            <p className="font-bold">On'yomi (Bacaan Tionghoa) ⚡</p>
            <p>
              Ini adalah bacaan yang berasal dari bahasa Tionghoa. Biasanya digunakan saat
              <b> dua kanji disatukan</b> dalam satu kata (disebut <i>jukugo</i>).
            </p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-rose-400 dark:border-rose-400 bg-rose-100 dark:bg-rose-900/50 p-3 space-y-2 text-sm shadow-[0_0_12px_rgba(244,63,94,0.55)] dark:shadow-[0_0_16px_rgba(244,63,94,0.65)]">
            <p className="font-bold">Contohnya Kanji Api (<span style={{ fontFamily: "serif" }} className="text-lg">火</span>):</p>
            <p>
              Kalau dia berdiri sendiri, dibaca <b>hi</b> (ひ) → <i>Kun'yomi</i>.
            </p>
            <p>
              Tapi kalau dia bergabung dengan kanji lain, contohnya membentuk kosakata
              baru dengan kanji Gunung (<span style={{ fontFamily: "serif" }}>山</span>),
              dibacanya pakai <i>On'yomi</i> yaitu <b>ka</b> (カ). Hasilnya jadi
              {" "}<b style={{ fontFamily: "serif" }} className="text-lg">火山</b> (<i>kazan</i>),
              yang berarti <b>gunung berapi</b>! 🌋
            </p>
          </div>
        </section>

        <SectionDivider label="Aturan Menulis" />

        {/* Rahasia 4 */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">✍️ Rahasia 4: Aturan Main Nulis Kanji</h2>
          <p className="text-sm leading-relaxed">
            Urutan coretan kanji itu <b>penting banget</b>! Di Jepang, urutannya sudah
            diajarkan sejak SD dan dipakai di sekolah, kamus, maupun ujian.
          </p>
          <p className="text-sm leading-relaxed">
            Menulis dengan urutan yang benar bakal bikin tulisanmu lebih <b>rapi</b>,
            gampang dibaca, dan mudah dihafal. Kamu juga harus hati-hati, karena adapun
            kasus di mana <b>arah coretan yang berbeda bisa membuat artinya beda pula</b>!
          </p>

          <div className="rounded-xl border-2 border-dashed border-violet-400 dark:border-violet-400 bg-violet-100 dark:bg-violet-900/50 p-3 space-y-2 text-sm shadow-[0_0_12px_rgba(167,139,250,0.55)] dark:shadow-[0_0_16px_rgba(167,139,250,0.65)]">
            <p className="font-bold">Aturan Dasarnya Nggak Susah Kok:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Dari <b>atas ke bawah</b>. ⬇️</li>
              <li>Dari <b>kiri ke kanan</b>. ➡️</li>
              <li><b>Garis datar dulu</b> baru garis tegak.</li>
              <li><b>Garis luar dulu</b>, bagian dalam belakangan.</li>
              <li><b>Garis penutup</b> ditulis paling akhir.</li>
            </ul>
            <div className="pt-2 flex justify-center">
              <KanjiStrokeOrder char="火" size={140} strokeDuration={900} strokeGap={250} />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Coba perhatikan urutan goresan kanji 火 (api) di atas — tekan ▶ ulangi untuk memutar lagi.
            </p>
          </div>
        </section>

        <SectionDivider label="Kuis Logika" />

        {/* Quiz */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">🎮 Kuis Logika Puzzle Kanji!</h2>
          <p className="text-sm leading-relaxed">
            Karena kamu udah tahu cara kerja Kanji, yuk tes instingmu!
          </p>

          <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-3 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
            <div className="flex items-center justify-center gap-2 text-2xl flex-wrap" style={{ fontFamily: "serif" }}>
              <span>日</span><span className="text-base">(matahari)</span>
              <span>+</span>
              <span>月</span><span className="text-base">(bulan)</span>
              <span>=</span>
              <span className="text-4xl">明</span>
            </div>
            <Quiz
              question={<>Berdasarkan rahasia "Main Puzzle" tadi, kalau Kanji Matahari (<b style={{ fontFamily: "serif" }}>日</b>) digabung sama Kanji Bulan (<b style={{ fontFamily: "serif" }}>月</b>)... menurut instingmu, gabungan Kanji baru ini (<b style={{ fontFamily: "serif" }} className="text-lg">明</b>) bakal punya arti apa?<br />A. Gelap Gulita<br />B. Terang / Cerah</>}
              placeholder="Ketik 'A' atau 'B' di sini..."
              accept={["b"]}
              successMsg="BINGO! Cerdas banget! Matahari dan bulan disatukan pasti ngasih cahaya yang terang benderang. Gampang kan nebak arti Kanji?"
              errorMsg="Eits, coba dipikir lagi — kalau matahari ☀️ ketemu bulan 🌙, terangnya jadi double dong, bukan gelap!"
            />
          </div>
        </section>

        <div className="text-center pt-4">
          <Link
            to="/play"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition"
          >
            🚀 Siap! Balik ke peta dunia
          </Link>
        </div>
      </div>
    </div>
  );
}
