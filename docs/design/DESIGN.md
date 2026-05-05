---
version: "1.0"
name: "Gio Brand Design System"
description: "A reusable glassmorphism design system built around the Blaze orange palette, Dawn gradients, grain textures, and edge-lit glass cards. Designed for dark-first with full light mode support."
---

# Gio Brand Design System

## Overview

A premium glassmorphism design system for personal projects. Dark-first, with a warm Blaze orange brand color, Dawn gradient accents, mesh-gradient backgrounds, grain texture, and edge-lit glass surfaces.

**Composition cues:**
- Layout: Flex / CSS Grid
- Content Width: Constrained (max 1400px) with full-bleed backgrounds
- Framing: Glass-first surfaces
- Shape Language: Pill / Capsule (100px radius)
- Motion: Moderate, interface-led

---

## Colors

### Brand — Blaze Orange

The primary palette is a vivid, electric orange. High energy, tech-forward.

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `--brand-50`       | `#FFF3E0` | Tinted backgrounds, hover fills (light)  |
| `--brand-100`      | `#FFD9A8` | Light accent backgrounds                 |
| `--brand-200`      | `#FFB84D` | Subtle highlights, progress bars         |
| `--brand-300`      | `#FF9500` | Secondary accents, icons                 |
| `--brand-400`      | `#FF8200` | Hover states on primary                  |
| `--brand-500`      | `#FF6D00` | **Primary brand color** — buttons, links, focus rings |
| `--brand-600`      | `#E56200` | Pressed/active states                    |
| `--brand-700`      | `#BF5000` | Dark accent, borders in light mode       |
| `--brand-800`      | `#8C3A00` | Deep accent, text on light backgrounds   |
| `--brand-900`      | `#5C2600` | Darkest — sparingly for contrast         |

### Semantic Colors

| Token               | Dark Mode                        | Light Mode                        |
|----------------------|----------------------------------|-----------------------------------|
| `--bg-base`          | `#0A0A0F`                        | `#F5F0EB`                         |
| `--bg-surface`       | `rgba(22,22,30,0.85)`            | `rgba(255,255,255,0.7)`           |
| `--bg-elevated`      | `rgba(30,30,42,0.9)`             | `rgba(255,255,255,0.85)`          |
| `--text-primary`     | `#F0EFF4`                        | `#1A1520`                         |
| `--text-secondary`   | `rgba(240,239,244,0.6)`          | `rgba(26,21,32,0.55)`            |
| `--text-muted`       | `rgba(240,239,244,0.35)`         | `rgba(26,21,32,0.35)`            |
| `--border-subtle`    | `rgba(255,255,255,0.06)`         | `rgba(0,0,0,0.06)`               |
| `--border-default`   | `rgba(255,255,255,0.1)`          | `rgba(0,0,0,0.1)`                |
| `--border-strong`    | `rgba(255,255,255,0.18)`         | `rgba(0,0,0,0.18)`               |
| `--accent-glow`      | `rgba(255,109,0,0.15)`           | `rgba(255,109,0,0.12)`           |

### Signal Colors

| Token              | Value       | Usage                  |
|--------------------|-------------|------------------------|
| `--signal-success` | `#22C55E`   | Positive states        |
| `--signal-warning` | `#FBBF24`   | Caution states         |
| `--signal-error`   | `#EF4444`   | Destructive/error      |
| `--signal-info`    | `#3B82F6`   | Informational          |

---

## Gradients

### Dawn (Primary Gradient)

Gold → Orange → Pink. Used for accent elements, hero treatments, badges, and decorative bars.

```css
/* Standard */
background: linear-gradient(135deg, #FBBF24, #F97316, #EC4899);

/* Horizontal */
background: linear-gradient(90deg, #FBBF24, #F97316, #EC4899);

/* Vertical */
background: linear-gradient(180deg, #FBBF24, #F97316, #EC4899);
```

**Usage:** Gradient text, accent bars, selected state borders, hero backgrounds, badge fills.

### Mesh Background

Multi-hue ambient glow on the base color. Creates depth and dimension.

```css
/* Dark mode */
background:
  radial-gradient(ellipse at 20% 50%, rgba(26,15,0,0.8) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(15,10,26,0.7) 0%, transparent 50%),
  radial-gradient(ellipse at 50% 80%, rgba(10,15,26,0.6) 0%, transparent 50%),
  #0A0A0F;

/* Light mode */
background:
  radial-gradient(ellipse at 20% 50%, rgba(255,160,50,0.12) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(200,140,240,0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 50% 80%, rgba(100,180,255,0.08) 0%, transparent 50%),
  #F5F0EB;
```

---

## Grain Texture

