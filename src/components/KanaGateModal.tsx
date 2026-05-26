import { useEffect, useState } from "react";
import { type KanaWord } from "@/game/words";

interface Props {
  word: KanaWord;
  options: string[];
  onAnswer: (correct: boolean) => void;
  mode?: "kana" | "kanji";
}

export function KanaGateModal({ word, options, onAnswer, mode = "kana" }: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    setPicked(null);
  }, [word]);

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    const correct = opt === word.romaji;
    setTimeout(() => onAnswer(correct), 700);
  }

  const isKanji = mode === "kanji";
  const heading = isKanji ? "Kanji Gate" : "Kana Gate";
  const instruction = isKanji
    ? "Pilih arti yang benar"
    : "Pilih bacaan romaji yang benar";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="honey-card rounded-3xl p-6 w-full max-w-md">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
            {heading}
          </p>
          <div className="my-4 flex justify-center">
            <div className="bg-background rounded-2xl border-4 border-primary px-8 py-5 shadow-inner">
              <span
                className="text-6xl font-bold tracking-wider"
                style={{ fontFamily: "serif" }}
              >
                {word.chars}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {instruction}
          </p>
        </div>
        <div className={isKanji ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-3"}>
          {options.map((opt) => {
            const isPicked = picked === opt;
            const correct = picked && opt === word.romaji;
            const wrong = isPicked && opt !== word.romaji;
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                disabled={!!picked}
                className={[
                  "rounded-2xl py-3 px-3 font-bold transition-all border-2",
                  isKanji ? "text-base text-left" : "text-xl py-4",
                  "active:translate-y-0.5",
                  correct
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : wrong
                    ? "bg-destructive text-destructive-foreground border-destructive"
                    : picked && opt === word.romaji
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
