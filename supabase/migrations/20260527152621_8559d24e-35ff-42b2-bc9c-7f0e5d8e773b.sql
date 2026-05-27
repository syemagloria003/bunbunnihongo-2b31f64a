ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nama_panggilan text,
  ADD COLUMN IF NOT EXISTS avatar_id text;

DROP FUNCTION IF EXISTS public.get_leaderboard(integer);

CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit integer DEFAULT 20)
 RETURNS TABLE(user_id uuid, nama text, avatar_id text, skor integer, tanggal timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT DISTINCT ON (s.user_id)
    s.user_id,
    COALESCE(NULLIF(TRIM(p.nama_panggilan), ''), p.nama_lengkap, 'Murid') AS nama,
    p.avatar_id,
    s.skor,
    s.tanggal
  FROM public.scores s
  LEFT JOIN public.profiles p ON p.id = s.user_id
  ORDER BY s.user_id, s.skor DESC, s.tanggal DESC
  LIMIT GREATEST(_limit, 1) * 10;
$function$;