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

*(BRENDAN, still sitting with how the Liam call went, rubs his face — then starts a Slack huddle. KRISTINA picks up, still glowing from the demo. [MUSIC: music/slackhuddle.mp3])*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(bright, still lit up)*
> Hey! Okay, I've already closed four tickets from Slack, I am *obsessed,* I keep finding reasons to—

**BRENDAN** *(live, a tired half-smile)*: Ha — good. Listen, quick thing. About this morning. *(beat)* I talked to Liam after. For what it's worth — he actually felt bad. About the degree line. Brought it up himself, first thing, unprompted. Said he shouldn't have said it like that.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(a beat, genuinely thrown)*
> …Huh. *(beat)* Liam said that. Out loud. *(a small, dry laugh)* I honestly did not know "I was out of line" was in his vocabulary.

**BRENDAN** *(live)*: Yeah, it surprised me too. He's not *trying* to be a monster. He's just really bad at the part where other people are in the room.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(softening, reconsidering)*
> …Okay. That actually reframes it a little. *(beat)* Because — can I say something? The thing he said about the code. That it writes its own tests, so of course they pass. Marking its own homework. *(beat)* I dismissed it in the moment because of *how* he said it. But that's not nothing, is it? That sounds like a real concern. If he felt bad enough to walk the tone back, maybe I should actually be hearing the technical part.

