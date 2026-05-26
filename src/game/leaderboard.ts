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
  const { data, error } = await supabase.rpc("get_leaderboard", { _limit: limit });
  if (error || !data) return [];
  return (data as LeaderboardEntry[])
    .sort((a, b) => b.skor - a.skor)
    .slice(0, limit);
}

