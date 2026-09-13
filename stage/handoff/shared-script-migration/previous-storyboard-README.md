# The Big Hack — Storyboard

A small, containerized app that turns the play's YAML into a **playable, editable
storyboard**. It fills the missing gaps with AI — character **voices**, scene
**sketches**, period‑accurate **background music**, and an **AI narrator** that
frames every scene — so you can hit *Play* and watch the YAML come to life, then
edit scenes, add new ones, regenerate artifacts, and re‑commit the result.

![cold open](artifacts/sketches/s01.png)

> Looking to run or extend the generation pipeline as an automated agent? See
> **[AGENTS.md](AGENTS.md)** — it describes the model architecture, the model
> names, and the exact contracts, with no machine‑specific assumptions.

---

## What it does

- **Cast & Voices** — every character has a text‑to‑speech voice. Generate /
  regenerate a sample, switch between *design* (describe the voice in words),
  *vector* (a locked speaker embedding), and *clone* (mimic a reference clip), and
  change the **seed** (shifts the delivery). Optional pencil portraits.
- **Locked voice vectors (reusable).** "Lock voices → vectors" extracts a speaker
  **x‑vector** from each character's sample and saves it to
  `artifacts/vectors/<id>.npy`. The character flips to `xvector` mode, so every new
  line renders in the *exact same voice* — that's how you "make more." The vectors
  are committed with the repo, so the cast travels with the play.
- **Storyboard** — each scene is a card with an AI sketch, a spoken stage/set
  description, narrator framing, a period music bed, and a line‑by‑line script
  (live actor / on‑screen character / narration / stage direction). Edit anything,
  add/delete lines and scenes, regenerate any artifact.
- **Background score (period‑accurate).** Each scene gets an instrumental bed —
  1810s English folk for the historical thread, cold ambient tech for the modern
  thread, a fiddle/synth fusion for the convergence. It loops quietly under the
  dialogue during playback.
- **Play** — pick a scene, the whole show, or one whole **thread** (all Modern, or
  all Historical, pulled out of the interwoven running order). The stage shows the
  sketch, the music loops underneath, and each scene plays:
  **set description → narrator framing → dialogue lines**, with captions. Lines
  without audio hold on screen so the read still flows.
- **Everything saves to `storyboard.yaml`** with artifact paths, so the audio, art,
  music, and vectors are all committable alongside the play.

---

## Prerequisites

1. **Docker** (Desktop or Engine) + Docker Compose. The app runs entirely in a
   container; nothing is installed on your machine.
2. **A GPU host you can reach over SSH** that already has the speech / music model
   stack installed (PyTorch, `qwen_tts`, `transformers`, `soundfile`, `librosa`,
   `numpy`). The app **never installs anything on that host** — it copies a script
   over and runs it with the host's existing Python. See AGENTS.md for the exact
   environment contract.
3. **An SSH key** in `~/.ssh` that can log into the GPU host non‑interactively.
4. **An OpenRouter API key** for image generation (sketches/portraits).

---

## Setup

### 1. Point it at your GPU host
Edit `storyboard.yaml → settings.tts`:

```yaml
settings:
  tts:
    host: <user>@<your-gpu-host>          # anything your SSH config can resolve
    python: /path/to/python               # interpreter that has qwen_tts etc.
    workdir: /path/on/host/for/scratch    # writable dir on the host
    gpu: auto                             # "auto" (freest card) or an index like 0
    design_model: Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign
    clone_model:  Qwen/Qwen3-TTS-12Hz-1.7B-Base
    language: English
  music:
    model: facebook/musicgen-medium       # or -large (needs more VRAM) / -small
    seconds: 24
  image:
    model: google/gemini-2.5-flash-image  # any OpenRouter image-output model
```

`host` can be a literal `user@ip`, or — better for portability — an alias from your
`~/.ssh/config` (e.g. `host: gpubox`). The container mounts `~/.ssh` read‑only, so
your config, key, and `known_hosts` all apply inside it.

The values in `storyboard.yaml` are intentionally placeholders so no real host
gets committed. Keep your real connection details **out of git** by either:

- setting env vars (`SB_TTS_HOST`, `SB_TTS_PYTHON`, `SB_TTS_WORKDIR`, …), or
- creating a local, untracked `docker-compose.override.yml` (gitignored) that
  injects them — `docker compose` auto-merges it:

```yaml
# storyboard/docker-compose.override.yml  (not committed)
services:
  storyboard:
    environment:
      - SB_TTS_HOST=user@your-gpu-host
      - SB_TTS_PYTHON=/path/to/python
      - SB_TTS_WORKDIR=/path/to/workdir
```

### 2. Provide the OpenRouter key
Either set `OPENROUTER_API_KEY` in the container environment, or drop it in a file
the compose mounts. By default `docker-compose.yml` mounts `../../ai_keys` to
`/run/secrets/ai_keys` and points `AI_KEYS_FILE` at it; that file just needs a line:

