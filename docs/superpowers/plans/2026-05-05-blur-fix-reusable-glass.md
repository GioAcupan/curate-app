# Blur Fix + Reusable Glass Styles — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix blur not working on native mobile (backdropFilter is web-only — need expo-blur's BlurView), extract glass recipes from reference.css into reusable shared style constants, and add spacing between header and content.

**Architecture:** Install `expo-blur` for native `BlurView` support. Create `src/lib/glass-styles.ts` with three exported glass recipes (`fluentGlass`, `defaultGlass`, `liquidGlass`) matching reference.css exactly — web uses `backdropFilter` + `boxShadow`, native uses `BlurView` component with tinted overlay. Update GlassHeader and tab bar to use shared styles. Update track cards to use shared default glass.

**Tech Stack:** React Native, Expo, expo-blur, NativeWind, Platform.select

**Reference:** `docs/design/reference.css` lines 85-89 for exact glass recipes

---

### Task 1: Install expo-blur

**Files:**
- Modify: `curate/package.json`

- [ ] **Step 1: Install expo-blur**

```bash
npx expo install expo-blur
```

Run from `C:\Users\gbacu\Documents\Gio Files\PROGRAMMING\PROJECTS\Curate\curate-app\curate\`

Expected: `expo-blur` added to package.json dependencies.

- [ ] **Step 2: Commit**

```bash
git add curate/package.json curate/package-lock.json
git commit -m "deps: add expo-blur for native blur support"
```

---

### Task 2: Create shared glass style constants

**Files:**
- Create: `curate/src/lib/glass-styles.ts`

- [ ] **Step 1: Write glass-styles.ts**

Each recipe matches reference.css exactly for web, uses BlurView-compatible tints for native.

```ts
import { Platform, type ViewStyle } from "react-native";

/* ── Matches reference.css .glass-fluent (line 89) ────────
   bg: rgba(255,255,255,0.12)
   blur: 30px saturate 1.5
   border: 1px solid rgba(255,255,255,0.15)
   shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px -4px rgba(0,0,0,0.2) */
export const fluentGlass = {
  tint: "rgba(255,255,255,0.12)" as const,
  blur: 30,
  saturation: 1.5,
  nativeBlurIntensity: 30,
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
    native: undefined,
  },
};

/* ── Matches reference.css .glass-default (line 85) ───────
   bg: rgba(255,255,255,0.08)
   blur: 24px
   border: 1px solid rgba(255,255,255,0.12)
   shadow: 0 10px 25px -5px rgba(255,109,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.1) */
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
    native: undefined,
  },
};

/* ── Matches reference.css .glass-liquid (line 86-87) ─────
   bg: rgba(255,255,255,0.04)
   blur: 40px saturate 1.8
   border: 0.5px solid rgba(255,255,255,0.2)
   shadow: 0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) */
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
    native: undefined,
  },
};

/* ── Helper: build the web-only style props for a glass recipe ── */
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
```

- [ ] **Step 2: Commit**

```bash
git add curate/src/lib/glass-styles.ts
git commit -m "feat: add reusable glass style constants matching reference.css"
```

---

### Task 3: Update GlassHeader with BlurView + shared styles

**Files:**
- Modify: `curate/src/components/GlassHeader.tsx`

- [ ] **Step 1: Rewrite GlassHeader to use BlurView on native + shared fluent style**

```tsx
import { View, Text, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { fluentGlass, webGlassStyle } from "../lib/glass-styles";

type Props = {
  title: string;
  rightElement?: React.ReactNode;
};

const HEADER_PADDING_TOP = 48;
const HEADER_PADDING_BOTTOM = 24;
const HEADER_HORIZONTAL = 20;
export const GLASS_HEADER_HEIGHT =
  HEADER_PADDING_TOP + 32 + HEADER_PADDING_BOTTOM;

export function GlassHeader({ title, rightElement }: Props) {
  const isWeb = Platform.OS === "web";

  const inner = (
    <View
      style={{
        paddingTop: HEADER_PADDING_TOP,
        paddingBottom: HEADER_PADDING_BOTTOM,
        paddingHorizontal: HEADER_HORIZONTAL,
        backgroundColor: fluentGlass.tint,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-text-primary text-heading-md">{title}</Text>
        {rightElement}
      </View>
    </View>
  );

  if (isWeb) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          ...webGlassStyle(fluentGlass),
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }}
      >
        {inner}
      </View>
    );
  }

  return (
    <BlurView
      intensity={fluentGlass.nativeBlurIntensity}
      tint={fluentGlass.nativeTint}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderBottomWidth: fluentGlass.border.native.borderWidth,
        borderBottomColor: fluentGlass.border.native.borderColor,
      }}
    >
      {inner}
    </BlurView>
  );
}
```

Key changes:
- `expo-blur`'s `BlurView` on native provides actual blur (fixes the "no blur on mobile" bug)
- Uses `webGlassStyle(fluentGlass)` helper for web styles
- `HEADER_PADDING_BOTTOM` increased from 16 → 24 for more header-content spacing
- Native now has `BlurView` with `intensity={30}` and `tint="systemThinMaterialDark"` for actual blurring

- [ ] **Step 2: Commit**

```bash
git add curate/src/components/GlassHeader.tsx
git commit -m "feat: add BlurView native blur to GlassHeader, use shared fluent glass styles"
```

---

### Task 4: Update tab bar to use shared fluent glass style

**Files:**
- Modify: `curate/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Import fluentGlass and use values in tab bar style**

