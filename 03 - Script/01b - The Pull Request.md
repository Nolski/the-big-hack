---
type: scene
scene_number: "1b"
title: The Pull Request
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
runtime_estimate: ~7 min
live_cast: Liam
ai_video_assets: "[[AI Video Production Tracker|AIV-015 Brendan — PR review]], [[AI Video Production Tracker|AIV-016 The diff — screen share]], [[AI Video Production Tracker|AIV-017 THE AGENT — plan + transcript]], [[AI Video Production Tracker|AIV-018 CI / canary dashboard]]"
tags:
  - scene
  - liam-arc
---

# Scene 01b — The Pull Request

> [!info] Beat
> Immediate cut from the hangup/fade out to the slack ringing. Brendan picks up.

## Purpose
Pay off the standup's unfinished fight and turn the screw on the real tragedy: Liam's two complaints — the **weekend-grind precedent** and the **unreviewable 800-line PR** — are *genuinely good points*, and he's still a dick delivering them, talking down to the one colleague who likes him. Against that, Brendan answers with calm, correct, modern practice — review the intent not the diff, risk-based reading, tests as verification, staged rollout as the safety net, ownership — and every reasonable answer makes Liam more obsolete, not less. The horror is that nobody's wrong and nobody's cruel: Brendan isn't seduced by a shortcut, he's *better at the new shape of the job*, and the thing Liam built his identity on (the heroic careful reader who catches it at midnight) is being automated out from under him while he calls it beneath him. Plant "it's not coming for the thinking, it's coming for the typing" so it can come back un-funny.

