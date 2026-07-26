#!/usr/bin/env python
"""The Big Hack — Storyboard backend.

A small FastAPI app that turns the play into a playable, editable storyboard.

Scenes are parsed *live* from the play's script markdown (the vault's
"03 - Script" folder, see script_parser.py) — the scripts are the single source
of truth. This file (storyboard.yaml) holds only the cast (voices) and the
generation settings. The app generates voice audio with Qwen3-TTS and a
period score with MusicGen on a GPU box (over SSH), and scene sketches with an
AI image model (OpenRouter).

Every connection detail (GPU host, interpreter, model names) is read from
settings and can be overridden by environment variables, so a different
operator can run their own models without editing any file:
    SB_TTS_HOST, SB_TTS_PYTHON, SB_TTS_WORKDIR, SB_TTS_GPU,
    SB_TTS_DESIGN_MODEL, SB_TTS_CLONE_MODEL, SB_TTS_LANGUAGE,
    SB_MUSIC_MODEL, SB_MUSIC_SECONDS, SB_IMAGE_MODEL, SB_SCRIPTS_DIR
"""
import os
import json
import base64
import subprocess
from pathlib import Path

import requests
from fastapi import FastAPI, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from ruamel.yaml import YAML

import script_parser

HERE = Path(__file__).resolve().parent
YAML_PATH = HERE / "storyboard.yaml"
ARTIFACTS = HERE / "artifacts"
STATIC = HERE / "static"
OVERRIDES_PATH = HERE / "overrides.json"
REMOTE_SCRIPT = HERE / "remote" / "tts_batch.py"
EXTRACT_SCRIPT = HERE / "remote" / "extract_vectors.py"
MUSIC_SCRIPT = HERE / "remote" / "music_gen.py"

for sub in ("voices", "narration", "lines", "sketches", "portraits", "vectors", "music"):
    (ARTIFACTS / sub).mkdir(parents=True, exist_ok=True)

yaml = YAML()
yaml.preserve_quotes = True
yaml.width = 4096

app = FastAPI(title="The Big Hack — Storyboard")


# --------------------------------------------------------------------------- #
# Config (cast + settings) load / save
# --------------------------------------------------------------------------- #
def load_cfg():
    with open(YAML_PATH) as f:
        return yaml.load(f)


CFG = load_cfg()


def persist_cfg():
    with open(YAML_PATH, "w") as f:
        yaml.dump(CFG, f)


def _env(name):
    v = os.environ.get(name)
    return v if v not in (None, "") else None


def settings():
    """Resolved settings = storyboard.yaml overlaid with environment overrides."""
    s = json.loads(json.dumps(CFG.get("settings", {})))
    tts = s.setdefault("tts", {})
    for key, var in (("host", "SB_TTS_HOST"), ("python", "SB_TTS_PYTHON"),
                     ("workdir", "SB_TTS_WORKDIR"), ("gpu", "SB_TTS_GPU"),
                     ("design_model", "SB_TTS_DESIGN_MODEL"),
                     ("clone_model", "SB_TTS_CLONE_MODEL"),
                     ("language", "SB_TTS_LANGUAGE")):
        if _env(var):
            tts[key] = _env(var)
    music = s.setdefault("music", {})
    if _env("SB_MUSIC_MODEL"):
        music["model"] = _env("SB_MUSIC_MODEL")
    if _env("SB_MUSIC_SECONDS"):
        music["seconds"] = int(_env("SB_MUSIC_SECONDS"))
    image = s.setdefault("image", {})
    if _env("SB_IMAGE_MODEL"):
        image["model"] = _env("SB_IMAGE_MODEL")
    if _env("SB_SCRIPTS_DIR"):
        s["scripts_dir"] = _env("SB_SCRIPTS_DIR")
    return s


def scripts_dir():
    raw = settings().get("scripts_dir", "../03 - Script")
    p = Path(raw)
    return p if p.is_absolute() else (HERE / p).resolve()


def characters():
    return CFG.setdefault("characters", [])


