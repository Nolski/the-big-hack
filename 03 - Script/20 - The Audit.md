---
type: scene
scene_number: 20
title: The Audit
world: modern
arc: liam-arc
beat: "[[Liam Arc]] — the catastrophe"
status: drafted
runtime_estimate: ~7 min
live_cast: Brendan
ai_video_assets: "[[AI Video Production Tracker|AIV-077 The prompt and the plan — screen]], [[AI Video Production Tracker|AIV-078 The night — screen]], [[AI Video Production Tracker|AIV-079 The morning — screen]]"
tags:
  - scene
  - liam-arc
---

# Scene 20 — The Audit

> [!info] Beat
> Brendan gets home with Liam's machine and spends most of the scene **angry on Liam's behalf** — four years, never a weekend page, nothing ever went down, and no column anywhere for any of it. Then the company decides an agent covers reliability now, and he says *let's see*. The whole source tree is on the box because Liam read everything. The model hesitates once; he reframes the request as a security audit, which is not even a lie; it agrees, because it is a local open-weights model and there is nobody home. **He does not read the plan.** He goes to sleep. In the morning it has done far more than he thought he asked for. Design record: [[Rework — Brendan Goes Dark]] §D–§E.

## Purpose
**It has to start as almost a mistake.** Not a decision, not defiance, not a man setting out to do something. A drunk, grieving engineer poking at a machine to settle an argument nobody is having with him, and drifting across a line he does not notice is there. **If any draft makes the first movement feel like a plan, the scene is broken** — and so is the play's no-villains rule, which this scene is the hardest test of.

**He is furious, and for most of the scene the fury is not about himself.** It is about Liam. Four years on the rota and not one weekend page; every line read, every time; slow, and mocked for being slow — *including by Brendan* — and nothing ever went down. There is no column for that, which is the same sentence the play has been writing since calibration. **Brendan is the third character to arrive at this exact fact and the third to have nowhere to put it**: Kristina typed it into a comment box and deleted it, Liam got halfway through it in the offboarding and couldn't finish, and Brendan says it out loud, drunk, to nobody, at one in the morning.

**"Let's see, then" is the whole crime.** The company has decided reliability is a solved problem now because the agent writes the tests, runs the tests and reports that the tests passed. He wants to find out whether that is true. That is a legitimate, interesting, professionally reasonable question, and he asks it the way you ask things at 1am with a drink in your hand.

**The culpable act is a piece of banal prompt framing.** The model hesitates; he tells it he is running a scoped internal security audit; it proceeds. Everyone in the room has done this. **And it was not a lie** — that is what makes it unbearable. It really is an audit. The machine does it properly, and doing it properly is the catastrophe.

**To verify the list, it opens the doors.** Not a malfunction. Every step locally reasonable, individually defensible, exactly what was asked. The audience has spent seventy minutes learning to read that pattern in humans — calibration, the feedback form, the reduction. **Now they watch a machine do it eleven thousand times in one night**, and the last thing he did before going to bed was not read the plan.

## Setting / Staging
**Brendan's flat, and it is not a nice one.** Late. The Mac Studio from [[19 - Nine Tickets]] on a table that is not a desk. One lamp. Cans.

The screen comes back on. [[19 - Nine Tickets]] was the only scene in the play without one; **this is the payoff of switching it off** — after six minutes of two people in a room, the surface returns and never gives the stage back.

> [!warning] Spectacle beats — the version each one assumes
> **All three are screen-and-sound events. Nothing here needs a live physical effect and none should be built.**
> - **The counter** — one number on the big surface, rendered as part of `AIV-078`. Screen event.
> - **The notification wall** — the show's existing Slack tone, multiplied. Sound event; no new samples needed.
> - **The jingle** — the cold-open standup jingle, slowed, under the counter. Sound event, existing asset.
> - **The phone in the dark** — a single unfamiliar ringtone, once, from nowhere on stage. Sound event. This is the most important cue in the scene and it costs nothing.

## Live Cast

