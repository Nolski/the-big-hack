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
ai_video_assets: "[[AI Video Production Tracker|AIV-050 Kristina — Standup (agent-first)]], [[AI Video Production Tracker|AIV-011 Standup grid — ambient]], [[AI Video Production Tracker|AIV-051 Brendan — Standup]], [[AI Video Production Tracker|AIV-055 Doug — Standup]], [[AI Video Production Tracker|AIV-052 Brendan — Huddle]], [[AI Video Production Tracker|AIV-053 Liam's screen — the rig]], [[AI Video Production Tracker|AIV-054 Brendan's screen — the plain session]]"
tags:
  - scene
  - liam-arc
---

# Scene 11b — Best Practices

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B5 — Adopt the machine (the reorg)|B5 — Adopt the machine]]** at the personal level, and **seeds B6/B7**. The all-hands has made the team agent-first; here we finally see Liam *himself* using the tool, and doing it the way only Liam would: locally, on a machine he bought himself, re-reviewed to death. Every mistake grows from an instinct that's genuinely right. He ends slower than everyone and reads that as proof he's the last serious person in the building. The raw material for "friction" (B7) is made here, and so is the first witness: a standup where two engineers burn ten minutes arguing about Chinese backdoors and copyright law while the board sits unmoved. Mirror twin: John's **B5→B6**, with the **deliberate asymmetry** noted below.

## Purpose
Show Liam trying to get on board and turning every good instinct into a liability. He is correct that you don't pipe a proprietary codebase into a third party. He is correct that the mandate and the security policy contradict each other, and that his local rig is the only setup that satisfies both. His best moment is a genuine score off Doug: concede the backdoor premise entirely, then point out that a backdoored model with no network and no tools can't do anything about it — and that the *approved* tools hand their agents a browser and a shell. He may even be correct about copyright. None of it matters, because the room stopped listening two exchanges in. The new element is **Doug**: a second curmudgeon who agrees with Liam that everyone else is doing it wrong, but for opposite reasons, so the two of them cancel each other out in public. Kristina gets talked over and handles it the way PMs learn to. Brendan watches and quietly clocks two things. First, the practical one: Liam is *technically right*, the fix is one paragraph of policy the CEO would rewrite by lunch, and nobody, including Brendan, will spend the capital. Second, the deeper one, which stays in stage directions: the security case is the *stated* reason. What Liam has actually built is a machine that can't threaten him — no hands, no agency, stubs only, every line finished by Liam. He calls it fancy autocomplete, uses it like fancy autocomplete, and gets autocomplete out of it, which proves him right every single day. Plant the "won't get on board / bottleneck" evidence that the org itemises, un-funny, in the review (B7).

## Setting / Staging
The same desk, a few weeks on from the reorg. The agent-first mandate is now just how the team works. **Liam** (live, Speaker A) is at the dual-monitor desk; the standup grid runs on the second monitor, his tile the same camera-off black square, "Liam." New on the desk since last scene: a small silver cube of a computer, expensive, still with the film on one corner. The big monitor is his **rig**: a terminal where an 80-billion-parameter local model crawls out tokens, and a git diff thick with his own hand rewrites. After the standup, a Slack huddle with **Brendan**: Liam shares his screen, and, set apart, angled to the house where the call can't see it, **Brendan's own laptop**, where the plain hosted tool does the same job in seconds. Same spatial rule as Scene 06: two screens, one truth on each, only the house sees both. Liam never crosses onto the video plane. The machine (his local rig, Brendan's session) is on-screen UI only, no voice, written as stage direction. Cool monitor-blue; John's loom half of the stage stays dark. Mid-Movement III; no loom-knock hand-off, it closes on its own image.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-050]] — Kristina (PM):** runs the agent-first standup; gets talked over by the Liam–Doug fight and waits it out with the patience of long practice; parks the debate twice; still lands the gentle, load-bearing note: "I just need you on board." Same locked look/voice as `AIV-010`.
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop, reused from Scene 1):** the coworker tiles, closing tickets and half-listening; during the argument a couple of tiles go very still, the stillness of people muting themselves to sigh.
- **[[AI Video Production Tracker|AIV-051]] — Brendan (standup):** visibly worn down by the argument but professional about it; after Kristina closes, offers to hop on about "the actual webhook thing." Same locked look/voice as `AIV-012`.
- **[[AI Video Production Tracker|AIV-055]] — Doug (standup):** staff engineer, security-brained, every bit as curmudgeonly as Liam and pointed the opposite direction. Jumps the queue with "quick flag," relitigates Chinese models and poisoned weights, wants his objection "noted," garbles the copyright case. Condescending, nasal, relentless, never quite rude enough to sanction. New character; new voice.
- **[[AI Video Production Tracker|AIV-052]] — Brendan (huddle):** honestly impressed by the machine before he clocks what it costs; asks the two questions that matter (tokens per second, time to first token) and lets the answers speak; never gloats when his own screen wins; lets it go at the end with the Scene 06 flicker, older now. Cut to leave gaps for Liam's live lines.
- **[[AI Video Production Tracker|AIV-053]] — Liam's screen (screen graphic, no voice — the rig):** a terminal where the local model emits tokens at a visible crawl; a context-loading progress bar that takes minutes; the autocomplete workflow — he asks for a stub, gets a stub (with a call to a helper that doesn't exist), deletes the imaginary part and hand-fills the body — and a git diff thickening with his own rewrites. No agent panel, no tool calls, no network icon: the machine with no hands. Screen only, written as stage direction.
- **[[AI Video Production Tracker|AIV-054]] — Brendan's screen (on-screen UI, no voice — audience only):** the hosted *agent*, given one plain sentence, opens the handler itself, writes the diff itself, runs the test itself — green in seconds; the exact hands Liam won't grant. Then the security-policy page (owner: Liam, last reviewed 14 months ago); then a half-typed message to Kristina that he deletes. The contrast and the choice Liam never sees. Mirror of `AIV-044`.

