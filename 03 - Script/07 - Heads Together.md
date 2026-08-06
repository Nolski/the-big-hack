---
type: scene
scene_number: 7
title: Heads Together
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
runtime_estimate: ~4 min
live_cast: "Brendan (+ silent Liam on stage — see Staging)"
ai_video_assets: "[[AI Video Production Tracker|AIV-046 Kristina — the debrief]]"
tags:
  - scene
  - liam-arc
---

# Scene 07 — Heads Together

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)|B2 — The community]]** shortly after [[06 - Good Instinct]] — the debrief where the *truth* of the fix (the machine found, reproduced and fixed it first) reaches a manager. **Seeds B5/B6:** the first time Liam's craft is quietly reappraised as *slowness* in a room he isn't in. The small-scale rehearsal of **[[10 - The Win We Needed]]** (his fate weighed while he's not there) and John's B5 (the masters do the market's arithmetic and it comes out against the handworker).

## Purpose
The comedy curdles in real time, on a two-minute call. Kristina's genuine praise ("you put your heads together!") meets Brendan's honesty (he pointed Claude at the repo; it found, reproduced and fixed the bug), and a decent manager glimpses the arithmetic that will, domino by domino, reprice Liam's craft toward zero: *weeks of the best engineer we have* versus *minutes with the tool, for anyone who knows how to direct it.* Nobody is cruel and nobody is wrong — Kristina's realization is honest and even a little troubled, Brendan tries to shield Liam and cannot lie to Kristina the way he fudged the truth with Liam — which is exactly why it lands. Plant the "weeks vs. minutes" math (returns as the "friction / bottleneck" case in the review, B7), Kristina's new capacity calculation ("an extra engineer on new products"), and her insistence that shielding Liam also prevents him from learning.

## Setting / Staging
A quick Slack call about twenty minutes later. **Brendan is live (Speaker B)** at his desk; **Kristina** answers from her tile on the shared screen, so the scene is cued live against a clip. **Liam** (live, Speaker A) is on stage below the whole time, heads-down, genuinely happy — finishing the same one-line fix Claude already completed on Brendan's private branch — *hearing none of it.* Two live men, twenty feet apart, one of them describing the other to a manager. The audience watches his standing shift in a call he isn't on, the exact mirror of [[10 - The Win We Needed]] — and now the man doing it is close enough to touch. Cool monitor-blue. No hand-off — the scene closes on Liam opening his fix branch for PR while Brendan deletes the local branch Claude finished twenty minutes earlier.

## Live Cast

- **BRENDAN** — live, Speaker B (the debrief): brings the good news, then can't take the credit — honest that Claude had full repo access, found the cause, reproduced it locally with a script and screenshots, and completed the fix branch; admits he did not tell Liam; accepts that shielding Liam also keeps him from learning, but insists he has to ease him into it. The flicker of guilt from [[06 - Good Instinct]], now with words attached.

> [!note] Live/video plane
> Brendan plays these scenes **live at his own desk**, diegetically on the call — he and Liam are remote colleagues, so they share no props and never touch. Everyone else stays on the video plane.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-046]] — Kristina (the debrief):** genuine delight ("you put your heads together!") that curdles the instant she does the math; translates the win into an extra engineer available for new-product work next sprint; is surprised Brendan hid Claude's role, then challenges him: Liam cannot improve if nobody shows him how. Warm and direct, not gloating. Same locked look/voice as `AIV-010`.

---

## Script

*(A quick Slack call on the shared screen — KRISTINA in her tile, BRENDAN in his, mid-afternoon, coffee, the easy tone of two people who like each other. Below, unheard, LIAM at his desk: heads-down, half-smiling, typing — the one-line fix going in. He has no idea this call is happening.)*

**BRENDAN** *(live, easy, pleased)*: Oh — quick thing before you drop. That signup race condition? The ghost one Liam's been chasing forever? It's done. We got it this morning.

> [!screen] VIDEO — KRISTINA · `AIV-046` *(lighting up — genuinely glad)*
> Stop it. The one he wouldn't put a number on? *(delighted)* Brendan, that's *brilliant.* See — this is exactly what I keep saying. You get the right two people in a huddle, you put your heads together, and the thing that's been stuck for a month just… falls out. That's the whole point of pairing. I'm made up.

