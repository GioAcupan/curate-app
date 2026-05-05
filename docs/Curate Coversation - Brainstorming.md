# Curate Brainstorming

> Below is a conversation I had with Claude Opus for my app idea: Curate.

Me:
I have an app idea:
I have two compounding problems, I set goals but I have trouble completing them, and I end up scrolling in social media for an unhealthy amount of time. I want to create an app that solves those two problems, by combining a solution for them.

I named it Curate. As in, curate your ideal self. The idea is that Curate will be the user's (me) "Operating System". It has habit tracker features that was defined by your goals, such as how many hours per day you should study and what you should study, exercise, etc. But it also has a feed. The feed is connected to your newsletters, to the posts of people you follow (like in linkedin or X) that you select yourself, to youtube playlists you select, and maybe even your obsidian notes. The problem I want to solve is to have an app that will help you reach your goals, and inspire you by making you curate the feed you see. This also eliminates the problem wherein I don't want to quit youtube (or other social media platforms) entirely because i see useful stuff there, but I get distracted by the other stuff.

Problem is, it's still pretty vague in my head even though I am the intended user. I do not know what the concrete features will be. I have questions like:

- What makes a good productivity/habit tracker app?
- What are the features that I specifically will find useful?
- What content will appear in the feed?
- A curated feed + a goal setting and habit tracking app is good, but it's still kinda disconnected? Or like, there's a missing ingredient for it to become truly an "OS".
- etc.

I want you to brainstorm with me. Apply design thinking principles, look at existing productivity principles and apps and see what works, and finally ask me a set of 5-10 questions about what I want the app to be, my assumptions, my goals, etc. I will then answer those questions, you will examine them, and ask me another set of questions to further refine the idea, surface underlying assumptions, point out contradictions, and overall push me towards a better vision of what Curate should be.

You:

Love this — the underlying tension you're naming is real and underexplored. Most "focus" apps treat content consumption as the enemy (block X, lock you out of Y), but you're right that this kills the baby with the bathwater. There's a version of YouTube that makes you smarter and a version that makes you dumber, and the apps don't currently distinguish. So before questions, let me share what I'm seeing.

**The core insight, sharpened**

Most social platforms optimize a feed for *engagement*. You're proposing an app that optimizes a feed for *who the user said they want to become*. That's the actual product thesis, and it's strong. Everything else — the habit tracker, the goal setting, the OS framing — is in service of generating a high-quality "you function" that the feed can be filtered through.

If I had to compress Curate into one sentence: *your stated goals become the recommendation algorithm.*

**What working productivity apps actually get right**

A few patterns from the landscape worth pulling on:

The best habit apps (Streaks, Way of Life, Atoms by James Clear) are radically minimal — they ask one question per habit per day. The worst ones (most "all-in-one" trackers) collapse under their own configuration cost. Lesson: every field you make me fill out costs activation energy I'd rather spend on the habit itself.

Atomic Habits' real contribution wasn't tracking — it was *identity-based habits* ("I am a person who reads") and *implementation intentions* ("after I make coffee, I read for 20 minutes"). Curate's premise — "curate your ideal self" — is identity-first, which is the right frame. But most apps fail to actually operationalize this; they ask you to set a goal like "read 30 books" instead of "be a reader."

Curated reader apps (Readwise Reader, Matter, Refind) prove there's appetite for "intentional content," but they stay siloed from your behavior. You read a thing and… it just sits there. There's no link between consuming the article and acting on it.

Notion / Obsidian / Capacities try to be "personal OS" and mostly fail at the OS part because they're substrates, not operating systems — they don't proactively coordinate anything, you have to do all the coordinating.

**The "missing ingredient" — what makes it an OS**

Your instinct that something's disconnected is right. Here's my read: an OS isn't a collection of apps, it's the *thing that decides what runs when and routes resources between them*. If Curate is just (habit tracker) + (curated feed) glued together, it's a bundle, not an OS.

What would make it an OS:

The feed isn't a place you go to scroll. It's *fuel for the habit blocks*. When your habit timer says "ML study, 1 hour," the feed at that moment shows only ML content from your sources. When the timer ends, the feed changes — or closes. Content is not ambient; it's *summoned* by intention. This kills doomscrolling structurally because there's no "default feed" to open. Every piece of content arrives in service of something you committed to.

The habit tracker isn't separate from the feed; it's the *scheduler*. Your goals don't just track completion — they shape what content sources are even active.

