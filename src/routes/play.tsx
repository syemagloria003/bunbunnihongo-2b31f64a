import { createFileRoute, Link, Outlet, useMatches, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LEVELS, KATAKANA_LEVELS, KANJI_LEVELS, ALL_LEVELS, type LevelDef } from "@/game/levels";
import { loadProgress, saveProgress, type Progress } from "@/game/progress";
import { supabase } from "@/integrations/supabase/client";
import { LevelPreview } from "@/components/LevelPreview";
import { ProfileBar } from "@/components/ProfileBar";
import { NotificationTicker } from "@/components/NotificationTicker";
import { getAvatarSrc } from "@/game/avatars";
import { fetchMe, type MeResponse } from "@/game/leaderboard";

function rankBadgeClass(i: number): string {
  if (i === 0) return "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-950 ring-2 ring-yellow-200 shadow";
  if (i === 1) return "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 ring-2 ring-slate-100 shadow";
  if (i === 2) return "bg-gradient-to-br from-amber-500 to-amber-700 text-amber-50 ring-2 ring-amber-300 shadow";
  if (i === 3) return "bg-gradient-to-br from-sky-300 to-sky-500 text-sky-950 ring-2 ring-sky-200";
  if (i === 4) return "bg-gradient-to-br from-emerald-300 to-emerald-500 text-emerald-950 ring-2 ring-emerald-200";
  if (i === 5) return "bg-gradient-to-br from-pink-300 to-pink-500 text-pink-950 ring-2 ring-pink-200";
  if (i === 6) return "bg-gradient-to-br from-purple-300 to-purple-500 text-purple-50 ring-2 ring-purple-200";
  return "bg-gradient-to-br from-stone-300 to-stone-500 text-stone-950 ring-2 ring-stone-200";
}

function rankLabel(i: number): string {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `#${i + 1}`;
}

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Pilih Level — BeeGana" },
      { name: "description", content: "Pilih level petualangan Buzu si lebah." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login", search: { redirect: location.href } as never });
  },
  component: PlayLayout,
});

function PlayLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/play/$levelId");
  if (isChild) return <Outlet />;
  return <LevelSelect />;
}

interface TodayRow { user_id: string; nama: string; avatar_id: string | null; skor: number; level_id: string; level_name: string; }