def find(seq, _id):
    for i, item in enumerate(seq):
        if item.get("id") == _id:
            return i, item
    return -1, None


def char_by_id(cid):
    return find(characters(), cid)[1]


VOICED = ("live", "video", "narration", "direction")


def is_voiceable(text):
    return bool(text and __import__("re").search(r"[A-Za-z0-9]", text))


# --------------------------------------------------------------------------- #
# Scene overrides (in-app edits, kept in a sidecar so the authored markdown
# stays the source of truth and is never rewritten by the app)
# --------------------------------------------------------------------------- #
def load_overrides():
    if OVERRIDES_PATH.exists():
        try:
            return json.loads(OVERRIDES_PATH.read_text())
        except Exception:
            pass
    return {"scenes": {}, "added": [], "deleted": []}


OVR = load_overrides()


def save_overrides():
    OVERRIDES_PATH.write_text(json.dumps(OVR, indent=2))


def _apply_overrides(scenes):
    out = [s for s in scenes if s["id"] not in OVR.get("deleted", [])]
    for s in out:
        ov = OVR.get("scenes", {}).get(s["id"])
        if not ov:
            continue
        for k, v in ov.items():
            if k in ("sketch", "music") and isinstance(v, dict):
                s.setdefault(k, {}).update(v)
            else:
                s[k] = v
    out += [dict(s) for s in OVR.get("added", []) if s["id"] not in OVR.get("deleted", [])]
    out.sort(key=lambda s: s.get("number", 999))
    return out


def _resolve_artifacts(scenes):
    """Fill artifact paths from disk (deterministic names) so generation results
    show up without the app ever writing them into the scripts."""
    for s in scenes:
        sid = s["id"]
        sk = s.setdefault("sketch", {})
        img = ARTIFACTS / "sketches" / f"{sid}.png"
        if img.exists():
            sk["image"] = f"sketches/{sid}.png"
        else:
            sk.pop("image", None)
        mu = s.setdefault("music", {})
        mwav = ARTIFACTS / "music" / f"{sid}.wav"
        if mwav.exists():
            mu["audio"] = f"music/{sid}.wav"
        else:
            mu.pop("audio", None)
        for line in s.get("lines", []):
            wav = ARTIFACTS / "lines" / f"{sid}_{line['id']}.wav"
            if wav.exists():
                line["audio"] = f"lines/{sid}_{line['id']}.wav"
            else:
                line.pop("audio", None)
        sset = ARTIFACTS / "narration" / f"{sid}_setting.wav"
        if (s.get("setting") or "").strip() and sset.exists():
            s["setting_audio"] = f"narration/{sid}_setting.wav"
        snar = ARTIFACTS / "narration" / f"{sid}.wav"
        if (s.get("narration") or "").strip() and snar.exists():
            s["narration_audio"] = f"narration/{sid}.wav"
    return scenes


def build_scenes():
    base = script_parser.load_scenes(
        scripts_dir(), characters(), CFG.get("aliases"))
    return _resolve_artifacts(_apply_overrides(base))


def get_scene(sid):
    _, scene = find(build_scenes(), sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    return scene


# --------------------------------------------------------------------------- #
# OpenRouter key
# --------------------------------------------------------------------------- #
def openrouter_key():
    key = os.environ.get("OPENROUTER_API_KEY")
    if key:
        return key
    cands = []
    if os.environ.get("AI_KEYS_FILE"):
        cands.append(Path(os.environ["AI_KEYS_FILE"]))
    cands += [HERE.parent.parent / "ai_keys", HERE.parent / "ai_keys",
              Path.home() / "Documents" / "presentation" / "ai_keys"]
    for cand in cands:
        if cand.exists():
            for line in cand.read_text().splitlines():
                if line.strip().startswith("openrouter"):
                    return line.split("=", 1)[1].strip()
    raise HTTPException(500, "No OpenRouter API key found (set OPENROUTER_API_KEY or ai_keys).")


# --------------------------------------------------------------------------- #
# TTS over SSH (batched)
# --------------------------------------------------------------------------- #
SSH_OPTS = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=10",
            "-o", "StrictHostKeyChecking=yes"]


