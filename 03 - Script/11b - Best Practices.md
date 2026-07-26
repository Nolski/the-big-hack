---
type: scene
scene_number: 11b
title: Best Practices
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B5 — Adopt the machine (the reorg)]]"
status: drafted
runtime_estimate: ~5 min
live_cast: Liam
ai_video_assets: "[[AI Video Production Tracker|AIV-050 Kristina — Standup (agent-first)]], [[AI Video Production Tracker|AIV-011 Standup grid — ambient]], [[AI Video Production Tracker|AIV-051 Brendan — Standup]], [[AI Video Production Tracker|AIV-052 Brendan — Huddle]], [[AI Video Production Tracker|AIV-053 Liam's screen — the rig]], [[AI Video Production Tracker|AIV-054 Brendan's screen — the plain session]]"
tags:
  - scene
  - liam-arc
---

# Scene 11b — Best Practices

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B5 — Adopt the machine (the reorg)|B5 — Adopt the machine]]** at the personal level, and **seeds B6/B7**. The all-hands has made the team agent-first; here we finally see Liam *himself* using the tool — and doing it the way only Liam would: locally, over-orchestrated, and re-reviewed to death. Every mistake grows from an instinct that's genuinely right (Scene 06's three refusals were half-right too). He ends slower than everyone and reads that as proof he's the last serious person in the building. The raw material for "friction" (B7) is made here. Mirror twin: John's **B5→B6** (the factory opens / neighbours take the jobs) — with a **deliberate asymmetry** (see Notes): John is never *offered* the machine; Liam is *expected* to adopt it, and adopting it badly hands the system the rope.

## Purpose
Show Liam trying to get on board — and turning every good instinct into a liability. This is the scene where the audience watches a genuinely excellent engineer dismantle his own standing while certain he's the only one doing it properly. Keep him half-right the whole way: he's correct that you don't pipe a proprietary codebase into a third party, correct that blindly accepting output is how you ship slop, correct that you own the code you merge. He then takes each true thing one step too far — a crippled local model, an orchestration cathedral, a rewrite-every-token review — until the tool is slower in his hands than no tool at all. He measures that, states it as fact, and he's *telling the truth* — which is exactly why it's lethal. Plant the "he won't get on board / he's the bottleneck" evidence that the org itemises, un-funny, in the review (B7).

## Setting / Staging
The same desk, a few weeks on from the reorg. The agent-first mandate is now just how the team works. **Liam** (live, Speaker A) is at the dual-monitor desk; the standup grid runs on the second monitor, his tile the same camera-off black square, "Liam." The big monitor is his **rig** — a terminal where a local model crawls out tokens one at a time, a config file describing a stack of agents, a git diff thick with his own hand-edits. After the standup, a Slack huddle with **Brendan**: Liam shares his screen, and — set apart, angled to the house, a surface the call can't see — **Brendan's own laptop**, where the plain hosted tool does the same job in seconds. Same spatial rule as Scene 06: two screens, one truth on each, only the house sees both. Liam never crosses onto the video plane. The machine (his local rig, Brendan's session) is on-screen UI only — no voice, no speaker callout, written as stage direction. Cool monitor-blue; John's loom half of the stage stays dark. Mid-Movement III — no loom-knock hand-off; it closes on its own image.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-050]] — Kristina (PM):** runs the agent-first standup; the board moves fast around Liam; asks — kindly — how he's getting on with the new workflow; takes his "I'm doing it properly" without a fight and lands the gentle, load-bearing note: "I just need you on board." Same locked look/voice as `AIV-010`.
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop, reused from Scene 1):** the coworker tiles, closing tickets and half-listening; the velocity Liam is being measured against runs in this loop, not in a rival's mouth.
- **[[AI Video Production Tracker|AIV-051]] — Brendan (standup):** offers to hop on and help unblock — warm, no agenda, the same open hand as Scene 06. Same locked look/voice as `AIV-012`.
- **[[AI Video Production Tracker|AIV-052]] — Brendan (huddle):** sees the rig; is honestly impressed by the craft of it before he clocks what it's costing; floats the simpler path three times, each time conceding Liam's half-right objection first; never gloats when his own screen wins; lets it go at the end with the Scene 06 flicker, older now. Cut to leave gaps for Liam's live lines.
- **[[AI Video Production Tracker|AIV-053]] — Liam's screen (screen graphic, no voice — the rig):** a terminal with a small local model emitting tokens slowly; a config/YAML of named agents (planner → critic → executor → verifier) handing off in a loop; a wall clock or elapsed timer ticking; a git diff where nearly every AI-authored line is struck and hand-rewritten. Screen only, written as stage direction.
- **[[AI Video Production Tracker|AIV-054]] — Brendan's screen (on-screen UI, no voice — the plain session, audience only):** the hosted tool, given a scoped slice of the repo (no prod data, zero-retention), doing the exact task Liam's rig is grinding on — a short diff, a passing test — done while Liam is still explaining his harness. Mirror of `AIV-044`; the audience sees the contrast Liam never does.

