import { useEffect, useState } from "react";
import { type KanaWord } from "@/game/words";
import { KanjiStrokeOrder } from "./KanjiStrokeOrder";

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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-2 overflow-y-auto">
      <div className={`honey-card rounded-2xl p-3 sm:p-4 w-full ${isKanji ? "max-w-lg" : "max-w-md"} max-h-full overflow-y-auto`}>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {heading}
          </p>
          <div className="my-2 flex justify-center items-center gap-3 flex-wrap">
            <div className="bg-background rounded-xl border-4 border-primary px-4 py-2 shadow-inner">
              <span
                className="text-4xl sm:text-5xl font-bold tracking-wider leading-none"
                style={{ fontFamily: "serif" }}
              >
                {word.chars}
              </span>
            </div>
            {isKanji && word.chars.length === 1 && (
              <KanjiStrokeOrder char={word.chars} size={96} />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {instruction}
          </p>
        </div>
        <div className={isKanji ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2"}>
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
                  "rounded-xl py-2.5 px-2 font-bold transition-all border-2",
                  isKanji ? "text-sm text-center leading-tight" : "text-lg",
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
