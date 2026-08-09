---
type: production
title: Structure & Scene Map
tags:
  - production
---

# Structure & Scene Map

~75 minutes, **one thread, five movements**. The play follows Liam forward in a straight line from an ordinary standup to a removal order. What escalates is not the story's shape but its **institutions**: HR, the press, the officers and the court each detach from reality one notch per movement while Liam stays a literal, exact, recognisable man being processed by increasingly unreal machinery.

The decision record for this structure — including the questions still open — is [[Rework — The Escalation Pass]]. The escalation contract that keeps "it gets crazier" from becoming "it gets random" is §G of that note, and it should be written before any new scene.

> [!important] This replaced the braided two-century structure
> Earlier drafts ran Liam's story against a Yorkshire weaver's in alternating movements, converging at the end. **That is retired and John is cut.** The Luddite material survives entirely in **Marcus's** mouth — an engineer on the team who is politics-obsessed the way Liam is tech-obsessed, and who drags the history into standups nobody asked him to. He is wrong about the details and right about the shape; Liam corrects him; the audience gets accurate history through the argument. See [[Character Mirror Map]] and [[Modern World — Supporting]].
>
> The runtime the braid used to spend on 1812 now buys a **second half the play never had**: the accidental hack, the press, the arrest, the trial, the removal.

## The movement structure

| Movement | Content | Approx |
|---|---|---|
| **I** | The cold-open block. Establish Liam, the team, and the machine — then Marcus, the Luddites as a bit, and the credential jab at Kristina he calls out and helps nobody by calling out. | ~20 min |
| **II** | The squeeze. The machine quietly outgrows him, the mandate lands, and a peer feedback form prices him. Ends on the review. | ~22 min |
| **III** | Offboarding → the empty apartment → **the hack**. The agent, still holding a token minted in his name, does it while he's asleep. | ~12 min |
| **IV** | The press invents him → the arrest. Procedurally polite officers, a form to sign, a name mispronounced. | ~10 min |
| **V** | The trial → **the removal**. The verdict never comes. | ~14 min |

**Runtime is over the original 60-minute budget and that is a known cost.** Either accept ~75–80, or cut from Movement I — 01b–01d were flagged early as the liftable scenes.

> [!warning] Measured runtime — the overrun is in Movement II, not Movement I
> Spoken audio only (stage directions excluded), measured off the rendered line wavs: the drafted run through Scene 14 is **55.7 min of dialogue**. TTS renders at 176 wpm, which is brisk for naturalistic stage delivery with this much `*(beat)*` in it — at 145–155 wpm plus the wordless business, **the drafted run is realistically 66–72 minutes staged**, with five scenes still to write.
>
> **The storyboard playback length is not the stage length and will mislead you.** The app has the narrator read every stage direction aloud, which adds 2–4 minutes per scene and is an artifact of the medium — `13b` plays back at 4.6 min against 2.2 min of dialogue, `14` at 6.6 against 4.3, and the wordless calibration prologue in `13` reads as three minutes of narration that will play as about one minute of images. Judge pacing from the spoken column, never from the player.
>
> Against the table above: **Movement I is on budget** (~17 min spoken, before 1e). **Movement II is not** — ~35 min spoken against a ~22 min allowance. The fat is in `11b` (7.0m, the longest scene in the show) and `12` (6.3m), not in the cold-open block the earlier note flagged. Decide the cut before Movements IV–V get written, not after.

| Movement | Spoken (measured) | Budget |
|---|---|---|
| I — through `1d`, `1e` unwritten | 16.8 min | ~20 min |
| II — `6` through `13b` | 34.6 min | ~22 min |
| III — `14` only so far | 4.3 min | ~12 min |
| **Drafted total** | **55.7 min** | |

All figures are measured off rendered line audio, not estimated. Re-measure after any scene is re-rendered.

## Scene running order

Status legend: ⬜ to draft · ✏️ drafted · 🔁 revised · ✅ locked

