# News source footage

These 20 MP4s are the original generated takes used in the current play, collected for re-editing. They retain their native audio and complete takes, before later montage trims, music, time cards, CRT/radio treatments, or reporter-name overlays. Extended reports contain the complete model-returned continuation.

The real news footage is now in [real/](real/), with source URLs and original timestamp offsets in [real/INDEX.csv](real/INDEX.csv). Music and the opening narration recordings are also included here. The original time-card pictures are in [../graphics/](../graphics/).

**To rebuild a film, follow [../REBUILD.md](../REBUILD.md).** That is the entry point for the edit recipe, the build command, and the sepia/CRT/radio settings.

Start with [INDEX.csv](INDEX.csv). It maps each source to the rendered asset and stable cue ID in `stage/show.json`, and includes durations, contribution notes, and SHA-256 hashes.

- **three-day/** — seven news reports and the two nuclear-plant takes.
- **collapse-to-trial/** — flight bookings, brownouts, analogue TV, radio, and the courthouse dispatches. The brownout picture and dialogue came from different generations; both are included and identified in the index.
- **sentencing/** — the two takes quoting the judge.
- **interviews/** — the solo reporters before the publication and name overlays.

Edit copies of these files, export a finished MP4, and replace the rendered asset identified in the index. The presenter continues to use those rendered files. For text or cue changes, use the editor.

This folder contains sources used in the current news sequences. Rejected takes, unused language tests, court/police performances, and incident-response clips are outside this collection. Original generated wording is preserved, including the earlier “Liam worm” name in one source take.
