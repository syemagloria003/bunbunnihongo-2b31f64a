// Per-world visual theme. Hiragana uses "garden"; each Katakana world has its own.
export type WorldTheme =
  | "garden"
  | "crystal_cave"
  | "starry_sea"
  | "nebula_sky"
  | "snow_field"
  | "silver_ruins"
  | "comet_nest"
  | "cosmic_void"
  | "meteor_galaxy";

export interface ThemePalette {
  // sky gradient
  skyTop: string;
  skyBottom: string;
  // primary celestial / ambient light source color
  light: string;
  // back hill / silhouette tones
  farBack: string;
  farFront: string;
  // mid layer dominant accent
  midAccent: string;
  midAccent2: string;
  // foreground particle/grass color
  foreground: string;
  // ground block
  groundTop: string;
  groundBottom: string;
  groundDeco: string;
  // top-of-ground "grass" band color (set to "" to skip the band)
  cap: string;
  capDark: string;
  // floating platform
  platformTop: string;
  platformBottom: string;
  platformBolt: string;
  // coin
  coinCore: string;
  coinEdge: string;
  coinGlow: string;
  // gate frame
  gateFrame: string;
  gateInner: string;
  gateBorder: string;
  // goal building
  goalA: string;
  goalB: string;
  goalAccent: string;
  goalFlag: string;
  // enemies
  walkerA: string; // body inner
  walkerB: string; // body outer
  walkerAccent: string;
  flyerBody: string;
  flyerAccent: string;
  flyerWing: string;
  // particle palettes
  particleCoin: string;
  particleCoinSpark: string;
  walkerBurst: string;
  flyerBurst: string;
  confetti: string[];
  // optional cloud tint ("" = default white)
  cloudColor: string;
  // foreground style: "grass" | "snow" | "bubble" | "dust" | "ember" | "stardust" | "crystal" | "cloud"
  foregroundStyle: ForegroundStyle;
  // mid layer style
  midStyle: MidStyle;
  // far layer style
  farStyle: FarStyle;
  // sky light source style
  lightStyle: LightStyle;
}

export type ForegroundStyle = "grass" | "snow" | "bubble" | "dust" | "ember" | "stardust" | "crystal" | "cloud";
export type MidStyle = "flowers" | "crystals" | "jellyfish" | "nebula" | "pines" | "pillars" | "lava" | "planets";
export type FarStyle = "hills" | "stalactites" | "waves" | "floatingIslands" | "snowHills" | "ruins" | "magmaMtns" | "galaxy";
export type LightStyle = "sun" | "crystal" | "moon" | "aurora" | "paleSun" | "fog" | "comet" | "void";

