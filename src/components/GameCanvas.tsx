import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GameEngine } from "@/game/engine";
import { type LevelDef, LEVELS, nextLevelId, isFinalLevel, isFinalKatakanaLevel } from "@/game/levels";
import { pickKanaPool, ALL_KANA } from "@/game/kana-data";
import { ALL_KANJI } from "@/game/kanji-data";
import { generateWords, makeOptionsForWord, type KanaWord } from "@/game/words";
import { KanaGateModal } from "./KanaGateModal";
import { completeLevel, computeStars } from "@/game/progress";
import { submitScore } from "@/game/leaderboard";
import { unlockAudio, setMuted, isMuted } from "@/game/audio";

const W = 800;
const H = 480;

function useOrientation() {
  const [state, setState] = useState({ isMobile: false, isPortrait: false });
  useEffect(() => {
    const check = () => {
      const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const small = window.matchMedia("(max-width: 950px)").matches;
      const isMobile = touch && small;
      const isPortrait = window.innerHeight >= window.innerWidth;
      setState({ isMobile, isPortrait });
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return state;
}

export function GameCanvas({ level }: { level: LevelDef }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [mounted, setMounted] = useState(0);
  const [muted, setMutedState] = useState<boolean>(() => (typeof window !== "undefined" ? isMuted() : false));
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { isMobile, isPortrait } = useOrientation();
  const needsRotate = isMobile && isPortrait;

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

  // Track fullscreen state
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Auto-request fullscreen when on mobile landscape (on next user gesture).
  useEffect(() => {
    if (!isMobile || isPortrait) return;
    if (document.fullscreenElement) return;
    const tryFs = () => {
      const el = containerRef.current;
      if (!el || document.fullscreenElement) return;
      const req = el.requestFullscreen?.bind(el) ?? (el as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen?.bind(el);
      try {
        const p = req?.();
        if (p && typeof (p as Promise<void>).catch === "function") (p as Promise<void>).catch(() => {});
      } catch { /* ignore */ }
      window.removeEventListener("pointerdown", tryFs);
      window.removeEventListener("touchstart", tryFs);
    };
    window.addEventListener("pointerdown", tryFs, { once: true });
    window.addEventListener("touchstart", tryFs, { once: true });
    return () => {
      window.removeEventListener("pointerdown", tryFs);
      window.removeEventListener("touchstart", tryFs);
    };
  }, [isMobile, isPortrait, mounted]);

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
      void submitScore(score, level.id, level.name);
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
        ref={containerRef}
        className={
          "relative rounded-2xl overflow-hidden border-4 border-primary shadow-xl bg-black " +
          (isFullscreen ? "w-screen h-screen flex items-center justify-center !rounded-none !border-0" : "")
        }
        style={
          isFullscreen
            ? { background: level.bg }
            : { width: W, maxWidth: "100%", aspectRatio: `${W}/${H}`, background: level.bg }
        }
      >
        <div
          className={isFullscreen ? "relative h-full" : "relative w-full h-full"}
          style={isFullscreen ? { aspectRatio: `${W}/${H}`, maxWidth: "100%", maxHeight: "100%" } : undefined}
        >
          <canvas ref={canvasRef} width={W} height={H} className="block w-full h-full" />
          {/* Mobile on-screen joystick + jump button */}
          {isMobile && !needsRotate && !quiz && !result && (
            <MobileControls onPress={touch} />
          )}
          {quiz && <KanaGateModal word={quiz.word} options={quiz.options} onAnswer={answer} mode={level.mode} />}
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
                {result === "won" && isFinalKatakanaLevel(level.id) && stars >= 3 && (
                  <p className="text-sm font-semibold text-primary mb-3">
                    ☄️ Meteor Katakana didapat! Dunia Galaksi Meteor (Kanji) terbuka.
                  </p>
                )}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); navigate({ to: "/play" }); }}
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

          {/* Mobile help + fullscreen toggle buttons */}
          {isMobile && !needsRotate && (
            <div className="absolute top-2 right-2 z-30 flex gap-2">
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                aria-label="Cara main"
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur border-2 border-border text-sm font-bold active:translate-y-0.5"
              >
                ?
              </button>
              <button
                type="button"
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen?.().catch(() => {});
                  } else {
                    containerRef.current?.requestFullscreen?.().catch(() => {});
                  }
                }}
                aria-label="Layar penuh"
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur border-2 border-border text-sm font-bold active:translate-y-0.5"
              >
                {isFullscreen ? "✕" : "⛶"}
              </button>
            </div>
          )}

          {/* Portrait warning overlay — blocks gameplay */}
          {needsRotate && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-foreground/85 backdrop-blur-sm text-background p-6 text-center">
              <div className="text-6xl mb-4 animate-bounce">📱↻</div>
              <h3 className="font-display font-bold text-2xl mb-2">Miringkan HP-mu!</h3>
              <p className="text-sm opacity-90 max-w-xs">
                Petualangan BeeGana butuh layar lebar. Putar HP ke <strong>landscape</strong> untuk mulai main.
              </p>
            </div>
          )}
        </div>
      </div>

      {!isMobile && (
        <p className="text-xs text-muted-foreground">← → bergerak · Space / ↑ lompat (tekan 2x untuk flap)</p>
      )}
      {isMobile && !needsRotate && !isFullscreen && (
        <p className="text-xs text-muted-foreground px-3 text-center">
          Geser jari ← → untuk berjalan · Ketuk untuk lompat (ketuk 2x untuk flap)
        </p>
      )}

      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm p-3"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="honey-card rounded-2xl p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-xl mb-3 text-center">🎮 Cara Main</h3>
            <ul className="text-sm space-y-2 mb-4">
              <li>
                <span className="font-bold">Geser ← →</span> — Tahan & tarik jari ke kiri/kanan di mana saja di layar untuk berjalan.
              </li>
              <li>
                <span className="font-bold">Ketuk</span> — Sentuh layar singkat untuk melompat. Ketuk <em>dua kali</em> saat di udara untuk <em>double flap</em>.
              </li>
              <li>Lompati / injak musuh dari atas 🕷️. Jangan kena dari samping!</li>
              <li>Kumpulkan tetes madu 🍯 untuk skor.</li>
              <li>Pintu <strong>?</strong> = jawab kana/kanji yang benar untuk lewat. Salah = ❤️ berkurang.</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold"
            >
              Mengerti!
            </button>
          </div>
        </div>
      )}
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

