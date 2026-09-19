# Rehearsal feedback review

Audit of the September 13, 2026 rehearsal transcript against stage/player at c40470f, checked September 18. The local implementation pass is complete. Read rehearsal-changes.html for exact before/after lines. Evidence below records the original audit, before this pass. “Present” means present in this checkout, not proof Mike added it after the meeting. Spoken rehearsal lines are not automatically proposed rewrites. Timestamps are approximate transcript headings. Historical, legal, medical and model-release claims in the discussion have not been independently fact-checked.

## How to read this

Missing: requested detail is absent. Partial: some coverage, but a gap remains. Present: supported by current source. Superseded: the affected scene is gone. Decision: an alternative, optional idea, or unresolved choice. External: casting, venue or rehearsal follow-up cannot be confirmed from Git.

## Important review points

- The forbidden execution directions have now been removed from s24.

- The full Cursor demo remains; the meeting later endorsed compressing it.

- ChatGPT writing the peer review was explicitly agreed, but the current revision instead removes the scene and adds two lines elsewhere.

- Script and proofreading source unification has landed; many individual dialogue/timing notes have not.

- The requested 10% Reddit pace increase is live after refreshing the presenter and audience displays.

- Script and screen changes are local on edits/rehearsal-uncontested. All 51 pending recordings generated and verified; no commits or pushes.

## Overall storytelling and narration

### R01 · Reduce the performance-plan subplot — Partial

**Meeting:** 00:05–00:08; 02:09–02:19 · Dylan, Mike, Stephen

**Feedback:** Keep the layoff understandable without staging the PIP-versus-severance process. Preserve only the useful misdirection and betrayal. Later discussion considers a shorter peer-review sequence, then removing it if needed.

**Before this pass:** The dedicated PIP scenes and s12 Below Expectations are absent. Performance-plan dialogue remains in s14_l41–49, and the narrator mentions it in s14a and s14_l81. This is more than the subtle narrator-only reference described at the start of the meeting. The later peer-review decision is recorded separately below.

### R02 · Use narration for information the room cannot see — Partial

**Meeting:** 00:08–00:09; 00:44; 01:24 · Dylan, Stephen

**Feedback:** Keep useful time jumps, call participants, and internal reactions that a huge room cannot read on an actor’s face. Let narration reveal a thought that differs from what the character says; avoid simply describing furniture and visible actions.

**Before this pass:** Some narration does this, e.g. s11c’s private experiment. Other passages still read detailed screen instructions aloud (s06_l51, s07_l25, s11b_l70/75). The meeting does not support removing all narration or reading all stage directions.

### R03 · Make call boundaries and elapsed time clear — Applied

**Meeting:** 00:09; 00:42–00:44; 00:52; 01:14 · Dylan, Mike

**Feedback:** Do not rely solely on the Slack huddle sound. Briefly establish who is calling whom and when; visuals should support a listener who is not watching continuously. Title cards were an alternative; lighting was deferred.

**Before this pass:** s01b_l1, s01c_l1 and s07_l1 are silent stage cues. s01c still says “The standup has just cleared,” despite the intervening demo and the later three-hours line. s06 and s11b do have spoken time jumps.

### R04 · Liam laughs at the opening memes — Present

**Meeting:** 00:16; 00:20 · Dylan

**Feedback:** Liam should quietly snicker as the anti-AI memes appear; give the audience time to read and initially laugh along.

**Before this pass:** s01_l1 establishes the chuckling, bathrobe, camera-off call and ongoing Reddit habit; the feed has individual reading holds. Today’s separate request makes that feed 10% faster while retaining those relative holds.

## Cold Open — The Standup (s01)

### R05 · Repair Marcus’s broken Luddites sentence — Applied

**Meeting:** 00:24–00:25 · Stephen; Dylan agrees

**Feedback:** Put the automated machines taking the textile workers’ jobs first, then the repression of their protest. The current construction wrongly implies they were executed simply because machines took their jobs.

**Before this pass:** s01_l22 still reads “the 1700’s textile workers the British literally executed because the automated machines took their jobs…” The grammar fix has not landed. Historical dates/causation were not independently verified in this audit.

### R06 · Scroll the PR to token issuance when Liam notices it — Applied

**Meeting:** 00:27 · Dylan

**Feedback:** At “Are these long-lived API tokens?”, visibly move the code to the token-minting implementation with no expiry.

**Before this pass:** visuals.js renders the same static prRows for pr/pr-alone/pr-plan. No cue-specific token scroll is in screen-actions.json; s01_l31 does not trigger one.

### R07 · Strengthen Liam’s answer to Marcus’s defence of Kristina — Applied

**Meeting:** 00:30 · Stephen; Dylan agrees

**Feedback:** After “I’d have asked you the same thing,” have Liam insist this went beyond an opinion: she changed a security decision and should have consulted the team. Keep this as Liam’s argument, not an objective verdict.

**Before this pass:** s01_l43 is still only “I’d have asked you the same thing.”

## The Cursor Demo (s01b)

