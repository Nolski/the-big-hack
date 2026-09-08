---
type: scene
scene_number: "1c"
title: The PR Review
world: modern
arc: liam-arc
beat: "[[Beat Sheet — Parallel Intercut#B2 — The community (where he has standing)]]"
status: drafted
live_cast: Liam, Brendan
ai_video_assets: "[[AI Video Production Tracker|AIV-016 The diff — screen share]], [[AI Video Production Tracker|AIV-017 Plan + transcript — on-screen UI]]"
tags:
  - scene
  - liam-arc
---

# Scene 01c — The PR Review

> [!info] Beat
> Second Movement I opener, straight off the standup. Liam pulls Brendan into a one-to-one to litigate the merged portal (Liam started the huddle). He opens with a clumsy, real apology for the degree line — then relentlessly steamrolls the actual review, unable to let Brendan explain how he now works. Seeds B5/B6/B7: the careful-line-reader identity that is about to be automated out from under him, defended at the top of his lungs.

## Purpose
Showcase Liam at full, unfiltered intensity — brilliant, rigid, monologuing, socially airtight in the worst way. He *does* half-apologise (he's not a monster), and his surface complaints — weekend-grind-as-precedent, an unreviewable 800-line PR — are *real*. But the tragedy is procedural: Brendan has a genuinely better way to review this, tries four times to show him, and **cannot get a word in**. Liam pattern-matches everything to twenty years of line-by-line review, mistakes steamrolling for mentorship, and never once registers that the junior has already thought past him. He wins the room and loses the future in the same breath.

## Setting / Staging
Continuous — Brendan takes Liam's Slack huddle. **Liam** is live at the same dual-monitor desk, still in the bathrobe, the memes finally gone: he's dragged the merged portal diff back up onto the big monitor and he's been stewing. **Brendan** is live at his own desk, on the other end of the huddle. Two live men, two pools of light, one call between them — they never share the stage picture and never touch. The diff / plan-transcript are the screen-share Brendan keeps trying to drive and Liam keeps yanking back. Two engineers "talking shop," except only one of them is talking. The comedy and the dread both come from the *accuracy*: watch how many times Brendan opens his mouth and doesn't finish a sentence. The warm/analog half of the stage stays dark. Slack-huddle tone under it.

## Live Cast

- **BRENDAN** — live, Speaker B (PR-review): patient, generous, not defensive — and slowly, visibly, giving up. He concedes Liam's real points, then tries and fails to explain the new method; play the small deflation each time he's cut off. The decent man who can't reach the door.

> [!note] Live/video plane
> Brendan plays these scenes **live at his own desk**, diegetically on the call — he and Liam are remote colleagues, so they share no props and never touch. Everyone else stays on the video plane.

## AI Video Cues
- **[[AI Video Production Tracker|AIV-016]] — The diff (screen share):** the same merged portal PR, file tree and all, that Liam keeps scrolling and jabbing at — the ground he knows how to fight on.
- **[[AI Video Production Tracker|AIV-017]] — Plan + transcript (on-screen UI):** the plan-mode plan Brendan wrote before any code, and the session transcript — shown briefly as the thing Brendan pulls up to explain his method, and that Liam talks straight over without ever looking at. Screen only, no voice; written as **stage direction**. The evidence in the room that never gets read.

---

## Script

*(The standup has just cleared. The slack huddle sound plays... Liam is calling brandon... [MUSIC: music/slackhuddle.mp3])*

**LIAM** *(live, gruff — not his comfort zone, getting it out of the way first)*: Before you say anything. The Kristina thing this morning, what I said about her degree. *(a beat; this is hard for him)* That landed like shit. I know. I shouldn't have said it like that.

**BRENDAN** *(live, caught off guard he's saying it)*: …Okay. Yeah. It really did.

**LIAM** *(live)*: But I wasn't *wrong* to be worried. I'm not trying to bully her, I think we're about to get burned and nobody in that room is listening, and it comes out of my mouth as… *(a small, helpless gesture)* …that. I'm bad at this. I know I'm bad at this.

**BRENDAN** *(live, gently)*: …Honestly? If you said it to *her* the way you just said it to me, it'd go a lot better.

**LIAM** *(live, already moving on — can't stay in it)*: Yeah, well. *(beat)* Anyway. That's not why I called. The weekend.... Since when do we work weekends?

**BRENDAN** *(live, level)*: It wasn't a weekend, Liam. It was maybe three hours Saturday because I was bored and messing around with the new Opus. Most of it happened while I was making coffee

**LIAM** *(live, the real reason, leaning in)*: But the code. Show me. Walk me through what you actually did, the whole thing, start to finish. I want to see how you wrote this.

**BRENDAN** *(live, easy, glad to — sharing his screen)*: Yeah, course. So, honestly the way I work now, I start with the cursor plan. If you look at...

*(On the big monitor BRENDAN pulls something up, his cursor plan from Saturday. LIAM does not look at it. He has grabbed the diff back and is already scrolling.)*

**LIAM** *(live, over him, jabbing at the screen)*: Eight hundred lines. One PR. The front-end, the key-issuance service, the auth, the deploy config, all jammed into one diff. How is anybody supposed to review this?

**BRENDAN** *(live)*: That's... okay, that's actually kind of my point, you don't review it by reading...

**LIAM** *(live, cutting in)*: You don't review it at all, is the answer. You *can't.* Nobody read this. I could not, in good conscience, put my name on this, and I've been doing this twenty years. *(scrolling, faster)* Here. Line four hundred. This function. What does it do? Off the top of your head what does it do and why is it shaped like this?

**BRENDAN** *(live, patient)*: I... I can tell you, but that's not really how I check it now, if you'd let me show you the process I follow...

**LIAM** *(live, not hearing it — this is the thing he knows)*: Because *that's* what review is. You read it. Line by line. You hold the entire thing in your head at once. That's the job. That's the whole thing that separates an engineer from someone typing paragraphs at a chatbot and hitting accept.

**BRENDAN** *(live, one real attempt — pulling the transcript up again)*: Liam, genuinely, give me two minutes. Let me actually show you how I reviewed it. There's the plan, there's the whole session, the tests I wrote, the way I...

**LIAM** *(live, waving at the screen without looking)*: I don't need the guided tour of Cursor, Brendan. I can read code. I was reading code before Cursor existed. *(flat — his standup line, back again)* And don't tell me the tests pass. The AI wrote the code *and* wrote the tests that say the code's fine. It's marking its own homework. I made this exact point three hours ago.

**BRENDAN** *(live, quietly, the fourth time he's started a sentence he won't finish)*: …I wrote the evals myself actually, against our staging env...

**LIAM** *(live, over him again, certain)*: You've all decided the thing is *smart* because it's *confident.* It is not smart. It's a very fast intern who has never once in its life said "I don't know." And you're letting it near production.

*(BRENDAN just… stops. He's realised he isn't going to get in. LIAM reads the silence as agreement.)*

**LIAM** *(live, softening — and this is the worst part, because he means it)*: Look. I'm not doing this to be a dick. I'm trying to *help* you. You're good, Brendan, you're actually good, that's why I bother. Most of these people I wouldn't waste the breath on. I don't want to watch you turn into someone who can't work without the thing holding his hand.

**BRENDAN** *(live, a long beat — he lets the whole thing go)*: …Yeah. Okay, Liam. *(quiet)* I hear you.

**LIAM** *(live, satisfied, having registered none of it)*: Good. *(beat)* Split it into smaller PRs next time. And read your diffs, all of them, not the machine's summary. *(a small nod, almost warm)* You'll thank me for this in five years.

**BRENDAN** *(live, flat, done trying — reaching for the door)*: …Sure. Thanks. I've gotta get back to it.

*(BRENDAN drops the huddle, the plan and transcript still open on the screen, unread. LIAM is alone at the desk with the diff. He scrolls it a while longer, hunting for the flaw that would prove him right. He doesn't find one. He doesn't look satisfied either.)*

---

## Notes
> [!important] Cut pass — restored to the running order, before [[01b - The Cursor Demo]]
> An earlier cut removed this scene and moved the apology into [[06 - Good Instinct]]. That was reversed: this is the only scene where Brendan earnestly tries to show Liam the method and cannot finish a sentence, and the play cannot lose it. It now sits **second**, straight off the standup, so Kristina's "Did you show Liam this? / I tried" in 01b lands on something the audience has seen. **Cut here:** Liam's second precedent speech ("That's how it always starts… I'm looking out for you here") and Brendan's "…Okay" under it. **Line changed rather than moved:** the opening stage direction, which no longer refers to a huddle Liam noticed. "Line four hundred" and the intern line stay, because removing either would mean rewriting the aborted attempt next to it.

- **The autism is played straight and with dignity — never as a punchline or a diagnosis.** Show it in *behaviour*: the monologue that doesn't yield the floor; the literal fixation ("line four hundred — what does it do"); the twenty-years pattern-match applied to a situation that no longer fits; the total miss on Brendan's four aborted attempts to speak; reading silence as agreement; and the genuine, mis-delivered care ("I'm trying to help you"). He is not being cruel here — he thinks this *is* mentorship. That's the tragedy, not a flaw to fix.
- **He's right on the surface, blind underneath.** The precedent risk and the un-splittable 800-line PR are legitimate — keep them legitimate. His blind spot is that Brendan has already solved the review problem a better way and cannot get two sentences out to say so.
- **The methodology is deliberately withheld here.** Brendan never lands it — Liam won't let him. The actual explanation (plan-over-diff, transcript-as-artifact, risk-based reading, human integration tests, canary/observability) lands in [[01b - The Cursor Demo]], where Kristina *does* let him talk. The contrast is the point: the person who needs it most refuses the lesson; the person who'll wield it against him receives it eagerly.
- **Play the aborted sentences.** Count them in performance — Brendan starts and is cut off at least four times before he stops trying. The deflation should be visible.
- **Hand-off:** ends on Liam alone and unsatisfied — no rewind here. Kristina's call to Brendan ([[01b - The Cursor Demo]]) follows, and her "Did you show Liam this? / I tried" pays off what the house just watched.
