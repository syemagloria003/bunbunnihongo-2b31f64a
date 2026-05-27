import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HIRAGANA, YOUON, SOKUON } from "@/game/kana-data";
import { KanjiStrokeOrder } from "@/components/KanjiStrokeOrder";

export const Route = createFileRoute("/belajar/hiragana")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Belajar Hiragana — BeeGana" },
      { name: "description", content: "Pengenalan Hiragana: sejarah, fungsi, gojuon, dakuon, handakuon, youon, dan sokuon. Lengkap dengan suara dan urutan goresan." },
    ],
  }),
  component: BelajarHiragana,
});

/** Speak a kana slowly in Japanese for learning. */
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
  // Prefer a Japanese voice if available
  const voices = window.speechSynthesis.getVoices();
  const jp = voices.find((v) => v.lang?.toLowerCase().startsWith("ja"));
  if (jp) u.voice = jp;
  window.speechSynthesis.speak(u);
}

// Pre-warm voices on some browsers
function useWarmVoices() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const w = () => window.speechSynthesis.getVoices();
    w();
    window.speechSynthesis.onvoiceschanged = w;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);
}

function BelajarHiragana() {
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
        <div className="flex items-center justify-between gap-2">
          <Link to="/play" className="text-sm font-semibold hover:text-primary">← Kembali ke Peta</Link>
          <span className="text-2xl">📖</span>
        </div>

        <header className="text-center space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Belajar Hiragana 📖</h1>
          <p className="text-sm text-muted-foreground">
            Tekan 🔊 untuk dengar pelan-pelan, tekan ✍️ untuk lihat urutan menulisnya.
          </p>
        </header>

        {/* Intro: Duo Kembar */}
        <section className="honey-card rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-2xl font-bold">🎌 Kenalan Dulu Sama "Duo Kembar" Jepang</h2>
          <p className="text-sm leading-relaxed">
            Halo! Selamat datang di tempat paling santai buat belajar nulis Jepang.
          </p>
          <p className="text-sm leading-relaxed">
            Pernah bingung kenapa tulisan Jepang itu bentuknya beda-beda? Ada yang
            melengkung cantik, ada yang kaku kayak robot, ada juga yang ruwet
            banget kayak benang kusut? Tenang, kamu nggak sendirian!
          </p>
          <p className="text-sm leading-relaxed">
            Di Jepang, mereka emang pakai <b>3 jenis huruf</b> sekaligus. Tapi
            untuk pemula, kita cukup kenalan sama dua saudari kembar ini dulu:
            <b> Hiragana</b> dan <b>Katakana</b>.
          </p>

          <p className="text-sm font-bold mt-2">Bedanya apa sih? Gampang banget bedainnya!</p>

          <div className="rounded-xl bg-pink-100/70 dark:bg-pink-950/30 p-3 space-y-1 text-sm">
            <p className="font-bold">1. Hiragana (Si Kalem Asli Jepang) 🌸</p>
            <p><b>Fungsi:</b> Dipakai buat nulis kata-kata yang asli dari bahasa Jepang. Misalnya: <i>Arigatou</i> (Terima kasih) atau <i>Sayonara</i> (Selamat tinggal).</p>
            <p><b>Bentuknya:</b> Luwes, melengkung-lengkung, dan santai. Ibaratnya kayak mi instan yang udah matang. 🍜</p>
            <p><b>Contoh:</b> <span style={{ fontFamily: "serif" }} className="text-lg">あ</span> (A), <span style={{ fontFamily: "serif" }} className="text-lg">め</span> (Me), <span style={{ fontFamily: "serif" }} className="text-lg">の</span> (No). Kelihatan kan lengkungannya?</p>
          </div>

          <div className="rounded-xl bg-sky-100/70 dark:bg-sky-950/30 p-3 space-y-1 text-sm">
            <p className="font-bold">2. Katakana (Si Gaul Suka Barang Impor) ⚡</p>
            <p><b>Fungsi:</b> Dipakai khusus untuk kata serapan dari bahasa asing (kayak bahasa Inggris), nama negara asing, atau nama kamu! Yup, karena kita bukan orang Jepang, nama kita bakal ditulis pakai huruf ini.</p>
            <p><b>Bentuknya:</b> Kaku, tajam-tajam, dan tegas. Ibaratnya kayak pedang ninja atau robot transformer. ⚔️</p>
            <p><b>Contoh:</b> <span style={{ fontFamily: "serif" }} className="text-lg">ア</span> (A), <span style={{ fontFamily: "serif" }} className="text-lg">メ</span> (Me), <span style={{ fontFamily: "serif" }} className="text-lg">ノ</span> (No). Kelihatan lebih bersudut dan tajam kan dibanding Hiragana?</p>
          </div>

          <div className="rounded-xl bg-primary/10 p-3 space-y-2">
            <p className="font-bold text-sm">🎮 Waktunya Praktik!</p>
            <p className="text-sm">
              Karena kamu udah tahu bedanya, sekarang kita tes sedikit yuk.
              Nggak usah dihafal dulu bentuknya, cukup pakai logika aja dari
              penjelasan di atas.
            </p>
            <Quiz
              question={<>Kalau kamu mau nulis kata <b>"KOMPUTER"</b> (dari bahasa Inggris <i>computer</i>), huruf mana yang bakal kamu pakai?<br />A. Hiragana (Si Melengkung)<br />B. Katakana (Si Kaku)</>}
              placeholder="Ketik 'A' atau 'B' di sini..."
              accept={["b"]}
              successMsg="CAKEP! Bener banget. Karena 'komputer' itu bahasa Inggris, si Katakana yang bakal turun tangan."
              errorMsg="Hmm, coba pikir lagi — 'komputer' itu kata serapan dari bahasa asing. Geng mana yang kebagian tugas ini?"
            />
          </div>
        </section>

        {/* Sticky preview card for selected kana */}
        {active && (
          <div ref={cardRef} className="sticky top-2 z-20">
            <div className="honey-card rounded-2xl p-4 flex items-center gap-4 shadow-xl border-2 border-primary/40 bg-background/95 backdrop-blur">
              <KanjiStrokeOrder char={charForStroke(active)} size={140} strokeDuration={900} strokeGap={250} />
              <div className="flex-1 min-w-0">
                <p className="text-5xl sm:text-6xl font-bold" style={{ fontFamily: "serif" }}>{active}</p>
                <p className="text-lg text-muted-foreground font-semibold">{romajiFor(active)}</p>
                {isYouon(active) && (
                  <p className="text-xs mt-2 text-amber-700 dark:text-amber-300">
                    📐 Youon: huruf kecil ditulis di <b>kanan-bawah</b>, kira-kira <b>seperempat kotak</b> Mandarin.
                  </p>
                )}
                {isSokuon(active) && (
                  <p className="text-xs mt-2 text-amber-700 dark:text-amber-300">
                    📐 Sokuon (っ kecil) juga ditulis di <b>kanan-bawah</b>, sekitar <b>seperempat kotak</b>.
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

        {/* Gojuon table */}
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-2xl font-bold">🌸 Gojūon — 46 Huruf Dasar</h2>
            <p className="text-sm text-muted-foreground">Dibaca per baris: a–i–u–e–o, lalu ka–ki–ku–ke–ko, dan seterusnya.</p>
          </div>
          <GojuonGrid onPick={open} active={active} />
        </section>

        {/* Dakuon + Handakuon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">💧 Dakuon &amp; ⭕ Handakuon</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-2">
            <p>
              <b>Dakuon</b> (濁音) = bunyi “keruh”. Dibuat dengan menambahkan
              tanda <b>゛</b> (ten-ten/dakuten) di kanan-atas huruf k, s, t, h.
              Contoh: か → が (ka → ga).
            </p>
            <p>
              <b>Handakuon</b> (半濁音) = bunyi “setengah keruh”. Hanya untuk
              baris h: ditambah tanda lingkaran kecil <b>゜</b> (maru/handakuten)
              di kanan-atas. Contoh: は → ぱ (ha → pa).
            </p>
          </div>
          <DakuonGrid onPick={open} active={active} />
        </section>

        {/* Youon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🎶 Yōon — Bunyi Gabungan</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-2">
            <p>
              <b>Yōon</b> (拗音) dibentuk dari kana baris -i (き, し, ち, に, ひ,
              み, り + dakuon) yang digabung dengan <b>ゃ / ゅ / ょ kecil</b>.
              Contoh: き + ゃ = きゃ (kya).
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              📐 <b>Cara nulisnya:</b> huruf ゃ/ゅ/ょ ditulis kecil di posisi
              <b> kanan-bawah</b> dari kotak Mandarin, kira-kira{" "}
              <b>seperempat ukuran kotak</b>. Tidak diletakkan di tengah!
            </p>
          </div>
          <KanaGrid items={YOUON} cols={3} onPick={open} active={active} />
        </section>

        {/* Sokuon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">⏸️ Sokuon — Konsonan Ganda</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-2">
            <p>
              <b>Sokuon</b> (促音) ditandai dengan <b>っ kecil</b>. Fungsinya
              menggandakan konsonan berikutnya dan memberi jeda kecil.
              Contoh: が<b>っ</b>こう (gakkō = sekolah).
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              📐 <b>Cara nulisnya:</b> sama seperti yōon — っ kecil ditulis di
              posisi <b>kanan-bawah</b>, sekitar <b>seperempat kotak</b>
              Mandarin.
            </p>
          </div>
          <KanaGrid items={SOKUON} cols={4} onPick={open} active={active} />
        </section>

        <div className="text-center py-4">
          <Link to="/play" className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow hover:brightness-110">
            🎮 Sudah siap, ayo main!
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function romajiFor(char: string): string {
  const all = [...HIRAGANA, ...YOUON, ...SOKUON];
  return all.find((k) => k.char === char)?.romaji ?? "";
}
function isYouon(char: string): boolean {
  return YOUON.some((k) => k.char === char);
}
function isSokuon(char: string): boolean {
  return SOKUON.some((k) => k.char === char);
}
/** For multi-char (yōon / sokuon), show stroke order of the BASE kana. */
function charForStroke(char: string): string {
  if (char.length === 1) return char;
  // For yōon, show the small ya/yu/yo (it's the new part to learn).
  // For sokuon "っX", show "っ" first stroke focus.
  if (char.startsWith("っ")) return "っ";
  // youon: second char is the small ya/yu/yo
  return char[char.length - 1];
}

/* ---------- Grids ---------- */

interface PickProps { onPick: (c: string) => void; active: string | null }

function KanaCell({ char, romaji, onPick, active }: { char: string; romaji: string } & PickProps) {
  const isActive = active === char;
  return (
    <div className={["rounded-xl border-2 p-2 text-center bg-background flex flex-col items-center gap-1 transition", isActive ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/60"].join(" ")}>
      <div className="text-3xl leading-none mt-1" style={{ fontFamily: "serif" }}>{char}</div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{romaji}</div>
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
  // Build rows from HIRAGANA up through n (excluding dakuon/handakuon).
  const baseGroups = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"] as const;
  const rows = baseGroups.map((g) => HIRAGANA.filter((k) => k.group === g));
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
          {/* pad y-row (3 items) and w-row (3 items) so rows align as 5 columns */}
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
        const row = HIRAGANA.filter((k) => k.group === g);
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