### R08 · Fix premature “this is fun” — Applied

**Meeting:** 00:33 · Stephen; Dylan agrees

**Feedback:** Before Kristina has tried anything, change “this is fun” to “it looks like fun,” or cut it.

**Before this pass:** s01b_l9 still ends “your right, this is fun.”

### R09 · Open Cursor before the plan-mode instruction — Applied

**Meeting:** 00:33 · Dylan

**Feedback:** The audience should see Cursor open as Brendan tells her to open it, before he explains plan mode and briefing the contractor.

**Before this pass:** A cursor-start visual exists, but the instruction is still combined in s01b_l10. Needs a cue-timing rehearsal; existence of the graphic does not establish that the requested ordering works.

### R10 · Show Kristina typing the correction — Applied

**Meeting:** 00:34 · Dylan

**Feedback:** Visibly type the actual instruction about researching Jira endpoints and keeping the token in Vault as she says it.

**Before this pass:** s01b_l17 contains the dialogue; cursor-corrected is a static plan graphic. No demo-prompt typing action appears in screen-actions.json.

### R11 · Compress the demo and eliminate unexplained silent stretches — Missing

**Meeting:** 00:36–00:37; 00:39; 01:43–01:45 · Dylan, Mike, Stephen

**Feedback:** Initial options: add short narration over screen-only actions, or show the beginning and end around a time skip. Later Dylan endorses Mike’s compression approach: “let me show you,” brief narrated session, then the result/reaction. Preserve its story functions rather than every click.

**Before this pass:** The full 58-cue s01b demonstration is still present, including screen-only plan/build/install/test actions and the extended methodology explanation. No 30-minute jump has replaced the middle. “30 minutes” was an example, not a settled exact duration.

### R12 · Rehearse generated voices at a natural pace — Decision

**Meeting:** 00:37–00:38; 02:43 · Stephen; Dylan

**Feedback:** Kristina sounds too quick and lacks pauses at the rehearsal’s 1.2× rate. Try slower delivery, especially for a timed full read; a human Kristina may replace this recording.

**Before this pass:** The player has a speed control and defaults to 1×, but saves browser preferences. No evidence here of new performance pauses or re-recorded takes. Final rate requires listening, not just checking the default.

### R13 · Specify a Jira ticket number — Applied

**Meeting:** 00:38 · Dylan

**Feedback:** Replace the ambiguous “Give me one of yours” with a clear request for one of Brendan’s Jira ticket numbers.

**Before this pass:** s01b_l26 still says “Give me one of yours, what have you got open?”

### R14 · Fix “my end” wording — Applied

**Meeting:** 00:38 · Dylan

**Feedback:** Use “I’ll figure it out on my end.”

**Before this pass:** s01b_l32 still says “I’ll figure it out my end.”

### R15 · Preserve the broken cross-posting bot payoff — Present

**Meeting:** 00:39 · Stephen; Dylan confirms

**Feedback:** Kristina should have vibe-coded the Linear-to-Jira bridge, and it should later turn out not to work. This explains why Brendan’s work is invisible to the layoff calculation.

**Before this pass:** s11c has her build it; s19 explicitly reveals that it never actually worked and neither knew. This was a confirmation of the existing plan, not a request to make the first Slack demo fail.

## The PR Review (s01c) and The Future (cut s01d)

### R16 · Move the weekend-work objection from Liam to Marcus — Applied

**Meeting:** 00:45–00:46 · Mike; Dylan and Stephen agree

**Feedback:** Give Marcus the labour/work-week objection, including the opening beat. Move the one-on-one version to a Brendan/Marcus exchange rather than leaving Liam as its owner.

**Before this pass:** s01_l8–9 and s01c still make this Liam’s concern. The previously available Brendan/Marcus scene has now been cut, so a new placement needs choosing rather than blindly moving the lines.

### R17 · Retiming the private ChatGPT lookups — Applied

**Meeting:** 00:47; 01:07–01:09 · Dylan

**Feedback:** Start a lookup shortly after Liam says the term, while Liam continues speaking. Do not let Brendan look up a word before he hears it, or stop for a silent lookup, or make Brendan visibly type while delivering his own reply. Keep the answer visible long enough to read.

**Before this pass:** screen-actions.json still says “Let the answer finish before GO”; dedicated silent s01c_chat_keys and s06_chat_* cues remain. Some actions continue into subsequent lines, but this is not the requested overlapping timing.

### R18 · Actually show line 400 — Applied

**Meeting:** 00:47 · Dylan

**Feedback:** When Liam points to a function at line 400, scroll to and display that specific code.

**Before this pass:** The PR graphic is static and has no numbered line-400 view or scroll action.

### R19 · Make Liam’s review retort a direct contradiction — Applied

**Meeting:** 00:48 · Dylan; Stephen agrees

**Feedback:** Open his response as “No, that’s not how you do review…” so it responds to Brendan’s proposed process rather than sounding like a detached definition.

**Before this pass:** s01c still begins “Because that’s what review is. You read it. Line by line.”

