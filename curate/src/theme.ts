export const colors = {
  brand: {
    50: "#FFF3E0",
    100: "#FFD9A8",
    200: "#FFB84D",
    300: "#FF9500",
    400: "#FF8200",
    500: "#FF6D00",
    600: "#E56200",
    700: "#BF5000",
    800: "#8C3A00",
    900: "#5C2600",
  },
  surface: {
    base: "#0A0A0F",
    "base-light": "#F5F0EB",
    card: "rgba(22,22,30,0.85)",
    "card-light": "rgba(255,255,255,0.7)",
    elevated: "rgba(30,30,42,0.9)",
    "elevated-light": "rgba(255,255,255,0.85)",
  },
  text: {
    primary: "#F0EFF4",
    "primary-light": "#1A1520",
    secondary: "rgba(240,239,244,0.6)",
    "secondary-light": "rgba(26,21,32,0.55)",
    muted: "rgba(240,239,244,0.35)",
    "muted-light": "rgba(26,21,32,0.35)",
  },
  border: {
    subtle: "rgba(255,255,255,0.06)",
    "subtle-light": "rgba(0,0,0,0.06)",
    default: "rgba(255,255,255,0.1)",
    "default-light": "rgba(0,0,0,0.1)",
    strong: "rgba(255,255,255,0.18)",
    "strong-light": "rgba(0,0,0,0.18)",
  },
  signal: {
    success: "#22C55E",
    warning: "#FBBF24",
    info: "#3B82F6",
  },
  accent: {
    glow: "rgba(255,109,0,0.15)",
    "glow-light": "rgba(255,109,0,0.12)",
  },
  glass: {
    default: "rgba(255,255,255,0.08)",
    "default-light": "rgba(255,255,255,0.7)",
    liquid: "rgba(255,255,255,0.04)",
    "liquid-light": "rgba(255,255,255,0.35)",
    fluent: "rgba(255,255,255,0.12)",
    "fluent-light": "rgba(255,255,255,0.65)",
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
} as const;

export const typography = {
  displayXl: { fontSize: 72, fontWeight: "800", lineHeight: 72, letterSpacing: -0.04 },
  displayLg: { fontSize: 48, fontWeight: "800", lineHeight: 52.8, letterSpacing: -0.03 },
  headingLg: { fontSize: 32, fontWeight: "700", lineHeight: 38.4, letterSpacing: -0.02 },
  headingMd: { fontSize: 24, fontWeight: "700", lineHeight: 31.2, letterSpacing: -0.02 },
  headingSm: { fontSize: 20, fontWeight: "700", lineHeight: 28, letterSpacing: -0.01 },
  bodyLg: { fontSize: 18, fontWeight: "400", lineHeight: 30.6 },
  bodyMd: { fontSize: 16, fontWeight: "400", lineHeight: 25.6 },
  bodySm: { fontSize: 14, fontWeight: "400", lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: "600", lineHeight: 16.8, letterSpacing: 0.06 },
  overline: { fontSize: 11, fontWeight: "700", lineHeight: 14.3, letterSpacing: 0.08 },
} as const;

export type Theme = "dark" | "light";

/** Get a theme-aware semantic color value.
 *  Usage: `themeColor(theme, "surface", "base")` returns the dark or light value.
 *  Falls back to the dark value if no light variant exists. */
export function themeColor(theme: Theme, category: keyof typeof colors, token: string): string {
  const palette = colors[category] as Record<string, string>;
  if (theme === "light") {
    const lightKey = `${token}-light`;
    return lightKey in palette ? palette[lightKey] : palette[token];
  }
  return palette[token];
}
