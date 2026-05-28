import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fetchMe, updateProfile, type MeResponse } from "@/game/leaderboard";
import { AVATARS, getAvatarSrc, isAvatarUnlocked } from "@/game/avatars";

export function ProfileBar({ size = "sm" }: { size?: "sm" | "lg" } = {}) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMe().then(setMe);
  }, []);

  if (!me) return null;

  const isLg = size === "lg";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          isLg
            ? "relative rounded-full ring-4 ring-primary/60 hover:ring-primary transition bg-background group"
            : "flex items-center gap-2 bg-primary/15 hover:bg-primary/25 transition rounded-full pl-1 pr-3 py-1"
        }
        title="Klik untuk ubah nama panggilan & avatar"
      >
        <img
          src={getAvatarSrc(me.avatarId)}
          alt="Avatar"
          className={
            isLg
              ? "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background object-cover"
              : "w-8 h-8 rounded-full bg-background object-cover ring-2 ring-primary"
          }
        />
        {isLg && (
          <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-xs w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-background shadow-md">
            ✏️
          </span>
        )}
        {!isLg && <span className="text-sm font-semibold text-primary">{me.nama}</span>}
      </button>

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col border-2 border-primary/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 pb-3 border-b border-border">
          <h2 className="font-display text-xl font-bold">👤 Profil kamu</h2>
          <button onClick={onClose} className="text-2xl leading-none text-muted-foreground hover:text-foreground" aria-label="Tutup">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-xs text-muted-foreground mb-3">
            Nama asli (untuk sensei): <b className="text-foreground">{me.namaLengkap}</b>
          </p>

          <label htmlFor="nick-input" className="text-sm font-semibold block">
            ✏️ Nama panggilan untuk papan peringkat
          </label>
          <input
            id="nick-input"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            maxLength={24}
            placeholder="Contoh: BuzuKun"
            className="w-full mt-1.5 mb-1 px-3 py-2.5 rounded-xl border-2 border-primary/50 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none font-semibold"
          />
          <p className="text-[11px] text-muted-foreground mb-4">
            Kosongkan kalau mau pakai nama asli. Maks 24 karakter.
          </p>

          <p className="text-sm font-semibold mb-2">🎭 Pilih avatar</p>
          <div className="grid grid-cols-4 gap-2">
            {AVATARS.map((a) => {
              const active = avatar === a.id;
              const unlocked = isAvatarUnlocked(a);
              const isRare = a.rarity === "rare";
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (!unlocked) {
                      setErr(`🔒 ${a.name} masih terkunci. ${a.unlockHint ?? ""}`);
                      return;
                    }
                    setErr("");
                    setAvatar(a.id);
                  }}
                  title={unlocked ? a.name : `🔒 Terkunci · ${a.unlockHint ?? ""}`}
                  className={[
                    "relative rounded-2xl p-1.5 transition flex flex-col items-center",
                    active
                      ? "bg-primary/25 ring-2 ring-primary"
                      : isRare && unlocked
                      ? "bg-gradient-to-b from-amber-100 to-rose-100 dark:from-amber-950/40 dark:to-rose-950/40 hover:brightness-105 ring-2 ring-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.55)]"
                      : "bg-background/60 hover:bg-primary/10 ring-1 ring-border",
                    !unlocked ? "cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  {isRare && (
                    <span className="absolute -top-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow">
                      ✨
                    </span>
                  )}
                  <div className="relative">
                    <img
                      src={a.src}
                      alt={a.name}
                      className={`w-14 h-14 object-contain ${!unlocked ? "grayscale opacity-40" : ""}`}
                      loading="lazy"
                      width={56}
                      height={56}
                    />
                    {!unlocked && (
                      <span className="absolute inset-0 flex items-center justify-center text-2xl drop-shadow">
                        🔒
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 font-semibold text-center leading-tight ${!unlocked ? "text-muted-foreground" : ""}`}>
                    {a.name}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
            🔒 = avatar langka. Buka dengan menyelesaikan <b>Bonus Game Aisatsu</b> di Taman Hiragana.
          </p>

          {err && <p className="text-sm text-destructive mt-3">{err}</p>}
        </div>

        <div className="flex gap-2 p-4 border-t-2 border-primary/30 bg-card rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border font-bold hover:bg-muted transition"
          >
            Batal
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-60 hover:brightness-110 transition shadow-lg ring-2 ring-primary/40"
          >
            {saving ? "Menyimpan…" : "💾 Simpan perubahan"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
