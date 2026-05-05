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
    card: "rgba(22,22,30,0.85)",
    elevated: "rgba(30,30,42,0.9)",
  },
  text: {
    primary: "#F0EFF4",
    secondary: "rgba(240,239,244,0.6)",
    muted: "rgba(240,239,244,0.35)",
  },
  border: {
    subtle: "rgba(255,255,255,0.06)",
    default: "rgba(255,255,255,0.1)",
    strong: "rgba(255,255,255,0.18)",
  },
  signal: {
    success: "#22C55E",
    warning: "#FBBF24",
    info: "#3B82F6",
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
