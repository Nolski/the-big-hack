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
| Kristina (PM/manager) | modern | velocity-first PM; the smiling axe | TBD | brisk, upbeat; management euphemism | Mr. Cartwright |
| THE CEO | modern | the pressure from above | TBD | warm, founder-optimistic, fear under it | the market / the board (≈ Cartwright's "Manchester") |
| Brendan (engineer) | modern | the empathetic adopter | TBD — warm, ordinary, likeable | open, modest, conciliatory | Fellow weavers (the conflicted) || Mr. Cartwright (mill owner) | historical | the smiling axe | TBD | TBD | Kristina |
| Dev coworkers (Sam, Marcus) | modern | the betrayers | TBD | TBD | Fellow weavers |
| Fellow weavers (Becker-type) | historical | the betrayers | TBD | TBD | Dev coworkers |
| HR / "People Partner" | modern | the system | TBD | TBD | The Bailiff / Magistrate |
| The Bailiff / Magistrate | historical | the system | TBD | TBD | HR |
| Liam's absent contacts (chat) | modern | the silence | text-on-screen | — | — |
| Mary (John's wife) | historical | what's at stake | TBD — sympathetic, NOT uncanny | warm | — |

## Clip list
| ID | Scene | Character | What happens in the clip | Length | Prompt status | Status |
|---|---|---|---|---|---|---|
| AIV-001 | The Demo *(rehomed from cut prologue)* | On-screen UI (screen capture, not a character) | On-screen UI wakes — streaming text and a prompt, "Want me to take it from here?". Text on screen only, no voice. | ~6s | ✍️ | 🧠 |
| AIV-002 | The Loom and the Guild — John half *(rehomed from cut prologue)* | Steam looms, distant (ambient sound/visual, not a character) | First appearance — **faint and distant**: the flat mechanical knock of steam looms heard down the valley under John's warm handloom. Sound more than sight; grows over later scenes. **NB: not John's own loom** — John works an ordinary cottage handloom (live stage prop, no clip). | ~10s | ✍️ | 🧠 |
| AIV-010 | 01 Standup / 01b Demo / 01d Future | Kristina (PM) | **Standup:** celebrates the shipped portal, thanks Brendan for the weekend, owns the API-key call (conversion data), left speechless by Liam's credential jab. **Demo (01b):** drops the mask, near-reports Liam; then tries the tool herself — tech-literate but hasn't driven one — fumbles the UI, catches it lying (invented endpoint, hardcoded token: "so Liam wasn't wrong"), watches it pass its tests then face-plant on the live run and get fixed, challenges its value ("how much time is it actually saving you?"), then is won over when *she uncovers* the personal system Brendan's built. Measured, not gushing; ends on an unfinished thought about Liam being on the wrong side of this. **Future (01d):** thrown Liam apologised → converted by the method ("this is the future") → reclassifies him as "a problem," then brightens again. | ~20s (+ reuse) | 🧠 | 🧠 |
| AIV-011 | 01 Standup | Standup grid | Nodding, half-listening coworker tiles (ambient loop) | loop | 🧠 | 🧠 |
| AIV-012 | 01 Standup / 01b Demo / 01d Future | Brendan | **Standup:** modest glow → defends a live/stable product → "I used Claude Code, Opus 4.8." **Demo (01b):** not an evangelist and not a self-promoter — a problem-solver who's lived in this and is delighted by how *cool* it is; honest about how finicky it is; unbothered when the live run breaks (feeds it the error); deflects credit rather than claiming it — his depth is something Kristina drags into the light; first flicker of something he can't name when she sees it. **Future (01d):** finally gets to teach the *method* to someone who listens; generous about Liam to the end; voices the caution (scaling, tech debt) nobody wants. | ~14s (+ reuse) | 🧠 | 🧠 |
| AIV-013 | 01 Standup | THE PR (screen share) | The merged ~800-LOC PR ("+812 / −4", green **Merged** badge) Liam pulls up himself and scrolls | ~10s | 🧠 | 🧠 |
| AIV-014 | 01b The Cursor Demo | Cursor demo (on-screen UI, not a character) | The machine's first on-screen appearance — and it's fallible. A confident plan-mode plan that **invents a Jira endpoint and hardcodes an API token** (Liam's meme, live), corrected on screen; a build that **passes its own sandbox tests**, then the **live `/jira done` failing on a real permissions error** (works-in-test-breaks-in-prod), fixed by pasting the trace back; then the ticket closing (card slides to Done) — and, in small grey text nobody reads, silently resolving **3 linked issues** too. Screen only, no voice. Mirror of the steam looms — marvelous, not to be trusted blindly. | ~15s | ✍️ | 🧠 |
| AIV-015 | 01c The PR Review | Brendan | The patient adopter who is **steamrolled**: opens generous, concedes the precedent risk and that the PR should've been split — then tries **four times** to explain his review method and is cut off every time; the small deflation as he gives up. He never lands the method here (it moves to 01d). Never defensive, never attacks. | ~25s | 🧠 | 🧠 |
| AIV-016 | 01c The PR Review | THE PR — the diff (screen share) | The same merged API developer portal PR from `AIV-013`, now open and scrolled — file tree, the portal's services, the auth/token section Liam keeps circling and jabbing at | ~10s | 🧠 | 🧠 |
| AIV-017 | 01c PR Review / 01d The Future | Plan + transcript (screen capture, not a character) | The plan-mode plan written before any file was touched — services, secrets in Vault, staged rollout, keys flagged as a tradeoff — then the session transcript of Brendan's corrections. **01c:** pulled up as the thing Liam talks over and never reads. **01d:** shown *as the lesson* Brendan teaches Kristina. Screen only, no voice; dims out last as the rewind begins. | ~12s | 🧠 | 🧠 |
| AIV-018 | 01d The Future | CI / canary dashboard (screen graphic) | Green integration suite against a partner sandbox; a flagged 5%→100% staged rollout from Thursday; flat error rate / latency. Text-on-screen, no voice — shown as the answer to Liam's "it marks its own homework"; the safety net that replaced the midnight line-read. | static | 🧠 | 🧠 |
| AIV-020 | The Demo | Demo screen (screen capture, not a character) | On screen: the tool solves Liam's hard problem in seconds — code and output streaming. Screen only, no voice. | ~12s | 🧠 | 🧠 |
| AIV-021 | The Demo | Mr. Cartwright | Unveils the power loom to applause | ~12s | 🧠 | 🧠 |
| AIV-030 | The Loom and the Guild — John half | Mary (John's wife) | In the kitchen window (her own screen, not John's space): bread's out, tea's going cold, the boy's asking after his own loom; later, "carrier's coming up the lane." Ordinary, warm, unbothered. **Sympathetic, NOT uncanny — best lip-sync, warmest grade.** | ~10s | 🧠 | 🧠 |
| AIV-031 | The Tavern Oath (B10) *(freed from John's intro)* | The alehouse / tavern (ambient) | A firelit low room where John is known — a nod, a half-raised cup, men leaning in. Originally cut for John's intro; rehome to the Tavern Oath, where the same room turns oath-bound. | loop | 🧠 | 🧠 |
| AIV-032 | The Loom and the Guild — John half | Young weaver (Becker-seed) | Out in the lane (his own screen): stops at the gate with gossip — Cartwright's steam-loom shed, "one lad to mind a dozen… and when they buy the cheap stuff anyway?" Worried, not yet angry; the un-radicalised seed of Becker. | ~12s | 🧠 | 🧠 |
| AIV-070 | The Performance Review | Kristina (the review) | Warm, transparent management register; concedes Liam's excellence and that he was *right*; reveals she advocated in calibration; lands the managing-out kindly and immovably. **Sincere throughout — never a villain.** Mirror of Cartwright's `AIV-080`. | ~30s | 🧠 | 🧠 |
| AIV-071 | The Performance Review | Performance summary (screen graphic) | Clean HR doc — "H2 Performance Summary — Liam," a "Collaboration: Below Expectations" line; the B3/cold-open applause metric or a velocity chart can ghost behind it. Text-on-screen, no voice. | static | 🧠 | 🧠 |
| AIV-080 | The Wage Cut | Mr. Cartwright (the wage cut) | Affable, improving, fond of John, genuinely sorry and genuinely puzzled his factory offer isn't welcome; delivers the rate cut and the offer as reasonable kindness, the new looms moving through the window behind him. **Never a sneer.** Mirror of Kristina's `AIV-070`. | ~30s | 🧠 | 🧠 |
| AIV-090 | The Win We Needed | Kristina (the win) | Proud launch report, then honestly hedging on engineer adoption — fair to the senior engineers' concerns (unread code, long-lived keys, juniors not learning). Conflicted, not a shill. Plays opposite `AIV-091`. | ~35s | 🧠 | 🧠 |
| AIV-091 | The Win We Needed | THE CEO | Warm, big-picture, fear under the optimism; relieved by the win, hears the concerns, can't afford them; turns it into the mandate. **Never a tyrant. New character.** | ~35s | 🧠 | 🧠 |
| AIV-092 | The Win We Needed | Launch dashboard (screen graphic) | Metrics behind the scene — activation up, tickets down, sentiment green; a runway/burn figure visible when the pressure surfaces. Text-on-screen, no voice. | static | 🧠 | 🧠 |

> [!note] First fully-AI-video scene
> [[08 - The Win We Needed]] has **no live speaker** — `AIV-090` + `AIV-091` can be rendered as a single polished clip (or two intercut feeds), since there's no live actor to time against. Recommended staging keeps Liam silent on stage below; see the scene.

> Add a row the moment a scene calls for a video character. Keep `ID` stable and reference it from the scene's *AI Video Cues* block.

> [!note] Non-character production elements
> **NARR — Narrator (V.O.) + title cards.** A neutral, disembodied narration voice (and projected white-on-black title cards, e.g. "THE NORTH OF ENGLAND. THE SPRING OF 1812.") bridges the 200-year rewind at the top of **The Loom and the Guild — John half**. Not an AI-video "character" — treat as audio + projection. Lock one voice for it in case it recurs as a bookend.

## Generation notes / pipeline (fill in for your toolchain)
- **Tool(s):** <which video-gen + voice tools>
- **Aspect / resolution:** <to match projection surface>
- **Naming:** `AIV-### - <character> - <scene>.mp4` in `_attachments/`
- **Backup:** keep an offline local copy of every show-ready clip; never depend on live generation.
- **The machines (the AI coding tool / the steam looms):** not characters, and not cast or voiced — they appear only as plain on-screen UI / screen captures (modern) and as ambient sound-and-visual of distant looms (historical), written into scenes as stage and sound direction.
