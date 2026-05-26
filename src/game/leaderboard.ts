// Klien untuk endpoint PHP di cPanel.
// Path memakai BASE_URL Vite supaya bekerja saat game di-mount di subfolder seperti /game/.
// Saat development di Lovable preview, endpoint PHP belum ada — fungsi akan fail diam-diam.

export interface MeResponse {
  email: string;
  nama: string;
}

export interface LeaderboardEntry {
  nama: string;
  skor: number;
  tanggal: string; // ISO atau string MySQL
}

function apiUrl(path: string): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const clean = path.replace(/^\/+/, "");
  return `${base}/api/${clean}`;
}

export async function fetchMe(): Promise<MeResponse | null> {
  try {
    const res = await fetch(apiUrl("me.php"), { credentials: "same-origin" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data.email !== "string") return null;
    return data as MeResponse;
  } catch {
    return null;
  }
}

export async function submitScore(
  score: number,
  levelId: string,
  levelName: string,
): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("save-score.php"), {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, levelId, levelName }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(apiUrl(`leaderboard.php?limit=${limit}`), {
      credentials: "same-origin",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}
