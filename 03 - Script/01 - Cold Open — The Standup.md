---
type: scene
scene_number: 1
title: Cold Open — The Standup
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
runtime_estimate: ~5 min
live_cast: Liam
ai_video_assets: "[[AI Video Production Tracker|AIV-010 Kristina — Standup]], [[AI Video Production Tracker|AIV-011 Standup grid — ambient]], [[AI Video Production Tracker|AIV-012 Brendan — Standup]], [[AI Video Production Tracker|AIV-013 The PR — screen share]]"
tags:
  - scene
  - liam-arc
---

# Scene 01 — Cold Open — The Standup

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)|B2 — The community]]** and serves as the show's opener. The machine first-appears *by reference* (Brendan built the now-shipped API developer portal with the AI coding tool — "Claude Code, Opus 4.8"). First of four Movement I openers: **standup → the Cursor demo (01b) → the PR review (01c) → the future (01d)**. Mirror twin scene: **The Loom and the Guild → John half** (Movement II).

## Purpose
Open the show inside Liam's world and his worst habit at once: a brilliant, contemptuous craftsman, needled by a celebration he isn't at the centre of, tears down a *shipped, beloved* product after the fact — humiliating the junior who built it **and** the PM who steps in to shield him. Plant the pedantry and contempt-for-non-engineers that become the documented case against him.

