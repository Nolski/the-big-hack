---
type: scene
scene_number: "1d"
title: The Future
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
live_cast: Brendan
ai_video_assets: "[[AI Video Production Tracker|AIV-010 Kristina — Standup]], [[AI Video Production Tracker|AIV-017 Plan + transcript — on-screen UI]], [[AI Video Production Tracker|AIV-018 CI / canary dashboard]]"
tags:
  - scene
  - liam-arc
---

# Scene 01d — The Future

> [!warning] Cut from the running order in the cut pass
> Kept in the vault as source material, like [[02 - The Loom and the Guild — John half]] and [[16 - The Wage Cut]]. Where it went: the back half moved verbatim into [[01b - The Cursor Demo]], which now runs demo → method → reclassification in one call.

> [!info] Beat
> Last Movement I opener. Brendan calls Kristina to tell her Liam actually felt bad — and the call turns, without anyone deciding it, into the two things that doom Liam: Kristina falls in love with the new way of working (Brendan finally gets to *teach the method* to someone who'll listen), and she quietly reclassifies Liam from "difficult person" to "problem to be managed." Ends on the loom-knock hand-off into the 200-year rewind. Seeds B6/B7/B8.

## Purpose
Move the **meat of the methodology** here — the lesson Liam refused ([[01c - The PR Review]]) is received, eagerly, by the PM who will later hold his review. Two turns happen in one warm phone call: (1) Kristina is *converted* — "this is the future" — and (2) she is *slingshotted* from "oh, he felt bad, he's reachable" to "oh, he's a problem" the moment she learns even Brendan can't get through to him. Brendan's one note of caution (scaling, tech debt) is waved away. Nobody is cruel; the case against Liam is built out of good feeling and excitement, which is exactly why it's unstoppable.

## Setting / Staging
Straight off the PR review — **Brendan**, still sitting with how the Liam call went, starts a Slack huddle with **Kristina**, who's still glowing from the Cursor demo. Two coworker tiles, then a shared screen as Brendan teaches her the review method for real: the plan-mode plan, the session transcript, the CI / canary dashboard. Warm, intimate, fast — the whole scene is one phone call that quietly decides a man's future while talking about how bright everything looks. At the very end the modern world dims and the distant knock of a steam loom comes up under the keyboard-clack: the rewind into John's world. **Brendan is live (Speaker B)**, alone on stage, teaching an empty room — Kristina answers from her tile. Slack-huddle tone under it until the loom takes over.

## Live Cast

- **BRENDAN** — live, Speaker B: finally gets to teach the method to someone who lets him; generous about Liam to the end ("he'd be incredible at this"); the one who voices the caution nobody wants to hear.

> [!note] Live/video plane
> Brendan plays these scenes **live at his own desk**, diegetically on the call — he and Liam are remote colleagues, so they share no props and never touch. Everyone else stays on the video plane.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-010]] — Kristina (PM):** still lit from the demo; thrown to hear Liam apologised; reopens to his technical point; converted by the method ("this is the future"); then the glow dims as she reclassifies him — the manager surfacing under the enthusiast. Ends bright again, having decided nothing out loud and everything underneath.
- **[[AI Video Production Tracker|AIV-017]] — Plan + transcript (on-screen UI):** the review artifact, shown *as the lesson* this time — plan-before-code, the correction transcript. Screen only, no voice; the last modern image to dim into the rewind.
- **[[AI Video Production Tracker|AIV-018]] — CI / canary dashboard (screen graphic):** human-written integration tests green against a partner sandbox; the flagged 5%→100% staged rollout; flat error / latency. Text-on-screen, no voice. The safety net that replaced the midnight line-read — shown here as the answer to Liam's "it marks its own homework."

---

## Script

*(BRENDAN, still sitting with how the Liam call went, rubs his face, then starts a new Slack huddle. KRISTINA picks up, still glowing from the demo. [MUSIC: music/slackhuddle.mp3])*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(bright, still lit up)*
> Hey! Okay, check this out, I just got the slackbot to work with github, so you can close a jira ticket and include the github PR...

**BRENDAN** *(live, a tired half-smile)*: Ha, good. Listen, quick thing. About what Liam said this morning. *(beat)* I talked to him. For what it's worth, he actually feels bad. About mentioning your education. Brought it up himself, first thing, unprompted. Said he shouldn't have said it.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(a beat, genuinely thrown)*
> …Huh. *(beat)* Liam said that? Out loud? *(a small, dry laugh)* I honestly did not know empathy was something he was capable of.

**BRENDAN** *(live)*: Yeah, it surprised me too. He's not *trying* to be a monster. He's just really bad at... well... you know... he's self aware though.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(softening, reconsidering)*
> …Okay. That actually reframes it a little. The thing he said about the code. That it writes its own tests, so of course they pass. Marking its own homework. *(beat)* I dismissed it in the moment because I *w*as obviously upset with him. But he's not wrong about it, is he? It sounds like a real concern. Maybe I should actually be hearing the technical part, it's just frustrating when every week it feels like we can't get through a normal standup.