There's a feedback loop: things you save/highlight in the feed during a "study ML" block become visible later as "what you actually learned this week," tying consumption back to identity progress. Reading isn't passive when it produces evidence of who you're becoming.

That's an OS-shaped thing. Without something like this, you have a folder of apps with a shared theme.

**The most dangerous trap**

You're building a feed to solve a feed problem. There is a real risk that Curate's feed becomes a more sophisticated, guilt-free doomscroll — "I'm reading my newsletters!" at 1am instead of sleeping. Be paranoid about this. The structural defenses are: no infinite scroll, time-bounded sessions, content tied to active habit blocks, a hard daily cap, no notifications pulling you in. If "open Curate when bored" becomes a habit, you've recreated the problem with extra steps.

---

**Questions for you. Be honest, especially where it's uncomfortable.**

1. **Walk me through a real Tuesday.** When exactly do you open Curate? Morning? Between tasks? In bed? What were you doing right before, and what do you want to be doing right after? I want the *physical, temporal* reality, not the aspirational one.

2. **What is your actual theory of why you scroll?** Boredom, avoidance of harder work, social comparison, genuine curiosity that escalated, transition-numbing between tasks? Different root causes need different solutions, and "curated feed" only solves some of them.

3. **Identity check: are you trying to become one specific thing** (e.g., "a serious ML researcher") **or optimize across multiple lives** (researcher + fit person + good friend + writer)? Curate looks very different in each case. The single-identity version is sharper; the multi-identity version risks becoming Notion.

4. **What's your gut reaction to this constraint:** Curate has no "default feed." You can never just open it and scroll. Content only appears inside an active habit block you started. Does that feel right, or does it kill the product for you? Your answer reveals whether this is a focus tool or a feed tool.

5. **What's the smallest version that would change your behavior for 30 days?** If you could only build three features, which three? I want to see what you're willing to cut.

6. **Where does Curate end and the rest of the internet begin?** Does it replace YouTube/X for you, or does it act as a "lobby" you pass through with intent before going to those apps? (The lobby model is much cheaper to build but maybe less effective.)

7. **What does a successful week look like, concretely?** Not "I felt more productive" — what specific evidence at end-of-week tells you Curate worked? This forces you to define what you're actually optimizing.

8. **What's the relationship between your goals and your feed sources?** Concrete: if your goal this quarter is "learn distributed systems," what changes in your feed? Do you add sources manually, or does Curate suggest them, or do goals tag existing sources?

9. **Honest question: is the habit tracker actually load-bearing, or is it a comfort feature?** If you stripped it out and just had "intention-bound content sessions," would the app still work? I'm not saying remove it — I'm asking whether you've inherited the assumption that "productivity app = habit tracker" without testing it.

Take your time on these — especially 1, 2, and 4. Those are the ones where I expect the answers to reshape the product.



Me:

Welp, you said be honest, here it is:

1. I open it when I wake up. I want to see what I need to do for the day, but realistically I want to scroll as well. If it is a weekday, I do not necessarily have time to scroll for a long time after I wake up, but it has become a (bad) habit of mine to scroll social media once I wake up to, wake myself up. I do want curate to kind of make that scrolling habit 'healthier'? But then, you made good points about it becoming a guilt-free doomscroll, but doomscroll none the less.

2. Boredom and procrastination I guess. Whenever I have deadtime, i impulsively reach for facebook or youtube or something.

3. This is a big one. Umm, to be honest, I want the habit part to encompass a more general role (so that it does recommend me working out for example), but the feed and overall vision is more towards a specific thing. Though my end goal is kind of 'polymathy', which is Math + CS mastery so yeah.

4. My gut reaction is that its healthier that way, but I don't know if I would reach for it instinctively if that's the case. I don't know if that will 'kill' it, but it's just less attractive for me.

5. A feature that sets and tracks daily/weekly goals, a feature for the feed, and notifications I guess.

6. I envision it acting as a lobby. Like if it shows YT videos, it's just embedded in the feed and if I click it I am taken to the YT app (though I have a blocker scheduler for my socmed apps already so yeah)

7. A productive week is: I am not behind on schoolworks, I have studied the extracurricular things I want to study (very important!! I will be basically running a CS self study track alongside my Math undergraduate course), I exercised atleast 3 days in that week, and I was able to do the tasks for my side hustle (if I did have one. I do not right now, but in the future I am plannign to have one). For the extracurricular study track, I will set the goals for that myself, per week.

8. If curate can suggest, then that's actually better. But i want to be able to add YT playlists and curate can pull from that as well.