**BRENDAN** *(live, a beat — he can't quite take that)*: …Yeah. I mean — honestly, though? It wasn't really heads-together. *(a little sheepish)* Claude already had the repo. I pointed it at the signup flow and gave it the symptom. It found the race, reproduced it locally, wrote a script for it — it even gave me screenshots of one test user inside the other's account. Then it made the fix on a branch. I basically just read the diagnosis back to him.

*(A small pause. Something recalibrates behind KRISTINA's eyes — not unkind, just fast.)*

> [!screen] VIDEO — KRISTINA · `AIV-046` *(slower now)*
> …Wait. Hold on. *(working it out)* So — Liam. He's been on this how long? It's been sitting on the board for weeks.

**BRENDAN** *(live, seeing where it's heading)*: …A while, yeah.

> [!screen] VIDEO — KRISTINA · `AIV-046`
> Weeks. And you — this morning — pointed the tool at the repo, and it found the bug, proved it and fixed it. First go.

**BRENDAN** *(live, quiet)*: …Kind of. Yeah.

*(KRISTINA sits back. She's not gloating — if anything it unsettles her. But the number is the number, and she is a person whose whole job is the number.)*

> [!screen] VIDEO — KRISTINA · `AIV-046` *(half to herself)*
> …Do you get how big that is, Brendan? *(not a dig — real)* That's not "a nice bit of pairing." That's the single hardest thing on our board — the thing we route to our most senior person and then just *wait* on — and it's minutes now. For anyone who knows how to use this properly. *(a breath)* That's… that changes a lot, actually.

**BRENDAN** *(live, stepping in for him — quick, protective)*: Okay, but — it's not like that, though. It found it fast, but the code was all laid out clean, the way *he'd* built it. Knowing the shape of it, knowing where to even look — that's the hard part, and that's all him. *(and he hears himself losing the thread)* …He's the best engineer here. That's real.

> [!screen] VIDEO — KRISTINA · `AIV-046` *(gently, not letting him off it)*
> Would it have found it without him, though? If you'd handed it the file cold?

*(A beat. BRENDAN wants to say no. He fudged the truth with Liam easily enough; with KRISTINA, their relationship has room for a kind of openness he cannot bring himself to violate. He cannot lie to her the same way.)*

**BRENDAN** *(live, reluctant)*: …Probably. Yeah. It just — saw it. *(quiet)* It didn't really need him for that part.

*(That lands in the room. Neither of them says the next bit out loud. KRISTINA lets it settle — then the bright manager clicks back into place, with something new tucked behind it now.)*

> [!screen] VIDEO — KRISTINA · `AIV-046` *(brisk again, warm)*
> Right. Well — however it got there, it's fixed, and that's genuinely great, and I get to tell my boss we have an extra engineer to work on new products this coming sprint. *(a beat)* And I want to properly get my head around this. Properly. There's something here.

**BRENDAN** *(live, uneasy — one more, smaller)*: …Yeah. Just — do me a favour? Don't make it a thing. With Liam. He's genuinely made up we got it — happiest I've seen him in ages. Don't take that off him.

> [!screen] VIDEO — KRISTINA · `AIV-046` *(stops — confused)*
> …Wait, what do you mean? You told him you used Claude, right?

**BRENDAN** *(live, caught)*: Well, no… He takes these things a little hard, you know? He put a lot of time into it.

> [!screen] VIDEO — KRISTINA · `AIV-046` *(not angry; genuinely challenging him)*
> Brendan, how is Liam ever going to get better if you don't show him how to do this stuff?

*(They look at each other. A mutual, uncomfortable recognition: she is right about the lesson; he knows more than she does about the cost of teaching it.)*

**BRENDAN** *(live, conceding, careful)*: You're not… wrong. I just have to ease him into some of it.

> [!screen] VIDEO — KRISTINA · `AIV-046` *(warm again — sincere)*
> Well, God bless you for that. I know how thorny he is. *(a smile)* Nice work, Brendan. Really. A win is a win.

*(Her tile blinks out, still smiling. BRENDAN sits a second in the quiet. Below, LIAM leans back from his desk, stretches, genuinely happy. He opens his one-line-fix branch for PR. He heard none of it. On the screen above, BRENDAN watches the empty call a moment; that same flicker crosses his face, the one he still can't name. Then he deletes his local branch — the branch Claude finished twenty minutes ago. The monitor-blue holds on the two of them: the man proudly offering up the fix, and the one quietly erasing the proof that it was already done.)*

---

## Notes
- **Nobody's a villain — that's the horror.** Kristina isn't scheming; she's a decent manager who just watched a productivity truth walk into the room and can't un-see it, and it *unsettles* her as much as it excites her. Keep her warm and a little troubled — the moment she reads as calculating, the scene tips into melodrama. "The kindness is real and useless" ([[Modern World — Supporting]]).
- **Brendan's selective honesty is the engine.** He can fudge the truth with Liam to protect him, but cannot lie to Kristina inside the more open relationship they share. He tells her Claude found, reproduced and fixed it; then admits Liam does not know. Her challenge is fair: protecting him from the truth also prevents him from learning. His "ease him into it" is compassionate, paternalistic and complicit at once.
- **The pivot beat.** The tone turns on Kristina doing the arithmetic out loud: *weeks of our best person* vs. *minutes with the tool, for anyone who knows how to direct it.* Play the delight fully **before** it curdles so the drop is felt, not signposted. Her "extra engineer on new products next sprint" makes the arithmetic concrete without turning her into a villain.
- **Continuity with [[06 - Good Instinct]].** Roughly twenty minutes after Liam's "good instinct, kid." The credit he handed the wrong source in Scene 6 travels *upward* here — and instead of reaching Liam as praise, it reaches a manager as a capacity calculation. End on the branch rhyme: Liam opens his newly finished fix for PR while Brendan deletes the equivalent Claude branch that already contained the repro, proof and fix.
- **Curdle Ledger (logged in [[Themes & Motifs]]).** "You put your heads together!" → the same manager's velocity-instinct reframes Liam as the *bottleneck* (B6) and files "an afternoon, for anyone" as the case against him (B7). Kristina's "there's something here" is the seed of the appetite that becomes the agent-first mandate ([[10 - The Win We Needed]], B5).
- **Mirror / staging rhyme.** The whole scene is a pocket-sized [[10 - The Win We Needed]]: Liam's worth weighed in a room he isn't in, silent below. And it rhymes forward to John's B5 — the masters run the market's numbers and the handworker's skill comes out the wrong side of them, no malice required.
- **Two live men, no contact.** Brendan is live (Speaker B) and cued against Kristina's clip; Liam is live below with no lines. They are twenty feet apart and on separate planes all scene — the closest the play gets to the betrayal happening in the room, without it ever being in the room.
