import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Notif {
  id: string;
  kind: "epic" | "great" | "good" | "first";
  text: string;
  time: number; // ms epoch
}

interface ScoreRow {
  id: string;
  user_id: string;
  skor: number;
  level_name: string;
  tanggal: string;
}

function timeAgo(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const s = Math.floor(diff / 1000);
  if (s < 30) return "baru saja";
  if (s < 60) return `${s} detik lalu`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

function tierFor(skor: number): Notif["kind"] {
  if (skor >= 800) return "epic";
  if (skor >= 500) return "great";
  if (skor >= 200) return "good";
  return "first";
}

function lineFor(nama: string, skor: number, level: string, kind: Notif["kind"]): string {
  const k = {
    epic: `💎 ${nama} mendapat drop EPIC! Skor ${skor} di ${level} 🔥`,
    great: `⚡ ${nama} naik peringkat dengan skor ${skor} di ${level}!`,
    good: `⭐ ${nama} menyelesaikan ${level} (skor ${skor})`,
    first: `🌱 ${nama} baru memulai petualangan di ${level}`,
  } as const;
  return k[kind];
}

export function NotificationTicker() {
  const [items, setItems] = useState<Notif[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: scores } = await supabase
        .from("scores")
        .select("id, user_id, skor, level_name, tanggal")
        .gte("tanggal", since)
        .order("tanggal", { ascending: false })
        .limit(25);
      if (!scores || scores.length === 0) {
        if (!cancelled) setItems([]);
        return;
      }
      const userIds = Array.from(new Set(scores.map((s: ScoreRow) => s.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, nama_lengkap, nama_panggilan")
        .in("id", userIds);
      const nameMap = new Map(
        (profs ?? []).map((p) => [
          p.id,
          p.nama_panggilan && p.nama_panggilan.trim() ? p.nama_panggilan.trim() : p.nama_lengkap,
        ]),
      );
      const list: Notif[] = (scores as ScoreRow[]).map((s) => {
        const kind = tierFor(s.skor);
        const nama = nameMap.get(s.user_id) ?? "Seseorang";
        return {
          id: s.id,
          kind,
          time: new Date(s.tanggal).getTime(),
          text: lineFor(nama, s.skor, s.level_name, kind),
        };
      });
      if (!cancelled) setItems(list);
    };
    load();
    const id = setInterval(load, 20_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (items.length === 0) return null;

  // Duplicate untuk marquee yang mulus
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-full border-2 border-primary/40 bg-gradient-to-r from-background via-primary/10 to-background mb-4 shadow-sm">
      <div className="flex items-center">
        <span className="shrink-0 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-full m-1">
          📢 LIVE
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-6 animate-marquee whitespace-nowrap py-1.5">
            {loop.map((n, i) => (
              <span
                key={`${n.id}-${i}`}
                className={[
                  "text-xs sm:text-sm font-semibold",
                  n.kind === "epic"
                    ? "text-accent"
                    : n.kind === "great"
                    ? "text-primary"
                    : "text-foreground/80",
                ].join(" ")}
              >
                {n.text} <span className="text-muted-foreground font-normal">• {timeAgo(n.time)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
