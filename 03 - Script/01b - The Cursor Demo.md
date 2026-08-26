---
type: scene
scene_number: "1b"
title: The Cursor Demo
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
live_cast: Brendan
ai_video_assets: "[[AI Video Production Tracker|AIV-010 Kristina — Standup]], [[AI Video Production Tracker|AIV-014 Cursor demo — on-screen UI]]"
tags:
  - scene
  - liam-arc
---

# Scene 01b — The Cursor Demo

> [!info] Beat
> Second of the Movement I openers, straight off the standup ([[01 - Cold Open — The Standup]]). After Liam logs off, Kristina finally tries the tools herself — and the demo is *not* a magic trick. It fumbles, it's confidently wrong (paying off Liam's morning meme), it passes its own tests and then face-plants on the real workspace — and under the easy surface there's a surprising amount of craft. What wins her over isn't the tool; it's when *she* uncovers how deep **Brendan** has quietly gone to make brand-new tech behave. The seed of the velocity story is planted — but earned, and shadowed by a mistake nobody catches.

## Purpose
Flip the lens off Liam. Kristina, freshly slapped down, nearly reports him and is talked out of it — "you learn to work around him." Then Brendan walks her through Cursor for real: she fumbles the UI, the tool invents an API and tries to hardcode a secret (exactly what Liam warned about — he wasn't wrong), it passes its own sandbox tests and then fails on the live workspace when she actually runs the command — fixed by feeding it its own error — and she lightly challenges whether it's even saving time. What wins her over is not spectacle and not Brendan selling himself — it's that *she* notices the personal system he's built (rules files, a "things it gets wrong" doc) and realizes how much work he's put in to make it look this easy. Brendan just thinks it's the coolest thing he's ever done. The quiet, unspoken takeaway (the seed of the whole squeeze): this is where everything's going, and the person who got in early made the right bet — while the man dunking on it from the sidelines did not. One tool mistake slips past them, unowned.

## Setting / Staging
Continuous with the cold open — the standup grid has emptied to just two tiles, **Kristina** and **Brendan**, in a quiet post-standup huddle; Liam is gone. The screens stay with them: two coworker tiles, and then a shared screen as Brendan walks Kristina through **Cursor** live — plan mode, a plan that looks confident but is guessing, an invented Jira endpoint and a hardcoded token they catch and correct, a build that passes its own sandbox tests, an Approve/Deny install dialog, then a live `/jira done` in Slack that fails on a real permissions error nobody could have seen — fixed by pasting the trace straight back — before the ticket finally closes itself, and, unread, quietly closes three more. Behind it all, glimpsed on Brendan's screen: pinned tabs, a session transcript, a long personal doc — the quiet evidence of how much he's invested. The register is intimate and warm, a problem-solver and a curious, sharp student; the tension is in how *ordinary and reasonable* every small step feels. **Brendan is live (Speaker B), alone on stage at his desk**, driving the demo on his own screen while Kristina answers from her tile — Liam's desk sits dark and empty beside him. The Slack-huddle tone hums under it.

## Live Cast

- **BRENDAN** — live, Speaker B: not an evangelist and not a self-promoter — a problem-solver who's obviously lived in this and is genuinely delighted by how cool it is. Unbothered when the live run breaks (just feeds it the error). He *deflects* credit rather than claiming it; the depth is something Kristina drags into the light, not something he brags about. First flicker of something he can't name when she really sees it.

> [!note] Live/video plane
> Brendan plays these scenes **live at his own desk**, diegetically on the call — he and Liam are remote colleagues, so they share no props and never touch. Everyone else stays on the video plane.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-010]] — Kristina (PM):** drops the bright standup mask the instant the room empties; confides about HR, is gently talked down; she's tech-literate (knows vibe-coding, lives with these tools) but hasn't driven one herself — fumbles the UI, catches it lying, sees it face-plant on the live test, challenges its value, then is won over when *she* uncovers the personal system Brendan's built. Measured, not gushing.
- **[[AI Video Production Tracker|AIV-014]] — Cursor demo (on-screen UI):** the machine's first on-screen appearance — and it's fallible. A confident plan that invents a Jira endpoint and hardcodes a token (corrected on screen); a build that **passes its own sandbox tests** — then the **live `/jira done` failing on a real permissions error**, fixed by pasting the trace back; then an Approve/Deny dialog, the ticket closing (card slides to Done) — and, in small text nobody reads, silently resolving three linked issues too. Screen only, no voice. Mirror of the steam looms in John's world — marvelous, and not to be trusted blindly.

---

## Script

