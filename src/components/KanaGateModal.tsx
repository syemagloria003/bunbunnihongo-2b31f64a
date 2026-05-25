import { useEffect, useState } from "react";
import { type Kana } from "@/game/kana-data";

interface Props {
  kana: Kana;
  options: string[];
  onAnswer: (correct: boolean) => void;
}

export function KanaGateModal({ kana, options, onAnswer }: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    setPicked(null);
  }, [kana]);

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    const correct = opt === kana.romaji;
    setTimeout(() => onAnswer(correct), 700);
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="honey-card rounded-3xl p-6 w-full max-w-md">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
            Kana Gate · {kana.type}
          </p>
          <div className="my-4 flex justify-center">
            <div className="bg-background rounded-2xl border-4 border-primary px-10 py-6 shadow-inner">
              <span className="text-7xl font-bold" style={{ fontFamily: "serif" }}>
                {kana.char}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Pilih romaji yang benar</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isPicked = picked === opt;
            const correct = picked && opt === kana.romaji;
            const wrong = isPicked && opt !== kana.romaji;
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                disabled={!!picked}
                className={[
                  "rounded-2xl py-4 text-2xl font-bold transition-all border-2",
                  "active:translate-y-0.5",
                  correct
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : wrong
                    ? "bg-destructive text-destructive-foreground border-destructive"
                    : picked && opt === kana.romaji
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
  );
}
