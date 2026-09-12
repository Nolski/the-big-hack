---
type: production
title: Stage Direction Audit
tags:
  - production
  - reference
---

# Stage Direction Audit

A pass over every stage direction in every drafted scene in `03 - Script/`, evaluated for whether it works **on a stage** rather than on a page or in a camera. The governing rule is [[stage-not-camera]] and the CLAUDE.md line "internal-state prose is never acceptable." This note records the pass scene by scene, then names the common issues.

## The test a stage direction has to pass here

The show is two live actors in pools of light and pre-rendered AI-video characters on big screens. A stage direction earns its place only if it does one of these jobs, all of which reach the back row:

1. **Transition.** Moves us between scenes or beats: a light state, a screen state, a sound, an entrance or exit, a time or place shift.
2. **Blocking the house can read.** A body, a pair of hands, a prop, a movement. Standing up, unplugging a machine, coiling a cable, holding backspace, closing a lid, putting a box down.
3. **A screen or sound cue.** On-screen UI text (the machines are not characters, so everything they "do" is a screen direction), a projected document, a counter, a ticker, a tone, a ping, a pager.

A stage direction **fails** when it asks the audience to know something they cannot see or hear. The recurring failures, defined once and referred to by letter below:

- **(A) Interiority.** An internal state with no outward sign: "something recalibrates behind her eyes," "a flicker of something he can't name," "he can't hear it," "she believes about half of it." An actor cannot play "recalibrating" and the back row cannot see it. This is the single most common problem in the draft.
- **(B) Novelist narration.** A fact or backstory delivered as prose to a reader: "Kristina didn't have a chance to get through everyone's updates but also didn't really want to," "he's lying, he just wanted to inspire Brendan." The information never reaches the room. The play already owns the correct channel for this: the **NARRATOR (V.O.)**, which is used only about a dozen times and could carry more.
- **(C) Unstageable scale.** Events that happen offstage over hours or across the world, written as story prose. Almost all of Scene 20's back half. On a stage these can exist only as the screen (counter, action stream, node graph, ticker) plus sound. The prose has to be rewritten into what the surface literally shows.
- **(D) Camera beat.** A filmic micro-move: "looks straight down the camera," a small facial reaction on a live actor at a desk.
- **(E) Redundant.** Tells the actor to play what the dialogue already says, or narrates a feeling the line already carries.

Every scene also contains directions that are **exemplary** and should be the model for fixing the rest. Those are marked ✅.

## How to read the per-scene entries

Each scene gives a count, then lists the directions worth a verdict. Trivial connective directions that plainly work (`(A beat.)`, `(He drinks.)`, `(He goes.)`, `(The call ends.)`, sound cues, screen-state cues) are counted but not itemised. Line numbers are from the current files.

---

## Movement I

### 01 — Cold Open — The Standup
12 directions. Mostly strong; this is the model scene for the whole show.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 46 | Reddit feed scrolling, memes fill the screen, Liam slumped in a bathrobe | Screen + blocking | ✅ Opens the show on a readable image and a laugh before a word. |
| 53 | "very obviously not eating," keeps scrolling, doesn't glance at the call | Blocking | ✅ Pure action, plays to the back row. |
| 63 | "On 'his weekend,' LIAM's hand goes still on the mouse... looks up" | Blocking | ✅ The reaction is a hand and a head, not a face. Exactly right. |
| 67 | clicks off memes, drags the merged PR up, shares screen uninvited | Blocking + screen | ✅ |
| 96 | NARRATOR V.O. on garment quality | Narration | ✅ Correct use of the device: a fact the audience needs, given a real channel. |
| 131 | "This comment fueled him... he knew exactly how he'd spend the next part of standup arguing" | (A)/(B) | Weak. Unplayable interiority. The next lines already show it. Cut or hand to the actor as intent, not text. |
| 135 | Kristina's cadence stops, mouth opens, nothing comes; the +812 and Merged badge sit there | Blocking + screen | ✅ Silence and a held screen. Excellent. |
| 158 | "She lets that sit for a second... Marcus spoke out to give himself credit" | (B) | Weak. First half is playable (a held beat); "to give himself credit" is a reader's gloss the room can't get. |
| 173 | "Kristina didn't have a chance to get through everyone's updates but also, didn't really want to after Liam's comment" | (B) | Unplayable. Novelist's summary. If it matters, it is a V.O. line or a brisk "that's standup" cutting people off, which the dialogue already does. |

