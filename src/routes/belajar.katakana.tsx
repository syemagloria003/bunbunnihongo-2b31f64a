import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { KATAKANA, KATAKANA_YOUON, KATAKANA_SOKUON, KATAKANA_GAIRAIGO } from "@/game/kana-data";
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

export const Route = createFileRoute("/belajar/katakana")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Belajar Katakana — BeeGana" },
      { name: "description", content: "Pengenalan Katakana: fungsi, gojuon, dakuon, handakuon, youon, sokuon, chōonpu (bunyi panjang), dan gairaigo (ファ, ヴァ, ティ). Lengkap dengan suara dan urutan goresan." },
    ],
  }),
  component: BelajarKatakana,
});

function speakKana(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) {
    alert("Browser kamu belum mendukung suara. Coba pakai Chrome/Edge ya.");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.55;
  u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const jp = voices.find((v) => v.lang?.toLowerCase().startsWith("ja"));
  if (jp) u.voice = jp;
  window.speechSynthesis.speak(u);
}

function useWarmVoices() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const w = () => window.speechSynthesis.getVoices();
    w();
    window.speechSynthesis.onvoiceschanged = w;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);
}

function BelajarKatakana() {
  useWarmVoices();
  const [active, setActive] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  function open(char: string) {
    setActive(char);
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/play" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs sm:text-sm hover:bg-primary/20 transition">
            ← Kembali
          </Link>
        </div>

        <header className="text-center space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Belajar Katakana ⚔️</h1>
          <p className="text-sm text-muted-foreground">
            Tekan 🔊 untuk dengar pelan-pelan, tekan ✍️ untuk lihat urutan menulisnya.
          </p>
        </header>

        {/* Intro */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">⚡ Kenalan Sama "Si Ninja" Katakana</h2>
          <p className="text-sm leading-relaxed">
            Kalau Hiragana itu si kalem yang luwes-melengkung, Katakana ini saudara kembarnya yang
            <b> tegas, kaku, dan suka barang impor</b>. Bentuknya bersudut tajam, kayak pedang ninja
            atau robot transformer. ⚔️🤖
          </p>

          <div className="rounded-xl border-2 border-dashed border-sky-400 dark:border-sky-400 bg-sky-100 dark:bg-sky-900/50 p-3 space-y-1 text-sm shadow-[0_0_12px_rgba(56,189,248,0.55)] dark:shadow-[0_0_16px_rgba(56,189,248,0.65)]">
            <p className="font-bold">📦 Si Katakana itu Spesialis Barang Impor</p>
            <p><b>Fungsi:</b> Khusus dipakai buat nulis kata serapan dari bahasa asing (Inggris, Prancis, dll), nama negara asing, nama orang asing (termasuk <b>nama kamu!</b>), suara-suara seperti onomatope, dan kadang nama hewan/tumbuhan biar terlihat tegas.</p>
            <p><b>Contoh kata:</b> <span style={{ fontFamily: "serif" }} className="text-lg">コーヒー</span> (KŌHĪ — kopi), <span style={{ fontFamily: "serif" }} className="text-lg">アイス</span> (AISU — es krim), <span style={{ fontFamily: "serif" }} className="text-lg">バス</span> (BASU — bus).</p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-pink-400 dark:border-pink-400 bg-pink-100 dark:bg-pink-900/50 p-3 space-y-1 text-sm shadow-[0_0_12px_rgba(244,114,182,0.55)] dark:shadow-[0_0_16px_rgba(244,114,182,0.65)]">
            <p className="font-bold">🔍 Bedanya Sama Hiragana?</p>
            <p>Suaranya <b>sama persis</b>! A ya A, KA ya KA. Yang beda cuma <b>bentuk</b> dan <b>kapan dipakai</b>.</p>
            <p>Contoh sama-sama "A": Hiragana <span style={{ fontFamily: "serif" }} className="text-lg">あ</span> (luwes melengkung) — Katakana <span style={{ fontFamily: "serif" }} className="text-lg">ア</span> (cuma 2 coretan, tegas).</p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
            <p className="font-bold text-sm">🎮 Waktunya Praktik!</p>
            <Quiz
              question={<>Nama kamu (misalnya <b>"Andi"</b>) yang bukan asli Jepang, kalau ditulis di Jepang bakal pakai huruf apa?<br />A. Hiragana (Si Melengkung)<br />B. Katakana (Si Kaku)</>}
              placeholder="Ketik 'A' atau 'B' di sini..."
              accept={["b"]}
              successMsg="CAKEP! Bener banget. Karena nama kamu bukan asli Jepang, otomatis ditulis pakai Katakana — アンディ."
              errorMsg="Hmm, coba inget — Katakana itu spesialis barang dan nama dari luar negeri. Yang mana hayo?"
            />
          </div>
        </section>

        {/* Sticky preview */}
        {active && (
          <div ref={cardRef} className="sticky top-2 z-20">
            <div className="honey-card rounded-2xl p-4 flex items-center gap-4 shadow-xl border-2 border-primary/40 bg-background/95 backdrop-blur">
              <KanjiStrokeOrder char={charForStroke(active)} size={140} strokeDuration={900} strokeGap={250} />
              <div className="flex-1 min-w-0">
                <p className="text-5xl sm:text-6xl font-bold" style={{ fontFamily: "serif" }}>{active}</p>
                <p className="text-lg text-muted-foreground font-semibold">{romajiFor(active)}</p>
                {isYouon(active) && (
                  <p className="text-xs mt-2 text-amber-700 dark:text-amber-300">
                    📐 Huruf kecil (ャ/ュ/ョ atau ァ/ィ/ェ/ォ) ditulis di <b>kanan-bawah</b>, kira-kira <b>seperempat kotak</b>.
                  </p>
                )}
                {isSokuon(active) && (
                  <p className="text-xs mt-2 text-amber-700 dark:text-amber-300">
                    📐 Sokuon (ッ kecil) juga ditulis di <b>kanan-bawah</b>, sekitar <b>seperempat kotak</b>.
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <button onClick={() => speakKana(active)} className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:brightness-110">🔊 Dengar pelan</button>
                  <button onClick={() => setActive(null)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:bg-muted">Tutup</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <SectionDivider label="Gojūon" />

        {/* Gojuon */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold">⚔️ Gojūon Katakana — 46 Huruf Dasar</h2>
          </div>

          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p className="font-bold text-base">🛑 Aturan Mainnya Sama: Kakijun!</p>
            <p className="leading-relaxed">
              Sama kayak Hiragana, Katakana juga punya <b>urutan coretan (kakijun)</b>. Bedanya, karena
              bentuknya kaku dan banyak garis lurus, urutannya malah <b>lebih gampang diinget</b>. Mostly cuma
              2-4 coretan per huruf!
            </p>

            <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-2 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
              <p className="font-bold">⚠️ Awas Si Kembar yang Sering Bikin Bingung!</p>
              <p className="leading-relaxed">
                Ada beberapa huruf Katakana yang bentuknya mirip banget, sampe orang Jepang sendiri kadang
                ragu. Hafalin trik bedainnya dari sekarang:
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>シ (SHI)</b> vs <b>ツ (TSU)</b> — SHI coretannya <b>mendatar dari bawah</b>, TSU coretannya <b>turun dari atas</b>.</li>
                <li><b>ン (N)</b> vs <b>ソ (SO)</b> — N coretannya naik dari bawah, SO turun dari atas.</li>
                <li><b>ク (KU)</b> vs <b>ケ (KE)</b> vs <b>ワ (WA)</b> — perhatikan ekor dan garis tambahan.</li>
              </ul>
              <p className="text-xs italic">Trik: lihat <b>arah</b> coretan terakhirnya. Itu kuncinya!</p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
              <p className="font-bold">Aturan Mainnya Gampang Banget!</p>
              <div className="flex flex-col gap-1 pl-1">
                <p>➡️ <b>Selalu mulai dari Kiri ke Kanan</b></p>
                <p>⬇️ <b>Selalu mulai dari Atas ke Bawah</b></p>
              </div>
              <p className="text-xs text-muted-foreground">
                (Kalau ada garis menyilang, garis mendatar dulu, baru ditimpa garis menurun).
              </p>
            </div>
          </div>

          <GojuonGrid onPick={open} active={active} />
        </section>

        <SectionDivider label="Dakuon & Handakuon" />

        {/* Dakuon + Handakuon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🪄 Jurus Upgrade Huruf (Dakuon &amp; Handakuon)</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Polanya <b>sama persis</b> kayak di Hiragana, cuma ganti bentuk huruf aja. Tinggal nempelin
              tanda kutip ( ゛) atau tanda bulat ( ゜) di pojok kanan-atas.
            </p>

            <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
              <p className="font-bold">1. Dakuon si "Tanda Kutip" ( ゛) — Suara Ngotot! 💪</p>
              <p>
                Coba bilang <b>"KA"</b>, terus tahan posisi mulut dan tebelin dari tenggorokan. Otomatis
                jadi <b>"GA"</b>, kan?
              </p>
              <p>
                <span style={{ fontFamily: "serif" }} className="text-lg">カ</span> (KA) + ゛ ➡️
                <span style={{ fontFamily: "serif" }} className="text-lg"> ガ</span> (GA).
              </p>
              <p className="font-semibold">Berlaku juga:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>サ (SA) ➡️ ザ (ZA)</li>
                <li>タ (TA) ➡️ ダ (DA)</li>
                <li>ハ (HA) ➡️ バ (BA)</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
              <p className="font-bold text-sm">🎮 Coba Ketik Sendiri!</p>
              <Quiz
                question={<>Kalau huruf <b>TE</b> (<span style={{ fontFamily: "serif" }} className="text-lg">テ</span>) kita kasih tanda kutip ( ゛), suaranya berubah jadi apa?</>}
                placeholder="Ketik jawabanmu (2 huruf)..."
                accept={["de"]}
                successMsg="BINGO! Bener banget. テ + ゛ jadi デ (DE)."
                errorMsg="Hampir! Pola: KA→GA, SA→ZA, TA→DA… terus TE jadinya apa?"
              />
            </div>

            <div className="rounded-xl border-2 border-dashed border-rose-400 dark:border-rose-400 bg-rose-100 dark:bg-rose-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(244,63,94,0.55)] dark:shadow-[0_0_16px_rgba(244,63,94,0.65)]">
              <p className="font-bold">2. Handakuon si "Tanda Bulat" ( ゜) — Suara Meletup! 💥</p>
              <p>
                Khusus geng <b>HA</b>. Rapatkan bibir, hembuskan, jadi <b>"Pah!"</b>.
              </p>
              <p>
                <span style={{ fontFamily: "serif" }} className="text-lg">ハ</span> (HA) + ゜ ➡️
                <span style={{ fontFamily: "serif" }} className="text-lg"> パ</span> (PA).
              </p>
            </div>
          </div>
          <DakuonGrid onPick={open} active={active} />
        </section>

        <SectionDivider label="Yōon" />

        {/* Youon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🌪️ Blender Suara (Yōon)</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Konsepnya <b>persis sama</b> kayak Hiragana, tinggal ganti bentuk. Tiga "anak bawang" Katakana
              yang nyempil di sebelah huruf geng "I" adalah: <b>ャ (ya)</b>, <b>ュ (yu)</b>, dan <b>ョ (yo)</b>.
            </p>

            <div className="rounded-xl border-2 border-dashed border-violet-400 dark:border-violet-400 bg-violet-100 dark:bg-violet-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(167,139,250,0.55)] dark:shadow-[0_0_16px_rgba(167,139,250,0.65)]">
              <p className="font-bold">🥤 Inget Konsep Jus-nya!</p>
              <p>
                <b>キ (KI)</b> + <b>ャ kecil</b> = blender jadi <b>KYA</b> (satu ketuk, bukan Ki-ya).
              </p>
              <p className="font-semibold">Contoh nyata di kata serapan:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>キャンプ</b> (KYANPU — kemping/camping)</li>
                <li><b>ジュース</b> (JŪSU — jus)</li>
                <li><b>チョコ</b> (CHOKO — coklat)</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
              <p className="font-bold text-sm">🎮 Kuis Blender!</p>
              <Quiz
                question={<>Kata <b>"SHATSU"</b> (kemeja, dari "shirt"). Racikan mana yang dimasukin blender buat bunyi <b>SHA</b>?<br />A. サ (SA) + ャ kecil<br />B. シ (SHI) + ャ kecil</>}
                placeholder="Ketik 'A' atau 'B'..."
                accept={["b"]}
                successMsg="Tjakep! シ (SHI) + ャ kecil = SHA. Jadi シャツ = SHATSU. ✅"
                errorMsg="Hampir! Yang punya bunyi 'SH' itu cuma シ (SHI). Coba lagi ya."
              />
            </div>
          </div>
          <KanaGrid items={KATAKANA_YOUON} cols={3} onPick={open} active={active} />
        </section>

        <SectionDivider label="Sokuon" />

        {/* Sokuon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🛑 Sokuon si "Tsu Kecil" ( ッ ) — Ngerem Mendadak!</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-2">
            <p>
              Lihat huruf <i>tsu</i> versi nyempil kecil (<span style={{ fontFamily: "serif" }}>ッ</span>)?
              Itu <b>BUKAN</b> dibaca "tsu", tapi tanda <b>ngerem mendadak</b> alias konsonan ganda.
            </p>
            <p>
              <b>Contoh:</b> <b>カップ</b> (KAPPU — gelas, dari "cup"). Bacanya bukan <i>Ka-pu</i>, tapi
              <b> KA…(rem)…PPU!</b>
            </p>

            <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
              <p className="font-semibold">📚 Contoh kata serapan (rasain rem-nya):</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>ベッド</b> (BEDDO — bed/ranjang) → <i>BE…(rem)…DDO</i></li>
                <li><b>サッカー</b> (SAKKĀ — sepak bola/soccer) → <i>SA…(rem)…KKĀ</i></li>
                <li><b>チケット</b> (CHIKETTO — tiket/ticket) → <i>CHIKE…(rem)…TTO</i></li>
                <li><b>ホット</b> (HOTTO — panas/hot) → <i>HO…(rem)…TTO</i></li>
              </ul>
              <p className="text-xs italic">Trik: konsonan setelah ッ selalu dobel (kk, pp, tt, ss…). Itu tandanya ngerem.</p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 p-3 space-y-2 shadow-[0_0_12px_rgba(16,185,129,0.55)] dark:shadow-[0_0_16px_rgba(16,185,129,0.65)]">
              <p className="font-bold">📏 Si ッ Juga "Anak Bawang"!</p>
              <p>
                Sama kayak ャ/ュ/ョ, ッ ukurannya cuma <b>seperempat (¼)</b> kotak. Jangan ketuker sama
                <b> ツ</b> (TSU besar) yang dibaca "tsu" beneran!
              </p>

              <div className="flex items-center gap-4 justify-center pt-1">
                <div className="text-center space-y-1">
                  <div className="relative w-28 h-28 border-2 border-emerald-500 rounded grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-dashed border-emerald-300" />
                    <div className="border-b border-dashed border-emerald-300" />
                    <div className="border-r border-dashed border-emerald-300 flex items-center justify-center overflow-hidden">
                      <span style={{ fontFamily: "serif" }} className="text-5xl leading-none">ッ</span>
                    </div>
                    <div />
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">✅ Benar: kiri bawah (¼ kotak)</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="relative w-28 h-28 border-2 border-rose-500 rounded flex items-center justify-center overflow-hidden">
                    <span style={{ fontFamily: "serif", fontSize: "7rem" }} className="leading-none">ツ</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300">❌ Salah: gede = jadi "TSU" beneran!</p>
                </div>
              </div>
            </div>
          </div>
          <KanaGrid items={KATAKANA_SOKUON} cols={4} onPick={open} active={active} />
        </section>

        <SectionDivider label="Chōonpu — Bunyi Panjang" />

        {/* Chōonpu */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">➖ Chōonpu ( ー ) — Tarik Suaranya Panjang!</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Nah, ini fitur <b>khusus Katakana</b> yang nggak ada di Hiragana. Namanya <b>Chōonpu</b>
              (長音符), tapi anak gaul nyebutnya "garis panjang" aja. Lambangnya cuma garis mendatar:
              <b> <span style={{ fontFamily: "serif" }} className="text-lg">ー</span></b>.
            </p>

            <div className="rounded-xl border-2 border-dashed border-sky-400 dark:border-sky-400 bg-sky-100 dark:bg-sky-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(56,189,248,0.55)] dark:shadow-[0_0_16px_rgba(56,189,248,0.65)]">
              <p className="font-bold">🎙️ Fungsinya: Pencet "Tahan Tombol" di Karaoke 🎤</p>
              <p>
                Garis ini artinya: <b>vokal sebelumnya ditahaaaan jadi panjang</b>. Suaranya jadi dobel
                durasinya, kira-kira 2 ketukan.
              </p>
              <p>
                <b>Contoh:</b>
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>カ</b> (KA) + <b>ー</b> = <b>カー</b> (KĀ — dibaca "Kaaa", bukan "Ka-").</li>
                <li><b>コーヒー</b> (KŌHĪ — kopi) → <i>"Koooo-hiii"</i> (dua-duanya ditarik panjang).</li>
                <li><b>ビール</b> (BĪRU — bir) → <i>"Biiii-ru"</i>.</li>
                <li><b>ケーキ</b> (KĒKI — kue) → <i>"Keee-ki"</i>.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
              <p className="font-bold">⚠️ Awas! Salah Tarik = Salah Arti!</p>
              <p>Di bahasa Jepang, panjang-pendek vokal itu <b>bisa ganti arti total</b>. Serius!</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>ビル</b> (BIRU) = gedung 🏢</li>
                <li><b>ビール</b> (BĪRU) = bir 🍺</li>
              </ul>
              <p className="text-xs italic">Salah tarik dikit, dari gedung bisa jadi bir. Hati-hati ya, hehe.</p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
              <p className="font-bold text-sm">🎮 Kuis Tarik Suara!</p>
              <Quiz
                question={<>Kata <b>"TAKUSHĪ"</b> (taksi). Mana penulisan yang bener?<br />A. タクシ<br />B. タクシー</>}
                placeholder="Ketik 'A' atau 'B'..."
                accept={["b"]}
                successMsg="MANTAP! 'TAKUSHĪ' bunyi 'I' di akhir ditahan panjang, jadi pakai ー. タクシー ✅"
                errorMsg="Hmm, kalau bunyi terakhirnya ditarik panjang 'shīīī', kita butuh si garis ー di belakang."
              />
            </div>

            <div className="rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(16,185,129,0.55)] dark:shadow-[0_0_16px_rgba(16,185,129,0.65)]">
              <p className="font-bold">💡 Fun Fact</p>
              <p className="leading-relaxed text-xs">
                Garis ー ini <b>ngikutin arah tulisan</b>. Kalau nulisnya mendatar (kiri→kanan), garisnya
                horizontal. Kalau nulis vertikal (kayak di manga), otomatis garisnya jadi vertikal juga!
              </p>
            </div>
          </div>
        </section>

        <SectionDivider label="Gairaigo — Bunyi Khusus" />

        {/* Gairaigo */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🌍 Bunyi Khusus Bule (Gairaigo)</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Masalah klasik: bahasa Jepang aslinya <b>nggak punya bunyi "FA", "VI", "TI", "WO"</b>
              dan teman-temannya. Padahal kata serapan dari bahasa asing butuh banget bunyi-bunyi itu
              (kayak <i>family</i>, <i>video</i>, <i>party</i>).
            </p>
            <p>
              Solusinya orang Jepang gimana? <b>Bikin kombinasi baru</b> pakai trik yang udah kamu tahu:
              <b> huruf besar + huruf kecil ditempel</b>!
            </p>

            <div className="rounded-xl border-2 border-dashed border-violet-400 dark:border-violet-400 bg-violet-100 dark:bg-violet-900/50 p-3 space-y-2 shadow-[0_0_12px_rgba(167,139,250,0.55)] dark:shadow-[0_0_16px_rgba(167,139,250,0.65)]">
              <p className="font-bold">🧪 Mekanismenya: "Matiin Vokal, Tempel Vokal Baru"</p>
              <p>
                Konsepnya mirip blender Yōon, tapi yang nempel bukan ャ/ュ/ョ — melainkan
                <b> vokal kecil</b> (ァ ィ ゥ ェ ォ). Tugasnya:
                "matikan" vokal asli si huruf besar, terus ganti pakai vokal baru.
              </p>
              <p className="font-semibold">Contoh paling sering muncul:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>
                  <b>フ (FU)</b> + <b>ァ kecil</b> = <b><span style={{ fontFamily: "serif" }} className="text-lg">ファ</span></b> (FA).
                  Bunyi "U" di FU dimatiin, diganti "A". Jadi <b>"FA"</b>!
                </li>
                <li>
                  <b>フ (FU)</b> + <b>ィ kecil</b> = <b><span style={{ fontFamily: "serif" }} className="text-lg">フィ</span></b> (FI). Contoh: <b>フィルム</b> (FIRUMU — film).
                </li>
                <li>
                  <b>ウ (U)</b> + <b>ォ kecil</b> = <b><span style={{ fontFamily: "serif" }} className="text-lg">ウォ</span></b> (WO). Contoh: <b>ウォーター</b> (WŌTĀ — water).
                </li>
                <li>
                  <b>テ (TE)</b> + <b>ィ kecil</b> = <b><span style={{ fontFamily: "serif" }} className="text-lg">ティ</span></b> (TI). Contoh: <b>パーティー</b> (PĀTĪ — party).
                </li>
                <li>
                  <b>ヴ (VU)</b> + <b>ァ kecil</b> = <b><span style={{ fontFamily: "serif" }} className="text-lg">ヴァ</span></b> (VA). Contoh: <b>ヴァイオリン</b> (VAIORIN — violin).
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
              <p className="font-bold">📐 Posisi Si Vokal Kecil</p>
              <p>
                Sama persis kayak ャ/ュ/ョ tadi: <b>seperempat kotak</b>, duduk manis di
                <b> pojok kiri-bawah</b> kalau nulis mendatar.
              </p>
              <p className="text-xs italic">
                Inget ya: ァ ı ゥ ェ ォ <b>nggak punya suara sendiri</b> kalau berdiri sendiri di tengah
                kata. Tugasnya cuma "nyolok-in vokal baru" ke huruf besar di sebelah kirinya.
              </p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
              <p className="font-bold text-sm">🎮 Kuis Racik Bunyi Bule!</p>
              <Quiz
                question={<>Kamu mau nulis kata <b>"FAN"</b> (kipas/penggemar). Bunyi <b>"FA"</b>-nya kamu racik dari…?<br />A. ハ (HA) + ァ kecil<br />B. フ (FU) + ァ kecil</>}
                placeholder="Ketik 'A' atau 'B'..."
                accept={["b"]}
                successMsg="JOSS! Bener. Cuma フ (FU) yang punya bunyi 'F'. Ditempel ァ kecil → matiin 'U', ganti 'A' = FA. ファン ✅"
                errorMsg="Hampir! Inget: bunyi 'F' di Jepang asalnya cuma dari フ (FU). Yang lain nggak punya 'F'."
              />
            </div>
          </div>
          <KanaGrid items={KATAKANA_GAIRAIGO} cols={5} onPick={open} active={active} />

          {/* Tutorial nulis nama asing pake katakana */}
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <h3 className="font-display text-xl font-bold">✍️ Tutorial: Nulis Nama Kamu Pakai Katakana</h3>
            <p>
              Nama orang Indonesia itu <b>asing</b> buat orang Jepang, jadi wajib ditulis pakai Katakana.
              Tapi ada PR-nya: bahasa Jepang <b>nggak punya konsonan mati</b> (huruf konsonan yang berdiri
              sendiri di akhir suku kata). Solusinya? <b>Tambahin vokal "U"</b> di belakangnya — kecuali
              beberapa kasus khusus di bawah.
            </p>

            <div className="rounded-xl border-2 border-dashed border-sky-400 dark:border-sky-400 bg-sky-100 dark:bg-sky-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(56,189,248,0.55)] dark:shadow-[0_0_16px_rgba(56,189,248,0.65)]">
              <p className="font-bold">📋 Aturan Tambah Vokal di Belakang Konsonan Mati</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Default: tambah <b>"U"</b> → <i>Ahmad → A-fu-ma-do</i> (kecuali D), <i>Ramadan → Ra-ma-da-n</i>.</li>
                <li>Setelah <b>T</b> atau <b>D</b> → tambah <b>"O"</b> (biar nggak jadi "tsu/zu"). Contoh: <b>Ahmad → アフマド</b> (A-fu-ma-<b>do</b>), <b>Robert → ロバート</b>.</li>
                <li>Setelah <b>CH / J / SH</b> → tambah <b>"I"</b>. Contoh: <b>March → マーチ</b>.</li>
                <li>Huruf <b>N</b> di akhir suku kata istimewa — pakai <b>ン</b> tanpa vokal. Contoh: <b>Andi → アンディ</b>, <b>Yanto → ヤント</b>.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-violet-400 dark:border-violet-400 bg-violet-100 dark:bg-violet-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(167,139,250,0.55)] dark:shadow-[0_0_16px_rgba(167,139,250,0.65)]">
              <p className="font-bold">🔁 Ganti Huruf yang Nggak Ada di Jepang</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>L</b> → pakai baris <b>R</b> (ラ リ ル レ ロ). Contoh: <b>Lia → リア</b>, <b>Lulu → ルル</b>.</li>
                <li><b>V</b> → boleh <b>ヴ</b> atau diganti <b>B</b>. Contoh: <b>Vino → ヴィノ / ビノ</b>.</li>
                <li><b>F</b> → pakai <b>フ + vokal kecil</b> (ファ フィ フェ フォ). Contoh: <b>Fajar → ファジャル</b>.</li>
                <li><b>Di / Ti / Tu</b> dari Bunyi Khusus → <b>ディ / ティ / トゥ</b>. Contoh: <b>Dian → ディアン</b>, <b>Tian → ティアン</b>.</li>
                <li>Suku kata dengan <b>Y</b> (-ya/-yu/-yo) pakai yōon. Contoh: <b>Surya → スルヤ</b>, <b>Wahyu → ワヒュ</b>.</li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(16,185,129,0.55)] dark:shadow-[0_0_16px_rgba(16,185,129,0.65)]">
              <p className="font-bold">💡 Contoh Nama Indonesia</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 list-disc list-inside">
                <li><b>Ahmad</b> → <span style={{ fontFamily: "serif" }} className="text-base">アフマド</span> (A-fu-ma-do)</li>
                <li><b>Andi</b> → <span style={{ fontFamily: "serif" }} className="text-base">アンディ</span></li>
                <li><b>Budi</b> → <span style={{ fontFamily: "serif" }} className="text-base">ブディ</span></li>
                <li><b>Citra</b> → <span style={{ fontFamily: "serif" }} className="text-base">チトラ</span></li>
                <li><b>Dewi</b> → <span style={{ fontFamily: "serif" }} className="text-base">デウィ</span></li>
                <li><b>Fajar</b> → <span style={{ fontFamily: "serif" }} className="text-base">ファジャル</span></li>
                <li><b>Lia</b> → <span style={{ fontFamily: "serif" }} className="text-base">リア</span></li>
                <li><b>Rizal</b> → <span style={{ fontFamily: "serif" }} className="text-base">リザル</span></li>
                <li><b>Sinta</b> → <span style={{ fontFamily: "serif" }} className="text-base">シンタ</span></li>
                <li><b>Wahyu</b> → <span style={{ fontFamily: "serif" }} className="text-base">ワヒュ</span></li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-dashed border-primary bg-primary/15 p-3 space-y-2 shadow-[0_0_14px_hsl(var(--primary)/0.55)] dark:shadow-[0_0_18px_hsl(var(--primary)/0.7)]">
              <p className="font-bold text-sm">🎮 Coba Tulis Namamu Sendiri!</p>
              <NameToKatakana />
              <p className="text-xs italic text-muted-foreground">
                Catatan: hasil otomatis ini cuma <b>perkiraan</b> berdasarkan aturan di atas. Untuk nama
                yang punya banyak konsonan numpuk, kadang penulis Jepang nge-tweak sesuai selera bunyinya.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider label="Bonus: Nama-Nama Negara" />

        {/* Bonus: Country names */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🌏 Bonus: Nama-Nama Negara dalam Katakana</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Nama negara asing hampir semuanya ditulis pakai <b>Katakana</b> (karena, ya, asing!). Bunyinya
              sering diserap dari bahasa lokal negara itu sendiri — bukan dari bahasa Inggris. Makanya
              <b> "Jerman" jadi ドイツ (Doitsu)</b> dari <i>Deutsch</i>, dan <b>"Belanda" jadi オランダ (Oranda)</b>
              dari <i>Holland</i>. Yuk hafalan!
            </p>
            <CountryGrid />
            <div className="rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-400 bg-amber-100 dark:bg-amber-900/50 p-3 space-y-1 shadow-[0_0_12px_rgba(245,158,11,0.55)] dark:shadow-[0_0_16px_rgba(245,158,11,0.65)]">
              <p className="font-bold">💡 Pola yang Bisa Kamu Tangkap</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Konsonan akhir biasanya ditambah <b>U</b> atau <b>O</b>: <i>Egypt → エジプト</i>, <i>Brazil → ブラジル</i>.</li>
                <li><b>L</b> selalu jadi baris <b>R</b>: <i>Brazil → ブラ<b>ジル</b></i>, <i>Singapore → シンガポー<b>ル</b></i>.</li>
                <li>Vokal panjang pakai <b>ー</b>: <i>Australia → オースト<b>ラ</b>リア</i>, <i>Singapore → シンガ<b>ポー</b>ル</i>.</li>
                <li>Bunyi <b>V/F</b> pakai bunyi khusus: <i>Vietnam → <b>ベ</b>トナム</i> (V dilembutkan jadi B), <i>Philippines → <b>フィ</b>リピン</i>.</li>
              </ul>
            </div>
          </div>
        </section>


        <div className="text-center py-4">
          <Link to="/play" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow hover:brightness-110">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20">▶️ MAIN</span>
            <span>saya sudah selesai belajar, ayo cetak rekor skor game baru!</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function romajiFor(char: string): string {
  const all = [...KATAKANA, ...KATAKANA_YOUON, ...KATAKANA_SOKUON, ...KATAKANA_GAIRAIGO];
  return all.find((k) => k.char === char)?.romaji ?? "";
}
function isYouon(char: string): boolean {
  return KATAKANA_YOUON.some((k) => k.char === char) || KATAKANA_GAIRAIGO.some((k) => k.char === char);
}
function isSokuon(char: string): boolean {
  return KATAKANA_SOKUON.some((k) => k.char === char);
}
function charForStroke(char: string): string {
  if (char.length === 1) return char;
  if (char.startsWith("ッ")) return "ッ";
  return char[char.length - 1];
}

/* ---------- Grids ---------- */

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

interface PickProps { onPick: (c: string) => void; active: string | null }

const GROUP_RGB: Record<string, string> = {
  vowel: "244,114,182",
  k: "245,158,11",
  s: "56,189,248",
  t: "16,185,129",
  n: "167,139,250",
  h: "244,63,94",
  m: "234,179,8",
  y: "45,212,191",
  r: "129,140,248",
  w: "217,70,239",
  g: "132,204,22",
  z: "34,211,238",
  d: "249,115,22",
  b: "168,85,247",
  p: "236,72,153",
  youon: "167,139,250",
  sokuon: "245,158,11",
  choon: "56,189,248",
};

function groupFor(char: string): string {
  const all = [...KATAKANA, ...KATAKANA_YOUON, ...KATAKANA_SOKUON, ...KATAKANA_GAIRAIGO];
  return all.find((k) => k.char === char)?.group ?? "vowel";
}

function KanaCell({ char, romaji, onPick, active }: { char: string; romaji: string } & PickProps) {
  const isActive = active === char;
  const rgb = GROUP_RGB[groupFor(char)] ?? "244,114,182";
  const style = isActive
    ? undefined
    : {
        borderColor: `rgb(${rgb})`,
        boxShadow: `0 0 10px rgba(${rgb},0.55), 0 0 18px rgba(${rgb},0.25)`,
      };
  return (
    <div
      className={["rounded-xl border-2 p-2 text-center bg-background flex flex-col items-center gap-1 transition", isActive ? "border-primary ring-2 ring-primary/40 shadow-[0_0_14px_hsl(var(--primary)/0.6)]" : ""].join(" ")}
      style={style}
    >
      <div className="text-3xl leading-none mt-1" style={{ fontFamily: "serif" }}>{char}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider" style={isActive ? undefined : { color: `rgb(${rgb})` }}>{romaji}</div>
      <div className="flex gap-1 mt-0.5">
        <button
          onClick={() => speakKana(char)}
          className="text-[11px] px-1.5 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 font-semibold"
          aria-label={`Dengar ${romaji}`}
          title="Dengar pelan"
        >🔊</button>
        <button
          onClick={() => onPick(char)}
          className="text-[11px] px-1.5 py-0.5 rounded-md bg-amber-200/60 hover:bg-amber-300/70 dark:bg-amber-900/40 dark:hover:bg-amber-800/50 font-semibold"
          aria-label={`Urutan menulis ${romaji}`}
          title="Lihat urutan menulis"
        >✍️</button>
      </div>
    </div>
  );
}

function KanaGrid({ items, cols, onPick, active }: { items: { char: string; romaji: string }[]; cols: number } & PickProps) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {items.map((k) => (
        <KanaCell key={k.char} char={k.char} romaji={k.romaji} onPick={onPick} active={active} />
      ))}
    </div>
  );
}

function GojuonGrid({ onPick, active }: PickProps) {
  const baseGroups = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"] as const;
  // Exclude chōonpu (ー) from the gojuon grid — it has its own section.
  const base = KATAKANA.filter((k) => k.group !== "choon");
  const rows = baseGroups.map((g) => base.filter((k) => k.group === g));
  return (
    <div className="space-y-2">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}
        >
          {row.map((k) => (
            <KanaCell key={k.char} char={k.char} romaji={k.romaji} onPick={onPick} active={active} />
          ))}
          {Array.from({ length: 5 - row.length }).map((_, i) => (
            <div key={`pad-${i}`} className="hidden sm:block" />
          ))}
        </div>
      ))}
    </div>
  );
}

function DakuonGrid({ onPick, active }: PickProps) {
  const groups = ["g", "z", "d", "b", "p"] as const;
  return (
    <div className="space-y-2">
      {groups.map((g) => {
        const row = KATAKANA.filter((k) => k.group === g);
        return (
          <div
            key={g}
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}
          >
            {row.map((k) => (
              <KanaCell key={k.char} char={k.char} romaji={k.romaji} onPick={onPick} active={active} />
            ))}
            {Array.from({ length: 5 - row.length }).map((_, i) => (
              <div key={`pad-${g}-${i}`} className="hidden sm:block" />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Name-to-Katakana converter ---------- */

function convertNameToKatakana(input: string): string {
  // Map of syllables to katakana. Order matters: longer matches first.
  const map: Array<[RegExp, string]> = [
    // 3-char specials
    [/^kyo/, "キョ"], [/^kyu/, "キュ"], [/^kya/, "キャ"],
    [/^gyo/, "ギョ"], [/^gyu/, "ギュ"], [/^gya/, "ギャ"],
    [/^sho/, "ショ"], [/^shu/, "シュ"], [/^sha/, "シャ"], [/^she/, "シェ"], [/^shi/, "シ"],
    [/^cho/, "チョ"], [/^chu/, "チュ"], [/^cha/, "チャ"], [/^che/, "チェ"], [/^chi/, "チ"],
    [/^jyo|^jo/, "ジョ"], [/^jyu|^ju/, "ジュ"], [/^jya|^ja/, "ジャ"], [/^je/, "ジェ"], [/^ji/, "ジ"],
    [/^nyo/, "ニョ"], [/^nyu/, "ニュ"], [/^nya/, "ニャ"],
    [/^hyo/, "ヒョ"], [/^hyu/, "ヒュ"], [/^hya/, "ヒャ"],
    [/^byo/, "ビョ"], [/^byu/, "ビュ"], [/^bya/, "ビャ"],
    [/^pyo/, "ピョ"], [/^pyu/, "ピュ"], [/^pya/, "ピャ"],
    [/^myo/, "ミョ"], [/^myu/, "ミュ"], [/^mya/, "ミャ"],
    [/^ryo|^lyo/, "リョ"], [/^ryu|^lyu/, "リュ"], [/^rya|^lya/, "リャ"],
    [/^tsu/, "ツ"], [/^tsa/, "ツァ"], [/^tsi/, "ツィ"], [/^tse/, "ツェ"], [/^tso/, "ツォ"],
    // F + small vowel
    [/^fa/, "ファ"], [/^fi/, "フィ"], [/^fe/, "フェ"], [/^fo/, "フォ"], [/^fu/, "フ"],
    // V (use ヴ family)
    [/^va/, "ヴァ"], [/^vi/, "ヴィ"], [/^vu/, "ヴ"], [/^ve/, "ヴェ"], [/^vo/, "ヴォ"],
    // Ti/Di/Tu/Du (gairaigo)
    [/^ti/, "ティ"], [/^di/, "ディ"], [/^tu/, "トゥ"], [/^du/, "ドゥ"],
    // W + e/i/o (foreign)
    [/^wi/, "ウィ"], [/^we/, "ウェ"], [/^wo/, "ウォ"], [/^wa/, "ワ"], [/^wu/, "ウ"],
    // Y row
    [/^ya/, "ヤ"], [/^yu/, "ユ"], [/^yo/, "ヨ"],
    // Basic CV
    [/^ka/, "カ"], [/^ki/, "キ"], [/^ku/, "ク"], [/^ke/, "ケ"], [/^ko/, "コ"],
    [/^ga/, "ガ"], [/^gi/, "ギ"], [/^gu/, "グ"], [/^ge/, "ゲ"], [/^go/, "ゴ"],
    [/^sa/, "サ"], [/^su/, "ス"], [/^se/, "セ"], [/^so/, "ソ"],
    [/^za/, "ザ"], [/^zi/, "ジ"], [/^zu/, "ズ"], [/^ze/, "ゼ"], [/^zo/, "ゾ"],
    [/^ta/, "タ"], [/^te/, "テ"], [/^to/, "ト"],
    [/^da/, "ダ"], [/^de/, "デ"], [/^do/, "ド"],
    [/^na/, "ナ"], [/^ni/, "ニ"], [/^nu/, "ヌ"], [/^ne/, "ネ"], [/^no/, "ノ"],
    [/^ha/, "ハ"], [/^hi/, "ヒ"], [/^he/, "ヘ"], [/^ho/, "ホ"],
    [/^ba/, "バ"], [/^bi/, "ビ"], [/^bu/, "ブ"], [/^be/, "ベ"], [/^bo/, "ボ"],
    [/^pa/, "パ"], [/^pi/, "ピ"], [/^pu/, "プ"], [/^pe/, "ペ"], [/^po/, "ポ"],
    [/^ma/, "マ"], [/^mi/, "ミ"], [/^mu/, "ム"], [/^me/, "メ"], [/^mo/, "モ"],
    [/^ra|^la/, "ラ"], [/^ri|^li/, "リ"], [/^ru|^lu/, "ル"], [/^re|^le/, "レ"], [/^ro|^lo/, "ロ"],
    // Vowels
    [/^a/, "ア"], [/^i/, "イ"], [/^u/, "ウ"], [/^e/, "エ"], [/^o/, "オ"],
  ];

  // Normalize: lowercase, strip non-letters except spaces.
  const cleaned = input.toLowerCase().replace(/[^a-z\s]/g, "");
  if (!cleaned.trim()) return "";

  function convertWord(word: string): string {
    let s = word;
    let out = "";
    // simple safety cap
    let guard = 0;
    while (s.length > 0 && guard++ < 200) {
      // Handle stranded consonant: if a consonant has no following vowel, add one.
      // Detect: first char is consonant, second char is also consonant (or end).
      const c0 = s[0];
      const c1 = s[1] ?? "";
      const isV = (ch: string) => "aiueo".includes(ch);

      // Special: standalone "n" (not followed by vowel or y) → ン
      if (c0 === "n" && !isV(c1) && c1 !== "y") {
        out += "ン";
        s = s.slice(1);
        continue;
      }

      // Try matching syllable directly
      let matched = false;
      for (const [re, kata] of map) {
        const m = s.match(re);
        if (m) {
          out += kata;
          s = s.slice(m[0].length);
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // Stranded consonant: insert a vowel.
      if (!isV(c0)) {
        // pick filler vowel
        let filler = "u";
        if (c0 === "t" || c0 === "d") filler = "o";
        else if (c0 === "j" || c0 === "y" || c0 === "c" || c0 === "h" && c1 === "")
          filler = "i";
        // 'ch' / 'sh' already handled; remaining 'c' becomes "k"
        let head = c0;
        if (head === "c") head = "k";
        if (head === "x") head = "ku";
        if (head === "q") head = "ku";
        s = head + filler + s.slice(1);
        continue;
      }

      // Unknown char — skip
      s = s.slice(1);
    }
    return out;
  }

  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map(convertWord)
    .join(" ・ ");
}

function NameToKatakana() {
  const [name, setName] = useState("");
  const out = convertNameToKatakana(name);
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ketik nama kamu (huruf latin)... cth: Ahmad, Andi, Lia"
          className="flex-1 h-10 px-3 rounded-lg border-2 border-border bg-background text-sm focus:outline-none focus:border-primary"
          maxLength={40}
        />
        <button
          type="button"
          onClick={() => out && speakKana(out.replace(/・/g, " "))}
          disabled={!out}
          className="h-10 px-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 disabled:opacity-40"
          aria-label="Dengar"
          title="Dengar pelan"
        >🔊</button>
      </div>
      {out && (
        <div className="rounded-lg bg-background border-2 border-primary/40 p-3 text-center">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Hasil Katakana</p>
          <p className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: "serif" }}>{out}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Country names grid ---------- */

const COUNTRIES: Array<{ flag: string; id: string; kata: string; romaji: string }> = [
  { flag: "🇺🇸", id: "Amerika",    kata: "アメリカ",       romaji: "Amerika" },
  { flag: "🇪🇬", id: "Mesir/Arab", kata: "エジプト",       romaji: "Ejiputo" },
  { flag: "🇬🇧", id: "Inggris",    kata: "イギリス",       romaji: "Igirisu" },
  { flag: "🇦🇺", id: "Australia",  kata: "オーストラリア", romaji: "Ōsutoraria" },
  { flag: "🇮🇹", id: "Italia",     kata: "イタリア",       romaji: "Itaria" },
  { flag: "🇨🇦", id: "Kanada",     kata: "カナダ",         romaji: "Kanada" },
  { flag: "🇮🇳", id: "India",      kata: "インド",         romaji: "Indo" },
  { flag: "🇪🇸", id: "Spanyol",    kata: "スペイン",       romaji: "Supein" },
  { flag: "🇮🇩", id: "Indonesia",  kata: "インドネシア",   romaji: "Indoneshia" },
  { flag: "🇹🇭", id: "Thailand",   kata: "タイ",           romaji: "Tai" },
  { flag: "🇩🇪", id: "Jerman",     kata: "ドイツ",         romaji: "Doitsu" },
  { flag: "🇻🇳", id: "Vietnam",    kata: "ベトナム",       romaji: "Betonamu" },
  { flag: "🇭🇺", id: "Hungaria",   kata: "ハンガリー",     romaji: "Hangarī" },
  { flag: "🇲🇾", id: "Malaysia",   kata: "マレーシア",     romaji: "Marēshia" },
  { flag: "🇵🇭", id: "Filipina",   kata: "フィリピン",     romaji: "Firipin" },
  { flag: "🇲🇽", id: "Meksiko",    kata: "メキシコ",       romaji: "Mekishiko" },
  { flag: "🇧🇷", id: "Brazil",     kata: "ブラジル",       romaji: "Burajiru" },
  { flag: "🇷🇺", id: "Rusia",      kata: "ロシア",         romaji: "Roshia" },
  { flag: "🇫🇷", id: "Perancis",   kata: "フランス",       romaji: "Furansu" },
  { flag: "🇸🇬", id: "Singapura",  kata: "シンガポール",   romaji: "Shingapōru" },
  { flag: "🇯🇵", id: "Jepang",     kata: "日本 / ニホン",  romaji: "Nihon" },
  { flag: "🇰🇷", id: "Korea",      kata: "カンコク",       romaji: "Kankoku" },
  { flag: "🇨🇳", id: "Tiongkok",   kata: "チュウゴク",     romaji: "Chūgoku" },
  { flag: "🇳🇱", id: "Belanda",    kata: "オランダ",       romaji: "Oranda" },
];

function CountryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {COUNTRIES.map((c) => (
        <div
          key={c.id}
          className="rounded-xl border-2 border-border bg-background p-3 flex items-center gap-3 hover:border-primary/60 transition"
        >
          <div className="text-3xl leading-none shrink-0" aria-hidden>{c.flag}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight">{c.id}</p>
            <p className="text-xl leading-tight" style={{ fontFamily: "serif" }}>{c.kata}</p>
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">{c.romaji}</p>
          </div>
          <button
            onClick={() => speakKana(c.kata.replace(/[^ァ-ヶー一-龯]/g, ""))}
            className="text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg shrink-0"
            aria-label={`Dengar ${c.id}`}
            title="Dengar pelan"
          >🔊</button>
        </div>
      ))}
    </div>
  );
}

