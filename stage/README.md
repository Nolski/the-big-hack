## Author revision — September 12, 2026

The opening cue is the approved news montage, including Sam Altman’s final pause and the Mountain Man introduction. The author’s requested edits are applied through The Audit; Next Week onward is unchanged. The four requested scenes and duplicated review/demo passages are cut. Narrator adaptations are spoken with approved voice C. Changed dialogue uses the saved cast voices.

Private ChatGPT lookups occur after their triggering lines, with typing sounds. The main standup shows Liam’s shared PR while private screens belong to their named owners. Huddles use Slack’s recorded ringtone; the audit uses the PagerDuty Alert recording.

The editable current show is show.json; screen-actions.json controls the supplemental screens. The exact request, ordered change log, revised script, media sources, and recording audit are preserved in handoff/author-revision-20260912/. Do not rebuild from the older unedited source without applying this revision.

## Script and recording verification — September 12, 2026

This bundle uses `edits/cut-pass` at `0a26f29`: 23 scenes and 1,248 script beats. It has 885 spoken recordings; the single ellipsis-only cue remains a silent pause. Only explicitly authored narrator dialogue is recorded; stage directions remain speaker notes. The earlier presentation is preserved separately with its audio assignments repaired.

Recordings are matched by speaker and complete text, with file checksums in `generated-voices.json`. A missing or mismatched manifest entry blocks playback rather than falling back to an older recording. Audio filenames include a content fingerprint so cue renumbering and browser caches cannot substitute another line. New recordings use the existing synthetic cast references. Live/Generated choices and playback speed work as before.

Run `node --test tests/*.test.mjs` to verify playback behavior and all recording assignments and checksums. Read `handoff/audio-verification.json` for the generation and spoken-text audit results.

This is the portable playback bundle. Double-click Start The Big Hack.command on this Mac, or run python3 serve.py. Keep the assets folder beside index.html. No API key or internet connection is required for playback.

The editable project and production source files remain in /Users/dylan/Documents/research/the-big-hack-flight/presentation. Rebuild instructions below apply to that complete project.

# The Big Hack — stage presentation

A local presentation for one computer, two audience displays and an operator screen. The play's 24 available scenes are arranged in the script's running order, including `25 — Great News`. The author’s source Markdown is unchanged. Scene 21 is listed as unwritten in the supplied vault, so this build moves from `20b` to `22` without inventing a scene.

## Start the show