9. Yes it is load bearing. Me not being able to stick to plans is probably my biggest flaw.

You:
Okay, your answers are doing a lot of work — they've changed my picture of the product meaningfully. Let me reflect back what I'm seeing, because some of what you said contradicts what you said, and the contradictions are where the product actually lives.

**The most important thing you told me**

You said your success metric is "I am not behind." That's defensive. You're not trying to become Terence Tao — you're trying not to slip on what you've already committed to. This is a really useful reframe, because it changes what Curate is for: it's not a *productivity maximizer*, it's a *slippage preventer*. Those are different products. A slippage preventer focuses on commitment integrity, gentle re-entry after misses, and reducing friction to small, regular actions. A maximizer focuses on optimization, streaks, escalation. You're describing the first one. That's good — it's a more honest product and a less neurotic one.

Also worth saying: you're a Math undergrad running a parallel CS self-study track. The formal coursework has external accountability built in (grades, professors, deadlines). The self-study track has none. *That's the part Curate is really for.* Your school stuff doesn't need an OS — your self-directed life does.

**The real tensions in your answers**

*Tension 1: The morning scroll is your highest-risk moment, and you flinched on it.* You said you open the app when you wake up specifically to scroll, you know it's bad, you want Curate to make it "healthier." But here's the thing: morning scroll is exactly where the guilt-free doomscroll risk lives. If Curate's feed is what you reach for at 7am to "wake up," then within 60 days, "I deserve to scroll Curate" replaces "I deserve to scroll Twitter" and you've upgraded the wrapper, not the behavior. This is the single most important design problem in your app. I think you're going to have to choose: either the morning gets a *different mode* (e.g., a 5-item daily brief that ends — no infinite feed, no rabbit holes, just "here's today's must-reads, then close"), or you accept that Curate is a doomscroll product with extra steps. Don't paper over this one.

*Tension 2: You said the habit tracker is load-bearing because you can't stick to plans — but habit trackers don't make people stick to plans.* This is the hard truth. People who can't stick to plans bounce off habit apps every day. If "I can't stick to plans" is your biggest flaw, you should be deeply suspicious of any feature that says "this will fix it." The honest question is: what specifically about Curate's tracker would work for you when others haven't? My guess at the real answer — and I want you to push back on this — is that the *content* is the carrot. You stick to "study ML 1hr" not because the app nags you, but because completing the block unlocks/contextualizes content you genuinely want to consume. The habit isn't tracked, it's *rewarded with the thing you'd reach for anyway*. If that's true, the habit tracker is downstream of the feed, not parallel to it.

*Tension 3: "If Curate can suggest content, that's better."* Careful. The whole premise of Curate is *you* curate. The moment Curate suggests, you're back inside someone's recommendation algorithm — yours, sure, but algorithmic. There's a clean version of this (Curate suggests *sources*, you approve, and only those sources populate the feed) and a dangerous version (Curate suggests *items* pulled from the open web tagged "ML"). The first is fine. The second is YouTube with a different paint job. Pick.

*Tension 4: "Notifications" as a feature.* What for? Habit reminders are fine. "New video from your source!" notifications are how you re-create the engagement-loop you're trying to escape. Be specific about which notifications, because in a focus app, this is the feature most likely to betray you.

**A reframe to consider**

What if Curate isn't an "operating system" but a **commitment device with a content reward**? The structure looks like this: you set a small number of weekly self-study commitments. Each commitment has associated sources you've pre-approved. When you do the work, you get access to the relevant feed. When you haven't, the feed isn't there to scroll. The scrolling impulse becomes the *engine* that pulls you toward the work, instead of the enemy of it. Habit tracking is real but invisible — completing blocks is just how you "earn" the feed.

This might sound punitive but it's actually the gentlest version of what you're describing. The hard version is "block all social media, force willpower." The middle version is "track habits and also have a curated feed." The clever version is "the feed is the reward and the habits are the price." That's an OS-shaped product because everything coordinates around one mechanism.

You don't have to take this reframe — but try it on, and if it doesn't fit, tell me where it breaks.

**Next round of questions**

1. **The morning question, head-on:** if Curate forced you into a "daily brief" mode for the first hour after wake — finite, ends in 10 minutes, no infinite feed — would you still open it? If no, why not? If yes, what would the 10 minutes actually contain?

2. **What does "completing a study block" mean?** If you watch a 1hr ML YouTube video, did you study? If you read 2 papers, did you study? If you wrote 50 lines of code, did you study? You need a concrete answer because otherwise the goal completion is gameable, and you of all people will game it.

