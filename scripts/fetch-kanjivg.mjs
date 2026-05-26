#!/usr/bin/env node
// Fetch the subset of KanjiVG SVGs needed by this game.
// Source: https://github.com/KanjiVG/kanjivg (CC BY-SA 3.0)
// Run once with: bun run scripts/fetch-kanjivg.mjs
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "src/assets/kanjivg");
const SRC_FILE = resolve(ROOT, "src/game/kanji-data.ts");

const src = await readFile(SRC_FILE, "utf8");
// Extract every mk("X", ...) char arg.
const chars = Array.from(src.matchAll(/mk\("([^"]+)"/g), (m) => m[1]);
const unique = Array.from(new Set(chars));
console.log(`Found ${unique.length} unique kanji`);

await mkdir(OUT_DIR, { recursive: true });

let ok = 0, skipped = 0, failed = 0;
for (const ch of unique) {
  const cp = ch.codePointAt(0).toString(16).padStart(5, "0");
  const outPath = resolve(OUT_DIR, `${cp}.svg`);
  if (existsSync(outPath)) { skipped++; continue; }
  const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${cp}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();
    await writeFile(outPath, txt, "utf8");
    ok++;
    console.log(`  ✓ ${ch} (${cp})`);
  } catch (e) {
    failed++;
    console.warn(`  ✗ ${ch} (${cp}): ${e.message}`);
  }
}
console.log(`\nDone. fetched=${ok} skipped=${skipped} failed=${failed}`);
