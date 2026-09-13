# Shared script — current authoring contract

The current script is `stage/show.json`. Both apps use `stage/script_store.py` for edits. The storyboard no longer parses Markdown or applies `storyboard/overrides.json` to the current show. Those older sources are preserved as historical material. Do not rebuild the show from them.

## Editing

- Storyboard at http://127.0.0.1:8011: edit scenes, lines, production notes, artwork and music. Save writes the shared script. The review editor edits the same cue IDs and source.
- Stage at http://127.0.0.1:8040: Settings → Edit current cue changes text, delivery, speaker and type in the shared script.
- Each save carries the revision it was opened against. A stale editor receives HTTP 409 and must reload before saving. Writes use a cross-process file lock and atomic replacement. Before each script edit, the previous document is retained in the local `stage/script-history/` recovery directory.
- Cue IDs are permanent identifiers, not sequence numbers. New cues get new IDs; insertion/reordering never renumbers existing IDs. Scene starts, counts and operator notes are recalculated on saves; screen assignments and staging stay attached to their cue IDs.
- Agents and tools should use `ScriptStore.transaction`, `update_scene`, or `update_cue` rather than creating another independent script file. Validate and preserve production metadata.

## Playback and updates

The storyboard scene list refreshes when the shared revision changes; an open editor is never overwritten. Close/reopen the editor to pick up another editor's changes. The stage keeps its loaded script fixed during a performance. When newer edits exist, **Load updated script** appears; pause first, then load it. Loading preserves the selected cue by ID when possible and leaves playback paused. Each console has its own display channel, preventing unrelated consoles from flashing other cues onto its previews.

Current import: 20 scenes, 1,031 cues, 830 spoken recordings, plus the opening movie. `stage/handoff/shared-script-migration/original-show.json` preserves the exact pre-migration show. All original cue text, directions, IDs, staging, screens and audio assignments were retained. Available storyboard production metadata was imported; unmatched older scenes and overrides remain preserved in their original files and the migration archive.

## Audio

`stage/generated-voices.json` maps permanent cue IDs to exact text, speaker, optional voice-profile fingerprint, immutable media filename, duration and checksum. Both apps refuse mismatched recordings. Changing words or speaker requires regeneration; changing a configured voice invalidates that role's recordings. Stage directions remain silent unless changed to narration.

Storyboard generation registers new recordings into the shared manifest and stage assets. Generation uses unique job paths and only attaches a result if the script and voice still match when generation finishes. The approved Mountain Man C prompt is retained for narrator generation. Some imported roles have existing recordings but no original synthesis profile in this checkout; they must be configured before generating new lines. No existing recordings are replaced merely by migrating.

## Exports and historical material

**Export script** in the storyboard downloads current Markdown with cue IDs. It is an export; editing it does not change the shared script. Historical Git review reads a committed stage script when available and otherwise uses that older revision's Markdown. The original `03 - Script` folder and old storyboard overrides are historical, not a second authoring path. To take the stage offline, copy the entire `stage/` folder, including its assets and shared store; `python3 serve.py --host 127.0.0.1` needs no extra packages.

## Running

The stage runs with Python's standard library. The storyboard runs in the existing `bighack-storyboard:local` image; do not install software on this host or GPU host. `storyboard/docker-compose.yml` mounts `../stage` at `/stage` and sets `SB_STAGE_DIR=/stage`. For a Git worktree, set `SB_GIT_COMMON_DIR` to the absolute common Git directory before starting Compose. Continue supplying GPU settings and keys through existing environment variables and read-only mounts; do not commit credentials or host-specific overrides.

## Verification

Run `python3 stage/tests/test_shared_script.py` and `node --test stage/tests/*.test.mjs`. The shared-source tests use temporary copies; they cover exact import, stable IDs, preserved staging, conflicting writes, stale generation, changed voice profiles, scene deletion/reordering, archives and exports. Playback checks verify recording hashes and the author revision. `storyboard/tests/shared_api_check.py` exercises both APIs and the review editor with a temporary script inside the storyboard container.