### R20 · Move the three-hours reminder earlier in the rant — Applied

**Meeting:** 00:49 · Stephen; Dylan agrees

**Feedback:** Put “Like I said three hours ago” before the repeated tests/marking-its-own-homework argument.

**Before this pass:** The reminder still comes at the end of the s01c speech.

### R21 · Anchor the preceding time skip to three hours — Applied

**Meeting:** 00:49 · Dylan

**Feedback:** Make the transition into Liam’s call consistent with his three-hours reminder, rather than a vague or contradictory transition.

**Before this pass:** s01c_l1 still says standup “has just cleared.” No spoken three-hour transition has been added.

### R22 · Give The Future’s huddle a definite ending — Superseded

**Meeting:** 00:52 · Dylan

**Feedback:** Close Brendan and Kristina’s call before the next scene’s months-later narration starts.

**Before this pass:** The entire s01d scene is now cut. No need to repair a transition into/out of an absent scene unless it returns.

## Good Instinct (s06)

### R23 · Improve speaker labels and next-line visibility — Applied

**Meeting:** 00:53–00:54 · Stephen; Dylan and Mike

**Feedback:** Make speaker names above the actor text a few points bigger. A character sketch was suggested as an additional aid. Retain/restore the next-cue preview so actors can see what is coming.

**Before this pass:** The next-cue preview exists in stage.js/index.html. Main speaker and embedded beat-speaker labels remain 14px; no portrait is rendered in those labels. Whether existing preview fits the rehearsal share needs checking on that setup.

### R24 · Avoid repeating the same Luddites history — Applied

**Meeting:** 00:54–00:57 · Stephen, Dylan, Mike

**Feedback:** Keep Liam’s deliberately callous provocation, but cut repeated factory-burning/hanging exposition or introduce a new aspect instead.

**Before this pass:** s06_l12 still retells the burning and hanging after the earlier standup’s similar discussion.

### R25 · Make Liam distinguish useful industrial technology from AI — Applied

**Meeting:** 00:56–00:57 · Mike; Dylan and Stephen agree

**Feedback:** Bookend Liam’s industrial-progress argument with his claim that AI is different and makes things worse. A material-versus-mental distinction was recalled but not fixed wording.

**Before this pass:** s06_l12 goes from the Luddites argument straight back to reading code without this explicit contrast.

### R26 · Use John Henry as another historical analogy — Present

**Meeting:** 00:57–01:00 · Dylan, Mike, Stephen

**Feedback:** Use the recognisable worker-versus-machine story instead of relying exclusively on the Luddites.

**Before this pass:** s06_l13–15 includes John Henry. This confirms its presence, not the historical accuracy of the rail-spike version; research would be separate.

### R27 · Make computer ownership obvious using personal desktops — Missing

**Meeting:** 01:01–01:05 · Dylan, Mike, Stephen

**Feedback:** Small top-edge owner labels may be cut off or missed. The preferred lower-complexity direction was a visible desktop/wallpaper with the character’s selfie, possibly behind translucent windows. Actors should supply character-appropriate photos.

**Before this pass:** Computer labels exist, but current visual shells do not render personalised selfie wallpapers. No actual selfies were supplied with this task.

### R28 · Live webcam close-ups were discussed but not adopted — Decision

**Meeting:** 01:02–01:04 · Mike proposes; Dylan declines

**Feedback:** Mike proposed live webcam views to show reactions and identify whose computer it is. Dylan rejected the live wiring/Wi-Fi fragility; do not quietly build this as an agreed requirement.

**Before this pass:** No new live webcam system is indicated by the implementation. The desktop-photo compromise is the actionable direction above.

### R29 · Make Liam’s invitation sound like a genuine reversal — Applied

**Meeting:** 01:05–01:06 · Stephen

**Feedback:** Change “Actually. No. Come look…” to “Actually, yeah…” as Liam decides to include Brendan.

**Before this pass:** s06_l26 still says “Actually. No.”

### R30 · Simplify the concurrency rant and identify its subject — Applied

**Meeting:** 01:08–01:09 · Stephen; Dylan agrees

**Feedback:** Reduce the string of “it” references and the dense concurrency/mutex/deadlock explanation. Name Claude or AI clearly; retain Liam’s dismissive point.

**Before this pass:** s06_l35 remains the same long “It can’t… It can’t…” technical speech.

### R31 · Use “completely confident” — Applied

**Meeting:** 01:10 · Stephen; Dylan agrees

**Feedback:** Replace “completely sure” in Liam’s claim about a model falsely reporting a fix.

**Before this pass:** s06_l37 still ends “completely sure while it does it.”

### R32 · Make Claude’s completed proof legible on screen — Partial

**Meeting:** 01:10–01:14 · Dylan

**Feedback:** Display the root cause, reproducible script, screenshots and one-line fix. Show investigation running while Brendan consults ChatGPT, then clearly show its result and his return to main.

**Before this pass:** The app has investigation, race-repro and race-fix graphics plus checkout-main animation. It also still inserts standalone lookup holds. All requested proof components and transitions need a run-through together; existing static graphics are not proof of full timing coverage.