## Setting / Staging
Continuous with the cold open — later the same morning, same dual-monitor desk, same bathrobe, the wall of Reddit memes still parked on the big monitor. Liam started a Slack huddle; Brendan's tile is back. The big monitor now holds the **diff** (Liam dragged it up himself), and partway through, Brendan's screen-share takes over: the agent's **plan + session transcript**, then the **CI / canary dashboard**. Same cool monitor-blue. Two engineers talking shop — the comedy and the dread both come from the *accuracy*. Liam never crosses onto the video plane: he's live at the desk, Brendan is on screen, the artifacts are on screen-share. The warm/analog half of the stage (John's loom) stays dark until the final hand-off, when the distant loom-knock comes up under the keyboard-clack and we rewind.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-015]] — Brendan:** the patient, well-reasoned adopter. Not defensive — generous. Concedes Liam's real points (precedent risk; the PR should've been split), reframes the rest with actual agentic-engineering practice, and lands the kind, devastating note ("it's not coming for the thinking — it's coming for the typing… you'd be unbelievable at this"). The decent man, out-arguing Liam without ever attacking him.
- **[[AI Video Production Tracker|AIV-016]] — The diff (screen share):** the same merged PR from `AIV-013`, now open and scrolled — the file tree, the four components, the auth/token section Liam keeps circling.
- **[[AI Video Production Tracker|AIV-017]] — THE AGENT (plan + transcript, screen share):** the machine present *as evidence* — the plan-mode plan it wrote before touching a file, then the long back-and-forth session transcript (Brendan's corrections, the agent's revisions). The review artifact Liam doesn't think to look at.
- **[[AI Video Production Tracker|AIV-018]] — CI / canary dashboard (screen graphic):** green integration tests against a partner sandbox; the flagged 5%→100% staged rollout from Thursday; flat error rate / latency. Text-on-screen, no voice. The safety net that replaced the midnight line-read.

---

## Script

*(The keyboard-clack motif from the standup never quite stopped — it carries us straight here. Same desk, same bathrobe, the meme wall still parked on the big monitor. But the small monitor's lit again: a Slack huddle, and this time LIAM is the one who started it. BRENDAN's tile blinks in. On the big screen the memes are gone — LIAM has dragged the merged PR back up himself, the diff open, scrolling.)*

**LIAM** *(live, already mid-scroll, no hello but a long sigh)*: Walk me through it. The whole thing. I want to actually see how you wrote this.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(easy — choosing not to be defensive)*
> Yeah, course. I'd rather go through it with you than not. *(sharing his screen)* I've got the PR and the whole session up ready to go.

**LIAM** *(live)*: Before the code. *(a beat — this is the part he actually called about)* What the hell, man? The weekend. Since when do we work weekends? *(scrolling)* You know what you just did? Kristina was practically salivating over the thought that we can just work weekends now whenever they fuck up a product idea or don't scope things properly. 

> [!screen] VIDEO — BRENDAN · `AIV-015` *(level — concedes it)*
> …Okay, that's fair. I'm not going to pretend that risk isn't real. *(but)* But it wasn't a weekend, Liam. It was maybe three hours Saturday because I was bored and messing around with the new opus. Most of it happened as i was making coffee.

**LIAM** *(live, not hearing it)*: Wow man, so clever, you vibe coded over coffee and it was no work at all. That's how it always starts. "Three hours, no big deal." Then it's the baseline. *(certain, and he thinks this is kindness)* I'm looking out for you here. You'll grind yourself into the ground and call it fun, and in two years they'll have quietly rewritten what "normal" means and suddenly you're on call every week for the shitty code your agent wrote.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(gentle, and he means it)*
> I did flag exactly that to Kristina — that we shouldn't make weekend-shipping the headline. *(beat)* But me shipping something I was excited about on a Saturday isn't a death march. *(carefully)* I think you've seen so many death marches you can't tell the two apart anymore. That's not a dig. I just think it's true.

*(LIAM doesn't engage with that — can't. He goes back to the screen, where the argument is one he knows how to win.)*

**LIAM** *(live, scrolling fast)*: …Whatever. The code. Look at this. Eight hundred lines. *One* PR. *(scrolling)* The Slack handler, the Jira client, the auth, the deploy config — all jammed into one diff. *(earnest, and turning the knife)* How is anybody supposed to review this? This PR is massive. There are too many moving parts. *(beat)* Be honest with me. There's no way you reviewed this the way you would have if you'd actually written it. Line by line. You can't have.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(no defensiveness — this is the thing he's thought hardest about)*
> The size — you're right. It should've been three or four smaller PRs, stacked. That's on me, I'm splitting them like that now. *(beat)* But "read it like I wrote it, line by line" — that's the part I'd push back on. That's not how you review this. It's not even the best way to review *human* code.

**LIAM** *(chuckles incredulously)*: …Yeah? You have a better way? Go on then.

> [!screen] VIDEO — BRENDAN · `AIV-015`
> Reading every line catches typos. It's terrible at catching *design* mistakes — you go diff-blind by line two hundred and rubber-stamp the rest. You know that better than anyone. *(beat)* So you don't start with the diff. You start with the intent. *(pulling it up)* Here —

> [!screen] VIDEO — THE AGENT (plan + transcript) · `AIV-017` *(screen share — a plan in plan-mode, then a long back-and-forth transcript scrolling under it)*
> *The plan it wrote before it touched a file: the four components, secrets in Vault, the approval step, the keys flagged as a tradeoff. Below it, the whole session — Brendan's corrections, the agent's revisions, on and on.*

> [!screen] VIDEO — BRENDAN · `AIV-015`
> That's the plan it wrote *before* a single line of code. I read that like a hawk — that's where the real decisions live. And this is the entire conversation — every time I pushed back, every thing I made it redo. *(beat)* The thing you review isn't just the diff. It's the plan, the transcript, the tests, and what it does in prod.

**LIAM** *(live, flat — his line from the standup)*: The tests. Here we go. The agent wrote the code *and* wrote the tests that say the code's fine. I made this exact point three hours ago.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(easy)*
> And it'd be a great point if I'd let it grade its own homework. I didn't. *(pulls up CI)*

> [!screen] VIDEO — CI / canary dashboard · `AIV-018` *(screen graphic — green integration suite against a partner sandbox; a 5%→100% rollout timeline from Thursday; flat error / latency)*
> *No voice. The tests are green. The rollout graph steps up in two stages, a day apart. The lines stay flat.*

> [!screen] VIDEO — BRENDAN · `AIV-015`
> I wrote the integration tests myself — real partner sandbox, real token flows, not the agent marking its own unit tests. *(beat)* And the auth, the token handling — the one part that can actually hurt someone — I read every line of that. Twice. That's the five percent that matters. The CRUD, the Slack plumbing? I skimmed it, and I'm fine with that, because if it's wrong the suite goes red and it never leaves the canary.

**LIAM** *(live, pouncing)*: It's not on a canary. It's *live.* In front of partners. You told me that yourself this morning.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(points at the dashboard)*
> It went out behind a flag Thursday morning. Five percent. Sat there all day — error rate flat, latency flat — so it promoted itself to everyone Thursday night. By the time you saw "live," it had a full day on real traffic. *(beat)* If it had wobbled it'd have rolled itself back and you'd never have heard about it. *(quiet)* That's the safety net now. Not me reading line four hundred at midnight.

*(A beat. LIAM has nowhere to put that. So he narrows — finds the one real thing, the engineer surfacing under the contempt.)*

**LIAM** *(live, quieter)*: Great, so now we have not just vibe coding but using the stupid robot to make sure our deploys go out correctly. I can't imagine that going wrong... Anyways, the long-lived keys are still wrong. I don't care how cleanly it shipped. A key that never expires, sitting in a partner's env file forever — that's a breach waiting to happen, and no canary catches *that,* because it's not an error. It's a decision.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(simple, no fight — gives him the point)*
> …Yeah. On that, you're right. I said the same thing — so did the agent, it's flagged right there in the plan. *(beat)* But that was Kristina's call, and... Well it doesn't seem that crazy right? *(careful)* Take it up with her. But — gently? Maybe not the way you took it up with her this morning.

**LIAM** *(live, sliding past it, back to the thing he came to say)*: …I meant what I said this morning. I've spent over a decade being spoken down to by incredulous PMs who think that just because I don't speak like a politician that my knowledge doesn't keep this company from collapsing. Sorry if that isn't PC or whatever but  I'm serious about the weekend, man. You're better than this. You're a *real* engineer — you don't need to outsource your thinking to some dumb chatbot and pull Saturdays to look fast. *(a beat, almost warm)* I'm only saying it because I like you. Most of these people I wouldn't bother.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(a real beat — he takes it as meant, and answers straight)*
> …I know. And I do like working with you — I've learned more from you than from anyone here, that's true. *(beat)* But I didn't outsource the thinking. I *did* the thinking — the plan, the tests, the rollout, the five percent that bites. The agent did the typing. *(gentle — this is the one meant to land)* That's the part you keep not hearing, man. It's not coming for the thinking. It's coming for the typing. *(beat)* You're the best thinker here. You'd be unbelievable at this — if you'd stop deciding it's beneath you.

*(LIAM goes quiet and literal — the way he does when he's hurt.)*

**LIAM** *(live)*: …It is beneath me. *(beat)* I spent twenty years learning to do this properly. I'm not going to stand here and let a glorified autocomplete tell me that's the same thing as typing a paragraph and clicking accept.

> [!screen] VIDEO — BRENDAN · `AIV-015` *(quietly, not unkind — and he lets it go)*
> …Yeah. Okay. *(beat)* For what it's worth, nobody's saying it's the same thing. *(he reaches once more, then doesn't)* I'll split the PR up next time. Promise. *(beat)* Talk later, Liam.

*(BRENDAN's tile blinks out. The diff sits there — green, merged, alive, fine. LIAM scrolls it a moment longer, hunting for the flaw that would prove him right. He doesn't find it. The keyboard-clack motif comes up — but he isn't typing. Under it, faint and far off, the flat mechanical knock of a distant loom. Cold light starts to fail toward warm. Two hundred years fall away.)*

> [!screen] VIDEO — THE AGENT (plan + transcript) · `AIV-017` *(the screen-share dims out as the lights change — the last modern image to go)*

*(Hand-off into Movement II — [[02 - The Loom and the Guild — John half]]. The keyboard-clack has become loom-clack.)*

---

## Notes
- **Liam is right twice and a dick twice.** Same engine as the cold open: his complaints are *legitimate* — weekend-grind-as-precedent is a real labour problem, and a single 800-LOC AI PR genuinely is hard to review well. His sin isn't the critique, it's the contempt and the talking-down, and his blind spot is that Brendan has already thought past every objection. Keep him from being cleanly wrong (he wins the keys point) **or** cleanly right (he loses everything else).
- **Brendan is the steelman of agentic practice — don't strawman him.** Every answer is real best practice: review intent/plan over diff; the session transcript as a review artifact; risk-based reading (line-by-line on auth, skim the boilerplate); human-authored integration tests against a real sandbox (not the agent grading itself); staged rollout behind a flag + observability as the safety net; ownership of merged code. He concedes what's true (split the PR; the precedent risk; the keys). He's not seduced — he's *better at the new job.* That's the dread.
- **The curdle planted here:** "It's not coming for the thinking — it's coming for the typing. You'd be unbelievable at this — if you'd stop deciding it's beneath you." Pays off un-funny in B5/B6 (role redefined to *reviewer of the machine*) and B7 (the careful-reader identity logged as "friction"). The job Brendan describes — read the plan, own the rollout, review the machine — is the exact job Liam will be told he's bad at. Log against [[Themes & Motifs]].
- **Tech accuracy:** plan-mode plan + transcript as the real review surface; risk-based review; integration tests vs. self-graded unit tests; feature-flagged 5%→100% canary with auto-rollback; observability (error rate / latency) as the gate. The long-lived-keys callback stays consistent with the cold open — Liam's JWT memo, Kristina's adoption-data override — and Brendan again refuses to pin it on the AI.
- **Friendship beat:** Liam genuinely considers Brendan a friend and frames the dickishness as protection ("I'm only saying it because I like you"). Brendan receives it as meant and still disagrees — names the standup harm without attacking, and answers the insult with a compliment Liam can only hear as an insult. Keep the warmth real or the tragedy doesn't bite.
- **Structure / placement (FLAG):** this is drafted as a **Movement I coda** so it flows straight out of the cold open and *carries the loom hand-off into the rewind* — arguably a cleaner bridge into John than the cold open's meme-button. But it adds a second Liam scene before the cut to John, which softens the "Movement I is one scene → John's warmth arrives immediately" design in [[Structure & Scene Map]] (see the cut-to-John-now consequence note). If we'd rather protect that fast hand-off, this scene relocates cleanly to **Movement III**, just before [[Beat Sheet — Parallel Intercut#B6 — The community fractures (the betrayal begins)|B6]] / "The Coworkers Go Quiet," where its review-burden content is the truer beat anyway. Decide before locking; renumber accordingly.
- **Hand-off:** if this stays in Movement I, the loom-knock rewind moves *here* from the end of the cold open (the cold open then ends on Liam-alone-with-memes, no rewind). Don't run the rewind twice.
