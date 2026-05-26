
-- 1. Restrict profile reads: drop broad policy, allow only self (admin policy already exists)
DROP POLICY IF EXISTS "auth read profiles" ON public.profiles;

CREATE POLICY "self read profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Public-safe leaderboard function (returns only name + score, no emails)
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit int DEFAULT 20)
RETURNS TABLE (user_id uuid, nama text, skor int, tanggal timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT ON (s.user_id)
    s.user_id,
    COALESCE(p.nama_lengkap, 'Murid') AS nama,
    s.skor,
    s.tanggal
  FROM public.scores s
  LEFT JOIN public.profiles p ON p.id = s.user_id
  ORDER BY s.user_id, s.skor DESC, s.tanggal DESC
  LIMIT GREATEST(_limit, 1) * 10;
$$;

REVOKE ALL ON FUNCTION public.get_leaderboard(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO authenticated;
