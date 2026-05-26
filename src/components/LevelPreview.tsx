import { getTheme } from "@/game/themes";
import type { WorldTheme } from "@/game/themes";

// Tiny SVG diorama hinting at the world inside each level — sky, light source,
// far silhouettes, mid accents (flowers/crystals/etc), ground, plus a goal flag
// and bee. Renders inside the colored band at the top of every LevelCard.
export function LevelPreview({ theme, locked }: { theme: WorldTheme; locked?: boolean }) {
  const t = getTheme(theme);
  const gid = `sky-${theme}`;
  const ggid = `ground-${theme}`;

  // Light source
  const light = (() => {
    switch (t.lightStyle) {
      case "moon": return <circle cx="155" cy="22" r="11" fill={t.light} opacity="0.95" />;
      case "crystal": return <polygon points="155,10 165,22 155,34 145,22" fill={t.light} opacity="0.9" />;
      case "aurora": return <ellipse cx="100" cy="14" rx="80" ry="10" fill={t.light} opacity="0.35" />;
      case "comet": return <g><circle cx="160" cy="18" r="5" fill={t.light} /><path d="M160 18 L130 30" stroke={t.light} strokeWidth="2" opacity="0.6" /></g>;
      case "void": return <circle cx="155" cy="22" r="9" fill="#000" stroke={t.light} strokeWidth="1.5" />;
      case "fog": return <ellipse cx="100" cy="22" rx="90" ry="8" fill={t.light} opacity="0.3" />;
      case "paleSun": return <circle cx="155" cy="22" r="10" fill={t.light} opacity="0.7" />;
      default: return <circle cx="155" cy="22" r="12" fill={t.light} />;
    }
  })();

  // Far layer silhouettes
  const far = (() => {
    switch (t.farStyle) {
      case "stalactites":
        return <g fill={t.farBack}>
          <polygon points="0,0 20,28 40,0" /><polygon points="50,0 70,32 90,0" />
          <polygon points="100,0 120,26 140,0" /><polygon points="150,0 170,30 190,0" />
        </g>;
      case "waves":
        return <path d={`M0 55 Q30 45 60 55 T120 55 T180 55 L200 70 L0 70 Z`} fill={t.farBack} />;
      case "floatingIslands":
        return <g fill={t.farBack}>
          <ellipse cx="40" cy="40" rx="22" ry="6" /><ellipse cx="120" cy="35" rx="18" ry="5" />
          <ellipse cx="170" cy="45" rx="16" ry="5" />
        </g>;
      case "snowHills":
        return <g fill={t.farBack}><path d="M0 60 Q40 35 80 55 Q130 30 200 55 L200 70 L0 70 Z" /></g>;
      case "ruins":
        return <g fill={t.farBack}>
          <rect x="20" y="38" width="14" height="22" /><rect x="50" y="32" width="10" height="28" />
          <rect x="80" y="40" width="16" height="20" /><rect x="130" y="34" width="12" height="26" />
          <rect x="160" y="42" width="14" height="18" />
        </g>;
      case "magmaMtns":
        return <g fill={t.farBack}>
          <polygon points="0,60 35,32 70,60" /><polygon points="60,60 100,28 140,60" />
          <polygon points="130,60 170,34 200,60" />
        </g>;
      case "galaxy":
        return <g fill={t.farBack} opacity="0.7">
          <circle cx="30" cy="20" r="1.5" /><circle cx="70" cy="30" r="1" /><circle cx="110" cy="18" r="1.5" />
          <circle cx="150" cy="38" r="1" /><circle cx="180" cy="22" r="1.5" />
          <ellipse cx="100" cy="45" rx="40" ry="6" opacity="0.4" />
        </g>;
      default:
        return <path d="M0 60 Q50 38 100 55 Q150 42 200 58 L200 70 L0 70 Z" fill={t.farBack} />;
    }
  })();

  // Mid layer accents (flowers, crystals, etc.)
  const mid = (() => {
    const xs = [25, 65, 105, 145, 180];
    switch (t.midStyle) {
      case "crystals":
        return <g>{xs.map((x, i) => (
          <polygon key={i} points={`${x},${68 - (i % 2 ? 10 : 14)} ${x + 6},68 ${x - 6},68`}
            fill={i % 2 ? t.midAccent2 : t.midAccent} />
        ))}</g>;
      case "jellyfish":
        return <g>{xs.map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={50 + (i % 2) * 6} rx="6" ry="4" fill={i % 2 ? t.midAccent2 : t.midAccent} opacity="0.9" />
            <line x1={x - 2} y1={54 + (i % 2) * 6} x2={x - 2} y2={62 + (i % 2) * 6} stroke={t.midAccent} strokeWidth="0.6" />
            <line x1={x + 2} y1={54 + (i % 2) * 6} x2={x + 2} y2={62 + (i % 2) * 6} stroke={t.midAccent} strokeWidth="0.6" />
          </g>
        ))}</g>;
      case "nebula":
        return <g opacity="0.5">
          <ellipse cx="60" cy="40" rx="30" ry="10" fill={t.midAccent} />
          <ellipse cx="140" cy="45" rx="35" ry="12" fill={t.midAccent2} />
        </g>;
      case "pines":
        return <g>{xs.map((x, i) => (
          <polygon key={i} points={`${x},${52 + (i % 2) * 4} ${x + 7},68 ${x - 7},68`}
            fill={i % 2 ? t.midAccent2 : t.midAccent} />
        ))}</g>;
      case "pillars":
        return <g>{xs.map((x, i) => (
          <rect key={i} x={x - 4} y={48 + (i % 2) * 4} width="8" height={20 - (i % 2) * 4}
            fill={i % 2 ? t.midAccent2 : t.midAccent} />
        ))}</g>;
      case "lava":
        return <g>
          <path d="M0 62 Q40 55 80 62 Q120 58 160 62 Q180 60 200 62 L200 68 L0 68 Z" fill={t.midAccent} />
          <circle cx="50" cy="58" r="2" fill={t.midAccent2} /><circle cx="130" cy="60" r="2" fill={t.midAccent2} />
        </g>;
      case "planets":
        return <g>
          <circle cx="50" cy="40" r="6" fill={t.midAccent} />
          <circle cx="135" cy="48" r="9" fill={t.midAccent2} />
          <ellipse cx="135" cy="48" rx="13" ry="2" fill="none" stroke={t.midAccent} strokeWidth="0.8" />
        </g>;
      default: // flowers
        return <g>{xs.map((x, i) => (
          <g key={i}>
            <line x1={x} y1="60" x2={x} y2="68" stroke={t.capDark || "#4a8a3a"} strokeWidth="1" />
            <circle cx={x} cy="60" r="3" fill={i % 2 ? t.midAccent2 : t.midAccent} />
          </g>
        ))}</g>;
    }
  })();

  // Ground band
  const ground = (
    <g>
      <rect x="0" y="68" width="200" height="14" fill={`url(#${ggid})`} />
      {t.cap && <rect x="0" y="67" width="200" height="2.5" fill={t.cap} />}
    </g>
  );

  // Goal flag + bee silhouette = teaser
  const goal = (
    <g>
      <rect x="172" y="56" width="1.5" height="14" fill={t.goalAccent || "#222"} />
      <polygon points={`173.5,56 182,59 173.5,62`} fill={t.goalFlag} />
    </g>
  );
  const bee = (
    <g transform="translate(18,62)">
      <ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#f5c842" />
      <rect x="-2" y="-3" width="1.4" height="6" fill="#222" />
      <rect x="1" y="-3" width="1.4" height="6" fill="#222" />
      <ellipse cx="-1" cy="-3" rx="3" ry="1.5" fill="#fff" opacity="0.85" />
    </g>
  );

  return (
    <div className="absolute inset-x-0 top-0 h-16 overflow-hidden">
      <svg viewBox="0 0 200 82" preserveAspectRatio="none" className="w-full h-full block">
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={t.skyTop} />
            <stop offset="100%" stopColor={t.skyBottom} />
          </linearGradient>
          <linearGradient id={ggid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={t.groundTop} />
            <stop offset="100%" stopColor={t.groundBottom} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="82" fill={`url(#${gid})`} />
        {light}
        {far}
        {mid}
        {ground}
        {goal}
        {bee}
      </svg>
      {locked && (
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </div>
  );
}