def _ssh_base(host):
    return ["ssh", *SSH_OPTS, host]


def run_tts(items):
    if not items:
        return {}
    s = settings()["tts"]
    host = s["host"]
    workdir = s["workdir"]
    remote_script = f"{workdir}/_sb_tts_batch.py"

    subprocess.run(["scp", "-q", *SSH_OPTS, str(REMOTE_SCRIPT), f"{host}:{remote_script}"],
                   check=True, timeout=60)

    pushed = set()
    for it in items:
        if it.get("mode") == "xvector":
            vid = it["vector_id"]
            it["vector_path"] = f"_sb_out/vectors/{vid}.npy"
            if vid not in pushed:
                localv = ARTIFACTS / "vectors" / f"{vid}.npy"
                if not localv.exists():
                    raise HTTPException(400, f"No saved vector for '{vid}'. Extract vectors first.")
                subprocess.run(_ssh_base(host) + [f"mkdir -p {workdir}/_sb_out/vectors"],
                               check=True, timeout=30)
                subprocess.run(["scp", "-q", *SSH_OPTS, str(localv),
                                f"{host}:{workdir}/_sb_out/vectors/{vid}.npy"],
                               check=True, timeout=60)
                pushed.add(vid)

    job = {
        "design_model": s["design_model"],
        "clone_model": s["clone_model"],
        "language": s.get("language", "English"),
        "gpu": s.get("gpu", "auto"),
        "items": items,
    }

    proc = subprocess.run(
        _ssh_base(host) + [f"cd {workdir} && {s['python']} _sb_tts_batch.py"],
        input=json.dumps(job), capture_output=True, text=True,
        timeout=int(os.environ.get("SB_TTS_TIMEOUT", "7200")),
    )

    results = {}
    for line in proc.stdout.splitlines():
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if "out" in obj:
            results[obj["out"]] = obj

    for out, r in results.items():
        if r.get("ok"):
            local = ARTIFACTS / out
            local.parent.mkdir(parents=True, exist_ok=True)
            cp = subprocess.run(
                ["scp", "-q", *SSH_OPTS, f"{host}:{workdir}/_sb_out/{out}", str(local)],
                capture_output=True, text=True, timeout=120,
            )
            if cp.returncode != 0:
                r["ok"] = False
                r["error"] = f"scp back failed: {cp.stderr.strip()}"

    if not results and proc.returncode != 0:
        raise HTTPException(500, f"Remote TTS failed: {proc.stderr[-800:]}")
    return results


def voice_item(out, char, text):
    v = (char or {}).get("voice", {})
    mode = v.get("mode", "design")
    item = {"out": out, "mode": mode, "text": text, "seed": v.get("seed")}
    if mode == "xvector":
        item["vector_id"] = char["id"]
    elif mode == "clone":
        item["ref_audio"] = v.get("ref_audio")
    else:
        item["instruct"] = v.get("instruct", "")
    return item


def speaker_for_line(line):
    """The character voicing a line. Narrator reads narration AND stage directions."""
    if line.get("type") in ("narration", "direction"):
        return char_by_id("narrator")
    return char_by_id(line.get("speaker"))


# --------------------------------------------------------------------------- #
# Background music over SSH (MusicGen)
# --------------------------------------------------------------------------- #
def run_music(items):
    if not items:
        return {}
    s = settings()["tts"]
    music = settings().get("music", {})
    host, workdir = s["host"], s["workdir"]
    subprocess.run(["scp", "-q", *SSH_OPTS, str(MUSIC_SCRIPT),
                    f"{host}:{workdir}/_sb_music_gen.py"], check=True, timeout=60)
    job = {"model": music.get("model", "facebook/musicgen-medium"),
           "gpu": s.get("gpu", "auto"), "items": items}
    proc = subprocess.run(
        _ssh_base(host) + [f"cd {workdir} && {s['python']} _sb_music_gen.py"],
        input=json.dumps(job), capture_output=True, text=True, timeout=2400)
    results = {}
    for line in proc.stdout.splitlines():
        line = line.strip()
        if line.startswith("{"):
            try:
                o = json.loads(line)
                if "out" in o:
                    results[o["out"]] = o
            except json.JSONDecodeError:
                pass
    for out, r in results.items():
        if r.get("ok"):
            local = ARTIFACTS / out
            local.parent.mkdir(parents=True, exist_ok=True)
            cp = subprocess.run(
                ["scp", "-q", *SSH_OPTS, f"{host}:{workdir}/_sb_out/{out}", str(local)],
                capture_output=True, text=True, timeout=120)
            if cp.returncode != 0:
                r["ok"] = False
                r["error"] = f"scp back failed: {cp.stderr.strip()}"
    if not results and proc.returncode != 0:
        raise HTTPException(500, f"Remote music gen failed: {proc.stderr[-800:]}")
    return results


