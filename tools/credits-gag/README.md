# Guardrail gag

A silent-film-style clip for the end of the show: someone asks Claude Code to
check the play's worm for technical accuracy, and the model's own safeguards
refuse the question. The joke is that this happened while the play was being
written — the session got flagged `[cyber]` for asking.

The clip is a mock-up of the interface, drawn in HTML and screenshotted frame
by frame. It is not a screen recording, so the text stays legible when it is
projected.

## Build it

```sh
tools/credits-gag/build.sh
```

The finished `guardrail-gag.mp4` and its working files go to
`build/credits-gag/`, which Git ignores. Nothing here is needed to edit or
present the play; the editor and presenter stay offline and stdlib-only.

It needs `ffmpeg`, `python3`, and `node` with Playwright's Chromium. The first
run downloads the keyboard samples described below. Set `OUT` to build
somewhere else.

To get the credits reel with this on the end, build the gag and hand it to the
credits tool:

```sh
tools/credits-gag/build.sh
python3 tools/make_credits.py --append build/credits-gag/guardrail-gag.mp4
```

## What the pieces do

- **`gag.html`** draws one frame at a time. `render(t)` paints the interface as
  it stands `t` seconds in, so every frame is reproducible and the renderer can
  take its time.
- **`keystrokes.js`** works out when each key is pressed. A constant rate reads
  as a machine, so each gap is weighted by what a hand has to do — the space
  bar, the first letter of a word, the apostrophe in `play's`, the comma, the
  capitals in `AI` — then jittered, with the occasional thinking pause. `TOTAL`
  sets how long the whole line takes; it is faster than a person can type,
  which is a montage convention rather than an accident.
- **`render.js`** screenshots the animated opening, then holds the last frame
  for 30 seconds. The held minute is two stills alternating on the cursor
  blink, rather than 720 identical screenshots.
- **`retrigger.py`** places one recorded keystroke per key, never the same
  sample twice running, with small gain and pitch variation. The space bar and
  Enter are pitched down and run louder. Tails overlap and sum, as on a real
  keyboard.

## Sources

The keyboard audio is retriggered from **Keyboard Soundpack #1** by
unicaegames (Inconsequentialist), released **CC0**, so it needs no credit on
screen: <https://opengameart.org/content/keyboard-soundpack-1-typing-and-single-keystrokes>

Only the 32 files in `Single Keys/` are used. The pack was recorded on a Cherry
KC 1000 with a Shure SM7B.

A genuinely mechanical source was tried and rejected: "Mechanical keyboard
sound" by bluszcz, CC-BY 3.0, <https://opengameart.org/node/60025>. Its two
files run about two seconds in total, which yielded only 13 usable strokes for
110 keys, and the repetition was audible.

The notice text follows the real one. The wording about cyber work is
reconstructed from Anthropic's support page on model fallback and from bug
reports quoting the `[cyber]` tag, not from a captured screenshot of the cyber
notice itself.