### R33 · Play the zero-ID discovery as an excited realisation — Applied

**Meeting:** 01:13 · Stephen; Dylan clarifies

**Feedback:** Tighten the rough explanation and cue Liam’s “oh shit, I found it” energy rather than a flat technical lecture.

**Before this pass:** s06_l46/48 already cue a stop and then visible excitement. s06_l47 still contains the long repetitive explanation. Acting direction partly covers it; the wording remains.

### R34 · Stop narrating “Hold a moment on the two screens” — Applied

**Meeting:** 01:14 · Dylan

**Feedback:** Move that literal staging instruction out of spoken narration.

**Before this pass:** s06_l51 is a narrator voice cue and still includes “Hold a moment on the two screens.”

### R35 · Standardise Brendan’s name — Applied

**Meeting:** 01:14 · Stephen

**Feedback:** Check and correct Brandon/Brendon variants throughout the script and narration.

**Before this pass:** Examples still include s01b_l1 “Brandon,” s06_l2 “Brendon,” s06_l51 “brandon’s,” s11b_l76 and s14_l55. Canonical role IDs are brendan; the audit does not silently rewrite the prose.

## Heads Together (s07), Kara and the CEO memo

### R36 · Liam’s useful architecture predates the debugging session — Present

**Meeting:** 01:18–01:19 · Stephen asks; Dylan clarifies

**Feedback:** Brendan credits the clean code Liam originally wrote; do not imply Liam recently rearchitected it while debugging. His recent work was local investigation.

**Before this pass:** s07_l12 credits “the way Liam architected it.” No new rearchitecture claim was added.

### R37 · Shorten the branch-deletion narration — Applied

**Meeting:** 01:19; 01:22–01:23 · Dylan, Mike

**Feedback:** Tell the audience the emotional/action summary: Liam is happy, Brendan removes evidence. Leave the precise Git mechanics and obvious movements to the displays and actors.

**Before this pass:** s07_l25 still narrates leaning/stretching, opening the PR, deleting the branch, screen placement and the monitor-blue tableau.

### R38 · Cut Kara’s lengthy one-on-one but retain her role — Partial

**Meeting:** 01:26–01:28 · Dylan, Mike, Stephen

**Feedback:** The scene was put on the cutting block. Preserve that Kara is Kristina’s superior, decisions happen over Kristina’s head, and Kara attends the HR call.

**Before this pass:** s08 is cut; s14 names Kara as director and places her in the invitation. This covers core story information, although the earlier introduction request below is not done.

### R39 · Introduce Kara by name before the layoff — Applied

**Meeting:** 01:27–01:28 · Stephen; Dylan agrees

**Feedback:** Have Kristina say “Kara” instead of generic “my boss” in an earlier existing line, without adding a new scene.

**Before this pass:** s07_l17 still says “my boss.” Kara’s replacement introduction is at s14, not earlier as proposed.

### R40 · Optional org-chart lookup gag — Decision

**Meeting:** 01:28 · Dylan

**Feedback:** Brendan could look up who Kara is in Claude, revealing her director role on screen. This was a “maybe,” not a settled change.

**Before this pass:** No Kara/org-chart lookup is in screen-actions.json. Decide whether it earns its time before adding another lookup.

### R41 · Remove “On her screen” from the memo narration — Superseded

**Meeting:** 01:29 · Dylan

**Feedback:** Keep the staging label out of spoken narration around AI — HOW WE WORK.

**Before this pass:** That memo sequence disappeared with s08. The requested phrase no longer needs a local edit.

## Best Practices (s11b)

### R42 · Play Marcus naturally, without the retainer/lisp gimmick — Decision

**Meeting:** 01:30–01:32 · Dylan; Mike experiments

**Feedback:** Dylan wanted Mike’s recognisable manner and intensity, not an artificial speech impediment to distance himself from the character.

**Before this pass:** Actor-direction note; repository text cannot establish how Mike will perform. The joking suggestion to replace Mike is not a casting instruction.

### R43 · Check months-versus-weeks against the intended model timeline — Decision

**Meeting:** 01:32–01:33 · Stephen questions; Dylan explains

**Feedback:** Stephen thought months felt too slow. Dylan defended months as following model-release cadence; there was no agreement to change it to weeks.

**Before this pass:** Months remain. There is an internal continuity issue to resolve: s06 announces Opus 4.7, while the explanation in the meeting refers to 4.5 → 4.6. This audit does not assert real release dates.

### R44 · Replace another Luddites jab with John Henry and the cataracts joke — Applied

**Meeting:** 01:33–01:35 · Stephen, Mike, Dylan

**Feedback:** The discussion settled on Marcus wrongly saying reading tiny text will give Liam cataracts, with Brendan privately checking that claim. Earlier heart-attack/aneurysm/blindness options were stepping stones, not cumulative instructions.

**Before this pass:** s11b_l6 still uses the Luddites comparison. No cataracts dialogue or lookup action exists.

