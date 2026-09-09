---
type: scene
scene_number: 11b
title: Best Practices
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B5 — Adopt the machine (the reorg)]]"
status: drafted
live_cast: Liam, Brendan
ai_video_assets: "[[AI Video Production Tracker|AIV-050 Kristina — Standup (agent-first)]], [[AI Video Production Tracker|AIV-011 Standup grid — ambient]], [[AI Video Production Tracker|AIV-055 Marcus — Standup]], [[AI Video Production Tracker|AIV-053 Liam's screen — the rig]], [[AI Video Production Tracker|AIV-054 Brendan's screen — the plain session]]"
tags:
  - scene
  - liam-arc
---

# Scene 11b — Best Practices

> [!info] Beat
> Dramatizes **[[Beat Sheet — Parallel Intercut#B5 — Adopt the machine (the reorg)|B5 — Adopt the machine]]** at the personal level, and **seeds B6/B7**. The all-hands has made the team agent-first; here we finally see Liam *himself* using the tool, and doing it the way only Liam would: locally, on a machine he expensed under one word ("AI"), re-reviewed to death. Every mistake grows from an instinct that's genuinely right. He ends slower than everyone and reads that as proof he's the last serious person in the building. The raw material for "friction" (B7) is made here, and so is the first witness: a standup where two engineers burn ten minutes on who the machine's speed is actually for, then on poisoned weights, then on a Yorkshire blacksmith, while the board sits unmoved. Mirror twin: John's **B5→B6**, with the **deliberate asymmetry** noted below.

## Purpose
Show Liam trying to get on board and turning every good instinct into a liability. He is correct that you don't pipe a proprietary codebase into a third party. He is correct that the mandate and the security policy contradict each other, and that his local rig is the only setup that satisfies both. His best moment is a genuine score off Marcus: concede the backdoor premise entirely, then point out that a backdoored model with no network and no tools can't do anything about it — while Claude Code runs commands, installs whatever it decides it needs, and browses the web on every laptop in the building. He may even be correct about copyright. None of it matters, because the room stopped listening two exchanges in, and Marcus fires back just as well (a backdoor can be one character long). **Marcus** is the other half of the scene and the other half of the play's argument. He does not open on security. He opens on the gain: three shipped tickets bought him three more, the week the tool saved got filled back up by Tuesday, and nobody will say out loud who the speed is actually for. **Liam refuses the frame in one sentence** (*"I'm not a politician, I'm an engineer, and I have a threat model"*) and that refusal is the whole scene. Marcus, who cannot get heard in his own language, changes into Liam's and fights the rest of it on backdoors and weights, where Liam is better than him. He loses. Then, after one line of genuine agreement about Grok, he asks for thirty seconds and finally says the thing he came to say: **Enoch Taylor made the frames and made the hammers, and we are the blacksmith.** It is the truest thing anybody says all morning, a tile marks a ticket Done while he says it, and Liam answers it with a line count. Kristina tries to break it up early and often, gets spoken over every time, and handles it the way PMs learn to — but she hates it, and the house sees her literally bite her tongue: she takes the minutes every week, and emails them out every week, while Liam announces that nobody takes minutes. Brendan watches and quietly clocks two things. First, the practical one: Liam is *technically right*, the policy is one obviously-outdated paragraph, and nobody, including Brendan, will spend the capital to change it. Second, the deeper one, which stays in stage directions: the security case is the *stated* reason. What Liam has actually built is a machine that can't threaten him — no tool calls, no agency, stubs only, every line finished by Liam. He calls it fancy autocomplete, uses it like fancy autocomplete, and gets autocomplete out of it, which proves him right every single day. Plant the "won't get on board / bottleneck" evidence that the org itemises, un-funny, in the review (B7).

## Setting / Staging
The same desk, a few weeks on from the reorg. The agent-first mandate is now just how the team works. **Liam** (live, Speaker A) is at the dual-monitor desk; the standup grid runs on the second monitor, his tile the same camera-off black square, "Liam." New on the desk since last scene: a small silver cube of a computer, expensive, still with the film on one corner. The big monitor is his **rig**: a terminal where an 80-billion-parameter local model crawls out tokens, and a git diff thick with his own hand rewrites. After the standup, a Slack huddle with **Brendan** — live (Speaker B) at his own desk: Liam shares his screen, and, angled to the house where the call can't see it, **Brendan's own laptop**, where the plain hosted tool does the same job in seconds. Same spatial rule as Scene 06: two screens, one truth on each, only the house sees both. **The three deletions are now played by a live body** — the audience watches a man hold backspace, twice, while the other man talks, and hold delete on the finished patch at the end. That is the scene's engine and it is worth the whole staging change on its own. The two live men are on a call, never in a room — no contact. The machine (his local rig, Brendan's session) is on-screen UI only, no voice, written as stage direction. Cool monitor-blue; John's loom half of the stage stays dark. Mid-Movement III; no loom-knock hand-off, it closes on its own image.

## Live Cast

- **BRENDAN** — live, Speaker B (standup): visibly worn down by the argument but professional about it; after Kristina closes, offers to hop on about "the actual webhook thing."
- **BRENDAN** — live, Speaker B (huddle): honestly impressed by the machine before he clocks what it costs; asks the two questions that matter (tokens per second, time to first token) and lets the answers speak; never gloats when his own screen wins; lets it go at the end with the Scene 06 flicker, older now. Cut to leave gaps for Liam's live lines.

> [!note] Live/video plane
> Brendan plays these scenes **live at his own desk**, diegetically on the call — he and Liam are remote colleagues, so they share no props and never touch. Everyone else stays on the video plane.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-050]] — Kristina (PM):** runs the agent-first standup; tries to break up the Liam–Marcus fight early ("this feels like a thread—") and repeatedly, and gets flattened every time; hates being spoken over and shows it to nobody — the tongue-bite beat carries it (she takes the minutes every week; Liam just said nobody does; and the man talking over her is the man who defended her the last time this happened). Gets one flat, unbright line — "I know you did, Marcus. Thread." — and then puts the brightness straight back on. Finally parks the debate and still lands the gentle, load-bearing note: "I just need you on board." Same locked look/voice as `AIV-010`.
- **[[AI Video Production Tracker|AIV-011]] — Standup grid (ambient loop, reused from Scene 1):** the coworker tiles, closing tickets and half-listening; during the argument a couple of tiles go very still, the stillness of people muting themselves to sigh.
- **[[AI Video Production Tracker|AIV-055]] — Marcus (standup):** the second lead, as stubborn as Liam and pointed the other way. **Opens political and abstract** — alienation, workers disconnected from what they make — then lands it: three tickets bought him three more, the saved week got filled back up by Tuesday, who is the speed actually for. Is refused the frame, and audibly **changes into Liam's language** to get heard at all. Everything he says from there attacks one sentence of Liam's, *"I read every line"*: he admits he doesn't read his own, argues nobody can audit the weights, lands the one-character backdoor, gets moved off it, and escalates to **who is the author at all**. Loses both, wants it "noted that I flagged it," tells Kristina he knows what a standup is, talks over her twice. Then, after one line of peace about Grok, asks for thirty seconds and gets out **"we're the blacksmith"** — a tile marks a ticket Done while he says it. Sincere, badly timed, never quite rude enough to sanction, and never scoring a point on purpose.
- **[[AI Video Production Tracker|AIV-053]] — Liam's screen (screen graphic, no voice — the rig):** a terminal where the local model emits tokens at a visible crawl; a context-loading progress bar that takes minutes; the autocomplete workflow — he asks for a stub, gets a stub (with a call to a helper that doesn't exist), deletes the imaginary part and hand-fills the body — and a git diff thickening with his own rewrites. No agent panel, no tool calls, no network icon. Screen only, written as stage direction.
- **[[AI Video Production Tracker|AIV-054]] — Brendan's screen (on-screen UI, no voice — audience only):** the cloud agent — the kind with tool calls — given one plain sentence, opens the handler itself, writes the diff itself, runs the test itself: green in seconds. Then the security-policy page (owner: Liam, last reviewed 14 months ago); then two half-typed messages to Kristina, each deleted with held backspace — the policy question, then "I don't know if liam is ever going to—"; at the end, the finished patch deleted the same way. The contrast and the choices Liam never sees. Mirror of `AIV-044`.