A subtle film grain overlay on all pages for tactile depth. Applied as a fixed, full-viewport pseudo-element.

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
  background-repeat: repeat;
  background-size: 200px;
  mix-blend-mode: overlay;
}
```

**Rules:**
- Always present on every page
- `z-index: 9999` so it sits above all content
- `pointer-events: none` so it never blocks interaction
- `opacity: 0.035` — subtle enough to not interfere with readability

---

## Typography

### Font: Plus Jakarta Sans

Single-family system. Versatile, geometric, modern. All weights from 300–800.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

--font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
```

### Type Scale

| Token           | Size    | Weight | Line Height | Letter Spacing | Usage                    |
|-----------------|---------|--------|-------------|----------------|--------------------------|
| `display-xl`    | 72px    | 800    | 1.0         | -0.04em        | Hero headlines           |
| `display-lg`    | 48px    | 800    | 1.1         | -0.03em        | Section titles           |
| `heading-lg`    | 32px    | 700    | 1.2         | -0.02em        | Card titles, h2          |
| `heading-md`    | 24px    | 700    | 1.3         | -0.02em        | Sub-headings, h3         |
| `heading-sm`    | 20px    | 700    | 1.4         | -0.01em        | Small headings, h4       |
| `body-lg`       | 18px    | 400    | 1.7         | 0              | Lead paragraphs          |
| `body-md`       | 16px    | 400    | 1.6         | 0              | Default body text        |
| `body-sm`       | 14px    | 400    | 1.5         | 0              | Secondary text, captions |
| `caption`       | 12px    | 600    | 1.4         | 0.06em         | Labels, metadata (uppercase) |
| `overline`      | 11px    | 700    | 1.3         | 0.08em         | Section badges (uppercase) |

### Gradient Text (Display)

For hero and display-level headings, apply the Dawn gradient:

```css
.gradient-text {
  background: linear-gradient(135deg, #FBBF24, #F97316, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Surfaces — Glass System

Three glass recipes carried from the Polaris reference, adapted to the Blaze palette.

### polaris-glass-default

Standard frosted glass. Good for primary content cards, dashboards, sidebars.

```css
.polaris-glass-default {
  background: rgba(255, 255, 255, 0.08);  /* dark */
  /*          rgba(255, 255, 255, 0.7);       light */
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 10px 25px -5px rgba(255,109,0,0.06),
    0 8px 10px -6px rgba(0,0,0,0.1);
  border-radius: 24px;
}
```

### polaris-glass-liquid

iOS-style thin refractive glass with diagonal specular streak. For floating elements, modals, tooltips.

```css
.polaris-glass-liquid {
  position: relative;
  background: rgba(255, 255, 255, 0.04);  /* dark */
  backdrop-filter: blur(40px) saturate(1.8);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px -8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  border-radius: 24px;
  overflow: hidden;
  isolation: isolate;
}

/* Diagonal specular streak */
.polaris-glass-liquid::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.3) 0%,
    rgba(255,255,255,0) 35%,
    rgba(255,255,255,0) 65%,
    rgba(255,255,255,0.15) 100%
  );
  mix-blend-mode: screen;
  z-index: 0;
}

.polaris-glass-liquid > * {
  position: relative;
  z-index: 1;
}
```

### polaris-glass-fluent

Windows 11-style milky acrylic. For navigation, toolbars, panels.

```css
.polaris-glass-fluent {
  background: rgba(255, 255, 255, 0.12);  /* dark */
  backdrop-filter: blur(30px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 4px 16px -4px rgba(0,0,0,0.2);
  border-radius: 24px;
}
```

---

## Edge Lighting

Two edge lighting treatments for cards:

### Top Highlight (Default — Desktop)

A single bright specular line across the top edge. Appears on hover.

```css
.edge-top-highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255,255,255,0.5) 30%,
    rgba(255,255,255,0.8) 50%,
    rgba(255,255,255,0.5) 70%,
    transparent
  );
  opacity: 0;
  transition: opacity 250ms;
}

.edge-top-highlight:hover::before {
  opacity: 1;
}
```

### Full Border Glow (Mobile / Always-On)

Soft orange glow around the entire border. Used when hover is unavailable (touch devices) or for emphasis.

```css
.edge-full-glow {
  border-color: rgba(255, 109, 0, 0.25);
  box-shadow:
    0 0 20px -4px rgba(255,109,0,0.15),
    inset 0 0 20px -10px rgba(255,109,0,0.08);
}
```

**Responsive strategy:**
- Desktop: Top Highlight on hover
- Mobile (`max-width: 768px`): Full Border Glow always-on for key cards

---

## Components

### Shape Language: Pill / Capsule

All interactive components use `border-radius: 100px` (full pill). This creates a bold, distinctive, modern aesthetic.

### Buttons

```css
/* Primary — filled */
.btn-primary {
  padding: 12px 28px;
  border-radius: 100px;
  border: none;
  background: var(--brand-500);  /* #FF6D00 */
  color: white;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 2px 10px -2px rgba(255,109,0,0.4);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px -4px rgba(255,109,0,0.5);
}

