# Curate — MVP Spec

## What Curate is (one sentence)

A morning-anchored daily ritual app where your stated goals shape the content you consume — built for a self-directed learner who struggles with follow-through and uses scrolling as a coping mechanism.

## MVP scope (4 weekends)

Five surfaces only: **Tracks**, **goal tracker**, **daily brief**, **feed**, **calendar integration**. Nothing else. No Obsidian, no newsletters, no X/LinkedIn, no side hustle workflow, no smart catch-up plans.

---

## Core data shape

The app is organized around a hierarchy:

- **Tag** — what part of life a thing belongs to: `academic` / `shadow` / `extracurricular` / `work`.
- **Topic** (shadow only) — what subject area a Track belongs to: `math` / `software-engineering` / `theoretical-cs`.
- **Track** — a long-arc commitment within a topic (e.g., "Linear Algebra mastery", "C++ for systems"). Tracks have a status: `active` / `paused` / `completed`. No target end dates in MVP.
- **Goal** — a weekly checkbox unit. Every shadow-tagged goal references one Track. Goals under other tags don't need a Track.
- **Source** — a YouTube playlist tied to one or more Tracks (not to goals directly).

Tracks are the backbone of the shadow curriculum. Weekly goals are the *cadence* at which the user does the work; Tracks are how the user measures real advancement. Production projects (e.g., "build options pricing engine", "implement DSA library in C++") are **deliverables** from a Track, not Tracks themselves — they live as goals under the relevant skill/topic Track.

---

## Build order

### Weekend 1 — Tracks + goal tracker (use alone for a week)

**Tracks setup:**

