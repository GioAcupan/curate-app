# Curate

## Docs (source of truth)

- `docs/curate_vision_and_roadmap.md` — vision, user profile, constraints, don'ts
- `docs/curate_mvp_spec.md` — MVP scope, build order, design rules, acceptance criteria
- `docs/curate_mvp_implementation_spec.md` — implementation details, schema, screen list, file structure
- `docs/design/design.md` — theme tokens, glass system, palette, typography (source of truth for all styling)

## Load-bearing don'ts (from vision doc)

- No infinite scroll — brief and feed have hard end states
- No streaks or broken-chain visuals — use "5 of 7" patterns
- No red color anywhere — palette is greys, soft blues, off-whites
- No item suggestions from the open web — user-approved sources only
- No feed notifications — ever
- No feed as default surface — always reached intentionally
- No gamification — no badges, XP, levels, progress bars
- No Track end dates in MVP — status-only (active/paused/completed)

## File structure conventions

```
app/          — Expo Router screens (file-based routing)
src/db/       — SQLite client + CRUD per entity
src/services/ — External API wrappers (Google Calendar, YouTube, auth, notifications)
src/lib/      — Pure logic (week math, bad-week detection, one-item algorithm, import parser)
src/components/ — Shared UI components
src/hooks/    — React Query wrappers
src/stores/   — Zustand stores (UI state only)
src/theme.ts  — Color/spacing/typography tokens
src/types.ts  — TypeScript types mirroring the DB schema
assets/       — Static assets (images, fonts)
```

## Current sprint

Sprint 1 — DB foundation