def music_prompt_for(scene):
    m = scene.get("music") or {}
    if m.get("prompt"):
        return m["prompt"]
    styles = settings().get("music", {}).get("styles", {})
    return styles.get(scene.get("world", "modern"), styles.get("modern", ""))


# --------------------------------------------------------------------------- #
# Image generation via OpenRouter
# --------------------------------------------------------------------------- #
def gen_image(prompt, out_relpath):
    key = openrouter_key()
    model = settings()["image"]["model"]
    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"model": model,
              "messages": [{"role": "user", "content": prompt}],
              "modalities": ["image", "text"]},
        timeout=180,
    )
    if resp.status_code != 200:
        raise HTTPException(502, f"Image API {resp.status_code}: {resp.text[:300]}")
    data = resp.json()
    msg = (data.get("choices") or [{}])[0].get("message", {})
    imgs = msg.get("images") or []
    if not imgs:
        raise HTTPException(502, f"No image returned: {json.dumps(data)[:300]}")
    url = imgs[0]["image_url"]["url"]
    b64 = url.split(",", 1)[1]
    out = ARTIFACTS / out_relpath
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(base64.b64decode(b64))
    return out_relpath


# --------------------------------------------------------------------------- #
# API: data
# --------------------------------------------------------------------------- #
@app.get("/api/storyboard")
def get_storyboard():
    return {
        "meta": json.loads(json.dumps(CFG.get("meta", {}))),
        "settings": settings(),
        "characters": json.loads(json.dumps(characters())),
        "scenes": build_scenes(),
    }


@app.put("/api/character/{cid}")
def update_character(cid: str, payload: dict = Body(...)):
    idx, char = find(characters(), cid)
    if char is None:
        raise HTTPException(404, "character not found")
    for k, v in payload.items():
        if k == "id":
            continue
        char[k] = v
    persist_cfg()
    return char


@app.post("/api/character")
def add_character(payload: dict = Body(...)):
    if not payload.get("id"):
        raise HTTPException(400, "id required")
    if find(characters(), payload["id"])[1] is not None:
        raise HTTPException(400, "id exists")
    characters().append(payload)
    persist_cfg()
    return payload


@app.delete("/api/character/{cid}")
def delete_character(cid: str):
    idx, char = find(characters(), cid)
    if char is None:
        raise HTTPException(404, "not found")
    characters().pop(idx)
    persist_cfg()
    return {"ok": True}


@app.put("/api/scene/{sid}")
def update_scene(sid: str, payload: dict = Body(...)):
    payload.pop("id", None)
    OVR.setdefault("scenes", {})[sid] = payload
    save_overrides()
    return get_scene(sid)


@app.post("/api/scene")
def add_scene(payload: dict = Body(...)):
    nums = [s.get("number", 0) for s in build_scenes()]
    n = (max(nums) if nums else 0) + 1
    payload.setdefault("id", f"s{n:02d}")
    payload.setdefault("number", n)
    payload.setdefault("lines", [])
    OVR.setdefault("added", []).append(payload)
    save_overrides()
    return payload


