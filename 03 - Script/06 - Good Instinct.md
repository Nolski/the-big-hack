---
type: scene
scene_number: 6
title: Good Instinct
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
live_cast: Liam, Brendan
ai_video_assets: "[[AI Video Production Tracker|AIV-040 Kristina — Standup day two]], [[AI Video Production Tracker|AIV-011 Standup grid — ambient]], [[AI Video Production Tracker|AIV-048 Marcus — Standup day two]], [[AI Video Production Tracker|AIV-043 Liam's screen — session handler]], [[AI Video Production Tracker|AIV-044 Brendan's screen — Claude session]]"
tags:
  - scene
  - liam-arc
---

# Scene 06 — Good Instinct

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)|B2 — The community]]** the morning after the cold open, and **seeds B3/B4** (the machine does Liam's proudest trick — privately, for the audience only — and he credits the human). The AI coding tool makes its first appearance doing *real, load-bearing engineering*, not boilerplate: it solves the race condition Liam flagged unestimated in [[01 - Cold Open — The Standup]]. Mirror twin: John's **B3/B4** (the loom marvel / "people still pay for good cloth") — a lad quietly matching the master's finest work with a machine.

## Purpose
Re-open Liam's world the morning after the cold open and turn the screw one turn quieter. Yesterday he was cruel; today he's *likeable* — a real engineer, genuinely stuck on a real bug, and briefly a generous mentor. That's the trap. While he lectures the junior on everything the machine can't do — and each objection is at least half-right — the machine quietly does the one thing he is proudest of being able to do, on a screen he can't see, wearing the junior's face. He solves it himself, live (the craft is real), and thanks the wrong source. Plant the credit-misattribution and the "it can't reason about X" hubris so both come back un-funny when the same skill is repriced to zero (B5–B7).

## Setting / Staging
The same desk as the cold open, the next morning — but no memes today. **Liam** (live, Speaker A) is actually working: deep in the session-handler code on the big monitor, headphones half-on, a scatter of coffee cups. He has been at this a while and it shows. On the second monitor the standup grid runs; his own tile is the same camera-off black square, "Liam." After the standup clears, a Slack huddle: Liam shares his screen; **Brendan** is live at his own desk in his own pool of light; and — angled to the house, where the call cannot see it — Brendan's laptop, where a Claude Code session runs, silent. The dramatic irony is spatial — two screens, one truth on each, and only the house sees both. **Now the second truth has a body attached**: the audience watches a live man read the answer and choose not to say it. The machine is on-screen UI only: no voice, no speaker callout, written as stage direction (same rule as the Cursor demo in Scene 1). The two live men are on a call, never in a room — no contact. Cool monitor-blue throughout; John's loom half of the stage stays dark. This scene sits mid-Movement III (Liam continues into the Demo), so there is **no** loom-knock hand-off — it closes on its own image: the two screens, one of them quietly shut.

## Live Cast

- **BRENDAN** — live, Speaker B (standup): offers to help; takes Liam's "it's the deep end" gently; glad to be invited in.
- **BRENDAN** — live, Speaker B (huddle): into the bug with Liam; floats three approaches, concedes the one that's genuinely right (no prod data in the model), then lands the Socratic "what's the id keyed on?" question; the modest deflection and the flicker of something he can't name. Cut to leave a gap for Liam's live realization.

> [!note] Live/video plane
> Brendan plays these scenes **live at his own desk**, diegetically on the call — he and Liam are remote colleagues, so they share no props and never touch. Everyone else stays on the video plane.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-040]] — Kristina (PM):** runs the day-two standup; pushes Liam for a direction on the still-open race condition using support-volume arithmetic (four reports versus other tickets affecting hundreds); takes his fair correction that cross-account access is a security problem, not a ticket-volume problem; blesses the pairing.
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop, reused from Scene 1):** the half-listening coworker tiles under the standup.
- **[[AI Video Production Tracker|AIV-048]] — Marcus (standup day two):** **the first real history in the play, and it arrives grievance-first.** Opens on his own three merged tickets and the fact that he couldn't tell you what's in them — thrown away, taken as a joke. Then a plain complaint about the quality of what this team is shipping, and only *then*, when Kristina tries to move on, the history, as evidence for the complaint. **He never says the word; Liam supplies it.** About twenty seconds, clear and accurate, finishing on Brendan's shipped PR without saying Brendan's name. Same locked look and voice as `AIV-019` and `AIV-055`.
- **[[AI Video Production Tracker|AIV-043]] — Liam's shared screen (screen graphic, no voice):** the session handler / `getOrCreateSession`, the "#incident — logged in as someone else" thread, the token-RNG dead ends he has been chasing.
- **[[AI Video Production Tracker|AIV-044]] — Brendan's private screen (on-screen UI, no voice — the machine):** Claude Code already has the full repository. Brendan directs it to investigate the signup/session race without pasting code or prod data. It traces the flow across the repo, writes a deterministic local repro harness, runs two concurrent signups, and returns the diagnosis with logs plus screenshots showing one local user briefly inside the other's account. The one-line fix and shared-store smell sit underneath. The audience sees the proof; Liam never does. The machine's first real engineering turn; mirror of the steam looms.