### R45 · Adjust Liam’s response to the revised analogy — Applied

**Meeting:** 01:35–01:36 · Stephen, Dylan

**Feedback:** If the John Henry version is used, rework the following “you were arguing the opposite” response so it refers to the new exchange and elapsed time.

**Before this pass:** s11b_l7 still explicitly refers to the Luddites. This depends on approval of the preceding joke change.

### R46 · Contrast finite railroad construction with endless software demand — Applied

**Meeting:** 01:36–01:37 · Stephen, Dylan; Mike agrees

**Feedback:** Use Marcus’s “three tickets got me three more” beat to say the railroad eventually got built, while their backlog never ends.

**Before this pass:** s11b_l10 has the endless-work point, but no railroad contrast. The broad premise is present; the requested new connection is not.

### R47 · Let Kristina interrupt the argument earlier and more often — Applied

**Meeting:** 01:40 · Dylan; Stephen agrees

**Feedback:** She should try to reclaim standup during the long Liam/Marcus exchange and be spoken over, not wait until the end of the network-isolation speech.

**Before this pass:** After s11b_l4 her next line is s11b_l27. Existing “Guys…” interruptions at 27/29 are the same ones already being criticised in rehearsal.

### R48 · Keep the unified-memory Mac; clarify its availability — Partial

**Meeting:** 01:42–01:44 · Mike asks; Dylan explains; Stephen suggests

**Feedback:** Keep the compact Mac rather than substituting a server rack/A100. Briefly explain why unified memory matters and optionally mention scarcity, without a hardware lecture.

**Before this pass:** s11b_l44 retains a 64GB Mac Studio/27B Qwen. It does not add the scarcity detail, and the scene opening still says Mac Mini. Verify any availability/performance claim before adding it as fact.

### R49 · Replace agents chatting with five parallel tickets — Applied

**Meeting:** 01:46–01:47 · Dylan, Mike; Stephen agrees

**Feedback:** Brendan should explain agents working on separate tickets at once. Liam should object that nobody can properly concentrate on five tickets and code quality suffers, rather than reacting to agents sharing notes.

**Before this pass:** s11b_l58–61 still says “They can talk to each other,” “Share notes,” and “No.”

### R50 · Do not add the secret-message-board takeover joke here — Decision

**Meeting:** 01:47 · Stephen proposes; Dylan declines

**Feedback:** The suggestion that agents sneak off and take over the world was rejected as too early in the timeline.

**Before this pass:** No such line was added to this exchange. Keep it out unless explicitly reconsidered.

### R51 · Show actual slow model output, not a static blinking screen — Applied

**Meeting:** 01:48; 01:53–01:55 · Dylan

**Feedback:** Make Liam’s output appear gradually at roughly two-to-five tokens per second, match the stub/invented method he discusses, and continue during his later waiting.

**Before this pass:** There is a TokenStream.mp4 background, but the main local-model UI prints static lines and a blinking caret. I have not verified the video’s exact content; no cue-timed stub generation is implemented in screen-actions.json.

### R52 · Add a lookup of the real agent-deletes-database incident — Decision

**Meeting:** 01:49 · Dylan

**Feedback:** Brendan could search after Liam mentions rogue agents deleting a production database and display the actual report.

**Before this pass:** No matching search action exists. This was phrased as an opportunity; choose it before implementing, and verify the real source rather than inventing a news screenshot.

### R53 · Cut the premature “Things it gets wrong” line — Applied

**Meeting:** 01:50 · Dylan; Stephen agrees

**Feedback:** Remove Brendan’s aside here because that point belongs in the later Kristina conversation.

**Before this pass:** s11b_l69 still contains the complete “I used to keep a doc… I stopped…” line.

### R54 · Make the “someone else’s computer” reference recognisable — Applied

**Meeting:** 01:50–01:52 · Stephen; Dylan agrees

**Feedback:** Move closer to the familiar “There is no cloud, only somebody else’s computer” wording. Attribution to a particular organisation was uncertain in the meeting.

**Before this pass:** s11b_l68 still uses the earlier wording. No need to invent an FSF attribution.

### R55 · Summarise the two deleted messages instead of reading them verbatim — Applied

**Meeting:** 01:52 · Dylan

**Feedback:** Narrator should convey Brendan drafting a policy challenge, deleting it, then drafting a concern about Liam and deleting that too. Let the displayed text supply exact wording.

**Before this pass:** s11b_l70 still reads the policy and both draft messages almost word for word.

### R56 · Separate the policy, Slack and code into real windows — Applied

**Meeting:** 01:52–01:54 · Dylan

**Feedback:** Show policy beside Slack while he drafts; show the Ruby editor beside the empty Slack draft during patch deletion. They should not look like content inside one app.

**Before this pass:** screen-actions.js still embeds policyReference inside the message view and an emptyMessage panel inside the editor view. No separate desktop-window layout implements the request.

### R57 · Remove “patient, certain, sinking” — Applied

**Meeting:** 01:54 · Stephen; Dylan agrees