*(The standup grid is down to two tiles now: KRISTINA and BRENDAN. Below them LIAM's desk sits dark and empty — he's gone. The instant the room is just the two of them, KRISTINA's bright standup-runner brightness drops away. A smaller, realer voice. [MUSIC: music/slackhuddle.mp3])*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(quiet, just to Brendan now)*
> …Hey. Off the record — was that out of line, or is it just me? The degree thing. *(a breath)* I've been sitting here half-deciding whether it's an HR conversation.

**BRENDAN** *(live, caught between them, careful)*: …Honestly? The degree line wasn't okay. *(but)* But — he's not a bad guy. He's thorny. He's also the best engineer I've worked with — I've learned more from him than from anyone here. You just learn to work around the edges of him.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> "Work around him." That's the job, is it.

**BRENDAN** *(live, a small, honest shrug)*: …Kind of? Sometimes. *(beat)* I don't think HR fixes him. I think it just makes the next standup worse for both of you.

*(She sits with it. Lets it go — for now.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(changing the subject — and something underneath it)*
> …Okay. Different thing. *(lighter, but the degree comment still sitting in her chest)* I've been meaning to actually try this stuff myself — Cursor, Claude, all of it. Everyone's shipping circles around me and I'm managing it from the outside. I don't love feeling behind on it. *(a beat, almost reluctant to ask)* Would you actually show me how you use it? Properly — not the demo version.

**BRENDAN** *(live, lighting up)*: Yeah — happily. *(honest)* Fair warning, it's rougher than the demos make it look. But it's honestly the most fun I've had in years. *(thinks)* Easiest way in is to build something real. That ChatOps bot you keep asking eng for — close a Jira ticket from Slack? Nobody's had time. Let's just… try it. Right now.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(skeptical, game)*
> I mean — I've watched half of Twitter vibe-code a startup over a weekend. I've just never actually driven one of these myself.

**BRENDAN** *(live)*: Perfect — that's kind of the point, you don't have to. Open Cursor. Top right — put it in plan mode. Then just tell it what you want, like you'd brief a contractor. Your own words.

*(KRISTINA leans in, hunting the interface, narrating it like the machine might bite.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(lost for a second)*
> …Wait, which one's plan mode? There's like four of these.

**BRENDAN** *(live, easy)*: Ha — yeah, that trips everyone up. The dropdown, top. Not "agent" — the one under it. There.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(reading as she types)*
> Okay… "Build a Slack bot so our team can close Jira tickets from a slash command — slash-jira-done — and post back a clean confirmation." *(looks up)* …and I just send it?

**BRENDAN** *(live, grinning)*: Yep. Send it.

*(She hits enter. A plan streams out on screen — steps, files, an architecture.)*

*(On screen — `AIV-014` — the plan writes itself out: a Slack slash-command handler, a Jira client, a deploy config. It looks authoritative. At the foot of it, a prompt waits — "Proceed?")*

**BRENDAN** *(live, scanning it — the practiced eye, slowing her down)*: Okay — see, this is the part people skip. It looks confident, but it's guessing. *(points)* Look — it invented a Jira endpoint. "Tickets-slash-close." That's not a real call; that doesn't exist. And down here — it wants to paste the API token straight into the code.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(deadpan, the penny dropping)*
> …hardcode the credentials. *(a dry beat)* So Liam wasn't just being dramatic this morning. It literally just tried to do the exact thing.

**BRENDAN** *(live, a small laugh)*: No — he's not wrong about this part. It'll say all of it with a completely straight face. That's the whole skill now: catching it. You don't rewrite it — you correct it. Tell it.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(typing, getting it)*
> "Use the real Jira REST API — verify the endpoints actually exist — and keep the token in Vault, nothing hardcoded." *(aside, dry)* See, I do listen on the security stuff.

**BRENDAN** *(live)*: Exactly. And make it check its own work — have it write tests and run them against the sandbox before it touches anything real. *(beat)* Okay — run it.

*(They run it. Files build on screen — quick, steady. A row of sandbox tests goes green.)*

**BRENDAN** *(live, nodding at the green)*: There — its own tests pass. Now it wants to install to your Slack.

*(A dialog box on screen — `AIV-014`: the Slack app and Jira integration are built. "Install the Slack app to your workspace now?" — buttons: Approve / Deny.)*

> [!screen] VIDEO — KRISTINA · `AIV-010`
> …It's asking me. I just approve it?

**BRENDAN** *(live)*: Approve. It's your workspace.

*(She clicks. A green check.)*

**BRENDAN** *(live)*: There — it's live in your Slack now. Go on — close a real one.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> Right. Give me one of yours — what have you got open?

**BRENDAN** *(live)*: Oh — *(beat)* sorry, I haven't got any in there. I've been tracking my stuff in Linear.

> [!screen] VIDEO — KRISTINA · `AIV-010`
> …Linear.

**BRENDAN** *(live)*: It's another one of these — same idea, but the AI's built into it, it triages and links things up by itself. *(quickly)* I'll send you the board, it's all on there. And I can move it across to Jira if you'd rather, genuinely, it's no bother — I just found it fits how I work a bit better.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(waving it off, entirely warm)*
> God, no, don't do that. Work however makes you most productive — that's the whole point of any of this.

**BRENDAN** *(live)*: *(beat)* Are you sure that's alright? Because I'm still fairly new, and if there's a process thing I'm supposed to—

> [!screen] VIDEO — KRISTINA · `AIV-010`
> Brendan. Honestly. *(beat)* Send me the board and I'll pull it in — I'll figure it out my end. Do the work in whatever gets you moving fastest. *(warm)* That's what matters, and that's what gets you noticed.

**BRENDAN** *(live)*: *(beat)* …Okay. Thanks.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(typing into Slack, narrating)*
> I'll use one of mine, then. Okay… slash, jira, done, P-R-O-J four-twelve…

*(She hits enter. Instead of a confirmation, Slack throws back a red error — a permissions failure the sandbox never saw.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(a little vindicated)*
> Ha. Okay — so it doesn't just work.

**BRENDAN** *(live, completely unbothered, almost cheerful)*: Nope — and *that's* the part the demos skip. It passed its own tests, then hit something only your real workspace has. *(he copies the whole error, pastes it straight back in)* Half the time you don't even read it — you just hand it back its own mess and tell it to fix it.

*(On screen — `AIV-014` — the agent reads the error, adds the missing Slack permission, redeploys.)*

**BRENDAN** *(live)*: Okay — try it again.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(typing again)*
> …slash, jira, done, four-twelve.

*(She hits enter. This time Slack pings back: "PROJ-412 — Closed." Behind it, on the board, the card slides over to Done.)*

*(On screen — `AIV-014` — under the green confirmation, in small grey text neither of them reads: "…and 3 linked issues resolved." The board quietly shuffles three more cards to Done.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(a stunned beat, then genuinely — but measured)*
> …it actually closed it. From Slack. That's a real ticket. *(beat)* Okay. Yeah — I get why you like this.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(lightly challenging)*
> …Although — if it face-plants like that on something this basic, how much time is it really saving you?

**BRENDAN** *(live, easy, not defensive)*: …Think about it for a second. The whole thing — the plan, the build, the install, that error, the fix, the ticket — start to finish, that was maybe two minutes.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(a beat, then a small, conceding laugh)*
> …Yeah. Okay. That was a dumb question.

**BRENDAN** *(live)*: It's a fair question the first ten times.

*(She glances over at his shared screen — really looks at it for the first time: pinned tabs, a session transcript, a long personal doc.)*

> [!screen] VIDEO — KRISTINA · `AIV-010` *(reading it off his screen)*
> …wait. "Things it gets wrong." Is that — you keep a whole doc?

**BRENDAN** *(live, a little sheepish, brushing past it)*: Oh — that. Yeah, it's nothing, just stuff I've hit—

> [!screen] VIDEO — KRISTINA · `AIV-010` *(not letting it go — the realization is hers)*
> Brendan, that's not nothing. Rules files, a checklist, that whole doc… *(it lands)* Everyone talks about this like it's a magic button. It's not, is it. You've put a *stupid* amount of work into making it look this easy.

**BRENDAN** *(live, deflecting — genuinely, into the thing he loves)*: …I mean, it's the coolest thing I've ever gotten to do. I don't really think of it as work.

> [!screen] VIDEO — KRISTINA · `AIV-010` *(quiet — half to herself, the thought landing)*
> …It's obviously where all of this is going. *(a glance at LIAM's dark, empty tile)* And you got in early. That was smart of you.

**BRENDAN** *(live, not catching the weight of it)*: …Anyway — I've gotta run, got some actual work to do. Later?

*(Her tile blinks out, still glowing — the thought about Liam left unfinished, hanging in the quiet. BRENDAN sits a moment — and then a Slack huddle request lights his screen. From LIAM.)*

---

## Notes
- **This scene is the real engine — but it's not a commercial.** The tools Liam mocks win over the woman he humiliated, played for wonder *earned through friction*: the tool fumbles, is confidently wrong, passes its own tests and then breaks on the real workspace. What seduces her is **Brendan's depth** — but he never sells it; *she* uncovers it (the rules files, the "things it gets wrong" doc) and says it out loud, while he deflects into how cool it all is. That's the seed of the velocity-worship that later reframes Liam as "friction" (→ [[10 - The Win We Needed]], [[13 - The Performance Review]]). Mirror of the steam looms arriving in John's valley — marvelous, and not to be trusted blindly.
- **The error has to be earned.** Because Brendan has it write and pass its own sandbox tests, a build-time failure would just get auto-fixed and mean nothing. The failure that lands is the *live* one — she runs `/jira done` for real and hits a permissions error the sandbox never saw. Works-in-test-breaks-in-prod: real, and it makes the fix (paste the error back) legible.
- **Kristina is not naive.** She lives with these tools and knows the theory of vibe-coding; she just hasn't driven one herself. Keep her sharp — no "do I say please," no "I can't code," no "five-minute version." Her skepticism is pointed (the time-saving challenge), and she concedes fairly when Brendan answers it.
- **Liam was half-right.** The tool inventing an endpoint and hardcoding a token is the deliberate payoff of Liam's standup meme ("it confidently lies to you," [[01 - Cold Open — The Standup]]). Let the recognition land — *he wasn't wrong* — without making Kristina a skeptic. The friction is with the tool; it deepens her respect for the person who's learned to tame it.
> [!important] The Linear plant — the quietest kill in the play
> **She needs a live ticket to test the bot on, asks him for one, and he hasn't got any.** That is the whole plant, and it is load-bearing for the entire second half. Brendan tracks his own work in Linear because the AI is built into it and it suits him; he is apologetic about it, offers the board, and **offers twice to move everything back into Jira.** Kristina tells him not to, means it, and is right to: *"work however makes you most productive"* is good management, and *"I'll pull it in — I'll figure it out my end"* is a manager taking an admin burden off a junior engineer. **Nobody is careless and nobody is wrong.**
>
> It is also what fires him. In [[10 - The Win We Needed]] Kara picks the reduction metric — *"everyone's work is in Jira"* — and **no one corrects her, because no one in that room knows otherwise.** The sheet in [[14 - The Offboarding]] reads *Tickets closed (Jira): 9*. He is read the same page as Liam in [[14b - Three Weeks]], and learns why from Priya in [[19 - Nine Tickets]], eight days late.
>
> **He asks permission twice and gets it twice, and that is the point.** *"Are you sure that's alright? Because I'm still fairly new"* is a young engineer doing exactly the right thing — checking, deferring, offering to comply — and being waved off by someone with authority who is being generous. **Do not let him seem lazy, do not let him seem cocky, and do not let Kristina seem dismissive.** She is doing him a kindness. The kindness is the mechanism.
>
> **"That's what gets you noticed."** The one line in the beat that is allowed to be pointed, and it must still be thrown away — warm, offhand, a manager encouraging someone she rates. It is the play's thesis said by accident to the person it is about to be false of, in the same register as *"don't go quiet"* in [[19 - Nine Tickets]]. **One flag only** — an earlier draft also had her say "nobody's counting tickets," which is a second flag in the same speech and was cut. Do not put it back.
>
> **Play the rest as nothing.** No pause, no emphasis, no light change, and **nobody mentions tracking, tickets or velocity again in Movement I.** The audience should not be able to point at this afterwards and say they were told. **Kristina never follows up on the board** — she means to pull it in and never does, and the play never says so; Liam's *"did she?"* in [[19 - Nine Tickets]] is the only time anyone asks, and nobody ever finds out. Logged in [[Themes & Motifs]].
>
> **Continuity — this is the canonical version.** Brendan's Linear use is **personal, not a team migration.** [[Brendan]] and [[Rework — Brendan Goes Dark]] §B both always described it that way ("his work lived in Linear"); Scene 19's old *"I moved the whole team onto Linear"* was the outlier and never squared with Marcus filing Jira tickets on the same team. **That line is now rewritten to match this scene.**

- **The unowned mistake:** the bot silently resolves three linked issues nobody asked it to. Neither of them reads it. Plants the blast-radius / tech-debt cost live, without a speech — the explicit caution stays in [[01d - The Future]].
- **HR beat / nobody owns the harm:** Kristina nearly reports the degree line and is talked down ("you learn to work around him"). The harm goes unrepaired — the same diffusion of responsibility that later makes the layoff nobody's fault.
- **Muted, not gushing.** No "most incredible thing I've ever seen," no "faster than ChatGPT," no eruption of code. Cut the superlatives; keep the brands (Cursor, Claude, Slack, Jira, Vault). The dread comes from how reasonable every small step feels — and from the career-bet subtext left unspoken: she never finishes the thought about Liam being on the wrong side of this.
- **Hand-off:** ends on Liam's huddle request landing on Brendan — straight into [[01c - The PR Review]].
