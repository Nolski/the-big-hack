# SJ's heartbeat audition

**[Listen to the mix](mix-no-ringing.mp3)**, or open `/assets/sound-design/sj-realization/` in the running app for dialogue and jump buttons. This is a separate audition; it is not wired into the play.

The heartbeat grows from 72 to 180 BPM, gets louder, and stops at the hallway cutaway. There is no ringing, music, or ambient bed. Marcus's reassurance about having a plan is cut. The original filmed police performances are preserved.

## Edit in an audio editor

Import **[stems/dialogue.flac](stems/dialogue.flac)** and **[stems/heartbeat.flac](stems/heartbeat.flac)**, both starting at **0:00**. They are lossless 48 kHz stereo tracks. `manifest.json` records the small overall gain used for the MP3's headroom.

`sources/` contains the original heartbeat, its two separate sounds, the new SJ recording, Marcus's shortened recording, and the dry knocks. [timeline.json](timeline.json) gives the cue IDs, recorded words, and positions in this audition. Those words describe the recordings; the play's authoring source remains `stage/show.json`.

## Rebuild or change the effect

Edit **[edit.json](edit.json)**, then run this from the repository folder:

```sh
python3 tools/rebuild_sj_sound.py
```

New MP3, lossless tracks, and timing metadata go into **`build/sj-sound/`**. The checked-in audition and live show are left alone. The first run builds the same Docker media image used by the news rebuild; later runs work offline. Nothing is installed on the host, and no API key is needed. Existing FFmpeg users can add `--native`.

Useful settings:

- `heartbeatGainDb`: effect volume; currently +6 dB.
- `startBpm`, `endBpm`: tempo at the start and peak.
- `heartbeatStartSeconds`, `peakTempoAtSeconds`, `heartbeatStopSeconds`: placement in this audition.
- `slowPairGapSeconds`, `fastPairGapSeconds`: the short gap inside each **bum-bum** pair, not the pause between pairs.
- `startPeakDb`, `endPeakDb`: how much the heartbeat grows.

When sharing another revision, include the settings, rebuilt mix, heartbeat stem, and manifest. If changing dialogue, replace the dialogue track and update the audition timeline too.

## Source

The heartbeat is adapted from **[HROgg.ogg](https://commons.wikimedia.org/wiki/File:HROgg.ogg)** by James Heilman, MD, released under **CC0 1.0**. The source recording and credit are included. The two extracted sounds have been filtered and balanced for the paired effect.
