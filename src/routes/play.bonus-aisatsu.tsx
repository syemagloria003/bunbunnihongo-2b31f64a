import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { unlockAvatar, getAvatarSrc } from "@/game/avatars";

export const Route = createFileRoute("/play/bonus-aisatsu")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Bonus Game: Aisatsu & Telinga Native — BeeGana" },
      {
        name: "description",
        content:
          "Bonus game uji insting aisatsu dan cara baca ala native speaker Jepang. Selesaikan untuk membuka avatar langka!",
      },
    ],
  }),
  component: BonusAisatsu,
});

interface Q {
  id: string;
  topic: string;
  prompt: ReactNode;
  options: { key: "A" | "B" | "C"; text: ReactNode }[];
  correct: "A" | "B" | "C";
  explain: ReactNode;
}

const QUESTIONS: Q[] = [
  // ====== AISATSU ======
  {
    id: "ai1",
    topic: "Aisatsu · Pagi",
    prompt: <>Jam 07.30 pagi, kamu berpapasan dengan tetangga Jepang. Salam apa yang paling pas?</>,
    options: [
      { key: "A", text: <>Konnichiwa</> },
      { key: "B", text: <>Ohayou Gozaimasu</> },
      { key: "C", text: <>Konbanwa</> },
    ],
    correct: "B",
    explain: <>Sampai jam ~10 pagi, gunakan <b>Ohayou Gozaimasu</b> (sopan). Versi kasual ke teman: <b>Ohayou!</b></>,
  },
  {
    id: "ai2",
    topic: "Aisatsu · Siang",
    prompt: <>Jam 1 siang di kantor, kamu masuk ruang meeting. Salam yang netral & paling aman?</>,
    options: [
      { key: "A", text: <>Konnichiwa</> },
      { key: "B", text: <>Oyasuminasai</> },
      { key: "C", text: <>Itadakimasu</> },
    ],
    correct: "A",
    explain: <><b>Konnichiwa</b> dipakai dari sekitar jam 10 pagi sampai matahari terbenam.</>,
  },
  {
    id: "ai3",
    topic: "Aisatsu · Malam",
    prompt: <>Jam 7 malam ketuk pintu rumah mertua. Pintu dibuka. Salam pertamamu adalah…</>,
    options: [
      { key: "A", text: <>Ohayou Gozaimasu</> },
      { key: "B", text: <>Konbanwa</> },
      { key: "C", text: <>Oyasuminasai</> },
    ],
    correct: "B",
    explain: <>Matahari sudah tenggelam → <b>Konbanwa</b>. <i>Oyasuminasai</i> khusus saat mau tidur.</>,
  },
  {
    id: "ai4",
    topic: "Aisatsu · Tidur",
    prompt: <>Sebelum masuk kamar dan tidur, kamu pamit ke keluarga host. Ucapan yang pas?</>,
    options: [
      { key: "A", text: <>Konbanwa</> },
      { key: "B", text: <>Oyasuminasai</> },
      { key: "C", text: <>Sumimasen</> },
    ],
    correct: "B",
    explain: <><b>Oyasuminasai</b> = selamat malam khusus saat akan tidur / berpisah malam hari.</>,
  },
  {
    id: "ai5",
    topic: "Aisatsu · Permisi",
    prompt: <>Kamu mau lewat di kereta yang penuh dan harus minta jalan. Kata yang paling tepat?</>,
    options: [
      { key: "A", text: <>Arigatou</> },
      { key: "B", text: <>Hai</> },
      { key: "C", text: <>Sumimasen</> },
    ],
    correct: "C",
    explain: <><b>Sumimasen</b> = permisi / maaf / terima kasih (multi-fungsi sopan).</>,
  },
  {
    id: "ai6",
    topic: "Aisatsu · Terima kasih",
    prompt: <>Pelayan menaruh ocha di mejamu dengan senyum. Respon paling sopan?</>,
    options: [
      { key: "A", text: <>Iie</> },
      { key: "B", text: <>Arigatou Gozaimasu</> },
      { key: "C", text: <>Oyasuminasai</> },
    ],
    correct: "B",
    explain: <><b>Arigatou Gozaimasu</b> = terima kasih versi sopan. Ke teman cukup <b>Arigatou!</b></>,
  },
  {
    id: "ai7",
    topic: "Aisatsu · Makan",
    prompt: <>Hidangan sudah di depanmu di rumah teman Jepang. Tangan rapat di dada, kamu bilang…</>,
    options: [
      { key: "A", text: <>Gochisousama deshita</> },
      { key: "B", text: <>Itadakimasu</> },
      { key: "C", text: <>Sumimasen</> },
    ],
    correct: "B",
    explain: <><b>Itadakimasu</b> diucapkan SEBELUM makan. <i>Gochisousama deshita</i> SESUDAH makan.</>,
  },
  // ====== TELINGA NATIVE ======
  {
    id: "nv1",
    topic: "Vokal Pemalas · OU",
    prompt: <>"Hari Ini" = Kyou (きょう). Bunyi yang keluar dari mulut native?</>,
    options: [
      { key: "A", text: <>Kyo-u (dua suku terpisah)</> },
      { key: "B", text: <>Kyoo (O panjang melebur)</> },
    ] as Q["options"],
    correct: "B",
    explain: <>'U' setelah 'O' melebur jadi <b>O panjang</b>.</>,
  },
  {
    id: "nv2",
    topic: "Vokal Pemalas · EI",
    prompt: <>"Guru" = Sensei (せんせい). Murid native akan bilang…</>,
    options: [
      { key: "A", text: <>Sen-se-i</> },
      { key: "B", text: <>Sen-see (E panjang)</> },
    ] as Q["options"],
    correct: "B",
    explain: <>E ketemu I → dibaca sebagai <b>E panjang</b>.</>,
  },
  {
    id: "nv3",
    topic: "Lidah Nanggung · R",
    prompt: <>"Ramen" (ラーメン). Cara pelayan kedai mengucapkannya?</>,
    options: [
      { key: "A", text: <>Rrramen (R bergetar)</> },
      { key: "B", text: <>Lamen / Ramen (R setengah L, sekali tap)</> },
    ] as Q["options"],
    correct: "B",
    explain: <>R Jepang = <b>flap</b> lidah, mirip L. Jangan digetarin ala dangdut!</>,
  },
  {
    id: "nv4",
    topic: "Vokal Gaib · U di akhir",
    prompt: <>"Saya mengerti" = Wakarimasu. Versi luwes native:</>,
    options: [
      { key: "A", text: <>Wakarimasu</> },
      { key: "B", text: <>Wakarimas (U hilang)</> },
    ] as Q["options"],
    correct: "B",
    explain: <>Huruf 'U' di akhir <i>-masu</i> sering <b>ditelan</b>.</>,
  },
  {
    id: "nv5",
    topic: "Vokal Gaib · I di tengah",
    prompt: <>"Besok" = Ashita (あした). Huruf mana yang suaranya kabur?</>,
    options: [
      { key: "A", text: <>Ash-ta (I lenyap)</> },
      { key: "B", text: <>A-shi-ta (jelas semua)</> },
    ] as Q["options"],
    correct: "A",
    explain: <>'I' di tengah sering <b>diculik ninja</b> alias hilang.</>,
  },
  {
    id: "nv6",
    topic: "Vokal Gaib · U di tengah",
    prompt: <>"Sedikit" = Sukoshi (すこし). Native baca jadi…</>,
    options: [
      { key: "A", text: <>Su-ko-shi</> },
      { key: "B", text: <>Skoshi</> },
    ] as Q["options"],
    correct: "B",
    explain: <>Sama seperti <i>Suki → Ski</i>. Huruf U di tengah kabur.</>,
  },
  {
    id: "nv7",
    topic: "Si Sengau · G di tengah",
    prompt: <>"Kore ga…" (これが…). Aksen native terdengar mirip…</>,
    options: [
      { key: "A", text: <>Kore ga</> },
      { key: "B", text: <>Kore nga</> },
    ] as Q["options"],
    correct: "B",
    explain: <>'Ga' di tengah kalimat sering <b>dinasalisasi</b> jadi 'nga'.</>,
  },
  {
    id: "nv8",
    topic: "Si Sengau · N",
    prompt: <>"Senpai" (せんぱい). Suara N di sini jadi…</>,
    options: [
      { key: "A", text: <>Sem-pai / Seng-pai</> },
      { key: "B", text: <>Se-nu-pa-i</> },
    ] as Q["options"],
    correct: "A",
    explain: <>'N' menyesuaikan posisi mulut huruf berikutnya (jadi M / NG).</>,
  },
  {
    id: "nv9",
    topic: "Combo Native!",
    prompt: <>"Cantik" = Kirei desu (きれいです). Bunyi native:</>,
    options: [
      { key: "A", text: <>Ki-re-i de-su</> },
      { key: "B", text: <>Ki-ree des</> },
    ] as Q["options"],
    correct: "B",
    explain: <>EI → E panjang, <i>desu</i> kehilangan U. Insting native aktif!</>,
  },
  {
    id: "nv10",
    topic: "Pengecualian",
    prompt: <>Ada yang ucap "Arigatou Gozaimasu!" dengan U akhir SANGAT jelas. Konteksnya?</>,
    options: [
      { key: "A", text: <>Ngobrol santai dengan teman</> },
      { key: "B", text: <>Ingin terdengar sangat sopan / formal / imut</> },
    ] as Q["options"],
    correct: "B",
    explain: <>U yang jelas = sinyal <b>kesopanan ekstra</b> atau gaya bicara imut/feminin.</>,
  },
];

