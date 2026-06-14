---
type: production
title: AI Video Production Tracker
tags:
  - production
  - ai-video
---

# AI Video Production Tracker

Every AI-generated video character/clip in the show. **Lock a consistent reference (seed / face image / voice) per character before generating clips**, so a coworker looks the same in Scene 2 and Scene
12. One row per clip; group by character.

Status legend: 🧠 concept · ✍️ prompt-ready · 🎬 generated · ✂️ edited/cut-to-length · ✅ show-ready

## Character reference sheet (lock these first)
| Character | World | Role | Look reference / seed | Voice | Mirror |
|---|---|---|---|---|---|
| THE AGENT (coding AI) | modern | the machine | TBD — uncanny, friendly-corporate | synthetic, warm-then-cold | THE LOOM |
| THE LOOM (power loom) | historical | the machine | TBD — iron, rhythmic, faceless or masked | mechanical, choral | THE AGENT |
| Kristina (PM) | modern | velocity-first PM | TBD | brisk, upbeat, delivery-speak | (PM cousin of Priya) |
| Brendan (engineer) | modern | the empathetic adopter | TBD — warm, ordinary, likeable | open, modest, conciliatory | Fellow weavers (the conflicted) |
| Priya (manager) | modern | the smiling axe | TBD | TBD | Mr. Cartwright |
| Mr. Cartwright (mill owner) | historical | the smiling axe | TBD | TBD | Priya |
| Dev coworkers (Sam, Marcus) | modern | the betrayers | TBD | TBD | Fellow weavers |
| Fellow weavers (Becker-type) | historical | the betrayers | TBD | TBD | Dev coworkers |
| HR / "People Partner" | modern | the system | TBD | TBD | The Bailiff / Magistrate |
| The Bailiff / Magistrate | historical | the system | TBD | TBD | HR |
| Liam's absent contacts (chat) | modern | the silence | text-on-screen | — | — |
| Mary (John's wife) | historical | what's at stake | TBD — sympathetic, NOT uncanny | warm | — |

## Clip list
| ID | Scene | Character | What happens in the clip | Length | Prompt status | Status |
|---|---|---|---|---|---|---|
| AIV-001 | The Demo *(rehomed from cut prologue)* | THE AGENT | Boots up; cheery "Hi Liam! Want me to take it from here?" | ~6s | ✍️ | 🧠 |
| AIV-002 | The Loom and the Guild — John half *(rehomed from cut prologue)* | THE LOOM (power loom) | First appearance — **faint and distant**: the flat mechanical knock of steam looms heard down the valley under John's warm handloom. Sound more than sight. The menace character (mirror of THE AGENT); grows over later scenes. **NB: not John's own loom** — John works an ordinary cottage handloom (live stage prop, no clip). | ~10s | ✍️ | 🧠 |
| AIV-010 | Cold Open — The Standup | Kristina (PM) | Celebrates the shipped portal ("best feedback of anything we've shipped"); thanks Brendan for working the weekend; steps in to own the API-key call (conversion data); then left speechless by Liam's credential jab | ~20s | 🧠 | 🧠 |
| AIV-011 | Cold Open — The Standup | Standup grid | Nodding, half-listening coworker tiles (ambient loop) | loop | 🧠 | 🧠 |
| AIV-012 | Cold Open — The Standup | Brendan | Modest glow → defends a live/stable product → nervous; "I used Claude Code, Opus 4.8… maybe we could review it together"; cut off twice | ~14s | 🧠 | 🧠 |
| AIV-013 | Cold Open — The Standup | THE PR (screen share) | The merged ~800-LOC PR ("+812 / −4", green **Merged** badge) Liam pulls up himself and scrolls | ~10s | 🧠 | 🧠 |
| AIV-020 | The Demo | THE AGENT | Demos itself solving Liam's hard problem in seconds | ~12s | 🧠 | 🧠 |
| AIV-021 | The Demo | Mr. Cartwright | Unveils the power loom to applause | ~12s | 🧠 | 🧠 |
| AIV-030 | The Loom and the Guild — John half | Mary (John's wife) | In the kitchen window (her own screen, not John's space): bread's out, tea's going cold, the boy's asking after his own loom; later, "carrier's coming up the lane." Ordinary, warm, unbothered. **Sympathetic, NOT uncanny — best lip-sync, warmest grade.** | ~10s | 🧠 | 🧠 |
| AIV-031 | The Tavern Oath (B10) *(freed from John's intro)* | The alehouse / tavern (ambient) | A firelit low room where John is known — a nod, a half-raised cup, men leaning in. Originally cut for John's intro; rehome to the Tavern Oath, where the same room turns oath-bound. | loop | 🧠 | 🧠 |
| AIV-032 | The Loom and the Guild — John half | Young weaver (Becker-seed) | Out in the lane (his own screen): stops at the gate with gossip — Cartwright's steam-loom shed, "one lad to mind a dozen… and when they buy the cheap stuff anyway?" Worried, not yet angry; the un-radicalised seed of Becker. | ~12s | 🧠 | 🧠 |

> Add a row the moment a scene calls for a video character. Keep `ID` stable and reference it from the scene's *AI Video Cues* block.

> [!note] Non-character production elements
> **NARR — Narrator (V.O.) + title cards.** A neutral, disembodied narration voice (and projected white-on-black title cards, e.g. "THE NORTH OF ENGLAND. THE SPRING OF 1812.") bridges the 200-year rewind at the top of **The Loom and the Guild — John half**. Not an AI-video "character" — treat as audio + projection. Lock one voice for it in case it recurs as a bookend.

## Generation notes / pipeline (fill in for your toolchain)
- **Tool(s):** <which video-gen + voice tools>
- **Aspect / resolution:** <to match projection surface>
- **Naming:** `AIV-### - <character> - <scene>.mp4` in `_attachments/`
- **Backup:** keep an offline local copy of every show-ready clip; never depend on live generation.
- **The machines (Agent / Loom):** generate as recurring "characters" with a fixed look so their late menace pays off the early friendliness.