## Setting / Staging
Morning. **Liam** (live, Speaker A) sits at a **dual-monitor desk** in a bathrobe, barely out of bed: one monitor is a wall of **Reddit anti-AI memes** he scrolls with the mouse, the other holds the **Zoom standup grid** of coworker tiles. His own tile is a **camera-off black square labeled "Liam"** — and it *stays* black, even through the cruelty: the audience sees the man the call cannot. The memes are up *first* and large; the house reads them and laughs along before they even find the man underneath, and he keeps scrolling them through the meeting. The joke he's enjoying — that AI "confidently lies to you" — is the exact thing he weaponises minutes later against Brendan's AI-written code. Light: cool monitor-blue; the warm/analog half of the stage (John's loom) stays dark for now.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop):** the half-listening coworker tiles; runs under the standup, nodding through the whole blow-up having heard none of it.
- **[[AI Video Production Tracker|AIV-010]] — Kristina (PM):** runs the standup; celebrates the shipped API developer portal; thanks Brendan for the weekend; is humiliated by the degree line and left speechless; recovers to wrap the standup.
- **[[AI Video Production Tracker|AIV-012]] — Brendan:** modest glow → honest about skimming but having tests → reveals he fed Liam's memo to Claude (which implemented the JWTs).
- **[[AI Video Production Tracker|AIV-013]] — The PR (screen share):** the merged ~800-LOC PR — "+812 / −4", a green **Merged** badge — that Liam pulls up himself and scrolls.

---

## Script

*(Up first, before we even find LIAM: one of his two monitors, big, angled out to the house — a Reddit feed, r/programminghumor, scrolling. A meme fills it: two old men hunched at a library computer, "THIS HERE IS CALLED AI. YOU ASK IT QUESTIONS, AND IT CONFIDENTLY LIES TO YOU." The audience laughs. He scrolls — another, then another, each a dunk on AI slop, and the laughs keep coming. He's clearly been at this a while. Only now does the light find the man under the monitors: LIAM, bathrobe, hair flat from the pillow, slumped at the desk, one hand on the mouse. This is what he was doing before work, and it's what he's still doing. The keyboard-clack motif runs, but he isn't typing. On the second monitor, off to the side, a Zoom standup grid of coworker tiles waits; his own tile is a black square: "Liam — camera off.")*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-010` *(runs ~12s, Liam plays against it)*
> *Bright, brisk, a standup she has run a thousand times.* Morning, everyone — let's keep it tight, lots on today. Liam, you're on mute, I think? And… camera?

**LIAM** *(live, not looking up, still scrolling)*: Yeah I'm eating, camera off.

*(He is very obviously not eating. He doesn't so much as glance at the call — the memes keep scrolling on the big monitor, the house still half-laughing at them while the standup tries to start underneath.)*

> [!screen] VIDEO — KRISTINA · `AIV-010`
> *Warm, and she means it.* No worries. Okay — before tickets, one thing, because I'm not letting it slide by. The API developer portal. It went live Thursday, and — honestly? The feedback's been *incredible.* Two of our biggest integration partners shipped on it over the weekend. Support's quiet, adoption's climbing, people posting about it unprompted. Best launch we've had in ages.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(turning to one tile in particular)*
> And that's so much down to Brendan — who, I happen to know, put most of his weekend into getting it over the line. So. Thank you, genuinely. It did not go unnoticed.

> [!screen] VIDEO — BRENDAN · `AIV-012` *(a modest glow, ducking it)*
> Oh — thanks, that's — yeah. It kind of came together. I'm really happy with how it landed.

*(On "his weekend," LIAM's hand goes still on the mouse. He doesn't look up right away. Then he does.)*

**LIAM** *(live, flat, to no one)*: …He worked the weekend.

*(A beat. Something has curdled. He clicks off the memes and drags the merged PR up onto his screen-share — uninvited. The shared grid fills with it: the memes gone, replaced by a wall of green.)*

> [!screen] VIDEO — THE PR (screen share) · `AIV-013`
> *The merged pull request. A wall of additions, the file tree scrolling on. "+812 / −4" sits at the top like a dare. A green **Merged** badge beside it.*

**LIAM** *(live, the first real attention he's paid all morning)*: Hang on. This *shipped?* This is the developer portal — live, in front of partners, right now? *(scrolling, fast)* Eight hundred lines in one PR. Who reviewed this?

> [!screen] VIDEO — BRENDAN · `AIV-012` *(still gamely)*
> I mean — it's been live since Thursday, totally stable, partners are already on it, so—

**LIAM** *(live)*: Did you read all this?

> [!screen] VIDEO — BRENDAN · `AIV-012` *(a beat, honest)*
> …Well — I skimmed it. But I made sure there's a really robust set of tests. The whole suite's green—

**LIAM** *(live, pouncing)*: You *skimmed* it. Eight hundred lines of client-facing API and you skimmed it. *(scrolling, faster)* You vibecoded this — pointed Claude at it and hit accept.

> [!screen] VIDEO — BRENDAN · `AIV-012` *(reaching)*
> I used Claude Code, Opus 4.8 — but I went back and forth with it, and the tests all pass, the partners haven't hit a single—

**LIAM** *(live, riding his own certainty — the meme energy, out loud now)*: The tests pass. *(a short, mirthless laugh)* The AI wrote the code *and* the AI wrote the tests that say the code's fine. It doesn't understand a line of it — it just sounds sure of itself. *(a flick of the eyes to his own memes)* That's the whole joke, right there. It'll lie straight to your face.

*(Still scrolling the diff, half-listening to his own contempt — and then something on the screen stops him cold.)*

**LIAM** *(live)*: …Wait. Hold on. Are these — are these *long-lived* API tokens?

> [!screen] VIDEO — BRENDAN · `AIV-012` *(careful)*
> …Yeah. The keys are long-lived.

**LIAM** *(live, genuinely affronted, the real engineer surfacing)*: Did nobody read my memo? I wrote an entire memo on this. You use JWTs. They're *stateless* — you verify the signature, you're not hitting the database on every single request. They *expire* on their own. It's all in there, with diagrams. *(a sneer — certain he's found his culprit)* But no. Of course. Of course the *AI* didn't read my memo.

> [!screen] VIDEO — BRENDAN · `AIV-012` *(quiet — then, honest)*
> …Actually, it did. I fed your memo into Claude before I started. It read the whole thing — that's why the first cut *was* JWTs. Stateless, expiring, the works. It implemented your memo basically line for line. I can pull up the first commit, it's exactly what you—

> [!screen] VIDEO — KRISTINA · `AIV-010` *(stepping in — to take the heat off Brendan, and to be straight)*
> —and then I'm the one who had him pull them back out. That part's on me, Liam. Not Brendan, and not the AI. The JWTs were your design, Brendan built them, Claude followed your memo. The switch to long-lived keys was my call.

**LIAM** *(live, rounding on her instead)*: …Why on earth would you do that.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(even; she has the receipts)*
> Because we user-tested it. The JWT flow — the refresh, the expiry — confused every integration partner we put it in front of; half of them dropped off right at token refresh. The expirations *tanked* adoption. Long-lived keys, paste-and-go — adoption doubled. It's a tradeoff, and we made it on the data.

*(A beat. He could argue the security tradeoff on its merits — the AI followed his memo; a person overruled it, for real, measured reasons. Instead he goes somewhere else.)*

**LIAM** *(live, patient, awful — explaining gravity to a child)*: …See, that's the problem. That's not a product call. That's an engineering decision — and you made it in a *user study.* *(a small, terrible beat)* If you had a degree in any of this, Kristina, you'd understand why that was never yours to override.

*(Silence on the call. The ambient grid keeps nodding, half-listening, having heard none of it. And for the first time all morning, KRISTINA has no line — the bright standup-runner cadence just stops. Her mouth opens. Nothing comes. The "+812" sits there. The **Merged** badge sits there.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(the deflection, for once, won't come)*
> *A breath that does not become a word.* …

*(A second of dead air. Then KRISTINA does the thing she is very good at: she puts herself back together on camera, the bright runner's cadence clicking back into place as if nothing happened.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(recovered, brisk, moving us along)*
> Right — let's keep it moving, we're over. Liam — quick one — what are you on this week, and is anything blocking you?

**LIAM** *(live, back to scrolling, bored)*: Still chasing the race condition in the signup flow. No blockers.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> Great. Points on it? Just a rough number for the board.

**LIAM** *(live, flat)*: It's a race condition. Could be a one-line fix, could be a rewrite of the whole session handler. I'm not going to invent a number so a spreadsheet feels better.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(not taking the bait, typing)*
> …Sure. I'll put two weeks. Thanks, everyone — that's standup.

*(Tiles start to blink out. LIAM drops off without a word and slumps back to his memes. The call shrinks to the two people who stayed behind.)*

---

## Notes
- **Tone:** full abrasive — Liam is genuinely an asshole here, no warm prologue softening him first. He isn't even *cleanly* right: the AI followed his own memo, and the one "wrong" call (long-lived keys) was a measured human tradeoff with adoption data behind it. His sin isn't the critique — it's treating a defensible decision as proof everyone around him is incompetent, then **gatekeeping by credential and gender.**
- **Tech accuracy:** JWTs are stateless/signed (no per-request DB hit, self-expiring); long-lived keys force a lookup but convert far better. The kicker is that **Claude implemented Liam's JWT memo line-for-line**, and **Kristina** consciously swapped to keys after user studies showed expiry/refresh tanked partner adoption. So Liam's anti-AI dogma is wrong twice over, and his real target — the human who made the call — he attacks on credential and gender instead of merits.
- **The trigger** is the *celebration of weekend grind*, not a bug. Play the flip on "He worked the weekend."
- **The sexism is "vaguely":** never explicit, fully deniable — he attacks her *credential* and her *right to decide* ("never yours to override"), in a patient-mansplaining register. Deniable as "just the org chart," felt by the audience as gendered.
- **Hand-off:** this scene ends on the standup emptying out; the huddle that follows is now its own scene ([[01b - The Cursor Demo]]).
- **Mirror:** rhymes forward to John at the loom (B2, Movement II) — same "community where he has standing," opposite texture (John *embedded* and warm; Liam *tolerated* and sharp).
