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
  // On win/lose finalize stars and persist progress
  useEffect(() => {
    if (!result) return;
    const total = Math.max(right + wrong, wordsRef.current.length);
    const s = computeStars(right, total);
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
          (isFullscreen ? `w-screen h-screen flex ${isMobile ? "items-start" : "items-center"} justify-center !rounded-none !border-0` : "")
        }
        style={
          isFullscreen
            ? { background: level.bg }
            : { width: W, maxWidth: "100%", aspectRatio: `${W}/${H}`, background: level.bg }
        }
      >
        <div
          className={isFullscreen ? "relative" : "relative w-full h-full"}
          style={
            isFullscreen
              ? {
                  aspectRatio: `${W}/${H}`,
                  maxWidth: "100%",
                  // On mobile, leave bottom half of the screen empty for the joystick + jump button
                  maxHeight: isMobile ? "58vh" : "100%",
                  height: isMobile ? "58vh" : "100%",
                }
              : undefined
          }
        >
          <canvas ref={canvasRef} width={W} height={H} className="block w-full h-full" />
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
                className="w-9 h-9 rounded-full bg-background/85 border-2 border-border text-sm font-bold active:translate-y-0.5"
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
                className="w-9 h-9 rounded-full bg-background/85 border-2 border-border text-sm font-bold active:translate-y-0.5"
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

          {/* Help modal — inside container so it shows in fullscreen too */}
          {showHelp && (
            <div
              className="absolute inset-0 z-[60] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-3"
              onClick={() => setShowHelp(false)}
            >
              <div
                className="honey-card rounded-2xl p-3 max-w-[280px] w-full text-[11px]"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-display font-bold text-sm mb-2 text-center">🎮 Cara Main</h3>
                <ul className="space-y-1 mb-2 leading-snug">
                  <li><span className="font-bold">Stik bulat (kanan bawah)</span> — tarik ke kiri/kanan untuk berjalan.</li>
                  <li><span className="font-bold">Tombol merah (kiri bawah)</span> — tekan untuk lompat. Tekan 2× di udara = <em>double flap</em>.</li>
                  <li>Lompati / injak 🕷️ dari atas. Jangan kena samping!</li>
                  <li>🍯 = skor. Pintu <strong>?</strong> = jawab benar untuk lewat.</li>
                </ul>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs"
                >
                  Mengerti!
                </button>
              </div>
            </div>
          )}
        </div>

        {/* On-screen D-pad controls — visible on mobile AND desktop. Keyboard still works on desktop. */}
        {!needsRotate && !quiz && !result && (
          <TouchControls onPress={touch} />
        )}

        {/* Mobile landscape, not yet fullscreen — guide user to tap the ⛶ button */}
        {isMobile && !isPortrait && !isFullscreen && (
          <button
            type="button"
            onClick={() => containerRef.current?.requestFullscreen?.().catch(() => {})}
            className="absolute inset-0 z-[55] flex flex-col items-center justify-center gap-3 bg-foreground/75 text-background backdrop-blur-sm"
          >
            <div className="text-6xl animate-pulse">⛶</div>
            <p className="font-display font-bold text-xl">Ketuk untuk Layar Penuh</p>
            <p className="text-xs opacity-90 max-w-xs text-center px-4">
              Petualangan lebih seru di mode layar penuh. Ketuk di mana saja.
            </p>
          </button>
        )}
      </div>

      {!isMobile && (
        <p className="text-xs text-muted-foreground">← → bergerak · Space / ↑ lompat (tekan 2x untuk flap) · atau gunakan tombol di layar</p>
      )}
      {isMobile && !needsRotate && !isFullscreen && (
        <p className="text-xs text-muted-foreground px-3 text-center">
          Tombol ← → untuk jalan · Tombol ↑ untuk lompat (tekan 2× = flap)
        </p>
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

function TouchControls({ onPress }: { onPress: (key: string, down: boolean) => void }) {
  // Track active pointer/touch per button so a finger sliding off still releases the key.
  // Key in map = pointerId (pointer events) or `t${identifier}` (touch events fallback).
  const heldRef = useRef<Map<string, string>>(new Map());

  const pressId = (id: string, key: string) => {
    const prev = heldRef.current.get(id);
    if (prev && prev !== key) onPress(prev, false);
    heldRef.current.set(id, key);
    onPress(key, true);
  };

  const releaseId = (id: string) => {
    const key = heldRef.current.get(id);
    if (!key) return;
    onPress(key, false);
    heldRef.current.delete(id);
  };

  const releaseAll = () => {
    heldRef.current.forEach((key) => onPress(key, false));
    heldRef.current.clear();
  };

  // Safety net: any pointerup/cancel/blur/visibilitychange/touchend anywhere releases stuck keys.
  useEffect(() => {
    const onPointerEnd = (e: PointerEvent) => releaseId(`p${e.pointerId}`);
    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        releaseId(`t${e.changedTouches[i].identifier}`);
      }
    };
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", releaseAll);
    return () => {
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", releaseAll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirBtn =
    "w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background/85 border-2 border-background/80 shadow-lg text-foreground text-2xl font-bold flex items-center justify-center touch-none select-none active:scale-95 active:bg-background";

  const dirHandlers = (key: string) => ({
    // Pointer events (desktop + modern mobile)
    onPointerDown: (e: React.PointerEvent) => {
      // Don't preventDefault — it can suppress subsequent pointerup on some mobile browsers.
      pressId(`p${e.pointerId}`, key);
    },
    onPointerUp: (e: React.PointerEvent) => releaseId(`p${e.pointerId}`),
    onPointerCancel: (e: React.PointerEvent) => releaseId(`p${e.pointerId}`),
    onPointerLeave: (e: React.PointerEvent) => releaseId(`p${e.pointerId}`),
    // Touch events fallback (iOS Safari sometimes drops pointer events)
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        pressId(`t${e.changedTouches[i].identifier}`, key);
      }
    },
    onTouchEnd: (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        releaseId(`t${e.changedTouches[i].identifier}`);
      }
    },
    onTouchCancel: (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        releaseId(`t${e.changedTouches[i].identifier}`);
      }
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  return (
    <>
      {/* Left/Right pad — bottom-left */}
      <div className="absolute z-30 bottom-4 left-4 flex gap-3 items-center">
        <button type="button" aria-label="Kiri" className={dirBtn} {...dirHandlers("ArrowLeft")}>
          ←
        </button>
        <button type="button" aria-label="Kanan" className={dirBtn} {...dirHandlers("ArrowRight")}>
          →
        </button>
      </div>

      {/* Jump — bottom-right */}
      <button
        type="button"
        aria-label="Lompat"
        className="absolute z-30 bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background/85 border-2 border-background/80 shadow-xl text-foreground text-3xl font-bold flex items-center justify-center touch-none select-none active:scale-95 active:bg-background"
        onPointerDown={() => onPress("jump", true)}
        onTouchStart={(e) => { e.preventDefault(); onPress("jump", true); }}
        onContextMenu={(e) => e.preventDefault()}
      >
        ↑
      </button>
    </>
  );
}


// keep imports referenced
void LEVELS;
