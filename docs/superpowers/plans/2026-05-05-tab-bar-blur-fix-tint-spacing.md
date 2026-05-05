# Tab Bar Blur + Fix Double-Tinting + Header Spacing — Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add BlurView to bottom tab bar (matching header), fix double-tinting bug making glass too milky/opaque, and adjust header-content spacing.

**Architecture:** Use `@react-navigation/bottom-tabs`' `tabBarBackground` prop to inject BlurView behind tab bar items (no custom tab bar needed). Remove the duplicate `backgroundColor` from GlassHeader's inner View — the tint comes from a single source: `webGlassStyle()` on web, BlurView's `tint` prop on native. Reduce header bottom padding but increase content `paddingTop` for visual separation.

**Tech Stack:** React Native, expo-blur, @react-navigation/bottom-tabs (already available via expo-router)

---

### Task 1: Fix double-tinting — remove backgroundColor from inner View

**Files:**
- Modify: `curate/src/components/GlassHeader.tsx`

**Root cause:** The `inner` View has `backgroundColor: fluentGlass.tint` which stacks on top of the outer element's tint (web: from `webGlassStyle()`, native: from BlurView's `tint` prop). Reference.css `.glass-fluent` applies background and backdrop-filter on the SAME element — no child re-applies the background. This double-application makes the glass ~2x more opaque than intended.

- [ ] **Step 1: Remove backgroundColor from inner View**

Remove `backgroundColor: fluentGlass.tint` from line 28 of GlassHeader.tsx:

```tsx
// Before (line 22-28):
const inner = (
  <View
    style={{
      paddingTop: HEADER_PADDING_TOP,
      paddingBottom: HEADER_PADDING_BOTTOM,
      paddingHorizontal: HEADER_HORIZONTAL,
      backgroundColor: fluentGlass.tint,  // ← REMOVE THIS LINE
    }}
  >

// After:
const inner = (
  <View
    style={{
      paddingTop: HEADER_PADDING_TOP,
      paddingBottom: HEADER_PADDING_BOTTOM,
      paddingHorizontal: HEADER_HORIZONTAL,
    }}
  >
```

- [ ] **Step 2: Commit**

```bash
git add curate/src/components/GlassHeader.tsx
git commit -m "fix: remove double-tinting from GlassHeader inner View"
```

---

### Task 2: Add BlurView to tab bar via tabBarBackground

**Files:**
- Modify: `curate/app/(tabs)/_layout.tsx`

`@react-navigation/bottom-tabs` (v7.15.11, available via expo-router) exposes `tabBarBackground: () => React.ReactNode` in screenOptions. It renders behind tab items in an absolutely-positioned, non-interactive View. This is the ideal injection point for BlurView.

- [ ] **Step 1: Add imports and tabBarBackground to _layout.tsx**

Add imports:
```tsx
import { BlurView } from "expo-blur";
import { fluentGlass } from "../../src/lib/glass-styles";
```

Add `tabBarBackground` inside `screenOptions` (after `tabBarStyle`):

```tsx
tabBarBackground: () =>
  Platform.OS === "web" ? null : (
    <BlurView
      tint={fluentGlass.nativeTint}
      intensity={fluentGlass.nativeBlurIntensity}
      experimentalBlurMethod="dimezisBlurView"
      style={{ flex: 1, borderRadius: 100, overflow: "hidden" }}
    />
  ),
```

Change the native (default) `tabBarStyle` background to transparent since BlurView now provides the backdrop:

```tsx
default: {
  position: 'absolute',
  bottom: 24,
  left: 24,
  right: 24,
  height: 72,
  backgroundColor: 'transparent',  // was 'rgba(30,30,42,0.9)' — BlurView handles this now
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  borderRadius: 100,
  paddingBottom: 0,
  borderTopWidth: 0,
  elevation: 0,
  overflow: 'hidden',  // needed for BlurView borderRadius clipping
},
```

- [ ] **Step 2: Commit**

```bash
git add curate/app/\(tabs\)/_layout.tsx
git commit -m "feat: add BlurView to tab bar via tabBarBackground"
```

---

### Task 3: Adjust header spacing — reduce bottom padding, increase content gap

**Files:**
- Modify: `curate/src/components/GlassHeader.tsx`

**Current:** `HEADER_PADDING_BOTTOM = 24`, `GLASS_HEADER_HEIGHT = 48 + 32 + 24 = 104`. The header's visual bottom padding and the content's top padding are the same value, so the content touches the header.

**Goal:** Reduce header's own bottom padding (less visual padding inside the glass bar), but increase the gap between header bottom edge and content start.

- [ ] **Step 1: Reduce HEADER_PADDING_BOTTOM, add GAP constant**

```tsx
const HEADER_PADDING_TOP = 48;
const HEADER_PADDING_BOTTOM = 14;
const HEADER_HORIZONTAL = 20;
const HEADER_CONTENT_GAP = 16;  // extra space between header bottom and ScrollView content
export const GLASS_HEADER_HEIGHT =
  HEADER_PADDING_TOP + 32 + HEADER_PADDING_BOTTOM + HEADER_CONTENT_GAP;
// = 48 + 32 + 14 + 16 = 110 (was 104)
```

Result:
- Header visual height: 48 + 32 + 14 = 94px (10px shorter than before)
- Content starts at: 110px (6px MORE gap than before — 24→30 total gap counting header's bottom padding 14 + content gap 16)
- Content gap = HEADER_PADDING_BOTTOM (14) + HEADER_CONTENT_GAP (16) = 30px separation between header text baseline and content

- [ ] **Step 2: Commit**

```bash
git add curate/src/components/GlassHeader.tsx
git commit -m "refactor: reduce header bottom padding, increase content gap"
```

---

## Verification

1. **Web (hot reload):** 
   - Header should be less milky/opaque (single tint source now)
   - Tab bar unchanged (CSS backdropFilter already works)
   - Header-content gap increased
2. **Native iOS:** 
   - Header blur preserved, less opaque
   - Tab bar NOW shows blur via BlurView
   - Content scrolls behind both header and tab bar with visible blur
3. **Native Android:**
   - Same as iOS with `dimezisBlurView` 
   - If graphical issues on older Android, can fall back to `"none"` (tinted View, no actual blur but correct color)