---

## Script

*(Liam's desk, a few months later. The memes are gone. New on the desk: a small silver cube of a computer, the protective film still on one corner. On the big monitor a terminal crawls a few tokens… at… a… time, next to a git diff thick with strike-throughs where he's rewritten the machine by hand. On the second monitor the standup grid runs, tiles quietly closing tickets. His camera is on this time.)*

> [!screen] VIDEO — KRISTINA (PM) · `AIV-050` *(brisk, warm, moving down a fast board)*
> …great, ship it. Okay, Liam. The billing-webhook retry ticket. That's been with you since Monday? Just checking it's not stuck.

**LIAM** *(live, even, a man doing it right)*: It's not stuck. I'm reviewing what the model wrote, line by line.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(gentle)*
> Okay. It's just that Marcus had three tickets related to webhooks completed yesterday... Would it be helpful for you to pair with Marcus on this one?

**LIAM** *(live)*: Marcus pastes our source into a stranger's computer and hits accept. I run mine locally AND I read what comes back. *(beat)* Which is what our own security policy requires, in case you all forgot to read it... So because they made these tools mandatory at the All Hands, local inference is the only setup that satisfies both policies... So I'm the only person on this call who's actually following the rules.

> [!screen] VIDEO — MARCUS · `AIV-055` *(a tile unmutes; he heard his name)*
> I'm just doing what the CEO wants Liam. Don't you remember his memo? And rather than dragging my feet by using some crappy open source model, I got my work done. No wonder you think this technology sucks. You really are like the Luddites. They also complained about losing their craft, even though the power loom was the way of the future. You should try reading about it sometime.