const TOTAL = QUESTIONS.length;
const PASS_THRESHOLD = Math.ceil(TOTAL * 0.8); // 80% untuk lulus

function BonusAisatsu() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | "C" | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [rewards, setRewards] = useState<string[]>([]);

  const q = QUESTIONS[idx];
  const score = answers.filter(Boolean).length;
  const pct = Math.round((score / TOTAL) * 100);

  function submit() {
    if (!picked) return;
    const ok = picked === q.correct;
    setAnswers((a) => [...a, ok]);
  }

  function next() {
    setPicked(null);
    if (idx + 1 >= TOTAL) {
      // Tentukan hadiah
      const finalScore = answers.filter(Boolean).length;
      const finalPct = Math.round((finalScore / TOTAL) * 100);
      const got: string[] = [];
      if (finalScore >= 1 || answers.length >= 1) {
        // Kitsune: lulus minimum (≥80%)
        if (finalScore >= PASS_THRESHOLD) {
          unlockAvatar("kitsune");
          got.push("kitsune");
        }
        if (finalScore >= PASS_THRESHOLD) {
          unlockAvatar("dragon");
          got.push("dragon");
        }
        if (finalPct === 100) {
          unlockAvatar("phoenix");
          got.push("phoenix");
        }
      }
      setRewards(got);
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  }

  function restart() {
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
    setRewards([]);
  }

  const lastResult = answers.length === idx + 1 ? answers[idx] : null;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-50 via-rose-50 to-violet-50 dark:from-amber-950/30 dark:via-rose-950/30 dark:to-violet-950/30 text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <header className="flex items-center justify-between gap-3">
          <Link
            to="/belajar/hiragana"
            className="text-sm font-bold px-3 py-1.5 rounded-full bg-background/70 hover:bg-background border-2 border-border"
          >
            ← Taman Hiragana
          </Link>
          <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-primary px-3 py-1 rounded-full border-2 border-dashed border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.55)]">
            🎁 Bonus Game
          </span>
        </header>

        {!done && (
          <>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
              👂 Tes Aisatsu &amp; Telinga Native
            </h1>
            <p className="text-sm text-muted-foreground -mt-3">
              {TOTAL} soal · lulus ≥ {PASS_THRESHOLD} benar untuk membuka avatar langka.
            </p>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Soal {idx + 1} / {TOTAL}</span>
                <span>Benar: {score}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-violet-500 transition-all"
                  style={{ width: `${((idx + (lastResult !== null ? 1 : 0)) / TOTAL) * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/40 bg-card text-card-foreground p-4 sm:p-5 shadow-xl space-y-4">
              <p className="text-[11px] font-extrabold tracking-widest uppercase text-primary">
                {q.topic}
              </p>
              <div className="text-base sm:text-lg font-semibold leading-snug">
                {q.prompt}
              </div>

              <div className="grid gap-2">
                {q.options.map((o) => {
                  const isPicked = picked === o.key;
                  const answered = lastResult !== null;
                  const isCorrect = o.key === q.correct;
                  let cls = "border-border bg-background hover:bg-primary/10";
                  if (answered) {
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/40";
                    else if (isPicked) cls = "border-rose-500 bg-rose-100/70 dark:bg-rose-950/40";
                    else cls = "border-border bg-background opacity-60";
                  } else if (isPicked) {
                    cls = "border-primary bg-primary/15 ring-2 ring-primary/40";
                  }
                  return (
                    <button
                      key={o.key}
                      disabled={answered}
                      onClick={() => setPicked(o.key)}
                      className={`text-left px-3 py-3 rounded-xl border-2 font-semibold text-sm transition flex gap-3 items-start ${cls}`}
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/15 text-primary font-extrabold shrink-0">
                        {o.key}
                      </span>
                      <span className="pt-0.5">{o.text}</span>
                    </button>
                  );
                })}
              </div>

              {lastResult !== null && (
                <div
                  className={`rounded-xl p-3 text-sm font-semibold border-2 ${
                    lastResult
                      ? "border-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
                      : "border-rose-400 bg-rose-100/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200"
                  }`}
                >
                  {lastResult ? "✅ Mantap!" : `❌ Jawaban benar: ${q.correct}.`} {q.explain}
                </div>
              )}

              {lastResult === null ? (
                <button
                  onClick={submit}
                  disabled={!picked}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-extrabold disabled:opacity-50 hover:brightness-110 shadow-lg"
                >
                  Cek Jawaban
                </button>
              ) : (
                <button
                  onClick={next}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white font-extrabold hover:brightness-110 shadow-lg"
                >
                  {idx + 1 >= TOTAL ? "🏁 Lihat Hasil" : "Lanjut →"}
                </button>
              )}
            </div>
          </>
        )}

        {done && (
          <ResultPanel
            score={score}
            total={TOTAL}
            pct={pct}
            rewards={rewards}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}

function ResultPanel({
  score,
  total,
  pct,
  rewards,
  onRestart,
}: {
  score: number;
  total: number;
  pct: number;
  rewards: string[];
  onRestart: () => void;
}) {
  const passed = useMemo(() => score >= Math.ceil(total * 0.8), [score, total]);
  return (
    <div className="rounded-3xl border-2 border-primary/50 bg-card text-card-foreground p-6 shadow-2xl space-y-5 text-center">
      <div className="text-6xl">{pct === 100 ? "🏆" : passed ? "🎉" : "💪"}</div>
      <h2 className="font-display text-2xl font-extrabold">
        {pct === 100 ? "SEMPURNA! Telingamu Native!" : passed ? "Lulus! Selamat!" : "Belum Lulus — Coba Lagi!"}
      </h2>
      <p className="text-lg font-bold">
        Skor: <span className="text-primary">{score}</span> / {total} ({pct}%)
      </p>

      {rewards.length > 0 ? (
        <div className="space-y-3">
          <p className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
            🎁 Avatar langka berhasil DIBUKA:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {rewards.map((id) => (
              <div
                key={id}
                className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-amber-100 to-rose-100 dark:from-amber-950/40 dark:to-rose-950/40 border-2 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.55)]"
              >
                <img
                  src={getAvatarSrc(id)}
                  alt={id}
                  className="w-20 h-20 object-contain"
                  loading="lazy"
                  width={80}
                  height={80}
                />
                <span className="text-xs font-extrabold mt-1 capitalize">{id} ✨</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Buka <b>profilmu</b> (klik avatar di kanan atas halaman utama) untuk memakainya.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Skor minimal <b>{Math.ceil(total * 0.8)}</b> benar untuk membuka <b>Naga Sakura</b> &amp; <b>Kitsune Roh</b>.
          Skor <b>100%</b> untuk membuka <b>Phoenix Aurora</b>.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          onClick={onRestart}
          className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-extrabold hover:brightness-110 shadow"
        >
          🔄 Main Lagi
        </button>
        <Link
          to="/belajar/hiragana"
          className="flex-1 h-12 rounded-xl border-2 border-border bg-background font-extrabold hover:bg-muted shadow flex items-center justify-center"
        >
          📚 Kembali ke Taman
        </Link>
      </div>
    </div>
  );
}
