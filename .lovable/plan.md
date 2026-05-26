Saat ini `src/routes/login.tsx` mengarahkan user ke `/` (landing) setelah login berhasil, dan juga saat user yang sudah login membuka `/login`.

## Perubahan
Di `src/routes/login.tsx`:
1. `beforeLoad`: ganti `redirect({ to: "/" })` → `redirect({ to: "/play" })` (kalau sudah login, langsung ke game)
2. Handler `submit`: ganti `navigate({ to: "/" })` → `navigate({ to: "/play" })` setelah login sukses

Landing page tetap publik dan tombol LOGIN tetap berfungsi seperti sekarang.