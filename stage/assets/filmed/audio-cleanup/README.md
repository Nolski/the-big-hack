# Cleaned filmed dialogue

These are the original generated performances, cleaned with ElevenLabs Voice
Isolator and then gently equalized, compressed and normalized to about −16 LUFS.
No new police, judge, prosecutor or reporter dialogue was synthesized.

`edits.json` identifies all 14 inputs and requested trims. Each clip has a JSON
record with its source hash, exact cuts, audio filters and output hash. The
`isolated/` folder preserves the clean voice stems for further adjustment.
Original videos remain at their original paths.

To adjust an edit, change `edits.json` and run:

```sh
python3 tools/clean_film_audio.py
```

This uses existing FFmpeg and Python's standard library; it installs nothing.
Matching outputs are skipped. Existing isolated stems are reused for new trims
and level changes. Generating a missing stem sends its source audio to ElevenLabs
and requires an `ELEVENLABS_API_KEY` environment variable and account credits.
Keep keys outside the repository.

The current play points directly at the cleaned on-call and police/court films.
The news clips feed the three-day montage through
`stage/assets/filmed/news/rebuild.json`. After changing news sources, rebuild that
montage as described in the adjacent news `REBUILD.md`; preserve its music,
date cards and picture/sound lead-ins.

Judge cuts: `s23_l25` starts at 1.9 seconds; `s23_l27` loses its first 0.5 and last
1.5 seconds; `s23_l49` starts at 2.8 seconds. The hacking-campaign and reinfection
reports each lose their last 1.5 seconds.
