// Theme system — 5 themes with real-time CSS variable swap

export interface FelmarkTheme {
  id: string;
  name: string;
  desc: string;
  inspiration: string;
  // Backgrounds
  parchment: string;
  warm50: string; warm100: string; warm200: string; warm300: string; warm400: string;
  // Text
  ink900: string; ink800: string; ink700: string; ink600: string; ink500: string; ink400: string; ink300: string;
  // Panel
  panel: string; panelHover: string; panelActive: string; panelBorder: string;
  // Rail
  railBg: string; railIcon: string; railIconActive: string; railHover: string;
  // Accent
  accent: string; accentLight: string; accentBg: string;
  // Semantic
  success: string; error: string; info: string; warning: string;
}

export const DEFAULT_THEME = "ember";

const THEME_STORAGE_KEY = "felmark-theme";

export const THEMES: Record<string, FelmarkTheme> = {
  ember: {
    id: "ember",
    name: "Ember",
    desc: "Warm parchment, golden hour tones",
    inspiration: "The default — warm whites, earthy ink, amber accent",
    parchment: "#faf9f7",
    warm50: "#f7f6f3", warm100: "#f0eee9", warm200: "#e5e2db", warm300: "#d5d1c8", warm400: "#b8b3a8",
    ink900: "#2c2a25", ink800: "#3d3a33", ink700: "#4f4c44", ink600: "#65625a", ink500: "#7d7a72", ink400: "#9b988f", ink300: "#b5b2a9",
    panel: "#f2f1ed", panelHover: "#eceae5", panelActive: "#e6e4de", panelBorder: "rgba(0,0,0,0.05)",
    railBg: "#353330", railIcon: "#8a867e", railIconActive: "#c8c4bb", railHover: "rgba(255,255,255,0.06)",
    accent: "#b07d4f", accentLight: "#c89360", accentBg: "rgba(176,125,79,0.08)",
    success: "#5a9a3c", error: "#c24b38", info: "#5b7fa4", warning: "#d4a34a",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    desc: "Deep blue-black, electric blue accent",
    inspiration: "Late-night focus mode — dark navy with cool highlights",
    parchment: "#0f1219",
    warm50: "#151b27", warm100: "#1a2332", warm200: "#243044", warm300: "#2e3d56", warm400: "#3d5170",
    ink900: "#e8ecf4", ink800: "#c8d1e0", ink700: "#a8b5cc", ink600: "#8899b3", ink500: "#6b7d99", ink400: "#4f6180", ink300: "#3d5170",
    panel: "#111827", panelHover: "#1a2332", panelActive: "#1f2b3f", panelBorder: "rgba(255,255,255,0.06)",
    railBg: "#0a0e17", railIcon: "#4f6180", railIconActive: "#a8b5cc", railHover: "rgba(255,255,255,0.08)",
    accent: "#4a9eff", accentLight: "#6db3ff", accentBg: "rgba(74,158,255,0.08)",
    success: "#34d399", error: "#f87171", info: "#60a5fa", warning: "#fbbf24",
  },
  sage: {
    id: "sage",
    name: "Sage",
    desc: "Soft greens, natural calm",
    inspiration: "Forest floor — muted greens with organic warmth",
    parchment: "#f5f7f4",
    warm50: "#eef2ec", warm100: "#e3e9df", warm200: "#d4ddd0", warm300: "#c0ccba", warm400: "#a3b39b",
    ink900: "#2a3328", ink800: "#3a4637", ink700: "#4a5946", ink600: "#5d6e59", ink500: "#738570", ink400: "#8f9e8b", ink300: "#a8b5a3",
    panel: "#eaf0e8", panelHover: "#e0e8dd", panelActive: "#d6e0d2", panelBorder: "rgba(0,0,0,0.04)",
    railBg: "#2a3328", railIcon: "#738570", railIconActive: "#c0ccba", railHover: "rgba(255,255,255,0.06)",
    accent: "#5f8c5a", accentLight: "#72a36c", accentBg: "rgba(95,140,90,0.08)",
    success: "#3d9a6d", error: "#c0534f", info: "#5e89a8", warning: "#c9a84e",
  },
  clay: {
    id: "clay",
    name: "Clay",
    desc: "Terra cotta warmth, desert tones",
    inspiration: "Southwestern pottery — rich terracotta with sandy undertones",
    parchment: "#faf6f3",
    warm50: "#f5ede7", warm100: "#ede3da", warm200: "#e0d2c6", warm300: "#d1bfb0", warm400: "#bda899",
    ink900: "#33261e", ink800: "#4a382d", ink700: "#5e493d", ink600: "#755d4f", ink500: "#8d7465", ink400: "#a68d7e", ink300: "#bba69a",
    panel: "#f2ebe5", panelHover: "#ebe2da", panelActive: "#e4d9cf", panelBorder: "rgba(0,0,0,0.04)",
    railBg: "#33261e", railIcon: "#8d7465", railIconActive: "#d1bfb0", railHover: "rgba(255,255,255,0.06)",
    accent: "#c47a5a", accentLight: "#d4906e", accentBg: "rgba(196,122,90,0.08)",
    success: "#6a9a5c", error: "#c25050", info: "#6889a4", warning: "#c9a050",
  },
  frost: {
    id: "frost",
    name: "Frost",
    desc: "Cool steel, crisp violet accent",
    inspiration: "Winter morning — cool grays with a violet spark",
    parchment: "#f8f9fc",
    warm50: "#f0f2f7", warm100: "#e6e9f0", warm200: "#d5dae6", warm300: "#c0c8d8", warm400: "#a3aec4",
    ink900: "#1e2433", ink800: "#2d3548", ink700: "#3f4a5e", ink600: "#556075", ink500: "#6d788e", ink400: "#8892a6", ink300: "#a3abbb",
    panel: "#eef0f5", panelHover: "#e6e9f0", panelActive: "#dde1ea", panelBorder: "rgba(0,0,0,0.04)",
    railBg: "#1e2433", railIcon: "#6d788e", railIconActive: "#c0c8d8", railHover: "rgba(255,255,255,0.06)",
    accent: "#7c6aef", accentLight: "#9384f5", accentBg: "rgba(124,106,239,0.08)",
    success: "#36b37e", error: "#e5484d", info: "#5b8def", warning: "#e5a336",
  },
};

