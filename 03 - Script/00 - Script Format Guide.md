---
type: reference
title: Script Format Guide
tags:
  - script
  - reference
---

# Script Format Guide

How to write a scene in this vault so that **live actors and AI video stay legible on the page**. Use the `Templates/Scene.md` template for every new scene.

## The three streams on the page
A scene juggles (1) live dialogue, (2) AI-video character dialogue, and (3) staging/cue direction. Distinguish them clearly:

- **Live actor** — bold name, `*(live)*`:
> **LIAM** *(live)*: I didn't break it. I *clarified* it.

- **AI-video character** — a callout block so it reads as "on screen," tagged with the clip ID from [[AI Video Production Tracker]]:
> [!screen] VIDEO — KRISTINA · `AIV-010`
> *Mid-standup, brisk.* Morning, everyone — let's keep it tight, lots on today.

- **The machines are NOT characters.** The AI coding tool and the steam looms never get a speaker callout and never have lines. Write the tool's on-screen text / UI and the looms' clatter as **stage / sound direction** (italics) — e.g. *(On screen: the plan streams out; a prompt waits — "Proceed?")* — never as a video dialogue block.

- **Stage / video / sound direction** — italics, on its own line:
> *(Keyboard-clack motif resolves into loom-clack. Lights shift warm → cold.)*

- **Direct address / narration** (Brechtian — see [[Inspiration — Tone & Form]]) — bold name + `*(to audience)*`:
> **JOHN** *(to audience)*: They called us criminals. We called it our supper.

## Timing live-against-video (the hard part)
AI clips are pre-rendered to a fixed length. So either:
- **Cut the clip to leave a gap** the live actor speaks into, or
- **Write the live line to play *over/against* a running clip** of known length.

Mark it explicitly: note the clip length and where the live line lands. Example:
> [!screen] VIDEO — Kristina · `AIV-010` *(10s, ambient — runs under the following)*
> *Mid-standup, smiling.* …so let's keep it brief, team, lots to get through.
>
> **LIAM** *(live, over the last 4s of the clip)*: Quick thing — the "brief" thing we shipped Friday is corrupting timestamps in prod.

## Scene frontmatter (set status honestly)
`status: stub → drafted → revised → locked`. The [[Structure & Scene Map]] table reads these. Always fill `beat`, `world`, `live_cast`, and `ai_video_assets`.

## House style
- **Comedy is specific.** Real tools, real rituals, real jargon — the laugh is in the accuracy.
- **The curdle is set up here, paid off later.** If you plant a joke, log it in [[Themes & Motifs]].
- **Period voice for John** — lean on [[The Weavers — Pulled Passages]] for cadence; don't pastiche.
- **Stage directions describe, don't novelise.** One vivid line beats a paragraph.

## Minimal skeleton
```
**LIAM** *(live)*: <line>

> [!screen] VIDEO — <CHARACTER> · `AIV-###`
> *<direction>* <line>

*(<staging/sound/light cue>)*
```
