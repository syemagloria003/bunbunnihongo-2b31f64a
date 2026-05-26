import { useEffect, useMemo, useRef, useState } from "react";

// Eagerly import every bundled KanjiVG SVG as a raw string.
// Files live in src/assets/kanjivg/<5-digit hex codepoint>.svg
const RAW_SVGS = import.meta.glob("../assets/kanjivg/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const SVG_BY_HEX: Record<string, string> = {};
for (const [path, raw] of Object.entries(RAW_SVGS)) {
  const m = path.match(/([0-9a-f]+)\.svg$/);
  if (m) SVG_BY_HEX[m[1]] = raw;
}

function hexFor(char: string): string {
  const cp = char.codePointAt(0) ?? 0;
  return cp.toString(16).padStart(5, "0");
}

interface ParsedKanji {
  viewBox: string;
  paths: string[];
}

function parseKanjiVG(raw: string): ParsedKanji | null {
  if (typeof window === "undefined") return null;
  const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) return null;
  const viewBox = svg.getAttribute("viewBox") ?? "0 0 109 109";
  const group = doc.querySelector('g[id^="kvg:StrokePaths_"]');
  if (!group) return null;
  const paths = Array.from(group.querySelectorAll("path"))
    .map((p) => p.getAttribute("d") ?? "")
    .filter(Boolean);
  return { viewBox, paths };
}

interface Props {
  char: string;
  size?: number;
  /** ms per stroke */
  strokeDuration?: number;
  /** ms gap between strokes */
  strokeGap?: number;
}

export function KanjiStrokeOrder({
  char,
  size = 140,
  strokeDuration = 650,
  strokeGap = 120,
}: Props) {
  const hex = hexFor(char);
  const raw = SVG_BY_HEX[hex];
  const parsed = useMemo(() => (raw ? parseKanjiVG(raw) : null), [raw]);
  const [playKey, setPlayKey] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // After mount, measure each path and trigger sequential animation.
  useEffect(() => {
    if (!parsed) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    parsed.paths.forEach((_, i) => {
      const el = pathRefs.current[i];
      if (!el) return;
      const len = el.getTotalLength();
      // Reset to invisible
      el.style.transition = "none";
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.opacity = "1";
      // Force reflow so the next transition applies
      void el.getBoundingClientRect();
      const delay = i * (strokeDuration + strokeGap);
      timers.push(
        setTimeout(() => {
          el.style.transition = `stroke-dashoffset ${strokeDuration}ms ease-in-out`;
          el.style.strokeDashoffset = "0";
        }, delay),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [parsed, playKey, strokeDuration, strokeGap]);

  if (!parsed) {
    // Fallback: just render the character.
    return (
      <div
        className="flex items-center justify-center bg-background border-2 border-border rounded-xl"
        style={{ width: size, height: size, fontFamily: "serif" }}
      >
        <span style={{ fontSize: size * 0.7 }}>{char}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="bg-background border-2 border-primary/40 rounded-xl overflow-hidden relative"
        style={{ width: size, height: size }}
      >
        {/* Grid guides */}
        <svg
          viewBox={parsed.viewBox}
          width={size}
          height={size}
          className="absolute inset-0"
          aria-hidden
        >
          <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" className="text-muted-foreground/40" />
          <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" className="text-muted-foreground/40" />
        </svg>
        <svg
          key={playKey}
          viewBox={parsed.viewBox}
          width={size}
          height={size}
          className="relative"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            {parsed.paths.map((d, i) => (
              <path
                key={i}
                ref={(el) => (pathRefs.current[i] = el)}
                d={d}
              />
            ))}
          </g>
        </svg>
      </div>
      <button
        type="button"
        onClick={() => setPlayKey((k) => k + 1)}
        className="text-xs px-2 py-1 rounded-md border border-border hover:border-primary hover:bg-primary/10 font-semibold"
      >
        ▶ ulangi ({parsed.paths.length} goresan)
      </button>
    </div>
  );
}