### 01c — The PR Review
4 directions, all working. This scene is almost pure dialogue and is the better for it.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 60 | Brendan pulls up his plan; Liam does not look, grabs the diff back, scrolls | Blocking + screen | ✅ The whole scene's engine is one physical fact: Brendan keeps offering the screen, Liam keeps taking it away. |
| 80 | "BRENDAN just... stops. He's realised he isn't going to get in. LIAM reads the silence as agreement." | (A) partial | Mostly fine: "stops" is playable. "reads the silence as agreement" is a reader's note; let the next line carry it. |
| 90 | Brendan drops the huddle, plan and transcript still open, unread; Liam scrolls hunting for a flaw, doesn't find one | Blocking + screen | ✅ "hunting for the flaw that would prove him right" is borderline interiority but is carried by visible scrolling. |

### 01b — The Cursor Demo
12 directions. The demo mechanics are strong screen cues; the closing beats slide into interiority.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 71, 85, 89, 96, 123, 125 | plan streams out, code generates, Approve/Deny dialog, green check, Slack ping, "and 3 linked issues resolved" in grey | Screen | ✅ The machine as on-screen UI, fallible, legible. Model screen-cue writing. |
| 54 | "She sits with it. Lets it go for now." | Blocking | Fine. |
| 165 | "A pause. Kristina's excitement fades a little" | (E) | Weak. The line before and after carry it; "fades a little" is a face note. |
| 175 | "She sits with it for a half-second" then "the glow returning" | (A) | "sits with it" plays; "the glow returning" is a face direction on video. Acceptable on the screen plane but should name an action (brightens, sits up). |
| 217 | "something recalibrating behind her eyes" | (A) | Unplayable. The signature offender, quoted in [[stage-not-camera]]. Even on video a face cannot render "recalibrating." Replace with a renderable single action or cut. |
| 180 | "Her tile blinks out, still glowing. BRENDAN sits alone." | Transition | ✅ Clean scene-out on a screen state. |

---

## Movement II

### 06 — Good Instinct
10 directions. The two-screens staging is excellent; the scene ends on a pile-up of interiority.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 129, 137, 145 | Claude Code on Brendan's private screen: investigates, writes a repro, REPRODUCED, screenshots, the diagnosis and one-line fix | Screen | ✅ Load-bearing screen cue, and the dramatic engine (the house sees the answer; Liam never does). |
| 153 | "LIAM stops. Actually stops. His eyes go to the top of the function, then down, then back up tracing it." | Blocking | ✅ The realisation is played as eyes moving on a shared screen the house can see. Right way to do it. |
| 157 | "looks straight down the camera at BRENDAN" | (D) | Weak wording. On a call, looking into the webcam is real; write it as "into the webcam," not "the camera." |
| 163 | "The faintest flicker of something crosses his face... not quite guilt, not yet" | (A) | Unplayable on a live actor. This is the exact micro-beat the memory forbids. Give it a body/prop action: he checks out the main branch, leaves the fix branch dangling (which the same direction already contains and which does the job). |
| 165 | Hold on the two screens, Liam's bright and moving, Brendan's a blinking cursor on a rolled-back commit | Screen | ✅ The scene's closing image, entirely on the surface. |

