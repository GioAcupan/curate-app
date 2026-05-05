# Curate — Vision, Profile, Constraints, Roadmap

## Vision

**One sentence:** Curate is a morning-anchored daily ritual app where your stated goals shape the content you consume — turning the scrolling impulse into fuel for becoming who you want to be, instead of an enemy to fight.

**Long version:** Most productivity apps treat content consumption as the enemy and try to block, lock, or shame the user out of it. Most content apps optimize a feed for engagement with no regard for who the user is trying to become. Curate sits between these — it accepts that the user wants to consume content (and that some content is genuinely good for them) and structures the app so consumption is intentional, time-bounded, and tied to stated identity goals.

Curate is **not** an "operating system" in the Notion sense. It is a daily ritual with supporting surfaces, organized around one inversion of the standard productivity pattern: the feed is never the default, the tracker is forgiving rather than punishing, and the user's worst days are designed for as carefully as their best ones.

The shadow curriculum is at the heart of what Curate is for. The user's school provides external accountability for their formal coursework. The self-directed learning track — the "shadow" — has none. Curate exists primarily to keep that shadow track moving without the user having to white-knuckle it.

---

## Goals

### Primary
- Open Curate first thing in the morning *instead of* social media.
- Complete more shadow-curriculum goals (math, software engineering, theoretical CS) than before.
- Recover from slip-ups in days, not weeks.

### Secondary
- Less time on YouTube / Instagram / Facebook overall.
- Discover high-quality content tied to actual Tracks (vs. algorithmic recommendations).
- Feel less like you're failing at productivity, even on weeks when you fall behind.

### Anti-goals
- **More time spent in Curate is NOT success.** The opposite, in fact.
- Streaks, completion percentages, and quantified-self metrics are NOT primary success indicators.
- Engagement metrics are an anti-goal.

---

## User profile (you)

This is a single-user app, built for the developer. Profile:

- Math undergrad at PLM, transitioning from BSCS. Running a parallel **shadow curriculum** with three threads: math, software engineering, theoretical CS.
- Career vector: AI/ML, Quantitative Finance, and Theoretical CS — all share heavy mathematical foundations (linear algebra, multivariate calculus, probability, optimization).
- End goal: polymathy — Math + CS mastery.
- Stated biggest flaw: difficulty sticking to plans.
- Prone to downward spirals: behind → feel bad → less motivation → more behind.
- Morning scroll habit (FB, IG, YT) used as a wake-up ritual.
- Boredom / procrastination scrolling during dead time.
- Doesn't want to quit social media entirely — there's genuinely useful content mixed with noise.
- Already uses a blocker scheduler for socmed apps.
- Uses Obsidian for notes (integration desired, not replacement).
- Plans the shadow curriculum in detail externally (e.g., Gemini / planning docs). Curate is for **execution**, not planning.
- Future plans: side hustle (not in MVP).

---

## Constraints

- Single-user, vibe-coded. Architecture stays simple, not enterprise.
- Mobile-first (phone-pickup behavior).
- Calendar is read-only externally — never the source of truth, just an input.
- Obsidian must remain the source of truth for notes (Curate may write to it, never replace it).
- The shadow-curriculum planning doc (Gemini, notebook, whatever) is the source of truth for the curriculum itself. Curate stores only execution-side metadata about Tracks (name, topic, status).

---

## Don'ts (load-bearing)

- **Don't make the brief infinite.** It has a hard end state.
- **Don't show streaks or broken-chain visuals.** Use forgiving frequency patterns ("5 of 7") instead.
- **Don't punish missed days.** No red marks, no "you missed X." Silence on bad weeks.
- **Don't auto-generate catch-up plans** — they amplify guilt for spiral-prone users. Maybe v3, after data justifies it.
- **Don't suggest individual items from the open web.** The user-approved source list is the firewall against algorithmic feeds.
- **Don't notify about feed content.** Ever. Notifications are for goals only.
- **Don't make the feed the default surface.** Always reached intentionally.
- **Don't gamify.** No badges, no XP, no levels.
- **Don't pre-build comfort features.** Build silence first; add intelligence only after months of usage data justifies it.
- **Don't replicate the curriculum planning doc.** Curate is execution. Tracks have a name, topic, and status — nothing more in MVP.
- **Don't add Track end dates in MVP.** Status-only (active/paused/completed). Deadlines create soft pressure that's risky for spiral-prone users.

---

## Feature list

### MVP (the four-weekend build)

