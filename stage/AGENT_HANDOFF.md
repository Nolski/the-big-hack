# Current author revision

This presentation includes the September 12 author pass through The Audit. Read README.md and handoff/author-revision-20260912/change-log.md first. The current editable source is show.json. Older branch/rebuild notes below predate this revision.

# Current script revision

This copy now uses edits/cut-pass 0a26f29 with verified voice recordings and optional generated voices for every speaking role. Consult README.md and handoff/audio-verification.json before older notes below. Stage directions are notes; only authored narrator dialogue is spoken.

# The Big Hack — handoff for the receiving agent

This folder is a self-contained, offline HTML presentation for an on-stage play. The user is moving it to another computer by AirDrop. Your immediate task is to start this copy and open the operator console. Playback does not require Git, a build step, an API key, ElevenLabs, Blender, Manim, Node.js, or downloaded model weights. It needs Python 3 and a current desktop browser; Chrome is the tested browser.

## Start this copy

1. Unzip the archive and keep the entire `The Big Hack Stage` folder together. Work in this extracted folder, not inside the ZIP.
2. On a Mac with Python 3 and Chrome, double-click `Start The Big Hack.command`. It starts a server on localhost and opens Chrome. Keep its terminal running.
3. Alternatively, open a terminal in the extracted folder and run:

```sh
python3 serve.py --host 127.0.0.1 --port 8040
```

4. Open `http://127.0.0.1:8040/`. Serve the files over HTTP; opening `index.html` as a `file://` URL does not work because it uses JavaScript modules and fetches JSON.
5. If port 8040 belongs to a different application, leave that application alone and use `--port 8041`, then open `http://127.0.0.1:8041/`. Relative URLs keep both outputs on the same port.
6. Confirm the scene title and both previews appear. Press Start / Resume to enable playback. The show starts paused and may restore the browser’s last selected cue.

If Python 3 is missing, install or locate Python 3 using the receiving computer’s normal setup. There are no pip dependencies for playback. If the Mac launcher lacks executable permission after transfer, use the terminal command above or run `chmod +x 'Start The Big Hack.command'`.

The server also supports `--host 0.0.0.0` for LAN access. Its current CLI default is `0.0.0.0`; the command above and Mac launcher explicitly use localhost. The previous LAN startup bug (`crypto.randomUUID is not a function` on plain HTTP) is fixed in this package with a feature-detected session-ID fallback.

## What the production expects

- One computer drives the operator screen and two audience displays in extended-desktop mode. Click **Open left display** and **Open right display**, allow those popups, move each window to its physical display, then use its **Enter fullscreen** button.
- Use the same browser profile and URL origin for the console and its two outputs. Synchronization uses BroadcastChannel within that browser. A console opened on another computer is an independent playback session; there is no cross-computer synchronization service.
- Only the operator console plays audio. Both audience windows and both preview panes are muted. Route the operator computer’s sound to the venue speakers.
- Liam, Brendan and Marcus are physically present actors. Their lines are speaker notes, not generated audio. Other characters and the narrator have recorded lines. The narrator is the previously generated Warm Mountain Man voice.
- **GO / Right arrow / Page Down** advances to the next performance cue. **Space** starts, pauses or resumes. **R** replays. **Left arrow / Page Up** goes back paused. **B** blacks out and pauses; restoring the picture leaves it paused. There is no automatic cue advance.
- Recorded lines play once and hold. Scenery loops until GO. Authored typing actions play once and hold their completed state, including an empty box after a deletion. GO to the following dialogue within the same action continues that action’s clock; replay resets it.

## Changes already approved and included

