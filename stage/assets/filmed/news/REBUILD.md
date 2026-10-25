# Rebuild the news montages

With Docker running, run this from the repository folder:

```sh
python3 tools/rebuild_news.py collapse
```

The first run builds the media container. Finished MP4s go into **`build/news/`**, alongside their working files. Later renders work offline. Nothing is installed on the host, no API key is needed, and the command never overwrites the play's films or script.

Replace `collapse` with `opening`, `time-jump-a`, `time-jump-b`, `time-jump-c`, `three-day`, `sentencing`, `reporter-sj`, or `reporter-brendan`. Use `all` to build all nine, or `--list` to see their cue IDs. On Windows, use `python` instead of `python3`.

## Make an edit

1. Edit **[rebuild.json](rebuild.json)**. It lists source files, cut lengths, separate picture/sound offsets, crops, volume changes, and the rendered file used by each cue. Times are seconds into the included source file.
2. Run the build again and watch the result in `build/news/`.
3. When approved, copy the MP4 over the corresponding `output` path under `stage/` listed in the recipe. If its duration changed, update that cue's `montageDuration` in the editor too. Include the recipe, source changes, and finished MP4 in your commit.

The assembly code is [tools/rebuild_news.py](../../../../tools/rebuild_news.py). The container definition is [tools/news-montages/Dockerfile](../../../../tools/news-montages/Dockerfile). Existing FFmpeg users can add `--native` to skip Docker; it never installs anything. The reporter overlays also need the DejaVu fonts included in the container.

## Sources

- **[raw/real/](raw/real/)**: 28 real footage files for the opening, three time jumps, and sentencing statements. [INDEX.csv](raw/real/INDEX.csv) records URLs, source offsets, and hashes. Longer broadcasts are supplied as ungraded excerpts with handles where needed; these are editing sources, rather than full programmes. The original Hegseth excerpt is retained before the inner-frame crop. Vance and Trump were recovered from their original URLs. The build retains Vance's +6 dB boost and the approved small trims.
- **[raw/](raw/)**: 20 original AI news takes, plus the supplied score and opening narration. Its [INDEX.csv](raw/INDEX.csv) maps the AI sources to the films and cues.
- **[graphics/](graphics/)**: original date/time-card images, preserving the approved typography without requiring someone's system fonts. Edit these images to change their text. Reporter name bars use the container's redistributable DejaVu font, so their lettering differs slightly from the original Arial export.

These recipes target the films referenced by `stage/show.json`, rather than newer unused local experiments. The closing song's separate silent outro is described by `stage/assets/filmed/outro-montage-v2.edit.json` and `tools/build_montage.py`; it is outside this news-source collection.

## Where the treatments live

All FFmpeg filter strings are under **`treatments` in [rebuild.json](rebuild.json)**:

- **`crtVideo` / `crtAudio`**: reduced resolution and saturation, noise, scan lines, vignette, and restricted TV sound. Used for the analogue-TV announcement.
- **`sepiaVideo` / `radioAudio`**: sepia colour matrix and grain; mono sound, 300–2600 Hz bandwidth, presence EQ, compression, soft clipping, slight pitch wobble, and hiss. The radio bulletin and both courthouse reports stay in this treatment, so the montage does not return to cable news.
- **`sentencingVideo`**: the milder CRT treatment on the judge quotation before the real statements.

`collapse()` in the build script contains the brownout picture/sound pairing, courthouse crop, and hiss levels. It uses the replacement street footage for the brownout picture and the original reporter take for its sound. `lead()` holds each time card for 3.5 seconds; incoming speech starts at 2 seconds, before its picture appears. `mix()` contains the supplied music bed, speech ducking, fades, and limiter.

The opening keeps its original zoom cuts, complete Sam exchange and pause, SJ narration, and November 24 title card. Time jump B retains its muted opening for the presenter's separate piano cue; that live background-music behaviour remains in `stage/show.json` and `stage/background-music.js`.

Renders reproduce the edit and treatments, rather than identical compressed bytes: encoder versions, generated grain/hiss, and the recovered YouTube encodes can differ. The checked-in approved films remain the visual and audio reference.