function LevelSelect() {
  const [p, setP] = useState<Progress | null>(null);
  const [today, setToday] = useState<TodayRow[]>([]);
  const [peers, setPeers] = useState<TodayRow[]>([]);
  const [meId, setMeId] = useState<string | null>(null);

  useEffect(() => { setP(loadProgress()); }, []);

  const latestLevel = useMemo<LevelDef | null>(() => {
    if (!p) return null;
    const unlocked = ALL_LEVELS.filter((l) => p.unlocked.includes(l.id));
    return unlocked[unlocked.length - 1] ?? null;
  }, [p]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      setMeId(user?.id ?? null);

      const start = new Date(); start.setHours(0, 0, 0, 0);
      const { data: scores } = await supabase
        .from("scores")
        .select("user_id, skor, level_id, level_name")
        .gte("tanggal", start.toISOString())
        .order("skor", { ascending: false })
        .limit(300);

      const userIds = Array.from(new Set((scores ?? []).map((s) => s.user_id)));
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("id, nama_lengkap, nama_panggilan, avatar_id").in("id", userIds)
        : { data: [] as { id: string; nama_lengkap: string; nama_panggilan: string | null; avatar_id: string | null }[] };
      const profMap = new Map(
        (profs ?? []).map((x) => [
          x.id,
          {
            nama:
              x.nama_panggilan && x.nama_panggilan.trim().length > 0
                ? x.nama_panggilan.trim()
                : x.nama_lengkap,
            avatar_id: x.avatar_id,
          },
        ]),
      );

      const bestByUser = new Map<string, TodayRow>();
      for (const s of scores ?? []) {
        const prev = bestByUser.get(s.user_id);
        if (!prev || s.skor > prev.skor) {
          const meta = profMap.get(s.user_id);
          bestByUser.set(s.user_id, {
            user_id: s.user_id,
            nama: meta?.nama ?? "Murid",
            avatar_id: meta?.avatar_id ?? null,
            skor: s.skor, level_id: s.level_id, level_name: s.level_name,
          });
        }
      }
      if (cancelled) return;
      setToday(Array.from(bestByUser.values()).sort((a, b) => b.skor - a.skor).slice(0, 10));

      if (latestLevel) {
        const peerMap = new Map<string, TodayRow>();
        for (const s of scores ?? []) {
          if (s.level_id !== latestLevel.id) continue;
          const prev = peerMap.get(s.user_id);
          if (!prev || s.skor > prev.skor) {
            const meta = profMap.get(s.user_id);
            peerMap.set(s.user_id, {
              user_id: s.user_id,
              nama: meta?.nama ?? "Murid",
              avatar_id: meta?.avatar_id ?? null,
              skor: s.skor, level_id: s.level_id, level_name: s.level_name,
            });
          }
        }
        setPeers(Array.from(peerMap.values()).sort((a, b) => b.skor - a.skor));
      } else {
        setPeers([]);
      }
    };
    load();
    const id = setInterval(load, 15_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [latestLevel]);

  if (!p) return null;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <Link to="/" className="text-sm font-semibold hover:text-primary shrink-0">← Beranda</Link>
          <UserMenu onUnlock={setP} />
        </div>
        <NotificationTicker />
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
          Peta Petualangan 🗺️
        </h1>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-4 border-2 border-sky-400/50 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-sky-950/40 dark:to-indigo-950/40 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-lg text-sky-900 dark:text-sky-100">🏆 Skor hari ini</h3>
              <Link to="/leaderboard" className="text-xs font-semibold text-sky-700 dark:text-sky-300 hover:underline">Lihat semua →</Link>
            </div>
            <p className="text-xs text-sky-800/70 dark:text-sky-200/70 mb-3">
              Ayo kalahkan teman-temanmu — cepet-cepetan naik level! 🔥
            </p>
            {today.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Belum ada yang main hari ini. Jadilah yang pertama! 🐝</p>
            ) : (
              <ol className="space-y-1.5">
                {today.map((r, i) => {
                  const isMe = r.user_id === meId;
                  return (
                    <li key={r.user_id} className={["flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", isMe ? "bg-primary/20 ring-2 ring-primary" : "bg-white/60 dark:bg-background/40"].join(" ")}>
                      <span className={["inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold shrink-0", rankBadgeClass(i)].join(" ")}>
                        {i < 3 ? rankLabel(i) : i + 1}
                      </span>
                      <img src={getAvatarSrc(r.avatar_id)} alt="" className="w-7 h-7 rounded-full bg-background object-cover shrink-0 ring-1 ring-border" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{r.nama}{isMe && " (kamu)"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{r.level_name}</p>
                      </div>
                      <span className="font-bold text-sky-700 dark:text-sky-300">{r.skor}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="rounded-2xl p-4 border-2 border-fuchsia-400/50 bg-gradient-to-br from-fuchsia-50 to-rose-100 dark:from-fuchsia-950/40 dark:to-rose-950/40 shadow-md">
            <h3 className="font-display font-bold text-lg mb-1 text-fuchsia-900 dark:text-fuchsia-100">⚔️ Saingan di level kamu</h3>
            {latestLevel ? (
              <>
                <p className="text-xs text-fuchsia-800/70 dark:text-fuchsia-200/70 mb-3">
                  Level terbaru: <b className="text-foreground">{latestLevel.name}</b> — bandingkan skormu dengan teman selevel.
                </p>
                {peers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">Belum ada teman lain main di level ini hari ini. Pamer skormu duluan! ✨</p>
                ) : (
                  <ol className="space-y-1.5">
                    {peers.slice(0, 8).map((r, i) => {
                      const isMe = r.user_id === meId;
                      return (
                        <li key={r.user_id} className={["flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", isMe ? "bg-primary/20 ring-2 ring-primary" : "bg-white/60 dark:bg-background/40"].join(" ")}>
                          <span className={["inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold shrink-0", rankBadgeClass(i)].join(" ")}>
                            {i < 3 ? rankLabel(i) : i + 1}
                          </span>
                          <img src={getAvatarSrc(r.avatar_id)} alt="" className="w-7 h-7 rounded-full bg-background object-cover shrink-0 ring-1 ring-border" loading="lazy" />
                          <span className="flex-1 truncate font-semibold">{r.nama}{isMe && " (kamu)"}</span>
                          <span className="font-bold text-fuchsia-700 dark:text-fuchsia-300">{r.skor}</span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Mulai main level pertama untuk membuka perbandingan saingan! 🚀</p>
            )}
          </div>
        </div>



        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <h2 className="font-display text-2xl font-bold">🌻 Taman Bunga (Hiragana)</h2>
          <span className="text-xl text-red-500 animate-pulse" aria-hidden>➡️</span>
          <Link
            to="/belajar/hiragana"
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-amber-950 font-bold text-sm shadow-md hover:brightness-110 hover:-translate-y-0.5 transition border-2 border-amber-600 overflow-visible"
          >
            <span className="absolute -z-10 inset-0 rounded-full animate-fire-glow bg-red-500/50 blur-md" />
            <span className="text-red-600">📖</span> Belajar dulu
          </Link>
        </div>
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
                theme={l.theme}
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
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
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
                theme={l.theme}
              />
            );
          })}
        </div>

        {p.meteor && (
          <div className="honey-card rounded-2xl p-4 mb-4 text-center">
            <p className="font-bold">☄️ Meteor Katakana milikmu!</p>
            <p className="text-sm text-muted-foreground">Dunia Galaksi Meteor (Kanji) sudah terbuka di bawah.</p>
          </div>
        )}

        <h2 className="font-display text-2xl font-bold mb-3">☄️ Dunia Galaksi Meteor (Kanji)</h2>
        {!p.meteor && (
          <p className="text-sm text-muted-foreground mb-3">
            Tamatkan level Katakana terakhir dengan ⭐⭐⭐ untuk mendapatkan Meteor dan membuka dunia ini.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {KANJI_LEVELS.map((l: LevelDef, i: number) => {
            const unlocked = p.unlocked.includes(l.id);
            return (
              <LevelCard
                key={l.id}
                num={LEVELS.length + KATAKANA_LEVELS.length + i + 1}
                id={l.id}
                name={l.name}
                subtitle={l.subtitle}
                unlocked={unlocked}
                stars={p.bestStars[l.id] ?? 0}
                best={p.bestScore[l.id]}
                bg={l.bg}
                theme={l.theme}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UserMenu({ onUnlock }: { onUnlock: (p: Progress) => void }) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe().then(setMe);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    await navigate({ to: "/login" });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <ProfileBar />
      {me?.isAdmin && (
        <Link
          to="/admin"
          className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full hover:brightness-110 text-center"
        >
          🛠️ Admin
        </Link>
      )}
      <AdminUnlock onUnlock={onUnlock} />
      <button
        onClick={logout}
        className="text-xs font-bold px-3 py-1 rounded-full bg-destructive text-destructive-foreground hover:brightness-110 transition text-center"
      >
        Logout
      </button>
    </div>
  );
}

function AdminUnlock({ onUnlock }: { onUnlock: (p: Progress) => void }) {
  const handleClick = () => {
    const code = window.prompt("Kode admin:");
    if (code === null) return;
    if (code !== "seisho11") {
      window.alert("Kode salah.");
      return;
    }
    const p = loadProgress();
    p.unlocked = ALL_LEVELS.map((l) => l.id);
    p.crystal = true;
    saveProgress(p);
    onUnlock(p);
    window.alert("Semua level dibuka. 🔓");
  };
  return (
    <button
      onClick={handleClick}
      className="text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary"
      title="Admin"
    >
      🔑 Admin
    </button>
  );
}

function LevelCard({
  num, id, name, subtitle, unlocked, best, theme, comingSoon, stars,
}: {
  num: number; id: string; name: string; subtitle: string;
  unlocked: boolean; best?: number; bg: string; theme: import("@/game/themes").WorldTheme;
  comingSoon?: boolean; stars: number;
}) {
  const inner = (
    <div
      className={[
        "honey-card rounded-2xl p-5 transition-all relative overflow-hidden",
        unlocked ? "hover:-translate-y-1 cursor-pointer" : "opacity-60",
      ].join(" ")}
    >
      <LevelPreview theme={theme} locked={!unlocked && !comingSoon} />
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
