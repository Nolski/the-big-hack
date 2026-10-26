# Real-news replacements for the AI news clips

Goal: for each AI-generated news clip in the play, find real broadcast news clips that could stand in for it after clever editing. Priority is recent hacking and cyber news (2025 to October 2026). Compiled 2026-10-25. Not part of the script.

The AI clips are in `stage/assets/filmed/news/raw/` (three-day/, collapse-to-trial/, sentencing/, interviews/). Their spoken lines are in `ai-clip-transcripts.json` in this folder. The montages they sit in are described in `stage/assets/filmed/news/rebuild.json` and `stage/assets/filmed/news/REBUILD.md`.

## What the play needs from each clip

These montages are audio-driven. The anchor's words carry the story; the picture is a newsroom, a field reporter, or B-roll. A replacement must deliver, in real spoken words, roughly what the AI line says. The fiction: an AI worm, started by accident, spreads across every system on Earth over three days, takes down cloud providers, airlines, power, and eventually a nuclear plant's cooling valve; weeks later the accused goes on trial, then is sentenced.

Audience: a security conference. Real incidents they recognise (AWS us-east-1, CrowdStrike, Shai-Hulud, Salt Typhoon, the Anthropic Claude Code espionage report, Collins Aerospace, the Iberian blackout) land harder than generic footage. An anchor getting the tech slightly wrong is a feature.

A replacement can be:

- **A single real clip** whose words say the thing. Best.
- **A splice** of two or three fragments from one broadcast or one anchor, cut so the sentence reads. Say exactly which fragments and in what order.
- **Picture from one source and sound from another** (the brownout clip in the collapse montage already does this). Say which.
- **A clip that says the opposite** only if a cut fixes it. "AWS says this was not a cyberattack" can lose its second half. Flag the risk.

Brand and incident names are allowed and usually good (AWS, Cloudflare, Heathrow). Dates, dead giveaways of a specific year, and "this was not a hack" lines are what to cut around. A clip whose chyron states a real date is fine if the date is not legible at 480p or can be cropped.

## Method

You cannot watch video or listen to audio. You can read captions and look at frames. Do this for every candidate you record.

1. **Find candidates.** WebSearch for the incident plus "anchor", "report", "news", the outlet's name, or the phrase you need. `yt-dlp "ytsearch8:<query>" --flat-playlist --print "%(id)s | %(title)s | %(channel)s | %(upload_date)s | %(duration)s"` lists YouTube results without downloading. Prefer the broadcaster's own channel (AP, Reuters, CBS, NBC, ABC, CNN, PBS, CNBC, Bloomberg, Fox, BBC, Sky News, ITV, Channel 4, DW, France 24, Al Jazeera, Euronews, CNA, ABC Australia, 9News, 7News, 1News, RNZ, Global News, CBC, CTV). Avoid reaction videos and watermarked re-uploads.
2. **Pull the captions first.** `yt-dlp --skip-download --write-auto-subs --write-subs --sub-langs en --sub-format vtt -o "subs/<name>" <url>` writes `subs/<name>.en.vtt`. Grep it for the words you need. Caption timestamps give you the window. Auto-captions duplicate lines; read the cue times, not the line count. Caption pulls are cheap; do these freely.
3. **Download picture only when it matters** (to confirm it is an anchor or field reporter and to read the chyron): `yt-dlp --no-playlist --sleep-interval 3 -f "bv*[height<=480][ext=mp4]/bv*[height<=480]/b[height<=480]" -o "raw/<name>.%(ext)s" <url>`. Keep to about 8 downloads. One download at a time. If YouTube refuses with a sign-in or bot wall, retry once with `--js-runtimes node --extractor-args "youtube:player_client=android"`; if that fails, record the URL with `"verified": "captions-only"` or `"unverified"` and move on. Never loop on retries. Broadcaster article pages (CBS, NBC, ABC, Sky, DW, Al Jazeera, ABC Australia, 1News) often give direct media when YouTube refuses.
4. **Look at the window.** `ffmpeg -y -ss <T> -i raw/<name>.mp4 -t 8 -vf "fps=1,scale=480:-1,tile=4x2" sheets/<name>-<T>.png` and view it with Read. Grab one full frame as proof: `ffmpeg -y -ss <T+2> -i raw/<name>.mp4 -frames:v 1 frames/<candidate>.png`, Read it, transcribe the chyron.
5. **Record it** in your section JSON.

Work in `research/news-replacements/`. Subfolders `subs/`, `raw/`, `sheets/`, `frames/`, `clips/` are gitignored. Candidate names: `<ai-clip>-<source>-<what>`, lowercase, hyphens.

## JSON

One file per section, `research/news-replacements/<section>.json`:

```json
{
  "section": "three-day-a",
  "generated": "2026-10-25",
  "aiClips": [
    {
      "aiClip": "three-day/01-hacking-campaign",
      "aiLine": "the transcript line",
      "candidates": [
        {
          "name": "01-cbs-anthropic-claude-hackers",
          "url": "https://www.youtube.com/watch?v=...",
          "publisher": "CBS News",
          "publication": "20251114",
          "event": "Anthropic report on Chinese state hackers automating attacks with Claude Code",
          "start": 12.0,
          "length": 9.5,
          "speaker": "anchor at desk | field reporter | expert on camera | voice over B-roll",
          "quote": "exact words spoken inside the window, from the captions",
          "onScreenText": "chyron text, or empty",
          "picture": "what the frame shows",
          "editPlan": "keep 12.0–16.5 and 20.1–25.0, drop the sentence naming the date; sound carries, picture is the anchor throughout",
          "fit": 4,
          "caveats": "says 'espionage' not 'worm'; mentions China",
          "verified": "frames | captions-only | unverified"
        }
      ],
      "nearestIfNothingFits": "one line, if no candidate reaches fit 3"
    }
  ]
}
```

`fit`: 5 = cut it in and it plays; 4 = one simple trim; 3 = splice of fragments; 2 = picture or chyron only, words don't fit; 1 = long shot.

Give two to four candidates per AI clip, best first. Be plain when nothing fits and say what the nearest fragments are. Record every URL you grep even if it fails, so nobody repeats it.