@app.delete("/api/scene/{sid}")
def delete_scene(sid: str):
    OVR.setdefault("deleted", [])
    if sid not in OVR["deleted"]:
        OVR["deleted"].append(sid)
    OVR.get("scenes", {}).pop(sid, None)
    OVR["added"] = [s for s in OVR.get("added", []) if s.get("id") != sid]
    save_overrides()
    return {"ok": True}


@app.post("/api/scenes/reorder")
def reorder_scenes(payload: dict = Body(...)):
    # Scene order follows the scripts' scene_number; reordering is a no-op.
    return {"ok": True}


# --------------------------------------------------------------------------- #
# API: generation
# --------------------------------------------------------------------------- #
@app.post("/api/generate/voice/{cid}")
def generate_voice(cid: str):
    char = char_by_id(cid)
    if char is None:
        raise HTTPException(404, "character not found")
    text = char.get("voice", {}).get("sample_text") or f"Hello, I am {char['name']}."
    out = f"voices/{cid}.wav"
    res = run_tts([voice_item(out, char, text)])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "generation failed"))
    char.setdefault("voice", {})["sample"] = out
    persist_cfg()
    return {"path": out, **r}


@app.post("/api/generate/sketch/{sid}")
def generate_sketch(sid: str):
    scene = get_scene(sid)
    style = settings()["image"].get("style", "")
    prompt = scene.get("sketch", {}).get("prompt", "")
    full = f"{style}\n\nScene: {scene.get('title','')}. {prompt}"
    out = f"sketches/{sid}.png"
    gen_image(full, out)
    return {"path": out}


@app.post("/api/generate/music/{sid}")
def generate_music(sid: str):
    scene = get_scene(sid)
    prompt = music_prompt_for(scene)
    secs = settings().get("music", {}).get("seconds", 24)
    out = f"music/{sid}.wav"
    res = run_music([{"out": out, "prompt": prompt,
                      "seconds": secs, "seed": (scene.get("number", 1)) * 7}])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "music generation failed"))
    return {"path": out, **r}


@app.post("/api/generate/music-all")
def generate_music_all(payload: dict = Body(default={})):
    only_missing = payload.get("only_missing", False)
    items, targets = [], []
    secs = settings().get("music", {}).get("seconds", 24)
    for scene in build_scenes():
        if only_missing and (scene.get("music") or {}).get("audio"):
            continue
        prompt = music_prompt_for(scene)
        if not prompt:
            continue
        out = f"music/{scene['id']}.wav"
        items.append({"out": out, "prompt": prompt, "seconds": secs,
                      "seed": scene.get("number", 1) * 7})
        targets.append(out)
    res = run_music(items)
    ok = sum(1 for o in targets if res.get(o, {}).get("ok"))
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/generate/portrait/{cid}")
def generate_portrait(cid: str):
    char = char_by_id(cid)
    if char is None:
        raise HTTPException(404, "character not found")
    style = settings()["image"].get("portrait_style", "")
    full = f"{style}\n\nCharacter: {char.get('name','')}. {char.get('description','')}"
    out = f"portraits/{cid}.png"
    gen_image(full, out)
    char["portrait"] = out
    persist_cfg()
    return {"path": out}


@app.post("/api/generate/scene-audio/{sid}")
def generate_scene_audio(sid: str):
    """Generate setting + narration + every voiced line for one scene in a batch."""
    scene = get_scene(sid)
    items, targets = [], []
    narrator = char_by_id("narrator")

    setting = (scene.get("setting") or "").strip()
    if setting:
        out = f"narration/{sid}_setting.wav"
        items.append(voice_item(out, narrator, setting))
        targets.append(out)
    narr = (scene.get("narration") or "").strip()
    if narr:
        out = f"narration/{sid}.wav"
        items.append(voice_item(out, narrator, narr))
        targets.append(out)
    for line in scene.get("lines", []):
        if line.get("type") not in VOICED:
            continue
        char = speaker_for_line(line)
        text = (line.get("text") or "").strip()
        if not char or not is_voiceable(text):
            continue
        out = f"lines/{sid}_{line['id']}.wav"
        items.append(voice_item(out, char, text))
        targets.append(out)

    res = run_tts(items)
    ok = sum(1 for o in targets if res.get(o, {}).get("ok"))
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/generate/line/{sid}/{lid}")
def generate_line(sid: str, lid: str):
    scene = get_scene(sid)
    line = next((l for l in scene.get("lines", []) if l["id"] == lid), None)
    if line is None:
        raise HTTPException(404, "line not found")
    char = speaker_for_line(line)
    if not char:
        raise HTTPException(400, "line has no valid speaker")
    out = f"lines/{sid}_{lid}.wav"
    res = run_tts([voice_item(out, char, (line.get("text") or "").strip())])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "generation failed"))
    return {"path": out, **r}