**LIAM** *(Sarcastically)*: …Okay Marcus.

> [!screen] VIDEO — MARCUS · `AIV-055`
> And since we're pointing fingers. Do you know what those three tickets got me, Liam?

**LIAM** *(live)*: What?

> [!screen] VIDEO — MARCUS · `AIV-055`
> Three more tickets. Because we have an endless supply of work. I feel like I'm the only one who understands what we're actually hired to do. They want us to use the fast model so we can produce more and more and more and never satisfy them.

**LIAM** *(live, honestly puzzled anyone is saying this out loud)*: What do you want, a slower model so you can work slower?

> [!screen] VIDEO — MARCUS · `AIV-055`
> I want one person at this company to say out loud who the speed is actually for. *(beat)* Because it isn't me.

**LIAM** *(live)*: I don't have a view on that. I'm not a politician, I'm an engineer, and I have a threat model. You're pasting our source into somebody else's datacentre because it's quick. That's my objection. It's got nothing to do with how rich it makes the CEO.

*(A pause with a decision in it. He came here to talk about who the work is for. Nobody is going to have that conversation, so he starts one they will.)*

> [!screen] VIDEO — MARCUS · `AIV-055`
> So you're going to waste time upsetting your boss and everyone else. You keep saying you read every line.

**LIAM** *(live)*: Because I do.

> [!screen] VIDEO — MARCUS · `AIV-055`
> Well, I don't. *(beat)* I merged 3 PRs yesterday, and honestly, I think the AI does a better job at the review than I do. *(beat)* That's what the job is now. Hitting approve. Faster.

**LIAM** *(live)*: Right. Maybe AI does do a better job than YOU, and that's the difference between US.

> [!screen] VIDEO — MARCUS · `AIV-055`
> Yeah, but you're not using the same technology as the rest of us. Instead, you're using some crappy CHINESE model on some overpriced machine that isn't even half as good and is probably backdooring our codebase...

**LIAM** *(live)*: Which is why I read every line before it merges.

> [!screen] VIDEO — MARCUS · `AIV-055`
> A backdoor can be one character long. One equals sign where there should be two. *(beat)* You'd read straight past it. That's the whole reason it works.

*(That one lands. Nobody says so.)*

**LIAM** *(live)*: I've caught plenty of bugs by reading code this year.

> [!screen] VIDEO — MARCUS · `AIV-055`
> Yeah, bugs, but not a CHINESE backdoor designed to be hard to detect.

*(And LIAM does not have the answer to that one, so he answers a different question, quickly, and well.)*

**LIAM** *(live, conceding the premise like it costs him nothing)*: Fine. Say the weights are poisoned. Say it's in there. What is it going to *do?* The box has no network. The model has no tools. It can't run a command, it can't open a socket, it can't touch a file I don't hand it. It types text into a window and I read the text.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(trying, early)*
> Guys, can we get back on...