---

## Script

*(At Liam's desk, the morning after. No memes today. LIAM is actually working hunched in, headphones half-on. He has been at this a while and it shows. On the second monitor the standup grid is already running; his tile is the same black square, camera still off. He is not really in the meeting. He is in the race condition he's tasked with fixing.)*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-040` *(brisk, running the board)*
> …lovely, thanks Brendon. Marcus, anything blocking you?

> [!screen] VIDEO — MARCUS · `AIV-048`
> Nothing blocking. Three tickets, all merged... by Claude.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(taking it as a joke, moving on)*
> Ha. Great. Liam...

> [!screen] VIDEO — MARCUS · `AIV-048`
> Sorry, can I say one thing that isn't a ticket? It's quick.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(the pause of a woman who has been here before)*
> Is it quick? Remember we agreed to time limits Marcus...

> [!screen] VIDEO — MARCUS · `AIV-048`
> It's quick. It's true that shipping features faster than we ever have, but we're also just getting turned into sweat shop workers hitting approve on Claude.

> [!screen] VIDEO — KRISTINA · `AIV-040`
> Marcus, we agreed on not bringing this up during standup...

> [!screen] VIDEO — MARCUS · `AIV-048` *(going anyway, and this is the first real history in the play)*
> No Kristina, because this has all happened before. In the 1700's there were power looms driven by steam that were unsafe to operate but could make textiles way faster than the workers of the time, who used to work from home and were well compensated...

**LIAM** *(live, headphones half on, eyes still on the code)*: They lost, by the way.

> [!screen] VIDEO — MARCUS · `AIV-048`
> ...What?

**LIAM** *(live)*: The Luddites. They lost. They got hanged by the British army. Anyway, *(beat)* I'm trying to read this code. Please stop talking about the Luddites.

> [!screen] VIDEO — MARCUS · `AIV-048` *(not done)*
> It isn't only them. Do you know how a port worked before the shipping container? Hundreds of men would take a whole week to unload one ship. Then somebody puts the whole cargo in a steel box, a crane lifts the box, and the ship is done in a day. Do you think that wouldn't affect the dock workers and their daily workout?

> [!screen] VIDEO — KRISTINA · `AIV-040` *(trying)*
> Marcus...

> [!screen] VIDEO — MARCUS · `AIV-048` *(going anyway)*
> The dockworkers on the West Coast saw it coming. They made a deal that they'd all still work but the companies would get to use the shipping containers. The savings paid them! It worked. *(beat)* It worked because nothing moved through that port without them. But what have we got? This website barely needs us to keep going.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(pleasant, immovable, moving the board on)*
> Okay. Marcus, you got your word in, thanks. *(brisk)* Liam. You're still on the signup race condition, yeah? Where are we with that one?

**LIAM** *(live, not looking up, still reading code)*: Still on it. No blockers.

> [!screen] VIDEO — KRISTINA · `AIV-040`
> *Gentle, but she needs something.* Right, that's what you said yesterday, though. It's been open a while now. Is there any movement? Any updates I can add to the ticket?

**LIAM** *(live, the flat patience of a man explaining the obvious)*: It's a race condition, Kristina. I don't debug in a straight line. You don't "make progress" on one of these, you stare at it until you figure it out, and then it's done. *(beat)* It's not a burndown chart. I'm still staring.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(not rising to it, typing)*
> …Okay. I'm trying to make the tradeoff visible. We've had four reports in three months; behind it we've got tickets affecting hundreds of users. I need some sense of whether this is another day or another week.

**LIAM** *(live, finally looking up — sharp, but right)*: Four people got dropped into somebody else's account. That's not a support-volume question. That's a security issue. If it happens once, it's a security incident; if it happens four times, we stop counting tickets and fix it.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(takes the correction; no defensiveness)*
> Fair. You're right.

**BRENDAN** *(live, easy, genuine — a hand up, not a challenge)*: I could jump on it with you if you want? I've had my head in the auth stuff all week anyway, happy to be a second pair of eyes.

**LIAM** *(live, a soft, kind-sounding condescension)*: …That's good of you. It's a concurrency bug, though, down in the session handler. *(beat, not unkind)* No offence. It's just... this is the kind of thing that takes a while to even *see*.

*(He hears himself say what he said outloud, and thinks back to yesterday...)*

**LIAM** *(live, softening, almost warm)*: …Actually. No. Come look at it with me. *(beat)* You'll learn more from one real race condition than a month of tickets. Free for twenty minutes after this?

**BRENDAN** *(live, lighting up)*: Yeah for sure. I'd love that, honestly. I'll ping you the second we're done.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(pleased — a manager watching a good thing happen)*
> Oh, I love that. Pair on it. *(brisk)* Right, that's the board. Thanks, everyone.

*(The grid blinks out tile by tile. [MUSIC: music/slackhuddle.mp3] A Slack huddle request lights Liam's screen: BRENDAN. He takes it without looking up.)*

**LIAM** *(live, in his element now — the version of him people like)*: Okay. So. *(scrolling the thread)* Four users in three months. Each one signs up, and for about a second they're… in someone else's account. Someone else's name, someone else's email, right there on the screen. Then it clears. *(beat)* And I cannot reproduce it. I have tried everything. Ten thousand signups in a loop, locally, nothing. It only ever happens out there. In prod. Under real traffic.

**BRENDAN** *(live, leaning in, genuinely into it)*: Okay, that's kind of horrifying. *(beat)* Where've you been looking?

**LIAM** *(live)*: Token generation. The session tokens. If two people ever got issued the same token, that would do it, so I've been pulling apart the RNG, the entropy source, the signing. *(beat, frustrated)* And it's all fine. It's textbook. That's what's killing me the one place it should be, it just… isn't.

**BRENDAN** *(live, careful, offering)*: Can I ask a dumb thing? *(beat)* Have you tried pointing Claude at the repo and asking it to investigate the signup flow?

*(On BRENDAN's own screen Claude Code is already open at the repository root with full repo access. He types: "Investigate the signup/session flow. Rarely, a newly signed-up user briefly sees another user's account. No production data. Find a local repro and root cause." He hits enter. The tool starts traversing controllers, models, tests and the session store. No pasted handler, no logs, no voice; text on a screen LIAM cannot see.)*

**LIAM** *(live, a short laugh — not cruel, just certain)*: It can't. That's the thing everyone gets wrong about it. It can't *reason* about concurrency, it's autocomplete with good manners. It has no model of two threads interleaving. *(beat)* You point it at this, it sees the word "session," it pattern-matches to "add a mutex," and now I've got a lock on the hottest path in the app and a *deadlock* in prod. No thanks.

**BRENDAN** *(live, nodding, tries another door)*: Fair. What if you gave it reproduction steps first though so it has something to eval against?

**LIAM** *(live)*: That's the whole problem, though. I can't make it fail on demand. It's one in fifty thousand signups, only under real load. *(beat)* There's no red test to hand it. And if I hand it a green one, it'll "fix" the bug, tell me it's solved, and be lying, same as it always is. And it'll sound completely sure while it does it.

*(On BRENDAN's screen claud has stopped searching and started working. It writes a local repro script with a barrier that holds two signup transactions at the same time, then it starts the app, launches two browser sessions and runs them together. `REPRODUCED`. Two screenshot thumbnails appear: in the first browser, ALICE's fresh signup briefly shows BOB's name and email. Underneath, Claude walks back from `getOrCreateSession` and lights one line. BRENDAN's eyes move from the screenshots to the diagnosis, quickly.)*

**BRENDAN** *(live, one more, tentative)*: Okay one last idea with claude, then I'll shut up. The incident thread's got the actual prod logs from when it happened. What if I dropped those in claude, the real ones and see if there's

**LIAM** *(live, sharp — the one objection that's flat-out right)*: No! You do not paste production session data into a third-party model. Those logs have live tokens in them. Real users' emails. *(beat)* That's a PII incident and a security review all by itself, that's exactly the "just paste it in and see what happens" thinking that gets a company on the news. *(catching himself — Brendan built the portal — a beat)* …come on Brendan, you know better...

**BRENDAN** *(live, quietly — and he means it)*: No, you're right. You are. Forget that one.

*(On BRENDAN's screen the answer sits there now, finished and proved: the deterministic repro script, paired browser screenshots, a short diagnosis, and one line of the controller lit up on the `getOrCreateSession` call. Beneath it: a one-line fix on a completed local branch, plus a second note flagging the shared session store as the deeper problem. He reads it twice. He now knows. He turns back to the call.)*

**BRENDAN** *(live, offhand, like it just floated up — the dumb-question voice)*: …Okay, this is probably nothing. But can you scroll up? To where signup actually calls the session thing. *(beat)* That `getOrCreateSession`, what's it keyed on?

**LIAM** *(live, scrolling up, humouring him)*: The user id. It keys the session on the user id.

**BRENDAN** *(live, carefully — leaving the door open, not walking through it)*: Right, but that call's *before* the commit, isn't it? The database row hasn't actually landed yet. *(beat)* So for that one moment… what's the id? Is it the real one yet?

*(LIAM stops. Actually stops. His eyes go to the top of the function, then down, then back up tracing it. The cursor hovers. When he speaks it's quiet, almost to himself.)*

**LIAM** *(live, slow)*: …It's zero. *(beat)* The id is zero until the transaction commits. It defaults to zero. *(faster now, up out of the chair)* So two signups in the same tick they both call `getOrCreateSession` with id zero. They both key on zero. *(beat)* They get the *same* session. *(beat)* One of them gets handed the other one's login. *(quiet, stunned)* …It was never the tokens. It was never the crypto. It's a check-then-set on an id that isn't there yet. *(a breath)* One line. It's one line. It's been one line this whole time.

*(He turns genuinely lit up, the most alive he has been, and looks into the webcam at BRENDAN.)*

**LIAM** *(live, warm — no condescension left in it)*: …That's a hell of a catch, Brendan. *(beat)* How did you even.... that's the *one* place I wasn't looking. That's real instinct. *(a real smile)* Good instinct, kid. Seriously.

**BRENDAN** *(live, a modest deflection — and something underneath he can't name)*: …I dunno. It just looked a bit off to me. *(a small, uneasy beat)* Lucky guess.

*(LIAM is already dropping back into the code, buzzing, typing the one-line fix happy, restored, the craft-love back in his hands. He doesn't look at the other screen. He wouldn't think to. On BRENDAN's laptop Claude's proof glows a second longer: `REPRODUCED`, the two screenshots, the script, the completed one-line-fix branch and the shared-store warning. Then BRENDAN quietly checks out the main branch. He leaves the fix branch dangling on his computer. He does not show Liam. He lets the huddle go.)*

*(LIAM types on, warm and none the wiser. Hold a moment on the two screens, his, bright and moving, and on brandon's just a blinking cursor from a rolled back commit.)*

---

## Notes
- **The Marcus beat is the allegory, not a history lesson, and the order is the whole thing.** **Grievance first, history second.** He opens on something that is happening *now*, on this team, that anyone in the audience recognises — the work going out isn't as good, everyone has noticed, nobody says it — and the history arrives only when Kristina tries to move him on, as *evidence for a complaint he was already making*. An earlier draft opened *"So I went and read about the Luddites last night"*, which made it homework and made him a teacher. **Cut that framing wherever it reappears.**
- **He never says the word in this scene. Liam does.** Marcus tells the whole thing without naming them, and Liam supplies the name and the only fact he owns in the same breath: *"The Luddites. They lost."* That pays off the objection Marcus never finished in [[01 - Cold Open — The Standup]] and it is much better than Marcus announcing his own subject.
- **Everything he says is accurate and none of it is trivia.** They weren't against machines; cheaper yarn meant more work for them; what they went after were the frames turning out bad cloth fast in untrained hands; the cloth did get worse and the men who could tell were the ones let go. Plain words, about twenty seconds, then landed on the thing that actually happened in this room yesterday: eight hundred lines shipped that nobody read. **The audience should come out of it understanding the Luddites better, and should also be slightly embarrassed for him.**
- **"I couldn't tell you what's in any of them" is the adopter thread and it must be thrown away.** He is the fastest person on this team and it unsettles him, and he says so once, as a joke he isn't entirely making. **Kristina takes it as a joke and moves on. Nobody follows it up, here or ever.** Do not expand it, do not give it a beat, and do not let Liam hear it.
- **He uses Brendan's PR to make his point, on a call Brendan is on, four days after Kristina thanked him for it.** Nobody names it. That is the small unbearable thing this beat owes the guard rule in [[Modern World — Supporting]].
- **Liam is not a Luddite expert and must never sound like one.** He knows one thing, which is the thing everybody knows: they lost. He is not correcting Marcus, he is trying to get him to stop talking so he can read. **If a draft ever gives Liam a date, a statute or a troop number, cut it** — his whole position is that none of this is his subject, and the play needs that to be true so the refusal in [[11b - Best Practices]] means something.
- **"They lost, by the way" is a plant.** Say it flat and throw it away. Nobody reacts, and Kristina moves the board on top of it. It is the line the back half hands back to him, and it must not sound like a theme when he says it. **Do not add a beat, a pause or a light change.**
- **The dockworkers beat is the one non-textile drop before the mandate, and it is the counterexample.** Verify before staging: the 1960 West Coast longshore Mechanization and Modernization Agreement (the ILWU and the Pacific Maritime Association). The union accepted containers and other machinery; the employers paid into a fund that guaranteed registered men their hours and paid for early retirement, so the work shrank without the men being sacked. Two short blocks with Kristina talked over between them (the talked-over-Kristina comedy is a cut-pass guardrail), no dates, no names, and it lands on the room. Expanded 2026-09-09 on the author's note that it needed more explanation: what a port was before the box, what the box did, what the deal was, why it held. It does not vindicate him: the answer to "what have we got?" is nothing, and nobody gives it. Added 2026-09-09 on Stephen's note that Marcus needs more than the Luddites; the second drop is in [[14a - Checking In]].
- **Kristina's "write it up and send it round" is a management reflex and a setup.** He writes it. It comes to eleven pages, and they fight in the comments ([[11c - The Latest Model]], now cut; the doc is never mentioned on stage).
- **If it has to come down,** this is the first thing to cut in Movement I after `01b`–`01d`. What would be lost is "they lost, by the way," which would need a home in [[11b - Best Practices]].
- **Tone: the likeable trap.** After the cold open's cruelty, play Liam *sympathetic* here — actually working, actually good, briefly a warm mentor. The horror is structural, not behavioural: he does nothing wrong in this scene and is lapped anyway. Don't let him be a jerk in the huddle. The tenderness of "good instinct, kid" is the whole point.
- **He really does solve it.** The realization is his, live, on stage — trace it beat by beat so the audience feels twenty years of craft click into place. The tragedy only lands if his skill is *real*. The machine got there first; it did not get there *better*. Both are true, and the scene needs both.
- **The three refusals are half-right — don't strawman him.** (1) LLM concurrency reasoning genuinely is shaky; (2) a non-deterministic one-in-fifty-thousand bug really has no existing red test to hand it; (3) pasting prod session logs / PII into a third-party model really is an incident. Each is a fair point *and* a locked door. Brendan's screen quietly refutes the conclusion: with full repo access, the tool traces the flow, creates its own deterministic local repro, and proves the bug without touching production data.
- **Brendan uses it responsibly — and gets real proof.** He points Claude at the full repository and gives it the symptom; he never pastes code or prod data. Claude doesn't merely speculate: it writes a barrier-based repro, runs the app, captures screenshots of the cross-account leak, and completes a local fix branch. That proof is why Brendan can steer Liam with total confidence — and why choosing not to show him is consequential. The flicker at the end is the seed of his conflicted arc, echoing "the faintest flicker of something he can't name yet" from Scene 1.
- **Dramatic irony is spatial.** The gag only works if the house clearly reads Brendan's screen as *private* — off-call, another monitor Liam can't see (Zoom-tile logic). Stage the two surfaces so the audience watches the machine solve it in real time while Liam explains why it can't.
- **Curdle Ledger (logged in [[Themes & Motifs]]):** "good instinct, kid" — warmth handed to the wrong source → pays off when the org hands credit *past* Liam and reframes his thinking as friction (B5–B7). "It can't reason about concurrency / no repro / don't paste it in" → the "it can't do X" claim pays off at **The Demo (B3)**, where the tool does exactly his hard trick in seconds to applause.
- **Mirror / twin (John).** Forward-rhymes to John's **B3/B4** (the loom marvel / "people still pay for good cloth"): a lad quietly matching the master's finest work with a machine while the master admires the *lad's* hand. Same "finer-than-the-machine" hubris, opposite texture. Note only — no new John scene.
- **Continuity.** This is the same signup race condition Liam flagged unestimated in [[01 - Cold Open — The Standup]] ("could be a one-line fix, could be a rewrite of the whole session handler"). It pays that line off: it *was* the one-line fix — though the handler's shared-mutable session store (the deeper smell the tool also flags) is the rewrite still waiting. Don't resolve that; leave it as the thing Liam is now too pleased to notice.
