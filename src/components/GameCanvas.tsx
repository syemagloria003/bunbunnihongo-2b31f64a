import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GameEngine } from "@/game/engine";
import { type LevelDef } from "@/game/levels";
import { LEVELS } from "@/game/levels";
import { makeQuestion, pickKanaPool, type Kana } from "@/game/kana-data";
import { KanaGateModal } from "./KanaGateModal";
import { completeLevel } from "@/game/progress";

const W = 800;
const H = 480;

export function GameCanvas({ level }: { level: LevelDef }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [quiz, setQuiz] = useState<{ kana: Kana; options: string[] } | null>(null);
  const [result, setResult] = useState<"won" | "lost" | null>(null);

  useEffect(() => {
    const pool = pickKanaPool(level.kanaTypes, level.kanaGroups);
    const engine = new GameEngine(level, {
      onScore: setScore,
      onLives: setLives,
      onCoins: setCoins,
      onQuiz: () => setQuiz(makeQuestion(pool)),
      onWin: () => {
        setResult("won");
        const idx = LEVELS.findIndex((l) => l.id === level.id);
        const next = LEVELS[idx + 1]?.id;
        completeLevel(level.id, engine.score, engine.coinsTaken, next);
      },
      onLose: () => setResult("lost"),
    });
    engineRef.current = engine;

    const kd = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        if (!e.repeat) engine.tryJump();
      }
      engine.setKey(e.key, true);
      if (e.key === "a" || e.key === "d") engine.setKey(e.key, true);
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
  }, [level]);

  function answer(correct: boolean) {
    setQuiz(null);
    engineRef.current?.resumeFromQuiz(correct);
  }

  // Touch controls
  function touch(key: string, down: boolean) {
    if (key === "jump") { if (down) engineRef.current?.tryJump(); return; }
    engineRef.current?.setKey(key, down);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <HUD score={score} lives={lives} coins={coins} levelName={level.name} />
      <div
        className="relative rounded-2xl overflow-hidden border-4 border-primary shadow-xl"
        style={{ width: W, maxWidth: "100%", aspectRatio: `${W}/${H}`, background: level.bg }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="block w-full h-full" />
        {quiz && <KanaGateModal kana={quiz.kana} options={quiz.options} onAnswer={answer} />}
        {result && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
            <div className="honey-card rounded-3xl p-8 text-center max-w-sm">
              <h2 className="text-4xl mb-2">
                {result === "won" ? "🍯 Sampai sarang!" : "😵 Coba lagi!"}
              </h2>
              <p className="text-muted-foreground mb-4">
                Skor: <span className="font-bold text-foreground">{score}</span> · Madu: {coins}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => { setResult(null); navigate({ to: "/play" }); }}
                  className="px-4 py-2 rounded-xl border-2 border-border bg-background hover:bg-muted font-semibold"
                >
                  Pilih level
                </button>
                <button
                  onClick={() => { setResult(null); setScore(0); setLives(3); setCoins(0); engineRef.current = null; /* remount via key would be cleaner */ window.location.reload(); }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-105"
                >
                  Main ulang
                </button>
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

function HUD({ score, lives, coins, levelName }: { score: number; lives: number; coins: number; levelName: string }) {
  return (
    <div className="flex items-center gap-4 w-full max-w-[800px] honey-card rounded-2xl px-4 py-2">
      <div className="font-display font-bold text-lg">{levelName}</div>
      <div className="ml-auto flex items-center gap-4 text-sm font-semibold">
        <span>{"❤️".repeat(Math.max(0, lives))}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
        <span>🍯 {coins}</span>
        <span>⭐ {score}</span>
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
