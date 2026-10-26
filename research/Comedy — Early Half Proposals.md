---
type: note
title: Comedy — Early Half Proposals
tags:
  - research
  - comedy
  - cut-pass
written: 2026-10-25
---

# Comedy — Early Half Proposals

Proposals only. Nothing here has been applied to `stage/show.json`. Timings use the play's own arithmetic from `stage/runtime.py`: live lines at 0.45 seconds a word, recorded lines at 0.36 seconds a word at 1x, stage directions untimed, montages at their fixed length. The play is at 72.9 stage minutes against a 60-minute target. The early half (s00 to s11c) is 34.5 of those minutes.

Every text change invalidates the existing recording for that cue. For the four live roles that only matters when a role is switched to playback. New or changed Narrator lines need generating through `tools/generate_elevenlabs.py`; two proposals below add one (P8, P16) and two remove one (P4, P5).

Found while reading, and worth fixing whatever else is taken:

- Kristina quotes SJ in s01b_l38 ("The thing SJ said about the code, though. Marking its own homework.") but SJ no longer says it anywhere on stage. The line that carried it was cut from s01c. P2 repairs this.
- Three private lookups on the projected screens are orphaned by earlier trims: `key-issuance` on s01c_l11 (the spoken term is gone), `john-henry` on s06_l16 (John Henry is no longer mentioned in the scene), and `cataracts` on s11b_l7 (nothing in the scene refers to small text or eyes). s01c_l13 and s01c_l14 carry screen notes describing a lookup that has no action attached. P1, P3 and P9 replace them with gags that match the lines now spoken.
- "I've got a thing at..." is already a running gag in the late half (Brendan s11c_l36, Marcus s14a_l43, SJ s22_l8 with the narrator's "SJ had no thing at eleven", Kristina s25_l17). Nothing plants it before s11c. P7 does, for nothing.

## 1. Where the laughs are now

Timestamps are seconds from the top of each scene's dialogue, from the runtime arithmetic, not from a stopwatch.

### s00 Opening montage (1.9 min, fixed)

Film. Nothing to change here.

### s01 Cold Open, The Standup (5.7 min)

What is already funny:

- s01_l3 / s01_l4: "Yeah sorry, I'm eating, so my camera's off today." / Narrator: "He's very obviously not eating." (18s)
- s01_l9: Marcus: "Dude. You worked on the weekend?" (58s)
- s01_l10 / s01_share_reply: SJ shares his screen uninvited; Kristina: "SJ, you don't need to screenshare..." (71s)
- s01_l15: Brendan: "…Well I skimmed it. But I made sure there's a really robust set of tests and I eval'ed the functionality. The whole suite's green..." (79s)
- s01_l16: "You vibecoded this, didn't you?" and s01_l18: "… SJ can we take this offline so we can get through standup?" (90s to 107s)
- s01_l22 / s01_l23: Marcus's "the government EXECUTED them" and the narrator's "Some loom smashers were executed, but only a fraction of them. Marcus often fudges history to make a dramatic point." (127s to 150s)
- s01_l24 tail: "Can you please keep your politics out of this for 5 minutes? Kristina is trying to run standup." then s01_l25: "Thanks SJ. Let's -" (168s)
- s01_l28 / s01_l31: Marcus's speech cut dead by "…Wait. Hold on. Are these, are these long-lived API tokens?" (209s)
- s01_l33 / s01_l34: "Of course the AI didn't read my memo." / "…Actually, it did. I fed your memo into Claude before I started." (240s)
- s01_l42 to s01_l47: "That's incredibly sexist", "It's fine, Marcus. Let's keep moving. SJ -", "is it fine though?" (300s to 322s)
- On the left screen throughout l19 to l32: Kristina's private ChatGPT thread ending in the unsent "Okay.... how can I get away with murdering them", then at l44 the refusal to "How to get away with murdering someone who reports to me at work". These cost nothing and are the model for the screen gags below.

Stretches with no laugh:

- s01_l5 to s01_l7, 20s to 58s (about 38 seconds). Kristina's praise for the portal, twice, and Brendan ducking it. Management warmth. The Reddit feed on SJ's screen is the only comedy running. Marcus's "You worked on the weekend?" is the release.
- s01_l35 to s01_l38, 251s to 298s (about 47 seconds). The JWT versus long-lived-keys argument: Kristina's user-test defence (45 words) and SJ's degree remark. This is the hack's setup and the scene's turn, so it should stay serious; the problem is only that SJ's line before it (s01_l19, 14s) and his scolding of Marcus (s01_l24, 18s) are longer than their jokes need.

### s01c The PR Review (2.3 min)

Already funny: "That landed like shit. I know." (s01c_l2); "You don't review it at all, is the answer!" (s01c_l13); the line-four-hundred quiz where Brendan is never allowed to answer (s01c_l13 to s01c_l19); "You're good, Brendan, you're actually good, unlike Marcus" (s01c_l21); "You'll thank me for this in five years." (s01c_l23).

No laugh: s01c_l2 to s01c_l9, 3s to 63s (about 60 seconds): the half-apology and the call set-up. It is character work the author has chosen to keep (#26 dismissed), so the proposals leave the words alone and put the laugh on Brendan's screen instead (P1).

### s01b The Cursor Demo (6.9 min including the 68-second montage)

Already funny: "I guess we all have to do that, huh." (s01b_l4, dry); "Tickets-slash-close. That doesn't exist." (s01b_l14); "…hardcode long lived credentials. Yikes that's pretty bad..." (s01b_l15); "See, I do get the security stuff." (s01b_l17); "... so I just approve it without even reading the code?" / "Yup.." (s01b_l22, l23); "…Linear...?" (s01b_l28); the small grey "…and 3 linked issues resolved." (s01b_l36, screen only); "Have you shown SJ this? ... He'd love it." (s01b_l50); "I wonder what I should have it do next!" (s01b_l57).

No laugh:

- s01b_l2 to s01b_l8, 2.5s to 100s (about 97 seconds). The HR preamble (Brendan's 42-word loyalty speech, the second-hand apology), the promotion narrator (35 recorded words), Brendan's 46-word warm-up. One dry laugh in a minute and a half, at the top of the longest scene in the half. Narration and setup.
- s01b_l38 to s01b_l46, 232s to 296s (about 63 seconds). Brendan's process walkthrough: 61 words, then 32. One mild laugh ("your brain just shuts off by line two hundred"). Demo mechanics. This is guardrail 2 material and the author has dismissed every trim to it, so the proposals do not touch it.

### s06 Good Instinct (6.7 min including the 48-second montage)

Already funny: "(flatly) Hoo - ray" (s06_l3); "Is it quick? Remember we agreed to time limits Marcus..." (s06_l6); "sweat shop workers hitting approve on Claude" (s06_l7); "Maybe you shouldn't get your lessons from the losing side of history." / "...What?" (s06_l10, l11); "OKAY!" (s06_l16); "Still on it. No blockers." (s06_l17); "It's not a burndown chart sort of thing." (s06_l19); "Fair. You're right." through her teeth (s06_l22); Narrator: "Claude finished a while ago." (cue_2d55…, 275s); "…Okay, this is probably nothing." (s06_l43); "Good instinct, kid. Seriously." / "Lucky guess." (s06_l49, l50).

No laugh:

- s06_l32 to s06_l41, 197s to 275s (about 78 seconds). SJ refuses Claude three times while, on Brendan's screen, Claude is already working. The laugh is the narrator's reveal at 275s. The irony needs the refusals, but s06_l37 (55 words, 25 seconds) is the longest of them and its last two sentences say the same thing twice. P10 shortens it so the reveal arrives sooner.
- s06_l21 to s06_l22: SJ's "sharp, but right" security line, then a 9-second narrator passage about Kristina's fists, then "Fair. You're right." The narrator stands between the setup and the punch. P5.

### s11b Best Practices (7.5 min)

This is the densest scene in the play. Standup: "I'm reviewing what AI wrote, line by line." (s11b_l3); "Marcus completed three similarly scoped tickets" (s11b_l4); "The CEO literally released a memo last week" (cue_f611…); "You were telling us to fight the machines a couple of months ago." (s11b_l7); every Kristina fragment ("Okay guys, let's try to stick to the webhook—", "SJ, Marcus. We have other updates—", "Guys, can we get back on...", "SJ, Marcus, I just want to get through the..."); "Maybe AI does do a better job than YOU, and that's the difference between US." (s11b_l18); "crappy CHINESE model on some overpriced machine" (s11b_l19); "One equals sign where there should be two." (s11b_l21); "I want it noted that I flagged it." / "Noted where, Marcus? Nobody's taking minutes." / Narrator: "Kristina takes the minutes every standup." (s11b_l30 to l32); "SJ, MARCUS!" and "Marcus! Thread." (s11b_l33, l37). Huddle: "half the price of a used car" (s11b_l44); "I wrote 'AI' on the expense report. Approved within the hour, no questions." (s11b_l46); "Two to five." (s11b_l48); "It varies." / "SJ." / "Six minutes. Sometimes eight." (s11b_l51 to l53); "…One. It's one model. What would I want two for?" (s11b_l57); "Nobody can concentrate on five tickets at once." (s11b_l59); "It was really... uh... Cool" (s11b_l73).

No laugh: s11b_l63 to s11b_l66, 366s to 432s (about 65 seconds). "Fancy autocomplete" lands at about 395s, then SJ's 55-word policy speech (s11b_l66) runs 25 seconds to Brendan's "...uh... Cool". Also SJ's opening rant s11b_l5 (64 words, 29 seconds) has three jokes in it but takes a while to reach them. P11 and P13.

### s11c The Latest Model (3.7 min including the 36-second montage)

Already funny: "It's something." (s11c_l5, 15s). After that, nothing is meant to be funny until the end: the overheard board call, "Is SJ going to be fine?", Brendan's confession about the peer review, Kristina's "good feedback to have on file". The narrator's solo build ends on "She's a little surprised how far behind SJ is."

No laugh: s11c_l12 to s11c_l37, 16s to 155s (about 140 seconds), the longest dry run in the early half. By design it is where the comedy starts to curdle, so the proposals here are the dry kind the play already uses: a machine answering plainly on a screen (P6, P14), one narrator fact (P16), one sharpened Kristina line (P17). None of them break the scene's temperature.

## 2. What the play's comedy is made of

1. **The flat narrator correction.** A character asserts something; the narrator states the fact in under ten words, with no attitude. "He's very obviously not eating." "Marcus often fudges history to make a dramatic point." "Kristina takes the minutes every standup." Late: "SJ had no thing at eleven." "It might be the first time either of them has ever touched a coworker...." The early half has three of these in thirty-four minutes. Two more are proposed (P8, P16), both in dead stretches.

2. **Kristina's fragments.** The talked-over comedy works because her interruptions get shorter and more polite as the argument gets louder: "Thanks SJ. Let's -", "Okay guys, let's try to stick to the webhook—", "Guys, can we get back on...", "Marcus! Thread." The laugh is the brevity. Any new Kristina interruption should be shorter than the one before it, never a full sentence (P19 does this with the time-limits callback).

3. **Technical specificity as grievance.** The precise number is the joke, and this audience will check it. "Eight hundred lines in one PR." "It's all in there, with diagrams." "Two to five." "Six minutes. Sometimes eight. It's reading four hundred files." "One equals sign where there should be two." "I wrote 'AI' on the expense report. Approved within the hour." Proposed lines keep to numbers and tools the play has already established (fifty thousand signups, twenty-three Linear tickets, the security policy's exact sentence).

4. **Irony the audience can read on the screens.** Claude finishing while SJ explains why it can't; the small grey "…and 3 linked issues resolved."; the murder question. The screens are the one place a joke costs no stage time, and the early half under-uses them in exactly the scenes that need laughs (s01c has one orphaned lookup, s11c has none).

5. **Marcus's history, wrong in the right places, never finished.** "the government EXECUTED them", "steam-powered looms that were unsafe to operate", "They hanged over thirty -". The allegory is the spine and is left alone here. The one Marcus-adjacent change (P12) trims SJ's reply to him, not Marcus.

6. **What the late half does that the early half does not yet.** Mundane specifics said straight ("I've got glasses. I'm not.... I do own glasses.", "What the hell is Jit SEE?", "mind the step", "Mkrtchyan. Sorry."). Institutions answering earnestly and absurdly (Dana's printed paragraph; "Mr. Ehrlich, I'll hold you in contempt"; the prosecutor reading "I honestly wonder if he is working for the CCP" into the record). And callbacks that pay off the early half ("Now that's efficiency. I wish I could run standup like that."; s25 reusing Kristina's praise word for word). The early half can borrow the first two now: the mundane escape line (P7), and the machine as the earnest institution that answers the question nobody in the room will (P3, P6, P9). That register is also how the play wants the curdle to feel later, so it does not fight the second half.

## 3. Techniques that add laughs without adding time

Each is tied to a place; the numbered proposals in section 4 carry the exact text.

- **Swap narration for a character line that carries the same fact.** s01b_narrator_promotion (motive stated by the narrator before we see her act) becomes a Kristina line with a number in it (P4). s06_narrator_security (an inner state) becomes Kristina throwing SJ's own "burndown chart" back at him (P5). Both are shorter than what they replace and both move the fact into dialogue, which is where the author has said the comedy lives.
- **Screen gags, zero runtime.** The system already renders private ChatGPT threads (`view: chatgpt`), agent sessions (`view: agent`), unsent Slack drafts (`view: message`), the PR diff with a `prFocus`, the Jira board and the Cursor plan (`stage/visuals.js`, `stage/screen-actions.js`). Six proposals use these forms only (P1, P3, P6, P9, P14, P18). Three of them replace lookups that no longer match the spoken lines.
- **Running gags from lines already there.** "I've got a thing at..." planted in s01c_l24 at the same word count (P7). "the time limits we agreed to" (s01_l2, s06_l6) returned as a two-word fragment in s11b (P19). "burndown chart" bounced from SJ to Kristina inside one exchange (P5 with P17). "Marking its own homework" restored to SJ so Kristina's quotation of it lands (P2).
- **Callbacks planted early for late payoffs.** "getting leaner" answered on a screen in s11c, then the CEO's "Building a leaner, AI-first company" in s14_l1 (P6). The connector's "1 of 23" on screen in s11c, then "Her vibe coded tool had only ever copied the test ticket" in s19_l20 (P14). "There will not be a yearly review." in s11c, then Dana in s14 (P16). "Reviewers: none" on the shared PR in s01, then "Every action in the log was taken as the defendant" in s23 (P18, loosely).
- **Silent reaction beats that read from the back row.** s01c_l20 already has Brendan stop talking; with P1 his screen is holding the answer SJ will not let him give, so the silence has something in it. s06_l50 "Lucky guess." plays against the Claude pane on his desktop; the final line of that session (`signup-background` in `stage/screen-actions.json`) currently ends on "Running isolated browser tests…". A zero-cost polish is to have it end on the diagnosis in words: "Root cause: session keyed on account id, which is 0 until the insert commits." Then the audience watches him read the dumb question off the screen.
- **Cut the setup's explanation so the payoff lands faster.** The fists narrator before "Fair. You're right." (P5). SJ's double-ended refusal before "Claude finished a while ago." (P10). SJ's "Debugging isn't a linear process" before "It's not a burndown chart sort of thing." (P17).
- **Tighten wording so the joke arrives sooner.** SJ scolding Marcus on Kristina's behalf (P12). SJ's rules rant (P11). SJ's "I'm the only one following the policy" speech, which now has no landing (P13).

## 4. Proposals

Ordered by value for seconds spent. Deltas are from the runtime arithmetic (words × rate). Screen gags are implemented in `stage/screen-actions.json` (and for P18 in `stage/visuals.js`), not in the script.

### P1. Brendan gets the line-400 answer from the machine, and SJ never lets him say it (screen, 0 s)

**Scene / cues:** s01c, Brendan's screen (right side) during s01c_l13, s01c_l14, s01c_l19. Replaces the orphaned `key-issuance` action on s01c_l11 and s01c_l12.

**Current screen action (`key-issuance`):** question "What is a key-issuance service? Explain it without using more words I have to look up." answer "It creates API keys: credentials that let another program access an API. It controls who gets a key and what that key can access." It fires two seconds into s01c_l11, which now reads "This PR is massive, Brendan. How is anybody supposed to review this?" The term it waits for is no longer spoken. s01c_l13 and s01c_l14 carry the note "Brendan privately types a question into ChatGPT while SJ speaks. Let the answer finish, then hold." with no action attached.

**Proposed screen action (new, `view: chatgpt`, side right, starts about 5 s into s01c_l13 after "Line four hundred"):**

- typed: `What does createApiKey at line 400 of my PR do? One sentence I can say out loud.`
- answer, arriving during s01c_l19: `It authenticates the partner, issues them an API key, and returns the key with the partner id.`
- hold through s01c_l20 and s01c_l21.

The function at line 400 of the projected diff is `createApiKey` (the `line400` focus in `stage/visuals.js`), and the answer matches the code on screen exactly.

**Spoken text, unchanged:** s01c_l13 "You don't review it at all, is the answer! You can't. Nobody can read this. Here. Line four hundred. This function. What does it do?" / s01c_l14 "Well... I can tell you, but -" / s01c_l19 "You don't know, because you don't read the code. You're blindly trusting this glorified autocomplete and dumping its code in our production!"

**Delta:** 0 s.

**Why it is funny, whose tic:** SJ's vanity: he asks a question, refuses the answer, and declares the silence agreement. The audience sees the answer arrive, correct, from the thing SJ is calling glorified autocomplete, while he says "You don't know". It rides guardrail 1 directly (Brendan trying to show SJ, and failing) and makes the existing stage direction at s01c_l20 ("He's realised he isn't going to get in") land with something visible.

**Sets up / pays off:** s01c_l23 "read your diffs, all of them, not the machine's summary": the summary is right there. s06, where Brendan does the same thing and gets praised for it.

**Risks:** None to dialogue or recordings. Keep the question short enough to finish typing before l19 starts (l13 is about 9.6 s of audio).

### P2. Give SJ "marking its own homework" back, so Kristina's quote of it lands (swap, −2.7 s)

**Scene / cue:** s01, s01_l19.

**Current:** "The tests pass...? The AI wrote the code and the AI wrote the tests that say the code's fine. It doesn't understand any of it, it's just a next word predictor."

**Proposed:** "The tests pass...? The AI wrote the code and the AI wrote the tests that say the code's fine. It's marking its own homework, Brendan."

**Delta:** 31 words → 25 words, live: 13.95 s → 11.25 s, **−2.7 s**.

**Why:** "next word predictor" is the generic version of the complaint; "marking its own homework" is the concrete image, and it is the one Kristina quotes back in s01b_l38 ("The thing SJ said about the code, though. Marking its own homework. He's not wrong about it, is he?"). Right now she is quoting a line the audience never heard. With it restored, her line is a callback and Brendan's answer (s01b_l46, writing the integration tests into the plan himself) is an answer to something.

**Sets up / pays off:** s01b_l38 and s01b_l46. Nothing later uses "next word predictor"; SJ's autocomplete version returns on its own in s01c_l19 and s11b_l64.

**Risks:** Low. Invalidates the s01_l19 backup recording.

### P3. Brendan pastes the security policy into ChatGPT to check whether he is breaking it (screen, 0 s)

**Scene / cues:** s11b, Brendan's screen (right side) during s11b_l5, starting after "security policy" is spoken (about 14 s in; the line's audio is 21.5 s). Replaces the orphaned `cataracts` action on s11b_l7 ("Does reading small text give you cataracts?", which no longer answers anything said in the scene).

**Spoken, unchanged (or P11's shorter version):** s11b_l5, SJ: "...Which is what our own security policy requires, in case you all forgot to read it... So I'm the only person on this call who's actually following the rules."

**Proposed screen action (new, `view: chatgpt`, side right):**

- typed: `can I paste our security policy in here so you can check if I'm breaking it`
- answer: `Yes. Paste it here.`
- typed: `Proprietary source code must not be shared with external model providers.` (the policy's one sentence, as the `policy` document in `stage/visuals.js` already shows it)
- answer: `That covers source code. Pasting the policy itself is fine.`
- hold through cue_f611… and s11b_l7.

**Delta:** 0 s.

**Why, whose tic:** Brendan's eagerness, pointed at the wrong authority. For a security audience the joke is exact: he checks whether he may share things with an external model by sharing things with an external model, and the model clears itself. It plays under SJ's "I'm the only person on this call following the rules" without anyone saying so.

**Sets up / pays off:** The policy sentence and its owner (SJ) are already on screen later in the scene (`policy` state, "Last reviewed: Fourteen months ago"). s20, where Brendan hands the model everything.

**Risks:** None to dialogue. Keep it on Brendan's side; SJ's left screen is the local-model terminal and should stay crawling.

### P4. Cut the promotion narrator; Kristina says why in one line with a number in it (swap, −13.5 s)

**Scene / cues:** s01b, s01b_narrator_promotion (cut) and s01b_l7 (rewritten).

**Current s01b_narrator_promotion (Narrator, recorded):** "Kristina thinks Brendan’s adoption of Opus might be what her team needs to outperform their peer teams. If she can get the whole team coding like Brendan, that might be her ticket to a promotion."

**Current s01b_l7 (Kristina):** "…Okay. This vibe coding stuff... It seems like when Opus 4.5 came out, people are actually making really complex stuff with it. Can you show me your setup?"

**Proposed:** cut s01b_narrator_promotion. s01b_l7 becomes: "…Okay. This vibe coding stuff. Since Opus 4.5 came out, the other managers' quarterly updates say 'AI-native'. Ours says 'stable'. Can you show me your setup?"

**Delta:** narrator 35 words × 0.36 = −12.6 s; l7 28 → 26 live words, 12.6 → 11.7 s, −0.9 s. **−13.5 s.**

**Why, whose tic:** Kristina's management-speak, and the fact that in that dialect "stable" is an insult. The motive (she is behind her peers and wants to be seen ahead) arrives as a grievance she can say out loud, which is funnier than being told she wants a promotion, and it arrives in a stretch of the play (s01b, first 100 seconds) with one laugh in it. The Opus 4.5 reference stays.

**Sets up / pays off:** s01b_l49 ("All the other teams still doing it the old way are going to be left in the dust": they say AI-native, she wants to actually do it), s11c_l17 ("very visibly ahead of the AI adoption curve"), s11c_l24, and the s25 bookend where she praises Brendan's loom in the same register.

**Risks:** Medium. The author dismissed #17 (cutting this narrator) when the line still held a joke about robots who don't argue and a quarterly-targets plan; the current text has neither, and the promotion motive is restated in s11c_l17 and s11c_l24. Guardrail 2 is untouched (the demo is intact). Removing a narrator cue needs no new recording.

### P5. Cut the fists narrator; Kristina throws "burndown chart" back at SJ (swap, −10.7 s)

**Scene / cues:** s06, s06_narrator_security (cut) and s06_l20 (rewritten). s06_l21 and s06_l22 unchanged.

**Current s06_l20 (Kristina):** "…Okay. It's just that we've only had four reports in three months... I need some sense of whether this is another day or another week."

**Current s06_narrator_security (Narrator):** "Kristina's fists clench. She absolutely hates hearing the team needs to slow down for security tickets. The team's performance is measured on feature throughput, not security."

**Proposed s06_l20:** "…Okay. It's four reports in three months, and 'security' doesn't go on my burndown chart. Is this another day or another week?"

Then s06_l21 as now (SJ: "Four people ended up logged into someone else's account. That's a big security issue. It's not a feature, it's something we have to fix immediately."), then straight into s06_l22 (Kristina: "Fair. You're right.").

**Delta:** narrator 26 × 0.36 = −9.36 s; l20 25 → 22 live words, 11.25 → 9.9 s, −1.35 s. **−10.7 s.**

**Why, whose tic:** SJ has just told her (s06_l19) "It's not a burndown chart sort of thing." She answers in his word, which is the talked-over manager getting one back, and the fact the narrator was carrying (security work doesn't count on her metrics) is now hers to say. SJ's existing "It's not a feature" then answers her directly, and "Fair. You're right." lands two seconds after his line instead of eleven.

**Sets up / pays off:** s11c_l24 (optics over output), s19_l20 ("The layoffs came down to one number: Jira tickets closed"). The grimace direction on l22 stays.

**Risks:** Medium. #38 (cut the narrator outright) was dismissed because it was the only line saying her reviews ignore security; this version keeps that fact in her mouth. "Fists clench" was internal-state prose anyway, which the house rule on stage directions discourages. Needs no new recording.

### P6. Brendan asks what "leaner" means; the machine says it (screen, 0 s)

**Scene / cues:** s11c, Brendan's desktop (left side, which currently shows only the "Huddle connected" placeholder for the whole scene) during s11c_l15, s11c_l16, s11c_l17. Start about 16 s into l15, after "getting leaner" is spoken (the line's audio is 19.8 s).

**Spoken, unchanged:** s11c_l15, Kristina: "...He said, and this is close to word for word, "Everyone your size is getting leaner this year. You can't be hesitant to just let them go, they're holding the rest of your team back"" / s11c_l16, Brendan: "Let go of... who?"

**Proposed screen action (new, `view: chatgpt`, side left):**

- typed: `when a CEO says the company is "getting leaner" what does that mean`
- answer: `Usually layoffs.`
- hold through s11c_l17 and s11c_l19.

**Delta:** 0 s.

**Why:** The scene's 140 seconds of careful talk ("let go of... who?", "I'm sure you'll be fine") against a two-word answer from the machine. It is the narrator-correction register ("He's very obviously not eating.") done on a screen, and it is the same device the play uses for its biggest laugh in s01 (the murder question). It gives Brendan's "…Is SJ going to be fine?" (s11c_l19) something behind it.

**Sets up / pays off:** s14_l1, the CEO's email "Building a leaner, AI-first company". Brendan's own calendar invite from Dana.

**Risks:** Tonal, slight. It is a dry laugh in the scene meant to start the curdle, which is the kind the play uses there. Keep the answer to two words; a longer one explains.

### P7. Plant "I've got a thing at eleven" at zero cost (running gag, 0 s)

**Scene / cue:** s01c, s01c_l24.

**Current:** "…Sure. Thanks. I've gotta get back to it."

**Proposed:** "…Sure. Thanks. I've got a thing at eleven."

**Delta:** 8 → 8 live words, **0 s**.

**Why:** The late half already runs this line four times as the universal escape hatch: Brendan "I've got a thing at half past" (s11c_l36), Marcus "I've got a thing at five" (s14a_l43), SJ "I've got a thing at eleven Marcus" with the narrator's "SJ had no thing at eleven." (s22_l8, s22_l9), Kristina "I've got a thing at eleven" (s25_l17). Nothing plants it before s11c. Said first by Brendan, flat, "reaching for the door" after SJ's "You'll thank me for this in five years", it is the mundane specific the late half is good at, and it makes the s22 narrator line a payoff of a phrase heard four times rather than once. The huddle is "About an hour after standup", so eleven is plausible.

**Risks:** None. If the author would rather keep "eleven" for SJ's s22 line, "I've got a thing at ten." is the same count. The repetition of the exact phrase is the point, though.

### P8. The narrator counts Brendan's engineers (add + trim, −1.9 s, new Narrator recording)

**Scene / cues:** s01b, s01b_l3 (trimmed) and a new Narrator cue between s01b_l3 and s01b_l4.

**Current s01b_l3 (Brendan):** "…Honestly? His comment about your degree wasn't okay. He's not a bad guy. He's thorny. He's also the best engineer I've worked with, I've learned more from him than from anyone here. You just learn to work around the edges of him."

**Proposed s01b_l3:** "…Honestly? His comment about your degree wasn't okay. He's not a bad guy. He's thorny. He's also the best engineer I've worked with. You just learn to work around the edges of him."

**New Narrator cue (recorded), after s01b_l3:** "Brendan has worked with two engineers."

Then s01b_l4 as now: "I guess we all have to do that, huh."

**Delta:** l3 42 → 33 live words, 18.9 → 14.85 s, −4.05 s; narrator +6 words × 0.36 = +2.16 s. **−1.9 s.**

**Why:** The narrator's flat-fact register, placed in the longest laughless stretch of the half (the first 100 seconds of s01b). The audience can count the team (SJ and Marcus) and will. It undercuts the loyalty speech without touching what it says, and Kristina's dry "I guess we all have to do that, huh." still answers "work around the edges". The precedent for the narrator cutting into an exchange is s11b_l32 between SJ's "Nobody's taking minutes" and Kristina's "SJ, MARCUS!".

**Sets up / pays off:** s19_l38 "My resume just shows a few months here" and s19_l1 "This is the first time SJ has met Brendan".

**Risks:** Needs a new narrator line generated. "I've learned more from him than from anyone here" goes; Brendan's regard for SJ is restated in s01b_l51 and s19. Nothing established contradicts "two" (Brendan is 24 with a few months on the resume).

### P9. Replace the stale John Henry lookup with Kristina's mute question (screen, 0 s)

**Scene / cues:** s06, Kristina's screen (left side) on s06_l16, s06_l17, s06_l18.

**Current screen action (`john-henry`):** question "Is the story of John Henry real?" answer "John Henry is a folk hero. Historians debate the person behind the legend; the famous race is not a reliably documented account." John Henry is no longer mentioned anywhere in s06 (the lines were cut under #35), so she is looking up a thing nobody said.

**Spoken, unchanged:** s06_l16, Kristina: "OKAY!  SJ. You're still on the signup race condition, yeah? Where are we with that one?" / s06_l17, SJ: "Still on it. No blockers."

**Proposed screen action (new, `view: chatgpt`, side left, start about 1.5 s into l16, after "OKAY!"):**

- typed: `can the host mute someone on Zoom without them knowing`
- answer: `You can mute participants. They see a notice that the host muted them.`
- hold through s06_l18.

**Delta:** 0 s.

**Why:** It is the s01 murder thread one standup later: she has just wrestled the meeting back from Marcus and SJ, and her private question has shrunk from murder to mute. The answer closes the door on her politely. It also matches her own time-limits line four cues earlier (s06_l6).

**Risks:** None. Side must be left; at s06_l19 the left screen switches to Brendan for the race-condition lookup, so the action should end on l18.

### P10. Shorten SJ's refusal so "Claude finished a while ago" arrives sooner (trim, −5.9 s)

**Scene / cue:** s06, s06_l37.

**Current:** "That's the whole problem, though. I can't make it fail on demand. It's one in fifty thousand signups, only under real load. There's no red test to hand it. It's just going to say it fixed the bug and be lying, same as it always does. And it'll sound completely confident while it does it."

**Proposed:** "That's the whole problem. I can't make it fail on demand. It's one in fifty thousand signups, only under real load. There's no red test to hand it. It'll tell me it fixed it. It'll be lying, and it'll sound completely confident."

**Delta:** 55 → 42 live words, 24.75 → 18.9 s, **−5.9 s.**

**Why:** Every technical fact stays (one in fifty thousand, only under real load, no red test), and so does the irony the narrator pays off two cues later (cue_2d55…: "Claude finished a while ago. It found the root cause..."). Only the doubled tail goes. The laugh is the reveal; this gets there six seconds earlier.

**Risks:** Low. #36 (cutting l36 and l37 entirely) is dismissed; this keeps both lines and both refusals.

### P11. SJ's rules rant, straight to the jokes (trim, −5.9 s)

**Scene / cue:** s11b, s11b_l5. Pairs with P3 on Brendan's screen.

**Current:** "I'm not sure what help you expect him to provide. Marcus pastes our source into 3rd party cloud hosted models and merges whatever comes back. I run mine locally AND I read what comes back. Which is what our own security policy requires, in case you all forgot to read it... So I'm the only person on this call who's actually following the rules."

**Proposed:** "Marcus pastes our source into a third-party model and merges whatever comes back. I run mine locally and I read what comes back. Which is what our security policy requires, in case you all forgot to read it... So I'm the only person on this call who's actually following the rules."

**Delta:** 64 → 51 live words, 28.8 → 22.95 s, **−5.9 s.**

**Why:** The three laughs ("merges whatever comes back", "in case you all forgot to read it", "the only person on this call who's actually following the rules") are untouched; the throat-clearing first sentence and "3rd party cloud hosted" go. SJ answering Kristina's pairing suggestion by going straight for Marcus is faster and more him.

**Risks:** Low. Inside the protected 11b standup, but nothing Kristina or Marcus says is touched.

### P12. SJ scolds Marcus on Kristina's behalf, faster (trim, −6.3 s)

**Scene / cue:** s01, s01_l24.

**Current:** "Marcus, this has nothing to do with making clothes. We are hired to write good code and vibe coding writes garbage code. Can you please keep your politics out of this for 5 minutes? Kristina is trying to run standup."

**Proposed:** "Marcus, this has nothing to do with making clothes. Can you keep your politics out of this for five minutes? Kristina is trying to run standup."

**Delta:** 40 → 26 live words, 18.0 → 11.7 s, **−6.3 s.**

**Why:** The joke is SJ, who has hijacked the standup, telling Marcus off for hijacking the standup, and then Kristina's "Thanks SJ. Let's -" being cut off again. The middle sentence (his view of vibe coding) is said in s01_l16, s01_l19, s06_l12 and s11b_l13; here it delays the punch.

**Risks:** Low. Marcus's Luddite lines on either side are untouched (guardrail 4). The exchange is inside the talked-over-Kristina comedy and this makes it tighter, not shorter in beats.

### P13. SJ's policy speech gets a landing (swap, −7.7 s)

**Scene / cue:** s11b, s11b_l66.

**Current:** "No. Were you not listening at standup? I don't give it tool calls. It writes text. I decide what the text is worth running. I had to strip it out and run the whole thing in a sandbox for security purposes. This whole thing has made me slower just to follow this new AI policy."

**Proposed:** "No. Were you not listening at standup? I don't give it tool calls. It writes text. I decide what's worth running. It's made me slower. That's what following the policy costs, and I'm the only one paying it."

**Delta:** 55 → 38 live words, 24.75 → 17.1 s, **−7.7 s.**

**Why:** The current line ends on a complaint with no shape; this ends on SJ's self-regard (s11b_l5: "the only person on this call who's actually following the rules"), which is the tic the whole huddle runs on. "Were you not listening at standup?" stays; the sandbox sentence restated "I don't give it tool calls". Brendan's "It was really... uh... Cool" follows sooner.

**Sets up / pays off:** s11c_l21, Brendan: "It's making him slower. He measured two sprints..." The audience has just heard SJ say it himself.

**Risks:** Low. #242 (a different trim of this line) was dismissed for cutting the standup joke; this keeps it.

### P14. The connector's green check on one ticket out of twenty-three (screen, 0 s)

**Scene / cue:** s11c, s11c_l39 (Narrator's solo build), Kristina's screen (left side). The right side already shows the Jira board from beat 38.

**Spoken, unchanged:** "...The other builds the Linear-to-Jira connector she promised Brendan. Her next meeting chimes, and she leaves them running. By the time it ends, both agents are done. SJ's ticket count is the lowest on the team. The connector shows Brendan's Linear tickets, and has copied a test ticket into Jira. She's a little surprised how far behind SJ is."

**Proposed screen action (new, `view: agent`, side left, two prompts typed in turn, answers held):**

- Agent 1, typed: `Pull tickets closed per engineer from Jira for the last two sprints.` answer: `Marcus 14 · Kristina 3 · Brendan 0 (no Jira tickets) · SJ 1 (billing-webhook retry)`
- Agent 2, typed: `Build a connector that copies Brendan's Linear tickets into Jira. Use the existing Vault setup.` answer: `✓ Tests passed. Linear: 23 tickets found. Jira: 1 ticket created (PROJ-TEST). Sync complete.`

**Delta:** 0 s.

**Why:** It is the s01b demo's joke again (its own tests pass; "so I just approve it without even reading the code?") played silently at the moment it starts to matter. A green check on 1 of 23 is a thing this audience has seen. "Brendan 0" on the first report is why she builds the second agent, and the second agent's report is why she never checks again.

**Sets up / pays off:** s19_l20: "Her vibe coded tool had only ever copied the test ticket. Neither of them ever knew... which is almost better." The audience knew.

**Risks:** None to dialogue; everything shown is stated by the narrator. Keep "Brendan 0" on the Jira report consistent with s19 (nine tickets in the ranking sheet is from Linear via a different path; the sheet in `stage/visuals.js` shows Brendan 9, so if that matters, show "Brendan 1" after the sync and let the "23 found" carry it). The narrator's line should not change.

### P15. SJ's burndown line lands sooner (trim, −5.4 s)

**Scene / cue:** s06, s06_l19. Pairs with P5 (Kristina's reply reuses the phrase).

**Current:** "It's a race condition, Kristina. Debugging isn't a linear process. You don't just "make progress" on one of these, you eventually find the problem, and then it's done. It's not a burndown chart sort of thing. I'm working on it."

**Proposed:** "It's a race condition, Kristina. You don't 'make progress' on one of these. You find it, and then it's done. It's not a burndown chart sort of thing."

**Delta:** 40 → 28 live words, 18.0 → 12.6 s, **−5.4 s.**

**Why:** "Debugging isn't a linear process" is the abstract version of the three sentences after it. The joke is "burndown chart", and ending on it sets up Kristina's reply in P5.

**Risks:** Low. #231 (cutting the exchange) was dismissed for losing exactly this line; this keeps it. The `race-condition` lookup on Brendan's screen during this line has less time to run (12.6 s instead of 18); its steps total about 9 s, so it still fits.

### P16. "There will not be a yearly review." (add, +2.5 s, new Narrator recording)

**Scene / cues:** s11c, a new Narrator cue between s11c_l35 and s11c_l36.

**Current s11c_l35 (Kristina):** "No, that's good feedback to have on file, but sometimes shifts take a bit of time. He shipped the webhook thing. Give him the quarter to get up to speed on everything and it'll all even out on his yearly review."

**New Narrator cue (recorded):** "There will not be a yearly review."

**Then s11c_l36 as now (Brendan):** "Yeah. I've got a thing at half past. Thanks, Kristina."

**Delta:** +7 words × 0.36 = **+2.5 s.**

**Why:** The one narrator fact in the scene, in the register of "SJ had no thing at eleven." It turns the dread the board call has already planted into the play's kind of laugh, and Brendan's exit line (itself the running gag) follows it immediately.

**Sets up / pays off:** s14. Also s23_l33, where the "feedback on file" is read into the record.

**Risks:** Medium, tonal. It tells the audience a layoff is coming before s14; the overheard board call already does, and the play's narrator is allowed to know things. If the author prefers the scene to stay fully straight, drop this one; the tally does not need it.

### P17. Kristina on what leadership reads (swap, −1.8 s)

**Scene / cue:** s11c, s11c_l24.

**Current:** "Honestly to some extent it just looks good that our team is doing new AI things, even if they're experiments that don't go anywhere."

**Proposed:** "Honestly? Leadership doesn't read velocity. They read the slide. The slide says 'local model, Mac Studio'. It's a great slide."

Shorter alternative without the tag: "Honestly? Leadership doesn't read velocity. They read the slide, and the slide says 'local model, Mac Studio'." (17 words, −3.2 s.)

**Delta:** 24 → 20 live words, 10.8 → 9.0 s, **−1.8 s.**

**Why:** Same point she already makes (optics over output), made concrete: the Mac Studio the audience watched crawl in s11b is, upstairs, a slide. "Leadership doesn't read velocity" is also wrong, which s11c_l39 (she checks velocity herself an hour later) and s19_l20 (the layoffs are a velocity number) pay off.

**Sets up / pays off:** s14a_brendan_demo: "The CEO was on. He put a fucking rocket emoji in the chat. A month later I'm fired."

**Risks:** "It's a great slide." is the one line in this note that could read as a manufactured tag; it is in her bright voice, but the alternative is given.

### P18. The shared PR says who reviewed it (screen, 0 s)

**Scene / cues:** s01, the shared PR on SJ's screen from s01_l10 through s01_l17. A change to the `pr()` header in `stage/visuals.js`.

**Current header:** "Launch partner developer API · Merged · Brendan merged into main · +812 −4".

**Proposed header, one line added under the title:** "Reviewers: none · Checks: 212 passed · Co-authored-by: Claude" and, in the description panel, the standard Claude Code trailer line that this audience recognises.

**Spoken, unchanged:** s01_l12, SJ: "Hang on. This shipped? Eight hundred lines in one PR. Who reviewed this?" / s01_l15, Brendan: "…Well I skimmed it. But I made sure there's a really robust set of tests and I eval'ed the functionality. The whole suite's green..."

**Delta:** 0 s.

**Why:** SJ asks "Who reviewed this?" with the answer on a projected screen two metres wide. "Checks: 212 passed" is Brendan's defence before he makes it. Precise, checkable, zero words.

**Sets up / pays off:** s01c_l23 "read your diffs, all of them, not the machine's summary." s23, where the logs are read as the whole truth.

**Risks:** None. Keep it to one line so the diff stays the focus when `prFocus` switches to the tokens at s01_l31.

### P19. Kristina's time-limits fragment (running gag, −0.5 s)

**Scene / cue:** s11b, s11b_l27.

**Current:** "Guys, can we get back on..."

**Proposed:** "Guys, the time limits we..."

**Delta:** 6 → 5 live words, 2.7 → 2.25 s, **−0.5 s.**

**Why:** s01_l2 ("I'd like to remind you all of the time limits on updates we agreed to last time") and s06_l6 ("Remember we agreed to time limits Marcus...") set it up; by the third standup she cannot get as far as "agreed". The fragment gets shorter each time, which is how her interruptions already work.

**Sets up / pays off:** s23_l30: "Now that's efficiency. I wish I could run standup like that."

**Risks:** None. Inside the protected standup; the talked-over beat is kept, only the words change.

## 5. Tally

| # | Proposal | Kind | Delta (s) |
|---|---|---|---|
| P1 | Line-400 answer on Brendan's screen | screen | 0.0 |
| P2 | "marking its own homework" restored to SJ | swap | −2.7 |
| P3 | Policy pasted into ChatGPT | screen | 0.0 |
| P4 | Promotion narrator → "Ours says 'stable'" | swap | −13.5 |
| P5 | Fists narrator → "doesn't go on my burndown chart" | swap | −10.7 |
| P6 | "getting leaner" → "Usually layoffs." | screen | 0.0 |
| P7 | "I've got a thing at eleven." planted | running gag | 0.0 |
| P8 | "Brendan has worked with two engineers." + l3 trim | add + trim | −1.9 |
| P9 | Mute lookup replaces John Henry | screen | 0.0 |
| P10 | s06_l37 refusal shortened | trim | −5.9 |
| P11 | s11b_l5 rules rant shortened | trim | −5.9 |
| P12 | s01_l24 scolding shortened | trim | −6.3 |
| P13 | s11b_l66 gets a landing | swap | −7.7 |
| P14 | Connector "1 of 23" green check | screen | 0.0 |
| P15 | s06_l19 burndown line shortened | trim | −5.4 |
| P16 | "There will not be a yearly review." | add | +2.5 |
| P17 | "It's a great slide." | swap | −1.8 |
| P18 | PR header "Reviewers: none" | screen | 0.0 |
| P19 | "Guys, the time limits we..." | running gag | −0.5 |
| | **All nineteen** | | **−59.6** |

Six screen gags at zero runtime (P1, P3, P6, P9, P14, P18). Five net-negative swaps (P2, P4, P5, P13, P17) plus four trims (P10, P11, P12, P15). Two additions (P8 net negative with its trim; P16 the only positive).

**Recommended first pass (nets −46.8 s):** P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P14. These are the ones that fix something already broken (P1, P2, P3, P9), move a fact out of narration (P4, P5), or make a joke land sooner without touching anything the author has dismissed. P8 is the only one in the set that needs a new narrator recording.

**Second pass if wanted (a further −12.8 s):** P13, P15, P17, P18, P19, and P16 if the s11c temperature can take it.

Nothing here touches the four guardrails: Brendan still shows SJ in s01c and s06 (P1 makes that beat more visible), the Cursor demo and the solo build are unchanged (P14 only shows what the narrator says), every talked-over Kristina beat survives (P19 keeps the beat and shortens the words), and no Marcus line is cut or trimmed.

## 6. Outside reference, brief

- **Office Space (Mike Judge, 1999).** The comedy of process said sincerely: Lumbergh's "If you could go ahead and..." and the TPS-report cover sheet that eight bosses each mention separately; Peter's "in a given week I probably do about fifteen minutes of real, actual work." What this play can borrow: the number said straight (P4's "six times", P14's "1 of 23"), and management warmth delivered with full sincerity right before the knife, which Kristina already does.
- **Silicon Valley (HBO, 2014 to 2019).** Jargon as character: Jared's HR-speak, Gilfoyle's deadpan, the TechCrunch Disrupt montage of founders who all promise to "make the world a better place" through some transport layer, and Richard ending a relationship over tabs versus spaces. What to borrow: the technical argument that is correct and ruinous at the same time (SJ's JWT memo is this already), and letting a pedant be right in public and lose anyway.
- **The Thick of It (BBC, 2005 to 2012).** Overlapping, interrupting dialogue; a minister (Hugh Abbot, then Nicola Murray) managed by her own advisers and never allowed to finish a policy sentence; Malcolm Tucker's "omnishambles". What to borrow: the person nominally in charge being the one who gets the least airtime. The play has this in Kristina; the proposals make her fragments shorter rather than giving her speeches.
- **W1A (BBC, 2014 to 2017).** A deadpan narrator who states plainly what the meeting is failing to say, and characters who speak only in buzzwords and tic-phrases ("Yeah, no, cool"; "The fact is...") so that decisions never happen. What to borrow: the narrator-as-fact-checker, which is the play's best device already (P8, P16), and management vocabulary used with total sincerity ("AI-native", "stable", "a great slide").
- **Clarke and Dawe, "The Front Fell Off" (1991).** John Clarke as a senator explains an oil-tanker disaster to Bryan Dawe's straight interviewer with complete confidence and no information ("Well, the front fell off." "That's not very typical, I'd like to make that point."). What to borrow: the confident wrong answer and the straight man who keeps asking. Marcus's history and SJ's "It varies." / "SJ." / "Six minutes." are this; the ChatGPT answers in P3 and P6 are the machine playing the senator.
- **Flight of the Conchords, the band meetings.** Murray takes the roll at every meeting of a three-person band ("Bret?" "Present." "Jemaine?" "Present." "Murray? Present."), reads the minutes, and applies the full procedure of an organisation to two men on a sofa. What to borrow, for a New Zealand audience especially: the officious ritual of a tiny meeting. Kristina's time limits, minutes and "nicely styled report every week" are already this; P19 and P9 keep feeding it.
