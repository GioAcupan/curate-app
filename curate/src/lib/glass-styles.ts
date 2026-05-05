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
type GlassRecipe = typeof fluentGlass | typeof defaultGlass | typeof liquidGlass;

export function webGlassStyle(
  recipe: GlassRecipe,
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

/* ── Shared glass input text field ───────────────────
   Used in: NewTrackScreen, TrackDetailScreen */
export const inputGlassStyle: ViewStyle = Platform.select({
  web: {
    backgroundColor: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 16,
    color: "#F0EFF4",
    fontSize: 16,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  } as any,
  default: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 16,
    color: "#F0EFF4",
    fontSize: 16,
  } as any,
});

/* ── Glass chip base (pill shape, glass border) ─────
   Used in: tag/topic picker chips */
export const chipGlassStyle: ViewStyle = Platform.select({
  web: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  } as any,
  default: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  } as any,
});

/* ── Segmented control container ─────────────────────
   Glass background with flex row layout for status buttons.
   Used in: TrackDetailScreen */
export const segmentedControlStyle: ViewStyle = Platform.select({
  web: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 4,
  } as any,
  default: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 4,
  } as any,
});

/* ── Brand glow shadow (matches .btn-primary) ────────
   Used on: selected chips, status buttons, "New" track button */
export const brandGlowShadow = "0 2px 10px -2px rgba(255,109,0,0.4)";