@app.post("/api/generate/voices-all")
def generate_voices_all(payload: dict = Body(default={})):
    """Generate every character voice sample in ONE model load."""
    only_missing = payload.get("only_missing", False)
    items, targets = [], []
    for c in characters():
        if only_missing and c.get("voice", {}).get("sample"):
            continue
        text = c.get("voice", {}).get("sample_text") or f"Hello, I am {c['name']}."
        out = f"voices/{c['id']}.wav"
        items.append(voice_item(out, c, text))
        targets.append((c["id"], out))
    res = run_tts(items)
    ok = 0
    for cid, out in targets:
        if res.get(out, {}).get("ok"):
            ok += 1
            char_by_id(cid).setdefault("voice", {})["sample"] = out
    persist_cfg()
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/vectors/extract-all")
def extract_vectors_all(payload: dict = Body(default={})):
    """Extract a reusable speaker x-vector from each character's voice sample."""
    only_missing = payload.get("only_missing", False)
    s = settings()["tts"]
    host, workdir = s["host"], s["workdir"]
    subprocess.run(["scp", "-q", *SSH_OPTS, str(EXTRACT_SCRIPT),
                    f"{host}:{workdir}/_sb_extract_vectors.py"], check=True, timeout=60)
    subprocess.run(_ssh_base(host) + [f"mkdir -p {workdir}/_sb_out/voices"],
                   check=True, timeout=30)

    items = []
    for c in characters():
        sample = c.get("voice", {}).get("sample")
        if not sample:
            continue
        if only_missing and c.get("voice", {}).get("vector"):
            continue
        local = ARTIFACTS / sample
        if not local.exists():
            continue
        remote_wav = f"{workdir}/_sb_out/{sample}"
        subprocess.run(["scp", "-q", *SSH_OPTS, str(local), f"{host}:{remote_wav}"],
                       check=True, timeout=60)
        items.append({"id": c["id"], "ref_audio": remote_wav})

    if not items:
        return {"extracted": 0, "total": 0, "results": {}}

    job = {"clone_model": s["clone_model"], "gpu": s.get("gpu", "auto"), "items": items}
    proc = subprocess.run(
        _ssh_base(host) + [f"cd {workdir} && {s['python']} _sb_extract_vectors.py"],
        input=json.dumps(job), capture_output=True, text=True, timeout=900)

    results = {}
    for line in proc.stdout.splitlines():
        line = line.strip()
        if line.startswith("{"):
            try:
                o = json.loads(line)
                if "id" in o:
                    results[o["id"]] = o
            except json.JSONDecodeError:
                pass

    ok = 0
    for cid, r in results.items():
        if not r.get("ok"):
            continue
        cp = subprocess.run(
            ["scp", "-q", *SSH_OPTS, f"{host}:{workdir}/_sb_out/vectors/{cid}.npy",
             str(ARTIFACTS / "vectors" / f"{cid}.npy")],
            capture_output=True, text=True, timeout=60)
        if cp.returncode != 0:
            r["ok"] = False
            r["error"] = f"scp back failed: {cp.stderr.strip()}"
            continue
        ok += 1
        v = char_by_id(cid).setdefault("voice", {})
        v["vector"] = f"vectors/{cid}.npy"
        v["mode"] = "xvector"
    persist_cfg()
    if not results and proc.returncode != 0:
        raise HTTPException(500, f"Vector extraction failed: {proc.stderr[-600:]}")
    return {"extracted": ok, "total": len(items), "results": results}