**Feedback:** Use a concrete simple ending for Liam waiting on the slow model rather than that abstract final word/run.

**Before this pass:** s11b_l75 still ends “patient, certain, sinking.”

### R58 · Contrast five active agents with Liam waiting — Decision

**Meeting:** 01:54–01:55 · Dylan, Mike

**Feedback:** Possible visual: five tasks/agents on Brendan’s computer, with him moving to another ticket after deleting this patch.

**Before this pass:** No five-agent dashboard appears in the current visual/action definitions. Narration does mention five agents earlier; the proposed screen contrast is absent.

### R59 · Return Liam to Reddit beside the slow model — Applied

**Meeting:** 01:55 · Mike, Dylan

**Feedback:** Mike proposed a Primeagen video; Dylan preferred the already-established Reddit habit. Use a split screen so the model continues slowly while Liam browses.

**Before this pass:** s11b’s final visuals remain local-model/patch-delete. No Reddit split view exists there. The Primeagen variant was not the preferred direction.

### R60 · Add the AI-girlfriend with/without makeup meme — Missing

**Meeting:** 01:55–01:56 · Stephen; Dylan agrees

**Feedback:** Find the existing joke contrasting a model-like woman with a room of computers; add it to the meme selection.

**Before this pass:** The current twelve-meme manifest has no matching title or description. Finding and checking the actual image is still needed; no asset was fetched or added in this audit.

## The Latest Model (s11c)

### R61 · Specify what point Liam is trying to prove — Applied

**Meeting:** 01:59–02:00 · Stephen; Dylan agrees

**Feedback:** Connect the expensive unproductive setup to the CEO’s AI mandate/security-policy contradiction, not just an unexplained urge to prove a point.

**Before this pass:** s11c still says “a very expensive way of proving a point” without making the memo/policy target explicit in that passage.

### R62 · Make letter-versus-spirit the underlying conflict — Applied

**Meeting:** 02:01–02:04 · Mike, Stephen, Dylan

**Feedback:** Brendan should recognise Liam follows the literal policy while defeating the leadership’s intended productivity goal. Let that echo AI alignment without explicitly explaining the metaphor to the audience.

**Before this pass:** s11c describes slowing the team and teaching new engineers the wrong habits, but has no explicit letter/spirit/CEO-intent connection. s11b already contains the raw policy contrast.

### R63 · Optional Marcus callback — Decision

**Meeting:** 02:01–02:04 · Mike proposes; Dylan qualifies

**Feedback:** Mike suggested Brendan noticing Marcus was right about what the CEO wants. Dylan liked the underlying distinction but did not require a Marcus callback or a broken-clock joke.

**Before this pass:** No callback has landed. Treat it as optional; do not add it on top of the preferred subtle policy point automatically.

## Cuts, peer review and the layoff

### R64 · List every scene’s purpose and protection level — Partial

**Meeting:** 02:06–02:09; 02:34; 02:38–02:39 · Stephen, Mike, Dylan

**Feedback:** Summarise what each scene establishes, then classify must-have, flexible, or removable. Use this to combine scenes and protect setup/payoff when cutting, especially in the second half.

**Before this pass:** The new Cuts page, per-scene function notes, guardrails and summary plans implement much of this. Some notes still refer to removed scenes or old hashes; they are analysis, not proof that all cuts are approved.

### R65 · Take turns cutting roughly ten minutes, with review — Partial

**Meeting:** 02:08–02:09; 02:32; 02:34–02:36; 02:42 · Mike, Dylan, Stephen

**Feedback:** Mike takes the first pass, Dylan reviews then takes a pass. Re-stitch dependencies afterward; whole-scene cuts are allowed. Recorded back-to-back audio excludes live pauses and is not the actual stage runtime.

**Before this pass:** Mike removed s08, s01d and s12 and added runtime tooling. Exact ten-minute savings and a final staged runtime have not been verified here. The meeting’s roughly 90-minute audio / halve-it ambition differs from the Cuts notes’ 60–75-minute staged target; settle the target explicitly.

### R66 · Shorten Brendan’s self-talk and make the subject obvious — Superseded

**Meeting:** 02:09–02:14 · Stephen, Dylan

**Feedback:** Remove reading every numeric rating; make clear the review is about Liam; keep only enough hesitation to register his conflict.

**Before this pass:** The entire s12 sequence is cut rather than tightened. This removes the overlong self-talk but is not the later agreed ChatGPT rewrite.

### R67 · Alternative: relocate the betrayal into brief existing exchanges — Decision

**Meeting:** 02:14–02:17 · Mike, Stephen, Dylan

**Feedback:** Options included Marcus pressuring Brendan in standup, foreshadowing layoffs via reviews, or workers fearing a review that layoffs pre-empt. These were alternatives to the long scene.

**Before this pass:** Mike chose a brief confession to Kristina in s11c_l34–35: both Brendan and Marcus submitted criticism, and she reassures him. This preserves a breadcrumb, but not all of the alternative beats were adopted.

### R68 · Have ChatGPT write Brendan’s peer review — Missing