/* Secondary — outlined */
.btn-secondary {
  padding: 12px 28px;
  border-radius: 100px;
  border: 1px solid var(--brand-500);
  background: transparent;
  color: var(--brand-500);
  font-weight: 600;
}
.btn-secondary:hover {
  background: var(--accent-glow);
}

/* Ghost — minimal */
.btn-ghost {
  padding: 12px 28px;
  border-radius: 100px;
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--text-secondary);
  font-weight: 500;
}
.btn-ghost:hover {
  color: var(--text-primary);
  background: var(--glass-bg);
}

/* Gradient — premium CTA */
.btn-gradient {
  padding: 12px 28px;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #FBBF24, #F97316, #EC4899);
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 20px -4px rgba(249,115,22,0.4);
}
```

### Badges

```css
.badge {
  padding: 4px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge-filled    { background: var(--brand-500); color: white; }
.badge-outline   { border: 1px solid var(--brand-500); color: var(--brand-500); background: transparent; }
.badge-subtle    { background: var(--accent-glow); color: var(--brand-500); }
.badge-gradient  { background: linear-gradient(135deg,#FBBF24,#F97316,#EC4899); color: white; }
```

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 24px;
  border-radius: 100px;
  border: 1px solid var(--border-default);
  background: var(--input-bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  transition: all 150ms;
}
.input:focus {
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px var(--accent-glow);
  outline: none;
}
```

---

## Spacing

| Token          | Value  | Usage                          |
|----------------|--------|--------------------------------|
| `--space-1`    | 4px    | Tight gaps, icon padding       |
| `--space-2`    | 8px    | Inline spacing, badge padding  |
| `--space-3`    | 12px   | Component internal padding     |
| `--space-4`    | 16px   | Default gap                    |
| `--space-5`    | 20px   | Card internal padding          |
| `--space-6`    | 24px   | Section sub-gaps               |
| `--space-8`    | 32px   | Card padding, section headers  |
| `--space-10`   | 40px   | Page margins                   |
| `--space-12`   | 48px   | Section vertical spacing       |
| `--space-16`   | 64px   | Major section breaks           |
| `--space-20`   | 80px   | Hero/footer spacing            |

---

## Border Radius

| Token            | Value    | Usage                        |
|------------------|----------|------------------------------|
| `--radius-sm`    | 8px      | Small inner elements         |
| `--radius-md`    | 12px     | Inputs (textarea), tooltips  |
| `--radius-lg`    | 16px     | Inner cards, nested surfaces |
| `--radius-xl`    | 24px     | Primary cards, glass panels  |
| `--radius-pill`  | 100px    | Buttons, badges, chips       |

---

## Motion

| Property            | Value                                  | Usage                        |
|---------------------|----------------------------------------|------------------------------|
| `--transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)`  | Hover, focus, micro states   |
| `--transition-default` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` | Panel transitions, toggles |
| `--transition-smooth` | `400ms cubic-bezier(0.16, 1, 0.3, 1)` | Card lifts, page enters    |

**Hover patterns:**
- Buttons: `translateY(-1px)` + enhanced shadow
- Cards: `translateY(-4px)` + border brighten + edge light appear
- Links/text: color transition only

---

## Do's and Don'ts

### Do
- Use the Blaze palette as the sole brand accent
- Apply grain overlay on every page
- Use pill radius for all interactive elements
- Keep glass surfaces consistent — pick from the three recipes
- Use Dawn gradient for premium/CTA moments
- Apply Top Highlight on desktop, Full Border Glow on mobile

### Don't
- Don't introduce additional accent hues outside signal colors
- Don't mix border-radius styles (no mixing pill + sharp on same level)
- Don't use flat/opaque cards — always use a glass recipe
- Don't exceed moderate motion — no spring physics or > 500ms animations
- Don't apply grain at opacity > 0.05 — it should be felt, not seen
- Don't use the Dawn gradient for large background fills — it's an accent

---

## File Structure (Recommended)

```
design-system/
├── DESIGN.md              # This file
├── tokens/
│   ├── colors.css         # Color custom properties
│   ├── typography.css     # Font imports + type scale
│   ├── spacing.css        # Spacing + radius tokens
│   └── motion.css         # Transition tokens
├── surfaces/
│   ├── glass.css          # Three glass recipes
│   ├── edge-lighting.css  # Top Highlight + Full Glow
│   ├── grain.css          # Grain overlay
│   └── mesh-bg.css        # Mesh gradient backgrounds
├── components/
│   ├── buttons.css        # All button variants
│   ├── badges.css         # Badge variants
│   ├── inputs.css         # Form controls
│   └── cards.css          # Card compositions
└── hero.html              # Reference hero page
```
