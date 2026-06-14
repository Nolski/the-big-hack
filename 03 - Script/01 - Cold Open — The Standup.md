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
Ca
# Scene 01 — Cold Open — The Standup

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)|B2 — The community]]** and serves as the show's opener. The machine first-appears *by reference* (Brendan vibecoded the now-shipped portal API with [[Modern World — Supporting|THE AGENT]] — "Claude Code, Opus 4.8"), not yet on screen. Mirror twin scene: **The Standup and the Guild → John half** (Movement II).

## Purpose
Open the show inside Liam's world and his worst habit at once: a brilliant, contemptuous craftsman, needled by a celebration he isn't at the centre of, tears down a *shipped, beloved* product after the fact — humiliating the junior who built it **and** the PM who steps in to shield him. Plant, in the laugh, the pedantry and the contempt-for-non-engineers that will later become the documented case against him.

## Setting / Staging
Morning. **Liam** (live, Speaker A) is at his desk in a bathrobe, barely out of bed, a **Steam Deck** in his lap. The shared screen surface is a **Zoom standup grid**; the AI-video coworkers are tiles on it. Liam's own tile is a **camera-off black square labeled "Liam"** — and it *stays* black, even through the cruelty: the audience sees the man the call cannot. The show opens on the keyboard-clack motif and Liam *not* working. When the celebration lands on someone else, Liam pulls up the merged PR on his own monitor, uninvited, and the screen fills with the diff he scrolls through. Light: cool monitor-blue; the warm/analog half of the stage (John's loom) stays dark for now.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop):** the half-listening coworker tiles; runs under the whole scene, nodding through the whole blow-up having heard none of it.
- **[[AI Video Production Tracker|AIV-010]] — Kristina (PM):** runs the standup; celebrates the shipped portal; thanks Brendan for working the weekend; steps in to own the API-key call (the conversion study) — and is left, finally, speechless.
- **[[AI Video Production Tracker|AIV-012]] — Brendan:** modest glow → defending a stable, live product → nervous. Carries the "Claude Code, Opus 4.8 / review it together" lines; cut off twice.
- **[[AI Video Production Tracker|AIV-013]] — The PR (screen share):** the merged ~800-LOC PR — "+812 / −4", a green **Merged** badge — that Liam pulls up himself and scrolls.

---

## Script

