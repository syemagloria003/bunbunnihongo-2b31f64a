import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login Murid — BeeGana" },
      { name: "description", content: "Masuk untuk mulai bermain dan menyimpan skor." },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
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
    await navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-background to-primary/5">
      <div className="honey-card rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🐝</div>
          <h1 className="font-display text-3xl font-bold">Bee<span className="text-primary">Gana</span></h1>
          <p className="text-sm text-muted-foreground mt-1">Login murid Bunbun Nihongo</p>
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
          Belum punya akun? Hubungi <Link to="/" className="text-primary font-semibold">admin/guru</Link> untuk daftar.
        </p>
      </div>
    </div>
  );
}