3. **Tell me your honest reaction to "the feed is the reward, not a parallel feature."** Does that feel right, manipulative, motivating, or restrictive? Your gut here matters more than your reasoning.

4. **What proportion of the polymathy track is consumption (reading/watching) vs. production (writing/coding/solving)?** Be honest. If it's 80/20 consumption, Curate is a content app. If it's 50/50, Curate has to handle capture/output too — and that's a much bigger product. This determines whether Obsidian-style notes are a v1 feature or a v3 feature.

5. **What's the cost of slippage in your life right now?** If you fall a week behind on CS self-study, what actually happens? Nothing? You feel bad? You give up the track? The severity tells me what kind of intervention the app needs — gentle nudges or hard structural blocks.

6. **You said notifications. What kind, exactly?** Walk me through one notification you'd want to receive, what it says, when it fires, and what you'd do in response.

7. **Side hustle is in your "successful week" list, but you don't have one yet.** Is it actually part of v1, or is it a future-self projection leaking into the spec? If you cut it from the spec, does anything change?

8. **If Curate works perfectly for 6 months, what's *no longer* in your life?** This is the negative-space question. What current habit, app, or behavior gets *replaced* — not augmented? If the answer is "nothing, I just add Curate," then Curate is failing, because you're already overloaded.

Take your time. The question I most want a real answer to is #1, then #3, then #2.


Me:

1. The daily brief mode actually sounds great. The daily brief should probably contain what I accomplished yesterday (to make me feel good), my goals for today, my classes and schedule, and like a daily article? For the daily article part, tbh i am not sure of it, but having something that can spark my curiosity about CS/ML/Math is better than scrolling social media I guess. 

2. Tbh, I want me myself to define that. Like, in my weekly plan I concretely define what I need to study and do and using what. Though one thing's clear, scrolling through the feed and accessing materials through it does not count. This way I won't game it, I won't watch a math video in the feed and say that I accomplished my goal for today or something.

3. It feels "complicated"? I want a feed that motivates me to reach my goals, but having the feed be the actual motivation is, ummm, interesting. That could work I guess. Reminds me of when I was young and my parents would force me to study first before I can watch YT or TV, and even then I could only do so 15 minutes at a time. Also kinda like Pomodoro in that sense.

4. It's 50/50. I want the feed to spark my curiosity and update me on the latest advances of my chosen field (i like watching 5 minute papers for example), but I do not want the app to be just that and the habit part as an after thought. Oh, for obsidian, i am thinking of obsidian integration rather than actually remaking a notes system from scratch, but I don't know how will that work.

5. Honestly? I feel bad, and the more behind I get the worse I feel, and the worse I feel the less motivation I have for continuing. It leads to a downward spiral.

6. Just notifications for my daily goals. No notifs for the feed.

7. Yeah it's a future projection. I guess it does not necessarily change the app whether it's there or not, it's just like my extracurriclar goals, goals I set myself. If we were to design with it in mind, maybe we could tag goals/tasks with academic/extracurricular/work? Oh and also i forgot but I also want a calendar integration feature.

8. Doomscrolling Youtube and Insta will be replaced.

You:

Your answers are getting sharper. A few things just clicked into place that I want to name, because the product is starting to take a real shape — and there's one answer that worries me.

**The thing that worries me**

Answer 5. "I feel bad, the worse I feel the less motivation I have, it leads to a downward spiral." This isn't a feature requirement, it's the most important thing you've told me about yourself as a user, and it should reshape the entire app.

Almost every habit tracker on the market is built for people who succeed most days. Streaks, green checkmarks, "you're on a 14-day run!" — these are euphoric when you're winning and *brutal* when you're losing. For someone prone to downward spirals, a traditional habit tracker is actively dangerous: the moment you miss two days, the app becomes a monument to your failure, and you stop opening it, and the spiral deepens.

So here's a hard design principle for Curate: **the app must be most useful on your worst days, not your best ones.** That means no streaks (or streaks that are extremely forgiving — "5 of last 7 days" not "consecutive"). No red marks, no broken chains. Missed days don't compound visually. The daily brief on a bad day shouldn't open with "you failed yesterday" — it should open with the smallest possible re-entry point. Something like "one thing today" mode, where if you've slipped, the app dramatically reduces the ask instead of presenting the full plan you're already behind on.

This is the difference between an app that helps you and an app that becomes another source of guilt. Given what you said about yourself, get this right or the whole thing fails.

**What's actually crystallizing**

