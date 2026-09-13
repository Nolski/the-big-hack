## Current shared-script source (September 13, 2026)

Read `SHARED_SCRIPT.md` at the repository root before editing script content. `stage/show.json` is the single current source for both apps; use `stage/script_store.py` for writes. Preserve cue IDs. Markdown scripts and storyboard overrides are historical only. This supersedes older source-of-truth and write-path instructions below; model, container and SSH constraints still apply.

# AGENTS.md — Storyboard generation contracts

This file is for **agents** (human or automated) that operate or extend the
storyboard's generation pipeline. It describes the system in terms of **model
architecture and model names**, the **data contracts**, and the **operating
procedure** — deliberately free of any specific host, IP, or path, since the box
you run on will differ from the one this was built on. Wherever a concrete value is
needed, it is read from `storyboard.yaml → settings`, never hard‑coded.

For the human walkthrough (install, UI, committing) see **[README.md](README.md)**.

---

## 1. Mental model

The orchestrator is a thin FastAPI app in a container. It owns no models. It:

1. reads/writes the single source of truth, `storyboard.yaml`, via `ruamel.yaml`
   (preserving formatting/comments);
2. delegates **speech** and **music** to a GPU host **over SSH** by copying a
   single self‑contained script and running it with the host's **pre‑existing**
   Python environment (no installs);
3. delegates **images** to a hosted **OpenRouter** image‑output model over HTTPS;
4. stores every result under `artifacts/` and records its path back into the YAML.

```
storyboard.yaml ⇄ FastAPI ──ssh/scp──► GPU host (speech + music, existing env)
                          └──https────► OpenRouter (image model)
```

Three generative model families, by architecture:

| Capability | Architecture | Default model name | Where it runs |
|---|---|---|---|
| Speech (TTS) | Qwen3‑TTS (autoregressive codec LM + flow/vocoder) | `Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign` (design) / `Qwen/Qwen3-TTS-12Hz-1.7B-Base` (clone/xvector) | GPU host, SSH |
| Background music | MusicGen (single‑stage transformer over EnCodec tokens) | `facebook/musicgen-medium` (fallbacks: `-large` → `-medium` → `-small`) | GPU host, SSH |
| Images (sketches/portraits) | Diffusion / multimodal image‑output model | `google/gemini-2.5-flash-image` (any OpenRouter image model) | OpenRouter API |

All three model names are config values in `settings`; swap them there. The GPU
scripts pick the freest CUDA device automatically (`settings.*.gpu: auto`, via
`nvidia-smi`), so the agent never assumes a device index.

---

## 2. The speech model (Qwen3‑TTS) — three modes

`remote/tts_batch.py` runs on the host. It reads a JSON job on **stdin**, loads
each needed checkpoint **once** (bf16, FlashAttention‑2), generates, frees VRAM
between checkpoints (it must coexist with whatever large LLM is resident), and
emits one JSON line per item plus a final `{"done": true}`.

Per‑item **mode** drives which checkpoint + call is used:

- **`design`** — *voice from a text description*. Uses the **VoiceDesign**
  checkpoint; item carries `instruct` (the voice description) + `text`. Use this to
  invent a brand‑new voice.
- **`xvector`** — *reproducible voice from a saved speaker embedding*. Uses the
  **Base** checkpoint with `VoiceClonePromptItem(x_vector_only_mode=True)` built
  from a **2048‑d x‑vector** loaded from `vector_path` (`.npy` on the host). No
  reference audio needed. **This is the canonical "make more lines in the same
  voice" path.**
- **`clone`** — *voice from a reference clip*. Uses the **Base** checkpoint with
  `ref_audio` (a wav path on the host), x‑vector‑only. Use when you only have a
  sample, not yet a saved vector.

`seed` (per item) perturbs delivery deterministically (`torch.manual_seed`).
`language` comes from `settings.tts.language`.

