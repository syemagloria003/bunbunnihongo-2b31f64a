// Leaderboard client menggunakan Lovable Cloud (Supabase).
import { supabase } from "@/integrations/supabase/client";

export interface MeResponse {
  email: string;
  nama: string;            // nama yang ditampilkan (panggilan kalau ada, fallback nama lengkap)
  namaLengkap: string;
  namaPanggilan: string | null;
  avatarId: string | null;
  isAdmin: boolean;
}

export interface LeaderboardEntry {
  nama: string;
  skor: number;
  tanggal: string;
  user_id: string;
  avatar_id: string | null;
}

export async function fetchMe(): Promise<MeResponse | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("nama_lengkap, email, nama_panggilan, avatar_id")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  const namaLengkap = profile?.nama_lengkap ?? user.email?.split("@")[0] ?? "Murid";
  const namaPanggilan = (profile?.nama_panggilan ?? null) as string | null;
  const display = namaPanggilan && namaPanggilan.trim().length > 0 ? namaPanggilan.trim() : namaLengkap;

  return {
    email: profile?.email ?? user.email ?? "",
    nama: display,
    namaLengkap,
    namaPanggilan,
    avatarId: (profile?.avatar_id ?? null) as string | null,
    isAdmin: (roles ?? []).some((r) => r.role === "admin"),
  };
}

export async function updateProfile(input: {
  nama_panggilan?: string | null;
  avatar_id?: string | null;
}): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const payload: Record<string, unknown> = {};
  if (input.nama_panggilan !== undefined) {
    const v = (input.nama_panggilan ?? "").trim();
    payload.nama_panggilan = v.length ? v : null;
  }
  if (input.avatar_id !== undefined) payload.avatar_id = input.avatar_id;
  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
  return !error;
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
