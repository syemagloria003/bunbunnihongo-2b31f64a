// Leaderboard client menggunakan Lovable Cloud (Supabase).
import { supabase } from "@/integrations/supabase/client";

export interface MeResponse {
  email: string;
  nama: string;
  isAdmin: boolean;
}

export interface LeaderboardEntry {
  nama: string;
  skor: number;
  tanggal: string;
  user_id: string;
}

export async function fetchMe(): Promise<MeResponse | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("nama_lengkap, email").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  return {
    email: profile?.email ?? user.email ?? "",
    nama: profile?.nama_lengkap ?? user.email?.split("@")[0] ?? "Murid",
    isAdmin: (roles ?? []).some((r) => r.role === "admin"),
  };
}

export async function submitScore(
  score: number,
  levelId: string,
  levelName: string,
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("scores").insert({
    user_id: user.id,
    skor: score,
    level_id: levelId,
    level_name: levelName,
  });
  return !error;
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data: scoreRows, error } = await supabase
    .from("scores")
    .select("user_id, skor, tanggal")
    .order("skor", { ascending: false })
    .limit(limit * 10);
  if (error || !scoreRows) return [];

  // Dedup per user, ambil skor tertinggi saja
  const best = new Map<string, { user_id: string; skor: number; tanggal: string }>();
  for (const row of scoreRows) {
    const existing = best.get(row.user_id);
    if (!existing || row.skor > existing.skor) best.set(row.user_id, row);
  }

  const userIds = Array.from(best.keys());
  if (userIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nama_lengkap")
    .in("id", userIds);
  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.nama_lengkap]));

  return Array.from(best.values())
    .map((r) => ({ ...r, nama: nameMap.get(r.user_id) ?? "Murid" }))
    .sort((a, b) => b.skor - a.skor)
    .slice(0, limit);
}