Double-click **Start The Big Hack.command**, or run `python3 serve.py` from this folder. Open [the operator console](http://127.0.0.1:8040) in Chrome.

The server listens on `0.0.0.0:8040`, so another computer on the same LAN can open `http://<server-computer-LAN-IP>:8040/`. Use `python3 serve.py --host 127.0.0.1` for access from this computer only. Playback control uses a browser-local BroadcastChannel: another computer can open its own operator session, but it does not synchronize to this computer’s running session.

1. Set the displays to **extended desktop**, with the laptop as the operator screen.
2. Use **Open left display** and **Open right display**. Allow popups if Chrome asks.
3. Move each output window onto its audience display, then click **Enter fullscreen** there. Keep the console on the laptop.
4. Route the computer’s audio to the venue speakers. Only the console emits audio; both output windows and both preview panes are silent.
5. Select the opening scene and press **Start cue**. Press **GO** when the next cue should begin.

The canvas is 1920 × 1080. It scales proportionally to other display sizes, with black bars when the aspect ratio differs. The physical display size and resolution can be set later without rebuilding the show.

Every displayed computer has a persistent owner label above its content. The label identifies whose screen the audience sees; the name inside a call identifies the participant. In the cold open, for example, both displays belong to Liam’s computer, and Kristina is named inside his Zoom window. During the RNG explanation, the left display is Liam’s code and the right is Brendan’s private ChatGPT window. Phones and the officer’s tablet use their own device labels. Physical rooms and courtroom exhibits retain their physical staging.

Kristina’s first line (`s01_l2`) now uses the approved 12.64-second local Blender/MuseTalk performance inside her Zoom tile. Its video is silent in both audience outputs; the console plays the original recorded line once. The final frame holds until GO. Every other character performance retains its previous assets.

## During performance

| Control | Action |
| --- | --- |
| Right arrow / Page Down | GO to the next performance cue |
| Left arrow / Page Up | Back, paused |
| Space | Start, pause or resume |
| R | Replay the current cue from the beginning |
| B | Blackout both outputs and pause audio; press again to restore the image |

The same keys work when either audience window has focus. Restore from blackout leaves playback paused until Space. There is no automatic cue advance. Recorded dialogue plays once and then holds. Visual videos loop until GO, or hold their final frame when that option is selected. Uninterrupted live passages and non-visual acting business share one operator cue; the full source beat list remains in `show.json` and the exported cue sheet.

There are 28 authored screen actions, including six private ChatGPT lookups during Liam’s technical explanations. Questions visibly type, submit and receive an answer. The drafting scenes type their text, pause for reading, then erase it character by character where scripted. Each action plays once and holds its result; it never loops back into an abandoned draft. Space freezes the action; R replays it. GO into the next line of the same action continues its clock, so the actors can speak across the typing without starting it over. Separate written paragraphs, the thank-you, and the phone warning have separate operator cues. Blue operator notes give the action and its duration.

The phone scene specifies an unfinished reply but gives no wording. Its new screen-only draft is: “liam, about the machine. last night i tried something and i think i need to tell you before you...” It is erased and never sent. ChatGPT questions, answers and this draft are authored stage graphics; no messages are sent to an online service and no new dialogue is voiced.

The default live cast is **Liam, Brendan and Marcus**. In **Character voices & audio speed**, choose **Live** or **Generated** separately for any of the 13 speaking roles, including the narrator. All 1,013 spoken cues have local recordings available. **All generated** enables a full recorded cast; **Original cast** restores the original live assignments. Settings are remembered in this browser. Changing the cast pauses playback; press Start / Resume when ready. Silent stage directions remain silent. Narrator lines, including the reviewed stage-direction adaptations, use **Matthew Schmitz — Warm Mountain Man**, voice ID `Q4oILuo4P8VeXtE6FMLI`. Other recorded parts use temporary ElevenLabs rehearsal voices. Inactive call participants appear as small initial tiles.

## Narration adapted from stage directions

All 377 stage directions have been reviewed. There are **123 additional narrator passages**, including the complete worm escalation, the newer-model demonstration, peer-feedback summarisation, the layoff spreadsheet, and the relevant aftermath. **253 directions stay silent** for physical acting, pauses, visible screen activity and production notes. One italicised prosecutor line was also restored to its scripted voice after the parser had mistaken it for a stage direction.

Narration cues are marked **NARRATION · PLAYS ONCE** in the operator console. They play once, then hold the visual until GO. **Original stage direction / acting notes** preserves the full source beneath each adapted passage. Liam, Brendan and Marcus's original dialogue is unchanged; each can perform live or use the optional generated recording.

`narration.json` is the explicit editorial selection and spoken text; `production/narration-review.md` records the choices alongside the original prose. The compiler checks the source text before applying each selection, so an edited or shifted script beat cannot silently receive unrelated narration. After changing a selected source direction, review its narration entry before recompiling. To generate only these reviewed recordings, run `python3 tools/generate_audio.py --only voices --reviewed-directions`.

## Replace placeholders with filmed performances

Select the desired cue, then open **Settings → Filmed clips & current cue**. Upload a left and/or right clip. The server saves each file under `assets/filmed/` and saves the assignment to `overrides.json`; replacements survive a browser or server restart. Uploads support MP4, WebM and MOV; H.264 MP4 is the most portable choice.

Choose **Recorded dialogue / narration**, **Left clip**, **Right clip** or **Silence** for the cue’s audio. A filmed clip’s picture can loop while its audio plays only once. Use **Loop until GO** and a **loop start** time to repeat just the listening/holding section after a filmed line; use **Hold last frame** for a fixed ending. All original assets remain intact. **Use original visuals** removes the assignment and restores the authored scene.

For a filmed line followed by a different listening loop, assign the line to its recorded cue and the listening clip to the following live cue. The following live cue can hold as long as the actor needs.

## Scene and asset design

- Opening: twelve found programming memes loop on the left, with Zoom and the active speaker on the right. Images hold for 7–13 seconds and remain fully visible; Liam’s hand-stop freezes the feed before the merged PR takes over at his screen share. See [meme source credits](reddit-sources.md).
- Code demonstrations: native readable Cursor, terminal, Slack and Jira props. The race-condition and local/cloud scenes show the two engineers’ different screens simultaneously.
- Management: roadmap, memo, peer feedback, performance plan and feature-count spreadsheet. Key written language is taken from the script.
- Apartment scenes: distinct paired Blender sets for Liam’s furnished apartment and Brendan’s cramped studio, with explicit computer, beer and return-box continuity. The machine leaves Liam’s desk at the handoff and returns on the coffee table only when Brendan sets it down.
- Audit: 18 distinct animated passages follow the narrator’s audio playhead. The left and right surfaces show propagation and its mechanisms; movement continues during the hold after narration. Pause and blackout freeze both. An illustrative counter continues through the aftermath.
- Arrest: officers are physically in Liam’s apartment. Only Marcus is on the laptop call. Equipment disappears when seized; the interview form appears on Officer Two’s tablet.
- Court: judge at the bench, prosecutor at the lectern, Kristina in the gallery, framed exhibits, a brownout and a manual calendar. No courtroom participant is shown on Zoom.
- Ending: candlelit flat, LoRa radio and stars, then the bare consultation room, agreement, signature and final narration. **Great News keeps both screens black**, with Kristina as an offstage recorded voice.

The scene-by-scene review is in `production/scene-review.md`. Character images are rehearsal placeholders for filmed replacements. Inactive participants become small initial tiles only in actual calls; physical characters remain in their physical scenes. UI props are recreated stage graphics, not live connections to Reddit, Zoom, Slack, Jira, GitHub or cloud accounts. The wallpaper remains a temporary programming meme.

## Files and rebuilds

`show.json` contains the complete script-to-cue mapping, notes, source hashes and audio assignments. `tools/stage_design.py` assigns the location, call membership and prop state. `tools/screen_design.py` assigns computer ownership. `screen-actions.json` contains the editable typing and deletion sequences; `screen-actions.js` evaluates them against the console’s clock. `visuals.js` and `visuals.css` define the screen props; `reddit.js` and `reddit-memes.js` define the sourced cold-open feed; `worm.js` defines the narrator-driven audit animation. `stage.js` controls the operator console and audio; `display.js` renders both audience windows. `production/` contains provenance, build logs, rendered scene sources and verification records, and is not served over HTTP.

The original `make_secrets_easier` presenter source is preserved in `legacy/` as the reference for this stage adaptation. The stage console replaces its single audience-output model with two synchronized, separately addressable outputs. The original research presentation is untouched.

To recompile an edited script, run `.venv/bin/python tools/compile_show.py`. Cue IDs retain the script’s scene and beat IDs. Audio paths include a text/voice hash, so changed dialogue is regenerated rather than silently reusing stale audio. After structural edits, review filmed-clip assignments because inserting a beat changes subsequent beat IDs.

To generate missing or updated recordings, run `python3 tools/generate_audio.py`. It reads the key from the sibling research-level `elevenlabs` file, outside this server’s root; no key is embedded in the app. It caches complete audio files. Generated image prompts are saved in `production/image-generation-prompts.txt` and the additional physical-character prompt files listed in the scene review. The built-in image generation tool was used for the raster character assets. The saved audio-generation log records the exact voice, model and spoken input for each file. The runtime show needs no internet connection.

Manim sources: `tools/manim_scenes.py`. Current Blender sets: `tools/blender_sets_v2.py`; earlier set sources remain in `tools/blender_scenery.py`. Render one current set with `docker run --rm --user 1000:1000 -v "$PWD:/work" -w /work big-hack-render:local /usr/bin/blender -b -t 5 --python /work/tools/blender_sets_v2.py -- liam-with left`. Set names and prop manifests are under `production/sets-v2/`. The local renderer image is `big-hack-render:local`; rebuild with `docker build -f tools/Dockerfile.render -t big-hack-render:local .`. Render source and output remain editable. The renderer is not needed to run the finished show.

Audio API references: [ElevenLabs speech](https://elevenlabs.io/docs/api-reference/text-to-speech/convert), [sound effects](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert). The show uses locally generated media, not real-time API calls.

## Optional recorded cast and speed

The performance console opens with large speaker notes, small audience previews, the upcoming cue, and a fixed transport bar. Open **Settings** for character voices, speed, volume, display windows, and filmed-clip assignments. Open **Scenes** (S) to search and jump to a scene or cue. Escape closes either panel; stage shortcuts are suspended while a panel is open. **Live** mutes that character's recorded dialogue, including an assigned filmed clip's audio, while retaining the visuals. **Generated** uses the character recording unless the cue explicitly selects Silence or filmed-clip audio.

The speed slider runs from **0.5× to 2×**, with a **Reset to 1×** button. Speech retains its pitch. Audience video and authored screen-action clocks follow the speed setting; music and sound effects stay at their original speed. Speed can change while playing or paused. Every cue still waits for the operator's GO; there is no automatic scene advance.

Recorded lines inside previously grouped live passages get individual cues so none are skipped. Switching a role back to Live restores the corresponding live grouping. Recordings are available offline.

`generated-voices.json` maps the additional recordings by exact cue text and character. Existing supporting-role and narrator recordings are retained. Liam, Brendan and Marcus use their saved Qwen3-TTS character voices: 595 matching local recordings were reused and four missing Marcus lines in Great News were rendered with his saved synthetic voice profile. A changed text or speaker will not silently use an old optional recording. This update uses the current stage bundle's script and running order; it does not recompile the cut-pass branch.

Playback logic checks: `node --test tests/playback.test.mjs`.
