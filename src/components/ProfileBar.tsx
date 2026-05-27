import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { fetchMe, updateProfile, type MeResponse } from "@/game/leaderboard";
import { supabase } from "@/integrations/supabase/client";
import { AVATARS, getAvatarSrc } from "@/game/avatars";

export function ProfileBar() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe().then(setMe);
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    await navigate({ to: "/login" });
  }

  if (!me) return null;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary/15 hover:bg-primary/25 transition rounded-full pl-1 pr-3 py-1"
          title="Edit profil"
        >
          <img
            src={getAvatarSrc(me.avatarId)}
            alt="Avatar"
            className="w-8 h-8 rounded-full bg-background object-cover ring-2 ring-primary"
          />
          <span className="text-sm font-semibold">
            🐝 <span className="text-primary">{me.nama}</span>
          </span>
        </button>
        {me.isAdmin && (
          <Link
            to="/admin"
            className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full hover:brightness-110"
          >
            🛠️ Admin
          </Link>
        )}
        <button
          onClick={logout}
          className="text-xs font-semibold px-3 py-1 rounded-full border border-border hover:border-destructive hover:text-destructive transition"
        >
          Logout
        </button>
      </div>

      {open && (
        <ProfileModal
          me={me}
          onClose={() => setOpen(false)}
          onSaved={(next) => {
            setMe(next);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function ProfileModal({
  me,
  onClose,
  onSaved,
}: {
  me: MeResponse;
  onClose: () => void;
  onSaved: (next: MeResponse) => void;
}) {
  const [nick, setNick] = useState(me.namaPanggilan ?? "");
  const [avatar, setAvatar] = useState<string>(me.avatarId ?? "bee");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    const trimmed = nick.trim();
    if (trimmed.length > 24) {
      setErr("Nama panggilan maksimal 24 karakter.");
      return;
    }
    setSaving(true);
    const ok = await updateProfile({ nama_panggilan: trimmed, avatar_id: avatar });
    setSaving(false);
    if (!ok) {
      setErr("Gagal menyimpan. Coba lagi.");
      return;
    }
    const fresh = await fetchMe();
    if (fresh) onSaved(fresh);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-3xl p-5 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold">👤 Profil kamu</h2>
          <button onClick={onClose} className="text-2xl leading-none text-muted-foreground hover:text-foreground">×</button>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Nama asli (untuk sensei): <b className="text-foreground">{me.namaLengkap}</b>
        </p>

        <label className="text-sm font-semibold">Nama panggilan untuk papan peringkat</label>
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          maxLength={24}
          placeholder="Contoh: BuzuKun"
          className="w-full mt-1 mb-1 px-3 py-2 rounded-xl border-2 border-border bg-background focus:border-primary outline-none"
        />
        <p className="text-[11px] text-muted-foreground mb-4">
          Kosongkan kalau mau pakai nama asli. Maks 24 karakter.
        </p>

        <p className="text-sm font-semibold mb-2">Pilih avatar</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {AVATARS.map((a) => {
            const active = avatar === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                title={a.name}
                className={[
                  "rounded-2xl p-1.5 transition flex flex-col items-center",
                  active
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "bg-background/60 hover:bg-primary/10 ring-1 ring-border",
                ].join(" ")}
              >
                <img
                  src={a.src}
                  alt={a.name}
                  className="w-14 h-14 object-contain"
                  loading="lazy"
                  width={56}
                  height={56}
                />
                <span className="text-[10px] mt-1 font-semibold text-center leading-tight">{a.name}</span>
              </button>
            );
          })}
        </div>

        {err && <p className="text-sm text-destructive mb-2">{err}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border font-bold hover:bg-muted transition"
          >
            Batal
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-60 hover:brightness-105 transition"
          >
            {saving ? "Menyimpan…" : "💾 Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