---

## Script

*(The same desk, a few weeks later. The memes are gone. New on the desk: a small silver cube of a computer, the protective film still on one corner. On the big monitor a terminal crawls out tokens one… at… a… time, next to a git diff thick with strike-throughs where he's rewritten the machine by hand. On the second monitor the standup grid runs, tiles quietly closing tickets. His tile is the same black square, "Liam — camera off.")*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-050` *(brisk, warm, moving down a fast board)*
> …great, ship it. Okay — Liam. The billing-webhook retry ticket. That's been with you since Monday? Just checking it's not stuck.

**LIAM** *(live, even, a man doing it right)*: It's not stuck. It's in review. The model drafts, I rewrite what's wrong, it merges when I've read all of it.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(gentle)*
> Okay. It's just Marcus had three of those out the door yesterday. Same shape of thing.

**LIAM** *(live)*: Marcus pastes our source into a stranger's computer and hits accept. I run my model locally. The codebase never leaves this machine. Which, I'll point out, is what our own security policy requires.

> [!screen] VIDEO — DOUG · `AIV-055` *(a new tile unmutes — glasses, headset, the tone of a man who has been waiting)*
> Sorry — quick flag. Which model are you running locally?

**LIAM** *(live)*: Qwen. The eighty-B.

> [!screen] VIDEO — DOUG · `AIV-055`
> The Chinese one.

**LIAM** *(live)*: The open one.

> [!screen] VIDEO — DOUG · `AIV-055` *(here we go)*
> It's Alibaba, Liam. I'm just going to say it: you have a Chinese lab's model sitting on our entire codebase, and you're citing the security policy. At us.

**LIAM** *(live, conceding the premise like it costs him nothing)*: Sure. Fine. Say the weights are backdoored. Say Beijing personally trained it to crave our webhook retry code. What's it going to do about it? The box has no network. The model has no tools. It can't run a command, it can't open a socket, it can't touch a file I don't paste in. It types text into a window and I read the text.

> [!screen] VIDEO — DOUG · `AIV-055`
> That is not—

**LIAM** *(live, over him — the jab he's been saving)*: You'd have to be an idiot to worry about backdoored weights and then hand the model internet access and a shell. Which, since we're flagging things, is what the approved tools do. Agents with browser access and command execution, on every laptop in this company, right now. If I wanted to design an exfiltration path, it would look exactly like the thing procurement approved.

> [!screen] VIDEO — DOUG · `AIV-055` *(patient, which is worse)*
> The code is the attack surface, Liam. It doesn't need a socket if you merge what it types. There's a paper on this — a model can write clean code for a year and start slipping vulnerabilities in when it sees a trigger. You can't audit for that. Nobody can audit eighty billion numbers.

**LIAM** *(live)*: Which is why I read every line before it merges.

> [!screen] VIDEO — DOUG · `AIV-055` *(a little smile you could sand a floor with)*
> Oh. Well. If *you* read it.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(finding a gap)*
> Okay — I want to get through the board—

> [!screen] VIDEO — DOUG · `AIV-055` *(over her)*
> Sorry, Kristina, one more flag, because this actually matters. If anything from that model lands in the product, and it comes out later the weights were compromised, that's on everyone in this call. I want it noted that I flagged it.

**LIAM** *(live)*: Noted where, Doug? Nobody's taking minutes. It's a standup.

*(On the grid, a couple of tiles have gone very still — the stillness of people muting themselves to sigh. BRENDAN's tile, camera on, is looking at something off-screen. His own board, probably.)*

> [!screen] VIDEO — KRISTINA · `AIV-050` *(she has done this before; the patience is professional-grade)*
> It is a standup. So — Liam, Doug — take the model debate to a thread. I'd honestly love a doc, it sounds like there's real stuff in there. Not here.

**LIAM** *(live)*: Fine. One thing though, since we're doing policy. The all-hands made AI-assisted development mandatory. The security policy says proprietary source does not go to third-party model providers. I wrote that policy. It's still in force. Local inference is the only setup that satisfies both sentences — so with respect to flags, I'm the only person on this call who's compliant.

> [!screen] VIDEO — DOUG · `AIV-055` *(a short laugh with no joy in it)*
> The approved-tools list is the policy now.

**LIAM** *(live)*: A spreadsheet from procurement doesn't repeal a security policy.

> [!screen] VIDEO — DOUG · `AIV-055`
> It's SOC 2 scoped. Zero retention—

**LIAM** *(live)*: A promise in a PDF.

> [!screen] VIDEO — DOUG · `AIV-055`
> And your Chinese download is what, notarized?

> [!screen] VIDEO — KRISTINA · `AIV-050` *(calling it, warm and immovable)*
> Okay. I'm calling it. Thread. Both of you.

**LIAM** *(live, one hand up — last sentence, and it's material)*: Purely AI-generated code has no copyright. No human author, no protection. If the model writes the whole repo, it is genuinely unclear whether this company owns its own product. That's why I rewrite it by hand. Someone here should still be an author of the thing we sell.

> [!screen] VIDEO — DOUG · `AIV-055`
> That's the monkey-selfie case. It's about a monkey.

**LIAM** *(live)*: It's the same principle.

> [!screen] VIDEO — DOUG · `AIV-055`
> It's a monkey, Liam.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(a breath; the warmth is real, which is somehow worse)*
> Thread. *(beat)* Liam — I hear the compliance point. I'll chase the policy question, that's my job, let me do it. In the meantime I just need you on board with how the team's working. That's all. *(bright, done)* Thanks everyone — that's standup.

> [!screen] VIDEO — BRENDAN · `AIV-051` *(tired around the eyes, still warm)*
> Liam — want me to hop on for twenty about the actual webhook thing? *(beat)* Just the webhook thing.

**LIAM** *(live, a beat — then, almost warm)*: …Yeah. Alright. Come see the setup, actually. You'll like it.

*(The grid blinks out. [MUSIC: music/slackhuddle.mp3] A Slack huddle opens. On the big shared monitor — `AIV-053` — LIAM's rig. BRENDAN's tile in the corner. And, set apart, angled to the house where the call can't see it, BRENDAN's own laptop, lid half open. LIAM is sharing out; he has no idea what's on Brendan's other screen. The audience sees both.)*

**LIAM** *(live, showing off the good version of himself — the craftsman; he pats the silver cube once, like a fender)*: Okay. So. Mac Studio, half a terabyte of unified memory. The eighty-billion Qwen sits resident the whole time, the entire codebase fits in context, and nothing leaves the room. Cost me a used car. Worth every cent.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(genuinely taken with it, for a second)*
> You paid for that yourself?

**LIAM** *(live)*: I wasn't going to let procurement pick my hardware.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(honest, then careful)*
> It's a beautiful machine, honestly. *(beat)* What's it giving you — tokens a second?

**LIAM** *(live, unbothered)*: Generation, eighteen. Twenty on a cold morning.

> [!screen] VIDEO — BRENDAN · `AIV-052`
> And time to first token? With the codebase in context.

*(A pause with a shape to it.)*

**LIAM** *(live)*: It varies.

> [!screen] VIDEO — BRENDAN · `AIV-052`
> Liam.

**LIAM** *(live)*: Six minutes. Sometimes eight. It's reading four hundred files — it's allowed to take longer than a search box. I batch my questions. You learn to think before you prompt, which would do some people on that call a world of good.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(no fight in it, just arithmetic)*
> Sure. It's just — six minutes in, eighteen a second out. On the webhook ticket. How much of your day is watching it type?

**LIAM** *(live, and the honesty is the problem)*: Less than you'd think. *(beat)* Some.

*(On BRENDAN's own screen — `AIV-054`, the audience only — he quietly types one line: "In billing/webhooks.rb, make failed deliveries retry with exponential backoff, cap at 5." The hosted agent opens the handler itself, writes the diff itself, runs the test itself. Green. It had hands, and it used them, and it's done before Liam finishes his sentence. He says nothing.)*

**LIAM** *(live, warming up — this is the part he likes)*: Watch the workflow, though. This is the part everyone skips. *(he types: "Stub a retry wrapper for the webhook delivery call. Signature and skeleton only." The model thinks. Thinks. A method assembles itself one token at a time — a clean stub, and inside it, a call to a helper that does not exist anywhere in the repo.)* There. Gave me the shape, and invented a method that doesn't exist. Looked me dead in the eye while it did it. *(no anger — he deletes the imaginary helper and starts filling in the body himself, comfortable, quick, home)* And that's fine. Because I don't ask it to be right, I ask it to type the boring part. Then I do the job. It's autocomplete, Brendan. Fancy autocomplete. That's all any of this is under the hood.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(careful)*
> You could let it do more than stub, though. Give it the repo, let it run the tests, let it propose the whole— *(he stops)*

**LIAM** *(live, and the door shuts without a slam)*: I'm not giving it hands. It writes text. I decide what the text is worth.

> [!screen] VIDEO — BRENDAN · `AIV-052` *(one more try, gentle)*
> The hosted ones run in a sandbox. The agent can only touch its own branch, it can't—

**LIAM** *(live, batting it away — reasonable, certain)*: On somebody else's computer, through a black box that changes under me on a Tuesday. No. Local, I pin the weights. What I ran in January is what I run in March. That's not paranoia, that's engineering.

*(On the shared screen the stub sits half machine, half Liam, the diff thickening with his handwriting — the part of the job that is still his. He asks it for stubs, so it gives him stubs, so it's a stub machine, so he was right about it all along. On Brendan's laptop, the agent he won't give hands to has already run the test it wrote. Nobody says any of this out loud.)*

*(On BRENDAN's laptop — audience only — a new tab: the security policy. "Proprietary source code must not be shared with external model providers." Owner: Liam. Last reviewed: fourteen months ago. He opens a message to Kristina and types: "re: standup — he's actually right about the policy. it's one paragraph. if the CEO saw it he'd rewrite it by lunch. want me to—" He looks at his own second screen: his sprint board, five tickets, two due today. He holds backspace until the message is gone.)*

**LIAM** *(live, and here's the fact he's armed with)*: And before you say it — everyone keeps saying ten-x. I measured it. Two sprints, same kind of tickets, with the setup and without. I'm slower with it. Measurably. Not a vibe, a number. So either everyone else is measuring the applause, or I'm the only one who checked.

*(A silence. BRENDAN doesn't win this. He can't — Liam isn't wrong that he's slower. The house can see the six-minute load bar, the eighteen tokens a second, the struck-out diff, the beautiful expensive box doing beautifully expensive almost-nothing. Liam can't. He's looking at a true number and reading the wrong cause off it.)*

> [!screen] VIDEO — BRENDAN · `AIV-052` *(a beat too long — then he lets it go, older than he was in Scene 06)*
> …Yeah. No, I hear you. *(beat)* I should get back to it. Ping me if the webhook one gets gnarly?

**LIAM** *(live, softening — he thinks he's been heard)*: Will do. Thanks, Brendan. *(a real, small warmth)* Good — you get it. Nobody else even looks at the code anymore.

*(BRENDAN's tile winks out. On his laptop — `AIV-054`, the audience only — the finished retry diff sits green a moment longer, above the empty message box where the policy fix used to be. The lid closes on both. LIAM turns back to his rig, satisfied, the last serious man in the room. The model puts out the next token. Then, in its own time, the one after. On the standup grid, still up in the corner, a tile marks another ticket Done — not his. He watches his machine type, patient, certain, sinking.)*

*(Hold on the two screens — his, grinding and honest and slow; the closed lid beside it, finished twice over. The monitor-blue eases down.)*

---

## Notes
- **Tone: half-right, curdling.** The Scene 06 rule carried forward — *do not strawman him.* Every position Liam takes is defensible: don't leak proprietary code (his own policy), the mandate and the policy really do contradict each other, and the copyright question is real enough that lawyers bill hours on it. He takes each true thing one notch past useful, in public, at length. Play it straight; let the house do the wincing.
- **Doug is Liam's mirror, not his foil.** Same species of curmudgeon, opposite vector: Liam distrusts the vendors, Doug distrusts the weights. Each is right about roughly half of what he says and neither can hear the other's half. The argument must stay *technically competent* on both sides — the comedy is that it's a good argument happening in the wrong meeting, about risks that don't apply to a billing-webhook retry ticket. Neither debate resolves. Nobody sanctions anyone. That's the point: it's not misconduct, it's friction, and friction is what gets itemised later (B7).
- **Kristina gets spoken over and absorbs it.** She's used to it; her patience is a skill, not a weakness. She parks the fight twice, promises to chase the policy question, and still lands "I just need you on board" — the line the review will quote back. Don't play her as flustered. Play her as a professional filing this standup away.
- **The 1:1 is throughput and quality, nothing else.** No orchestration talk. Two numbers carry the scene: six minutes to first token, eighteen tokens a second. Brendan asks, Liam answers honestly, and the honesty convicts him. The hallucinated helper is the quality beat: an 80B open model on a fat Mac is still not the frontier model, and the gap shows up as a method that doesn't exist. Liam reads it as confirmation of the workflow; the house reads it as the machine he chose.
- **The self-fulfilling prophecy.** Liam believes it's fancy autocomplete, so he uses it as autocomplete: stubs only, no repo access, no tests, no hands. Used that way, it *performs* like autocomplete, which proves him right, every day, forever. Play his hand-editing as pleasure, not chore — filling in the body is the part of the job that's still his, and he's fast at it, and that comfort is exactly what's being priced against him. Brendan names the door once ("you could let it do more than stub") and Liam shuts it without a slam: "I'm not giving it hands."
- **Focalization: the fear wears a badge.** Externally, every hesitation is security and policy — the backdoor concession, the no-network/no-tools rebuttal, the compliance monologue, and it's *good* security thinking; his standup jab at agentic tools genuinely lands (the capabilities that make Brendan fast are, from a pure threat-model view, an approved exfiltration path). Internally it's about control: a model with hands is a model that does the job, and the job is what he spent a career becoming. This is never said aloud by anyone. It lives in stage directions (what his hands do, what he asks the machine for, what he won't let it touch) and in the gap between his stated reasons and the shape of his rig. Don't let an actor or a cue wink at it.
- **He's telling the truth about the number.** The METR beat only works if we believe him: he really is slower, and he really did measure it. Don't undercut it with a smirk. A true measurement pointing at the wrong cause is the trap closing.
- **Brendan's silence gets a second storey.** Scene 06: he doesn't show Liam the finished fix. Here he also doesn't send the message that would actually help — the one-paragraph policy fix the CEO would sign by lunch. He knows Liam is technically right; he knows fixing it means a thread, a meeting, a fight with Doug, and none of it is his job; he has five tickets and two are due today. He holds backspace. That deletion is his B6 step — complicity by inertia, shown on his screen, never spoken.
- **Curdle Ledger (logged in [[Themes & Motifs]]):** "I just need you on board" (Kristina), "I'm the only person on this call who's compliant" and "I'm slower and I measured it" (Liam), "I want it noted that I flagged it" (Doug) → pay off in the review as "won't get on board," "bottleneck," "friction" (B7, [[13 - The Performance Review]]) and in the offboarding framing (B8).
- **Mirror / asymmetry (John).** Loose rhyme with John's **B5→B6** (the factory opens; the community reorganises around the machine). Keep the **deliberate asymmetry** from [[Character Mirror Map]]: John is never *offered* the loom; Liam is *expected* to adopt, and adopting badly hands the system its own justification. There is no clean John twin for "adopts, but wrong"; record it as an asymmetry, not a forced rhyme. No new John scene.
- **Continuity.** Sits after the agent-first mandate ("Adopt the Agent (All-Hands)", B5), personal downstream of [[10 - The Win We Needed]]. Marcus stays off-mic; his velocity runs in the ambient grid. Doug is new here and can recur in B6/B7 if useful (a second name for the review's "peer feedback" to quote). The billing-webhook retry ticket stays deliberately mundane: the easy work is now faster for everyone but him.
