# Curate — Claude Code Execution Plan

This is the operational companion to the three spec docs. It chunks the build into sessions of the right size, with a copy-paste-ready prompt for each, plus guidance on when to use plan mode and when to start fresh.

---

## How your installed skills will behave

Knowing what each one does (and when it kicks in) prevents most of the friction you'll otherwise hit.

### Superpowers (`obra/superpowers`) — auto-triggering

This is the loud one. When you tell Claude Code "build X," Superpowers' SessionStart hook has already injected its bootstrap prompt and skills will fire automatically based on what you say. Specifically:

- **`brainstorming` skill** auto-fires on vague requests. Because *you've already brainstormed* with the spec docs, you want to short-circuit this. The fix: every prompt references the spec by path. Saying *"read `docs/curate_mvp_implementation_spec.md` section 2 and implement X"* tells Superpowers the brainstorming is done.
- **`test-driven-development` skill** enforces strict RED-GREEN-REFACTOR. If Claude tries to write code before tests, the skill literally makes it delete the code. This is good — let it happen on the four pure-function modules I'll flag below. For UI screens, where TDD is more friction than value, you may need to explicitly say *"tests after, not TDD"* to override.
- **`requesting-code-review` skill** runs the code-reviewer agent between tasks. It's slow but catches real issues. Leave it on for the DB and lib sprints; turn it off for boilerplate UI sprints with `--no-review` style overrides if it gets in the way.
- **`subagent-driven-development`** spawns fresh-context agents for each task. Helpful for keeping the main session clean.
- **End of branch**: it will offer to merge / open a PR / discard. Use this — it's clean.

The slash commands are `/superpowers:brainstorm`, `/superpowers:write-plan`, `/superpowers:execute-plan`. **For Curate, you'll mostly skip these** because the spec already gives you the plan. Use `/superpowers:write-plan` only when a sprint is genuinely ambiguous and you want a structured task list.

### claude-mem (`thedotmack/claude-mem`) — fully passive

You don't have to do anything. Five lifecycle hooks (SessionStart, UserPromptSubmit, PostToolUse, Stop, SessionEnd) capture everything, compress it via the agent SDK, and inject relevant context into future sessions. Memory lives in `~/.claude-mem/claude-mem.db`.

Two things to watch:

1. **It auto-generates folder-context `CLAUDE.md` files** in your project. This can collide with the `CLAUDE.md` you write at the project root. After you write yours in Sprint 0, check that claude-mem isn't overwriting it. If it does, configure it to write to a different path or accept the merged result.
2. **Memory only kicks in after a few sessions.** Sprints 0 and 1 will feel like cold starts. By Sprint 3 it'll start auto-recalling decisions from earlier sprints, which is when it pays off.

You can manually query it mid-session with the `mem-search` skill if you need to recall what was decided in an earlier sprint.

### get-shit-done (`gsd-build`) — explicit invocation only

Unlike Superpowers, GSD only runs when you type a slash command. So having both installed is fine — they don't fight unless you invoke GSD's planning commands.

For Curate specifically:

- **Do NOT run `/gsd-new-project`** — it triggers a deep questioning workflow you don't need. Your spec already exists.
- **Optionally run `/gsd-ingest-docs` once** at the start of Sprint 0 to bootstrap a `.planning/` directory from your three existing spec docs. This gives you GSD's state-tracking goodies without re-doing the planning phase. Skip this if you don't want yet another folder of metadata in the repo.
- **Use `/gsd-quick "<task>"`** for small ad-hoc fixes that don't deserve a full sprint. It gives you GSD's atomic-commit guarantees with no ceremony.
- **Use `/gsd-resume-work`** when picking up a sprint after a long gap.
- **Use `/gsd-progress`** to ask "where am I, what's next" mid-sprint.

**My recommendation: don't `/gsd-ingest-docs` either.** Two state systems (claude-mem + GSD `.planning/`) plus your three spec docs is more bookkeeping than a single-developer project needs. Pick one. The spec docs alone, plus claude-mem in the background, is enough.

### Conflict to watch

Superpowers and GSD both have brainstorm/plan/execute patterns. **Don't run them in the same sprint.** If you invoke `/superpowers:write-plan` and then `/gsd-plan-phase`, you'll have two parallel plans drifting from each other. Pick one tool per sprint:

- Most sprints: plain Claude Code with the spec referenced + Superpowers' auto-triggers. No slash commands.
- Pure-function lib sprints (4 of them): same as above, but Superpowers' TDD will dominate.
- Genuinely ambiguous task you didn't spec: `/superpowers:write-plan` to think it through.

---

## Plan mode — when to use it

Plan mode is `Shift+Tab` twice (or `/plan` as a slash command in v2.1.0+). Claude reads but doesn't write. You approve the plan before execution starts.

**Use plan mode for:**

- The first prompt of a sprint that touches 3+ files.
- Anything involving the SQLite schema (Sprint 1) or the active-Track resolver (Sprint 9) — both have edge cases that are easy to miss.
- Calendar integration (Sprint 5). OAuth flows have many ways to go subtly wrong; you want the plan reviewed.
- Any sprint where you can't immediately picture what files will be touched.

**Skip plan mode for:**

- Sprint 0 (bootstrap) — there's nothing to plan, just commands to run.
- Trivial UI tweaks within an already-built screen.
- Single-file edits.
- Anything where Superpowers' write-plan skill is going to produce its own plan anyway.

**On Windows**, Shift+Tab has a known bug — use `Alt+M` or just type `/plan` instead.

---

## Session boundaries

The rule of thumb: **one sprint = one Claude Code session**. End every sprint with `/clear` (or just close the terminal — `claude-mem` captures the state regardless). Start the next sprint fresh.

Why: each session accumulates context. By the end of an 8-hour megasession the context is full of decision artifacts that no longer matter, and the model gets worse. claude-mem is specifically designed to make this cheap — you lose nothing by ending.

Within a sprint, you may want a fresh sub-context for an isolated chunk. Use `/clear` and rely on claude-mem to inject the recent decisions back. Or use `/superpowers:execute-plan` which spawns fresh subagents per task automatically.

---

## The sprint list

11 sprints total. Times are ballpark for someone vibe-coding with reviews — your mileage will vary.

### Sprint 0 — Bootstrap (~30–60 min)

**Goal:** repo exists, deps installed, folder structure laid out, `CLAUDE.md` written.

**Plan mode:** No.
**Session:** dedicated, fresh.
**TDD:** No.

```
This is the first session of the Curate project. Read all three docs in @docs/ — vision, MVP spec, and implementation spec — in full. Don't summarize them back to me, just confirm you've read them.

Then do the following, asking before each step:

1. Initialize a new Expo project: npx create-expo-app@latest curate -t expo-template-blank-typescript. Use TypeScript.
2. Install dependencies per implementation spec section 1: expo-sqlite, expo-auth-session, expo-secure-store, expo-notifications, expo-crypto, @tanstack/react-query, zustand, nativewind, plus tailwindcss as a devDep. Pin Expo SDK to a recent stable.
3. Set up NativeWind per its docs (tailwind.config.js, babel.config.js plugin, global.css). Define the theme palette per the implementation spec — greys, soft blues, off-whites only. Do NOT define a red token, even for errors.
4. Create the file/folder structure from implementation spec section 9, with empty placeholder files where needed. Skip src/db/, src/services/, src/lib/ contents — those come in later sprints.
5. Write a CLAUDE.md at the repo root that:
   - Points at all three docs in @docs/
   - Points at @docs/design/design.md as source of truth for theme tokens
   - Lists the load-bearing don'ts from the vision doc (no streaks, no red, no infinite scroll, no item suggestions from open web, no feed notifications, no gamification, no Track end dates) in one short list
   - States the file structure conventions
   - Has a "current sprint" line — set it to "Sprint 1 — DB foundation"
6. Verify the app boots on a device or simulator. Just the empty Expo screen is fine.
7. Commit everything as one initial commit.

Plan mode off. Just walk through it.
```

End with `/clear` and a commit.

---

### Sprint 1 — DB foundation (~90–120 min)

**Goal:** SQLite schema, all 7 tables, CRUD modules for `track`, `goal`, `goal_completion`, `source`, `track_source`, `feed_item`, `one_item_history`. Plus the `week.ts` lib.

**Plan mode:** **Yes**, for the first prompt. Schema is too important to ad-lib.
**Session:** fresh.
**TDD:** Yes, strictly. Let Superpowers run.