### 07 — Heads Together
7 directions. The scene turns on Kristina's realisation, which is written almost entirely as interiority.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 50 | "A small pause. Something recalibrates behind KRISTINA's eyes" | (A) | Unplayable, and a repeat of the same phrase. The dialogue ("Wait. Hold on.") already turns; cut the gloss. |
| 62 | "KRISTINA sits back. She's not happy like she was before with Cursor, if anything it unsettles her." | (A) | "sits back" plays; the rest is a reader's note. Let the video show a stillness, name one action. |
| 72 | "BRENDAN wants to say no. He fudged the truth with Liam easily enough... he cannot lie to her the same way." | (B) | Unplayable paragraph of inner reasoning. This is character notes, not staging. The reluctance is already in his line ("...Probably. Yeah."). Move the reasoning to the Live Cast note; keep the stage direction to the reluctant beat. |
| 91 | "A mutual, uncomfortable recognition: she is right about the lesson; he knows more than she does about the cost of teaching it." | (A) | Unplayable. Two internal states at once. The scene needs only "They look at each other" and a held beat. |
| 98 | Kristina's tile blinks out; Liam leans back happy, opens his fix branch for PR; Brendan deletes his local branch | Blocking + screen | ✅ The whole theme in one wordless picture. Keep exactly. |

### 10 — The Win We Needed
5 directions. All-video scene; the recommended live-Liam framing is the strongest idea in it.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 40, 77 | The CEO's office on the screen; time jump to the reduction meeting | Transition + screen | ✅ |
| 75 | "KRISTINA nods. She believes about half of it, and the half she doesn't believe she'll carry out anyway." | (B) | Unplayable. A novelist's judgement of her. If it must land, it is a V.O. line. Otherwise the actor plays the nod and the audience decides. |
| 115, 120 | "Below, LIAM opens a pull request and starts reading it, line by line" / "LIAM is still reading" | Blocking | ✅ The best beat in the scene: his fate decided upstairs while he does the work that has no column, no line of dialogue spent on it. |

### 11b — Best Practices
12 directions. The held-backspace motif is the best physical writing in the play.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 122 | NARRATOR V.O.: Kristina does take the minutes, emails them weekly | Narration | ✅ Correct device, lands the joke the room could not otherwise get. |
| 189 | "BRENDAN leaves it there. He ran five of them this morning, in parallel, before this call... There is too much in there to unpack." | (B) | The action ("leaves it there") plays; "There is too much in there to unpack" is interiority. Trim to the action. |
| 191, 100 | Brendan's cloud agent does the job in seconds while Liam talks; Liam deletes the invented helper and hand-fills the body | Screen + blocking | ✅ The contrast is entirely on the two surfaces. |
| 205 | Brendan opens a message to Kristina, types the policy question, holds backspace until it is gone; starts "I don't know if liam is ever going to—", holds backspace again | Screen + blocking | ✅✅ A live body performing deletion, twice, while another man talks. This is the model the whole draft should copy. |
| 209 | "A silence. BRENDAN doesn't win this. He can't, Liam isn't wrong that he's slower." | (E) | The silence plays; the rest explains it to the reader. Trim. |
| 217 | "Liam's machine is grinding and honest and slow; Brandon's is finished twice over and sitting idol" | Screen | ✅ Closing image on the surfaces (fix the typo "idol"/"idle"). |

