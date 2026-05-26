import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GameEngine } from "@/game/engine";
import { type LevelDef, LEVELS, nextLevelId, isFinalLevel, isFinalKatakanaLevel } from "@/game/levels";
import { pickKanaPool, ALL_KANA } from "@/game/kana-data";
import { ALL_KANJI } from "@/game/kanji-data";
import { generateWords, makeOptionsForWord, type KanaWord } from "@/game/words";
import { KanaGateModal } from "./KanaGateModal";
import { completeLevel, computeStars } from "@/game/progress";
import { unlockAudio, setMuted, isMuted } from "@/game/audio";

const W = 800;
const H = 480;

export function GameCanvas({ level }: { level: LevelDef }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const wordsRef = useRef<KanaWord[]>([]);
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [quiz, setQuiz] = useState<{ word: KanaWord; options: string[] } | null>(null);
  const [result, setResult] = useState<"won" | "lost" | null>(null);
  const [stars, setStars] = useState(0);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [mounted, setMounted] = useState(0); // bump to remount engine
  const [muted, setMutedState] = useState<boolean>(() => (typeof window !== "undefined" ? isMuted() : false));

  const isKanji = level.mode === "kanji";
  const distractorPool = isKanji ? ALL_KANJI : ALL_KANA;

  const pool = useMemo(
    () => level.customPool ?? pickKanaPool(level.kanaTypes ?? [], level.kanaGroups ?? []),
    [level],
  );

  useEffect(() => {
    const engine = new GameEngine(level, {
      onScore: setScore,
      onLives: setLives,
      onCoins: setCoins,
      onQuiz: (idx) => {
        const word = wordsRef.current[idx] ?? wordsRef.current[0];
        setQuiz({ word, options: makeOptionsForWord(word, distractorPool) });
      },
      onWin: () => setResult("won"),
      onLose: () => setResult("lost"),
    });
    engineRef.current = engine;
    wordsRef.current = generateWords(pool, engine.gates.length, level.wordLen);

    const kd = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        if (!e.repeat) engine.tryJump();
      }
      engine.setKey(e.key, true);
    };
    const ku = (e: KeyboardEvent) => engine.setKey(e.key, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const ctx = canvasRef.current!.getContext("2d")!;
    let raf = 0;
    const loop = () => {
      engine.update();
      engine.draw(ctx, W, H);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [level, pool, mounted, distractorPool]);

  // On win/lose finalize stars and persist progress
  useEffect(() => {
    if (!result) return;
    const total = right + wrong;
    const s = result === "won" ? computeStars(right, Math.max(total, wordsRef.current.length)) : Math.max(1, computeStars(right, Math.max(1, total)));
    setStars(s);
    if (result === "won") {
      const next = nextLevelId(level.id);
      completeLevel(
        level.id, score, coins, s, next,
        isFinalLevel(level.id),
        isFinalKatakanaLevel(level.id),
      );
    }
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  function answer(correct: boolean) {
    setQuiz(null);
    if (correct) setRight((r) => r + 1);
    else setWrong((w) => w + 1);
    engineRef.current?.resumeFromQuiz(correct);
  }

  function touch(key: string, down: boolean) {
    unlockAudio();
    if (key === "jump") { if (down) engineRef.current?.tryJump(); return; }
    engineRef.current?.setKey(key, down);
  }

  function retry() {
    setResult(null);
    setScore(0); setLives(3); setCoins(0);
    setRight(0); setWrong(0); setStars(0);
    setMounted((n) => n + 1);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  const next = nextLevelId(level.id);
  const nextUnlocked = result === "won" && stars >= 3 && !!next;
  const totalGates = wordsRef.current.length || (right + wrong);

  return (
    <div className="flex flex-col items-center gap-3" onPointerDown={unlockAudio}>
      <HUD
        score={score} lives={lives} coins={coins} levelName={level.name}
        right={right} wrong={wrong}
        muted={muted} onToggleMute={toggleMute}
      />
      <div
        className="relative rounded-2xl overflow-hidden border-4 border-primary shadow-xl"
        style={{ width: W, maxWidth: "100%", aspectRatio: `${W}/${H}`, background: level.bg }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="block w-full h-full" />
        {quiz && <KanaGateModal word={quiz.word} options={quiz.options} onAnswer={answer} />}
        {result && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
            <div className="honey-card rounded-3xl p-6 text-center max-w-sm w-full">
              <h2 className="text-3xl mb-1 font-display font-bold">
                {result === "won" ? "🍯 Sampai sarang!" : "😵 Coba lagi!"}
              </h2>
              <StarRow value={stars} />
              <p className="text-sm text-muted-foreground mb-1 mt-2">
                Benar <span className="font-bold text-foreground">{right}</span> · Salah <span className="font-bold text-foreground">{wrong}</span> · Total {totalGates}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Skor {score} · Madu {coins}
              </p>
              {result === "won" && stars < 3 && (
                <p className="text-sm font-semibold text-destructive mb-3">
                  Butuh minimal ⭐⭐⭐ untuk membuka level berikutnya.
                </p>
              )}
              {result === "won" && isFinalLevel(level.id) && stars >= 3 && (
                <p className="text-sm font-semibold text-primary mb-3">
                  💎 Kristal Hiragana didapat! Topik Katakana terbuka.
                </p>
              )}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => navigate({ to: "/play" })}
                  className="px-4 py-2 rounded-xl border-2 border-border bg-background hover:bg-muted font-semibold"
                >
                  Pilih level
                </button>
                <button
                  onClick={retry}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-105"
                >
                  Main ulang
                </button>
                {nextUnlocked && (
                  <button
                    onClick={() => { setResult(null); navigate({ to: "/play/$levelId", params: { levelId: next! } }); retry(); }}
                    className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold hover:brightness-105"
                  >
                    Level berikutnya →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <TouchPad onPress={touch} />
      <p className="text-xs text-muted-foreground">← → bergerak · Space / ↑ lompat (tekan 2x untuk flap)</p>
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex justify-center gap-1 text-2xl my-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? "" : "opacity-25 grayscale"}>⭐</span>
      ))}
    </div>
  );
}

function HUD({
  score, lives, coins, levelName, right, wrong, muted, onToggleMute,
}: {
  score: number; lives: number; coins: number; levelName: string;
  right: number; wrong: number; muted: boolean; onToggleMute: () => void;
}) {
  return (
    <div className="flex items-center gap-4 w-full max-w-[800px] honey-card rounded-2xl px-4 py-2 flex-wrap">
      <div className="font-display font-bold text-lg">{levelName}</div>
      <div className="ml-auto flex items-center gap-3 text-sm font-semibold flex-wrap">
        <span>{"❤️".repeat(Math.max(0, lives))}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
        <span>🍯 {coins}</span>
        <span>⭐ {score}</span>
        <span className="text-secondary">✓ {right}</span>
        <span className="text-destructive">✗ {wrong}</span>
        <button
          onClick={onToggleMute}
          aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          className="px-2 py-1 rounded-lg border-2 border-border hover:border-primary"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}

function TouchPad({ onPress }: { onPress: (key: string, down: boolean) => void }) {
  const btn = "select-none touch-none rounded-2xl honey-card font-bold text-xl px-5 py-3 active:translate-y-0.5";
  const handlers = (k: string) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); onPress(k, true); },
    onPointerUp: (e: React.PointerEvent) => { e.preventDefault(); onPress(k, false); },
    onPointerLeave: () => onPress(k, false),
    onPointerCancel: () => onPress(k, false),
  });
  return (
    <div className="flex w-full max-w-[800px] items-center justify-between md:hidden">
      <div className="flex gap-2">
        <button className={btn} {...handlers("ArrowLeft")}>◀</button>
        <button className={btn} {...handlers("ArrowRight")}>▶</button>
      </div>
      <button className={btn} {...handlers("jump")}>⤴ Lompat</button>
    </div>
  );
}

// keep imports referenced
void LEVELS;