**BRENDAN** *(live, lighting up — this is the thing he's been dying to explain)*: I'm actually really happy to hear you say that. It's important and he's half right. You *can't* let it grade its own homework. But that's not how you're meant to do it. Can I show you how I actually review this stuff? It'll take two minutes.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> Please. Yes. Show me.

*(BRENDAN shares his screen, a plan-mode plan.)*

**BRENDAN** *(live)*: So the thing liam mention this morning: you read eight hundred lines of AI code top to bottom. Nobody can do that, you'd go blind by line two hundred, that's actually true regardless of who wrote it. So for years human written code was split into smaller patches that are easier to review. But imagine you joined a new company and needed to learn how a service worked. You wouldn't read all the code, you would start with the documentation. So when it comes to AI code, you don't start with the code at all. You start *here*, this is the plan it wrote *before* it touched a single file. It's the documentation, the architecture, the tradeoffs, where the secrets go. That's two pages, and that's where the real decisions live. I read *that* like a hawk.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(leaning in)*
> …Oh. I didn't really *think* about it like that...

**BRENDAN** *(live)*: Exactly that. *(beat)* Then the dangerous parts, the auth, the token handling, anything that can actually hurt someone, I read every line myself. Twice. That's maybe five percent of the diff. The boring ninety-five, the CRUD, the front-end, I skim, and I write evals so it can be tested against the plan, so if it's wrong, the tests catch it.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> But that's his whole point, the AI *writes* the tests...

**BRENDAN** *(live, pulling up the dashboard — `AIV-018`)*: The tests that actually matter, the integration tests, I write those into the plan, and review those carefully. Real partner sandbox, real tokens. *(the rollout graph)* And then it has access to any errors it generates, and part of the plan involves how to resolve and handle errors.

> [!screen] VIDEO — CI / canary dashboard · `AIV-018` *(screen graphic — green integration suite against a partner sandbox; a 5%→100% rollout timeline; flat error / latency)*
> *Christina reads the part of the plan that's about testing*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(quiet awe)*
> …So even though it wrote the tests, *you* architected them?

**BRENDAN** *(live)*: Yeah it's probably the most important part, telling it how to evaluate its work.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(the refrain, and she means it)*
> Brendan, this is the *future.* Do you get that? This is the entire future of how we build things. *(beat)* Everyone still doing it the old way is about to look like they're carving stone tablets.

**BRENDAN** *(live, warm)*: …You sound like Marcus

> [!screen] VIDEO — KRISTINA · `AIV-010` *(bright — the obvious thought)*
> Marcus is a character isn't he... Did you show Liam this? Because if he's genuinely worried about the tests, this is the *answer* to his entire objection. He'd love it.

**BRENDAN** *(live, a beat — the air changes)*: …I tried. *(beat)* I, uh, I couldn't really get it in front of him. *(carefully)* I think I just need to spend a bit more time with him. One on one. To get him to actually sit with it.

*(A pause. Kristina's excitement fades a little)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(slower)*
> …Oh. *(beat)* You "tried." *(beat)* So you struggle with communicating with him too? And you're the one person here he actually likes.

**BRENDAN** *(live, not wanting to bury him)*: …He'll come around. He's the smartest person on the team, Kristina, genuinely. He'll be incredible at this when he finally warms up to it.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(half to herself, the manager surfacing)*
> …Right. "Will be." *(a beat — something recalibrating behind her eyes)* …He's a bit of a challenge, though. Isn't he. Not a bad person. Just a challenge.

*(She sits with it for a half-second)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(the glow returning)*
> …Anyway. God, though, look at this slack bot, ten minutes of work. Imagine the whole team moving like this. Imagine what next quarter looks like. *(genuine)* I haven't been this excited about this job in years.

**BRENDAN** *(live, a small, honest hedge — the one nobody wants)*: I mean one thing, for the record. This was a Slack bot. It's small. I don't actually know how well this holds up on something *huge*, like a giant legacy codebase, years of tangled stuff. And there's a real risk you spin up a mountain of code nobody deeply understands and just… for whatever reason is struggles with larger code bases.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(warm, waving it off)*
> Sure. *(smiling)* We'll figure that out when we're all shipping ten times faster. *(beat)* Right now this is the best day I've had at work in ages. Go, do your actual work. And Brendan? Thank you..

*(Her tile blinks out, still glowing. BRENDAN sits alone.)*

---

## Notes
- **This scene carries the methodology now** (moved out of [[01c - The PR Review]], where Liam refuses to let Brendan speak). The bitter irony is structural: the person who most needs the lesson blocks it; the person who will later use "velocity" to manage him out receives it with delight. Keep the teaching *clean and correct* — plan-over-diff, transcript-as-artifact, risk-based reading, human-written integration tests vs. the AI grading itself, flagged canary + observability, ownership. It should convince the audience too.
- **Two turns in one call.** (1) Conversion — "this is the future," said twice, meant completely. (2) The slingshot — Kristina goes from "he felt bad, he's reachable" to "he's a problem" the instant she learns even Brendan can't reach him. She decides nothing explicitly; she *reclassifies* him, warmly, and moves on. That reclassification is the seed of [[13 - The Performance Review]] / the offboarding.
- **Nobody is the villain.** The case against Liam is assembled out of excitement and good will. Kristina isn't scheming; she's thrilled about the future and quietly done spending energy on the one person who won't get on the boat. That's what makes it land.
- **The caution is the hubris seed.** Brendan's real, correct worry — scaling to large codebases, banked tech debt — is waved away "for future us." Plant it so it pays off later (the thing they'll wish they'd heard).
- **Hand-off:** the loom-knock rewind lives here, at the end of the last opener — cold monitor-blue → warm, keyboard-clack → loom-clack, straight into [[02 - The Loom and the Guild — John half]].
- **"This is the future" refrain:** Kristina says it plainly and repeats it — it should sound like joy, not menace. The menace is entirely in what the audience knows and she doesn't.
