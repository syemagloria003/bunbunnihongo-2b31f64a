import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { fetchMe, type MeResponse } from "@/game/leaderboard";
import { supabase } from "@/integrations/supabase/client";

export function UserGreeting() {
  const [me, setMe] = useState<MeResponse | null>(null);
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
    <div className="text-center mb-4 flex flex-wrap justify-center gap-2 items-center">
      <span className="inline-block bg-primary/15 text-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
        🐝 Halo, <span className="text-primary">{me.nama}</span>!
      </span>
      {me.isAdmin && (
        <Link to="/admin" className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full hover:brightness-110">
          🛠️ Panel Admin
        </Link>
      )}
      <button onClick={logout} className="text-xs font-semibold underline text-muted-foreground hover:text-foreground">
        Logout
      </button>
    </div>
  );
}