```
Start in plan mode (Shift+Tab twice).

Read @docs/curate_mvp_implementation_spec.md, especially sections 2 (data model), 9 (file structure), and 10 (schema absences — what NOT to add).

Plan the implementation of:
- src/db/client.ts — SQLite open, migration runner
- src/db/schema.sql — all 7 tables exactly as specified, with the CHECK constraints and indexes
- src/db/tracks.ts, goals.ts, completions.ts, sources.ts, feedItems.ts, oneItemHistory.ts — thin per-entity CRUD modules with raw SQL
- src/lib/week.ts — weekStart, weekEnd, isThisWeek, with Monday 00:00 local as start
- src/lib/ids.ts — uuid wrapper around expo-crypto
- src/types.ts — TypeScript types per the implementation spec

For each file, list its functions and their signatures. Do NOT include any column or table not in the spec — section 10 explicitly forbids streak_count, points, target_end_date, parent_track_id, milestone, etc.

After I approve the plan: TDD all of week.ts (the rolling-week boundary logic has edge cases worth pinning). For DB modules, write tests after — the test surface is too thin for TDD to be worth it. Do NOT skip tests entirely.

Run the tests. Commit when green.
```

End with `/clear`.

---

### Sprint 2 — Tracks UI (~90 min)

**Goal:** Tracks tab, create/edit screens, status toggle.

**Plan mode:** No (the screens are tightly specced).
**Session:** fresh.
**TDD:** No, tests-after for any non-trivial logic.

```
Read @docs/curate_mvp_implementation_spec.md sections 3 (screens — Tracks rows), 4.1 and 4.2 (user flows), and @docs/design/design.md.

Implement:
- app/(tabs)/tracks.tsx — list view, sectioned by status (Active / Paused / Completed)
- app/tracks/new.tsx — creation flow per 4.1 (name, tag default 'shadow', topic required if shadow, status default 'active')
- app/tracks/[id].tsx — track management with segmented status control per 4.2

Use the React Query hooks pattern from src/hooks/. Wire them to the src/db/tracks.ts module from Sprint 1.

Do NOT add deadlines, end-dates, sub-tracks, or milestones. Do NOT add a confirmation modal when toggling status — pausing is supposed to be low-friction.

Style per the calm-palette theme. No red anywhere, including on the "completed" or "paused" indicators.

Smoke-test on a device. Commit when working.
```

End with `/clear`.

---

### Sprint 3 — Goals + Completion (~120 min)

**Goal:** Goals tab, creation flow, completion modal with required description, "5 of 7" recurring display.

**Plan mode:** **Yes** — multiple screens, the completion modal is load-bearing, and the recurring-goal math is easy to get wrong.
**Session:** fresh.
**TDD:** No for screens, but TDD the "this week's count for a recurring goal" helper if it gets non-trivial.

```
Start in plan mode.

Read @docs/curate_mvp_implementation_spec.md sections 3 (Goals rows), 4.4–4.6 (user flows), and @docs/curate_mvp_spec.md section "Build order" Weekend 1.

Plan:
- app/(tabs)/goals.tsx — weekly list with This Week / All tabs, grouped by tag, recurring goals show "X of Y this week"
- app/goals/new.tsx — full creation flow per 4.4 (title, tag, Track dropdown only if shadow, recurring toggle, frequency target, reminder time field — but reminder logic comes in Sprint 7, just store it; "schedule on calendar" toggle — but calendar logic comes in Sprint 5, just store it as null for now)
- app/goals/[id].tsx — edit + completion history view
- app/completion/[goalId].tsx — non-skippable description modal per 4.6
- A helper in src/lib/ for computing "this week's completion count for a recurring goal"

Critical constraints from the spec:
- Save in the completion modal must be DISABLED until the description has non-whitespace content.
- No "are you sure" confirmation.
- "5 of 7" pattern, never "consecutive day count."
- No streak counter anywhere. Section 10 of the impl spec is the grep target.

After plan approval: implement, smoke-test, commit.
```

End with `/clear`.

---

### Sprint 4 — Batch import (~90–120 min) — recommended, not optional

**Goal:** the import screen, the JSON parser/validator, the prompt template. No calendar wiring yet (Sprint 5 adds it).

**Plan mode:** **Yes**. The conflict-handling table in spec section 11.2 has many cases.
**Session:** fresh.
**TDD:** **Strict TDD on `src/lib/importParser.ts`.** This is one of the four critical pure-function modules.