/**
 * Apply a theme by setting all CSS variables on :root
 */
export function applyTheme(theme: FelmarkTheme): void {
  const root = document.documentElement.style;

  // Backgrounds
  root.setProperty("--parchment", theme.parchment);
  root.setProperty("--warm-50", theme.warm50);
  root.setProperty("--warm-100", theme.warm100);
  root.setProperty("--warm-200", theme.warm200);
  root.setProperty("--warm-300", theme.warm300);
  root.setProperty("--warm-400", theme.warm400);

  // Text
  root.setProperty("--ink-900", theme.ink900);
  root.setProperty("--ink-800", theme.ink800);
  root.setProperty("--ink-700", theme.ink700);
  root.setProperty("--ink-600", theme.ink600);
  root.setProperty("--ink-500", theme.ink500);
  root.setProperty("--ink-400", theme.ink400);
  root.setProperty("--ink-300", theme.ink300);

  // Panel
  root.setProperty("--panel", theme.panel);
  root.setProperty("--panel-hover", theme.panelHover);
  root.setProperty("--panel-active", theme.panelActive);
  root.setProperty("--panel-border", theme.panelBorder);

  // Rail
  root.setProperty("--rail-bg", theme.railBg);
  root.setProperty("--rail-icon", theme.railIcon);
  root.setProperty("--rail-icon-active", theme.railIconActive);
  root.setProperty("--rail-hover", theme.railHover);

  // Accent — set BOTH --ember and --accent so all existing components work
  root.setProperty("--ember", theme.accent);
  root.setProperty("--accent", theme.accent);
  root.setProperty("--ember-light", theme.accentLight);
  root.setProperty("--accent-light", theme.accentLight);
  root.setProperty("--ember-bg", theme.accentBg);
  root.setProperty("--accent-bg", theme.accentBg);

  // Semantic
  root.setProperty("--success", theme.success);
  root.setProperty("--error", theme.error);
  root.setProperty("--info", theme.info);
  root.setProperty("--warning", theme.warning);
}

/**
 * Get the active theme ID from localStorage
 */
export function getActiveTheme(): string {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
}

/**
 * Save theme selection to localStorage
 */
export function saveTheme(themeId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, themeId);
}
