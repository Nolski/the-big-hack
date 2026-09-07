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

The live cast is **Liam, Brendan and Marcus**, overriding the older vault metadata. All their dialogue is in the speaker notes. No synthesized recordings of these actors are used. Narrator lines, including the reviewed stage-direction adaptations, use **Matthew Schmitz — Warm Mountain Man**, voice ID `Q4oILuo4P8VeXtE6FMLI`. Other recorded parts use temporary ElevenLabs rehearsal voices. Inactive call participants appear as small initial tiles.

## Narration adapted from stage directions

All 377 stage directions have been reviewed. There are **123 additional narrator passages**, including the complete worm escalation, the newer-model demonstration, peer-feedback summarisation, the layoff spreadsheet, and the relevant aftermath. **253 directions stay silent** for physical acting, pauses, visible screen activity and production notes. One italicised prosecutor line was also restored to its scripted voice after the parser had mistaken it for a stage direction.

Narration cues are marked **NARRATION · PLAYS ONCE** in the operator console. They play once, then hold the visual until GO. **Original stage direction / acting notes** preserves the full source beneath each adapted passage. Liam, Brendan and Marcus's original dialogue is unchanged and remains live.

`narration.json` is the explicit editorial selection and spoken text; `production/narration-review.md` records the choices alongside the original prose. The compiler checks the source text before applying each selection, so an edited or shifted script beat cannot silently receive unrelated narration. After changing a selected source direction, review its narration entry before recompiling. To generate only these reviewed recordings, run `python3 tools/generate_audio.py --only voices --reviewed-directions`.

## Replace placeholders with filmed performances

In the console, open **Replace filmed clips / cue settings** on the desired cue. Upload a left and/or right clip. The server saves each file under `assets/filmed/` and saves the assignment to `overrides.json`; replacements survive a browser or server restart. Uploads support MP4, WebM and MOV; H.264 MP4 is the most portable choice.

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
