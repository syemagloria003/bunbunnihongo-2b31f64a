import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-bunbun.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login Murid — Bunbun Nihongo" },
      { name: "description", content: "Masuk untuk mulai bermain dan menyimpan skor." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/play" });
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr("Email atau password salah. Hubungi admin kalau lupa.");
      return;
    }
    await navigate({ to: "/play" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-background to-primary/5">
      <div className="honey-card rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Bunbun Nihongo" className="w-24 h-24 mx-auto rounded-2xl shadow-md mb-3" />
          <h1 className="font-display text-2xl font-bold">Bunbun Nihongo</h1>
          <p className="text-sm text-primary font-semibold mt-1">Kursus Online Bahasa Jepang</p>
          <div className="mt-4 mx-auto max-w-xs bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              Sudah latihan tambahan setelah Zoom bareng sensei hari ini? 🌸
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Yuk login & lanjut main, biar kana-nya makin nempel! 🎮🍯
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Login murid</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-border bg-background focus:border-primary outline-none"
              placeholder="murid@email.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border-2 border-border bg-background focus:border-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-60 hover:brightness-105 transition"
          >
            {loading ? "Memproses…" : "🍯 Masuk"}
          </button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-6">
          Belum punya akun? Hubungi <a href="https://wa.me/62895328671000" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">admin/guru</a> untuk daftar.
        </p>
      </div>
    </div>
  );
}