**Why x‑vectors are the heart of the system:** the x‑vector is a compact, file‑able
embedding that *is* the character's vocal identity. Extract it once, commit the
`.npy`, and every future line — across sessions and machines — renders in the exact
same voice. That is what makes the cast reproducible and portable.

### Extracting vectors — `remote/extract_vectors.py`
Loads the **Base** (clone) checkpoint and, per character, calls
`create_voice_clone_prompt(ref_audio=…, x_vector_only_mode=True)`, pulls
`ref_spk_embedding`, and saves `vectors/<id>.npy` (float32, dim 2048). The
orchestrator copies these back to `artifacts/vectors/` and flips each character's
`voice.mode` to `xvector` with `voice.vector` pointing at the file.

---

## 3. The music model (MusicGen)

`remote/music_gen.py` runs on the host via `transformers`
(`MusicgenForConditionalGeneration` + `AutoProcessor`, fp16). Reads a JSON job on
stdin, loads the model **with graceful downsizing** (requested → `medium` →
`small`) so it always fits in spare VRAM, then generates an **instrumental** bed
per item: `max_new_tokens = seconds × 50` (MusicGen runs at 50 tokens/sec),
`guidance_scale=3.0`, `do_sample=True`, optional `seed`. Output sample rate comes
from the model's EnCodec config.