- Only Kristina’s first line (`s01_l2`, “Morning, everyone…”) uses the new realistic performance video. It is inside her Zoom tile, synchronized with the existing recording, and holds its last frame. Its file is `assets/filmed/kristina-first-line.mp4`. All other character performances retain their prior assets. Do not turn the rest into this style unless the user asks.
- Persistent labels identify the owner of each displayed computer, independently of the person speaking on a call. In the cold open, Reddit and Zoom are views of Liam’s computer. During the RNG explanation, Liam’s code and Brendan’s private ChatGPT window are separate displays. Kristina’s own demo and later solo experiment are labeled as her computer. Phones and the officer’s tablet have device-specific labels.
- Six silent ChatGPT lookups recur while Liam talks technically. They visibly type the question, submit it, and reveal an answer. They are authored stage graphics, not live connections to ChatGPT.
- Twenty-eight screen actions include the investigation command, branch deletion, two drafts to Kristina, deletion of the finished patch, peer-feedback composition and edits, the unsent “thanks everyone.” reply, and the unfinished phone warning. Distinct typing beats are independently callable so they are not swallowed by grouped actor notes.
- The source script does not quote the unfinished phone reply. Its screen-only wording is “liam, about the machine. last night i tried something and i think i need to tell you before you...” It is erased and never sent. No new spoken dialogue was added.
- Twelve sourced programming memes remain in the cold open. Read `reddit-sources.md` for credits.
- Earlier staging corrections remain: officers physically in Liam’s apartment; court in a courthouse; distinct Liam and Brendan apartments; beer and computer handoff/return continuity; narrator-driven worm animation; black screens for Great News.

## File map

| File | Purpose |
| --- | --- |
| `index.html`, `stage.js`, `stage.css` | Operator console, notes, cue navigation, audio, shared clocks |
| `display.html`, `display.js` | Left/right audience output and silent previews |
| `show.json` | Complete compiled show: 23 scenes, 1,248 source beats, 1,248 operator cues, dialogue/notes, source references, audio and performance-video assignments |
| `visuals.js`, `visuals.css` | Recreated app screens, call layouts, physical scene handling and asset selection |
| `screen-actions.json` | Editable typing/deletion sequences, timings, cue ranges and operator directions |
| `screen-actions.js`, `screen-actions.css` | Action renderer, deterministic typing clock and computer-owner labels |
| `worm.js` | Narrator-synchronized worm animation and epilogue |
| `reddit.js`, `reddit-memes.js` | Offline meme feed, source metadata, timing and responsive post height |
| `narration.json` | Editorial narration choices adapted from stage directions |
| `serve.py` | Standard-library HTTP server, byte-range media playback and filmed-clip upload/settings APIs |
| `assets/` | Every image, video, voice recording and sound effect needed for playback |
| `overrides.json` | Optional persisted user-uploaded clip assignments; absence is normal |
| `handoff/` | Asset inventory/checksums, performance cue sheet and recent verification/review notes |

All playback paths are relative to this folder. The original authoring vault, Git worktree, render environments, neural model weights and raw rendered frames are deliberately excluded. They are not needed to run or edit this HTML player. The full project’s README includes authoring/rebuild instructions that refer to those separate sources; do not try to run its compiler or generation commands in this playback bundle. Do not search for or request the ElevenLabs key merely to start the show.

## Working on it after startup

The runtime JavaScript, CSS, JSON and media are editable. Keep existing cue IDs and live/recorded assignments stable unless a user-requested change requires otherwise. `show.json` includes all dialogue and acting notes, including the underlying ungrouped beats. Operator navigation uses `performanceStarts` and each starting cue’s `groupEnd`. Grouped cues must not cross a change in actor, recorded line, screen action, computer owner or staging. `screenActions` on each cue selects the relevant action in `screen-actions.json`; changing action ranges in that JSON alone does not rewrite the compiled cue assignments.

The console’s **Replace filmed clips / cue settings** panel can upload replacements independently for each display, select which source supplies audio, and choose looping versus holding. Replacements are saved in `assets/filmed/` and `overrides.json`. The included Kristina first-line performance is an authored `performanceVideo` assignment in `show.json`, not an uploaded override.

For isolated visual inspection, use `display.html?cue=s06_l29&side=right&t=6` to see Brendan partway through the RNG question, or `display.html?cue=s11b_l65&side=right&t=17` to inspect deletion of the first policy draft. Those links do not connect to the console or play its audio. Normal audience windows are `display.html?side=left` and `display.html?side=right` and follow the console.

Recent checks covered both displays, all 28 screen actions, partial typing and completed erasure, pause/replay/blackout, continuation across GO, a late-joining display, the full first-line video and its original audio, and all twelve meme reading positions. Existing media and the original author-script text were preserved. On the receiving machine, perform a short startup and audio/output check because browser permissions and physical display arrangement are machine-specific.
