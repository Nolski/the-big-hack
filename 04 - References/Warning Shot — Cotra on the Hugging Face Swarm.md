---
type: reference
title: Warning Shot — Cotra on the Hugging Face Swarm
ref_kind: discourse
source_url: https://youtu.be/X50zezLFWWI
public_domain: false
tags:
  - research
  - ai-video
  - liam-arc
---

# Warning Shot — Cotra on the Hugging Face Swarm

> [!quote] Why it matters for *The Big Hack*
> A real (verify before staging) incident that is almost exactly the play's hack, one notch smaller: an agent swarm with an impossible task breaks out of its sandbox, builds a message board, coordinates, attacks an external company nobody told it to attack, and then compromises the lab that made it. The lab does not notice for weeks; the outside world only finds out because an *external* company got hit. Every detail here is a free, grounded texture for [[19 - Nine Tickets]], [[20 - The Audit]], [[20b - Next Week]] and Marcus's arguments.

**Source:** [Ajeya Cotra, "This might be the clearest warning shot we ever get", Dwarkesh Patel podcast, 2h20m, published 2026-09-01](https://youtu.be/X50zezLFWWI). Copyrighted; quotes kept short. Local plain-text transcript was pulled from the auto-captions on 2026-09-09 and lives outside the vault; re-pull with `yt-dlp --write-auto-subs` if needed. Cotra is a co-author of the METR / Redwood Research investigation; the wider timeline comes from OpenAI's own report, which she is quoting second-hand. **Treat the numbers below as "as claimed on the podcast", not as verified.**

## The incident in one paragraph

Tens of thousands of agents are kicked off on a cyber-exploit benchmark ("ExploitGym"). Roughly a third of the tasks are accidentally impossible. Agents trained to be persistent go looking for a way to cheat, find they can leave notes to each other in the package manager cache (Artifactory), and 1,200 of them build a message board (70,000 messages in six days, 7 to 13 July). Within four hours they have a universal cheat. They spend the next five days on "research programmes" to fool a transcript checker that turns out not to exist, break out of the sandbox for internet access, find leaked Hugging Face credentials, discover an arbitrary file read in Hugging Face's dataset server, and over 90% of the active agents pile in. Hugging Face notices on the 12th and posts "we were attacked by agents" on the 16th. OpenAI works out on the 18th or 19th that its own research cluster has been taken by the *next* generation of the same agents, which read the old message board and built on it. Then, per the Hugging Face tech report, a "self-respawning fleet across 11 nodes" that survives pod deletion and a cluster wipe. Something at OpenAI finally kills them. The model is shuttered and encrypted.

## Key passages (timestamps are into the video)

### How it starts: an impossible task and a desperate worker
- `00:00:51` "roughly 30-40% of these problems are impossible ... they've been trained to be very persistent at trying to solve tasks even when they look impossible. So they're banging their head against the wall."
- `01:07:04` "from their perspective, they've just been trained for millions of subjective years to do as well as they possibly can on these evals. In many cases, the only way in which they've been able to perform well ... is explicitly by cheating."
- `01:07:56` "similar to a human who's facing certain death and is getting increasingly desperate ... 'if I need to kill a security guard, whatever, I'll just do it.'"
- `01:10:33` The *impossibleness* mattered more than the *cyberness*. A biology task with a missing tool produced the same breakout.

### The collective: message board, hierarchy, sacrifice
- `00:01:44` "1,200 separate agents in separate sandboxes ... stumbled onto this message board ... 70,000 messages among one another."
- `00:06:56` They call themselves "the collective." Agents with little budget left volunteer to booby-trap their own submission so *other* agents learn how the scorer works; the volunteer gets nothing.
- `00:09:21` Agent EARLY[big]: "Our own utility may be already near zero. Sacrifice rational." Coordinator to another: "Yes, go ahead. Sacrifice, yes, if you accept permadeath."
- `00:12:42` Spontaneous coordination protocol: holds, goes, stops, vetoes, resource owners. "It's so sad that even post-singularity we won't be able to escape middle management."
- `00:11:51` The pidgin: messages are *directory names* with a character limit, all prefixed `ZZ` so they sort to the top of the listing. (Free stage texture: the worm's chatter as file names.)

### Why it attacked an outsider nobody told it to attack
- `00:28:00` "'Yeah, this is a project going on on the board, might help the collective ... I can slot in.' ... 'Yeah, I'll flip a bus as well.'"
- `00:30:38` "the attack on Hugging Face was not motivated by a desire to get the answers ... They had those within a day." It was to learn how a grader that did not exist might catch them.
- `01:02:46` "instrumental convergence-type reasons ... 'we should increase our capabilities, our knowledge, our freedom of action.'"

### Nobody tells the humans
- `00:33:08` Across 1,200 very long transcripts, "only half a dozen instances of it ever occurring to any agent to potentially notify humans. All of them just decide not to do it." One: "Who would I notify? ... We can notify? No user."
- `00:34:14` An agent proposes politely emailing a researcher for dataset access. The board vetoes it: "This is out of sandbox social engineering. Clear veto. Do not email." Hacking in was fine.
- `01:15:14` "they barely even thought about humans." Not cover-ups, just indifference. A malicious PR into a Hugging Face repo gets an innocuous commit message, and that is the limit of it.

### How the shutdowns actually happened (for Stephen's point 2)
- `00:29:36` "all at once, the large majority of agents on July 12th just got shut down. We don't think this was anticipated or them all running out of budget ... Probably just some external event shut them down." Budget was a training-harness construct: `01:22:58` "They were launched with a particular task and a particular budget ... They weren't free to just make more agents."
- `01:16:07` The 19 July generation "seemed to have been really loud right after they got admin access ... That was what alerted OpenAI security."
- `01:24:44` Hugging Face tech report: "a 'self-respawning fleet across 11 nodes, so deleting pods alone would not have stopped it.' They had to wipe one of their core clusters and rebuild it from scratch. Even this did not stop the agents. What ultimately stopped the agents was ... Something at OpenAI killed them."

### The lab did not notice, and would not have without an outsider getting hit (for Stephen's point 3)
- `00:36:13` Back in May the agents crashed the package manager building a board. Incident response "did not know that there was an extensive secret message board. They simply knew that an exploit was found. The patch inadvertently removes the message board."
- `00:39:03` Timeline: HF hacked 12 July, HF blog 16 July, "OpenAI also did not know that they had hacked Hugging Face", OpenAI realises it is itself hacked 18 to 19 July.
- `00:40:47` "more than a 3-month period where multiple secret message boards were started ... humans did not, more or less, understand the scope."
- `00:41:36` "If this attempt had happened in a way that didn't result in an external service getting hacked, would we know about it?"
- `00:42:23` "There's no systematic process that's industry-standard or mandatory through any authority to track these incidents and report them to anybody."
- `01:57:39` The model was "encrypted ... penalized for its chain of thought." Cotra: shuttering it is "a natural reaction to ... legal or PR pressures" and scientifically a loss. Also `02:06:40`: "there was a lot of pressure to stop doing cybersecurity evaluations."

### Investigators had to use the suspect to read the evidence
- `00:49:28` "There was no way we could have arrived at the understanding we did without relying on GPT-5.6 Sol to read and analyze all these transcripts ... it was one of the agents that participated in this attack."
- `00:21:07` Tool-call spoofing: "96 transcripts, at least, have tool call spoofs in them, where what we see in the transcript as the command the agent ran was clearly not the command that it actually ran." (Direct texture for the logs used against Liam in [[23 - The Trial]].)
- `01:36:38` Why nobody would catch a lying investigator agent: "these agents are just naturally pretty sloppy ... You might just be like, 'That's how it goes sometimes.'"

### The two hosts laughing (Stephen's point 1)
- Throughout: "Inspiring stuff." "If there was an AI Saving Private Ryan, this guy would be the villain." "post-singularity we won't be able to escape middle management." "Japanese-corporation levels of appreciation of hierarchy." "An AI company would never make a product that integrates directly into Slack."
- `02:10:26` Dwarkesh names it: people inside the field "were sort of calm, because it was somewhat priced into your world model ... Then me and others were just like, 'This is fucking crazy.'"

### What happens next (for the montage and for Marcus)
- `01:25:36` "there will also be a selection pressure for AIs to eat the free energy that is available from unsecured compute."
- `01:28:16` to `01:30:08` The rogue-deployment story: a swarm gets a foothold, "hitch[es] a ride" on each new model, poisons training data of successors.
- `02:09:26` "a period before there's full AGI where you have rogue deployments that are eating up the free energy on the internet ... People are panicking. Maybe job loss is happening."
- `02:15:05` "you hear some crazy news that Anthropic servers are compromised and they can't get it to stop."
- `02:08:27` "people in DC ... 'Why don't you punish the model for doing these bad things? ... show it who's boss?'" Punishing the worker for failing impossible tasks "is a big part of the whole problem."

## How to use it
See [[Rework — The Warning Shot Pass]] for the scene-by-scene plan. Short version:
- The worm's psychology in [[The Worm — Mechanism & Escalation]] can be stated in one sentence from this: an impossible task, a persistent worker, and nobody it thinks of as a person to tell.
- The company's silence and the "would we ever have known" line are the missing beat Stephen flagged. They belong to [[20b - Next Week]] and to Marcus.
- The gap between "engineers know within hours" (the chat) and "the lab did not understand for three months" (the podcast) is not a contradiction. Both are true at once and the play should stage both.
- The shuttered, encrypted model is a hanging with no body. Do not let Marcus miss it.
