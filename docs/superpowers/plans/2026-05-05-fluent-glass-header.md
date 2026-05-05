# Fluent Glass Header & Tab Bar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace liquid glass (0.04 opacity) with fluent acrylic glass (0.12 opacity, blur 30px saturate 1.5) on both GlassHeader and bottom tab bar, matching the `glass-fluent` recipe from the design reference. Make content scroll behind the header with proper z-index layering.

**Architecture:** Update GlassHeader to fluent glass material + absolute positioning so it overlays content. Update tab bar to fluent glass. Adjust all tab screen ScrollViews with `paddingTop` equal to header height so content isn't hidden behind the absolutely-positioned header.

**Tech Stack:** React Native, Expo Router, NativeWind, Platform.select for web/mobile

**Reference:** `.glass-fluent` from `docs/design/reference.css:89` — `bg: rgba(255,255,255,0.12)`, `blur: 30px saturate(1.5)`, `border: 1px rgba(255,255,255,0.15)`, `shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px -4px rgba(0,0,0,0.2)`

---

### Task 1: Update GlassHeader to fluent glass + absolute positioning

**Files:**
- Modify: `curate/src/components/GlassHeader.tsx`

- [ ] **Step 1: Replace liquid glass with fluent glass, add absolute positioning**

Replace the entire file:

```tsx
import { View, Text, Platform } from "react-native";

type Props = {
  title: string;
  rightElement?: React.ReactNode;
};

const HEADER_PADDING_TOP = 48; // pt-12
const HEADER_PADDING_BOTTOM = 16; // pb-4
const HEADER_HORIZONTAL = 20; // px-5
// Approximate: pt-12 + heading-md lineHeight + pb-4
export const GLASS_HEADER_HEIGHT = 96;

export function GlassHeader({ title, rightElement }: Props) {
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={
        isWeb
          ? {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(30px) saturate(1.5)",
              WebkitBackdropFilter: "blur(30px) saturate(1.5)",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.15)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px -4px rgba(0,0,0,0.2)",
            }
          : {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: "rgba(40,40,54,0.95)",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.1)",
            }
      }
    >
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingTop: HEADER_PADDING_TOP,
          paddingBottom: HEADER_PADDING_BOTTOM,
          paddingHorizontal: HEADER_HORIZONTAL,
        }}
      >
        <Text className="text-text-primary text-heading-md">{title}</Text>
        {rightElement}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add curate/src/components/GlassHeader.tsx
git commit -m "feat: switch GlassHeader to fluent glass with absolute positioning"
```

---

### Task 2: Update tab bar to fluent glass

**Files:**
- Modify: `curate/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Replace liquid glass with fluent glass in tab bar web style**

The tab bar style object is at lines 24-44 of `_layout.tsx`. Replace the web block (lines 25-44) with fluent glass values:

Change:
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
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.2)',
            borderRadius: 100,
            boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            paddingBottom: 0,
            borderTopWidth: 0,
            elevation: 0,
          } as any,
```

To:
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
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(30px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
            borderRadius: 100,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px -4px rgba(0,0,0,0.2)',
            paddingBottom: 0,
            borderTopWidth: 0,
            elevation: 0,
          } as any,
```

- [ ] **Step 2: Commit**

```bash
git add curate/app/\(tabs\)/_layout.tsx
git commit -m "feat: switch tab bar from liquid to fluent acrylic glass"
```

---

### Task 3: Adjust tab screens for scroll-behind header

**Files:**
- Modify: `curate/app/(tabs)/tracks.tsx`
- Modify: `curate/app/(tabs)/brief.tsx`
- Modify: `curate/app/(tabs)/goals.tsx`
- Modify: `curate/app/(tabs)/feed.tsx`

Since GlassHeader is now `position: absolute`, it's out of document flow. The ScrollView (or content View) needs `paddingTop` matching `GLASS_HEADER_HEIGHT` so content starts below the header, but can scroll up behind it.

- [ ] **Step 1: Update tracks.tsx ScrollView padding**

The ScrollView on line 146 currently has `contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}`. Import `GLASS_HEADER_HEIGHT` and use it:

Add import (after existing GlassHeader import):
```tsx
import { GlassHeader, GLASS_HEADER_HEIGHT } from "../../src/components/GlassHeader";
```

Change the ScrollView's `contentContainerStyle`:
```tsx
contentContainerStyle={{ paddingBottom: 100, paddingTop: GLASS_HEADER_HEIGHT }}
```

(Remove the separate `paddingTop: 16` — the header height constant already includes the spacing.)

- [ ] **Step 2: Update brief.tsx, goals.tsx, feed.tsx**

Each placeholder tab currently has:
```tsx
<View className="flex-1 items-center justify-center">
```

The `GlassHeader` is absolute now, so the View fills the entire container (which is correct — the header overlays it). But the centered content will be centered in the full container, including behind the header. To keep visual centering in the visible area below the header, add `paddingTop`:

brief.tsx:
```tsx
import { View, Text } from "react-native";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { GlassHeader, GLASS_HEADER_HEIGHT } from "../../src/components/GlassHeader";

export default function BriefScreen() {
  return (
    <ScreenContainer>
      <GlassHeader title="Brief" />
      <View
        className="flex-1 items-center justify-center"
        style={{ paddingTop: GLASS_HEADER_HEIGHT }}
      >
        <Text className="text-text-primary text-heading-md">Brief</Text>
      </View>
    </ScreenContainer>
  );
}
```

Same pattern for goals.tsx (title "Goals") and feed.tsx (title "Feed").

- [ ] **Step 3: Commit**

```bash
git add curate/app/\(tabs\)/tracks.tsx curate/app/\(tabs\)/brief.tsx curate/app/\(tabs\)/goals.tsx curate/app/\(tabs\)/feed.tsx
git commit -m "feat: add scroll-behind support with GlassHeader absolute positioning"
```

---

## Verification

1. **Hot reload:** Changes reflect immediately on Expo web dev server — no manual reload needed
2. **Glass quality:** Both header and tab bar should look like frosted acrylic (milky, more opaque, smoother blur) — matching the reference `glass-fluent` appearance
3. **Scroll-behind:** On Tracks tab with enough items, scroll down — content should visibly pass behind the translucent header with the blur effect distorting it
4. **All tabs:** Switch between Brief, Goals, Tracks, Feed — each shows the same fluent glass header
5. **Tab bar:** Bottom nav should also have the fluent acrylic treatment, consistent with the header
6. **No regressions:** The `+ New` button on Tracks tab still works, loading/error states still display correctly