| Feature | Description |
|---|---|
| Tracks | Long-arc commitments within a topic. Status: active / paused / completed. Sources attach here. |
| Goal tracker | Manual, tagged (academic / shadow / extracurricular / work), forgiving. Shadow goals reference a Track. Completion requires written description. |
| Daily brief | Default surface. Yesterday's wins + today's plan + class schedule + one item. Has explicit end state. |
| Feed | Context-aware. YouTube playlists only in v1. Filtered by Track when in a session, by all active Tracks otherwise. Never default surface. Items open in YouTube. |
| Calendar integration | Read-only. Feeds today's plan and class schedule into the brief. |
| Per-goal notifications | Goal reminders only. No feed notifications, ever. |
| "One thing today" mode | Triggered automatically on bad weeks. Reduces brief to a single small ask, no commentary. |

### v2 (after MVP has been used for 1–2 months)

| Feature | Description |
|---|---|
| Obsidian: read recent highlights | Surface relevant highlights in the brief based on today's Tracks. |
| Obsidian: journal entry | Write a journal entry in Curate, save to Obsidian's daily note. |
| Obsidian: quick notes | Capture random ideas in Curate, save to an Obsidian inbox. |
| Newsletter ingestion | Add newsletter sources (likely via email forwarding or RSS), tied to Tracks. |
| X / LinkedIn post sources | Add specific accounts as sources. Pull only their posts, not the algorithmic feed. |
| Source suggestions | Curate suggests sources (channels, accounts, newsletters) for a Track — NEVER individual items. User must approve. |
| Track milestones (cautious) | Optional, lightweight milestones inside a Track. Only if the spec-light "Track has a name and status" version proves too thin in practice. |

### v3+ (only if MVP + v2 prove the thesis)

| Feature | Description |
|---|---|
| Smart timeline adjustment | Long-term Track timelines auto-extend if user falls behind, without commentary. (Only if Track end dates ever get added — currently deferred.) |
| Side hustle workflow | If/when user has a side hustle, treat it as a tag with its own source and goal types. |
| Weekly review | Optional Sunday view of what was studied, consumed, written, grouped by Track. |
| Multi-device sync | Only if the user actually wants it. May not be needed for single-user. |

### Forever-deferred / Won't-build

| Feature | Why not |
|---|---|
| Streaks | Punishes spiral-prone users. |
| Catch-up plans on bad weeks | Guilt amplifier. |
| Open-web item suggestions | Recreates the algorithmic feed problem. |
| Feed notifications | Recreates the engagement-loop problem. |
| Gamification (badges, XP) | Wrong incentive shape for this user. |
| Public profiles, social features | Curate is for the user, not for performance. |
| Full curriculum planner | The user already plans externally. Replicating it inside Curate would expand scope without serving execution. |

---

## Success checks (is it actually working?)

Run these on yourself periodically — monthly is fine — to see if Curate is delivering or quietly becoming the next problem.

### 🟢 Green flags (it's working)
- You open Curate in the morning instead of social media — not because you forced yourself, but because it's where the morning-content desire goes.
- The brief takes 3–5 minutes and you close the app afterward, not seamlessly drift into the feed.
- You complete more weekly shadow-curriculum goals than you did before. Even a small lift is a real one.
- After a missed week, you're back at it within a few days — not weeks.
- The descriptions you write when completing goals are honest and meaningful, not gamed for the checkbox.
- Your overall YouTube and Instagram time has dropped.
- You're seeing breadth across your active Tracks in the daily "one item" — not just the same topic every day.

### 🟡 Yellow flags (drifting)
- You're opening Curate "just to check" multiple times a day with no specific intent. *(Doomscroll pattern emerging.)*
- Goal-completion descriptions are getting shorter, vaguer, and feel like a chore.
- You're adding sources faster than you're consuming the existing ones.
- The "one item" in the brief is being skipped most days.
- You feel guilt when opening Curate. *(The visual design is leaking negative signals.)*
- You have many Tracks marked "active" but most aren't getting goals attached week-to-week. *(Time to pause some.)*

### 🔴 Red flags (rebuild required)
- You're spending more time in Curate than you used to spend on social media. **Curate has become the new doomscroll.** Strip features and reduce defaults.
- You stopped opening it for 2+ weeks because you were "too far behind." **The forgiveness mechanics failed.** Audit every place the app shows progress, ambition, or comparison and remove anything that could read as judgment.
- You completed goals without doing the work, just to keep the data clean. **Integrity is gone.** Either you don't need this app or the goals aren't honest. Reset.
- Tracks have become aspirational fiction — they sit in "active" but you haven't touched them in a month and you can't bring yourself to mark them paused. *(The status field needs to be used honestly. Pausing isn't quitting.)*

### Identity check (the honest one)
Once a quarter, ask yourself: **am I closer to the person I said I wanted to become 3 months ago?**

If yes — regardless of what the metrics say — Curate is doing its job. If no — regardless of how clean the streaks look — something is off. The app exists to support an identity shift. The data is downstream of that. Don't let the data become the thing.
