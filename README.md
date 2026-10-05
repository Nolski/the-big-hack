# The Big Hack

A play with two pages: **Editor** for changing the script, **Presenter** for rehearsing and running the show.

## Run it

Install Python 3.10 or newer, download or clone this repository, then run this from its folder:

```sh
python3 stage/serve.py
```

- **Edit:** http://localhost:8040/editor.html
- **Present:** http://localhost:8040/

No packages, account, GPU, or internet connection are needed to edit or play the included media. Keep the terminal open; Ctrl+C stops the server. If that port is busy, use `python3 stage/serve.py --port 8041` and open port 8041 instead. The server is accessible only on your computer by default.

## Change the script

Choose a scene in the editor and type directly into its blocks. Use the speaker and block-type controls, and the **+** buttons to insert dialogue or narration. Find searches the entire script. Undo and Redo restore saved edits.

Wait for **Saved** before closing the page. Changes are written to **`stage/show.json`**. That is the only script: the presenter reads the same file. A conflicting edit from another tab is refused rather than overwriting it. Local recovery snapshots live in `stage/script-history/`; do not delete that directory if you need to recover work.

**Saved means saved on this computer, not backed up to GitHub.** To contribute:

```sh
git switch -c edits/my-change
# Edit in the browser, then inspect the changes:
git diff -- stage/show.json
git add stage/show.json
git commit -m "Describe the script change"
git push -u origin HEAD
```

Open a pull request on GitHub. The app never commits or pushes for you.

## Present

Select a scene, then use GO or Space to advance. Open the left and right audience displays from the presenter. Settings control live versus recorded roles and playback speed.

Editing a spoken line makes its old recording ineligible for playback. Generate a replacement or read it live; an old recording is never treated as the new dialogue. The presenter indicates when the script has changed so you can reload it between runs.

## Files contributors need

- `stage/show.json` — scenes, dialogue, narration, and cue timing. Preserve cue IDs when editing by hand.
- `stage/screen-actions.json` — projected computer activity, not a second script.
- `stage/assets/` and `stage/generated-voices.json` — media and the exact words each recording covers.
- `stage/editor.*`, `stage/editor_api.py` — editor.
- `stage/index.html`, `stage/stage.js`, `stage/display.*` — presenter and audience displays.
- `stage/serve.py`, `stage/script_store.py` — shared server and safe saves.
- `research/` — background material, not the current script.
- `voice-references/` — preserved reference clips and voice vectors.

Old storyboard tools and duplicate Markdown/YAML drafts were retired. Previous versions remain in Git history.

## Optional audio and PDF tools

`tools/generate_elevenlabs.py` reads the same script and skips matching recordings. It requires `requests`, `ffprobe`, an `ELEVENLABS_API_KEY` environment variable, and paid ElevenLabs credits. Voice assignments are in `tools/elevenlabs-voices.json`. Preview the work without spending credits:

```sh
python3 tools/generate_elevenlabs.py --dry-run
# Generate only the narrator:
python3 tools/generate_elevenlabs.py --only narrator
```

Keep keys out of Git. Include both the new audio files and updated JSON files in a recording contribution.

To see how far the cut has come, click the runtime meter in the editor's top bar, or run `python3 tools/runtime_report.py`. Both convert the recorded line lengths into stage minutes using the 105-minute walkthrough in `stage/runtime-baseline.json` and show each scene against the 63-minute target. Lines without a matching recording are estimated, so generate audio first for exact numbers.

The target is 60 minutes with the montages counted at their real length. Each scene has a budget, and its **Where to cut** panel lists suggested cuts and trims (`stage/cut-suggestions/<scene>.json`) with what each saves. Suggestions mark themselves done when the cut is in the script, and warn when one relies on a line another suggestion would cut. They are suggestions only; nothing changes the script until you edit it.

For a printable script, install WeasyPrint and run `python3 tools/export_pdf.py output.pdf`. Exports are generated copies, not editing sources.

## Check code changes

```sh
python3 -m unittest discover -s stage/tests -p 'test_*.py'
node --test stage/tests/*.test.mjs
```

Node is only needed for the JavaScript tests. Read `AGENTS.md` before automated edits and `stage/BRAND.md` before changing the presenter design.
