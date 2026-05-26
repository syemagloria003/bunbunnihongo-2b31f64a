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
  // Ambil skor tertinggi per user (top N keseluruhan, lalu kelompokkan)
  const { data, error } = await supabase
    .from("scores")
    .select("user_id, skor, tanggal, profiles!inner(nama_lengkap)")
    .order("skor", { ascending: false })
    .limit(limit * 5);
  if (error || !data) return [];

  // Dedup per user, ambil skor tertingginya saja
  const seen = new Map<string, LeaderboardEntry>();
  for (const row of data as Array<{
    user_id: string;
    skor: number;
    tanggal: string;
    profiles: { nama_lengkap: string } | { nama_lengkap: string }[];
  }>) {
    const prof = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const nama = prof?.nama_lengkap ?? "Murid";
    const existing = seen.get(row.user_id);
    if (!existing || row.skor > existing.skor) {
      seen.set(row.user_id, {
        user_id: row.user_id,
        nama,
        skor: row.skor,
        tanggal: row.tanggal,
      });
    }
  }
  return Array.from(seen.values())
    .sort((a, b) => b.skor - a.skor)
    .slice(0, limit);
}