Putting your answers together, I can now describe Curate fairly concretely:

It's a **morning-anchored daily operating layer** for your self-directed life. The center of gravity is the daily brief — not the feed, not the tracker. The brief is what you open every morning, it has a clear end, and it contains: yesterday's wins (small, specific), today's plan (classes from calendar + your self-set goals, tagged academic/extracurricular/work), and one curiosity item from your curated sources. That's the whole morning experience. It ends. You close the app and start your day.

Throughout the day, you mark goal completion manually (you define what counts — that's right, and important). The feed exists but is *not* the default surface. You have to navigate to it intentionally, and it shows content from sources tied to active goals.

The feed is a curiosity tool, not a primary attention sink. Notifications fire only for your stated daily goals — never for new feed content. Obsidian integration is read-only in v1 (Curate can pull notes/highlights to surface in the brief), and writing stays in Obsidian.

Re your "complicated" reaction to the feed-as-reward (#3): you're right to be cautious. The Pomodoro/parental analogy is exactly the failure mode — it makes the tool feel transactional and slightly infantilizing. So I'm walking that idea back. The feed isn't a *reward* you unlock. It's *context-bound*: when you're in a study block, the feed filters to that goal's sources. When you're not, the feed is still there but is the lower-energy "curiosity mode" content. No locks, no gates — just *the right content surfaces at the right time*. This respects your agency. The locks are a different product (and one you'd resent within a week).

Side hustle stuff and the tag system (academic/extracurricular/work) — yes, build the tag system in v1 even though side hustle is hypothetical, because tags are also how the feed knows which sources to pull from for which goals. Tags are load-bearing infrastructure, not a future feature.

Calendar integration: noted, this is essential because your daily brief can't be honest about your day without knowing your class schedule.

**Things I'm now pretty confident about**

The product has three surfaces, in priority order: (1) the daily brief — finite, ends, opens-and-closes; (2) the goal tracker — manual, forgiving, tagged; (3) the feed — context-aware, navigated-to, not pushed. Most apps in this space invert this priority and put the feed first. Curate's whole thesis is the inversion.

The "OS" framing you started with was misleading you a little. Curate isn't an OS in the Notion sense. It's a *daily ritual* with supporting surfaces. That's a smaller, sharper, more buildable product, and it matches how you actually described using it.

The morning brief format you sketched (yesterday's wins + today's plan + schedule + one article) is genuinely good. I'd push you to make the "one article" *one item* — could be an article, a video, a paper, a newsletter excerpt. One item, picked from your sources, tagged to one of your active goals. Not a feed. An item.

**A few sharper questions, fewer this time**

1. **The downward-spiral question, designed for:** what would the app show you on a Monday morning if you completed zero goals last week? Walk me through what you'd want to see. The answer here defines Curate's emotional core more than any other feature.

2. **The "one item" in the morning brief — who picks it?** You from a queue you've built? An algorithm from your sources? Rotates through goals? This is where the curation philosophy becomes a concrete mechanic, and it's worth being specific.

3. **What does "completing a study block" produce, if anything?** You said you self-define what counts, which is right. But: is there an artifact? A 1-line note? A checkbox? Nothing? I ask because if there's *something* — even just "what did you study, in 10 words" — it generates the "yesterday's wins" content for tomorrow's brief. No artifact, no wins content. Worth deciding.

4. **Obsidian integration: what's the minimum useful version?** Pulling daily notes? Pulling specific tags? Surfacing recent highlights? You can't build "Obsidian integration" — you have to build one specific bridge. Which one?

5. **You said you want notifications for daily goals. When do they fire?** Morning (here's today's list)? Per-goal (at scheduled time)? End of day (mark what you finished)? All three creates notification fatigue; one is probably right.

6. **The honest scope question:** if you had four weekends to build a v0 of this for yourself only, what's in it? I want to see whether your spec survives contact with "I have to actually build this." Because this is where most personal-OS projects die — the spec keeps growing and nothing ships.

The first question is the most important. The sixth is the one that will determine whether Curate exists in 6 months or stays an idea.



Me:

1. Oh fuck. Just thinking about not completing my desired goals for a week makes me slightly uneasy. I was thinking of it just adjusting my long term timeline goals to the fact that I missed a week? But if i missed a lot, maybe a catch up plan? I don't know about that though.

2. Something algorithmically chosen based on my goals for today seems to be good.

3. Wow! Having artifacts is a great idea. Yeah, aside from checking the checbox I want to be required to write a description of what I just studied.

4. Recent highlights and notes is probably the way to go. Two features I also thought with obsidian is me being able to write a journal entry through the app and that will be saved to obsidian, and a 'quick notes' where I can write random ideas that pop in head that I want to hold on to.

5. Per goal sounds right.

6. The habit tracker and setter, the daily brief, the feed, the calendar. Just that i guess. 

You:

You have enough to start. The picture is clear enough that more questioning would be procrastination disguised as planning — which, given what you've told me about yourself, is exactly the failure mode to watch for. Let me close this out by reflecting back what Curate is now, naming the two real risks, and giving you a build order.

**What Curate is**

Curate is a morning-anchored daily ritual app for self-directed learners who struggle with follow-through and content overload. It has four surfaces: a daily brief, a goal tracker, a calendar view, and a context-aware feed. The whole product is built around one inversion of the standard productivity app: the feed is not the default surface, and the tracker is forgiving rather than punishing.

The daily brief is the heart. It opens on launch, contains yesterday's wins (auto-generated from the descriptions you wrote when checking off goals), today's plan (calendar events + your self-set goals, tagged academic/extracurricular/work), and one algorithmically-chosen item from your curated sources tied to today's goals. It ends. There is no infinite scroll on the brief.

The goal tracker is manual. You define weekly goals, you define what counts as completing them. Checking off a goal requires writing a short description of what you did — this is non-negotiable, because it's both an anti-gaming mechanism and the input for tomorrow's "yesterday's wins." Goals are tagged. No streaks, or extremely forgiving ones ("5 of 7"). No red marks, no broken-chain visuals. Notifications fire per-goal at scheduled times — that's it.

The feed is context-aware: when you're in a study block for a tagged goal, the feed surfaces content from sources tied to that goal. Outside of blocks, the feed shows lower-stakes curiosity content from your wider source list. It's never the default surface — you navigate to it. Sources are pre-approved by you (YT playlists, newsletters, X/LinkedIn follows). Curate can suggest *sources*, never individual *items* from the open web.

Obsidian integration is two-way but minimal: Curate reads recent highlights and notes (to potentially surface in the brief), and Curate writes two things back — a journal entry feature and a quick-notes capture. Calendar integration is read-only and feeds into the daily plan.

That's the product. It's much smaller than "an OS" and much sharper than what you started with.

**The two real risks**

*The first risk is the morning brief becoming the new doomscroll.* You flinched on this earlier and I want to flag it one more time. The brief must end. Hard stop. When the user finishes the brief, the app should close or show an explicit "you're done, see you tomorrow" state. If you let the brief flow into the feed seamlessly, you've rebuilt Twitter. Design the ending as carefully as you design the beginning.

*The second risk is your answer to question 1 about the bad week.* You said "adjusting timeline goals" or "a catch-up plan." Be careful here — both of those are sophisticated features that can become guilt amplifiers. ("Curate has automatically generated your catch-up plan: 14 hours of make-up study this week.") That's a horror movie for someone prone to spirals. The right answer for v1 is probably much dumber: on a bad week, the brief just shows reduced ambition — "one thing today" mode — and offers no commentary, no plan adjustment, no make-up. Silence is the feature. You can build smarter recovery mechanics later, after you've used the app for 6 months and know what *you* actually need on a bad Monday. Don't pre-build the comfort feature; build the silence first.

**Build order, since you have four-weekends scope**

Weekend 1: goal tracker only. Set goals, tag them, complete them with descriptions, view the week. No brief, no feed, no calendar. Just this. Use it for a week.

Weekend 2: daily brief, pulling from goal tracker + a hardcoded calendar feed. Skip the "one item" for now. Just yesterday's wins + today's plan + class schedule. Use it for a week.

Weekend 3: the feed. Start with one source type — probably YouTube playlists, since that's your actual problem surface. Get the context-binding right (feed filters by active goal). No Obsidian, no newsletters yet.

Weekend 4: the "one item" in the daily brief, pulling from the feed sources. This closes the loop.

Obsidian, X/LinkedIn integration, side-hustle tags, smarter calendar — all v2. Resist them.

**One last thing**

You said in your first message that not being able to stick to plans is your biggest flaw. I want to point out that you just spent four message-rounds clarifying a product spec without bailing, which is itself evidence against your self-narrative. Whether you ship Curate or not, the way you've thought through this — including being honest about the morning scroll and the spiral — is the actual skill the app is supposed to support. The app is downstream of that capacity, not the source of it.

Build the smallest version. Use it on yourself for a month before adding anything. Good luck.
