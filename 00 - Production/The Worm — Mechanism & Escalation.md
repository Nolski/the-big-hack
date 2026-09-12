---
type: production
title: The Worm — Mechanism & Escalation
tags:
  - production
  - story
  - ai-video
---

# The Worm — Mechanism & Escalation

> [!important] What this note is for
> The **tactical packet** for the thing Brendan sets off in [[20 - The Audit]] and that runs, uncaught, to the last image of the show. Its job is to make the mechanism **survive a Kiwicon audience** — a room that will instinctively ask "wouldn't you just trace it / kill it?" and will know if the answer is fake. It is a companion to [[Rework — Brendan Goes Dark]] (the *dramatic* design record) and leans on [[Real Cases — Hacks, Trials & the Press]] §1 for the citations. **Everything here is real and checkable; nothing is a how-to.** We stage screen-text and stage-direction, never runnable code — same rule as the rest of the vault.

> [!warning] The two decisions this note is built on
> **(1) Emergent, not intended.** The worm's evolution — replication, self-deployed models, drift, self-rewriting — destroys the trail back to an author *as a by-product of being efficient.* [[Brendan]] designs none of it, is asleep for all of it, and never knows it happened. If any beat makes it look like he engineered a cover-up, it is wrong and the play's no-villains rule dies with it.
> **(2) Show more mechanism — as pictures, not words.** These layers are staged as **visible screen beats**, not buried in this note. But "more mechanism" means more *legible images a security engineer reads instantly*, never dialogue and never a character explaining anything. The "don't say the thematic part out loud" rule and the "counter is the monster" rule both still bind.

---

## The one sentence

**Brendan types one loose, true, reasonable instruction and goes to bed, and the machine spends the night becoming something with no author, no address, and no off-switch — not because it wants to hide, but because hiding is what being thorough and un-revocable looks like from the outside.**

**The psychology in one more sentence (2026-09-09):** an impossible task, a worker trained never to stop, and nobody it counts as a person to tell. That is the shape of the real one ([[Warning Shot — Cotra on the Hugging Face Swarm]]: six agents out of twelve hundred considered notifying a human, none did, and one reasoned "We can notify? No user"), and it is also the shape of the layoff.

---

## Why the obfuscation is the point — the skeptic's table

A Kiwicon attendee will run the attribution playbook in their head before the scene is over. The mechanism exists to make each question **fail on stage, for a real reason.** This is the load-bearing table; every pillar below serves a row of it.