export const THEMES: Record<WorldTheme, ThemePalette> = {
  garden: {
    skyTop: "#b8e3ff", skyBottom: "#ffd07a", light: "#fff6c2",
    farBack: "#a8d4b8", farFront: "#8fc4a6",
    midAccent: "#ff7aa8", midAccent2: "#ffc24a",
    foreground: "rgba(60, 130, 60, 0.5)",
    groundTop: "#a36a3a", groundBottom: "#6e4422", groundDeco: "rgba(0,0,0,0.18)",
    cap: "#8edc6a", capDark: "#4fa44a",
    platformTop: "#ffd56a", platformBottom: "#d49232", platformBolt: "#8a5a1a",
    coinCore: "#fff1a8", coinEdge: "#e8a020", coinGlow: "rgba(255,220,90,0.55)",
    gateFrame: "#5a2f12", gateInner: "rgba(255,200,60,0.85)", gateBorder: "#ffcb3a",
    goalA: "#ffce5a", goalB: "#c97a18", goalAccent: "#2a1a0a", goalFlag: "#e94e87",
    walkerA: "#8a4ca0", walkerB: "#3a1a4a", walkerAccent: "#fff",
    flyerBody: "#2a2a2a", flyerAccent: "#ff3a3a", flyerWing: "rgba(180,220,255,0.7)",
    particleCoin: "#ffd84a", particleCoinSpark: "#fff2a0",
    walkerBurst: "#7a3a9a", flyerBurst: "#666",
    confetti: ["#ffcb3a", "#ff7a3a", "#7bc46c", "#5ec1ff", "#e94e87"],
    cloudColor: "rgba(255,255,255,0.85)",
    foregroundStyle: "grass", midStyle: "flowers", farStyle: "hills", lightStyle: "sun",
  },
  crystal_cave: {
    skyTop: "#0a1a3a", skyBottom: "#1a3a6a", light: "#aef0ff",
    farBack: "#2a3a64", farFront: "#3d5a8a",
    midAccent: "#6ee8ff", midAccent2: "#ff9ae0",
    foreground: "rgba(200, 240, 255, 0.6)",
    // Ground: bright teal-cyan top → deep navy bottom for strong contrast
    groundTop: "#5fa8d8", groundBottom: "#1a2a52", groundDeco: "rgba(255,255,255,0.6)",
    // Luminous crystal-moss cap band so platforms read clearly
    cap: "#9ef4ff", capDark: "#3a82c8",
    platformTop: "#c9f4ff", platformBottom: "#2a6abf", platformBolt: "#ffffff",
    coinCore: "#ffffff", coinEdge: "#3aaadc", coinGlow: "rgba(150,235,255,0.95)",
    gateFrame: "#1a2848", gateInner: "rgba(180,240,255,0.8)", gateBorder: "#e6fbff",
    goalA: "#c8f0ff", goalB: "#2a5aaf", goalAccent: "#ffffff", goalFlag: "#ff5aa8",
    // Enemies: high-contrast vivid colors so they pop on dark cave bg
    walkerA: "#ff5ad0", walkerB: "#5a1060", walkerAccent: "#ffff80",
    flyerBody: "#ffcb3a", flyerAccent: "#ff5a3a", flyerWing: "rgba(180,240,255,0.85)",
    particleCoin: "#aef0ff", particleCoinSpark: "#ffffff",
    walkerBurst: "#ff5ad0", flyerBurst: "#ffcb3a",
    confetti: ["#aef0ff", "#ff5aa8", "#ffffff", "#6ee8ff", "#ffcb3a", "#ff9ae0"],
    cloudColor: "rgba(190,225,255,0.5)",
    foregroundStyle: "crystal", midStyle: "crystals", farStyle: "stalactites", lightStyle: "crystal",
  },
  starry_sea: {
    skyTop: "#0a0a2a", skyBottom: "#2a4a8a", light: "#fff5cc",
    farBack: "#1a2858", farFront: "#0a1838",
    midAccent: "#88c0ff", midAccent2: "#ffd8f0",
    foreground: "rgba(160, 220, 255, 0.45)",
    groundTop: "#d8c89a", groundBottom: "#8a7050", groundDeco: "rgba(255,140,180,0.6)",
    cap: "#5ec0e8", capDark: "#2a8abf",
    platformTop: "#c9a878", platformBottom: "#7a5a3a", platformBolt: "#2a2018",
    coinCore: "#fff5a0", coinEdge: "#e8c020", coinGlow: "rgba(255,235,130,0.7)",
    gateFrame: "#1a2858", gateInner: "rgba(120,180,255,0.55)", gateBorder: "#fff5cc",
    goalA: "#f5f0e0", goalB: "#3a3a6a", goalAccent: "#ff5050", goalFlag: "#fff5cc",
    walkerA: "#ff8acf", walkerB: "#9a3a7a", walkerAccent: "#fff",
    flyerBody: "#3a8acf", flyerAccent: "#fff5cc", flyerWing: "rgba(200,235,255,0.6)",
    particleCoin: "#fff5a0", particleCoinSpark: "#ffffff",
    walkerBurst: "#c45a9a", flyerBurst: "#3a6aaa",
    confetti: ["#fff5cc", "#88c0ff", "#ffd8f0", "#5ec0e8", "#ffffff"],
    cloudColor: "rgba(255,255,255,0.4)",
    foregroundStyle: "bubble", midStyle: "jellyfish", farStyle: "waves", lightStyle: "moon",
  },
  nebula_sky: {
    skyTop: "#2a1a4a", skyBottom: "#8a5ac8", light: "#ffb0ff",
    farBack: "#4a2a7a", farFront: "#6a3aa0",
    midAccent: "#ff7ae0", midAccent2: "#7ad0ff",
    foreground: "rgba(255, 180, 255, 0.35)",
    groundTop: "#6a3aa0", groundBottom: "#3a1a6a", groundDeco: "rgba(255,180,255,0.4)",
    cap: "#b889ff", capDark: "#7a5acf",
    platformTop: "#d8a8ff", platformBottom: "#5a3a9a", platformBolt: "#fff0ff",
    coinCore: "#ffd0ff", coinEdge: "#c050ff", coinGlow: "rgba(255,150,255,0.6)",
    gateFrame: "#3a1a6a", gateInner: "rgba(255,180,255,0.55)", gateBorder: "#ffb0ff",
    goalA: "#d8a8ff", goalB: "#5a2a9a", goalAccent: "#fff", goalFlag: "#7ad0ff",
    walkerA: "#ff7ae0", walkerB: "#7a2a6a", walkerAccent: "#fff",
    flyerBody: "#ffd070", flyerAccent: "#fff", flyerWing: "rgba(255,255,200,0.65)",
    particleCoin: "#ffb0ff", particleCoinSpark: "#ffffff",
    walkerBurst: "#c050a0", flyerBurst: "#ffcc40",
    confetti: ["#ffb0ff", "#7ad0ff", "#d8a8ff", "#ffd070", "#ffffff"],
    cloudColor: "rgba(200,140,240,0.45)",
    foregroundStyle: "stardust", midStyle: "nebula", farStyle: "floatingIslands", lightStyle: "aurora",
  },
  snow_field: {
    skyTop: "#e0f0ff", skyBottom: "#a0c8e8", light: "#ffffff",
    farBack: "#cfe2f4", farFront: "#a8c4e0",
    midAccent: "#2e4a3a", midAccent2: "#5a7a6a",
    foreground: "rgba(255, 255, 255, 0.75)",
    groundTop: "#f5fbff", groundBottom: "#a8c4e0", groundDeco: "rgba(120,150,180,0.35)",
    cap: "#ffffff", capDark: "#cfe2f4",
    platformTop: "#e8f4ff", platformBottom: "#7aa0c8", platformBolt: "#5a7a9a",
    coinCore: "#ffffff", coinEdge: "#7ac0e8", coinGlow: "rgba(180,220,255,0.7)",
    gateFrame: "#5a7a9a", gateInner: "rgba(230,245,255,0.85)", gateBorder: "#a8d4ef",
    goalA: "#ffffff", goalB: "#7aa0c8", goalAccent: "#2e4a3a", goalFlag: "#ff5252",
    walkerA: "#f8f8f8", walkerB: "#a8b8c8", walkerAccent: "#ff8a3a",
    flyerBody: "#dceefc", flyerAccent: "#5aa8e8", flyerWing: "rgba(180,220,255,0.7)",
    particleCoin: "#ffffff", particleCoinSpark: "#cfeaff",
    walkerBurst: "#cfd8e0", flyerBurst: "#8ac0e8",
    confetti: ["#ffffff", "#a8d4ef", "#ff5252", "#7ac0e8", "#cfe2f4"],
    cloudColor: "rgba(255,255,255,0.95)",
    foregroundStyle: "snow", midStyle: "pines", farStyle: "snowHills", lightStyle: "paleSun",
  },
  silver_ruins: {
    skyTop: "#3a3a4a", skyBottom: "#9aa0b0", light: "#cfd6e0",
    farBack: "#6a6a7a", farFront: "#4a4a5a",
    midAccent: "#8a8a9a", midAccent2: "#a8a8b8",
    foreground: "rgba(180, 180, 200, 0.45)",
    groundTop: "#7a7a8a", groundBottom: "#3a3a4a", groundDeco: "rgba(0,0,0,0.35)",
    cap: "#a8a8b8", capDark: "#6a6a7a",
    platformTop: "#b8b8c8", platformBottom: "#5a5a6a", platformBolt: "#2a2a3a",
    coinCore: "#e8e8f0", coinEdge: "#6a6a7a", coinGlow: "rgba(220,225,235,0.55)",
    gateFrame: "#2a2a3a", gateInner: "rgba(180,180,200,0.55)", gateBorder: "#cfd6e0",
    goalA: "#9aa0b0", goalB: "#3a3a4a", goalAccent: "#ffcb3a", goalFlag: "#5ec0e8",
    walkerA: "#5a5a7a", walkerB: "#2a2a3a", walkerAccent: "#ff8a3a",
    flyerBody: "#4a4a5a", flyerAccent: "#ffcb3a", flyerWing: "rgba(200,200,220,0.55)",
    particleCoin: "#cfd6e0", particleCoinSpark: "#ffffff",
    walkerBurst: "#3a3a4a", flyerBurst: "#5a5a6a",
    confetti: ["#cfd6e0", "#ffcb3a", "#5ec0e8", "#a8a8b8", "#ffffff"],
    cloudColor: "rgba(180,180,200,0.55)",
    foregroundStyle: "dust", midStyle: "pillars", farStyle: "ruins", lightStyle: "fog",
  },
  comet_nest: {
    skyTop: "#2a0a1a", skyBottom: "#e85a2a", light: "#ffd070",
    farBack: "#6a1a1a", farFront: "#3a0a14",
    midAccent: "#ff8a3a", midAccent2: "#ffcb3a",
    foreground: "rgba(255, 140, 60, 0.55)",
    groundTop: "#5a1a1a", groundBottom: "#2a0808", groundDeco: "rgba(255,180,60,0.55)",
    cap: "#ff8a3a", capDark: "#c44518",
    platformTop: "#ff8a3a", platformBottom: "#7a2a10", platformBolt: "#ffe070",
    coinCore: "#fff0a0", coinEdge: "#ff5a10", coinGlow: "rgba(255,160,60,0.8)",
    gateFrame: "#3a0a14", gateInner: "rgba(255,140,60,0.6)", gateBorder: "#ffd070",
    goalA: "#ff8a3a", goalB: "#7a1a1a", goalAccent: "#ffe070", goalFlag: "#fff0a0",
    walkerA: "#ff5a3a", walkerB: "#7a1a0a", walkerAccent: "#ffd070",
    flyerBody: "#ff8a3a", flyerAccent: "#fff0a0", flyerWing: "rgba(255,200,120,0.6)",
    particleCoin: "#ffcb3a", particleCoinSpark: "#fff0a0",
    walkerBurst: "#ff5a3a", flyerBurst: "#ff8a3a",
    confetti: ["#ffd070", "#ff5a3a", "#ff8a3a", "#fff0a0", "#c44518"],
    cloudColor: "rgba(255,140,60,0.4)",
    foregroundStyle: "ember", midStyle: "lava", farStyle: "magmaMtns", lightStyle: "comet",
  },
  cosmic_void: {
    skyTop: "#050518", skyBottom: "#2a0a4a", light: "#b889ff",
    farBack: "#1a0a3a", farFront: "#3a1a5a",
    midAccent: "#b889ff", midAccent2: "#7ad0ff",
    foreground: "rgba(220, 200, 255, 0.55)",
    groundTop: "#2a1a4a", groundBottom: "#080418", groundDeco: "rgba(255,255,255,0.5)",
    cap: "#7a4acf", capDark: "#4a2a8a",
    platformTop: "#c8a8ff", platformBottom: "#3a1a6a", platformBolt: "#ffffff",
    coinCore: "#ffffff", coinEdge: "#b889ff", coinGlow: "rgba(255,255,255,0.65)",
    gateFrame: "#080418", gateInner: "rgba(184,137,255,0.6)", gateBorder: "#ffffff",
    goalA: "#b889ff", goalB: "#2a0a4a", goalAccent: "#ffffff", goalFlag: "#ffd070",
    walkerA: "#5a2a8a", walkerB: "#0a0218", walkerAccent: "#b889ff",
    flyerBody: "#1a0a3a", flyerAccent: "#ffffff", flyerWing: "rgba(184,137,255,0.55)",
    particleCoin: "#ffffff", particleCoinSpark: "#b889ff",
    walkerBurst: "#5a2a8a", flyerBurst: "#3a1a5a",
    confetti: ["#ffffff", "#b889ff", "#7ad0ff", "#ffd070", "#ff7ae0"],
    cloudColor: "rgba(184,137,255,0.35)",
    foregroundStyle: "stardust", midStyle: "planets", farStyle: "galaxy", lightStyle: "void",
  },
  meteor_galaxy: {
    skyTop: "#02030f", skyBottom: "#1a0838", light: "#ffb070",
    farBack: "#1a1048", farFront: "#2a1860",
    midAccent: "#ff9a3a", midAccent2: "#7ad0ff",
    foreground: "rgba(255, 220, 180, 0.65)",
    // Ground: cosmic rock — warm orange crust over deep purple-black
    groundTop: "#6a3a8a", groundBottom: "#1a0828", groundDeco: "rgba(255,200,120,0.55)",
    // Glowing magma-crystal cap band
    cap: "#ff9a3a", capDark: "#c4521a",
    platformTop: "#ffce7a", platformBottom: "#4a1a6a", platformBolt: "#ffffff",
    coinCore: "#fff0a0", coinEdge: "#ff7a3a", coinGlow: "rgba(255,200,90,0.95)",
    gateFrame: "#1a0838", gateInner: "rgba(255,180,120,0.7)", gateBorder: "#ffd070",
    goalA: "#ffce7a", goalB: "#3a1060", goalAccent: "#ffffff", goalFlag: "#7ad0ff",
    // Enemies: high contrast on starfield — cyan walker, magenta flyer
    walkerA: "#3ae0ff", walkerB: "#0a3a5a", walkerAccent: "#ffffff",
    flyerBody: "#ff5ad0", flyerAccent: "#ffff80", flyerWing: "rgba(255,220,180,0.85)",
    particleCoin: "#ffd070", particleCoinSpark: "#ffffff",
    walkerBurst: "#3ae0ff", flyerBurst: "#ff5ad0",
    confetti: ["#ffd070", "#ff9a3a", "#7ad0ff", "#ff5ad0", "#ffffff", "#b889ff"],
    cloudColor: "rgba(184,137,255,0.35)",
    foregroundStyle: "stardust", midStyle: "planets", farStyle: "galaxy", lightStyle: "comet",
  },
};

export function getTheme(t: WorldTheme): ThemePalette {
  return THEMES[t] ?? THEMES.garden;
}
