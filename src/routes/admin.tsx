import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  adminCreateUser,
  adminDeleteUser,
  adminListStudents,
  adminResetPassword,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — BeeGana" }],
  }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles || roles.length === 0) throw redirect({ to: "/" });
  },
  component: AdminPage,
});

interface Student {
  id: string;
  email: string;
  nama_lengkap: string;
  created_at: string;
  role: string;
}

function AdminPage() {
  const navigate = useNavigate();
  const listFn = useServerFn(adminListStudents);
  const createFn = useServerFn(adminCreateUser);
  const deleteFn = useServerFn(adminDeleteUser);
  const resetFn = useServerFn(adminResetPassword);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Form tambah murid
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const data = await listFn();
      setStudents(data as Student[]);
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void reload(); }, []);

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await createFn({ data: { email, password: pw, nama_lengkap: nama } });
      setMsg({ type: "ok", text: `Murid ${nama} berhasil dibuat.` });
      setNama(""); setEmail(""); setPw("");
      await reload();
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function removeStudent(s: Student) {
    if (!confirm(`Hapus akun ${s.nama_lengkap} (${s.email})? Tidak bisa dibatalkan.`)) return;
    try {
      await deleteFn({ data: { user_id: s.id } });
      setMsg({ type: "ok", text: `${s.nama_lengkap} dihapus.` });
      await reload();
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    }
  }

  async function resetPassword(s: Student) {
    const np = prompt(`Password baru untuk ${s.nama_lengkap}:`);
    if (!np || np.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }
    try {
      await resetFn({ data: { user_id: s.id, password: np } });
      setMsg({ type: "ok", text: `Password ${s.nama_lengkap} berhasil direset.` });
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    await navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm font-semibold hover:text-primary">← Beranda</Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold">🛠️ Panel Admin</h1>
          <button onClick={logout} className="text-sm font-semibold hover:text-primary">Logout</button>
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-2 rounded-xl text-sm font-semibold ${
            msg.type === "ok" ? "bg-primary/15 text-foreground" : "bg-destructive/15 text-destructive"
          }`}>{msg.text}</div>
        )}

        <section className="honey-card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-xl mb-4">➕ Tambah Murid Baru</h2>
          <form onSubmit={addStudent} className="grid md:grid-cols-3 gap-3">
            <input
              required value={nama} onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap"
              className="px-3 py-2 rounded-xl border-2 border-border bg-background focus:border-primary outline-none"
            />
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="px-3 py-2 rounded-xl border-2 border-border bg-background focus:border-primary outline-none"
            />
            <input
              required value={pw} onChange={(e) => setPw(e.target.value)} minLength={6}
              placeholder="Password (min 6 huruf)"
              className="px-3 py-2 rounded-xl border-2 border-border bg-background focus:border-primary outline-none"
            />
            <button
              type="submit" disabled={busy}
              className="md:col-span-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-60"
            >
              {busy ? "Membuat…" : "Buat akun murid"}
            </button>
          </form>
        </section>

        <section className="honey-card rounded-2xl p-6">
          <h2 className="font-bold text-xl mb-4">👥 Daftar Murid ({students.length})</h2>
          {loading ? (
            <p className="text-muted-foreground">Memuat…</p>
          ) : students.length === 0 ? (
            <p className="text-muted-foreground">Belum ada murid. Tambahkan di atas.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-background/60">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold">
                      {s.nama_lengkap}
                      {s.role === "admin" && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">ADMIN</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                  <button
                    onClick={() => resetPassword(s)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-border hover:bg-muted"
                  >🔑 Reset password</button>
                  {s.role !== "admin" && (
                    <button
                      onClick={() => removeStudent(s)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground hover:brightness-110"
                    >🗑️ Hapus</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
