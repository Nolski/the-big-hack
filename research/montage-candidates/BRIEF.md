# Clip-gathering brief

Goal: a pool of 1–5 second silent clips for a 2026 montage. Subjects are in `research/2026 Montage Subjects.md`. Each agent takes one section of that file and produces `research/montage-candidates/<section>.json` plus cut clips and proof frames.

Today is 2026-10-23. The montage plays with no audio. Every clip must work on picture alone.

## What a usable clip looks like

- Something is visibly happening: a crowd moving, water through a street, a house alight, a police line, horses at a gate, a person at a lectern, an excavator, boxes carried out, a queue.
- Or a headline, chyron, or lower third that states the event or the number in plain words, legible at 480p.
- Both together is best. A talking head with no caption is useless. A studio anchor is useless unless the graphic behind them states the story.
- Window length 1–5 s. Prefer 2–4 s. Start on a settled frame, not mid-cut.
- 16:9 broadcast footage preferred. Vertical phone video is allowed when it is the only record of the event; say so.
- Avoid aggregator re-uploads with burned-in watermarks or reaction-video framing. Prefer the broadcaster's own channel (AP, Reuters, ABC, PBS, NBC, CBS, France 24, Al Jazeera, Guardian, BBC, RNZ, 1News, ABC Australia, SBS, 9News, 7News, Sky News Australia, Stuff, NZ Herald).
- Record whether the pictures are of the actual event or file footage. File footage is allowed if the chyron carries the story, but say so.

## Never

- Identifiable dead or dying people. Aftermath, not the moment.
- Footage from inside a shooting, or of victims being treated.
- Children's faces in the deepfake-in-schools items. Use school gates, letters home, eSafety graphics.
- Clips whose meaning depends on hearing what is said.

## Method

You cannot watch video. You can look at frames. Do this for every clip you record.

1. Find candidates. `yt-dlp "ytsearch8:<query>" --flat-playlist --print "%(id)s | %(title)s | %(channel)s | %(upload_date)s | %(duration)s"` lists results without downloading. Web search for the outlet's own report also works; many outlets post the same package to YouTube. Prefer uploads dated within days of the event.
2. Download video only, small: `yt-dlp --no-playlist --sleep-interval 2 -f "bv*[height<=480][ext=mp4]/bv*[height<=480]/b[height<=480]" -o "raw/<name>.%(ext)s" <url>`. Keep to about 12 downloads per agent. If YouTube refuses with a sign-in or bot check, record the URL with `"verified": false` and move on; do not retry in a loop.
3. Contact sheet: `ffmpeg -y -i raw/<name>.mp4 -vf "fps=1/2,scale=480:-1,tile=5x4" sheets/<name>-%02d.png`. Each sheet covers 40 s. Tile k (0-based, row-major) in sheet s (1-based) is at t = 40·(s−1) + 2·k seconds. View the sheets with the Read tool.
4. Zoom on a window: `ffmpeg -y -ss <T> -i raw/<name>.mp4 -t 6 -vf "fps=2,scale=480:-1,tile=6x2" sheets/<name>-zoom.png`. Confirm the action and read the chyron. Then grab one full-size frame as proof: `ffmpeg -y -ss <T+1> -i raw/<name>.mp4 -frames:v 1 frames/<clipname>.png` and Read it to transcribe any on-screen text.
5. Cut: `ffmpeg -y -ss <start> -i raw/<name>.mp4 -t <length> -an -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart clips/<clipname>.mp4`.
6. Record it in the section JSON.

Work in `research/montage-candidates/`. Subfolders `raw/`, `sheets/`, `frames/`, `clips/`. Clip names: `<section-prefix>-<subject>-<what>.mp4`, lowercase, hyphens.

## JSON

One file per section, `research/montage-candidates/<section>.json`:

```json
{
  "section": "aotearoa-new-zealand",
  "generated": "2026-10-23",
  "subjects": [
    {
      "subject": "Sep 15 horse hīkoi to Parliament",
      "clips": [
        {
          "name": "nz-hikoi-horses-gates",
          "url": "https://www.youtube.com/watch?v=...",
          "publisher": "1News",
          "publication": "20260915",
          "date": "2026-09-15",
          "start": 12.0,
          "length": 3.0,
          "shows": "riders on horseback at the Parliament gates, crowd behind",
          "onScreenText": "exact chyron text, or empty",
          "quote": "any words spoken during the window, or empty",
          "readsSilent": "one line on why it works with no sound",
          "actualEvent": true,
          "aspect": "16:9",
          "file": "clips/nz-hikoi-horses-gates.mp4",
          "frame": "frames/nz-hikoi-horses-gates.png",
          "verified": true,
          "caveats": ""
        }
      ],
      "searched": "queries tried, what came up empty",
      "unverified": ["URLs worth a human look that could not be downloaded or checked"]
    }
  ]
}
```

`url`, `start`, `length`, `date`, `publication`, `quote` match the keys in `stage/assets/filmed/time-jumps-v6-edit.json`, so a selection can be lifted into an edit list.

Aim for 2–4 verified clips per subject, more for the strong ones. Zero is an honest answer; write what you searched. Do not pad with weak clips. Do not record a clip you have not looked at in frames.