Prompts are **period‑accurate by thread** (see the scenes' `music` field): e.g.
early‑19th‑century English folk for the historical strand, cold ambient/tech for
the modern strand, a fiddle‑and‑synth fusion at the convergence. Keep prompts
purely instrumental and era/mood‑specific; avoid named artists.

---

## 4. The image model (OpenRouter)

`server.py` posts to OpenRouter's chat/completions with `settings.image.model` and
extracts the returned image. It is used for two prompt archetypes:

- **Scene sketches** — monochrome pencil **storyboard** panels (from each scene's
  `sketch_prompt`). Keep them loose, cinematic, single‑frame, no text.
- **Character portraits** — pencil character studies (optional).

Any OpenRouter model that returns image output works; change the name in
`settings.image.model`. The key is resolved from `OPENROUTER_API_KEY` or an
`ai_keys` file (`openrouter = …`) — see README for mounting.

---

## 5. Configuration the agent must honor (`storyboard.yaml → settings`)

```yaml
settings:
  tts:
    host: <user>@<host-or-ssh-alias>   # SSH target; alias from ~/.ssh/config is fine
    python: <path to host python>      # must import: torch, qwen_tts, soundfile, librosa, numpy
    workdir: <writable dir on host>    # scratch; scripts create <workdir>/_sb_out/
    gpu: auto                          # or an explicit index
    design_model: Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign
    clone_model:  Qwen/Qwen3-TTS-12Hz-1.7B-Base
    language: English
  music: { model: facebook/musicgen-medium, seconds: 24 }
  image: { model: google/gemini-2.5-flash-image }
```

Hard rules:
- **Never install anything on the GPU host.** The host already has the model stack;
  the agent only `scp`s a script and runs it with `settings.tts.python`. If an
  import is missing, report it — do not `pip install` on the host.
- **Never hard‑code host/IP/paths.** Read them from `settings`.
- **SSH stays strict.** Connections use `StrictHostKeyChecking=yes` + `BatchMode`
  against the mounted `known_hosts`. Don't weaken this.
- **The container stays sealed.** Pinned deps installed `--no-deps`, base image
  pinned by digest. Don't add unpinned deps or run installs at runtime.

---

## 6. Host environment contract

`settings.tts.python` must be able to `import`:
`torch` (CUDA, bf16 + FlashAttention‑2), `qwen_tts`
(`Qwen3TTSModel`, `qwen_tts.inference.qwen3_tts_model.VoiceClonePromptItem`),
`transformers` (`MusicgenForConditionalGeneration`, `AutoProcessor`), `soundfile`,
`librosa`, `numpy`. `nvidia-smi` must be on PATH for `gpu: auto`. The host must have
free VRAM beside any resident LLM (scripts load one model at a time and free
between).

---

## 7. Job contracts (stdin JSON → stdout JSONL)

**TTS** (`tts_batch.py`):
```json
{ "design_model": "...", "clone_model": "...", "language": "English", "gpu": "auto",
  "items": [ { "out": "lines/s01_l1.wav", "mode": "xvector",
               "vector_path": "_sb_out/vectors/<id>.npy", "seed": 303, "text": "..." } ] }
```
Modes: `design` needs `instruct`; `clone` needs `ref_audio`; `xvector` needs
`vector_path`. → `{"out":..,"ok":true,"dur":..}` per item, then `{"done":true}`.

**Vectors** (`extract_vectors.py`):
```json
{ "clone_model": "...", "gpu": "auto",
  "items": [ { "id": "<id>", "ref_audio": "/abs/on/host.wav" } ] }
```
→ `{"id":..,"ok":true,"dim":2048}` per item, then `{"done":true}`.

**Music** (`music_gen.py`):
```json
{ "model": "facebook/musicgen-medium", "gpu": "auto",
  "items": [ { "out": "music/s02.wav", "prompt": "...", "seconds": 24, "seed": 7 } ] }
```
→ `{"out":..,"ok":true,"dur":..}` per item, then `{"done":true}`.

The orchestrator parses these lines; any `{"ok":false,"error":…}` surfaces in the
API response. Keep scripts emitting **one JSON object per line** and the final
`{"done":true}`.

---

## 8. Orchestrator API surface (`server.py`)

Read: `GET /api/storyboard`.
CRUD: `PUT/POST/DELETE /api/character[/{id}]`, `PUT/POST/DELETE /api/scene[/{id}]`,
`POST /api/scenes/reorder`.
Generation: `POST /api/generate/voice/{cid}`, `/sketch/{sid}`, `/music/{sid}`,
`/music-all`, `/portrait/{cid}`, `/scene-audio/{sid}`, `/narration/{sid}`,
`/line/{sid}/{lid}`, `/voices-all`, `/audio-all`; `POST /api/vectors/extract-all`.
Every write persists to `storyboard.yaml`; every artifact lands under `artifacts/`
and its path is written into the YAML.

---

## 9. Data model (`storyboard.yaml`)

- **characters[]**: `id`, `name`, `desc`, `voice{ mode: design|xvector|clone,
  instruct?, vector?, ref?, seed }`, `sample?`, `portrait?`.
- **scenes[]** (in braided running order): `id`, `title`, `world`
  (`historical|modern|convergence`), `beat`, `status`, `set` (spoken stage/set
  description), `narration` (narrator framing), `sketch_prompt`, `sketch`,
  `music` (instrumental prompt), `music_audio`, and `lines[]`.
- **lines[]**: `kind` (`live` actor | `video` on‑screen character | `narration` |
  `stage`), `who`, `text`, and `audio` (path) where spoken.
- Playback order per scene: **set → narration → lines**. The `world` field is what
  the player groups on for "all Modern" / "all Historical" threads.

---

## 10. Standard procedures

**Stand up the cast (once):**
1. `POST /api/generate/voices-all` — audition every character (design mode).
2. Adjust `voice.instruct`/`seed`, regenerate individuals as needed.
3. `POST /api/vectors/extract-all` — lock x‑vectors; characters flip to `xvector`.

**Fill a show:** `POST /api/generate/audio-all` (set + narration + all lines from
locked vectors), `/api/generate/music-all`, then sketches per scene.

**Add content in an existing voice:** add lines/scenes, then regenerate audio —
`xvector` mode reproduces the identical voice.

**Add a new character:** create with a `design` voice + `instruct`, generate a
sample, then `extract-all` again to mint its vector.

**Always:** persist to `storyboard.yaml`, keep artifact paths in sync, and commit
`storyboard.yaml` + `artifacts/` together so the staged show is reproducible on the
next machine.
