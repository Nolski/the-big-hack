# The Big Hack — stage console

The stage and storyboard now share one script. See [Shared script](../SHARED_SCRIPT.md) for the source, editing, audio and revision contract.

Start with `python3 serve.py --host 127.0.0.1`, then open http://127.0.0.1:8040/. No additional software is required. Keep the whole assets folder beside the app.

Speaker notes are the primary surface. **GO** advances one cue; **Space** pauses/resumes; **R** replays; left arrow goes back. Settings controls Live/Generated voices, speed and volume. The montage plays at its original speed. Open left/right displays from Settings, move them to extended screens, and enter fullscreen. Audio comes from the console only. Reopen display windows after reloading the console.

**Settings → Edit current cue** saves to the same script used by the storyboard. Changed speech needs regenerated audio. An already-open stage session keeps its loaded revision; pause and use **Load updated script** to accept changes. It stays paused after loading.

The current show includes the author pass through The Audit, 20 scenes, 1,031 cues and 830 spoken recordings, plus the opening montage. Next Week onward was preserved. The current script and audio are in `show.json` and `generated-voices.json`; screen choreography is in `screen-actions.json` and the cue metadata. Do not rebuild from older Markdown scripts.

Run `python3 tests/test_shared_script.py` and `node --test tests/*.test.mjs` for validation. Historical build notes are archived in `handoff/shared-script-migration/previous-stage-README.md`.