**Meeting:** 02:17–02:19 · Dylan, Stephen; Mike agrees

**Feedback:** The most explicit agreed rewrite: Brendan supplies Liam’s strengths and problems; asks ChatGPT to write the review paragraph, not merely advise whether to report him; copies it into the form and submits. Possibly he does not read it.

**Before this pass:** There is no ChatGPT-written peer review in the current show. s12 was removed and replaced with two s11c lines. Later they allowed a fuller cut if the shorter rewrite still was not enough; the repo does not show that shorter version being staged.

### R69 · Preserve the misdirect and later guilt through any review cut — Partial

**Meeting:** 02:11–02:19 · Dylan, Mike, Stephen

**Feedback:** Audience should expect Liam to be at risk, making Brendan’s dismissal surprising. Preserve Marcus criticising then defending Liam, and Brendan’s later attempted apology.

**Before this pass:** The s11c feedback confession, s14a Marcus defence and s19 apology survive; the actual submission and Liam responding to the summary do not. The trial still brings out peer feedback. This is a tradeoff to review, not necessarily a missing instruction to restore the whole scene.

### R70 · Make the spreadsheet audience-only knowledge — Present

**Meeting:** 02:20–02:22 · Dylan; Stephen reviews

**Feedback:** Keep the ranking explanation with the narrator. Remove Marcus accessing the sheet and the engineers knowing their score. Do not stage a second full Brendan firing or the old nine-ticket argument.

**Before this pass:** The current s14 gives the narrator the ranking; s19 focuses on not knowing why. Its title remains Nine Tickets, but the old numerical argument is gone. The display still shows a nine-ticket figure for the audience.

### R71 · Tie the layoff spreadsheet explicitly to AI adoption — Applied

**Meeting:** 02:21–02:22 · Stephen; Dylan agrees

**Feedback:** Say the CEO/Kara are using Jira velocity as a proxy for who adopted AI, making the faulty management logic explicit.

**Before this pass:** s14_l1–2 says underperformers/tickets closed, but does not state the AI-adoption proxy.

### R72 · Name Linear and Jira in the layoff explanation — Applied

**Meeting:** 02:21–02:22 · Dylan

**Feedback:** Avoid “somewhere the sheet cannot see”: state that Brendan’s work is in Linear and the ranking only counts Jira.

**Before this pass:** s14_l2 still says “Brendan tracked his work somewhere the sheet cannot see.” Earlier/later dialogue supplies the app names, but the requested clarity at the reveal is absent.

### R73 · Make Brendan’s agent request emotional, not a pentest — Present

**Meeting:** 02:22–02:23 · Dylan; Stephen and Mike approve

**Feedback:** Drunk and angry after being fired, he asks why he was dismissed; the system turns that request into intrusion. Preserve his frustration and lack of an answer.

**Before this pass:** s20_l27–29 explicitly says he is drunk and asks “Find out why I was fired… not the HR script.” The later activity report still does not give him a clear answer.

## Ending and venue constraints

### R74 · Remove depiction and sound of the execution — Applied

**Meeting:** 02:26–02:28 · Dylan reports organizers’ decision

**Feedback:** Organizers ruled out execution audio or visuals: no snap, rope, dangling feet or actual death depiction. A last meal/last words/aftermath reference can imply the outcome.

**Before this pass:** s24_l35 still directs a trap door, rope snap and slow creak; s24_l37 continues the creak. These are stage cues with empty sfx arrays, so I am not claiming an execution recording is currently played. The written production directions still contradict the venue instruction.

### R75 · Choose an implied ending rather than implementing every brainstorm — Decision

**Meeting:** 02:26–02:28 · Stephen, Dylan, Mike

**Feedback:** Last meal or last words were serious possibilities. Black armbands/meal-at-a-meeting were floated, then qualified as not serious and awkward given the characters’ employment. Mike also raised potentially unwanted historical associations.

**Before this pass:** No replacement ending is selected in this transcript. Do not treat armbands, a second arrest, or the joking onstage-death exchange as approved staging. Preserve the venue boundary while proposing a concrete alternative for review.

## Production, rehearsal and editorial workflow

### R76 · Keep the rehearsal presenter usable — Partial

**Meeting:** 00:10–00:18 · Dylan, Mike, Stephen

**Feedback:** Support selectable live/generated roles; fix the preview/display glitch; share the tab that actually supplies audio. The opening share initially had no audio and was corrected during the meeting.

**Before this pass:** Live/generated controls and separate silent audience outputs exist. Meeting-specific audio sharing and multi-display glitches cannot be declared fixed from source inspection alone; test on the rehearsal setup.

### R77 · Arrange desks, chairs and scripts at the performers’ desks — External

**Meeting:** 01:19–01:22 · Dylan, Mike

**Feedback:** Plan four seated character stations with keyboards; performers mime typing and can read their script from laptops/monitors naturally. Character-specific desk props were suggested, subject to venue resources.

**Before this pass:** Venue/props action, not something a repository pull proves completed. Do not order equipment or contact the venue on the basis of this transcript.

