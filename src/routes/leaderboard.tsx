import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchLeaderboard, fetchMe, type LeaderboardEntry, type MeResponse } from "@/game/leaderboard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Papan Peringkat — BeeGana" },
      { name: "description", content: "Lihat ranking skor tertinggi murid Bunbun Nihongo." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login", search: { redirect: location.href } as never });
  },
  component: LeaderboardPage,
});

function formatDate(s: string): string {
  try {
    const d = new Date(s.replace(" ", "T"));
    if (isNaN(d.getTime())) return s;
    return d.toLocaleString("id-ID", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return s;
  }
}

function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const data = await fetchLeaderboard(20);
      if (cancelled) return;
      setRows(data);
      setLastUpdate(new Date());
      setLoading(false);
    };

    fetchMe().then((m) => { if (!cancelled) setMe(m); });
    load();
    const id = setInterval(load, 10_000); // refresh tiap 10 detik
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-3">
          <Link to="/play" className="text-sm font-semibold hover:text-primary shrink-0">← Kembali</Link>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">🏆 Papan Peringkat</h1>

        {me && (
          <p className="text-center text-sm text-muted-foreground mb-4">
            Halo, <span className="font-bold text-foreground">{me.nama}</span> — terus naikkan skormu! 🐝
          </p>
        )}

        <div className="honey-card rounded-2xl p-4 md:p-6">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Memuat papan peringkat…</p>
          ) : rows.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🌱</p>
              <p className="font-bold">Belum ada skor</p>
              <p className="text-sm text-muted-foreground mt-1">
                Jadilah yang pertama! Mainkan level apapun dan skormu akan muncul di sini.
              </p>
            </div>
          ) : (
            <ol className="space-y-2">
              {rows.map((r, i) => {
                const isMe = me?.nama === r.nama;
                return (
                  <li
                    key={`${r.nama}-${r.tanggal}-${i}`}
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-2 transition",
                      isMe ? "bg-primary/15 ring-2 ring-primary" : "bg-background/60",
                    ].join(" ")}
                  >
                    <span className="font-display font-bold text-lg w-8 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{r.nama}{isMe && " (kamu)"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.tanggal)}</p>
                    </div>
                    <span className="font-display font-bold text-xl text-primary">{r.skor}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Otomatis diperbarui tiap 10 detik
          {lastUpdate && ` • Terakhir: ${lastUpdate.toLocaleTimeString("id-ID")}`}
        </p>
      </div>
    </div>
  );
}