Add import at top:
```tsx
import { fluentGlass } from "../../src/lib/glass-styles";
```

Replace the web tab bar style object to use the shared constants:
```tsx
web: {
  position: 'absolute',
  bottom: 24,
  left: 0,
  right: 0,
  marginHorizontal: 'auto',
  width: '100%',
  maxWidth: 400,
  height: 72,
  backgroundColor: fluentGlass.tint,
  backdropFilter: `blur(${fluentGlass.blur}px) saturate(${fluentGlass.saturation})`,
  WebkitBackdropFilter: `blur(${fluentGlass.blur}px) saturate(${fluentGlass.saturation})`,
  borderWidth: fluentGlass.border.web.borderWidth,
  borderColor: fluentGlass.border.web.borderColor,
  borderRadius: 100,
  boxShadow: fluentGlass.shadow.web,
  paddingBottom: 0,
  borderTopWidth: 0,
  elevation: 0,
} as any,
```

- [ ] **Step 2: Commit**

```bash
git add curate/app/\(tabs\)/_layout.tsx
git commit -m "refactor: use shared fluent glass constants in tab bar"
```

---

### Task 5: Update tracks.tsx cards to use shared default glass style

**Files:**
- Modify: `curate/app/(tabs)/tracks.tsx`

- [ ] **Step 1: Replace inline glass card styles with shared constants**

Add imports:
```tsx
import { defaultGlass, webGlassStyle } from "../../src/lib/glass-styles";
```

Replace `glassCard` style (lines 42-63) with:
```tsx
const glassCard: any = WEB
  ? {
      ...webGlassStyle(defaultGlass),
      borderRadius: 24,
      padding: 20,
      marginBottom: 12,
      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    }
  : {
      backgroundColor: defaultGlass.tint,
      ...defaultGlass.border.native,
      borderRadius: 24,
      padding: 20,
      marginBottom: 12,
    };
```

Replace `glassEmpty` style (lines 75-92) with:
```tsx
const glassEmpty: any = WEB
  ? {
      ...webGlassStyle(defaultGlass),
      borderRadius: 24,
      padding: 48,
      alignItems: "center",
    }
  : {
      backgroundColor: defaultGlass.tint,
      ...defaultGlass.border.native,
      borderRadius: 24,
      padding: 48,
      alignItems: "center",
    };
```

Keep `glassCardActiveExtra` and `btnNewStyle` as-is (they're orange glow overlays, not glass recipes).

- [ ] **Step 2: Commit**

```bash
git add curate/app/\(tabs\)/tracks.tsx
git commit -m "refactor: use shared default glass constants for track cards"
```

---

## Verification

1. **Web:** Hot reload reflects immediately. Header and tab bar still show blur (backdropFilter is CSS), now using shared constants.
2. **Native mobile (Expo Go):** This is the critical test — header should NOW show actual blur effect via `BlurView`. Content scrolling behind the header should be visibly blurred.
3. **Spacing:** Header bottom padding increased from 16→24px, content has more breathing room below header.
4. **Consistency:** Fluent glass values are identical between header, tab bar, and glass-styles.ts source of truth.
5. **Cards:** Track cards render identically but now reference shared default glass.
6. **Tab bar blur (native limitation):** Tab bar uses Expo Router's built-in Tabs which doesn't support custom BlurView injection — blur works on web (CSS backdropFilter), native tab bar will show fluent tint without blur. This is acceptable for now; custom tab bar is future work.
