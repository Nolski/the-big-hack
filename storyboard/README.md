# The Big Hack — storyboard

Open http://127.0.0.1:8011/. The storyboard and stage console share `../stage/show.json` through `../stage/script_store.py`. See [Shared script](../SHARED_SCRIPT.md) for the complete contract.

Edit a scene and Save to update the shared script. The review editor writes to that same source. **Export script** downloads current Markdown. Setting/staging is production context; spoken set descriptions and narration belong in the ordered script as narrator lines. Current audio and the opening movie are available in the scene editor.

All original artwork and voice configuration remains in `artifacts/` and `storyboard.yaml`. Current text no longer comes from `03 - Script`, `storyboard.yaml` scenes, or the old overrides sidecar. Those are retained as historical material. Missing artwork is shown as such rather than substituting an unrelated scene.

The stage session offers **Load updated script** after edits; pause playback before loading. An open storyboard editor is not overwritten by another editor. If a save reports that the revision changed, close and reopen the scene before saving.

Generation uses the existing GPU setup via SSH and writes content-addressed audio into the shared stage manifest. Edited words, speakers and configured voice profiles invalidate the affected recordings. The approved Mountain Man C prompt is preserved. Imported roles without a saved generation profile keep their existing audio but need voice configuration before new lines can be generated.

Run with the existing Docker image using `docker compose up -d --no-build`. Compose mounts the shared stage directory. For worktrees, supply `SB_GIT_COMMON_DIR` with the common Git directory. GPU host, Python and workdir come from `SB_TTS_HOST`, `SB_TTS_PYTHON` and `SB_TTS_WORKDIR`; SSH and API-key mounts remain read-only. Nothing needs to be installed on the host or GPU. See AGENTS.md for generation model and environment requirements.

Historical setup documentation is preserved in `../stage/handoff/shared-script-migration/previous-storyboard-README.md`.