```
Start in plan mode.

Read @docs/curate_mvp_implementation_spec.md section 11 in full — schema, conflict handling, prompt text, UX, and algorithm. Also read sections 4.10 and 9 for context.

Plan:
- src/lib/importPrompt.ts — verbatim copy of the prompt from section 11.3 as a long template string
- src/lib/importParser.ts — parseAndValidate and commitImport per section 11.5. Phase 1 is the SQLite transaction; phase 2 (calendar) is stubbed for now and will be wired in Sprint 5.
- app/import.tsx — UX per 11.4 (Copy prompt button, paste textarea, live-validated preview, Import button disabled on errors)

Plan exhaustively against the conflict-handling table in 11.2: every reject case, every warning case, the case-insensitive name matching, the duplicate-in-file detection, the missing-track resolution.

After plan approval: TDD strictly on importParser.ts — write a failing test for each row of section 11.2 first, then implement to pass. Do NOT skip cases. Cover both happy path and every reject case.

Commit when all tests green and the import screen renders a real preview from a sample JSON.
```

This closes Weekend 1. End with `/clear`. Take a break — open the app, set up your real semester's Tracks, do an actual import. The next sprint depends on the app being usable.

---

### Sprint 5 — Google OAuth + Calendar API (~90 min)

**Goal:** sign-in flow, read today's events, create event with `extendedProperties.private.curateGoalId`. Wire calendar phase 2 of the importer.

**Plan mode:** **Yes**. OAuth flows misfire in many ways and you want the plan reviewed.
**Session:** fresh.
**TDD:** No (services have a thin testing surface — manual test against the live API).

```
Start in plan mode.

Read @docs/curate_mvp_implementation_spec.md section 1 (Calendar / OAuth setup), section 4.4 step 7 (calendar event shape), section 4.7 (brief reads today's events), and section 11.5 phase 2 (importer schedules events).

Plan:
- src/services/googleAuth.ts — OAuth via expo-auth-session, refresh tokens stored in expo-secure-store
- src/services/googleCalendar.ts — listTodayEvents(), createEvent(eventData, curateGoalId) returning the event ID, with extendedProperties.private.curateGoalId stamped on every event
- src/hooks/useTodaysEvents.ts — React Query hook
- app/settings.tsx — "Connect Google Calendar" button, status display, sign-out
- Wire phase 2 of importer in src/lib/importParser.ts: for each scheduled goal, create the event(s) per 11.5. Recurring goals create one weekly-recurring event PER selected day-of-week, all stamped with the same curateGoalId. The first event ID is stored in goal.scheduled_event_id.

I need a Google OAuth client ID in the Google Cloud Console with the Calendar API enabled. Walk me through that setup before we touch code.

After plan approval and OAuth setup: implement. Manual test by signing in, listing events, creating a test event, then re-running an import that includes a 'schedule' field.

Do NOT cache calendar events in SQLite. They live in React Query's in-memory cache only.

Commit when working end-to-end.
```

End with `/clear`.

---

### Sprint 6 — Daily brief + bad-week mode (~120 min)