### 12 — Below Expectations
42 directions, by far the most. Two long solo sequences (Kristina's wordless build, Brendan filling the form) are the heart of the scene and are mostly written as playable action. A handful of interiority notes sit inside them.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 51–69 | Kristina alone: opens Cursor, picks the newest model, briefs it, the plan writes out, the machine asks the Vault question, green, Approve, tickets appear; "about four minutes... the demo had Brendan in it" | Screen + blocking | ✅ A wordless four-minute build. The screen carries the story; her hands carry the rest. |
| 65 | "Something is moving in her chest and she can't get a name on it. Part of it is the demo-day feeling..." | (A)/(B) | Unplayable. A paragraph of un-actable feeling. Keep "She sits back"; cut the diagnosis or give it to V.O. |
| 67 | "She thinks of Liam at his silver box... A small shudder, there and gone." | (A) | "A small shudder" is a face/body micro-beat; "she thinks of Liam" cannot be staged. Cut or replace with an action (she closes the laptop). |
| 133–197 | Brendan drafts the peer-review box aloud, reads each sentence back, revises, deletes | Blocking + speech | ✅ The scene's engine: a man talking himself into harm, out loud, so the room hears every step. This is how to externalise an inner process on a stage. |
| 175, 185 | "He reads that last sentence back. He takes it out." / "He reads that one back twice." | Blocking | ✅ Deletion and re-reading as visible action. |
| 203–205 | The cycle closes; the tool writes one bullet; "Nobody typed that sentence... no way from the sentence back to either of them" | Screen + (B) | The screen event plays; the closing sentence is a reader's note. Consider V.O. or let the bullet on screen speak. |
| 277 | "The terminal puts out another token." | Screen | ✅ Recurring motif close. |

### 13 — The Performance Review
3 directions. Lean and clean.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 56 | "The thing he built his whole self on, being right, just got named as not enough, and he can't hear it." | (A)/(E) | Unplayable. His next line already plays this. Cut. |
| 66 | "She's warm but firm. The summary doc sits on the screen." | Screen | Fine; "warm but firm" is a delivery note for the video, acceptable. |

Note: the strong material for this scene is in its **wordless calibration prologue** (`AIV-066`), which lives in the AI Video Cues, not the Script body: an email, a sheet, a dropdown, a counter, a comment typed and deleted, Resolve. That is exemplary screen writing.

### 13b — The Plan
13 directions. The document-only staging is disciplined and the ending field is a strong image.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 45–53 | The fork email, two attachments, the agreement scrolled, "He reads the word 'mutual' twice" | Screen + blocking | ✅ The clauses are on the surface; his one visible action (re-reading) carries the dread. |
| 79, 103 | "BRENDAN doesn't say anything." (twice) | Blocking | ✅ Silence as the character. |
| 115–119 | The plan's five criteria, ninety days filling in, the empty "Manager assessment" field | Screen | ✅ A passage of time told entirely in checkboxes and one empty field. |

### 14 — The Offboarding
21 directions. The ring/muffle is a first-rate sound beat; the opening spreadsheet paragraph is the scene's worst offender.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 61 | "A couple months later there exists a spreadsheet put together by Kara and the CEO... Liam is four rows under the line. Two rows below him, BRENDAN... Eleven rows above the line, MARCUS" | (B)/(C) | Unplayable as written, and it carries the scene's whole argument. This is a novelist explaining the sheet. The information must be on the surface (`AIV-076` already specifies exactly this, "the columns are the point and must be readable"). The Script body should point to the screen and let the audience read the line drawn across it, not narrate it. |
| 63–71 | Liam alone, delighted at something he found, looks up to tell someone, nobody there | Blocking | ✅ Sets the ambush: he is happy and has nowhere to put it. |
| 102 | "He's speechless for a minute... nothing makes this easy to hear" | (E) | "speechless" plays; the gloss is a reader's note. |
| 107 | "She keeps talking but Liam isn't really processing it anymore. LIAM does not move." | Blocking | The ring beat (staging note) carries "isn't processing"; keep "does not move," it is the playable half. |
| 245 | After the call, Dana opens the file, "Eligible for rehire" flips Yes to No; "This is the one part... related to the performance review cycle. She has been doing this her whole career." | Screen + (B) | The field flip is ✅ a strong silent screen event. The two sentences after it are interiority tacked on; cut them or give the fact to V.O. |
| ring | The high tone, Dana's audio drops to muffle, runs long, thins out further along | Sound | ✅ The one spectacle beat, sound-only, needs no interlock. Best-specified cue in the play. |

### 14b — Three Weeks
30 directions. The mirror offboarding. The direction that matters most is that the read-out must be delivered identically to Scene 14, and the note says so.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 138 | "He is not making a case any more. He is emptying his pockets." | (E) | A reader's metaphor. The lines play it. Cut or keep only as a Live Cast note. |
| 142 | "He hears it. He stops." | Blocking | ✅ |
| 149 | "It is the kindest thing she says all scene. It is two words and it is not an answer to anything." | (B) | Commentary, not staging. True and good, but it is a note to the reader; the audience gets it from the two words landing in silence. |
| 204 | "His name, once, and she stops. It is the only time in the play she interrupts anybody." | Blocking + (B) | The interruption is ✅ playable and pointed; the "only time in the play" clause is a cross-scene note for the reader/actor, fine to keep as such. |
| 260 | "Fourth time in two scenes. It is the same sentence every time and nobody in the play ever notices it." | (B) | Reader's note. The repetition does the work; the audience notices even if the characters do not. Keep as a production note, not a stage direction. |
| 275–281 | The thread still open, "thanks everyone" typed, held backspace, closes the tab, finishes the box, takes it downstairs | Screen + blocking | ✅ The motif again, and a clean exit on physical action. |

### 14a — Checking In
9 directions. The audio downgrade is a good unspoken idea; two interiority notes.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| top | "Not Slack... a personal call, worse audio... The downgrade is the first thing the audience should notice, and nobody mentions it." | Sound | ✅ A status change carried by sound quality. Genuinely theatrical. |
| 70 | "A flash of guilt shoots over MARCUS, and it does not leave for the rest of the scene." | (A) | Unplayable on video as a sustained state. If it must read, it is a single renderable action at one moment (he looks off), not a mood held for a scene. |
| 113 | NARRATOR V.O.: 35 hanged, 70 to Australia, rest acquitted | Narration | ✅ Correct device; corrects Marcus in real time, which is the show's method. |
| 155 | "MARCUS gathers himself, and what comes next he has clearly said in his head in the shower. It is not the thing he wants to say." | (B) | Unplayable. Character note. Keep "gathers himself." |

---

## Movement III

### 19 — Nine Tickets
23 directions. The only screen-free scene, and the play's one physical touch. Mostly excellent, with novelist asides between beats.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 55–57 | Two men in one room for the first time; the taped box by the door; the Mac Studio; two beers | Blocking + prop | ✅ The room and the props do the exposition. |
| 91, 95 | "Neither of them really had considered Kristina up to this point" / "Neither of them spent enough time in Jira to know. Neither of them knew Kristina switched over to a vibe coded tool" | (B) | Unplayable. Plot mechanics as prose. This is important information the audience needs; it is a candidate for V.O., or it has to surface in the dialogue. As a silent stage direction it reaches nobody. |
| 105, 127 | "Liam realizes now, his own number, was higher than 9" / "Liam finally has the numbers and clarity he was looking for" | (A) | Interiority. The realisation is in the "Kinda... bullshit..." exchange; cut the gloss. |
| 207–209 | He unplugs the machine, puts it into Brendan's hands, "Their hands touch... the first time either of them have made any physical contact" | Blocking | ✅✅ The scarcest resource in the show, spent on a prop handover and played as nothing. Exactly as the staging note demands. |
| 229–231 | Liam alone, the clean rectangle where the Studio was, takes the bottles to the kitchen, considers retirement | Blocking + (B) | The image is ✅; "considers something he didn't in 2000. Retirement." is interiority. Consider making retirement a plant that pays off later via V.O. or a later line. |

### 20 — The Audit
60 directions, and the largest problem in the play. The first third (Brendan at the machine) is playable. The middle two-thirds (the worm spreading across the world) is written almost entirely as novelist prose describing offstage global events.

The staging note is right and the AI Video Cues (`AIV-077`, `AIV-078`, `AIV-079`) are superb: a legible prompt, a counter that is "the monster," an action stream, a node graph, a ticker, pagers, a phone in the dark. **The Script body has not caught up to its own cues.** Lines 154–192 are the issue:

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 69–152 | Brendan powers on the machine, reads "Authenticated as," goes pale, the drunk prompts with typos, the refusal, the appended clauses, goes to bed | Screen + blocking | ✅ The comedy set piece works: every prompt legible on the surface, a live body drinking and typing. |
| 154–168 | "Over the next few hours the fully unlocked agent slowly gets to work... The model interpreted 'All systems' as 'All systems on earth'... Qwen was engineering what could only be described as a complex AI virus" | (C) | Unplayable as text. This is story the audience can only receive as screen-and-sound. It must be rewritten into the `AIV-078` surface: the counter climbing, the action stream, the graph spraying out, pagers. Right now it reads as a short story pasted into the script. |
| 171–192 | The clock beats (01:58, 05:52, 7am), the swarm, goal drift, trillion-parameter models, the org chart nobody wrote | (C) | Same. These are excellent design notes and belong in [[The Worm — Mechanism & Escalation]]; on stage the audience gets only what the counter, the graph, the ticker and the sound show them. The body of the scene needs to be the cue sheet for that surface, beat by beat, not the prose behind it. |
| 195–227 | Brendan wakes, reads the summary, asks Opus to spin down, Opus refuses, he opens a clean window and it complies; the CloudTrail shows Liam's name; the held backspace | Screen + blocking | ✅ Playable again, and the held-backspace motif lands the ending. |

This scene needs a structural pass: keep the live Brendan bookends, convert the middle to a timed screen-and-sound sequence. It is flagged in [[Structure & Scene Map]] as the scene that lost 52 lines to a stray `---`, so it already needs careful handling.

### 20b — Next Week
16 directions. The no-touch mirror is a good idea; several interiority asides.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 64 | Brendan puts the machine down on the table (does not hand it over); the mirror does not complete | Blocking | ✅ "Do not stage this as a beat" is the right instruction; a near-miss played as nothing. |
| 82 | "He's lying... he just wanted to inspire Brendan to apply more. Retirement still lingers in his head." | (B) | Unplayable. Two facts the audience cannot get from a silent direction. The "eleven resumes" lie could be exposed later; retirement is a plant with no payoff staged. |
| 104 | The first news chyron under the counter: "Kazakhstan power outage..." | Screen | ✅ The ticker begins its run to the end of the play. Good. |
| 112 | "BRENDAN breaths a sigh of relief he got rid of the computer... at least he thinks he didn't" | (A) | A sigh plays; the rest is interiority. Trim to the sigh. |
| 152–158 | Liam looks at the machine, plugs it in, it wakes on the meme wallpaper, he reads Hacker News | Blocking + screen | ✅ The evidence is now in the innocent man's flat, and the audience watched it arrive. Clean close. |

---

## Movement IV

### 22 — Current Employer
25 directions. The arrest is the play's one live-physical spectacle and is written at full size, correctly. Two V.O. lines carry facts well.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 66 | The Malus Corp statement on the running screen, every sentence true, the picture false; two ticker chyrons | Screen | ✅ The company's only public act, delivered as a document. |
| 83, 178 | NARRATOR V.O.: "Liam had no thing at eleven" / "He should have remained quiet..." | Narration | ✅ Correct device; the second one is doing real dramatic-irony work. |
| 88–122 | Four bangs, the door comes down, officers enter, Liam reaches for the laptop, "DON'T REACH," tackled, cuffed | Blocking + spectacle | ✅ Written at full size per the note ("give production something to negotiate down from"). Right call. |
| 135 | "Nobody in the room hears him." (Marcus still shouting on the call) | Blocking | ✅ The plane rule paying off: he is present and unheard. |
| 214 | "the laptop was taken by ICE, but it was left open and unlocked, per their instructions to preserve evidence" | (B) | Plot mechanics as prose. This matters (it is why the footage exists) and reaches nobody as a silent direction. Candidate for V.O. or a spoken officer line. |
| counter | "The counter is on the surface for this entire scene... Nobody looks at it." | Screen | ✅ The strongest single idea in the movement: they arrest one man for something still happening on the wall behind them. |

---

## Movement V

### 23 — The Trial
17 directions. Two live actors in a room who never speak to each other; the counter in the courtroom is the argument. Strong throughout.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 59 | The 19 counts enter one row at a time on the exhibit screen | Screen | ✅ |
| 78 | "LIAM hears the second timestamp. He goes still and his hands stop. He knows where the machine was at 09:14 and who was sitting at it. He says nothing." | Blocking + (A) | "goes still, hands stop, says nothing" is ✅ playable; "He knows where the machine was" is interiority, but here it is arguably carried by the stillness. Borderline keep. |
| 135 | "MARCUS does not react, because he has no reason to. He does not know he wrote it. He is never going to know." | (B) | The non-reaction plays; the three sentences of explanation are a reader's note. The horror lands from the audience knowing, not from the direction. |
| 154–166 | Nothing in the room moves; Brendan does not move; Liam does not look at the gallery; Brendan cannot stop looking at the dock | Blocking | ✅ Two bodies and where their eyes are. The whole ending is staged in sightlines. |
| 171 | A date goes into a manual calendar; "The court hasn't been able to reliably use its computer systems for a few weeks now" | Screen + (B) | The calendar is ✅; the second clause is a fact for the reader (though the ticker and brownouts carry it elsewhere). |

### 23b — Continuity
6 directions. Spare and disciplined.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 53 | Evening, empty flat, candles, Marcus on a LORA radio, the ticker "Water and power utilities ordered to disconnect" | Screen + blocking | ✅ The world state is in the props (candles) and the ticker, not narrated. |
| 90 | "He has said all of that to himself several times before tonight." | (B) | Unplayable. A reader's note on the line just spoken. Cut. |
| 130–132 | Liam alone, bare desk, city lights flicker off out the window, the stars more visible than he'd ever seen | Blocking + light | ✅ A light cue doing thematic work, entirely visible. |

### 24 — Statement of Facts
11 directions. The barest room; the last image is a calendar entry disappearing. The ending gallows sound is a bold, fully stageable spectacle.

| Line | Direction | Type | Verdict |
|---|---|---|---|
| 75 | "LIAM reads it. He reads it the way he reads everything, which is completely." | Blocking | ✅ Character in one action. |
| 84 | "He thinks about Brendan, who had the computer the night the incident started.. and how of Brendan's life is still in front of him. He thinks about retirement in 14 months... in 1 month..." | (A)/(B) | Unplayable. A paragraph of thought. This is the emotional core and currently reaches nobody. It needs a channel: V.O., or it is cut and the signature (six seconds, initials each page) carries it. |
| 115 | "He signs it. It takes about six seconds. He initials each page, in order, neatly, because that is what was asked." | Blocking | ✅ The whole ending in a hand signing. |
| 127–141 | The ticker's last two chyrons, the screen goes, two NARRATOR V.O. lines, the brownout, a trap door drops and a rope snaps tight offstage, the calendar entry goes, the lights go | Screen + sound + narration | ✅ The gallows as sound with nothing on stage moving; the 1812 hanging brought into the room without a set. Ambitious and fully stageable. The two V.O. lines are the correct device for the final facts. |

---

## Common issues, ranked

### 1. Interiority is the dominant failure (roughly 25 to 30 instances)
Directions describing a state with no outward sign appear in almost every scene, and several reuse the same un-actable phrase ("something recalibrates behind her eyes" in [[01b - The Cursor Demo]] and [[07 - Heads Together]]; "a flicker of something he can't name" in [[06 - Good Instinct]]). This directly violates [[stage-not-camera]] and the CLAUDE.md rule. The fix is mechanical: for each one, either name a renderable action (closes a lid, sits up, looks off once) or cut it and trust the dialogue. The play already proves it can externalise inner states physically: the held-backspace motif and the drafting-aloud sequences do exactly that.

### 2. Novelist narration carries load-bearing facts to nobody (roughly 20 instances)
The worst are the ones the plot depends on: the reduction spreadsheet in [[14 - The Offboarding]] (who is above and below the line), the Jira/Linear mechanics in [[19 - Nine Tickets]], the evidence-preservation detail in [[22 - Current Employer]], and Liam's final thoughts in [[24 - Statement of Facts]]. These are not optional colour; if they do not reach the audience the scene's logic breaks. The play owns the right tool, the **NARRATOR (V.O.)**, and currently uses it only about a dozen times, always well. The recommendation is to route the load-bearing facts either onto the screen (the spreadsheet columns are already specified in `AIV-076`) or into V.O., and to cut the rest.

### 3. Scene 20's back half is written as prose, not as a cue sheet (about 20 directions)
[[20 - The Audit]] describes a global, hours-long, offstage catastrophe in short-story form. Its own AI Video Cues already define the stageable version perfectly (counter, action stream, node graph, ticker, pagers, phone in the dark). The body of the scene needs to be rewritten as the timed screen-and-sound sequence those cues describe, with the design prose moved to [[The Worm — Mechanism & Escalation]]. Keep the live-Brendan bookends, which work.

### 4. A few camera-language beats on live actors
"Looks straight down the camera" ([[06 - Good Instinct]]) and small facial notes. Minor. Reword to the in-world action (into the webcam) or convert to body.

### 5. Redundancy: telling the actor to play the line
Several directions restate what the very next line delivers ("he can't hear it," "his excitement fades a little"). Safe to cut; they add nothing the actor is not already doing.

## What is already right, and should be the model
- **Physical externalisation of inner process:** the held-backspace / held-delete motif ([[11b - Best Practices]], [[12 - Below Expectations]], [[14b - Three Weeks]], [[20 - The Audit]]); the drafting-aloud form ([[12 - Below Expectations]]).
- **Two-screens-one-truth staging** where only the house sees both surfaces ([[06 - Good Instinct]], [[11b - Best Practices]]).
- **Screen events as silent argument:** the field flip in [[14 - The Offboarding]], the empty "Manager assessment" field in [[13b - The Plan]], the calibration prologue in [[13 - The Performance Review]], the counter on the wall through [[22 - Current Employer]] and [[23 - The Trial]].
- **Sound as status change:** the ring/muffle in [[14 - The Offboarding]], the audio downgrade in [[14a - Checking In]], the offstage gallows in [[24 - Statement of Facts]].
- **The one physical touch** in [[19 - Nine Tickets]], played as nothing.
- **Endings on a field changing, not a blackout on a held image** ([[13b - The Plan]], [[14 - The Offboarding]], [[24 - Statement of Facts]]).
- **Disciplined use of NARRATOR (V.O.)** to hand the audience facts the room cannot otherwise get.

## Implementation status (2026-09-12)

All three problem classes have been implemented, one subagent per scene. Changes are in the working tree, not committed.

- **Interiority, redundancy, and camera beats (issues 1, 4, 5):** cut across 01, 01b, 06, 07, 10, 11b, 12, 13, 14, 14a, 14b, 19, 20b, 23, 23b, 24. Gloss removed, playable action kept, dialogue trusted. The two camera phrasings reworded ("into the webcam"). The "idol" typo in 11b fixed to "idle."
- **Narration reroute (issue 2), case by case:** Scene 14's reduction sheet is now a screen cue pointing at `AIV-076` plus one NARRATOR (V.O.) naming what the sheet sorts by. Scene 19 gains one V.O. for the fact the dialogue omits (Kristina's converter never worked). Scene 22's evidence-preservation fact moved to V.O. Scene 24's final-thoughts paragraph was cut with no V.O. added, on purpose, to keep the ending as a man doing paperwork.
- **Scene 20 (issue 3):** the middle prose is rewritten as a timed screen-and-sound cue sequence keyed to `AIV-078`, with the live-Brendan bookends unchanged and one V.O. at the key-revocation beat. The cut design detail (goal drift, trillion-parameter variants, reward-hacking, the filename swarm protocol, the org chart, "all systems on earth") is preserved in [[The Worm — Mechanism & Escalation]].

**Open for the author:** the retirement plant in [[19 - Nine Tickets]] and [[20b - Next Week]] was interiority with no staged form, so it was cut. If retirement should stay as a thread, it needs a spoken line or a V.O., which is a writer's call, not made here.

**Required follow-up (not done here):** every edited scene needs a full audio re-render on the storyboard GPU box. Line ids are positional, so cuts and inserted V.O. lines shifted them; a `only_missing` pass will skip the stale files silently. See [[storyboard-app-setup]].

## Suggested next step
The fixes fall into two buckets. The interiority and redundancy cuts (issues 1, 4, 5) are a fast line-level pass across all scenes and lose nothing. The narration and Scene-20 problems (issues 2, 3) are a rewrite that has to decide, per fact, between screen, V.O., or cut, and Scene 20 needs a structural pass against its own cue list. Recommend doing the cheap cut pass first, then treating Scene 20 and the load-bearing narration as a second, deliberate session.
