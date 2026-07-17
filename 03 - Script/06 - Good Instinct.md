---
type: scene
scene_number: 6
title: Good Instinct
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
runtime_estimate: ~9 min
live_cast: Liam
ai_video_assets: "[[AI Video Production Tracker|AIV-040 Kristina — Standup day two]], [[AI Video Production Tracker|AIV-011 Standup grid — ambient]], [[AI Video Production Tracker|AIV-041 Brendan — Standup]], [[AI Video Production Tracker|AIV-042 Brendan — Huddle]], [[AI Video Production Tracker|AIV-043 Liam's screen — session handler]], [[AI Video Production Tracker|AIV-044 Brendan's screen — Claude session]]"
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
The same desk as the cold open, the next morning — but no memes today. **Liam** (live, Speaker A) is actually working: deep in the session-handler code on the big monitor, headphones half-on, a scatter of coffee cups. He has been at this a while and it shows. On the second monitor the standup grid runs; his own tile is the same camera-off black square, "Liam." After the standup clears, a Slack huddle: Liam shares his screen; **Brendan** is a tile; and — set apart, angled to the house — a third surface the **audience** sees and Liam cannot: Brendan's own laptop, where a Claude Code session runs, silent. The dramatic irony is spatial — two screens, one truth on each, and only the house sees both. The machine is on-screen UI only: no voice, no speaker callout, written as stage direction (same rule as the Cursor demo in Scene 1). Liam never crosses onto the video plane. Cool monitor-blue throughout; John's loom half of the stage stays dark. This scene sits mid-Movement III (Liam continues into the Demo), so there is **no** loom-knock hand-off — it closes on its own image: the two screens, one of them quietly shut.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-040]] — Kristina (PM):** runs the day-two standup; pushes Liam for a direction on the still-open race condition (it's the last unpointed thing on the board and "people upstairs keep asking"); blesses the pairing.
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop, reused from Scene 1):** the half-listening coworker tiles under the standup.
- **[[AI Video Production Tracker|AIV-041]] — Brendan (standup):** offers to help; takes Liam's "it's the deep end" gently; glad to be invited in.
- **[[AI Video Production Tracker|AIV-042]] — Brendan (huddle):** into the bug with Liam; floats three approaches, concedes the one that's genuinely right (no prod data in the model), then lands the Socratic "what's the id keyed on?" question; the modest deflection and the flicker of something he can't name. Cut to leave a gap for Liam's live realization.
- **[[AI Video Production Tracker|AIV-043]] — Liam's shared screen (screen graphic, no voice):** the session handler / `getOrCreateSession`, the "#incident — logged in as someone else" thread, the token-RNG dead ends he has been chasing.
- **[[AI Video Production Tracker|AIV-044]] — Brendan's private screen (on-screen UI, no voice — the machine):** a Claude Code session finding the race by static inspection of the pasted handler (no prod data) — thinking, then the walk back up to the pre-commit call, the lit line, the one-line fix and the shared-store smell. The audience sees it; Liam never does. The machine's first real engineering turn; mirror of the steam looms.

---

## Script