**BRENDAN** *(live, lighting up — this is the thing he's been dying to explain)*: Okay — so that is *exactly* the part I want to show you, because it's the most important bit and he's half right. You *can't* let it grade its own homework. But that's not how you're meant to do it. Can I show you how I actually review this stuff? Two minutes.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> Please. Yes. Show me everything.

*(BRENDAN shares his screen — `AIV-017` — a plan-mode plan, then a session transcript scrolling.)*

**BRENDAN** *(live)*: So the thing everyone pictures is: you read eight hundred lines of AI code top to bottom. Nobody can do that — you go blind by line two hundred, human or machine. So you don't start with the code at all. You start *here* — *(the plan)* — this is the plan it wrote *before* it touched a single file. The architecture, the tradeoffs, where the secrets go. That's two pages, and that's where the real decisions live. I read *that* like a hawk.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(leaning in)*
> …Oh. So you review the *thinking.* Not the typing.

**BRENDAN** *(live)*: Exactly that. *(beat)* Then the dangerous parts — the auth, the token handling, anything that can actually hurt someone — I read every line myself. Twice. That's maybe five percent of the diff. The boring ninety-five — the CRUD, the front-end — I skim, because if it's wrong, the tests catch it.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> But that's his whole point — the AI *writes* the tests—

**BRENDAN** *(live, pulling up the dashboard — `AIV-018`)*: And *that's* the fix. The tests that actually matter — the integration tests — I write those myself. Real partner sandbox, real tokens. It never grades its own work on the stuff that counts. *(the rollout graph)* And then it ships behind a flag. Five percent of traffic first. If the error rate so much as twitches, it rolls itself back and nobody even gets paged. It only went to everyone once it sat clean on real traffic for a full day.

> [!screen] VIDEO — CI / canary dashboard · `AIV-018` *(screen graphic — green integration suite against a partner sandbox; a 5%→100% rollout timeline; flat error / latency)*
> *No voice. Green tests. The rollout graph steps up in two stages. The lines stay flat.*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(quiet awe)*
> …So the safety net isn't a person reading every line at midnight. It's the plan, and the tests *you* wrote, and the canary.

**BRENDAN** *(live)*: That's the whole job now. You've got it in one.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(the refrain, and she means it)*
> Brendan — this is the *future.* Do you get that? This is the entire future of how we build things. *(beat)* Everyone still doing it the old way is about to look like they're carving stone tablets.

**BRENDAN** *(live, warm)*: …Yeah. Kind of. Yeah.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(bright — the obvious thought)*
> Did you show Liam this? Because if he's genuinely worried about the tests, this is the *answer* to his entire objection. He'd love it.

**BRENDAN** *(live, a beat — the air changes)*: …I tried. *(beat)* I, uh — I couldn't really get it in front of him. *(carefully)* I think I just need to spend a bit more time with him. One on one. Get him to actually sit with it.

*(A pause. The glow goes out of KRISTINA's face by degrees — the penny dropping.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(slower)*
> …Oh. *(beat)* You "tried." *(beat)* So it's not just that he had a rough morning and felt bad and he's, you know — reachable. *(quiet)* You couldn't get two minutes of this in front of him either. And you're the one person here he actually likes.

**BRENDAN** *(live, not wanting to bury him)*: …He'll come around. He's the smartest person on the team, Kristina, genuinely. He'd be incredible at this.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(half to herself, the manager surfacing)*
> …Right. "Would be." *(a beat — something recalibrating behind her eyes)* …He's a bit of a problem, though. Isn't he. Not a bad person. Just — a problem. *(beat)* That's twice today I've had to route the whole team around one guy.

*(She sits with it for a half-second — then pulls herself back up into the light, brightening on purpose.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(the glow returning)*
> …Anyway. God, though — look at what we just did in ten minutes. Imagine the whole team moving like this. Imagine what next quarter looks like. *(genuine)* I haven't been this excited about this job in years.

**BRENDAN** *(live, a small, honest hedge — the one nobody wants)*: I mean — one thing, for the record. This was a Slack bot. It's small. I don't actually know how well this holds up on something *huge* — a giant legacy codebase, years of tangled stuff. And there's a real risk you spin up a mountain of code nobody deeply understands and just… bank the tech debt for later. It's not free. It's just moved—

> [!screen] VIDEO — KRISTINA · `AIV-010` *(warm, waving it off)*
> —a problem for future us. Sure. *(smiling)* We'll figure that out when we're all shipping ten times faster. *(beat)* Right now this is the best day I've had at work in ages. Go — do your actual work. And Brendan? Thank you. Really.

*(Her tile blinks out, still glowing. BRENDAN sits alone in the quiet for a beat. Then — faint, under the hum of the huddle tone — the flat mechanical knock of a distant loom. It comes up, and closer. On the screen behind him the plan and the canary graph dim; the cool monitor-blue begins to fail toward warm. Two hundred years fall away.)*

*(On screen — `AIV-017` — the plan and transcript dim out as the light changes; the last modern image to go.)*

*(Hand-off into Movement II — [[02 - The Loom and the Guild — John half]]. The keyboard-clack has become loom-clack.)*

---

## Notes
- **This scene carries the methodology now** (moved out of [[01c - The PR Review]], where Liam refuses to let Brendan speak). The bitter irony is structural: the person who most needs the lesson blocks it; the person who will later use "velocity" to manage him out receives it with delight. Keep the teaching *clean and correct* — plan-over-diff, transcript-as-artifact, risk-based reading, human-written integration tests vs. the AI grading itself, flagged canary + observability, ownership. It should convince the audience too.
- **Two turns in one call.** (1) Conversion — "this is the future," said twice, meant completely. (2) The slingshot — Kristina goes from "he felt bad, he's reachable" to "he's a problem" the instant she learns even Brendan can't reach him. She decides nothing explicitly; she *reclassifies* him, warmly, and moves on. That reclassification is the seed of [[13 - The Performance Review]] / the offboarding.
- **Nobody is the villain.** The case against Liam is assembled out of excitement and good will. Kristina isn't scheming; she's thrilled about the future and quietly done spending energy on the one person who won't get on the boat. That's what makes it land.
- **The caution is the hubris seed.** Brendan's real, correct worry — scaling to large codebases, banked tech debt — is waved away "for future us." Plant it so it pays off later (the thing they'll wish they'd heard).
- **Hand-off:** the loom-knock rewind lives here, at the end of the last opener — cold monitor-blue → warm, keyboard-clack → loom-clack, straight into [[02 - The Loom and the Guild — John half]].
- **"This is the future" refrain:** Kristina says it plainly and repeats it — it should sound like joy, not menace. The menace is entirely in what the audience knows and she doesn't.
