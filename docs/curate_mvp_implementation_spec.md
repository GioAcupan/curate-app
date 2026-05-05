# Curate — MVP Implementation Spec

This is the build-side companion to `curate_mvp_spec.md` and `curate_vision_and_roadmap.md`. Every decision below is downstream of those two — when in doubt, the don'ts in the vision doc win.

The spec is structured so Weekend 1 (Tracks + goal tracker) is fully buildable from sections 1, 2, the relevant subsets of 3 and 4, plus the file structure. You don't need to commit to the Weekend 4 details yet.

---

## 1. Tech stack

### Framework: Expo (React Native)

**Why:** Cross-platform (Android now, iOS when the iPad arrives) with one codebase, biggest LLM training footprint of any mobile framework (which matters for vibe-coding), and EAS Build means you can ship iOS later without owning a Mac. Expo Router gives you file-based routing so the screen → URL mapping stays obvious.

**Alternatives considered:**
- **Flutter** — Dart has thinner LLM coverage than TS/JS; harder to vibe-code.
- **PWA** — iOS Web Push is flaky and requires "Add to Home Screen"; you'd lose half the notification feature when you move to iPad. Also makes Google OAuth more annoying.
- **Native (Kotlin + Swift)** — doubles the work for a single-user app. Hard pass.

**Pin Expo SDK to a recent stable** (53+ at time of writing) and don't bump it mid-build.

### Local storage: SQLite via `expo-sqlite`

**Why:** Your data is genuinely relational — Tracks, Goals, Sources, plus a join table for the Source↔Track many-to-many. A JSON file works for Weekend 1 but you'd outgrow it by Weekend 3. SQLite is built into Expo, queries are easy to vibe-code, and backup is "copy the .db file."

**No ORM.** For a 7-table schema, Drizzle/Prisma/etc. add ceremony you don't need. Write raw SQL in thin per-entity modules (`src/db/tracks.ts`, etc.).

### Calendar: Google Calendar API (read + write) via OAuth

**Why:** You said you want write access. Google Calendar's API supports both read (events for the brief) and write (creating events when you schedule a goal). Use `expo-auth-session` for OAuth — it handles the redirect flow on Android and iOS without extra native code.

**Caching:** Don't persist calendar events in SQLite. Fetch the day's events fresh on app open and hold them in memory (React Query cache). Calendar is the source of truth; mirroring it in SQLite is a sync problem you don't need.

**Curate-created events** get `extendedProperties.private.curateGoalId = <goal_id>` so you can identify them on read-back. This is the link between the Goal table and the calendar event — see the auto-detected-session logic in section 7.

### YouTube Data API v3

**Why:** Public API key, no OAuth, no login. Sufficient for `playlistItems.list` which is all you need.

- Quota: 10,000 units/day default. `playlistItems.list` costs 1 unit. You will not get close to the limit.
- Cache playlist contents in SQLite with `last_synced_at`. Refresh stale playlists (>24h old) lazily when the feed opens, or on pull-to-refresh.
- Get the API key from Google Cloud Console, restrict it to YouTube Data API v3 + your app's package name.

### State + data fetching

- **React Query (`@tanstack/react-query`)** for anything that crosses a network or DB boundary (calendar, YouTube, SQLite reads). Handles caching, refetch, loading states.
- **Zustand** for small global UI state (e.g., currently overridden active Track). Don't reach for Redux.

### Styling