*(The same desk, the morning after. No memes today. LIAM is actually working — hunched in, headphones half-on, the session-handler code filling the big monitor, coffee cups stacked at his elbow. He has been at this a while and it shows. On the second monitor the standup grid is already running; his tile is the same black square, "Liam — camera off." He is not really in the meeting. He is in the bug.)*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-040` *(runs ~14s, Liam plays against it)*
> *Brisk, running the board.* …lovely, thanks Priya. Okay — Liam. You're still on the signup race condition, yeah? Where are we with that one?

**LIAM** *(live, not looking up, still reading code)*: Still on it. No blockers.

> [!screen] VIDEO — KRISTINA · `AIV-040`
> *Gentle, but she needs something.* Right — that's what you said Tuesday, though. It's been open a while now. Is there any movement? Even a direction you're leaning?

**LIAM** *(live, the flat patience of a man explaining the obvious)*: It's a race condition, Kristina. I don't debug in a straight line. You don't "make progress" on one of these — you stare at it until it tells you the truth, and then it's an afternoon. *(beat)* It's not a burndown chart. It's a haunted house. I'm still finding the rooms.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(not rising to it, typing)*
> …Okay. I'll leave it flagged. It's just the last thing on the board without a number next to it, and people upstairs keep asking. Anything that helps you close it out — say the word.

> [!screen] VIDEO — BRENDAN · `AIV-041` *(easy, genuine — a hand up, not a challenge)*
> I could jump on it with you if you want? I've had my head in the auth stuff all week anyway — happy to be a second pair of eyes.

**LIAM** *(live, a soft, kind-sounding condescension)*: …That's good of you. It's a concurrency bug, though — down in the session handler. It's a bit of a deep end. *(beat, not unkind)* No offence. It's just — this is the kind of thing that takes a while to even *see*.

*(He hears himself say it. A beat. Something in him — the part that still loves this — turns it over.)*

**LIAM** *(live, softening, almost warm)*: …Actually. No. Come look at it with me. *(beat)* You'll learn more from one real race condition than a month of tickets. Grab twenty minutes after this?

> [!screen] VIDEO — BRENDAN · `AIV-041` *(lighting up)*
> Yeah — for sure. I'd love that, honestly. I'll ping you the second we're done.

> [!screen] VIDEO — KRISTINA · `AIV-040` *(pleased — a manager watching a good thing happen)*
> Oh, I love that. Pair on it. *(brisk)* Right — that's the board. Thanks, everyone.

*(The grid blinks out tile by tile. LIAM pulls the headphones back on and drops straight into the code — already gone from the room. [MUSIC: music/slackhuddle.mp3] A Slack huddle request lights his screen: BRENDAN. He takes it without looking up.)*

*(The huddle opens. On the big shared monitor — `AIV-043` — LIAM's screen: the session handler, and off to one side a Slack thread, "#incident — 'logged in as someone else' (×4)". BRENDAN's tile sits in the corner. And — set apart, angled to the house, a surface the call cannot see — BRENDAN's own laptop: a blank Claude Code prompt, the cursor blinking. LIAM is sharing *out*; he has no idea what is on Brendan's other screen. The audience can see both.)*

**LIAM** *(live, in his element now — the version of him people like)*: Okay. So. Here's the ghost. *(scrolling the thread)* Four users in three months. Each one signs up, and for about a second they're… in someone else's account. Someone else's name, someone else's email, right there on the screen. Then it clears. *(beat)* And I cannot reproduce it. I have tried everything. Ten thousand signups in a loop, locally — nothing. It only ever happens out there. In prod. Under real traffic.

> [!screen] VIDEO — BRENDAN · `AIV-042` *(leaning in, genuinely into it)*
> Okay, that's kind of horrifying. *(beat)* Where've you been looking?

**LIAM** *(live)*: Token generation. The session tokens. If two people ever got issued the same token, that would do it — so I've been pulling apart the RNG, the entropy source, the signing. *(beat, frustrated)* And it's all fine. It's textbook. That's what's killing me — the one place it should be, it just… isn't.

> [!screen] VIDEO — BRENDAN · `AIV-042` *(careful, offering)*
> Can I ask a dumb thing? *(beat)* Have you tried just — pasting the handler into Claude and asking it where the race is? It's weirdly good at spotting this stuff by eye.

*(On BRENDAN's own screen — `AIV-044`, the audience only — he is already doing exactly that. He pastes the session handler in. Only the code — no logs, nothing from the thread. He hits enter. The tool starts to think. No voice; text on a screen LIAM cannot see.)*

**LIAM** *(live, a short laugh — not cruel, just certain)*: It can't. That's the thing everyone gets wrong about it. It can't *reason* about concurrency — it's autocomplete with good manners. It has no model of two threads interleaving. *(beat)* You paste this in, it sees the word "session," it pattern-matches to "add a mutex," and now I've got a lock on the hottest path in the app and a *deadlock* in prod instead of a race. No thanks.

> [!screen] VIDEO — BRENDAN · `AIV-042` *(nodding, tries another door)*
> Fair. What about — write a failing test first, then point it at that? Give it something red to chase.

**LIAM** *(live)*: That's the whole problem, though. I can't make it fail on demand. It's one in fifty thousand signups, only under real load. *(beat)* There's no red test to hand it. And if I hand it a green one, it'll "fix" the bug, tell me it's solved, and be lying — same as it always is. And it'll sound completely sure while it does it.

*(On BRENDAN's screen — `AIV-044` — the tool has stopped thinking. It's writing now: it walks back up from `getOrCreateSession` to the signup controller, and lights one line. Text streams under it. BRENDAN's eyes move down it, quick.)*

> [!screen] VIDEO — BRENDAN · `AIV-042` *(one more, tentative)*
> Okay — last idea, then I'll shut up. The incident thread's got the actual prod logs from when it happened. What if I dropped those in — the real ones — see if there's a—

**LIAM** *(live, sharp — the one objection that's flat-out right)*: No. You do not paste production session data into a third-party model. Those logs have live tokens in them. Real users' emails. *(beat)* That's a PII incident and a security review all by itself — that's exactly the "just paste it in and see what happens" thinking that gets a company on the news. *(catching himself — Brendan built the portal — a beat)* …I'm not having a go. That one just actually matters.

> [!screen] VIDEO — BRENDAN · `AIV-042` *(quietly — and he means it)*
> No — you're right. You are. Forget that one.

*(On BRENDAN's screen — `AIV-044` — the answer sits there now, finished: a short paragraph, and one line of the controller lit up — the `getOrCreateSession` call, sitting *above* the commit. He reads it twice. Then he eases the lid half-shut, almost like hiding it, and turns back to the call.)*

> [!screen] VIDEO — BRENDAN · `AIV-042` *(offhand, like it just floated up — the dumb-question voice)*
> …Okay, this is probably nothing. But — can you scroll up? To where signup actually calls the session thing. *(beat)* That `getOrCreateSession` — what's it keyed on?

**LIAM** *(live, scrolling up, humouring him)*: The user id. It keys the session on the user id.

> [!screen] VIDEO — BRENDAN · `AIV-042` *(carefully — leaving the door open, not walking through it)*
> Right, but — that call's *before* the commit, isn't it? The row hasn't actually landed yet. *(beat)* So for that one beat… what's the id? Is it the real one yet?

*(LIAM stops. Actually stops. His eyes go to the top of the function, then down, then back up — tracing it. The cursor hovers. A long beat. When he speaks it's quiet, almost to himself.)*

**LIAM** *(live, slow)*: …It's zero. *(beat)* The id is zero until the transaction commits. It defaults to zero. *(faster now, up out of the chair)* So two signups in the same tick — they both call `getOrCreateSession` with id zero. They both key on zero. *(beat)* They get the *same* session. *(beat)* One of them gets handed the other one's login. *(quiet, stunned)* …It was never the tokens. It was never the crypto. It's a check-then-set on an id that isn't there yet. *(a breath)* One line. It's one line. It's been one line this whole time.

*(He turns — genuinely lit up, the most alive he has been all scene — and looks straight at BRENDAN's tile.)*

**LIAM** *(live, warm — no condescension left in it)*: …That's a hell of a catch, Brendan. *(beat)* How did you even — that's the *one* place I wasn't looking. That's real instinct. *(a real smile)* Good instinct, kid. Seriously.

> [!screen] VIDEO — BRENDAN · `AIV-042` *(a modest deflection — and something underneath he can't name)*
> …I dunno. It just looked a bit off to me. *(a small, uneasy beat)* Lucky guess.

*(LIAM is already dropping back into the code, buzzing, typing the one-line fix — happy, restored, the craft-love back in his hands. He doesn't look at the other screen. He wouldn't think to. On BRENDAN's laptop — `AIV-044`, the audience only — the finished answer glows a second longer: the lit line, the fix spelled out in full, a second note underneath it flagging the shared session store as the deeper problem. Then BRENDAN quietly closes the lid. The faintest flicker of something crosses his face — not quite guilt, not yet — the same thing he couldn't name yesterday. He lets the huddle go.)*

*(LIAM types on, warm and none the wiser. Hold a moment on the two screens — his, bright and moving, and the closed one beside it. The monitor-blue eases down.)*

---

## Notes
- **Tone: the likeable trap.** After the cold open's cruelty, play Liam *sympathetic* here — actually working, actually good, briefly a warm mentor. The horror is structural, not behavioural: he does nothing wrong in this scene and is lapped anyway. Don't let him be a jerk in the huddle. The tenderness of "good instinct, kid" is the whole point.
- **He really does solve it.** The realization is his, live, on stage — trace it beat by beat so the audience feels twenty years of craft click into place. The tragedy only lands if his skill is *real*. The machine got there first; it did not get there *better*. Both are true, and the scene needs both.
- **The three refusals are half-right — don't strawman him.** (1) LLM concurrency reasoning genuinely is shaky; (2) a non-deterministic one-in-fifty-thousand bug really has no red test to hand it; (3) pasting prod session logs / PII into a third-party model really is an incident. Each is a fair point *and* a locked door. Brendan's screen quietly refutes (1) and (3) — the tool needs neither a mutex nor the prod logs, just the code — without a word said.
- **Brendan uses it responsibly.** He pastes only the handler, never the prod data — he actually heard Liam's one good objection. Keep that: he's the careful adopter, not a corner-cutter. The flicker at the end is the seed of his conflicted arc, echoing "the faintest flicker of something he can't name yet" from Scene 1.
- **Dramatic irony is spatial.** The gag only works if the house clearly reads Brendan's screen as *private* — off-call, another monitor Liam can't see (Zoom-tile logic). Stage the two surfaces so the audience watches the machine solve it in real time while Liam explains why it can't.
- **Curdle Ledger (logged in [[Themes & Motifs]]):** "good instinct, kid" — warmth handed to the wrong source → pays off when the org hands credit *past* Liam and reframes his thinking as friction (B5–B7). "It can't reason about concurrency / no repro / don't paste it in" → the "it can't do X" claim pays off at **The Demo (B3)**, where the tool does exactly his hard trick in seconds to applause.
- **Mirror / twin (John).** Forward-rhymes to John's **B3/B4** (the loom marvel / "people still pay for good cloth"): a lad quietly matching the master's finest work with a machine while the master admires the *lad's* hand. Same "finer-than-the-machine" hubris, opposite texture. Note only — no new John scene.
- **Continuity.** This is the same signup race condition Liam flagged unestimated in [[01 - Cold Open — The Standup]] ("could be a one-line fix, could be a rewrite of the whole session handler"). It pays that line off: it *was* the one-line fix — though the handler's shared-mutable session store (the deeper smell the tool also flags) is the rewrite still waiting. Don't resolve that; leave it as the thing Liam is now too pleased to notice.
