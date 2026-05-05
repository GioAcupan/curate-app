# Style Foundation Bootstrap Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the conflict between CLAUDE.md's "no red" rule and DESIGN.md's Blaze orange brand, establish DESIGN.md as the single styling source of truth, and add missing light-mode tokens so the entire token stack is coherent before Sprint 1 starts.

**Architecture:** Three-layer token system: DESIGN.md (canonical spec) → tailwind.config.js (utility layer for NativeWind) → src/theme.ts (JS runtime layer for dynamic styles). CLAUDE.md's styling rules must reference DESIGN.md rather than duplicate/contradict it. The MVP spec's "no red marks" rule (about punishment colors for missed goals) is preserved but scoped correctly — it does not ban the brand orange.

**Tech Stack:** NativeWind v4 (Tailwind v3), Expo, React Native, TypeScript

---

## File Structure

**Modified:**
- `curate/CLAUDE.md` — fix "load-bearing don'ts" to match DESIGN.md (keep orange, scope "no red" to punishment states per MVP spec)
- `curate/tailwind.config.js` — add light-mode semantic token overrides (from reference.css)
- `curate/src/theme.ts` — add light-mode variant for colors

**Unchanged (already correct):**
- `curate/tailwind.config.js` — dark-mode brand/surface/text/border tokens already match DESIGN.md
- `curate/src/theme.ts` — dark-mode tokens already match DESIGN.md
- `docs/design/DESIGN.md` — remains the canonical source of truth
- `docs/curate_mvp_spec.md` — its "no red marks" rule is about punishment and is already correct

---

### Task 1: Fix CLAUDE.md Styling Rules

**Files:**
- Modify: `curate/CLAUDE.md:17` (the "No red color anywhere" bullet)

**Problem:** Line 17 says "No red color anywhere — palette is greys, soft blues, off-whites" which directly contradicts DESIGN.md's Blaze orange brand (#FF6D00). The actual rule from the MVP spec is "No red marks" — meaning don't use red as a punishment/negative color for incomplete goals. The brand orange is fine.

- [ ] **Step 1: Read current CLAUDE.md to confirm exact text**

Run: `head -25 curate/CLAUDE.md`
Expected: Shows the "No red color anywhere" bullet at around line 17.

- [ ] **Step 2: Replace the conflicting bullet**

Replace the offending line with:

```
- No red color used for negative/punishment states — incomplete goals use neutral styling (per MVP spec §2). Brand orange (#FF6D00 per DESIGN.md) is the primary accent and is used freely.
```

Edit `curate/CLAUDE.md` — replace the old "No red color anywhere" line.

- [ ] **Step 3: Verify the fix**

Run: `grep -n "red\|orange\|brand\|palette" curate/CLAUDE.md`
Expected: Shows the corrected bullet with orange brand rule, no contradictory "no red anywhere" language.

- [ ] **Step 4: Commit**

```bash
git add curate/CLAUDE.md
git commit -m "fix: resolve CLAUDE.md styling conflict with DESIGN.md

CLAUDE.md said 'No red color anywhere — palette is greys, soft blues,
off-whites' but DESIGN.md (the declared styling source of truth) uses
Blaze orange (#FF6D00) as the primary brand. Scoped the 'no red' rule
to punishment states per MVP spec §2."
```

---

### Task 2: Add Light-Mode Semantic Tokens to Tailwind Config

**Files:**
- Modify: `curate/tailwind.config.js`
- Reference: `docs/design/reference.css:16-24` (light mode values)

**Problem:** The Tailwind config only defines dark-mode values for `surface`, `text`, and `border` tokens. DESIGN.md specifies both dark and light mode values for these semantic tokens. Without light-mode values, NativeWind can only render the dark palette.

- [ ] **Step 1: Read current tailwind.config.js**

Run: `cat -n curate/tailwind.config.js`
Expected: Shows 53 lines with dark-only surface/text/border/brand/signal colors.

- [ ] **Step 2: Convert surface/text/border to dark/light variants**

Replace the flat color definitions for `surface`, `text`, `border` with dark-mode-first variants. NativeWind supports the `:dark` prefix via Tailwind's `darkMode: "class"` (or "media"), but since these are custom semantic tokens, we define both variants directly.

Edit `curate/tailwind.config.js` — change the `colors` section so `surface`, `text`, and `border` use the `DEFAULT` (dark) + `light` pattern:

```js
// Replace the existing surface, text, border blocks with:
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
```

Leave `brand` and `signal` unchanged (they're absolute colors, not theme-dependent).

- [ ] **Step 3: Add accent-glow and glass-surface tokens**

Add to the `colors` block in tailwind.config.js:

```js
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
```

- [ ] **Step 4: Verify the config is valid**

```bash
cd curate && npx tailwindcss --config tailwind.config.js -i global.css -o /dev/null --dry-run 2>&1
```

Expected: No errors. If tailwindcss CLI doesn't support `--dry-run`, verify with Node: `node -e "require('./tailwind.config.js')"`. Expected: no output (no errors).

- [ ] **Step 5: Commit**

```bash
git add curate/tailwind.config.js
git commit -m "feat: add light-mode tokens to Tailwind config

Adds light-mode variants for surface, text, border, accent-glow, and
glass tokens from DESIGN.md / reference.css. Brand and signal colors
are theme-independent and unchanged."
```

---

### Task 3: Add Light-Mode Tokens to src/theme.ts

**Files:**
- Modify: `curate/src/theme.ts`

**Problem:** `src/theme.ts` only exports a flat `colors` object with dark-mode values. The app needs runtime access to both themes (for dynamic styles, gradients, etc.). We need to export both variants.

- [ ] **Step 1: Read current src/theme.ts**

Run: `cat -n curate/src/theme.ts`
Expected: Shows 69 lines with `export const colors` (dark-only) + spacing, radii, typography.

- [ ] **Step 2: Update colors export to include both themes**

Replace the `colors` export with a theme-aware structure:

```ts
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
```

Leave `spacing`, `radii`, `typography` unchanged (they're already complete).

- [ ] **Step 3: Add a helper type for theme-aware color access**

Add to the end of `src/theme.ts`:

```ts
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
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd curate && npx tsc --noEmit --pretty 2>&1 | head -20
```

Expected: No type errors. (The theme.ts changes are additive and don't break existing imports.)

- [ ] **Step 5: Commit**

```bash
git add curate/src/theme.ts
git commit -m "feat: add light-mode tokens and themeColor helper to theme.ts

Adds light-mode variants for surface, text, border, accent, and glass
colors to match DESIGN.md spec. Exports themeColor() helper for runtime
theme-aware color resolution."
```

---

### Self-Review

**1. Spec coverage:**
- DESIGN.md styling tokens (brand, surface, text, border, signal, glass, accent): Covered — Task 2 adds to tailwind config, Task 3 adds to theme.ts.
- DESIGN.md "no red" clarification: Covered — Task 1 updates CLAUDE.md.
- Light mode from reference.css: Covered — Tasks 2 and 3 use the reference.css light values.

**2. Placeholder scan:** No placeholders — all code blocks contain full implementations.

**3. Type consistency:** `themeColor` signature matches the `colors` const shape. The `Token` pattern (`"base"` → looks for `"base-light"`) is consistent across all semantic categories. The `"accent"` and `"glass"` categories are new but follow the same naming convention as `surface`/`text`/`border`.