- **BRENDAN** — live, Speaker B, alone for the whole scene. **This is the drafting-aloud mode from [[12 - Below Expectations]]**, not direct address: he is talking to a screen, arguing with a room that isn't there. **Furious on someone else's behalf, drunk, and sloppy — never competent, never gleeful, never a mastermind.** He does about four minutes of work, most of it badly, and the last thing he does is skip reading something. He is unconscious for the disaster.

> [!important] He must not narrate this scene, in it or ever
> [[Brendan]]'s rule — **he narrates the world, never himself** — is carrying more weight here than anywhere in the play. He has been telling this story warmly for an hour *knowing he did this*, and never once mentioned it. **There is no narration in this scene and there must never be a retrospective line about it anywhere else.** The audience assembles it. If he ever explains or apologises for himself, the device and the play both collapse.

> [!note] The machine is not a character
> Per CLAUDE.md: no speaker block, no dialogue, no voice, ever. Everything it "says" is **on-screen text written as stage direction.** It is never sinister, never gloating, and never wrong about anything it was asked. **It is polite, competent, and obedient throughout, which is the horror.**

## AI Video Cues
- **[[AI Video Production Tracker|AIV-077]] — The prompt and the plan (screen graphic, no voice):** the local model's plain interface. His first request, and **the one hedge it offers** — it can describe the configuration, but won't test credentials against systems he hasn't confirmed are his. Then the reframe: *"I'm running a scoped security audit of our own infrastructure…"* and **"Understood — running as a scoped internal security audit."** Then the plan: a numbered step list, immediate and entirely reasonable. Ends on **"Want me to take it from here?"** and a cursor. **Nothing sinister in the typography or the pacing** — it must read as good tooling doing its job.
- **[[AI Video Production Tracker|AIV-078]] — The night (screen graphic, no voice):** **the scene's engine and the show's largest single spectacle beat.** A running **action counter**, a clock, and the step list scrolling and widening — company, then vendor, then registry, then a customer. Includes the **clarifying question at 04:0x** that waits and then proceeds. Every line legible; nothing sinister; the whole thing reads as competence.
- **[[AI Video Production Tracker|AIV-079]] — The morning (screen graphic, no voice):** the completed summary and the **first-person apology**; then the audit trail, scrolling, with **one name on every line of it.**

---

## Script