@app.post("/api/generate/audio-all")
def generate_audio_all(payload: dict = Body(default={})):
    """Generate setting + narration + every voiced line across the show in a batch."""
    only_missing = payload.get("only_missing", False)
    items, targets = [], []
    narrator = char_by_id("narrator")
    for scene in build_scenes():
        sid = scene["id"]
        setting = (scene.get("setting") or "").strip()
        if setting and not (only_missing and scene.get("setting_audio")):
            out = f"narration/{sid}_setting.wav"
            items.append(voice_item(out, narrator, setting))
            targets.append(out)
        narr = (scene.get("narration") or "").strip()
        if narr and not (only_missing and scene.get("narration_audio")):
            out = f"narration/{sid}.wav"
            items.append(voice_item(out, narrator, narr))
            targets.append(out)
        for line in scene.get("lines", []):
            if line.get("type") not in VOICED:
                continue
            char = speaker_for_line(line)
            text = (line.get("text") or "").strip()
            if not char or not is_voiceable(text):
                continue
            if only_missing and line.get("audio"):
                continue
            out = f"lines/{sid}_{line['id']}.wav"
            items.append(voice_item(out, char, text))
            targets.append(out)
    res = run_tts(items)
    ok = sum(1 for o in targets if res.get(o, {}).get("ok"))
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/generate/narration/{sid}")
def generate_narration(sid: str):
    scene = get_scene(sid)
    narr = (scene.get("narration") or "").strip()
    if not narr:
        raise HTTPException(400, "scene has no scene-level narration (narrator lines are inline)")
    out = f"narration/{sid}.wav"
    res = run_tts([voice_item(out, char_by_id("narrator"), narr)])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "generation failed"))
    return {"path": out, **r}


# --------------------------------------------------------------------------- #
# Scene Review — diff two git refs (or a ref vs the live working tree) and hear
# the before/after audio side by side. Git is read-only: a read-only .git is
# mounted at SB_GIT_DIR and we only ever run read-only plumbing (for-each-ref,
# rev-parse, ls-tree, show, archive). Committed refs are materialised on demand
# (scripts via `git archive` into a per-sha tmp cache; audio/sketch bytes via
# `git show`); the working tree is served live from ARTIFACTS.
# --------------------------------------------------------------------------- #
import io as _io                      # noqa: E402
import tarfile as _tarfile           # noqa: E402
import hashlib as _hashlib           # noqa: E402
import mimetypes as _mimetypes       # noqa: E402
from fastapi.responses import Response, FileResponse  # noqa: E402
import review_core                    # noqa: E402

GIT_DIR = os.environ.get("SB_GIT_DIR")
REVIEW_CACHE = Path("/tmp/bighack-review")
REVIEW_WORKING = "working"
ARTIFACT_PREFIX = "storyboard/artifacts"


def _review_enabled():
    return bool(GIT_DIR) and Path(GIT_DIR).exists()


def _git(*args, binary=False):
    # `-c safe.directory=*` avoids git's dubious-ownership refusal when the
    # host-owned .git is read by root inside the container.
    cmd = ["git", "-c", "safe.directory=*", "--git-dir", GIT_DIR, *args]
    return subprocess.run(cmd, capture_output=True, text=not binary)


def _review_refs():
    refs, seen = [], set()
    for scope in ("refs/heads", "refs/remotes"):
        r = _git("for-each-ref", "--format=%(refname:short)", scope)
        for ln in r.stdout.splitlines():
            b = ln.strip()
            if b and not b.endswith("/HEAD") and b not in seen:
                seen.add(b)
                refs.append(b)
    return refs