**Goal:** the home tab, with all four sections (yesterday's wins / today's plan / today's schedule / one item placeholder) and the explicit "you're done" end state. Plus `lib/badweek.ts` and the one-thing-today layout.

**Plan mode:** **Yes**. The brief is the soul of the app.
**Session:** fresh.
**TDD:** **Strict TDD on `src/lib/badweek.ts`.** Critical pure-function module #2.

```
Start in plan mode.

Read @docs/curate_mvp_implementation_spec.md sections 3 (Brief screen normal + bad-week variants), 4.7 and 4.8 (user flows for both modes), and 5 (bad-week detection — the rolling 7 days, threshold 2, 14-day grace period).

Also re-read the don'ts in @docs/curate_vision_and_roadmap.md and section 10 of the impl spec.

Plan:
- src/lib/badweek.ts — isBadWeek() with the rolling 7-day window, threshold 2, plus the 14-day grace period using a 'meta' table or AsyncStorage for first_track_created_at
- app/(tabs)/brief.tsx — the default surface, with all sections in order: yesterday's wins (auto-built from prior day's goal_completion descriptions), today's plan (from goals + their Track names), today's schedule (from useTodaysEvents), one item PLACEHOLDER (real impl is Sprint 10), and the EndStateCard component
- src/components/EndStateCard.tsx — the "You're done — see you tomorrow" floor of the brief. NO "open feed" CTA. NO "what's next." Dead-end.
- A bad-week branch in brief.tsx that hides everything else and shows the one-thing-today layout (today's first goal by reminder time, else most recently created active goal). NO "you missed X days" copy, NO motivational text.
- "Yesterday" boundary: calendar date, not rolling 24h (decisions log #5).

TDD badweek.ts first — write failing tests for: empty DB, 0 completions in 7 days, 1 completion (still bad week), 2 completions (not bad week), exactly 7 days ago boundary, brand-new user inside grace period, brand-new user past grace period.

Then implement the brief screen.

Smoke-test by toggling between the two modes (mark some completions, mark fewer, observe the brief flip).

Commit when both modes render correctly.
```

End with `/clear`.

---

### Sprint 7 — Notifications (~60 min)

**Goal:** per-goal local notifications, suppression on already-completed goals.

**Plan mode:** No (small, well-specced).
**Session:** fresh, but short.
**TDD:** No.

```
Read @docs/curate_mvp_implementation_spec.md section 8 in full.

Implement:
- src/services/notifications.ts — schedule, refreshFor(goalId), cancelAll
- Hook into goal create/update: when reminder_time is set, schedule per the rules in section 8
- Hook into goal_completion insert: refreshFor(goalId) which suppresses notifications for goals already met this week or today
- A weekly Sunday 23:59 re-eval (use a stored timestamp + check on app open since RN background tasks are limited)

Notification copy is exactly per section 8: title = goal.title, body = Track name if shadow else empty. NO emoji. NO encouragement. NO streak references. The notifications service file should physically lack any function that could fire a feed notification, "you're behind," or "X-day streak."

Test: create a goal with a reminder time 2 minutes from now, observe the notification, complete the goal, observe future notifications cancelled.

Commit when working.
```

This closes Weekend 2. End with `/clear`. Use the app for a few days before Sprint 8 — the brief + calendar integration is the part most worth user-testing on yourself.

---

### Sprint 8 — Sources + YouTube ingestion (~120 min)

**Goal:** Source CRUD, YouTube playlist parser/fetcher, source ↔ Track many-to-many UI.

**Plan mode:** Yes (the many-to-many wiring is the kind of thing that gets implemented wrong on the first pass).
**Session:** fresh.
**TDD:** No (manual tests against the YouTube API are more useful than mocked unit tests here).

```
Start in plan mode.

Read @docs/curate_mvp_implementation_spec.md section 1 (YouTube API), section 2 (source and track_source schemas — already created in Sprint 1), section 3 (sources/new screen), section 4.3 (add source flow), and section 9 (file structure).

Plan:
- src/services/youtube.ts — parsePlaylistUrl(url) → playlistId, fetchPlaylistMeta(id), fetchPlaylistItems(id) populating feed_item rows
- app/sources/new.tsx — paste URL, preview (title, channel, item count), multi-select Track attachments (at least one required)
- A "manage sources" view inside app/tracks/[id].tsx — list attached sources with detach option
- Caching: feed_item rows store fetched data with a last_synced_at; refresh on pull-to-refresh in Sprint 9 if older than 24h.

I need a YouTube Data API v3 key from Google Cloud Console. Walk me through restricting it to the YouTube Data API + my app's package name. Store it via Expo's extra config, not in source.

After plan approval and key setup: implement. Manual test by adding 2-3 real playlists from my actual study sources.

Commit when working.
```

End with `/clear`.

---

### Sprint 9 — Feed + active Track resolver (~120 min)

**Goal:** feed tab, three modes (auto-detected via calendar, all-active-Tracks, manual override), header chip, hard 20-item cap.

**Plan mode:** **Yes**. The active Track resolver is critical pure-function module #3 and the three modes have subtle differences.
**Session:** fresh.
**TDD:** **Strict TDD on `src/lib/activeTrack.ts`.**

```
Start in plan mode.

Read @docs/curate_mvp_implementation_spec.md section 7 in full — both the resolver algorithm and the three filter modes. Also re-read 4.9 (session navigation flow) and the relevant don'ts: feed is never the default surface, no infinite scroll, hard 20-item cap, paused/completed Tracks contribute zero items.

Plan:
- src/lib/activeTrack.ts — resolveActiveTrack(now, todaysEvents) per section 7's resolver algorithm. Returns Track | null.
- src/stores/feedOverride.ts — Zustand store for manual Track override, cleared on tab change
- app/(tabs)/feed.tsx — three queries (Mode 1, 2, 3) per the SQL in section 7, header chip showing context, dead-end card at the bottom (no "load more")
- Pull-to-refresh: re-fetch from YouTube for sources whose last_synced_at > 24h, then re-run the query

TDD activeTrack.ts first. Write failing tests for: no events today, event in progress with no goalId, event in progress with goalId for a non-shadow goal (returns null), event with goalId for a shadow goal whose Track is paused (returns null), event with goalId for a shadow goal with active Track (returns it), multiple in-progress events (returns the latest-started one).

Then build the feed screen. Verify all three modes by manually overriding the calendar event in progress.

Final check: navigate to feed during a non-shadow event — should fall through to all-active-Tracks mode. Tap the chip, pick a specific Track, navigate away, come back — override should be cleared.

Commit when all three modes work.
```

This closes Weekend 3. End with `/clear`.

---

### Sprint 10 — One item picker + brief integration (~60–90 min)

**Goal:** `oneItem.ts` rotation algorithm, `one_item_history` write-back, slot it into the brief.

**Plan mode:** No (small, fully specced).
**Session:** fresh, but short.
**TDD:** **Strict TDD on `src/lib/oneItem.ts`.** This is critical pure-function module #4.

```
Read @docs/curate_mvp_implementation_spec.md section 6 in full — the algorithm and edge cases.

TDD src/lib/oneItem.ts first. Write failing tests for:
- No active Tracks → returns null
- One active Track, never surfaced → returns an item from it, writes one_item_history
- Multiple active Tracks, all never surfaced → returns from any, deterministically pickable
- Multiple active Tracks, all surfaced → returns from the one with oldest last_surfaced_at
- Active Track with no sources → skip to next
- All active Tracks have no sources → returns null
- Sources exist but feed_item table empty → returns null (do not block on sync)

Implement to pass. Use uniform random for item selection within the chosen Track (no published_at bias yet).

Then wire it into app/(tabs)/brief.tsx in the section between "today's schedule" and the EndStateCard. ONE item, never a list.

Smoke-test the brief over multiple days (or by manually advancing one_item_history.last_surfaced_at) to confirm rotation.

Commit when working.
```

This closes Weekend 4. The MVP is now functional end-to-end.

---

## After the MVP

**Don't immediately start v2.** The vision doc explicitly says: use the MVP for 1–2 months before adding anything. The whole architecture of the spec depends on this — features added before the data justifies them poison the design.

If something breaks in real use:

- Use `/gsd-quick "<the bug>"` for small fixes — gives you atomic commits without sprint ceremony.
- For something that needs design thought, use `/superpowers:brainstorm` — this is what it's for.

If you want to revisit a decision: `mem-search` (the claude-mem skill) lets you search past sessions for "why did we decide X."

---

## Common pitfalls per sprint, in one place

- **Sprint 0:** claude-mem auto-generating a `CLAUDE.md` that overwrites yours. Check after first session.
- **Sprint 1:** Adding columns the spec forbids. Section 10 of the impl spec is your grep target. If Claude Code suggests `streak_count`, refuse without explanation.
- **Sprint 3:** The completion-modal Save button being enabled on whitespace-only input. Test with a single space character.
- **Sprint 4:** The case-insensitive name matching missing the trim step. Test with `" Linear Algebra "` vs `"linear algebra"`.
- **Sprint 5:** Forgetting `extendedProperties.private.curateGoalId` on event creation. The whole resolver depends on it.
- **Sprint 6:** Adding a "you missed X days" banner because it "feels helpful." Don't.
- **Sprint 6:** Streaming the brief into the feed at the bottom. The end state is the floor; nothing flows past it.
- **Sprint 8:** Storing the YouTube API key in source. It goes in Expo's `extra` config.
- **Sprint 9:** Mode 2's SQL forgetting to filter on `t.status = 'active'`. Paused Tracks will then contribute items and you won't notice for weeks.
- **Sprint 10:** Picking the same Track two days in a row because the history update happens before the pick instead of after. Order matters.

Good luck. The spec is unusually thorough for a vibe-coded project, which means you'll feel the pull to ad-lib past it. Don't. The discipline is the product.