type PointerState = { x0: number; t0: number; key: "ArrowLeft" | "ArrowRight" | null; moved: boolean };

function GestureLayer({ onPress }: { onPress: (key: string, down: boolean) => void }) {
  const ptrs = useRef(new Map<number, PointerState>());
  const holds = useRef({ ArrowLeft: 0, ArrowRight: 0 });

  const setDir = (k: "ArrowLeft" | "ArrowRight", down: boolean) => {
    const prev = holds.current[k];
    const nextVal = down ? prev + 1 : Math.max(0, prev - 1);
    holds.current[k] = nextVal;
    if (prev === 0 && nextVal > 0) onPress(k, true);
    if (prev > 0 && nextVal === 0) onPress(k, false);
  };

  const THRESHOLD = 18;

  return (
    <div
      className="absolute inset-0 z-30 touch-none select-none"
      onPointerDown={(e) => {
        e.preventDefault();
        ptrs.current.set(e.pointerId, { x0: e.clientX, t0: Date.now(), key: null, moved: false });
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        const p = ptrs.current.get(e.pointerId);
        if (!p) return;
        const dx = e.clientX - p.x0;
        if (Math.abs(dx) > 8) p.moved = true;
        let k: "ArrowLeft" | "ArrowRight" | null = null;
        if (dx > THRESHOLD) k = "ArrowRight";
        else if (dx < -THRESHOLD) k = "ArrowLeft";
        if (k !== p.key) {
          if (p.key) setDir(p.key, false);
          if (k) setDir(k, true);
          p.key = k;
        }
      }}
      onPointerUp={(e) => {
        const p = ptrs.current.get(e.pointerId);
        if (!p) return;
        if (p.key) setDir(p.key, false);
        const dur = Date.now() - p.t0;
        if (!p.moved && dur < 280) onPress("jump", true);
        ptrs.current.delete(e.pointerId);
      }}
      onPointerCancel={(e) => {
        const p = ptrs.current.get(e.pointerId);
        if (p?.key) setDir(p.key, false);
        ptrs.current.delete(e.pointerId);
      }}
    />
  );
}

// keep imports referenced
void LEVELS;
