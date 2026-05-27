import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { GameCanvas } from "@/components/GameCanvas";
import { getLevel } from "@/game/levels";

export const Route = createFileRoute("/play/$levelId")({
  head: ({ params }) => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: `Level ${params.levelId} — BeeGana` },
      { name: "description", content: "Main petualangan BeeGana." },
    ],
  }),
  component: PlayLevel,
});

function PlayLevel() {
  const { levelId } = useParams({ from: "/play/$levelId" });
  const level = getLevel(levelId);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="honey-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Level belum tersedia</h2>
          <p className="text-muted-foreground mb-4">Level ini sedang dibangun oleh para lebah pekerja 🐝</p>
          <Link to="/play" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold">← Pilih level lain</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <Link to="/play" className="text-sm font-semibold hover:text-primary">← Pilih level</Link>
          <p className="text-sm text-muted-foreground">{level.subtitle}</p>
        </div>
        <GameCanvas level={level} />
      </div>
    </div>
  );
}