def _ref_scripts_dir(ref):
    """Export a committed ref's `03 - Script` subtree into a per-sha cache."""
    sha = _git("rev-parse", ref).stdout.strip()
    if not sha:
        raise HTTPException(404, f"unknown ref: {ref}")
    dest = REVIEW_CACHE / sha
    marker = dest / ".scripts_done"
    if not marker.exists():
        dest.mkdir(parents=True, exist_ok=True)
        p = subprocess.run(
            ["git", "-c", "safe.directory=*", "--git-dir", GIT_DIR,
             "archive", "--format=tar", ref, "--", "03 - Script"],
            capture_output=True)
        if p.returncode == 0 and p.stdout:
            with _tarfile.open(fileobj=_io.BytesIO(p.stdout)) as t:
                t.extractall(dest)
        marker.write_text("1")
    return dest / "03 - Script"


def _ref_artifact_set(ref):
    r = _git("ls-tree", "-r", "--name-only", ref, "--", ARTIFACT_PREFIX)
    return {ln.strip() for ln in r.stdout.splitlines() if ln.strip()}


def _review_side(ref):
    """Return scenes for a side with `_audio`/`_sketch` artifact-relative paths."""
    if ref == REVIEW_WORKING:
        scenes = build_scenes()
        for s in scenes:
            s["_sketch"] = (s.get("sketch") or {}).get("image")
            for ln in s.get("lines", []):
                ln["_audio"] = ln.get("audio")
        return scenes
    scenes = script_parser.load_scenes(
        _ref_scripts_dir(ref), characters(), CFG.get("aliases"))
    present = _ref_artifact_set(ref)
    for s in scenes:
        sid = s["id"]
        s["_sketch"] = (f"sketches/{sid}.png"
                        if f"{ARTIFACT_PREFIX}/sketches/{sid}.png" in present else None)
        for ln in s.get("lines", []):
            rel = f"lines/{sid}_{ln['id']}.wav"
            ln["_audio"] = rel if f"{ARTIFACT_PREFIX}/{rel}" in present else None
    return scenes


def _review_sketch_hash(ref, rel):
    if not rel:
        return None
    if ref == REVIEW_WORKING:
        p = ARTIFACTS / rel
        return _hashlib.md5(p.read_bytes()).hexdigest() if p.exists() else None
    r = _git("show", f"{ref}:{ARTIFACT_PREFIX}/{rel}", binary=True)
    return _hashlib.md5(r.stdout).hexdigest() if r.returncode == 0 and r.stdout else None


@app.get("/api/review/refs")
def api_review_refs():
    if not _review_enabled():
        raise HTTPException(503, "review disabled: SB_GIT_DIR not mounted")
    cur = _git("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
    return {"refs": _review_refs(), "current": cur, "working": REVIEW_WORKING}


@app.get("/api/review/diff")
def api_review_diff(before: str = "main", after: str = REVIEW_WORKING):
    if not _review_enabled():
        raise HTTPException(503, "review disabled: SB_GIT_DIR not mounted")
    a = _review_side(before)
    b = _review_side(after)
    return review_core.build_diff(a, b, before, after, "/api/review/media",
                                  _review_sketch_hash)


@app.get("/api/review/media")
def api_review_media(ref: str, path: str):
    if not _review_enabled():
        raise HTTPException(503, "review disabled")
    rel = path.lstrip("/")
    if ".." in rel.split("/") or rel.startswith("/"):
        raise HTTPException(400, "bad path")
    if ref == REVIEW_WORKING:
        target = (ARTIFACTS / rel).resolve()
        if not str(target).startswith(str(ARTIFACTS.resolve())) or not target.exists():
            raise HTTPException(404, "not found")
        return FileResponse(str(target))
    r = _git("show", f"{ref}:{ARTIFACT_PREFIX}/{rel}", binary=True)
    if r.returncode != 0 or not r.stdout:
        raise HTTPException(404, "not found")
    ctype = _mimetypes.guess_type(rel)[0] or "application/octet-stream"
    return Response(content=r.stdout, media_type=ctype,
                    headers={"Cache-Control": "no-store"})


# --------------------------------------------------------------------------- #
# Static + artifacts
# --------------------------------------------------------------------------- #
app.mount("/artifacts", StaticFiles(directory=str(ARTIFACTS)), name="artifacts")
app.mount("/", StaticFiles(directory=str(STATIC), html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8008)
