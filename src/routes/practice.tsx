import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ALL_KANA, HIRAGANA, KATAKANA, makeQuestion, type Kana, type KanaType } from "@/game/kana-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Latihan Kana — BeeGana" },
      { name: "description", content: "Mode latihan Hiragana & Katakana tanpa platforming." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login", search: { redirect: location.href } as never });
  },
  component: Practice,
});

function Practice() {
  const [mode, setMode] = useState<KanaType | "both">("hiragana");
  const pool = useMemo<Kana[]>(() => {
    if (mode === "hiragana") return HIRAGANA;
    if (mode === "katakana") return KATAKANA;
    return ALL_KANA;
  }, [mode]);

  const [q, setQ] = useState(() => makeQuestion(pool));
  const [picked, setPicked] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);

  useEffect(() => { setQ(makeQuestion(pool)); setPicked(null); }, [pool]);

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    if (opt === q.kana.romaji) setRight((r) => r + 1);
    else setWrong((w) => w + 1);
    setTimeout(() => {
      setPicked(null);
      setQ(makeQuestion(pool));
    }, 800);
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm font-semibold hover:text-primary">← Beranda</Link>
          <h1 className="font-display text-3xl font-bold">Latihan Kana</h1>
          <div className="w-16" />
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {(["hiragana", "katakana", "both"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setRight(0); setWrong(0); }}
              className={[
                "px-3 py-1.5 rounded-full text-sm font-semibold border-2",
                mode === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary",
              ].join(" ")}
            >
              {m === "both" ? "Campur" : m}
            </button>
          ))}
        </div>

        <div className="honey-card rounded-3xl p-6">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-3">
            <span>✅ Benar: {right}</span>
            <span>❌ Salah: {wrong}</span>
          </div>
          <div className="flex justify-center my-4">
            <div className="bg-background rounded-2xl border-4 border-primary px-10 py-6">
              <span className="text-7xl font-bold" style={{ fontFamily: "serif" }}>{q.kana.char}</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mb-3">Pilih romaji yang benar</p>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt) => {
              const isPicked = picked === opt;
              const correct = picked && opt === q.kana.romaji;
              const wrongP = isPicked && opt !== q.kana.romaji;
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  disabled={!!picked}
                  className={[
                    "rounded-2xl py-4 text-2xl font-bold border-2 transition-all active:translate-y-0.5",
                    correct
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : wrongP
                      ? "bg-destructive text-destructive-foreground border-destructive"
                      : picked && opt === q.kana.romaji
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-background border-border hover:border-primary hover:bg-primary/10",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
