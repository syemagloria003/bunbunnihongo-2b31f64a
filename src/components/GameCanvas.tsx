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

function MobileControls({ onPress }: { onPress: (key: string, down: boolean) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const activePtr = useRef<number | null>(null);
  const currentDir = useRef<"ArrowLeft" | "ArrowRight" | null>(null);
  const RADIUS = 48;
  const DEAD = 14;

  const setDir = (k: "ArrowLeft" | "ArrowRight" | null) => {
    if (currentDir.current === k) return;
    if (currentDir.current) onPress(currentDir.current, false);
    if (k) onPress(k, true);
    currentDir.current = k;
  };

  const reset = () => {
    setDir(null);
    setKnob({ x: 0, y: 0 });
    activePtr.current = null;
  };

  // Safety net: if the OS swallows pointerup (iOS quirk, finger sliding off captured element,
  // app backgrounded mid-drag, etc.) the bee would keep walking forever. Listen globally so any
  // pointer release/cancel anywhere always stops movement.
  useEffect(() => {
    const stopIfMine = (e: PointerEvent) => {
      if (activePtr.current !== null && e.pointerId === activePtr.current) reset();
    };
    const stopAll = () => { if (activePtr.current !== null) reset(); };
    window.addEventListener("pointerup", stopIfMine);
    window.addEventListener("pointercancel", stopIfMine);
    window.addEventListener("blur", stopAll);
    document.addEventListener("visibilitychange", stopAll);
    return () => {
      window.removeEventListener("pointerup", stopIfMine);
      window.removeEventListener("pointercancel", stopIfMine);
      window.removeEventListener("blur", stopAll);
      document.removeEventListener("visibilitychange", stopAll);
    };
  }, []);

  return (
    <>
      {/* Jump button — bottom-LEFT (red) */}
      <button
        type="button"
        aria-label="Lompat"
        className="absolute z-30 bottom-6 left-6 w-20 h-20 rounded-full bg-red-500 border-4 border-red-700 text-background font-display font-bold text-2xl shadow-xl active:scale-95 active:bg-red-600 touch-none select-none"
        onPointerDown={(e) => { e.preventDefault(); onPress("jump", true); }}
      >
        ⤴
      </button>

      {/* Joystick base — bottom-RIGHT */}
      <div
        ref={baseRef}
        className="absolute z-30 bottom-4 right-4 w-28 h-28 rounded-full bg-foreground/30 border-2 border-background/40 backdrop-blur-sm touch-none select-none"
        onPointerDown={(e) => {
          e.preventDefault();
          if (activePtr.current !== null) return;
          activePtr.current = e.pointerId;
          (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (activePtr.current !== e.pointerId) return;
          const rect = baseRef.current!.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          let dx = e.clientX - cx;
          let dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          if (dist > RADIUS) { dx = (dx / dist) * RADIUS; dy = (dy / dist) * RADIUS; }
          setKnob({ x: dx, y: dy });
          if (dx > DEAD) setDir("ArrowRight");
          else if (dx < -DEAD) setDir("ArrowLeft");
          else setDir(null);
        }}
        onPointerUp={(e) => { if (activePtr.current === e.pointerId) reset(); }}
        onPointerCancel={(e) => { if (activePtr.current === e.pointerId) reset(); }}
        onPointerLeave={(e) => { if (activePtr.current === e.pointerId) reset(); }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-14 h-14 rounded-full bg-background/90 border-2 border-primary shadow-lg pointer-events-none"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
      </div>
    </>
  );
}

// keep imports referenced
void LEVELS;
