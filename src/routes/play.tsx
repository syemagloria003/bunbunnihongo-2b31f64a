import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LEVELS, KATAKANA_LEVELS, type LevelDef } from "@/game/levels";
import { loadProgress, type Progress } from "@/game/progress";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Pilih Level — BeeGana" },
      { name: "description", content: "Pilih level petualangan Buzu si lebah." },
    ],
  }),
  component: PlayLayout,
});

function PlayLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/play/$levelId");
  if (isChild) return <Outlet />;
  return <LevelSelect />;
}

function LevelSelect() {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => { setP(loadProgress()); }, []);
  if (!p) return null;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm font-semibold hover:text-primary">← Beranda</Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Peta Petualangan 🗺️</h1>
          <div className="w-16" />
        </div>

        {p.crystal && (
          <div className="honey-card rounded-2xl p-4 mb-4 text-center">
            <p className="font-bold">💎 Kristal Hiragana milikmu!</p>
            <p className="text-sm text-muted-foreground">Dunia Kristal Katakana sudah terbuka di bawah.</p>
          </div>
        )}

        <h2 className="font-display text-2xl font-bold mb-3">🌻 Taman Hiragana</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {LEVELS.map((l: LevelDef, i: number) => {
            const unlocked = p.unlocked.includes(l.id);
            return (
              <LevelCard
                key={l.id}
                num={i + 1}
                id={l.id}
                name={l.name}
                subtitle={l.subtitle}
                unlocked={unlocked}
                stars={p.bestStars[l.id] ?? 0}
                best={p.bestScore[l.id]}
                bg={l.bg}
              />
            );
          })}
        </div>

        <h2 className="font-display text-2xl font-bold mb-3">💎 Dunia Kristal (Katakana)</h2>
        {!p.crystal && (
          <p className="text-sm text-muted-foreground mb-3">
            Tamatkan <b>Ratu Tawon</b> dengan ⭐⭐⭐ untuk mendapatkan Kristal dan membuka dunia ini.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {KATAKANA_LEVELS.map((l: LevelDef, i: number) => {
            const unlocked = p.unlocked.includes(l.id);
            return (
              <LevelCard
                key={l.id}
                num={LEVELS.length + i + 1}
                id={l.id}
                name={l.name}
                subtitle={l.subtitle}
                unlocked={unlocked}
                stars={p.bestStars[l.id] ?? 0}
                best={p.bestScore[l.id]}
                bg={l.bg}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LevelCard({
  num, id, name, subtitle, unlocked, best, bg, comingSoon, stars,
}: {
  num: number; id: string; name: string; subtitle: string;
  unlocked: boolean; best?: number; bg: string; comingSoon?: boolean; stars: number;
}) {
  const inner = (
    <div
      className={[
        "honey-card rounded-2xl p-5 transition-all relative overflow-hidden",
        unlocked ? "hover:-translate-y-1 cursor-pointer" : "opacity-60",
      ].join(" ")}
    >
      <div className="absolute inset-x-0 top-0 h-16" style={{ background: bg }} />
      <div className="relative pt-12">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            Level {num}
          </span>
          {comingSoon && <span className="text-xs font-semibold text-muted-foreground">SEGERA</span>}
          {!unlocked && !comingSoon && <span>🔒</span>}
        </div>
        <h3 className="font-display text-2xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="text-base">
            {[1,2,3,4,5].map((i) => (
              <span key={i} className={i <= stars ? "" : "opacity-25 grayscale"}>⭐</span>
            ))}
          </div>
          {best !== undefined && (
            <p className="text-xs font-semibold text-muted-foreground">Skor: {best}</p>
          )}
        </div>
      </div>
    </div>
  );
  if (!unlocked) return inner;
  return <Link to="/play/$levelId" params={{ levelId: id }}>{inner}</Link>;
}
