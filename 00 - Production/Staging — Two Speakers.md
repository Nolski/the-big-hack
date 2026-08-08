---
type: production
title: Staging — Two Speakers
tags:
  - production
---

# Staging — Two Speakers

> [!important] Recast — both speakers are modern
> [[Rework — The Escalation Pass]] cuts John entirely. **Speaker A is [[Liam]]; Speaker B is [[Brendan]]**, who also narrates. Two men on the same team instead of two centuries. The convention itself survives intact — it just needed recasting, not rewriting.
>
> **One genuinely new rule: the two live actors can touch.** Until now every other human was behind glass. In the drafted scenes they are always on a call — same team, remote, no contact — so the old no-contact convention holds all through Movement I. Physical co-presence is a scarce, designed resource; know which beat you're spending it on before you spend it.

## The core convention
- **Speaker A plays [[Liam]]. Speaker B plays [[Brendan]].** They hold these roles all night — the audience anchors to two faces.
- **Everyone else is AI-generated video**: Marcus, Kristina, HR, the CEO, the press, the court. The **AI coding tool** is *not* a character and not cast — it's a recurring presence only: on-screen UI and screen captures, no face that talks and no lines. Catalogued in [[AI Video Production Tracker]].
- **Brendan narrates** — direct address, retrospective, third person about the world and never about himself (see [[Brendan]] for the rule that keeps this from becoming a confession play). Liam can address the audience too, but the narration is Brendan's channel.

> [!warning] Cast size may not stay at two
> The arrest and the trial want live bodies that video characters can't supply — officers who physically take Liam down, a court that surrounds him. That is an open production question ([[Rework — The Escalation Pass]] §E/§I). **Every new scene must state which version it assumes**, because "Liam alone against a video wall" and "live officers in the room" are two different scenes on the page.

## Stage picture
- One playing area to start: **LIAM's desk** (laptop, monitor, standing desk, swivel chair), with **BRENDAN's desk** in its own pool of light — they are remote colleagues, so the two areas are separate rooms, not one room.
- A **shared screen surface** (cyclorama / large upstage projection) carries the AI-video cast. Smaller screens carry intimate clips and the audience-only monitors (`AIV-044`, `AIV-054`) that make the drafted scenes work.
- **The accumulating object:** a single small table or shelf slowly collects the paperwork of the fall — a laptop, a severance envelope, a printed feedback summary, a charging document, a removal order — until they sit together at the finish. The play runs on documents; let them pile up where the audience can see.
- The back half needs surfaces the front half doesn't: chyrons and push notifications, the alert cascade under the hack, a courtroom. Write the **screen version first** — the show's grammar is already on-screen UI, and it gives production something to escalate from.

## How live actor + AI video play together
- **Call-and-response.** Live actor speaks to a video character who "replies" on screen. Timing is the whole game — the AI clip must be cut to leave breathing room for the live line, or run to a fixed length the actor plays against. Note exact timings in each scene's *AI Video Cues*.
- **Two modes of video:**
  1. *Responsive* — short clips triggered on cue (a manager's one-liner). Lives or dies on tight operator cueing.
  2. *Ambient* — looping/background presence (an all-hands crowd, a newsroom loop) the actor moves within.
- **The machine has a presence — not a voice, not lines.** The AI coding tool is never a character; it never speaks or addresses anyone. Give it a consistent look and sound — a warm corporate-synthetic interface, streaming text, the default prompt "Want me to take it from here?" — so the late-play menace is earned. In Movement III it commits the crime and apologises in the first person, and that apology only lands if the look has been the same all night.

## Transitions (no blackouts)
- **Light wipe + sound.** The keyboard-clack motif carries the cuts. The shared screen bridges between scenes.
- **Costume = a single token.** If a speaker ever steps into a second role, change one item (a cap, a lanyard) on stage, in view — never a full change. (Default is they don't; AI video covers others.)
- **The accumulating table.** Moving a document onto the table can punctuate a scene change, and by Movement V the pile is the argument.

## Technical risks to design around (flag early)
- **AI video latency / playback reliability.** Pre-render everything; never depend on live generation in the room. Have a local, offline copy of every clip. Operator runs clips like a lighting board.
- **Lip-sync & the uncanny.** Lean into it where useful — the machine *should* be a little uncanny, and so should a news anchor. Minimise it where a video character needs to be believed as decent (Kristina at the review, HR at the offboarding).
- **Voice-over over screen text is the cheap escape hatch — and silent screen text is cheaper still.** Where a character only needs to be *heard*, don't generate a face: play the locked voice over an on-screen document. Established by the CEO's memo in [[08 - The One-on-One]] (`AIV-049`). The calibration sequence went one step further and dropped the voices too: the prologue to [[13 - The Performance Review]] is a wordless minute of `AIV-066`, with Kristina's and Kara's lines as comment text on the sheet rather than voice-over (`AIV-063` and `AIV-064` are retired). No lip-sync problem, no consistency problem, no uncanny problem — and it reads as *more* institutional, not less. Reach for it before adding another talking head, and check whether the beat needs a voice at all before you record one.
- **Sync between live line and video reply.** Rehearse to a click/timecode. Keep clips short.
- **Consistency of AI characters across many clips.** Lock a seed / reference image / voice per character up front (tracked in [[AI Video Production Tracker]]) so the same coworker looks the same in scene 2 and scene 12.