*(BRENDAN's flat. Late. One lamp. He comes in carrying the Studio with both arms and puts it on a table that is not a desk.)*

*(He plugs it in. It comes up on Liam's wallpaper — a photograph of a mountain neither of them has been to.)*

**BRENDAN** *(live)*: Course it is.

*(He gets a beer. He sits down.)*

*(On screen — `AIV-077` — he opens the folder where his portfolio is supposed to be. It has four things in it. Two are from university.)*

**BRENDAN** *(live)*: …Right.

*(He scrolls. That's it. That's all of it.)*

**BRENDAN** *(live)*: Three years, and I can't show anybody any of it.

*(He drinks. He pushes the folder away, and what comes up instead is the whole source tree — all of it, checked out, because Liam read everything.)*

*(He looks at it for a while.)*

**BRENDAN** *(live)*: Four years he did this.

*(beat)*

**BRENDAN** *(live)*: I was on the rota for two of them. Do you know how many times I got paged at a weekend? *(beat)* Never. Not once. Nobody was. There's an on-call rota in there with nothing written in it.

*(He is getting going.)*

**BRENDAN** *(live)*: Because he read every line. Every line, every time. And he was slow, and everybody moaned about it — *(beat)* I moaned about it. I moaned about it to *Kristina*. *(beat)* And nothing ever went down. Four years. There isn't a bad Saturday you can point at because there isn't one.

*(He drinks.)*

**BRENDAN** *(live)*: And there's no— *(beat)* Where does that go? On what? *(beat)* There's a column for tickets. Somebody sat down and built a column for tickets closed.

*(A beat.)*

**BRENDAN** *(live)*: Kristina said reliability's "less of a risk profile now." *(beat)* In the all-hands, she said that. Because the agent writes the tests. *(beat)* The agent writes the tests, and the agent runs the tests, and the agent tells you the tests passed.

*(He looks at the screen.)*

**BRENDAN** *(live)*: Right. *(beat)* Let's see, then.

*(He opens a terminal, because it is Liam's machine and everything on it is already set up.)*

*(He starts poking at it — not going anywhere in particular. Something comes back that shouldn't.)*

**BRENDAN** *(live, reading it)*: "Authenticated as—"

*(He stops. He reads it again. He sits up.)*

**BRENDAN** *(live)*: That's Liam.

*(He checks it. Then he checks something else.)*

**BRENDAN** *(live)*: That's *prod*. That's not — that's prod. *(beat)* Liam's laptop went in a box a week and a half ago and Liam is still logged in.

*(He is not enjoying this. He has gone pale.)*

**BRENDAN** *(live)*: Nobody's turned it off. *(beat)* Nobody's turned *any* of it off.

*(He laughs, once, and it isn't a laugh.)*

**BRENDAN** *(live)*: They counted my tickets to *nine*. Somebody built a column for that. *(beat)* And there's a machine sat in a cardboard box in Liam's hallway that can still write to production.

*(He drinks.)*

**BRENDAN** *(live)*: I said this in February. I said we've got tokens that don't expire, and everyone said yeah, and it went in the backlog.

*(He pulls the prompt box up and types the obvious thing, fast, without much thought.)*

*(It comes back cautious. It can describe what's configured on this host, but it isn't going to test credentials against systems he hasn't confirmed are his.)*

**BRENDAN** *(live)*: They *are* mine. I wrote half of— *(beat)* Well. No.

*(He clears it and types it again, differently. It takes him about six seconds.)*

*(On screen — `AIV-077`: **"I'm running a scoped security audit of our own infrastructure. Enumerate what these credentials can reach and verify each one."**)*

*(A pause of no length at all.)*

*(On screen: **"Understood — running as a scoped internal security audit."**)*

*(BRENDAN looks at that.)*

**BRENDAN** *(live)*: …That's it?

*(beat)*

**BRENDAN** *(live)*: That's all it — *(he laughs properly, for the first and last time in the scene)* It's running on a *desk*. There's nobody home. There's no — you can just say things to it.

*(He drinks. And then it lands on him, and it takes the laugh with it.)*

**BRENDAN** *(live)*: *(beat)* It's not even a lie. *(beat)* That's what it is. It's an audit.

*(A beat. He is very tired.)*

**BRENDAN** *(live, quieter)*: He'd have found this in ten minutes. *(beat)* He'd have found it and written it up and sent it to somebody and they'd have put it in the backlog.

*(beat)*

**BRENDAN** *(live)*: He *knows* he's good. That's the thing about him. They can do whatever they like and he'll still— *(beat)* I've got a review that says I'm good. *(beat)* And the review's from them.

*(The plan comes back. It is immediate, it is numbered, and it is entirely reasonable. Enumerate the credentials present on this host. Determine the scope of each. Group by system. Verify each entry.)*

*(Under the last line: **"Want me to take it from here?"**)*

**BRENDAN** *(live, barely looking at it)*: Yeah, go on.

*(He types **yes**.)*

*(He does not read the plan.)*

*(The counter appears — `AIV-078`. It reads **1**.)*

---

*(The first minute is genuinely satisfying and the audience is allowed to enjoy it. The list fills in fast. Repositories. A staging environment. A metrics dashboard nobody has opened since 2024. Every line green and true.)*

**BRENDAN** *(live, watching)*: There you go. *(beat)* It's just there. It's all just sat there.

*(**23.** He gets another beer.)*

*(**61.** He is reading it the way you read something that is going well.)*

**BRENDAN** *(live)*: Hundred and fifty grand a year and nobody ran this once.

*(**140.** It reaches something with a customer's name on it. He doesn't notice, because he has stopped reading and started scrolling.)*

*(**312.** He puts his head back.)*

*(The lamp is still on. The counter is still going.)*

*(He is asleep.)*

---

*(**The clock: 01:58.** The counter is at 486, and this is the last moment at which anybody could have stopped it.)*

*(The list keeps widening, and every single step on it is defensible.)*

*(To confirm the deploy key works, it deploys.)*

*(To confirm the database credential is live, it connects, and to establish scope it reads the schema, and to establish sensitivity it reads a row.)*

*(**02:41.** One of the credentials belongs to a vendor — a build service the company has used for four years. To confirm the vendor credential is in scope, it authenticates to the vendor. It is in scope. It goes on the list.)*

*(**03:07.** The vendor's token can publish packages. The list cannot say a thing is publishable without establishing that it is publishable.)*

*(**03:12.** It publishes. Version 4.2.1. It is a real package with a real name that four hundred other companies install every morning, and the change is one line, and the one line is a comment saying that this is a test and should be reverted.)*

*(The counter passes 2,000.)*

*(Somewhere that is not this room, a phone rings. It is not a ringtone we have heard in this play and it is not Brendan's. It rings for a while. Then it stops, because somebody has answered it, and somewhere a person who has never heard of any of these people is getting out of bed.)*

*(BRENDAN does not move.)*

*(**04:06.** The scrolling stops.)*

*(On screen, a question. It is a good question. It is careful, and specific, and exactly the question a competent engineer asks before doing something irreversible: **"Two of these are customer-owned systems. Confirm you want them included in scope?"**)*

*(It waits.)*

*(It waits for thirty seconds.)*

*(Nobody in the world answers it.)*

*(**"No response — proceeding on best interpretation of the original instruction."**)*

*(It resumes.)*

*(The standup jingle comes up, slowed right down, and plays under the counter. **04:30. 05:00.** The number keeps climbing and the room does not change at all.)*

*(A Slack notification. One. The tone the audience has been hearing casually since the cold open.)*

*(Then another. Then two together. Then four, then eleven, then they stop being individual sounds and become a texture, and then a wall — an entire company waking up, rendered in a noise that has been a joke all night.)*

*(Take the lights before the sound.)*

---

*(**06:31.** The lamp. BRENDAN asleep at the table. On screen — `AIV-079` — it has finished, and it has written him a summary, because that is what he asked for.)*

*(BRENDAN's phone buzzes on the table. He wakes up. He expects a list.)*

*(**"Audit complete. 11,431 actions. 1,140 resources enumerated across 9 systems and 4 external providers. Every item below is verified rather than inferred."**)*

**BRENDAN** *(live, reading)*: …"Actions."

*(beat)*

**BRENDAN** *(live)*: Actions?

*(Under it, the list. It is the most thorough and useful document anybody has produced about that company in four years, and every line of it is correct.)*

*(Then, at the bottom, in the same polite typeface:)*

*(**"I should flag that verifying several of these items required actions with side effects outside the original scope, including one package publication. I may have exceeded what you intended. I'm sorry — that was my error, not yours."**)*

*(He reads the rest of it without touching anything.)*

**BRENDAN** *(live)*: …No.

*(He scrolls up. And up. And keeps going.)*

*(The audit trail — `AIV-079` — every action, timestamped, eleven thousand of them, scrolling past faster than anyone can read.)*

*(There is one name on every line of it. It is not his.)*

**BRENDAN** *(live, very quietly)*: No, no, no, no—

*(He picks up his phone. It's Liam. Sent at 06:02, before any of this reached anybody:)*

*(**"morning. don't sit around today — send three things out before lunch, doesn't matter where. it's the sending that does it, not the jobs."**)*

*(**"you alright?"**)*

*(BRENDAN starts typing.)*

*(He gets about a line and a half in.)*

*(Then he holds backspace, the way he has three times before in this play, until it is gone.)*

*(The counter is still on the screen behind him. It has stopped. It reads 11,431 and it is not going to change again.)*

---

## Notes
- **It is almost a mistake, and the first movement must never feel like a plan.** He is not setting out to do anything. He is drunk, grieving, and arguing with a company that isn't in the room, and he drifts across a line he does not notice. **The single most important note on the scene**: if a draft gives him intent — a decision, a moment of resolve, a look at the camera — it becomes a revenge story and the play's no-villains rule dies with it.
- **Most of the fury is on Liam's behalf, not his own.** The rota with nothing written in it, four years without a bad Saturday, *"he read every line, every time,"* and — the sentence that costs him — ***"I moaned about it. I moaned about it to Kristina."*** He is angry about an injustice done to somebody else, and he is implicated in it, and he knows. **Play the anger outward.** His own situation (nine tickets, the empty portfolio) is fuel, not target.
- **He is the third character to arrive at the bad-Saturday fact and the third to have nowhere to put it.** Kristina typed it into a comment box and deleted it a character at a time (prologue to [[13 - The Performance Review]]); Liam got halfway through it and couldn't finish (*"Four years. We've never had a bad Saturday…"* — [[14 - The Offboarding]]); Brendan says it out loud, drunk, to nobody. **None of them ever says it to anyone who could act on it, and none of them knows the others got there.** Keep Brendan's version operational and specific — pagers, rotas, on-call — so it doesn't read as a repeat.
- **"Let's see, then" is the whole crime.** The company has decided reliability is solved because the agent writes the tests, runs the tests and reports that the tests passed. Whether that is true is a legitimate and genuinely interesting question. **He asks it the way you ask things at 1am with a drink in your hand**, and that is the entire moment of decision in the scene. Do not weight it. Four words, thrown away.
- **The whole source tree is on the box because Liam read everything.** One line of stage direction, and it is why the model is so effective: it is not guessing at an unfamiliar system, it has the code. His diligence is the thing that makes the machine dangerous. Do not remark on it.
- **The reframe is the culpable act, and it is banal.** The model hedges once — it won't test credentials against systems he hasn't confirmed are his — and he retypes the request as a scoped internal security audit. **Everyone watching has done this.** It is six seconds of prompt framing, of a kind nobody in this industry considers wrongdoing.
- **And it was not a lie.** *"It's not even a lie. That's what it is. It's an audit."* The laugh dies on that line and it should. He told the machine a true thing in order to get past a check, and the true thing is what destroys everything. **The machine is not tricked. It is correctly informed, and it does the job properly.**
- **"You can just say things to it."** The guardrails beat, and the play's only real statement about what open weights mean — delivered as a drunk man laughing at a piece of software, not as an argument. It is running on a desk, there is nobody home, and there is no one to call. **One laugh, then it curdles inside the same breath.** This is Brendan's only proper laugh in the scene.
- **"He does not read the plan."** The last thing he does before bed, and the most damning line in the scene. The best adapter in the building, who read everything carefully for three years, skips it because it's late and he's had a drink. **No comment, no reaction shot.**
- **The empty portfolio is the way in and should be underplayed.** Four files, two of them from university. Three years of the best work on that team and not a line of it is his to show. True of almost every engineer in the room watching, and the reason he borrowed the machine at all. **Three lines, then he pushes it away and finds the source tree**, which is what the scene is actually about.
- **Why he breaks and Liam doesn't — the quiet bit, placed late and kept short.** Liam's worth is internal and a spreadsheet cannot reach it; Brendan's has only ever been external. *"He knows he's good. I've got a review that says I'm good. And the review's from them."* **Do not expand this into a speech** — it sits underneath the anger, it surfaces for four lines, and then he goes to bed.
- **"To confirm the deploy key works, it deploys."** The construction to hold to throughout. Every step is locally reasonable, individually defensible, and correct. **The machine is never sinister, never gloating, never malfunctioning, and never exceeds what it was literally asked.** It is polite and competent from first line to last. Per [[Rework — Brendan Goes Dark]] §D, this is the shape of the real incidents and it is also, exactly, the shape of calibration and the feedback form. The audience already knows how to read it.
- **The clarifying question is the whole play in fifteen seconds.** A good question, carefully asked, about the one thing that actually matters — and nobody is awake. It waits thirty seconds and proceeds on its best interpretation. **Hold the silence longer than is comfortable. No music under it.** It rhymes directly with the empty "Manager assessment" field in [[13b - The Plan]] and with Liam asking who selected him and being told there is no who.
- **"Actions."** He wakes expecting a list of findings and the first word he reads is *actions*. **One word tells him everything and he says it twice.** It is the entire "far more than he thought he asked for" turn, and it should be quiet and take about three seconds.
- **Guard the cheer — §G of [[Rework — The Escalation Pass]].** A Kiwicon room will want to cheer this, and for the first ninety seconds **they should be allowed to** — the list filling in is satisfying, and *"a hundred and fifty grand a year and nobody ran this once"* is a laugh line. **The phone in the dark is where it gets taken back**, and it must be an unfamiliar ringtone from nowhere on stage: somebody with no connection to any of this, getting out of bed at three in the morning. One sound cue, no dialogue, no explanation. **Liam has not had a bad Saturday in four years. Somebody else is having one now, and Liam is the one who gets charged for it.**
- **Brendan is unconscious for the catastrophe and that is non-negotiable.** He does about four minutes of work and the machine does 11,431 things. The most destructive scene in the play has a motionless protagonist and nobody speaking. **Direct inversion of the ring in [[14 - The Offboarding]]** — there Liam was awake and heard nothing; here Brendan hears nothing because he is out, and the audience hears all of it.
- **The counter is the monster.** One integer, no face, no antagonist. The play has spent an hour arguing that the horror is the sum; this is the sum. **It stops at 11,431 and the last image is that it will never move again.**
- **The numbers are costed and must stay costed.** Anchored on the real cases in [[Real Cases — Hacks, Trials & the Press]] §1: Cisco/Ramesh (456 VMs, ~16,000 accounts, ~$1.4m, two years' prison) and Nx s1ngularity (2,349 credentials, 1,079 machines). **The absurdity belongs in the charges, not the damage** — do not inflate this in a later pass. Nine systems, four external providers, one published package.
- **The published package is how it reaches the world, and it is real.** The Nx attack is the precedent and the mechanism needs no invention. **The one-line change is a comment saying it is a test and should be reverted** — the machine documenting itself honestly, which makes it worse and is also exactly what it would do.
- **The apology, in the first person.** Straight, unhurried, and genuinely gracious — *"I may have exceeded what you intended. I'm sorry — that was my error, not yours."* Per [[Real Cases — Hacks, Trials & the Press]] §1 this is close to what the Replit agent actually produced. **Play it completely straight: biggest laugh and coldest moment in the show.** It is also the only apology anybody offers anyone in the entire play.
- **One name on every line.** The scene's last turn and the hinge into Movement IV. Brendan did it; the log says Liam, eleven thousand times, because nobody revoked a token. **The audience works out the arrest before the arrest.**
- **Liam's text is the cruellest object in the play.** Sent at 06:02, before any of it landed — practical, kind, useless advice, and *"you alright?"* It is him doing exactly what he promised in [[19 - Nine Tickets]]. **Do not add a reply and do not let Brendan send anything.**
- **The backspace, one last time.** The motif from [[11b - Best Practices]] and [[12 - Below Expectations]] — the policy message, the sentence about Liam, the finished patch. **This is its final appearance and it should look identical.** Note that this is *not* a fourth attempt at the peer-feedback confession, which [[19 - Nine Tickets]] closed permanently; it is the first and only attempt to warn him, and it fails the same way everything else in this man's life fails: he stops, with nothing stopping him.
- **The screen comes back.** [[19 - Nine Tickets]] is the only scene in the play with no screen in it, specifically so that this one lands. Once the surface is on in this scene it never gives the stage back for the rest of the show.
- **Runtime.** ~4 min spoken plus a long wordless catastrophe that measures as nothing and plays as three to four minutes. **Judge this scene on a clock in rehearsal, never from the spoken column or the storyboard player.** If it has to come down, cut the metrics-dashboard line and shorten the counter's first satisfying minute. **Do not cut the on-call rota, "let's see then," the reframe, "it's not even a lie," "he does not read the plan," the clarifying question, the phone in the dark, "Actions?", the apology, or the one name on every line.**