| Order | Scene | Movement | Status |
|---|---|---|---|
| 1 | [[01 - Cold Open — The Standup\|Cold Open — The Standup]] | I | ✏️ |
| 1b | [[01b - The Cursor Demo\|The Cursor Demo]] | I | ✏️ |
| 1c | [[01c - The PR Review\|The PR Review]] | I | ✏️ |
| 1d | [[01d - The Future\|The Future]] | I | ✏️ |
| 1e | Marcus Established *(to write)* | I | ⬜ |
| 6 | [[06 - Good Instinct\|Good Instinct]] | II | ✏️ |
| 7 | [[07 - Heads Together\|Heads Together]] | II | ✏️ |
| 10 | [[10 - The Win We Needed\|The Win We Needed]] | II | ✏️ |
| 10a | [[08 - The One-on-One\|The One-on-One]] *(file `08`)* | II | ✏️ |
| 11b | [[11b - Best Practices\|Best Practices]] | II | ✏️ |
| 11c | [[11c - The Latest Model\|The Latest Model]] | II | ✏️ |
| 12 | [[12 - Below Expectations\|Below Expectations]] | II | ✏️ |
| 13 | [[13 - The Performance Review\|The Performance Review]] | II | ✏️ |
| 13b | [[13b - The Plan\|The Plan]] | II | ✏️ |
| 14 | [[14 - The Offboarding\|The Offboarding]] | III | ✏️ |
| 19 | The Empty Apartment *(to write)* | III | ⬜ |
| 20 | The Hack *(to write)* | III | ⬜ |
| 21 | The Press Invents Him *(to write)* | IV | ⬜ |
| 22 | The Arrest *(to write)* | IV | ⬜ |
| 23 | The Trial *(to write)* | V | ⬜ |
| 24 | The Removal *(to write)* | V | ⬜ |

**Out of the running order, kept in the vault:** [[02 - The Loom and the Guild — John half]] and [[16 - The Wage Cut]]. Both are cut from the show and both stay as source material for Marcus's arguments and for verbatim inserts.

> [!note] Numbering — read before renumbering anything
> Scene *files* carry `scene_number`s that no longer line up with running-order slots, and that is deliberate. This **table is the source of truth for ORDER**; a scene's `scene_number` frontmatter is the source of truth for its **storyboard id** (`s08`, `s10`, `s11b`, …), which is what `storyboard/artifacts/` is named against. Renumbering a drafted file silently orphans its rendered audio and sketches.
>
> New insertions use **letter suffixes** — the `1b/1c/1d` precedent, extended to `1e` for the new Marcus scene. The undrafted second-half scenes hold slots 14 and 19–24 as *intended order*; give them numbers deliberately when written, and don't reuse 15, 17 or 18 (they were John's).

> [!note] The B1–B12 beat numbering is retired
> Drafted scenes still carry `beat:` frontmatter pointing at the old parallel-intercut beat sheet. Those references are stale — half the beats described John, and the other half now sit in a different structure. **Don't draft against them.** They are left in the files rather than stripped so nothing silently changes in the storyboard parser; treat this table as the running order and [[Liam Arc]] as the throughline.

## Rules of thumb for the new shape

- **The institutions go absurd; Liam stays naturalistic.** He remains a literal, exact man. The audience's anchor must stay real or nothing lands. Study *Sorry to Bother You*'s ladder before writing ours ([[Inspiration — Tone & Form]]).
- **Nothing new arrives late.** Every device in the second half pays off something planted in the drafted scenes. If a beat needs a new mechanism in Movement IV, plant it in Movement I or cut it.
- **No villains, even at maximum absurdity.** Every absurd functionary is doing their job sincerely; the horror stays in the sum. This is hardest and most necessary in Movements IV and V.
- **Space the insufferable.** Liam and Marcus are both hard to be around and carry most of Movements I–II. Brendan is the designated relief — no long stretch of the two of them without him in it.
- **Mark every spectacle beat with the version it assumes** — screen event, sound-and-light event, or live physical event — so production can price it. Write the screen version first; the show's grammar is already on-screen UI and video.