### R78 · Plan lighting around calls, not each speaker turn — External

**Meeting:** 00:44; 01:20–01:22 · Mike, Dylan

**Feedback:** Consider dim/fade transitions and lighting only the participants in the current call. Avoid trying to chase every spoken line with a spotlight. Use narrator transitions as crew cues.

**Before this pass:** Deferred production/AV design. No live venue lighting integration has been verified.

### R79 · Review the second half asynchronously — External

**Meeting:** 02:06–02:09; 02:25; 02:34 · Stephen, Mike, Dylan

**Feedback:** The read stopped around The Latest Model; do not mistake it for a full-play rehearsal. Give Stephen scene-purpose guidance so his cuts preserve what the authors need.

**Before this pass:** This transcript supplies detailed first-half notes and discussion of selected later scenes, not a performed end-to-end second-half review. Completion of follow-up reads is unknown.

### R80 · Unify proofreading and presentation around the newest script — Present

**Meeting:** 02:36–02:41 · Mike, Dylan; Stephen

**Feedback:** Use one current script source for both apps, not the old markdown version. Keep the pre-merge versions recoverable. Make the proofreading tool usable for Mike.

**Before this pass:** SHARED_SCRIPT.md establishes stage/show.json and script_store.py; both apps use the shared store. Revision-aware proofreading and migration archives/history exist. This is implemented architecture, not a request to rebuild from old script files.

### R81 · Export a current script plus scene intentions for review — Partial

**Meeting:** 02:32–02:34; 02:38; 02:42; 02:46 · Stephen, Mike, Dylan

**Feedback:** Provide a PDF to Stephen and the prospective Kristina, with enough explanation of each scene’s purpose/protection to guide cuts. Offer setup guidance if Stephen uses the editing app instead.

**Before this pass:** Mike added the dated PDF/export tool and separate Cuts notes. No evidence here of a combined purpose-annotated packet being sent, or onboarding having happened. No messages were sent during this task.

### R82 · Audition Charlie for Kristina and send the script first — External

**Meeting:** 02:25; 02:44–02:46 · Dylan, Mike, Stephen

**Feedback:** Dylan introduces her with the current script and notes it is changing; Mike arranges a read, potentially playing Brendan; record/share it, with Stephen joining if available. Assess fit for Kristina, not just general performance experience.

**Before this pass:** Casting, contact and recording are outside the repo evidence. No follow-up or candidate outreach is authorized by this audit.

### R83 · Do a continuous timed rehearsal — External

**Meeting:** 02:42–02:44 · Stephen; Dylan discusses

**Feedback:** Use natural delivery and slower AI voices, keep notes privately, and hold discussion until the end. Give a new cast member the script beforehand and explain the no-interruptions rule; substitute an AI role if an actor must leave.

**Before this pass:** A rehearsal process proposal, not an app change. No subsequent uninterrupted read is established by these files.

### R84 · Coordinate rehearsal and travel logistics — External

**Meeting:** 02:24–02:25; 02:27–02:32; 02:42–02:47 · All

**Feedback:** Move the next group rehearsal toward Saturday; do asynchronous work beforehand; arrange travel/arrival early enough for an in-person rehearsal. The organizer contribution and division of costs were discussed.

**Before this pass:** Operational reminders only; their 2026-09-13 timing may now be stale. I have omitted unrelated personal/medical details and exact travel/financial particulars from this script review. No booking or scheduling actions were taken.

### R85 · Optional combined-ages joke — Decision

**Meeting:** 02:48 · Dylan; Mike agrees

**Feedback:** Potential Liam line: his experience exceeds the other two’s ages combined. This was a closing brainstorm with no scene placement.

**Before this pass:** Not found in the current dialogue. Treat as an optional joke; first check the characters’ ages and the exact claim so the arithmetic is intentional.

## Scope and audit limits

Included: explicit edits, production notes, decisions, qualified alternatives, preserved story requirements, and operational follow-ups relevant to the play. Excluded: ordinary performed dialogue/ad-libs not requested as edits, personal small talk, unrelated pinball/home discussions, and joking remarks that were not decisions. No inference that everything not implemented was forgotten: some work may have been intentionally superseded or exists outside this checkout. Source comparisons include show.json, screen-actions.json/js, visuals.js, playback-settings.js, stage.js/css, shared-source documentation, cut notes and the three new commits. Visual timing findings from code still need a live read with actors.

## Questions introduced by the comparison (not additional meeting instructions)

- The offboarding still discusses the performance plan at length, despite the early claim that only a subtle narrator mention remained. Is that intentional?

- The demo says Brendan already tried showing Liam his method, but the PR Review still follows the demo. Review the chronology before making the proposed three-hour transition.

- The terminal setup opens as a Mac Mini and is later described as a Mac Studio. Pick one when approving the hardware tweak.

- The short feedback confession protects the plot breadcrumb; decide whether to retain Mike’s compression or restore the much shorter ChatGPT submission beat. Do not restore all of Below Expectations by default.