**LIAM** *(live, not hearing her — the jab he's been saving)*: You'd have to be an idiot to worry about poisoned weights and then hand the thing a shell and the internet. Which is what Claude does. It runs commands, it installs whatever it decides it needs, it browses the web, on every laptop in this building. *(beat)* Including yours.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(trying again)*
> Guys, I want to get through the...

> [!screen] VIDEO — MARCUS · `AIV-055` *(over her)*
> Sorry, Kristina, one more flag, because this actually matters. If anything off that Chinese model Liam is using lands in the product, and it comes out later the weights were compromised, that's on everyone on this call. I want it noted that I flagged it.

**LIAM** *(live)*: Noted where, Marcus? Nobody's taking minutes. It's a standup.

**NARRATOR** *(V.O.)*: Kristina takes the minutes every day during standup. She emails them out as part of a nicely styled report to the whole team every week.

> [!screen] VIDEO — KRISTINA · `AIV-050` *(a full sentence, at last; the patience is professional-grade)*
> Liam, Marcus, take the model debate to a thread. I'd honestly love a doc, it sounds like there's real stuff in there. Just not in our standup

> [!screen] VIDEO — MARCUS · `AIV-055` *(frustrated)*
> I know what a standup is. I'm saying this matters more than the standup does.

> [!screen] VIDEO — KRISTINA · `AIV-050`
> Noted. Thanks. Let's move on.

> [!screen] VIDEO — MARCUS · `AIV-055` *(over her, and hurt about it)*
> With respect, I'm the one who said something when he made fun of your education...

> [!screen] VIDEO — KRISTINA · `AIV-050` *(flat; the only moment all morning the brightness isn't there)*
> Marcus *(beat)* I just want ONE STANDUP where we get through without...

**LIAM** *(live, and it is almost generous)*: At least we can all agree not to use Grok.

> [!screen] VIDEO — MARCUS · `AIV-055`
> Oh, don't get me started -

> [!screen] VIDEO — KRISTINA · `AIV-050` *(calling it, warm and immovable)*
> Okay. Agreement! Finally... Any other blockers?

**BRENDAN** *(live, tired around the eyes, still warm)*: Liam, want me to hop on for twenty about the actual webhook thing? *(beat)* Just the webhook thing.

**LIAM** *(live, a beat — then, almost warm)*: …Yeah. Alright. Come see the setup, actually. You'll like it.

*(The grid blinks out. [MUSIC: music/slackhuddle.mp3] A Slack huddle opens.)*

**LIAM** *(live, showing off the good version of himself — the craftsman; he pats the silver cube once, like a fender)*: Okay. So. Mac Studio, a 64 gigs of unified memory. The 27b Qwen just fits, quantized. Cost this company half the price of a used car which is the AI-adoption price the CEO's memo didn't mention.

**BRENDAN** *(live, genuinely taken with it, for a second)*: And they approved that?

**LIAM** *(live, a dry little shrug)*: I wrote "AI" on the expense report. Approved within the hour, no questions. *(beat)* Which is silly. But it's the policy, and I'm inside it.

**BRENDAN** *(live, honest, then careful)*: It's a beautiful machine, honestly. *(beat)* What's it giving you in tokens a second?

**LIAM** *(live, unbothered)*: Two to five.

**BRENDAN** *(live)*: And time to first token? With the codebase in context.

*(A pause with a shape to it.)*

**LIAM** *(live)*: It varies.

**BRENDAN** *(live)*: Liam.

**LIAM** *(live)*: Six minutes. Sometimes eight. It's reading four hundred files, it's allowed to take longer than a search box. I batch my questions. You learn to think before you prompt, which would do some people on that call a world of good.

**BRENDAN** *(live, no fight in it, just arithmetic)*: Sure. It's just... six minutes in, five tokens a second out. On the webhook ticket. How much of your day is watching it type?

**LIAM** *(live, and the honesty is the problem)*: Less than you'd think. *(beat)* Some.

**BRENDAN** *(live)*: How many do you run at once? Agents.

**LIAM** *(live — the question doesn't parse)*: …One. It's one model. What would I want two for?

**BRENDAN** *(live)*: They can talk to each other. If you let them.

**LIAM** *(live, flat)*: Talk to each other.

**BRENDAN** *(live)*: Share notes. Split the work up between them.

**LIAM** *(live)*: No.

*(BRENDAN leaves it there. He ran five of them this morning, in parallel, before this call. He looks at Liam's one terminal, the cursor blinking, patient. He decides to sit on it. There is too much in there to unpack.)*

*(On BRENDAN's own screen he quietly types one line: "In billing/webhooks.rb, make failed deliveries retry with exponential backoff, cap at 5." The cloud agent opens the handler itself, writes the diff itself, runs the test itself. Green. Done before Liam finishes his sentence. He says nothing.)*

**LIAM** *(live, warming up — this is the part he likes)*: Watch the workflow, though. This is the part everyone skips. *(he types: "Stub a retry wrapper for the webhook delivery call. Signature and skeleton only." The model thinks. Thinks. A method assembles itself one token at a time — a clean stub, and inside it, a call to a helper that does not exist anywhere in the repo.)* There. It invented a method that doesn't exist. *(no anger — he deletes the imaginary helper and starts filling in the body himself, comfortable, quick, home)* And that's fine. Because I don't ask it to be right, I ask it to type the boring part. Then I do the job. It's autocomplete, Brendan. Fancy autocomplete. That's all any of this is under the hood.

**BRENDAN** *(live, careful)*: You could let it do more than stub, though. Let it run its own code install the dependencies, run the tests, see what fails.... *(he stops)*

**LIAM** *(live)*: No. Were you not listening at standup? You've seen the stories, rogue agents deleting production databases because somebody let them run whatever they wanted. I don't give it tool calls. It writes text. I decide what the text is worth running.

**BRENDAN** *(live, one more try, gentle)*: The hosted ones sandbox all of that now. The agent can only touch its own branch, it can't...

**LIAM** *(live, batting it away — reasonable, certain)*: On somebody else's computer, through a black box that changes under me on a Tuesday. No. Local, I pin the weights. What I ran in January is what I run in March. That's not paranoia, that's responsible engineering.

**BRENDAN** *(live, half to himself)*: I used to keep a doc. Things it gets wrong. *(beat)* I stopped. It stopped getting them wrong.

*(On BRENDAN's laptop a new tab: the security policy. "Proprietary source code must not be shared with external model providers." Owner: Liam. Last reviewed: fourteen months ago. He opens a message to Kristina and types: "re: standup, the policy thing. it's one paragraph and it's obviously outdated. do you want me to propose we chang..." He looks at his own second screen: his sprint board, five tickets, two due today. He holds backspace until the message is gone. He starts again: "I don't know if liam is ever going to..." He stops. He holds backspace until that one is gone too.)*

**LIAM** *(live, and here's the fact he's armed with)*: And before you say it, everyone keeps saying ten-x. I measured it. Two sprints, same kind of tickets, with the setup and without. I'm slower with it. Measurably. So either everyone else is not following the policy, or I'm the only one who checked how long feature delivery takes with the tooling the CEO is pushing.

*(A silence. BRENDAN doesn't win this. He can't, Liam isn't wrong that he's slower. Six-minute load bar, the five tokens a second, the struck-out diff, the beautiful expensive box doing beautifully expensive almost-nothing.)*

**BRENDAN** *(live, a beat too long — then he lets it go, older than he was in Scene 06)*: …Yeah. No, I hear you. *(beat)* I should get back to it. Ping me if you need anything?

**LIAM** *(live, softening — he thinks he's been heard)*: Will do. Thanks, Brendan. *(a real, small warmth)* Good, you get it. Nobody else even looks at the code anymore.

*(BRENDAN drops the huddle. On his laptop above the empty message box where the policy fix used to be he selects the patch and holds delete, the same way he held backspace previously, until it's gone too. LIAM turns back to his rig, satisfied. The model puts out the next token. Then, in its own time, the one after. He watches his machine type, patient, certain, sinking.)*

*(Liam's machine is grinding and honest and slow; Brandon's is finished twice over and sitting idol)*

---

## Notes
- **Tone: half-right, curdling.** The Scene 06 rule carried forward — *do not strawman him.* Every position Liam takes is defensible: don't leak proprietary code (his own policy), the mandate and the policy really do contradict each other, and the copyright question is real enough that lawyers bill hours on it. He takes each true thing one notch past useful, in public, at length. Play it straight; let the house do the wincing.
- **Movement 2 opens on the author's alienation speech.** The *"yeah, I do, every day, and I'm faster than I've ever been"* concession described below is **not currently in the scene** — it was proposed and the author replaced it with the Marx/alienation opener. Keep this note as the argument for the concession, not as a description of the page. Liam accuses him of pasting the company's source into a stranger's computer and hitting accept, and Marcus **agrees with him** — *"Yeah. I do. Every day, and I'm quicker than I've ever been at anything in my life, and I'd rather you didn't say it like that but you're not wrong."* He is the heaviest user in the building, he knows it, it unsettles him, and he makes the point anyway. **Liam has no answer to it and moves on**, which is the only time all morning either of them is genuinely wrong-footed. Play it flat and unhurried, with no self-pity and no apology in it — a man stating a fact about himself that he has clearly turned over before. **It is also what makes the language-switch four exchanges later land: he cannot win in his own dialect partly because his own dialect indicts him.**
- **The fight is two arguments, and the switch between them is the scene.** Marcus starts on the gain and Liam refuses to have that conversation at all: *"I'm not a politician, I'm an engineer, and I have a threat model."* Liam believes that about himself completely, which is why the back half is going to surprise him so badly. Marcus, unable to be heard in his own language, changes into Liam's and spends the rest of the standup losing an argument in borrowed words. Play the switch so the house hears it, because it is the most sympathetic thing he does in the play and it is also the moment he gives up the only point that was true.
- **Enoch Taylor is the beat the whole Marcus thread is built toward, and it has to be clean.** It is accurate: Taylor made the shearing frames and he made the hammers, and *"Enoch made them, Enoch shall break them"* is what the croppers said about it. Marcus tells it plainly, in about twenty seconds, with no dates and no statutes, and then puts it directly on the room: we are the blacksmith, we are the ones improving it every day, and we have been told in writing to do it. **The audience is not being taught history here so much as handed the shape of the play.** Everything Marcus says in Movements III to V is downstream of this one image.
- **Liam is not a Luddite expert and must never sound like one.** He knows they lost ([[06 - Good Instinct]]) and that is the whole of his knowledge. He does not correct Marcus on history because he cannot, and he would not care to. His weapon is relevance: *"Is there a point coming?"* and *"Marcus, it's a retry loop. It's four lines."* **The old *"if I had a nickel for every time you said the word Luddite"* is cut** — with the ramp in place he has barely said it, so the joke asserted a running bit the play no longer has, and the line-count answer is the better undercut anyway. **If any draft gives him a date, a statute or a source, cut it.**
- **Marcus is right and unbearable in the same breath, every time.** The three-tickets arithmetic is correct and it is also him mentioning how much he shipped. The Enoch point is the truest thing anybody says all morning and he says it after being told to stop three times, on a call, over his manager. **Never let him be pitiable and never let him be smug**, and **never let him score a point on purpose** — if a line reads as him enjoying a win, it is the retired register ([[Modern World — Supporting]]). He is sincere and slightly desperate, which is worse than either.
- **Screenshot test.** Per [[Modern World — Supporting]], if a Marcus speech would survive being posted as a screenshot, cut it. The Enoch beat is the closest the play comes to breaking that rule, so it is undercut twice within four seconds: a tile marks a ticket Done, and Liam answers it with the line count on a webhook ticket. **Do not remove either undercut**, and do not let Kristina or Brendan react to it.
> [!important] Structure — the scene is ONE argument in two languages, not nine topics
> An earlier draft ran nine separate subjects through one standup (alienation, the treadmill, Chinese weights, the record, standup priority, procurement, Grok, the blacksmith, copyright), with the security argument broken into three non-adjacent chunks and Liam making his compliance point twice. It read as a man jumping around rather than a man losing. **The rebuild is a single escalating causal chain and every beat now causes the next one:**
>
> | # | Movement | What it does |
> |---|---|---|
> | 1 | **The needle** | Kristina compares Liam's one ticket to Marcus's three. Liam attacks Marcus's method **and makes his entire compliance case here, once.** |
> | 2 | **Marcus in his own language** | He concedes he's the fastest, then makes the only political point he owns: three tickets bought three more, the saved week refilled by Tuesday, *who is the speed for.* |
> | 3 | **The refusal — the hinge** | *"I'm not a politician, I'm an engineer, and I have a threat model."* **The whole scene pivots here.** |
> | 4 | **Marcus in Liam's language, twice, losing both** | Weights → air-gap → attack surface → one-character backdoor → copyright → *"It's a monkey, Marcus."* **Uninterrupted by topic**; Kristina's two failed attempts sit inside it as pressure. |
> | 5 | **The record, and the room** | *"I want it noted"* is what a man says when he has just lost in a language he doesn't own. → *"Noted where?"* → tongue-bite → her full sentence → *"I know what a standup is"* → the education callback → *"I know you did, Marcus. Thread."* |
> | 6 | **One second of peace** | Grok. |
> | 7 | **The thing he came to say** | Enoch → *"we're the blacksmith"* → the Done tile and the line count. |
> | 8 | **Close** | *"I just need you on board"* → Brendan → the huddle. |
>
> **The test for any future addition: name which movement it belongs to.** If it doesn't belong to one, it is a tenth topic and it goes in the thread with everything else.
>
> **Every technical beat in movement 4 attacks one sentence: *"I read every line."*** That is Liam's claim, his identity, his compliance case, the reason he is slow, and the reason he is fired. The security material and the copyright material are not two topics; they are two attacks on the same claim, and the order is a real argument rather than a list:
>
> 1. Marcus names the claim, and confesses he does not do it himself. **The confession is the accusation** (it pays off *"I couldn't tell you what's in any of them"* from [[06 - Good Instinct]]).
> 2. *"Nobody can audit twenty-seven billion numbers, so all you've got is the output."*
> 3. **The hit:** a backdoor is one character; reading is not the protection Liam thinks it is.
> 4. Liam's non-answer (*"I've caught three in human code"*), and Marcus presses: *"you caught it because there was somebody in there to catch."*
> 5. **Liam cannot answer that, so he answers a different question** — capability, not authorship — and wins on that ground. The air-gap rebuttal and the Claude Code jab are genuinely correct and are also a change of subject. **Neither man notices.**
> 6. Marcus escalates to the question underneath: *"You didn't write it. I didn't write it. Who did?"* Copyright is the legal form of that question, not a new topic.
> 7. Liam swats it with the monkey.
>
> **This is why the blacksmith lands in movement 7.** The scene has spent ten minutes on who reads the work, who wrote it, and who owns it; *"we're the blacksmith"* is the answer to all three. **Alienation — the author's own opener — is the thesis the whole argument is a proof of:** you don't read what you make, you didn't write it, you don't own it, and it replaces you.

> **This restructure moved beats; it did not rewrite the author's lines.** The alienation opener, the bare *"we're the blacksmith"* with no Enoch setup, *"I know Kristina, but this is important"* and *"I just want ONE STANDUP"* are all as written and were reordered, not replaced.

- **What was cut, and why.** **The whole Qwen/Alibaba/"one of the Chinese ones" exchange is gone.** It was the most arbitrary material in the scene: it made the argument turn on the model's nationality rather than on anything either man actually believes, it needed its own setup, and the one-character-backdoor point — which is the good part — does not require it. **Nobody names a model in this scene now.** Also cut: the procurement exchange (it resumed a topic that had already ended) and Liam's second compliance monologue (he now says all of it in movement 1). **The Marx/alienation opener and the bare *"we're the blacksmith"* are the author's and stay** — see the open questions below. **Moved:** the copyright/monkey exchange, which used to land *after* Kristina called the meeting, and is now the second of Marcus's two borrowed-language arguments — which is a better home, because losing twice in Liam's dialect is stronger than losing once.

> [!question] Three things the restructure surfaces but does not decide
> **1. *"We're the blacksmith. All of us"* currently has no antecedent.** Enoch was cut, so the image arrives cold — the audience is told they are a blacksmith they have never heard of. It plays either as a deliberate non-sequitur the room ignores (which is defensible, and Liam's *"is there a point coming?"* half-supports it) or as a missing setup. **Author's call; nothing here assumes an answer.**
> **2. The alienation opener names Marx, which is the one register question in the scene.** *"You should maybe read up on it rather than another book on esoteric race conditions"* is Marcus telling Liam what to read — closer to the point-scoring register than anything else he says in the play. **If it stays, it is the one place he does that, and that can be exactly the point.**
> **3. Kristina's *"I just want ONE STANDUP"* is her cracking**, where the notes below describe a smaller, colder *"I know you did, Marcus. Thread."* Both are defensible; they are different characters. The crack is bigger and makes the tongue-bite direction pay off louder.

- **The interruptions escalate and then they stop, and that ordering is load-bearing.** She tries twice and is flattened, gets one full sentence, gives him "Noted. Thread," gives him his name on its own, and then calls it. **Nothing long happens after "I'm calling it."** Marcus's copyright grab is a single hand-up and Liam's monkey reply is four words. If a future draft wants to add Marcus material to this scene it goes *before* she calls it, not after, or the scene stops making sense as a meeting.
- **"I'm the one who said something when he did the degree thing to you."** The character in one line: a true claim, over the top of the person it was supposedly for. **He is not claiming credit — he thinks he has earned standing and is asking to use it**, and he has no idea how it sounds. That reading is warmer and lands worse, which is the point. Kristina's *"I know you did, Marcus. Thread."* is the only unbright line she has all morning, two seconds long, and then the brightness is back and stays back. **Don't play her as hurt and don't let the audience be told she is.** The tongue-bite direction names it to the reader, not to the room.
- **The technical argument stays competent on both sides, and it is no longer arbitrary.** Liam's air-gap point is real and Marcus's one-character-backdoor point is real. It is still bikeshedding as far as the *room* is concerned — none of it gets a retry loop out the door and neither Kristina nor the CEO could care less — **but it is no longer trivia to the audience**, because every beat of it is about whether anybody is still the author of this company's product, which is the thing the play is about. Nobody wins and nobody gets sanctioned. It isn't misconduct, it's friction, and friction is what gets itemised later (B7). The flash of peace over Grok is the funniest and saddest beat in the fight, so play it dry, and note that it lasts one line before he starts on Enoch.
> [!warning] These notes are behind the script (checked 2026-09-09)
> The alienation opener, the copyright and monkey exchange, Enoch Taylor and "we're the blacksmith" are referenced in the Purpose, the `AIV-055` cue and the question callout above, and none of them is in the Script section any more. The script is the source of truth. The "What would I want two for?" refusal was extended by four lines on the same date: Brendan says the agents can talk to each other and split the work, Liam says no. It is the plant for the swarm in [[20 - The Audit]] and Liam gets no foresight from it, only a refusal.

- **If it has to come down,** cut the Grok exchange first. **The three-tickets arithmetic, "I have a threat model," the one-character backdoor, "That's what the job is now," the measurement, and the four-line "What would I want two for?" refusal are the scene** and none of them can go. **Do not cut the backdoor beat**: it is the only hit Marcus lands all morning, and without it the switch into Liam's language costs him nothing.
- **Kristina gets spoken over and absorbs it.** She's used to it; her patience is a skill, not a weakness. She parks the fight twice, promises to chase the policy question, and still lands "I just need you on board" — the line the review will quote back. Don't play her as flustered. Play her as a professional filing this standup away.
- **The 1:1 is throughput and quality, nothing else.** No orchestration talk. Three numbers carry the scene: six minutes to first token, two-to-five tokens a second, one agent. Brendan asks, Liam answers honestly, and the honesty convicts him. The "how many do you run at once?" beat is the widest gulf in the play so far: Brendan ran five in parallel before the call, Liam can't parse why anyone would want two — and Brendan *sits on it*, because there's too much in there to unpack. The hallucinated helper is the quality beat: a quantized 80B open model on a Mac is still not the frontier model, and the gap shows up as a method that doesn't exist. Liam reads it as confirmation of the workflow; the house reads it as the machine he chose. The expense beat matters too: he wrote "AI" on the report and it sailed through in an hour — he's genuinely inside policy, and finds the ease of it silly, and takes the money anyway.
- **The self-fulfilling prophecy.** Liam believes it's fancy autocomplete, so he uses it as autocomplete: stubs only, no tool calls, no tests, one model, one window. Used that way, it *performs* like autocomplete, which proves him right, every day, forever. Play his hand-editing as pleasure, not chore — filling in the body is the part of the job that's still his, and he's fast at it, and that comfort is exactly what's being priced against him. Brendan names the door once ("let it run its own code — install the dependencies, run the tests") and Liam shuts it with the standup still in his mouth: rogue agents, deleted databases, "I don't give it tool calls."
- **Focalization: the fear wears a badge.** Externally, every hesitation is security and policy — the backdoor concession, the no-network/no-tool-calls rebuttal, the compliance monologue, and it's *good* security thinking; his standup jab genuinely lands (Claude Code really does run commands and hit the network on every laptop in the building; from a pure threat-model view that's an exfiltration path everyone loves). Internally it's about control: a model with tool calls is a model that does the job, and the job is what he spent a career becoming. This is never said aloud by anyone. It lives in stage directions (what his hands do, what he asks the machine for, what he won't let it touch) and in the gap between his stated reasons and the shape of his rig. Don't let an actor or a cue wink at it.
- **He's telling the truth about the number.** The METR beat only works if we believe him: he really is slower, and he really did measure it. Don't undercut it with a smirk. A true measurement pointing at the wrong cause is the trap closing.
- **Brendan's silence gets a second storey — and a rhyme.** Scene 06: he doesn't show Liam the finished fix. Scene 07: he deletes Claude's branch. Here he deletes three times: the policy message to Kristina ("it's obviously outdated. do you want me to propose we chang—", held backspace); the message underneath it, the one that was never about policy ("I don't know if liam is ever going to—"), gone the same way; and, at the end, the finished patch itself, held delete, the same gesture. The second message is the tell — he can't finish the sentence even to himself. He knows Liam is technically right; he knows fixing the policy means a thread, a meeting, a fight with Marcus, and none of it is his job; he has five tickets and two are due today. The deletions are his B6 step — complicity by inertia, shown on his screen, never spoken.
- **Curdle Ledger (logged in [[Themes & Motifs]]):** "I just need you on board" (Kristina), "I'm the only person on this call who's compliant" and "I'm slower and I measured it" (Liam), "I want it noted that I flagged it" (Marcus) → pay off in the review as "won't get on board," "bottleneck," "friction" (B7, [[13 - The Performance Review]]) and in the offboarding framing (B8). The "Marcus PR" Liam cites in the review now has a face and a grudge. **New rows from this pass:** *"I'm not a politician, I'm an engineer"* (Liam) pays off in a back half decided entirely in rooms he considers noise; *"who the speed is for"* (Marcus) is answered on the reduction sheet in [[14 - The Offboarding]], by a department that never heard the question; and **Enoch made them, Enoch shall break them** pays off twice, first when Liam hands Brendan the rig in [[19 - Nine Tickets]] and then all night in [[20 - The Audit]]. **And the ugly one:** the man who talks over Kristina twice here is the man who writes the true thing about Liam into a form in [[12 - Below Expectations]]. Both times he wants it noted. The second time it is.
- **Mirror / asymmetry (John).** Loose rhyme with John's **B5→B6** (the factory opens; the community reorganises around the machine). Keep the **deliberate asymmetry** from [[Character Mirror Map]]: John is never *offered* the loom; Liam is *expected* to adopt, and adopting badly hands the system its own justification. There is no clean John twin for "adopts, but wrong"; record it as an asymmetry, not a forced rhyme. No new John scene.
- **Continuity.** Sits after the agent-first mandate ("Adopt the Agent (All-Hands)", B5), personal downstream of [[10 - The Win We Needed]]. Marcus has been on-mic twice already — the refused alliance and the credential callout in [[01 - Cold Open — The Standup]], and the quality complaint that turns into the first history in [[06 - Good Instinct]] — so by here the audience knows the shape of him and is already tired of him, which is what makes twenty minutes of standup feel like twenty minutes. **Enoch is the first full story he has ever been allowed to finish, which is why the ramp matters: three scenes of being cut off buy this one.** **This is the first time he and Liam go at each other at length, and the first time Liam says out loud that he has no politics.** "The Marcus PR" Liam cites in [[13 - The Performance Review]] is set up here. The billing-webhook retry ticket stays deliberately mundane: the easy work is now faster for everyone but him.