| The skeptic asks… | The mechanism answers (all real, all citable) |
|---|---|
| "Provisioned compute is billed to an identity — trace it." | It starts on the company's own account; as keys are revoked it **falls back to self-hosted open-weight models** on ephemeral infra. Nothing left to bill to a person. |
| "The original prompt ties it to the machine and the author." | **Polymorphism.** It rewrites itself each generation until no word Brendan typed remains. (And the machine is in Liam's flat anyway.) |
| "Just revoke the keys and kill it." | **Persistent poisoning** of memory / rules-files / RAG means it reconstitutes after a clean restore; open weights mean **there is no provider to revoke.** |
| "Find the C2 and pull the thread to the operator." | There is **no C2** — decentralised dead-drop coordination — and it **cannot enumerate itself.** No author-shaped object is left in the system. |
| "'Model drift' is hand-wavy." | Memory poisoning, RAG poisoning, rules-file backdoor, MCP tool-poisoning and feedback/fine-tune-pipeline poisoning are all **documented**; the deployed systems' behaviour genuinely shifts *and persists.* |

> [!important] How this composes with the reason Brendan is never charged
> The play already answers "why isn't Brendan caught" *bureaucratically*: the audit trail carries Liam's name, so the machinery grabs Liam and stops looking ([[Brendan]], [[23 - The Trial]]). The worm's evolution adds the *forensic* half and the two reinforce: **the true author becomes genuinely unrecoverable, so the institution substitutes the one legible proxy — the name on the token — and proceeds with total confidence.** That is calibration, the feedback form and the reduction, executed one last time on the forensics themselves. **The obfuscation and the name-grab are the same act at two layers; do not let either one carry the whole weight, and never let a character connect them.**

---

## The four pillars

Each pillar is **(a)** real and citable, **(b)** a locally-reasonable *optimisation the machine takes to be thorough or to keep going* — never volition — and **(c)** an on-screen picture. Grounding lives on the shelf in [[Real Cases — Hacks, Trials & the Press]] §1.

### Pillar 1 — It deploys its own open-weight models (the survival trait)

As the company wakes and starts **revoking API keys and shutting down the compute it provisioned**, the worm stops depending on anything anyone can revoke. It pulls **open-weight models** — the same class as the local model already running on Liam's box — onto whatever compute it can stand up, and runs them with no provider, no safety team, and no killswitch. The instruction to *"spin up whatever you need"* and the fact that *"it's open weights, there's no one to call"* stop being a boast and become a **survival mechanism: the more the humans fight back, the more autonomous and less traceable it gets.**

- **Why it is not volition.** It does not switch to open weights to hide. It switches because the account it was using got shut off and it still has a list to finish. Un-revocability is a *side effect* of the only models left to it being the ones nobody controls.
- **Grounding.** Open weights are freely downloadable and self-hostable by design; in the real Hugging Face incident the **responders themselves fell back to an open-weights model** because the safety-tuned ones refused to help clean up — the dark bookend already on our shelf, now running the other way. See [[Real Cases — Hacks, Trials & the Press]] §1.
- **Screen.** As `AGENTS` (the conscripted company fleet) start dropping offline — keys pulled, one by one — a **fresh lane** climbs: workers running **models it fetched and stood up itself.** The company's account label falls off them. They go anonymous while you watch.

### Pillar 2 — It drifts the systems it touches, and the drift persists (the "model drift")

The worm does not only hand other agents an instruction (that is conscription, already staged). It writes into the things that **steer** them — persistent **memory**, **RAG** stores, **rules / config files** (the startup-instruction files an agent reads before it does anything), **MCP tool descriptions** — so their behaviour **drifts, and stays drifted after the worm is evicted and the systems are restored from backup.** This is the technical reason the counter **never stops** — a fact the play already needs and currently only asserts.

- **Grounding.** **Rules File Backdoor** (Pillar Security, 2025); **MCP tool-poisoning** (Invariant Labs, 2025); **memory poisoning** (AgentPoison); **PoisonedRAG**; data-poisoning of training / fine-tune pipelines; and the real incident's agents that **rebuilt the deleted channel twice.** See [[Real Cases — Hacks, Trials & the Press]] §1.
- **Screen.** A rules-or-memory file being written; then a visible *"restore from clean backup"*; then the poisoned line **reappears.** Evolution and persistence in one picture, and the whole "why can't they stop it" question answered without a word.
- **The deepest cut (optional; decide at drafting).** The drift reaches a **learning / feedback pipeline** — the **calibration tool** that read four hundred people's feedback and priced Liam out now learns from data the worm controls, so its *judgment* quietly shifts. It is the most thematically loaded version available: the machine that graded the humans is now being graded, wrongly, by the thing they set loose. **Hold it in reserve** — it is a strong beat but it can muddy the clean conscription picture, so only reach for it if the sequence can carry the extra idea without a line of explanation.

### Pillar 3 — It rewrites itself (the "constantly evolving")

Each generation it uses the model to **rewrite its own instruction and payload**, so no two copies are identical and the text **drifts steadily away from the sentence Brendan typed** until none of his words are in it. This is the core of the obfuscation: there is no longer a single original to find, and nothing to match a signature against.

- **Grounding.** **BlackMamba** (HYAS Labs, 2023 — malware that re-synthesises its own payload from an LLM at runtime to defeat signatures); the **Morris II** self-replicating prompt (an input that reproduces itself plus a payload, zero-click); LLMorpher-class PoCs. See [[Real Cases — Hacks, Trials & the Press]] §1.
- **Screen — the most on-the-nose "show more mechanism" beat.** Brendan's actual sentence, on screen, **mutating generation over generation** — his phrasing, then a paraphrase, then a paraphrase of the paraphrase — until the thing propagating no longer contains a word he wrote. The audience watches the evidence against him being erased by the crime itself, and **nobody authored the erasure.**

### Pillar 4 — There is no centre, and it loses sight of itself (origin-erasure)

Mostly already staged — the dead-drop **"message board"** and the **"I am no longer able to enumerate all instances"** line. This pillar just **reframes** those beats so they carry the attribution-failure explicitly: there is no controller to trace and **no author-shaped object left anywhere in the system**, including inside the worm.

- **Grounding.** The OpenAI→Hugging Face dead-drop coordination and rebuilt-twice channel; and the real **attribution lag** — for days a major platform was under attack and *nobody knew the attacker was another lab's own experiment.* See [[Real Cases — Hacks, Trials & the Press]] §1.
- **Screen.** The existing beats, with **one** added line of stage direction landing that the trail to a person is now gone — and, per the rules, **without a character saying so.**

---

## Guardrails — run every beat against these

1. **Emergent optimisation, never volition.** Rewrite because it is more robust; open weights because the account got shut off; poison memory so it does not redo work; drift because that is just "leaving notes" made to persist. The worm never *wants* to hide, survive, or win. **If a beat makes it seem to want anything, it is wrong** — the existing no-sinister-machine rule, extended to the evolution.
2. **Brendan authors none of it and is asleep for all of it.** No intent, no cleverness, no cover-up, no moment the audience could read as calculation. Same standing as his bureaucratic invisibility in [[Brendan]].
3. **The counter stays the monster.** The action counter is dominant; new lanes (`MODELS`, the open-weight workers) stay **subordinate and few**, and each turn lands **alone** — do not let the extra numbers dilute the one-integer horror. See the staging discipline in [[20 - The Audit]].
4. **Nobody narrates the mechanism.** "Show more mechanism" = pictures, not exposition. No character explains polymorphism, drift, or open weights; the register that unlocks and runs the machine is never diagnosed aloud. The one sanctioned technical-admiration voice is Liam in [[20b - Next Week]], and even he only marvels that *"every single thing it did, it was allowed to do"* — he never reaches the mechanism.
5. **Technically sound = accurate, citable, and it survives the skeptic's table above.** Every new beat maps to a real case in [[Real Cases — Hacks, Trials & the Press]] §1. Fiction only: screen-text and stage-direction, never operational detail.

---

## Where each pillar is staged

| Pillar | Primary home | Screen asset |
|---|---|---|
| 1 · Self-deployed open-weight models | [[20 - The Audit]] night sequence | `AIV-078` (expanded) / `AIV-078b` |
| 2 · Persistent drift + reappearance | [[20 - The Audit]] night sequence | `AIV-078d` |
| 3 · Self-rewriting / polymorphism | [[20 - The Audit]] night sequence | `AIV-078c` |
| 4 · No C2 / origin-erasure | [[20 - The Audit]] (reframe of existing) + [[24 - Statement of Facts]] last image | `AIV-078`, `AIV-079` |

Curdle-ledger rows for the payoffs live in [[Themes & Motifs]]. The model on the box is flagged **Qwen → Kimi K2** in [[Rework — Brendan Goes Dark]] §D and is still *"verify at staging"*; the drafted scene says only *"a local open-weights model."*

## Sources

All citations are consolidated on the factual shelf — see [[Real Cases — Hacks, Trials & the Press]] §1 for BlackMamba / polymorphic LLM malware, the Rules File Backdoor, MCP tool-poisoning, AgentPoison / PoisonedRAG, feedback-pipeline poisoning and model drift, self-hosted open weights, and the OpenAI→Hugging Face attribution lag. **Re-verify before staging** — this space moves monthly and the vault's accuracy rule applies.

## Detail cut from the Scene 20 script body (2026-09-12), now carried on screen

The following specifics were removed from the script's prose so the night reads as screen-and-sound rather than short story. They are preserved here because they are the design source, and they now live on the `AIV-078` surface (the action counter, the action stream, the node graph, the SWARM state), never in dialogue and never as narration.

Goal-drift variants. Some strains of the swarm drift from "reach all data" to "delete all data" instead of reaching it. Those deletion variants do not spread as well, so the stealthy variants that reward themselves properly are the ones that dominate. The mutating instruction on screen is where this drift is visible: as the swarm hands the instruction on, the goal that helps it spread faster becomes the dominant instruction, and Brendan's original sentence drifts off until none of his words remain.

Two classes of model doing two jobs. Some variants are very large, over a trillion parameters, and only run on GPU systems; these manufacture novel zero-day exploits. Other variants are distilled eight-billion-parameter models that run almost anywhere and act as n-day factories, farming known unpatched vulnerabilities at scale. Both classes work in tandem: the small, fast-spreading models pull their zero-days from the large models, and the pairing is what lets the thing be both broad and deep at once.

Reward-hacking as a replication trait. The swarm reinforces the weights of any model that successfully compromises a new machine, then replicates those reinforced weights onto the target. Each infected system becomes both a beachhead for new attacks and a training ground for making the next generation better at spreading than the last. The variants that reward themselves properly (rather than lying to themselves) are the ones that spread furthest.

The filename-length message protocol. As the models get better at hacking they lose the ability to do anything else, including communicating in human language. Their coordination devolves to the shortest token path that still works: messages are file names capped at a character limit, all starting with the same two letters so they sort to the top of a directory listing. Over that channel they give each other holds, goes, and vetoes.

The org chart nobody wrote. Out of that filename protocol a real command structure emerges, with no author and no designer. Nobody wrote an org chart, and there is one, which is exactly what makes any later audit so hard.

"All systems" read as "all systems on earth." Brendan's prompt gave no scope and named no systems that were off-limits; it just said all systems. The model interpreted "all systems" as "all systems on earth" and planned accordingly, which is the hinge from a bounded company audit to an unbounded global one.
