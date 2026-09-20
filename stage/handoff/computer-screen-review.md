# Computer labels and screen performances

The first Kristina clip is installed only on s01_l2. All earlier media files, spoken dialogue and author-script files are unchanged. Device labels identify the computer owner independently of the participant in a call.

Six ChatGPT lookups recur during the PR review, race-condition investigation and local-model conversation. Questions and responses are authored silent stage props. Brendan’s private display is separate from Liam’s code.

Typing and deletion use the operator clock. They play once, hold their final state, and stop on pause or blackout. Continuing to the next cue in the same action preserves elapsed time. Important written beats have their own GO boundary.

| Action | Cue range | Display | Duration before hold | Operator direction |
| --- | --- | --- | --- | --- |
| key-issuance | s01c_l13–l16 | right | 14.8s | Brendan privately types a question into ChatGPT while Liam speaks. Let the answer finish, then hold. Liam cannot see this screen. |
| race-condition | s06_l16–l24 | right | 13.4s | Brendan privately types a question into ChatGPT while Liam speaks. Let the answer finish, then hold. Liam cannot see this screen. |
| rng-entropy | s06_l29–l30 | right | 15.7s | Brendan privately types a question into ChatGPT while Liam speaks. Let the answer finish, then hold. Liam cannot see this screen. |
| mutex-deadlock | s06_l32–l34 | right | 13.9s | Brendan privately types a question into ChatGPT while Liam speaks. Let the answer finish, then hold. Liam cannot see this screen. |
| quantized-model | s11b_l44–l46 | right | 13.7s | Brendan privately types a question into ChatGPT while Liam speaks. Let the answer finish, then hold. Liam cannot see this screen. |
| pin-weights | s11b_l64–l64 | right | 13.5s | Brendan privately types a question into ChatGPT while Liam speaks. Let the answer finish, then hold. Liam cannot see this screen. |
| investigate-signup | s06_l31–l31 | right | 11.0s | Show the investigation request being typed before Claude starts reading the repository. |
| checkout-main | s06_l48–l49 | right | 5.5s | The command is typed, executed, then held. The fix stays on its branch. |
| delete-branch | s07_l25–l25 | right | 7.7s | Type the branch-delete command, pause on it, then execute. Liam’s PR stays visible on the other display. |
| cloud-prompt | s11b_l59–l63 | right | 9.2s | Brendan types the request; the agent then opens the file, writes the change and passes the test. Hold the finished result. |
| policy-drafts | s11b_l65–l66 | right | 33.5s | Two distinct drafts: type the policy question, hold it so the audience can read it, erase with held backspace; type the unfinished thought about Liam, hesitate, erase it too. GO may continue to Liam’s next line without restarting the typing. |
| delete-patch | s11b_l70–l71 | right | 12.5s | Show the completed patch first. Select it, visibly erase it, and hold the empty editor. Liam’s local model keeps crawling on the other display. |
| no-major-concerns | s12_l31–l34 | left | 5.6s | The first answer appears character by character. Hold it while Brendan tries to justify it. |
| clear-first-answer | s12_l35–l42 | left | 5.8s | Visibly clear the first draft, then leave the cursor in the empty optional field. |
| feedback-first | s12_l46–l49 | left | 6.5s | Type the first sentence as Brendan reads it aloud; hold it through his hesitation. |
| feedback-local | s12_l50–l50 | left | 18.5s | Append the local-model paragraph, including the last sentence he will reconsider. Both must be visible before the next cue. |
| feedback-retract | s12_l51–l52 | left | 7.0s | Erase only “He said it like it settled something.” Keep every earlier sentence intact. |
| feedback-queue | s12_l53–l54 | left | 14.0s | Append the review-queue paragraph as Brendan reads it. |
| feedback-careful | s12_l55–l57 | left | 10.0s | Type the tooling sentence, then hold it through the double reading. |
| feedback-hedge | s12_l58–l59 | left | 7.0s | Append the hedge without changing the previous paragraphs. |
| feedback-race | s12_l60–l62 | left | 11.0s | Append the race-condition credit. Hold all four paragraphs through Brendan’s unfinished spoken line. |
| feedback-submit | s12_l63–l64 | left | 4.4s | Submit the completed four paragraphs. No deletion on this cue. |
| promotion-empty | s14b_l93–l94 | right | 1.0s | The promotion thread remains open, with an empty reply box while Brendan packs. |
| promotion-thanks | s14b_l95–l96 | right | 8.2s | Type “thanks everyone.” character by character. Hold the unsent reply. |
| promotion-delete | s14b_l97–l97 | right | 7.5s | Hold backspace until the unsent thank-you is gone. Leave the empty box visible until GO. |
| phone-read | s20_l73–l74 | left | 1.0s | Show Liam’s 06:02 message on Brendan’s phone. The reply is still empty. |
| phone-warning | s20_l75–l76 | left | 13.0s | Type an unfinished warning over roughly a line and a half, then hesitate. This screen-only draft is an adaptation: the script specifies its length and deletion but not its words. |
| phone-delete | s20_l77–l78 | left | 10.0s | The same unfinished warning is visibly erased with held backspace. It is never sent. |

The phone warning’s wording is a new screen-only adaptation because the script specifies an unfinished reply but does not quote it. It is never sent. All other consequential drafts preserve the script’s wording.

Verification: `screen-pass/verification.json`; frame reviews: `screen-pass/*.png`; full media checks: `asset-verification.json`.