```
openrouter = sk-or-v1-...
```

Adjust the mount path in `docker-compose.yml` to wherever your key lives.

### 3. Run it

```bash
cd storyboard
docker compose up -d --build
# open http://localhost:8011
```

The app binds to `127.0.0.1:8011` (change the published port in
`docker-compose.yml` if it clashes).

---

## Using it

Open **http://localhost:8011**. Three tabs:

- **Storyboard** — the scene grid. Click a scene to edit it (title, world, beat,
  status, set, narrator framing, sketch prompt, music prompt, and the line script).
  Per‑scene buttons regenerate the sketch, the music, a single line, or all the
  scene's audio. **▶ Play scene** auditions the scene with music. Top‑bar buttons
  bulk‑generate missing audio / sketches / music across the whole show.
- **Cast & Voices** — character cards. Click to edit voice settings and generate a
  sample. **🔒 Lock voices → vectors** extracts and saves the reusable speaker
  vector for every character (do this once after you're happy with the samples).
- **Play** — *Play whole show*, *Play all Modern*, *Play all Historical*, or any
  single scene.

### Typical first run
1. **Cast & Voices →** *Generate missing voices* (auditions every character).
2. Tweak any voice (description + seed), regenerate until happy.
3. **Cast & Voices →** *Lock voices → vectors* (locks the cast).
4. **Storyboard →** *Generate all audio* (renders set + narration + every line from
   the locked vectors), *Generate missing sketches*, *Generate missing music*.
5. **Play →** *Play whole show*.

### Making more lines in a saved voice
Once vectors are locked, just add lines/scenes (in the UI or `storyboard.yaml`) and
hit **Generate all audio** (or regenerate a single line). They render in the
identical voice. To mint a *new* character: generate a design voice from a
description, then **Lock voices → vectors** again.

---

## Committing your work
`storyboard.yaml` and everything under `artifacts/` (audio, sketches, music,
vectors) are meant to be committed so the staged show travels with the repo:

```bash
git add storyboard
git commit -m "storyboard: update scenes + regenerate artifacts"
```

(Artifacts are sizeable — ~100 MB. If you'd rather keep them out of git, add
`storyboard/artifacts/` to `.gitignore`; the app regenerates them from
`storyboard.yaml`.)

---

## Architecture (short)

```
 browser ──HTTP──► FastAPI (Docker container)
                       │
                       ├── ruamel.yaml  ── storyboard.yaml  (+ artifacts/)
                       ├── ssh/scp ─────► GPU host: Qwen3-TTS (speech) + MusicGen (music)
                       └── https ───────► OpenRouter image model (sketches)
```

The container is just "pinned deps + an SSH client." All heavy generation happens
on the GPU host (over SSH, using its pre‑installed env) or via OpenRouter. Full
model details and the agent‑facing contracts are in **[AGENTS.md](AGENTS.md)**.

### Security / supply‑chain posture
- **Nothing is installed on the GPU host** — only a script is copied and run with
  the pre‑existing environment.
- **The orchestrator is fully containerized** — no Python deps touch your machine.
  Deps are pinned exactly (installed `--no-deps`), the base image is pinned by
  digest, and the one apt package comes from Debian's signed repos.
- SSH keeps `StrictHostKeyChecking=yes` against your mounted `known_hosts`; the key
  and the API key are mounted read‑only; the port binds to localhost.

---

## Layout

```
storyboard/
├── storyboard.yaml        # the play: settings, characters (voices), scenes (lines/art/music)
├── server.py              # FastAPI: CRUD + generation + saving
├── remote/                # runs ON the GPU host (existing env only)
│   ├── tts_batch.py       #   speech: design / xvector / clone
│   ├── extract_vectors.py #   pull a reusable speaker x-vector from a sample
│   └── music_gen.py       #   MusicGen background score
├── static/                # the SPA (index.html, app.js, style.css)
├── artifacts/             # voices/ narration/ lines/ sketches/ portraits/ vectors/ music/
├── Dockerfile · docker-compose.yml · requirements.txt
├── README.md              # this file (human docs)
└── AGENTS.md              # model architecture + agent contracts
```

---

## Troubleshooting
- **Container restarts / 000 on health** — almost always a malformed
  `storyboard.yaml`. Validate it: `docker compose run --rm storyboard python -c "from ruamel.yaml import YAML; YAML().load(open('storyboard.yaml'))"`.
  Then `docker compose up -d --force-recreate`.
- **TTS/music CUDA OOM** — the chosen model doesn't fit the spare VRAM. Use a
  smaller model (`facebook/musicgen-medium`/`-small`) or pin `settings.tts.gpu` to a
  freer card. MusicGen auto‑falls back to a smaller size.
- **SSH errors** — confirm `ssh <host>` works from your shell first; the container
  reuses the same `~/.ssh`. Host‑key prompts mean the host isn't in `known_hosts`.
- **Image errors** — check the OpenRouter key and that `settings.image.model` is a
  current image‑output model.