---

## Script

*(The same desk, a few weeks later. The memes are long gone; so is the coffee-cup chaos of a man in flow. LIAM sits straighter now, managing something. On the big monitor: a terminal where a local model spits out tokens one… at… a… time; beside it a config file full of named agents; beside that a git diff thick with strike-throughs where he's rewritten the machine by hand. On the second monitor the standup grid runs, tiles quietly closing tickets. His tile is the same black square, "Liam — camera off.")*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-050` *(runs ~13s, Liam plays against it)*
> *Brisk, warm, moving down a fast board.* …great, ship it. Okay — Liam. The billing-webhook retry ticket. That's been with you since Monday? Just checking it's not stuck.

**LIAM** *(live, even, not defensive — a man doing it right)*: It's not stuck. It's in review. I'm going through the agent's output properly before any of it goes near main.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(gentle, genuinely curious)*
> Sure. It's just — Marcus had three of those retry tickets out the door yesterday. Same shape of thing. I only mention it because you've been on the one a while.

**LIAM** *(live)*: Marcus had the agent write them and Marcus hit accept. I'm not doing that. *(beat, not unkind)* I'm running mine locally — the whole codebase does not leave this machine. And I've got it wrapped properly, so it isn't just guessing and me pasting whatever comes out into prod.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(not arguing — but not letting it drift, either)*
> …Okay. And that's — I hear you, the caution's fair. *(a small beat)* I think the ask from the all-hands was less "build the perfect setup" and more "get through the work the way the team's working now." That's all. *(warm, and she means it)* I just need you on board, Liam. Not doing it differently in a corner.

**LIAM** *(live, flat — he hears "on board" and it lands as an insult to the work)*: I am on board. I'm the one on board who read the code.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(letting it go, moving the board)*
> …Right. Ping me if the webhook one gets gnarly. Thanks, everyone — that's standup.

> [!screen] VIDEO — BRENDAN · `AIV-051` *(easy, a hand up — no agenda)*
> Hey — Liam, if it's fiddly I'm happy to hop on for twenty? I did the Marcus ones, I know where the retry bodies are buried.

**LIAM** *(live, a beat — then, almost warm)*: …Yeah. Alright. Come see how I've got it set up, actually. You'll like it.

*(The grid blinks out. [MUSIC: music/slackhuddle.mp3] A Slack huddle opens. On the big shared monitor — `AIV-053` — LIAM's rig. BRENDAN's tile in the corner. And, set apart, angled to the house, the call can't see it — BRENDAN's own laptop, a plain hosted session open at a blank prompt. LIAM is sharing out; he has no idea what's on Brendan's other screen. The audience sees both.)*

**LIAM** *(live, showing off the good version of himself — the craftsman)*: Okay. So this is the setup. I'm not letting a model just freewheel through our codebase. *(gesturing at the config)* It's got a planner, a critic, an executor, and a verifier. The planner drafts, the critic tears it apart, the executor implements what survives, the verifier checks it against the plan. It reviews its own work before I ever see it.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(and he is, genuinely, a little impressed)*
> …Honestly that's kind of beautiful. *(beat, careful)* Can I ask — how long's it been running on the webhook thing?

**LIAM** *(live, glancing at the timer, unbothered)*: This pass? Forty minutes, maybe. It's thorough. The four of them go back and forth until they agree.

*(On BRENDAN's own screen — `AIV-054`, the audience only — Brendan quietly types one line: "In billing/webhooks.rb, make failed deliveries retry with exponential backoff, cap at 5. Here's the handler and its test." He pastes a scoped slice — no keys, no prod data — and hits enter. The tool returns a short diff and a green test almost at once. He does not say so.)*

> [!screen] VIDEO — BRENDAN · `AIV-052` *(gently, offering a door)*
> That's — that's a lot of machinery for a retry loop, though? *(beat)* Like — you could just ask one of them for the diff and read it yourself. You're a better critic than the critic.

**LIAM** *(live)*: And trust that it did it right? No. That's the whole trap everyone's fallen into. *(scrolling the strike-through diff)* Look — this is its output, and this is mine. I read every token it writes and I rewrite the half that's wrong. I'm not signing my name to code I didn't write.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(nodding — he agrees, and that's the problem)*
> No — you should own what you merge, a hundred percent. *(beat, tentative)* But you're rewriting basically all of it. If you're doing the whole job by hand anyway… what's the model actually for?

**LIAM** *(live, and this is the one he's proudest of)*: It's for the parts that are safe. And it stays local because I'm not shipping our source to a third party so it can train on us. *(pointed)* You know that's literally the policy. I wrote it. "No proprietary code to external models." So no, I'm not pasting our repo into someone's cloud like it's a search box.

*(On BRENDAN's screen — `AIV-054`, the audience only — the finished retry diff sits there, done and green, from a slice that never contained a secret or a real user. He looks at it, then at Liam's forty-minute timer still ticking. He eases the lid down an inch, the way he did in Scene 06.)*

> [!screen] VIDEO — BRENDAN · `AIV-052` *(quiet, and he means the first half completely)*
> You're right about the policy. You are. *(beat)* But the hosted one doesn't have to see the repo. You give it the one file and the test — zero retention, nothing stored — and it never touches anything you'd care about. It's not the cloud that's the risk. It's what you hand it.

**LIAM** *(live, batting it away — reasonable, certain, wrong)*: It's a black box I can't audit. Local, I can see the weights, I can pin the version, I know exactly what I'm running. *(beat)* I'm not building my workflow on somebody else's API that changes under me on a Tuesday. That's not caution, that's just — engineering.

*(He types a prompt into his local rig. The little model thinks, and thinks, and produces a function that calls a helper that does not exist anywhere in the repo — because it was never given the repo. LIAM catches it, a grim little nod, and strikes it out.)*

**LIAM** *(live, gesturing at it like it proved him right)*: See? *That.* It just invented a method that isn't there. Hallucinated it, cited it, looked me dead in the eye. *(rewriting the line by hand)* That's what everyone's shipping to prod at four times my velocity. I'll take slow.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(as gently as he can — because he knows why it happened)*
> …It made that up because it can't see the file the helper's in. *(beat)* If it had the codebase it wouldn't— *(he stops himself; not worth it)*

**LIAM** *(live, riding past it, and here's the fact he's armed with)*: Look — everyone keeps saying ten-x. I actually measured it. Two sprints, same kind of tickets, with the setup and without. *(beat, and he's telling the truth)* I'm *slower* with it. Measurably. Not a vibe — a number. So either everyone else is measuring the applause instead of the work, or I'm the only one who checked. *(a short, certain breath)* And I know which one I'd bet on.

*(A silence. BRENDAN doesn't win this. He can't — because Liam isn't wrong that he's slower. The house can see the forty-minute timer, the struck-out diff, the crippled little model, the four agents arguing with each other. Liam can't. He's looking at a true number and reading the wrong cause off it.)*

> [!screen] VIDEO — BRENDAN · `AIV-052` *(a beat too long — then he lets it go, older than he was in Scene 06)*
> …Yeah. *(quiet)* No, I hear you. *(beat)* I should let you get to it. Ping me if the webhook one gets gnarly, yeah?

**LIAM** *(live, softening — he thinks he's been heard)*: Will do. Thanks, Brendan. *(a real, small warmth)* Good — you get it. Nobody else is even looking at the code anymore.

*(BRENDAN's tile winks out. On his laptop — `AIV-054`, the audience only — the finished retry fix glows a second longer, then the lid closes on it. He never showed him. LIAM turns back to his rig, satisfied, the last serious man in the room. On the standup grid, still up in the corner, a tile marks another ticket Done — not his. His local model crawls out one more token. He watches it come, patient, certain, sinking, and does not look at the timer.)*

*(Hold on the two screens — his, grinding and honest and slow; the closed one beside it, finished. The monitor-blue eases down.)*

---

## Notes
- **Tone: half-right, curdling.** This is the Scene 06 rule carried forward — *do not strawman him.* Every objection is a real one: don't leak proprietary code (his own policy, and the one refusal that was fully right in Scene 06); don't blind-accept AI output (the cold open's whole thesis); own what you merge. He's not stupid and he's not paranoid. He takes each true thing one notch past useful, and the compounding is the tragedy. Play it straight; let the house do the wincing.
- **He's telling the truth about the number.** The METR button only works if we believe him: he really is slower, and he really did measure it. The horror is that a true measurement can point at the wrong cause. Don't undercut it with a smirk — the audience should feel the trap close precisely *because* he's being rigorous.
- **The three anti-patterns, each with its half-right root:** (1) **Crippled local model** — right that you don't hand your source to a third party; wrong that "local" is the only safe option, so he runs a model too small to do the job and blames the category. Brendan's screen refutes it: a scoped slice, zero retention, never touches prod. (2) **Over-orchestration** — right that guardrails beat blind-accept; wrong that a planner/critic/executor/verifier cathedral beats one good engineer reading one diff. Forty minutes to Brendan's ten seconds. (3) **Control-freak review + context starvation** — right that you review what you merge; wrong to rewrite every token *and* deny it the repo, which guarantees the hallucination he then holds up as proof. The invented helper exists because he starved it of the file.
- **Brendan uses it well — again — and again chooses silence.** Same structure as Scene 06: he does it right (scoped, no prod data, reads the diff), gets the result, and doesn't show Liam. The flicker returns, older; the offered hand is starting to close. This is a step on his B6 arc (the coworkers who go quiet).
- **Curdle Ledger (logged in [[Themes & Motifs]]):** "I just need you on board" (Kristina) and "I'm the only one who read the code" / "I'm slower and I measured it" (Liam) → pay off in the review as "won't get on board," "bottleneck," "friction" (B7, [[13 - The Performance Review]]) and in the offboarding framing (B8). Pays off Scene 06's "good instinct, kid" and the three refusals: the rigor that was admirable is now the thing being priced as obstruction.
- **Mirror / asymmetry (John).** Loose rhyme with John's **B5→B6** (the factory opens; neighbours take the jobs; the craftsman is left out as the community reorganises around the machine). But flag the **deliberate asymmetry** from [[Character Mirror Map]]: John is *never offered the loom* — he's offered destitution, and the "refuse and die anyway" seat belongs to Old Hilse. Liam's distinctly-modern cruelty is that he *is* expected to adopt and retrain, and — adopting badly — he hands the system its own justification. There is no clean John twin for "adopts, but wrong"; record it as an asymmetry, not a forced rhyme. Note only — no new John scene.
- **Continuity.** This sits after the agent-first mandate ("Adopt the Agent (All-Hands)", B5) and is the personal downstream of [[10 - The Win We Needed]]. Marcus is referenced (the fast-adopter foil) but stays off-mic here — the velocity Liam is measured against runs in the ambient standup grid, not a rival's mouth. The billing-webhook retry ticket is deliberately mundane: the point is that the *easy* work is now faster for everyone but him.
