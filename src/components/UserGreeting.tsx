import { useEffect, useState } from "react";
import { fetchMe, type MeResponse } from "@/game/leaderboard";

export function UserGreeting() {
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    fetchMe().then(setMe);
  }, []);

  if (!me) return null;

  return (
    <div className="text-center mb-4">
      <p className="inline-block bg-primary/15 text-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
        🐝 Halo, <span className="text-primary">{me.nama}</span>!
      </p>
    </div>
  );
}