**NativeWind** (Tailwind for React Native — plain Tailwind doesn't run in RN, you need this wrapper). Configure the theme in `tailwind.config.js` with only the calm palette (greys, soft blues, off-whites). Don't define a red token; if it's not in the config, no one can accidentally use it. Don't pull in a UI kit (NativeBase, Tamagui, etc.) — they push their own visual language and you need full control of the no-red, no-urgency palette.

### Notifications

`expo-notifications` for local notifications only. You don't need a push server — every notification in MVP is scheduled locally from a goal reminder time.

### Auth & secrets

- Google OAuth client ID: stored as an Expo `extra` config, not in source.
- YouTube API key: same.
- Google OAuth tokens (after sign-in): `expo-secure-store`.

---

## 2. Data model

SQLite schema. All `id` columns are `TEXT` storing UUIDs (use `expo-crypto`'s `randomUUID`) — easier to reason about than autoincrement when you ever export/import.

### Enums (stored as TEXT, validated in app code)

```
Tag:    'academic' | 'shadow' | 'extracurricular' | 'work'
Topic:  'math' | 'software-engineering' | 'theoretical-cs'   -- shadow only
Status: 'active' | 'paused' | 'completed'
GoalStatus:    'active' | 'archived'
SourceType:    'youtube_playlist'    -- only one in MVP, but keep the column
```

### Tables

```sql
CREATE TABLE track (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  tag         TEXT NOT NULL,                  -- usually 'shadow'
  topic       TEXT,                           -- NOT NULL when tag='shadow'
  status      TEXT NOT NULL DEFAULT 'active', -- active | paused | completed
  created_at  TEXT NOT NULL,                  -- ISO 8601
  updated_at  TEXT NOT NULL,
  CHECK (tag != 'shadow' OR topic IS NOT NULL)
);

CREATE TABLE goal (
  id                 TEXT PRIMARY KEY,
  title              TEXT NOT NULL,
  tag                TEXT NOT NULL,
  track_id           TEXT REFERENCES track(id),  -- NOT NULL when tag='shadow'
  is_recurring       INTEGER NOT NULL,           -- 0 or 1
  frequency_target   INTEGER NOT NULL DEFAULT 1, -- 3 for "3x/week", 1 for one-offs
  reminder_time      TEXT,                       -- 'HH:MM' local, optional
  scheduled_event_id TEXT,                       -- Google Calendar event id, optional
  status             TEXT NOT NULL DEFAULT 'active',
  created_at         TEXT NOT NULL,
  archived_at        TEXT,
  CHECK (tag != 'shadow' OR track_id IS NOT NULL)
);

CREATE TABLE goal_completion (
  id            TEXT PRIMARY KEY,
  goal_id       TEXT NOT NULL REFERENCES goal(id) ON DELETE CASCADE,
  completed_at  TEXT NOT NULL,                  -- ISO 8601
  description   TEXT NOT NULL,                  -- non-empty, validated in app
  CHECK (length(trim(description)) > 0)
);
CREATE INDEX idx_completion_goal_time ON goal_completion(goal_id, completed_at);
CREATE INDEX idx_completion_time ON goal_completion(completed_at);

CREATE TABLE source (
  id              TEXT PRIMARY KEY,
  type            TEXT NOT NULL,                  -- 'youtube_playlist'
  external_id     TEXT NOT NULL,                  -- YouTube playlist ID
  title           TEXT NOT NULL,
  channel_name    TEXT,
  added_at        TEXT NOT NULL,
  last_synced_at  TEXT,
  UNIQUE(type, external_id)
);

CREATE TABLE track_source (
  track_id   TEXT NOT NULL REFERENCES track(id) ON DELETE CASCADE,
  source_id  TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE,
  added_at   TEXT NOT NULL,
  PRIMARY KEY (track_id, source_id)
);

CREATE TABLE feed_item (
  id             TEXT PRIMARY KEY,               -- composite: source_id + ':' + video_id
  source_id      TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE,
  external_id    TEXT NOT NULL,                  -- YouTube video ID
  title          TEXT NOT NULL,
  channel_name   TEXT,
  thumbnail_url  TEXT,
  position       INTEGER,                        -- position in playlist
  published_at   TEXT,
  fetched_at     TEXT NOT NULL
);
CREATE INDEX idx_feed_item_source ON feed_item(source_id);

CREATE TABLE one_item_history (
  -- tracks the last time each Track was used to source the daily 'one item'
  track_id        TEXT PRIMARY KEY REFERENCES track(id) ON DELETE CASCADE,
  last_surfaced_at TEXT NOT NULL,
  last_item_id     TEXT
);
```

**Notes on the schema:**

- **No `streak` column. No `points` column. No `time_in_app` column.** This is a load-bearing absence — it's the schema's way of refusing to ever build those features.
- **No `target_end_date` on `track`**. Explicit don't from the vision doc.
- **No `milestone` table**. Don't even create the empty table "for v2."
- **`goal.scheduled_event_id`** ties a goal to a Google Calendar event you created. This is what makes auto-detected sessions work (section 7).
- **`is_recurring` + `frequency_target`** confirms your model: one goal record = one weekly intention. "Exercise 3×/week" is `is_recurring=1, frequency_target=3` and you log 3 separate completions against it. One-offs are `is_recurring=0, frequency_target=1`.
- **Week boundary** is computed in app code (`src/lib/week.ts`), not stored. Use Monday 00:00 local time as the start. All "this week" queries are date-range filters on `goal_completion.completed_at`.

### TypeScript types (mirroring the schema)

```ts
type Tag = 'academic' | 'shadow' | 'extracurricular' | 'work';
type Topic = 'math' | 'software-engineering' | 'theoretical-cs';
type TrackStatus = 'active' | 'paused' | 'completed';

type Track = {
  id: string; name: string; tag: Tag; topic: Topic | null;
  status: TrackStatus; createdAt: string; updatedAt: string;
};

type Goal = {
  id: string; title: string; tag: Tag; trackId: string | null;
  isRecurring: boolean; frequencyTarget: number;
  reminderTime: string | null; scheduledEventId: string | null;
  status: 'active' | 'archived'; createdAt: string; archivedAt: string | null;
};

type GoalCompletion = {
  id: string; goalId: string; completedAt: string; description: string;
};

type Source = {
  id: string; type: 'youtube_playlist'; externalId: string;
  title: string; channelName: string | null;
  addedAt: string; lastSyncedAt: string | null;
};

type FeedItem = {
  id: string; sourceId: string; externalId: string; title: string;
  channelName: string | null; thumbnailUrl: string | null;
  position: number | null; publishedAt: string | null; fetchedAt: string;
};
```

---

## 3. Screens

Expo Router structure. Brief is the home tab and the default landing on launch.

| Route | Purpose | Contents | Actions |
|---|---|---|---|
| `/(tabs)/brief` | **Home, default surface.** Daily ritual with explicit end. | Yesterday's wins → Today's plan → Today's schedule → One item → "You're done" card | Mark goal complete, tap event/item to expand, tap one item to open YouTube |
| `/(tabs)/brief` *(bad-week mode)* | One-thing-today variant of the brief | Single goal, no commentary | Mark complete, that's it |
| `/(tabs)/goals` | Weekly goal list | Tabs: This Week / All. Grouped by tag. Recurring goals show "2 of 3 this week." | Add goal, tap to complete, tap to edit |
| `/goals/new` | Goal creation flow | Title, tag picker, Track dropdown (only if shadow), recurring toggle, frequency target, reminder time, "schedule on calendar" toggle | Save |
| `/goals/[id]` | Goal detail / edit | Same fields as new + completion history with descriptions | Edit, archive, complete |
| `/goals/[id]/complete` | Completion modal | Description textarea (non-skippable, min 1 char trimmed) | Save completion |
| `/(tabs)/tracks` | Track list | Active / Paused / Completed sections | Add Track, tap to manage |
| `/tracks/new` | Track creation | Name, tag (default shadow), topic (required if shadow), status (default active) | Save |
| `/tracks/[id]` | Track management | Name, status toggle, attached sources list, goals filed under this Track (read-only summary) | Edit, change status, attach/detach sources |
| `/(tabs)/feed` | Context-aware feed | Fixed-length item list. Header chip shows current Track context. | Tap item (opens YouTube), pull to refresh, tap chip to override Track context |
| `/sources/new` | Add a YouTube playlist | Paste URL or playlist ID, multi-select Tracks to attach to | Save |
| `/import` | Batch import Tracks + goals from JSON | Copy-prompt button, paste-JSON textarea, live preview of what will be created | Validate, import (single transaction) |
| `/settings` | Calendar connection, API key, reminders default | Sign in with Google, sign out, re-sync | — |

### "You're done" end state

Below the one item, a single card:

> **You're done — see you tomorrow.**

No "open feed" button. No "what's next." The card is the floor of the brief. If the user wants the feed they navigate to it on purpose via the tab bar.

### Bad-week brief

Replaces the entire brief content (yesterday's wins / today's plan / schedule / one item are all hidden). Shows:

> **One thing today.**
>
> [Goal title]
>
> [Track name, if shadow]
>
> [Mark complete]

No "you've missed X days." No "let's get back on track." No motivational copy. Silence is the feature.

---

## 4. User flows

### 4.1 Setting up a Track

1. User opens **Tracks** tab → taps **+**.
2. Enters name (e.g., "Linear Algebra mastery").
3. Picks tag — default `shadow`.
4. If `shadow`, picks topic (`math` / `software-engineering` / `theoretical-cs`). Required.
5. Status defaults to `active`.
6. Saves. Returns to Tracks list.

This is a batch flow at the start of a semester. No cleverness. No suggestions.

### 4.2 Toggling a Track's status

1. User taps a Track from the Tracks list → **Track management** screen.
2. Status segmented control: Active / Paused / Completed.
3. Tap a different status → updates immediately, no confirmation modal.

Pausing a Track has cascading effects (see feed-filtering and one-item logic) but the user shouldn't be warned about them — pausing is supposed to be low-friction.

### 4.3 Adding a YouTube playlist as a source

1. User opens a Track → **Attach source** → **New playlist**, *or* opens **Sources** from settings → **+**.
2. Pastes a playlist URL or ID. Curate parses it.
3. Calls YouTube Data API → fetches title, channel name, item count. Shows a preview.
4. User picks one or more Tracks to attach (multi-select). At least one required.
5. Saves. App fetches `playlistItems.list` and populates `feed_item` rows.

Many-to-many is enforced via the `track_source` join — the same playlist row in `source` is linked to multiple Tracks, no duplication.

### 4.4 Setting a weekly shadow goal

1. User opens **Goals** → **+**.
2. Title.
3. Tag picker → `shadow`.
4. Track dropdown appears (only `active` Tracks shown). Selection required.
5. Recurring toggle. If on → frequency target ("3 times per week"). If off → frequency target = 1.
6. Optional reminder time (single time per day).
7. Optional **Schedule on calendar** toggle. If on:
   - One-off → date + time picker, default 1h duration.
   - Recurring → multi-select day-of-week picker (Mon/Tue/Wed/Thu/Fri/Sat/Sun) plus a single time. Each selected day creates a separate weekly-recurring calendar event at that time, all stamped with the same `curateGoalId`. Example: "exercise 3×/week" → pick Mon + Wed + Fri at 6 PM → three weekly recurring events, all linked to one goal record.
   - On save, Curate creates the calendar event(s) with `extendedProperties.private.curateGoalId = <goal id>` and stores the **first** event ID in `goal.scheduled_event_id` (used as the canonical link; the others are discoverable on read by filtering events with the same `curateGoalId`).
8. Save.

### 4.5 Setting a weekly non-shadow goal

Same as above, except after picking a non-shadow tag the Track dropdown doesn't appear and the goal saves with `track_id = NULL`.

### 4.6 Completing a goal

1. From the brief or goals list, user taps the goal.
2. **Completion modal** opens.
3. Textarea: "What did you do?" Placeholder: e.g., "Worked through 4 exercises in chapter 2, got stuck on the last one and reviewed eigenvector intuition."
4. **Save** is disabled until the textarea has non-whitespace content.
5. Save → writes a `goal_completion` row → modal closes → goal appears as completed in the list (or as "2 of 3" for recurring).

There is no second-thought "are you sure" step. The friction is the description, not a confirmation.

### 4.7 Opening the daily brief — Monday morning, normal week

1. App opens → brief is the default tab.
2. App reads:
   - Yesterday's `goal_completion` rows → group by Track for shadow goals → render their descriptions.
   - This week's active goals → render today's plan grouped by tag.
   - Today's calendar events from Google Calendar API.
   - One item (algorithm in section 6).
3. User scrolls top to bottom, marks any morning goals complete, hits the "You're done" card.

If the user has a goal scheduled for today via the calendar and Curate created the event, the corresponding line in "Today's plan" links to that scheduled time visually.

### 4.8 Opening the daily brief — bad-week Monday

1. On app open, the brief screen runs the bad-week check (section 5).
2. If triggered → render the one-thing-today layout instead.
3. The "one thing" is selected as: today's first goal by reminder time; if no goals have reminder times, the most recently created active goal.
4. User completes (or doesn't). No streak, no comment, no recovery plan.
5. Once a 2nd completion happens within the rolling 7-day window, normal brief resumes the next time the app opens.

### 4.9 Starting a session and navigating to the feed (auto-detected)

You wanted sessions to be inferred from the calendar, not started manually. So:

1. User goes to **Feed** tab.
2. On open, Curate runs the **active Track resolver** (section 7):
   - Read today's calendar events from Google.
   - Find any event currently in progress (now is between start and end) that has `extendedProperties.private.curateGoalId`.
   - If found → look up the goal → if it's a shadow goal, that goal's `track_id` is the active context.
   - If not found → no active context, all-active-Tracks mode.
3. Header chip at the top of the feed shows the resolved context: "Linear Algebra" (auto-detected) or "All active Tracks."
4. User can tap the chip to override → picks any active Track from a sheet, or "All Tracks" to clear. Override lasts only for this feed view; navigating away and back re-runs the resolver.
5. Feed renders ~20 items, no infinite scroll. Tap → opens YouTube app.

### 4.10 Batch importing Tracks + goals from JSON

Used either at semester start (Tracks + goals together) or weekly on Monday (just goals). Same flow either way.

1. Settings → **Batch import**.
2. Step 1 — **Get JSON.** A "Copy prompt" button at the top of the screen copies the import prompt to clipboard. User pastes that prompt into Gemini (or any LLM), pastes their planning doc beneath it, gets back JSON.
3. Step 2 — **Paste JSON.** User pastes the JSON into the textarea. Curate validates on every change (debounced).
4. **Preview** appears once JSON parses successfully:
   - "Will create N new Tracks" — names listed.
   - "Will reuse M existing Tracks" — names listed (matched by name, case-insensitive).
   - "Will create K goals" — grouped by tag, shadow goals show their resolved Track.
   - "Will schedule J calendar events" — only if any goal has a `schedule` field. Each scheduled goal is listed with its day(s) + time. If calendar isn't connected yet, this becomes a yellow warning instead and those goals will import unscheduled.
   - Warnings (yellow): e.g., goal with same title already exists this week.
   - Errors (neutral grey, never red): missing required field, invalid enum, shadow goal references unknown Track. Errors disable the Import button.
5. **Import** → SQLite inserts run in a single transaction. If any goal had a schedule and calendar is connected, calendar events are created in a second phase (best-effort; failures don't roll back the inserts). On success → navigate to Tracks tab.
6. No undo. (Calendar events from the import can be deleted manually in Google Calendar if needed.)

Full schema, prompt text, and conflict rules are in section 11.

---

## 5. Bad-week detection

**Rule:** count `goal_completion` rows with `completed_at` in the **rolling last 7 days** (i.e., now − 7 days, not "this calendar week"). If count is **< 2**, show one-thing-today mode.

**Why rolling 7 days, not "this week":**
- Avoids the cliff on Monday morning where the count resets.
- A user who completed 4 things on Saturday isn't in a bad week on Monday morning.

**Why threshold 2, not 1:**
- Threshold 1 would deactivate after a single token completion, which is the exact kind of "gaming the system" the description requirement is supposed to prevent.
- Threshold 2 means you've actually done a couple of things recently.

**When it deactivates:** as soon as the rolling count crosses ≥ 2 it deactivates, on next app open. There is no announcement. The brief just looks normal again. (No "welcome back!" — that would be punishment-shaped.)

**Implementation:**

```ts
async function isBadWeek(): Promise<boolean> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM goal_completion WHERE completed_at >= ?`,
    [sevenDaysAgo]
  );
  return count < 2;
}
```

The check runs once per app open, on the brief screen mount. Cache the result for the session — don't re-query on every render.

**One edge case:** brand-new user with zero completions ever. They'll trip the bad-week check immediately. To avoid greeting a new user with one-thing-today, add a **grace period**: skip the check entirely for the first 14 days after `track` table first becomes non-empty. Store `first_track_created_at` in a tiny `meta` table or AsyncStorage.

---

## 6. "One item" selection algorithm

**Goal:** rotate across active Tracks across days so the user sees breadth.

**Algorithm:**

```
1. Get all Tracks with status='active'. Call this set A.
2. If A is empty → no one item shown.
3. Left join A with one_item_history on track_id.
4. Sort A:
   - Tracks with NULL last_surfaced_at first (never surfaced).
   - Then by last_surfaced_at ASC (oldest first).
5. Pick the first Track in the sorted list. Call this T.
6. Get all source rows joined to T via track_source.
7. Get all feed_item rows from those sources.
8. Pick a random feed_item from the result set.
   - Optional refinement: bias toward items with later published_at (newer content)
     by sampling from the top 20 by published_at. Skip this in v1, do uniform random.
9. Update one_item_history: set last_surfaced_at=now, last_item_id=<item.id>
   for track_id=T (UPSERT).
10. Return the item plus T.name (for display).
```

**Edge cases:**

- No active Tracks → no one item, brief just doesn't show that section.
- Active Tracks but no sources attached → skip those, advance to the next Track in the rotation. If no active Track has sources, no one item.
- Sources attached but `feed_item` table is empty (never synced) → trigger sync, but for this brief, no item.
- Same item shown two days in a row → unlikely if you have ≥10 items per playlist; ignore.

**Why no ML:** the spec literally says "no ML." Rotation by least-recently-surfaced is fair, deterministic, and trivial to debug.

**Implementation lives in** `src/lib/oneitem.ts`. Pure function over DB reads — easy to test in isolation.

---

## 7. Feed-filtering logic

Two modes, resolved by the **active Track resolver**:

### Active Track resolver

```
Input: current time (now), Google Calendar events for today
Output: Track | null

1. Filter today's events to those where now ∈ [event.start, event.end].
2. From those, pick events with extendedProperties.private.curateGoalId set.
3. If multiple, pick the one with the latest start time (most recently begun).
4. Look up goal by curateGoalId.
5. If goal.tag === 'shadow' AND goal.track_id is set AND that track's status === 'active':
     return that Track.
6. Otherwise return null.
```

### Mode 1 — auto-detected session active (resolver returned a Track T)

```sql
SELECT fi.* FROM feed_item fi
  JOIN source s        ON s.id = fi.source_id
  JOIN track_source ts ON ts.source_id = s.id
WHERE ts.track_id = :T_id
ORDER BY fi.published_at DESC
LIMIT 20;
```

Header chip: `Linear Algebra · auto`

### Mode 2 — no session, all-active-Tracks (resolver returned null)

```sql
SELECT DISTINCT fi.* FROM feed_item fi
  JOIN source s        ON s.id = fi.source_id
  JOIN track_source ts ON ts.source_id = s.id
  JOIN track t         ON t.id = ts.track_id
WHERE t.status = 'active'
ORDER BY fi.published_at DESC
LIMIT 20;
```

Header chip: `All active Tracks`

### Mode 3 — manual override (user tapped chip)

User picks a Track manually from the chip sheet → exact same query as Mode 1 but with the user-picked Track ID. Override is held in Zustand and cleared on tab change. Header chip: `Linear Algebra · manual`.

### Hard rules regardless of mode

- **No infinite scroll.** `LIMIT 20`. End of feed shows the same "you're done" idea — a dead-end card.
- **Pull-to-refresh** triggers a re-fetch from YouTube for any source whose `last_synced_at` is > 24h old, then re-runs the query.
- **Paused or completed Tracks contribute zero items**, in any mode. Even if a source is attached to both an active Track and a paused Track, the SQL `t.status='active'` filter in Mode 2 ensures the source still surfaces because it's joined via the active Track. Mode 1 doesn't need this filter because the resolver only returns active Tracks.

---

## 8. Notification logic

**Per-goal only. Nothing else fires a notification. Ever.**

### When a notification fires

For every active goal with a `reminder_time`:

- **Recurring:** schedule a daily local notification at `reminder_time` for each day of the week the goal is "due." For MVP, recurring goals are due every day until the weekly target is met — fire daily, but suppress on days where the goal already has a completion that week and the count ≥ frequency_target. (See suppression below.)
- **One-off:** schedule a single local notification at `reminder_time` on the goal's intended date. If the goal is scheduled on the calendar, use that date; otherwise use the goal's `created_at` date.

### Notification copy

Template:

```
Title: <goal.title>
Body:  <Track name if shadow, else empty>
```

That's it. No emoji, no encouragement, no "don't miss your streak."

### Suppression

Before firing, check: does this goal have a `goal_completion` already today (one-off) or already at/over `frequency_target` this week (recurring)? If yes, cancel the scheduled notification.

The simplest implementation:

- Every time a goal_completion is inserted, run `notifications.refreshFor(goalId)` which re-evaluates and re-schedules that goal's notifications.
- Every Sunday at 23:59, run a global re-eval of all active goals (in case the week resets).

### What never fires

- "New videos in your feed" — never.
- "You haven't checked Curate today" — never.
- "You're behind on your goals" — never.
- "X-day streak!" — never (because there are no streaks).

This list looks redundant but it's worth writing down so you can grep for it if Claude Code ever drifts.

---

## 9. File / folder structure

```
curate/
├── app.json
├── package.json
├── tsconfig.json
├── README.md
│
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout, providers (React Query, Zustand)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar
│   │   ├── brief.tsx             # Default landing
│   │   ├── goals.tsx
│   │   ├── tracks.tsx
│   │   └── feed.tsx
│   ├── tracks/
│   │   ├── new.tsx
│   │   └── [id].tsx
│   ├── goals/
│   │   ├── new.tsx
│   │   └── [id].tsx
│   ├── sources/
│   │   └── new.tsx
│   ├── completion/
│   │   └── [goalId].tsx          # Completion modal
│   ├── import.tsx                # Batch import (Tracks + goals from JSON)
│   └── settings.tsx
│
├── src/
│   ├── db/
│   │   ├── client.ts             # SQLite open/init/migrate
│   │   ├── schema.sql
│   │   ├── tracks.ts             # CRUD for track
│   │   ├── goals.ts              # CRUD for goal
│   │   ├── completions.ts        # CRUD for goal_completion
│   │   ├── sources.ts            # CRUD for source + track_source
│   │   ├── feedItems.ts          # CRUD for feed_item
│   │   └── oneItemHistory.ts
│   │
│   ├── services/
│   │   ├── googleAuth.ts         # OAuth via expo-auth-session
│   │   ├── googleCalendar.ts     # list events, create event with extendedProperties
│   │   ├── youtube.ts            # playlistItems.list, parse playlist URL
│   │   └── notifications.ts      # schedule, refreshFor(goalId), cancelAll
│   │
│   ├── lib/
│   │   ├── week.ts               # weekStart, weekEnd, isThisWeek
│   │   ├── badweek.ts            # isBadWeek
│   │   ├── oneItem.ts            # pickOneItem
│   │   ├── activeTrack.ts        # resolveActiveTrack
│   │   ├── importPrompt.ts       # the long copy-pasteable prompt template
│   │   ├── importParser.ts       # parseAndValidate, commitImport
│   │   └── ids.ts                # uuid wrapper
│   │
│   ├── components/
│   │   ├── BriefSection.tsx
│   │   ├── GoalRow.tsx
│   │   ├── TrackChip.tsx
│   │   ├── CompletionModal.tsx
│   │   ├── EndStateCard.tsx
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useGoals.ts           # React Query wrappers
│   │   ├── useTracks.ts
│   │   ├── useTodaysEvents.ts
│   │   └── ...
│   │
│   ├── stores/
│   │   └── feedOverride.ts       # Zustand: manual Track override
│   │
│   ├── theme.ts                  # colors, spacing — calm palette only
│   └── types.ts
│
└── assets/
```

### Build order ↔ files

- **Weekend 1** touches: everything in `src/db/` for `track`, `goal`, `goal_completion`; `app/(tabs)/goals.tsx`, `app/(tabs)/tracks.tsx`, all goal/track CRUD screens, `CompletionModal`, `src/lib/week.ts`. No services yet.
- **Weekend 1 stretch (highly recommended):** `app/import.tsx`, `src/lib/importParser.ts`, `src/lib/importPrompt.ts`. The import feature reuses the same DB write functions as the manual flow; it's a few extra hours once Weekend 1's core is done. Building it before Weekend 2 means your first real semester setup uses the import, which is when it pays off most.
- **Weekend 2** adds: `services/googleAuth.ts`, `services/googleCalendar.ts`, `app/(tabs)/brief.tsx`, `lib/badweek.ts`, `services/notifications.ts`. The "schedule on calendar" toggle on goals also lights up here.
- **Weekend 3** adds: `db/sources.ts`, `db/feedItems.ts`, `services/youtube.ts`, `app/(tabs)/feed.tsx`, `app/sources/new.tsx`, `lib/activeTrack.ts`, `stores/feedOverride.ts`.
- **Weekend 4** adds: `db/oneItemHistory.ts`, `lib/oneItem.ts`, plus the "one item" section in the brief.

You can ship Weekend 1 with brief, feed, settings tabs as empty placeholders.

---

## 10. What is NOT being built (in implementation terms)

These are non-decisions — they should never appear in code, schema, UI, or notification logic. If you (or Claude Code) catch yourself adding one, stop.

### Schema absences (never add these columns/tables)
- `streak_count`, `current_streak`, `longest_streak` — anywhere.
- `points`, `xp`, `level` — anywhere.
- `time_in_app`, `last_opened_at` for analytics purposes (a `last_opened_at` for caching is fine; an analytics one is not).
- `target_end_date`, `deadline` on `track`.
- A `milestone` table.
- A `curriculum_node` / `roadmap` table.
- `is_pinned`, `priority` on goals — every goal is equal.
- `parent_track_id` on `track` — no sub-tracks.

### UI absences
- No red color anywhere. The full palette is greys, soft blues, off-whites. `theme.ts` shouldn't even export a red token.
- No "you missed X days" banner.
- No broken-chain icon, no flame icon, no streak counter.
- No "X% complete this week" progress bar — "5 of 7" text is fine, a filling progress bar is gamification by another name.
- No badge / achievement screen.
- No public profile or share button.
- No leaderboard, even of one (e.g., "best week ever").
- No "open feed" CTA at the bottom of the brief. The brief ends; the feed is reached on purpose.

### Logic absences
- No catch-up plan generation when the user falls behind.
- No timeline auto-extension.
- No item suggestions from outside user-approved sources. If a YouTube recommendation API exists, don't call it. If a "related videos" endpoint exists, don't call it.
- No feed notifications. The notification module physically lacks a function to fire one.
- No "smart re-prioritization" of goals.
- No engagement metrics surfaced to the user — not session length, not daily app-opens, not anything.

### Scope absences
- No Obsidian read or write.
- No newsletter ingestion (RSS, email parsing).
- No X / LinkedIn sources.
- No side-hustle features.
- No multi-device sync.
- No web export.
- No cloud backup beyond the user manually copying the SQLite file.

---

## 11. Batch import — schema, prompt, conflict handling

**Why this exists:** Track setup is once a semester (low total friction over the year); weekly goal-setting is every Monday (high recurring friction). Both flows use the same import screen. The friction this trades against is writing a JSON file — but you're already planning in Gemini, and the import screen ships with a copy-pasteable prompt that turns your planning doc into JSON for you. The LLM work happens externally, so Curate stays free of API keys, runtime parsing failures, and ongoing per-import cost.

### 11.1 JSON schema

```json
{
  "tracks": [
    {
      "name": "string, required, unique within file",
      "tag": "shadow | academic | extracurricular | work",
      "topic": "math | software-engineering | theoretical-cs",
      "status": "active | paused | completed"
    }
  ],
  "goals": [
    {
      "title": "string, required",
      "tag": "shadow | academic | extracurricular | work",
      "track_name": "string — required iff tag === 'shadow'",
      "is_recurring": "boolean",
      "frequency_target": "integer ≥ 1",
      "schedule": {
        "time": "HH:MM, 24-hour, local — required if schedule is present",
        "date": "YYYY-MM-DD — required iff is_recurring === false",
        "days_of_week": "['mon','tue','wed','thu','fri','sat','sun'] — required iff is_recurring === true"
      }
    }
  ]
}
```

**Field rules:**
- `topic` is required iff `tag === 'shadow'`. Otherwise it must be omitted.
- `track_name` is required iff `tag === 'shadow'`. The name must match either a Track in this file's `tracks` array OR an existing Track in the DB. Match is case-insensitive after trimming.
- `is_recurring === false` requires `frequency_target === 1`.
- `status` defaults to `"active"` if omitted on a Track.
- `schedule` is **fully optional** on every goal. Goals without `schedule` are imported unscheduled — exactly as if you'd left "Schedule on calendar" off in the manual flow. They can be scheduled later via the goal edit screen.
- If `schedule` is present, `time` is required (`HH:MM`, 24-hour, local). Then either `date` (one-off) or `days_of_week` (recurring), determined by `is_recurring`.
- Either top-level array may be empty (e.g., a weekly Monday import contains only goals).

**The importer does not touch:** reminders, sources, or existing completions. Reminders are added manually via the goal edit screen after import. Sources have a separate flow.

### 11.2 Conflict handling

Detection runs in this order, results surface in the preview screen:

| Case | Behavior |
|---|---|
| Track in file matches existing Track by name (case-insensitive) | **Skip Track creation.** Reuse existing Track ID for any goals that reference it. Preview note: "Will reuse existing Track: X." |
| Track in file has same name as another Track in the same file | **Reject the import.** Error: "Duplicate Track name: X." |
| Shadow goal's `track_name` doesn't match any Track in file or DB | **Reject the import.** Error: "Goal '...' references unknown Track: Y." |
| Goal in file has same `title` as an existing active goal | **Create anyway, with a warning** in the preview. The user is responsible for not pasting last week's goals on top of this week's. |
| Track tag is `shadow` but `topic` is missing | **Reject.** |
| Goal tag is `shadow` but `track_name` is missing | **Reject.** |
| Goal tag is non-`shadow` but `track_name` is present | **Reject** (avoid silent data corruption). |
| Enum value invalid | **Reject**, name the bad field. |
| `is_recurring=false` but `frequency_target ≠ 1` | **Reject.** |
| `schedule.time` missing or not `HH:MM` 24-hour | **Reject.** |
| `is_recurring=false` but `schedule.date` missing, or `schedule.days_of_week` present | **Reject.** |
| `is_recurring=true` but `schedule.days_of_week` missing/empty, or `schedule.date` present | **Reject.** |
| `schedule.days_of_week` contains invalid day name | **Reject.** |
| Any goal has a `schedule`, but Google Calendar isn't connected yet | **Warn**, import the goal **unscheduled**. Preview note: "Calendar not connected — N goals will be imported without scheduling. Connect calendar in Settings to enable." |

Reject = preview shows error banner (neutral grey, **never red**), Import button disabled until JSON is fixed and re-pasted.

### 11.3 The prompt (embedded in the import screen, copy-pasteable)

Store this verbatim as a long template string in `src/lib/importPrompt.ts`. The "Copy prompt" button copies this entire string to clipboard.

```
You are converting a self-directed learning plan into JSON for an app called
Curate. Output ONLY a JSON object — no prose, no markdown fences, no preamble.

Schema:
{
  "tracks": [
    {
      "name": string,
      "tag": "shadow" | "academic" | "extracurricular" | "work",
      "topic": "math" | "software-engineering" | "theoretical-cs",  // shadow only
      "status": "active" | "paused" | "completed"                   // default "active"
    }
  ],
  "goals": [
    {
      "title": string,
      "tag": "shadow" | "academic" | "extracurricular" | "work",
      "track_name": string,         // REQUIRED iff tag === "shadow", otherwise OMIT
      "is_recurring": boolean,
      "frequency_target": integer,  // 1 for one-off, N for "N times per week"
      "schedule": {                 // OPTIONAL — omit entirely if user gave no time
        "time": "HH:MM",            // 24-hour, local. REQUIRED if schedule present.
        "date": "YYYY-MM-DD",       // REQUIRED iff is_recurring === false
        "days_of_week": [           // REQUIRED iff is_recurring === true
          "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
        ]
      }
    }
  ]
}

Definitions:
- A "Track" is a long-arc commitment within a topic — e.g., "Linear Algebra
  mastery" or "C++ for systems." Tracks are almost always tagged "shadow."
- A "goal" is one week's worth of work. It can be one-off ("finish problem
  set 3", is_recurring=false, frequency_target=1) or recurring within the
  week ("solve 5 LeetCode problems", is_recurring=true, frequency_target=5).
- Every shadow goal MUST reference a Track by name in "track_name." Names
  must match a Track in the same file's "tracks" array or one already set up
  in the user's app.
- Production projects (e.g., "build a pricing engine") are GOALS under a
  Track, not Tracks themselves.
- Non-shadow goals MUST omit "track_name" entirely. Use tag "academic"
  for formal coursework, "extracurricular" for clubs/exercise/hobbies,
  "work" for paid work.
- Topics: "math" for math-flavored work, "software-engineering" for
  applied/practical coding (languages, systems, projects),
  "theoretical-cs" for algorithms, complexity, formal methods.
- Don't invent Tracks the user hasn't mentioned.
- Don't add reminders or sources — they aren't in the schema.
- If the input only contains weekly goals (not Tracks), return an empty
  "tracks" array — that's fine.

Scheduling rules (the "schedule" field):
- ONLY add "schedule" if the user explicitly mentions a time/day for that
  goal in their plan. NEVER invent times. If the user didn't say when
  they'll do something, omit "schedule" entirely.
- For one-off goals with a date+time given by the user: include "date"
  (YYYY-MM-DD) and "time" (HH:MM 24-hour). Omit "days_of_week."
- For recurring goals with a weekly schedule given by the user (e.g.,
  "exercise Mon/Wed/Fri at 6 PM"): include "days_of_week" and "time."
  Omit "date." The number of days in "days_of_week" should match
  "frequency_target."
- If a recurring goal's schedule is ambiguous ("3 times a week" with no
  days specified), OMIT "schedule" entirely — the user can fill it in
  manually.

Now read the plan below and produce the JSON.

— PLAN —

[PASTE YOUR PLAN HERE]
```

### 11.4 Import screen UX (`/import`)

Top to bottom:

1. **Step 1 — Get JSON.** Short copy: "Paste the prompt below into Gemini along with your planning doc. Paste the JSON it gives back into the box at the bottom." A "Copy prompt" button.
2. **Step 2 — Paste JSON.** A multiline textarea. Validation runs on every change, debounced 300ms.
3. **Preview** appears below the textarea once JSON parses successfully:
   - "Will create N Tracks" — bullet list of names.
   - "Will reuse M existing Tracks" — bullet list.
   - "Will create K goals" — grouped by tag, shadow goals show their resolved Track name underneath.
   - "Will schedule J calendar events" — only shown if any goal has a `schedule`. Lists each scheduled goal with its day(s) + time. (If calendar isn't connected, this becomes a warning instead.)
   - Warnings (yellow) if any.
   - Errors (neutral grey) if any.
4. **Import** button — disabled if JSON is invalid or has any errors. Enabled if there are warnings only. On tap → run import in a single SQLite transaction → on success, navigate to Tracks tab.

The preview is non-negotiable. No silent imports.

### 11.5 Algorithm

```
parseAndValidate(jsonText) → ImportPlan:
  1. JSON.parse — fail with "Invalid JSON" if it throws.
  2. Validate top-level shape: { tracks: array, goals: array }.
  3. For each Track: validate enums, required fields. Build a name index.
  4. Detect duplicate names within file → error.
  5. For each Goal: validate enums, required fields, recurring/frequency
     consistency, schedule shape (if present), and resolve track_name
     against (file index ∪ DB).
  6. If any goal has a schedule but Calendar isn't connected, downgrade
     those schedules to a warning (goal will import unscheduled).
  7. Build plan: { tracksToCreate, tracksToReuse, goalsToCreate,
     scheduledGoals, errors, warnings }.
  8. Return plan.

commitImport(plan):
  Phase 1 — SQLite transaction:
    - For each track in plan.tracksToCreate: insert into track.
    - Build a name → id map (combining new and reused tracks).
    - For each goal in plan.goalsToCreate: resolve track_id via the map,
      insert into goal. Capture inserted goal IDs.
    - Commit. Mid-import failure here rolls back cleanly.

  Phase 2 — Calendar event creation (only if Calendar is connected):
    - For each goal in plan.scheduledGoals (paired with its inserted ID):
      - One-off: create one event on schedule.date at schedule.time,
        stamped with extendedProperties.private.curateGoalId.
      - Recurring: for each day in schedule.days_of_week, create one
        weekly-recurring event at schedule.time, all stamped with the
        same curateGoalId.
      - On success: update goal.scheduled_event_id with the first event ID.
      - On failure (network, API error): log it, leave the goal unscheduled,
        accumulate into a "couldn't schedule" list.
    - After Phase 2: if any failures, show a non-blocking notice listing
      the goals that didn't schedule. The user can re-try via the goal
      edit screen.
```

Phase 1 is atomic. Phase 2 is best-effort and recoverable (the user can manually schedule any failed goal later). They're separate because Google Calendar API calls can't sit inside a SQLite transaction, and a calendar hiccup shouldn't roll back goals you've already imported.

### 11.6 What this is NOT

- **Not a sync.** Curate doesn't read back to your planning doc. Nothing tracks which Track/goal "came from" which import. Once imported, they're indistinguishable from manually-created records.
- **Not idempotent for goals.** Re-importing the same goal JSON twice creates duplicate goals. The preview is the safeguard.
- **Doesn't import reminders or sources.** Reminders are added manually via the goal edit screen. Sources have a separate flow.
- **Doesn't invent times.** The LLM is instructed not to schedule anything you didn't explicitly mention. Goals without an explicit time stay unscheduled — you can add scheduling later via the manual goal flow.
- **Not a curriculum store.** Curate is still execution-only. Your Gemini doc remains the plan-of-record.
- **Not undo-able.** No "undo last import" button. If you regret an import, archive/delete manually. (Calendar events created by the import can also be deleted manually in Google Calendar.)

---

## 12. Decisions log

These were genuinely ambiguous questions during spec drafting. Resolved decisions captured here so future-you (or Claude Code) doesn't re-litigate them.

| # | Question | Decision |
|---|---|---|
| 1 | Calendar write target | Google **Calendar events** (not Google Tasks). Resolver depends on `extendedProperties.private.curateGoalId`. |
| 2 | Recurring goal scheduling on calendar | **Per-day-of-week multi-select picker.** "Exercise 3×/week" → pick Mon/Wed/Fri at 6 PM → three weekly recurring events, all stamped with the same goal ID. |
| 3 | Active Track resolver when current event has no goal link | **Fall through to all-active-Tracks mode.** No keyword matching against event titles. |
| 4 | "One thing today" goal selection priority | First by reminder time today → else most recently created active goal. |
| 5 | "Yesterday" boundary for "yesterday's wins" | **Calendar date** (completions whose `completed_at` falls on yesterday's local date), not rolling 24h. |
| 6 | Feed item cap per session | **20 items.** Hard cap, no infinite scroll. |
| 7 | Google OAuth token lifetime | **Indefinite.** Refresh tokens stored in `expo-secure-store`. No periodic forced re-sign-in. |
| 8 | Styling library | **NativeWind** (Tailwind for RN). Theme defined in `tailwind.config.js` with greys, soft blues, off-whites only — no red token. |
| 9 | Batch import scope | **Tracks + weekly goals.** Sources are not importable. |
| 10 | Batch import format | **Strict JSON,** parsed deterministically inside Curate. The LLM work happens externally — copy-pasteable prompt is provided in the import screen. |
| 11 | Batch import cadence | **Same flow used for both** semester-start (Tracks + goals) and weekly Monday goal import (just goals). |
| 12 | Batch import + calendar scheduling | **Optional per-goal `schedule` field in JSON.** Goals without it import unscheduled. The LLM is instructed not to invent times. If calendar isn't connected at import time, scheduling is skipped with a warning and goals import unscheduled. Calendar event creation runs in a separate phase after the SQLite transaction, best-effort, so a calendar API hiccup doesn't roll back imported goals. |
