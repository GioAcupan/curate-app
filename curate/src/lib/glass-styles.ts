import { Platform, type ViewStyle } from "react-native";

/* ── Matches reference.css .glass-fluent (line 89) ────────
   bg: rgba(255,255,255,0.12)
   blur: 30px saturate 1.5
   border: 1px solid rgba(255,255,255,0.15)
   shadow: inset 0 1px 0 rgba(255,255,255,0.12),
           0 4px 16px -4px rgba(0,0,0,0.2) */
export const fluentGlass = {
  tint: "rgba(255,255,255,0.12)" as const,
  blur: 30,
  saturation: 1.5,
  nativeBlurIntensity: 50,
  nativeTint: "systemThinMaterialDark" as const,
  border: {
    web: {
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.15)",
    },
    native: {
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
  },
  shadow: {
    web: "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px -4px rgba(0,0,0,0.2)",
    native: undefined as string | undefined,
  },
};

/* ── Matches reference.css .glass-default (line 85) ───────
   bg: rgba(255,255,255,0.08)
   blur: 24px
   border: 1px solid rgba(255,255,255,0.12)
   shadow: 0 10px 25px -5px rgba(255,109,0,0.06),
           0 8px 10px -6px rgba(0,0,0,0.1) */
export const defaultGlass = {
  tint: "rgba(255,255,255,0.08)" as const,
  blur: 24,
  saturation: undefined as number | undefined,
  nativeBlurIntensity: 20,
  nativeTint: "systemThinMaterialDark" as const,
  border: {
    web: {
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },
    native: {
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
    },
  },
  shadow: {
    web: "0 10px 25px -5px rgba(255,109,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.1)",
    native: undefined as string | undefined,
  },
};

/* ── Matches reference.css .glass-liquid (line 86-87) ─────
   bg: rgba(255,255,255,0.04)
   blur: 40px saturate 1.8
   border: 0.5px solid rgba(255,255,255,0.2)
   shadow: 0 8px 32px -8px rgba(0,0,0,0.3),
           inset 0 1px 0 rgba(255,255,255,0.1) */
export const liquidGlass = {
  tint: "rgba(255,255,255,0.04)" as const,
  blur: 40,
  saturation: 1.8,
  nativeBlurIntensity: 40,
  nativeTint: "systemThinMaterialDark" as const,
  border: {
    web: {
      borderWidth: 0.5,
      borderColor: "rgba(255,255,255,0.2)",
    },
    native: {
      borderWidth: 0.5,
      borderColor: "rgba(255,255,255,0.2)",
    },
  },
  shadow: {
    web: "0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
    native: undefined as string | undefined,
  },
};

/* ── Helper: build web-only style props from a glass recipe ── */
export function webGlassStyle(
  recipe: typeof fluentGlass,
): ViewStyle {
  const filter = recipe.saturation
    ? `blur(${recipe.blur}px) saturate(${recipe.saturation})`
    : `blur(${recipe.blur}px)`;

  return {
    backgroundColor: recipe.tint,
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
    ...recipe.border.web,
    boxShadow: recipe.shadow.web,
  } as any;
}

/* ── Pre-built Platform.select style objects ── */

export const fluentGlassStyle: ViewStyle = Platform.select({
  web: webGlassStyle(fluentGlass) as any,
  default: {
    backgroundColor: fluentGlass.tint,
    ...fluentGlass.border.native,
  },
});

export const defaultGlassStyle: ViewStyle = Platform.select({
  web: webGlassStyle(defaultGlass) as any,
  default: {
    backgroundColor: defaultGlass.tint,
    ...defaultGlass.border.native,
  },
});

export const liquidGlassStyle: ViewStyle = Platform.select({
  web: webGlassStyle(liquidGlass) as any,
  default: {
    backgroundColor: liquidGlass.tint,
    ...liquidGlass.border.native,
  },
});