*(Black. The keyboard-clack motif — then up on LIAM's desk. He is in a bathrobe, hair flat from the pillow, thumbing a Steam Deck. On the shared screen, a Zoom grid of coworker tiles. His own tile is a black square: "Liam — camera off." He is not, by any definition, working.)*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-010` *(runs ~12s, Liam plays against it)*
> *Bright, brisk, a standup she has run a thousand times.* Morning, everyone — let's keep it tight, lots on today. Liam, you're on mute, I think? And… camera?

**LIAM** *(live, not looking up from the Steam Deck)*: Yeah I'm eating so camera off.

*(He is very obviously not eating. He tilts into a fight on the Steam Deck. The audience watches him lie to a black rectangle with his name on it.)*

> [!screen] VIDEO — KRISTINA · `AIV-010`
> *Warm, and she means it.* No worries. Okay — before tickets, one thing, because I'm not letting it go by. The developer portal. It went out Thursday, and — honestly? The feedback has been *incredible.* Some of the best response we've had to anything we've shipped. Support's quiet, activation's up, people are posting screenshots unprompted. The whole team should feel really good about this one.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(turning to one tile in particular)*
> And that is so much down to Brendan — who, I happen to know, put in most of his weekend to get it over the line. So. Thank you, genuinely. It did not go unnoticed.

> [!screen] VIDEO — BRENDAN · `AIV-012` *(a modest glow, ducking it)*
> Oh — thanks, that's — yeah. It kind of came together. I'm really happy with how it landed, honestly.

*(On "his weekend," LIAM's thumbs stop. He doesn't look up right away. Then he does.)*

**LIAM** *(live, flat, to no one)*: …He worked the weekend.

*(A beat. Something has curdled. He sets the Steam Deck aside and pulls the repo up on his own monitor — uninvited. The shared screen fills with it.)*

> [!screen] VIDEO — THE PR (screen share) · `AIV-013`
> *The merged pull request. A wall of additions, the file tree scrolling on. "+812 / −4" sits at the top like a dare. A green **Merged** badge beside it.*

**LIAM** *(live, the first real attention he's paid all morning)*: Hang on. This *shipped?* This is in prod, right now? *(scrolling, fast)* — Dude. This is eight hundred lines in one PR. Who reviewed this? Who looked at eight hundred lines and went, yep, ship it?

> [!screen] VIDEO — BRENDAN · `AIV-012` *(still gamely)*
> I mean — it's been live since Thursday, and it's been totally stable, so —

**LIAM** *(live, rolling over him)*: And why is it using API tokens? We use JWTs. Long-lived API tokens are *way* more insecure than JWTs — they sit in the database forever, they don't expire, you can't rotate them without a migration. Nobody does this. Nobody's done this since like 2015.

> [!screen] VIDEO — BRENDAN · `AIV-012` *(reasonable, reaching to meet him)*
> I mean — it's simpler for the users? You generate a key, you paste it in a header, you're done. And GitHub uses long-lived to—

**LIAM** *(live, cutting him off)*: Did you *vibecode* this? *(scrolling, faster, the diff blurring past)* There's so much code here, dude. Did you just — Claude, ChatGPT, what — the whole thing, this is so insecure, this is —

> [!screen] VIDEO — BRENDAN · `AIV-012` *(the glow gone; nervous now, but still reaching)*
> *A half-laugh that doesn't land.* I — yeah, I used Claude Code, Opus 4.8 is genuinely really impressive — but I read every line, I swear, I went through the whole thing by hand. Maybe we could — we could go through it together? I'd actually love your eyes on it, and we co—

**LIAM** *(live, quiet now, which is worse)*: You vibecoded the entire API. *(he sets it down; the most present he has been with another human being all day)* It's in prod. And everyone's clapping.

*(KRISTINA steps in — to take the heat off Brendan. A decent reflex.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(gentle, stepping in, owning it)*
> Okay — Liam, the token thing? That one's on me, not Brendan. I asked him to use API keys. There's really solid data that long-lived keys convert better — activation's measurably higher when someone can just paste a key instead of doing the whole OAuth dance. So that was a product call. Deliberate.

*(A beat. LIAM does not turn his camera on. The cruelty comes out of the black rectangle with his name on it.)*

**LIAM** *(live, patient, awful — explaining gravity to a child)*: …No. See — that's not a product call. That's an engineering question. *(a small, terrible beat)* If you actually had a degree in software engineering, Kristina, you'd understand why that isn't yours to make.

*(Silence on the call. The ambient grid keeps nodding, half-listening, having heard none of it. And for the first time all morning, KRISTINA has no line — the bright standup-runner cadence just stops. Her mouth opens. Nothing comes. The "+812" sits there. The **Merged** badge sits there.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(the deflection, for once, won't come)*
> *A breath that does not become a word.* …

*(LIAM picks the Steam Deck back up. His tile never moved. He was a black square the whole time. Keyboard-clack motif up, and out.)*

---

## Notes
- **Tone:** full abrasive (per the writers' decision) — Liam is genuinely an asshole here, no warm prologue softening him first. He isn't even *cleanly* right: the security point is real, but API keys vs JWTs is a legitimate product/security **tradeoff** (GitHub ships long-lived PATs; Kristina has conversion data on her side). His sin isn't the critique — it's treating a defensible tradeoff as proof that everyone around him is incompetent, then **gatekeeping by credential and gender.** Keep both his point and Kristina's point true; the discomfort is the cruelty and the obliviousness.
- **The trigger** is the *celebration of weekend grind*, not the bug. Liam is needled that a shipped, beloved thing — built fast, by someone else, the "wrong" way — is the thing the room is clapping for. He goes looking for fault to deflate it. Play the flip on "He worked the weekend."
- **The sexism is "vaguely":** never explicit, fully deniable — he attacks her *credential* and her *right to decide*, in a patient-mansplaining register, to a woman PM who was technically grounded and trying to protect a junior. The audience should feel the gendered edge; Liam would swear it was "just about the org chart."
- **Curdle seeds planted here** (logged in [[Themes & Motifs]]): Liam's abrasive pedantry → "behavioural concern" in B7; the credential/"that's not yours to make" contempt for non-engineers → itemised as a respect/collaboration problem in the review, with **Kristina**, whom he humiliated, inside the velocity-first frame that recasts him as the bottleneck (B6–B8); Kristina's celebration of fast shipping → the same logic frames the layoff as "impact" (B8); Brendan's sincere "let's review it together" → curdles when Brendan goes quiet/complicit (B6).
- **Sympathy load:** with the warm B1 in-flow prologue gone, the audience's footholds are **Brendan** (the junior who likes Liam and gets stepped on) **and Kristina** (who steps in to shield him and gets slapped down). Liam attacks both — including the one who tried to take the hit for someone else. Watch this as later scenes land — see the risk note in [[Structure & Scene Map]].
- **Mirror:** rhymes forward to John at the guild/tavern (B2, Movement II) — same "community where he has standing," opposite texture (John is *embedded* and warm; Liam is *tolerated* and sharp).
- **Open question:** does Liam get a Brechtian *(to audience)* aside anywhere in the cold open, or does the show withhold his interior until later? Currently withheld — we only see him from the outside, like his coworkers do, and he never once shows the call his face.