- User creates Tracks. Each Track has: a name, a tag (almost always `shadow` for Tracks; the system supports other tags but the user usually won't bother), a topic (required if shadow), and a status (`active` / `paused` / `completed`).
- Track creation is an infrequent, batch flow — the user sets up Tracks at the start of a semester. The original planning doc (e.g., the user's Gemini curriculum doc) is the source of truth for *what* the Tracks are; Curate just holds the execution-side metadata.
- Tracks can be toggled active/paused/completed at any time.

**Goal tracker:**

- User sets weekly goals.
- Each goal has a tag: `academic` / `shadow` / `extracurricular` / `work`.
- If the tag is `shadow`, the goal must reference a Track (dropdown, only `active` Tracks shown).
- Each goal can be one-off ("finish problem set 3") or recurring ("exercise 3x/week").
- Marking a goal complete requires **two actions**: check the box + write a short description (1–3 sentences) of what was actually done. Description is non-skippable.
- Weekly view shows completed and incomplete goals, optionally grouped by Track. **No streaks. No red marks. No broken-chain visuals.** Incomplete goals are shown in a neutral state.
- Frequency-based goals use the **"5 of 7"** pattern (or equivalent), never "consecutive day count."
- Goal descriptions are stored — they become the input for tomorrow's "yesterday's wins" in the brief.

### Weekend 2 — Daily brief + calendar (use for a week)

- Brief is the default surface on app launch.
- Brief contents, in order:
  1. **Yesterday's wins** — auto-generated from the descriptions written when goals were completed yesterday. Just the descriptions, lightly formatted, optionally grouped by Track for shadow goals. If yesterday was empty, show nothing in this section (no "you didn't do anything yesterday").
  2. **Today's plan** — today's goals from the tracker, grouped by tag. Shadow goals show their Track name underneath.
  3. **Today's schedule** — calendar events read from the user's external calendar.
- Brief has an **explicit end state**. After the user reaches the bottom, show a "You're done — see you tomorrow" view. The app does NOT flow into the feed. **The end is the feature.**
- Calendar can add tasks to the Calendar.

### Weekend 3 — Feed (use for a week)

- One source type only in v1: **YouTube playlists**.
- Each source is tied to **one or more Tracks** (not to goals directly).
- Feed is **never** the default surface. User must navigate to it explicitly.
- Feed is **context-aware**:
  - When the user starts an active session for a goal ("I'm studying Linear Algebra now"), Curate looks up that goal's Track, finds sources tied to that Track, and shows only those.
  - Outside of sessions, feed shows items from sources tied to any `active` Track. Paused/completed Tracks' sources don't appear.
- Tapping a feed item opens YouTube directly. (User already has a socmed blocker scheduler — Curate doesn't need to duplicate that.)
- **No infinite scroll on the feed.** Limit to a fixed number of items per session (start with ~10). No auto-load.

### Weekend 4 — "One item" in the brief (close the loop)

- Pull **one** curiosity item from sources tied to the user's `active` Tracks, rotating through Tracks across days so the user sees breadth across their curriculum over a week.
- Display between "Today's schedule" and the end state.
- One item, never two. Never a list. Never infinite.

---

## Design rules (non-negotiable)

1. **The brief ends.** No infinite scroll, no auto-flow into the feed. There is always an explicit "you're done" state.
2. **No streaks. No red marks. No broken-chain visuals.** The app cannot punish missed days visually.
3. **Goal completion requires a written description.** Even one sentence. This is anti-gaming AND it generates tomorrow's wins content.
4. **The feed is never the default surface.** Every feed view is reached intentionally.
5. **Suggest sources, never items.** Curate may eventually suggest channels/playlists. Curate must NEVER suggest individual items pulled from the open web. The user-approved source list is the firewall.
6. **Notifications fire per-goal only.** No "new in feed" notifications, ever.
7. **Bad week = silence.** If the user completed zero or near-zero goals last week, the brief reduces to **"one thing today"** mode: a single small ask, no commentary about what was missed, no automatic catch-up plan, no timeline adjustment. Silence is the feature.
8. **Tracks ≠ planning docs.** Curate stores Track metadata (name, topic, status). It does NOT replace the user's external planning artifact (e.g., a Gemini doc, a notebook). The detailed semester-by-semester curriculum lives elsewhere.

---

## What NOT to build in MVP

- Obsidian integration (any kind) — v2
- Newsletter ingestion — v2
- X / LinkedIn post sources — v2
- Track milestones, sub-tracks, or detailed roadmap views — v2 at earliest, possibly never
- Track end dates / deadlines — explicitly deferred
- Side hustle features — defer until the user actually has a side hustle
- Smart catch-up plans / timeline auto-adjustment — defer at least 6 months
- Streaks or gamification of any kind — never
- Suggested items from the open web — never
- Engagement metrics shown to user (time-in-app, items consumed, etc.) — never

---

## Acceptance criteria

- ✅ User can set up Tracks at the start of a semester in under 30 minutes.
- ✅ Creating a shadow goal requires picking a Track from a dropdown of active Tracks.
- ✅ User opens the app on Monday morning, sees yesterday's wins, today's plan, today's schedule, and one curiosity item, and finishes the brief in under 5 minutes.
- ✅ User can complete a goal during the day with a written description in under 30 seconds.
- ✅ User can start a session for a shadow goal and see only feed items from sources tied to that goal's Track.
- ✅ Outside sessions, the feed shows content from active Tracks only — paused/completed Tracks don't appear.
- ✅ User cannot scroll the brief or feed indefinitely. Both have hard ends.
- ✅ The app shows zero negative visuals (no red, no "you missed X days," no broken streaks).
- ✅ On a bad-week Monday, the brief shows "one thing today" mode without commentary.

---

## Tech notes (vibe-coding pragmatics)

- Mobile-first. This is a phone-pickup behavior.
- Single-user, local-first is fine. No backend required for MVP. Data can live in local storage / SQLite / a single JSON file.
- Calendar: use the platform's native calendar API (EventKit on iOS, CalendarContract on Android) or a single iCal feed.
- YouTube playlists: YouTube Data API v3 for playlist contents. No login required for public playlists.
- Keep the styling minimal and calm — no bright reds, no high-contrast warnings, no urgency colors. Greys, soft blues, off-whites.
