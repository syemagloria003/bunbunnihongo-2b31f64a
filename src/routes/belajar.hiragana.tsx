import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HIRAGANA, YOUON, SOKUON } from "@/game/kana-data";
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
          <Link to="/play" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow hover:brightness-110">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20">▶️ MAIN</span>
            <span className="hidden sm:inline">saya sudah selesai belajar, ayo cetak rekor skor game baru!</span>
            <span className="sm:hidden">selesai belajar, cetak rekor!</span>
          </Link>
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
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold">🌸 Gojūon — 46 Huruf Dasar</h2>
          </div>

          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p className="font-bold text-base">🛑 Tunggu Dulu: Huruf Jepang Itu Ditulis, Bukan Digambar!</p>
            <p className="leading-relaxed">
              Sebelum kamu geser ke section selanjutnya dan mulai praktek nulis, ada satu rahasia penting yang wajib kamu tahu biar tulisanmu nggak kelihatan kayak tulisan alien 👽.
            </p>
            <p className="leading-relaxed">
              Pernah nggak kamu ngelihat huruf Jepang terus mikir, <i>"Ah gampang, tinggal tarik garis aja ngikutin bentuknya..."</i>
            </p>
            <p className="leading-relaxed">
              Eits, jangan sampai terjebak! Di Jepang, ada aturan saklek yang namanya <b>Kakijun</b> (Urutan Coretan).
            </p>

            <div className="rounded-xl bg-amber-100/70 dark:bg-amber-950/30 p-3 space-y-2">
              <p className="font-bold">Kenapa sih harus repot-repot ngikutin urutan?</p>
              <p className="leading-relaxed">
                Coba bayangin kamu pakai sepatu dulu, baru pakai kaus kaki. Bisa sih... tapi aneh, ribet, dan nggak nyaman kan?
              </p>
              <p className="leading-relaxed">
                Sama kayak nulis huruf Jepang. Kalau urutannya ngasal:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><b>Bentuknya jadi aneh:</b> Orang Jepang asli (dan gurumu!) pasti langsung tahu kalau huruf itu "digambar" ngasal, bukan ditulis. Proporsinya bakal meleyot-meleyot.</li>
                <li><b>Tangan cepat pegal:</b> Urutan coretan itu diciptakan supaya tangan kita ngalir dengan mulus dari satu garis ke garis berikutnya.</li>
              </ul>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 space-y-2">
              <p className="font-bold">Aturan Mainnya Gampang Banget!</p>
              <p className="leading-relaxed">
                Nggak perlu pusing, prinsip dasar nulis huruf Jepang itu cuma dua arah ini:
              </p>
              <div className="flex flex-col gap-1 pl-1">
                <p>➡️ <b>Selalu mulai dari Kiri ke Kanan</b></p>
                <p>⬇️ <b>Selalu mulai dari Atas ke Bawah</b></p>
              </div>
              <p className="text-xs text-muted-foreground">
                (Kalau ada garis yang menyilang, biasanya garis horizontal/mendatar yang digambar duluan, baru ditimpa garis vertikal/menurun).
              </p>
            </div>

            <div className="rounded-xl bg-emerald-100/70 dark:bg-emerald-950/30 p-3 space-y-2">
              <p className="font-bold">🎯 Misi Kamu:</p>
              <p className="leading-relaxed">
                Di kartu-kartu huruf selanjutnya, kamu bakal lihat petunjuk angka atau panah <b>(1, 2, 3...)</b>. Tolong jangan di-skip ya! Ikutin urutannya di awang-awang pakai jarimu dulu, atau coret-coret di kertas kotak mandarin sebelum kamu jawab kuisnya.
              </p>
              <p className="leading-relaxed">
                Kalau urutannya udah benar dari awal, dijamin tulisan tanganmu otomatis rapi dan estetik ala native speaker!
              </p>
              <p className="font-bold">Gimana, udah siap nulis dengan elegan? Yuk, gas scroll ke section pertama! 🚀</p>
            </div>

            <div className="rounded-xl bg-pink-100/70 dark:bg-pink-950/30 p-3 space-y-1">
              <p className="font-bold">💡 Fun Fact:</p>
              <p className="leading-relaxed text-xs">
                Zaman dulu, huruf Hiragana diciptakan untuk nulis cepat layaknya tulisan latin bersambung. Makanya, kalau urutan coretanmu benar, tanganmu otomatis bakal ngalir dari satu garis ke garis berikutnya tanpa macet!
              </p>
            </div>

          </div>

          <GojuonGrid onPick={open} active={active} />
        </section>

        {/* Dakuon + Handakuon — Jurus Upgrade */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🪄 Jurus Upgrade Huruf (Dakuon &amp; Handakuon)</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Kamu udah kenal beberapa huruf? Keren! Sekarang, kita belajar
              <b> jurus upgrade huruf</b>.
            </p>
            <p>
              <b>Kabar baiknya:</b> Kamu <b>NGGAK PERLU</b> ngafalin huruf baru
              dari nol! Kita cuma bakal main-main sedikit sama suara dan
              tenggorokan kamu. Yuk, kita mulai!
            </p>

            <div className="rounded-xl bg-amber-100/70 dark:bg-amber-950/30 p-3 space-y-1">
              <p className="font-bold">1. Dakuon si "Tanda Kutip" ( ゛) — Suara Ngotot! 💪</p>
              <p>
                Dakuon itu cuma nambahin tanda mirip kutip ( ゛) di pojok
                kanan atas huruf. Efeknya apa? Suaranya jadi lebih tebal.
                Nggak usah dihafal, mari kita buktikan pakai mulut kamu
                sendiri:
              </p>
              <p>
                <b>Praktik Langsung!</b> Coba kamu bilang: <b>"KA"</b>. Nah,
                sekarang tahan posisi lidah dan mulut kamu, lalu bilang "KA"
                lagi tapi suaranya lebih ditebalkan dan lebih ngotot dari
                tenggorokan.
              </p>
              <p>Bunyi apa yang keluar? Otomatis jadi <b>"GA"</b>, kan?</p>
              <p>
                Yep, sesimpel itu! <span style={{ fontFamily: "serif" }} className="text-lg">か</span> (KA)
                dikasih tanda kutip (゛) ➡️ jadinya <span style={{ fontFamily: "serif" }} className="text-lg">が</span> (GA).
              </p>
              <p className="font-semibold">Berlaku juga buat huruf lain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>SA (santai) ➡️ ditebelin jadi <b>ZA</b></li>
                <li>TA (santai) ➡️ ditebelin jadi <b>DA</b></li>
              </ul>
            </div>

            <div className="rounded-xl bg-rose-100/70 dark:bg-rose-950/30 p-3 space-y-1">
              <p className="font-bold">2. Handakuon si "Tanda Bulat" ( ゜) — Suara Meletup! 💥</p>
              <p>
                Kalau tanda kutip bikin ngotot, tanda bulat ( ゜) kecil ini
                bikin suara kamu <b>meletup</b>. Tanda ini cuma berlaku buat
                geng huruf <b>HA</b> ya.
              </p>
              <p>
                Coba rapatkan bibir atas dan bawahmu sekarang, terus hembuskan
                udara keluar sampai bibirmu kebuka (kayak nyembur pelan).
                Pasti bunyinya <b>"Pah!"</b>.
              </p>
              <p>
                <span style={{ fontFamily: "serif" }} className="text-lg">は</span> (HA)
                dikasih bulat (゜) ➡️ jadinya <span style={{ fontFamily: "serif" }} className="text-lg">ぱ</span> (PA).
              </p>
            </div>
          </div>
          <DakuonGrid onPick={open} active={active} />
        </section>

        {/* Youon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🌪️ Jurus Terakhir: "Blender Suara" (Youon)</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-3">
            <p>
              Udah paham jurus <b>ngotot</b> dan <b>ngerem</b>? Mantap! Sekarang kita masuk ke jurus terakhir. Kenalin nih, 3 huruf "anak bawang" yang suka nyempil dan ukurannya ditulis separuh lebih kecil: <b>ya (ゃ)</b>, <b>yu (ゅ)</b>, dan <b>yo (ょ)</b>.
            </p>
            <p>
              Tiga bocah kecil ini suka banget nempel di sebelah huruf-huruf <b>geng "I"</b> (kayak KI, SHI, CHI, NI, dll).
            </p>
            <p>
              Kalau mereka udah nempel, suaranya <b>nggak boleh</b> dibaca satu-satu. Mereka berdua harus masuk "blender" dan dilebur jadi <b>SATU SUARA</b> aja.
            </p>

            <div className="rounded-xl bg-violet-100/70 dark:bg-violet-950/30 p-3 space-y-1">
              <p className="font-bold">🥤 Bayangin Kamu Bikin Jus:</p>
              <p>
                Huruf <b>KI (き)</b> itu semangka. Huruf <b>ya kecil (ゃ)</b> itu melon.
              </p>
              <p>
                Kalau kamu disuruh minum jusnya, kamu nggak ngunyah semangka dulu baru melon kan? Kamu langsung minum hasil campurannya.
              </p>
              <p>
                Jadi, <b>KI (き)</b> ketemu <b>ya kecil (ゃ)</b> ➡️ BUKAN dibaca <i>Ki-ya</i> (dua ketuk). Langsung blender aja suaranya jadi ➡️ <b>KYA!</b> (satu ketuk/satu tarikan napas).
              </p>
              <p className="font-semibold">Contoh lain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>KI (き) + yu kecil (ゅ)</b> = diblender jadi <b>KYU</b> (bukan <i>Ki-yu</i>)</li>
                <li><b>HI (ひ) + yo kecil (ょ)</b> = diblender jadi <b>HYO</b> (bukan <i>Hi-yo</i>)</li>
              </ul>
            </div>

            <div className="rounded-xl bg-amber-100/70 dark:bg-amber-950/30 p-3 space-y-1">
              <p className="font-bold">⚠️ Awas Terkecoh Si Lidah Bule!</p>
              <p>
                Ada dua huruf yang kalau diblender, bentuk latinnya sedikit beda biar lidah kita lebih gampang nyebutnya:
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>SHI (し)</b> ketemu ya/yu/yo ➡️ Jadinya bukan <i>Shya</i>, tapi langsung <b>SHA, SHU, SHO</b>.</li>
                <li><b>CHI (ち)</b> ketemu ya/yu/yo ➡️ Jadinya bukan <i>Chya</i>, tapi langsung <b>CHA, CHU, CHO</b>.</li>
              </ul>
              <p>Gampang banget kan? Pokoknya lihat huruf kecil = masukin blender!</p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 space-y-2">
              <p className="font-bold text-sm">🎮 Kuis Blender Suara!</p>
              <p className="text-sm">Sekarang coba kita tes mesin blender di otakmu.</p>
              <p className="text-sm">
                <b>Teh Hijau Jepang!</b> Pasti kamu sering dengar minuman "Matcha". Nah, kalau mau nulis kata <b>Cha</b> pakai huruf Jepang, racikan huruf mana yang bakal kamu masukin ke blender?
              </p>
              <ul className="text-sm list-none space-y-0.5 pl-2">
                <li><b>A.</b> TA (た) + ya kecil (ゃ)</li>
                <li><b>B.</b> CHI (ち) + ya kecil (ゃ)</li>
              </ul>
              <Quiz
                question={<>Pilih jawabanmu:</>}
                placeholder="Ketik 'A' atau 'B' di sini..."
                accept={["b"]}
                successMsg="Tjakep! Bener banget. CHI (ち) ketemu ya kecil (ゃ) bakal diblender jadi CHA. Berarti sekarang kamu udah bisa pesan ocha di Jepang!"
                errorMsg="Hampir! Inget: yang punya bunyi 'CH' di awal cuma CHI. Coba lagi ya."
              />
            </div>

            <div className="rounded-xl bg-emerald-100/70 dark:bg-emerald-950/30 p-3 space-y-2">
              <p className="font-bold">📏 Posisi Duduk Si "Anak Bawang" (Khusus Buku Kotak!)</p>
              <p>
                Karena <b>ya (ゃ)</b>, <b>yu (ゅ)</b>, dan <b>yo (ょ)</b> ini itungannya "anak bawang", ukuran tubuh mereka saat ditulis itu cuma <b>seperempat (1/4)</b> dari huruf biasa. Mereka nggak boleh makan tempat!
              </p>
              <p>
                Kalau kamu lagi latihan nulis pakai buku kotak (kayak buku tulis Mandarin), bayangin satu kotak itu adalah <b>satu kasur</b>.
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><b>Huruf raksasa</b> (huruf biasa) bakal tidur santai menuhin satu kasur penuh.</li>
                <li>Si anak bawang ini karena badannya kecil, dia cuma boleh tiduran di <b>pojok kiri bawah</b> kasur (kalau kamu nulisnya mendatar dari kiri ke kanan).</li>
              </ul>

              {/* Mini illustration */}
              <div className="flex items-center gap-4 justify-center pt-1">
                <div className="text-center space-y-1">
                  <div className="relative w-20 h-20 border-2 border-emerald-500 rounded grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-dashed border-emerald-300" />
                    <div className="border-b border-dashed border-emerald-300" />
                    <div className="border-r border-dashed border-emerald-300 flex items-end justify-start p-0.5">
                      <span style={{ fontFamily: "serif" }} className="text-base leading-none">ょ</span>
                    </div>
                    <div />
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">✅ Benar: kiri bawah</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="relative w-20 h-20 border-2 border-rose-500 rounded flex items-center justify-center">
                    <span style={{ fontFamily: "serif" }} className="text-4xl leading-none">ょ</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300">❌ Salah: gede menuhin kotak</p>
                </div>
              </div>

              <div className="rounded-lg bg-white/60 dark:bg-black/20 p-2 text-xs">
                <b>💡 Info Penting:</b> Kalau kamu ngetik di keyboard HP atau komputer, sistemnya udah pintar kok. Begitu kamu ngetik "KYA", otomatis komputer bakal ngecilin huruf <b>ya (ゃ)</b> dan posisinya langsung nyesuaiin di bagian bawah. Canggih, kan?
              </div>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 space-y-2">
              <p className="font-bold text-sm">🎮 Kuis Visual!</p>
              <p className="text-sm">
                <b>Mana Posisi yang Benar?</b> Kalau kamu disuruh nulis kata <b>"TOKYO"</b> (とうきょう) di buku kotak secara mendatar, di mana letak huruf <b>yo (ょ)</b> kecilnya bersembunyi?
              </p>
              <ul className="text-sm list-none space-y-0.5 pl-2">
                <li><b>A.</b> Duduk manis di pojok <b>Kiri Bawah</b> kotaknya sendiri.</li>
                <li><b>B.</b> Nyempil di pojok <b>Kanan Atas</b>.</li>
              </ul>
              <Quiz
                question={<>Pilih jawabanmu:</>}
                placeholder="Ketik 'A' atau 'B' di sini..."
                accept={["a"]}
                successMsg="Tepat Sasaran! Di pojokan kiri bawah ya. Kalau di kanan atas, itu posisinya dipakai khusus kalau orang Jepang lagi nulis vertikal (dari atas ke bawah) kayak di komik manga!"
                errorMsg="Belum tepat. Inget: kalau nulis mendatar (kiri→kanan), anak bawang duduknya di pojok kiri bawah."
              />
            </div>
          </div>
          <KanaGrid items={YOUON} cols={3} onPick={open} active={active} />
        </section>

        {/* Sokuon */}
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">🛑 Sokuon si "Tsu Kecil" ( っ ) — Ngerem Mendadak!</h2>
          <div className="honey-card rounded-2xl p-4 text-sm space-y-2">
            <p>
              Kalau kamu lihat huruf <i>tsu</i> tapi ukurannya nyempil kecil
              (<span style={{ fontFamily: "serif" }}>っ</span>), itu namanya
              <b> Sokuon</b>. Ini <b>bukan</b> dibaca "tsu", tapi ini adalah
              tanda <b>ngerem mendadak</b> alias huruf ganda/konsonan ganda.
            </p>
            <p>
              Ibarat kamu lagi jalan, terus tiba-tiba ada lubang dan kamu
              nahan napas kaget.
            </p>
            <p>
              <b>Contoh:</b> Kata <b>KIPPU</b> (artinya: Tiket). Cara bacanya
              bukan <i>Ki-pu</i> (datar). Tapi: <b>KI…</b> (ngerem/tahan napas
              kaget sebentar) <b>…PU!</b>
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              📐 <b>Cara nulisnya:</b> sama seperti yōon — っ kecil ditulis di
              posisi <b>kanan-bawah</b>, sekitar <b>seperempat kotak</b>
              {" "}Mandarin.
            </p>
          </div>
          <KanaGrid items={SOKUON} cols={4} onPick={open} active={active} />

          <div className="rounded-xl bg-primary/10 p-3 space-y-2">
            <p className="font-bold text-sm">🎮 Coba Ketik Sendiri!</p>
            <p className="text-sm">Yuk pakai logika "ngotot" kamu tadi buat jawab kuis ini!</p>
            <Quiz
              question={<>Kalau huruf <b>TE</b> (<span style={{ fontFamily: "serif" }} className="text-lg">て</span>) kita kasih tanda kutip/ditebelin suaranya ( ゛ ), menurut lidahmu suaranya bakal berubah jadi apa?</>}
              placeholder="Ketik jawabanmu (2 huruf) di sini..."
              accept={["de"]}
              successMsg="BINGO! Bener banget. Posisi lidah nyebut TE, kalau ditebelin dan ngotot jadinya DE (で)."
              errorMsg="Hampir! Coba inget pola: KA→GA, SA→ZA, TA→DA… terus TE jadinya apa hayo?"
            />
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
