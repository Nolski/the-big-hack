#!/usr/bin/env python
"""The Big Hack — Storyboard backend.

A small FastAPI app that turns the play's YAML into a playable, editable
storyboard: it manages characters + scenes, generates voice audio with
Qwen3-TTS on the GPU box (over SSH), renders scene sketches with an AI image
model (OpenRouter), and writes every artifact path back into storyboard.yaml so
the result can be committed.
"""
import os
import io
import re
import json
import base64
import shutil
import subprocess
import tempfile
from pathlib import Path

import requests
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from ruamel.yaml import YAML

HERE = Path(__file__).resolve().parent
YAML_PATH = HERE / "storyboard.yaml"
ARTIFACTS = HERE / "artifacts"
STATIC = HERE / "static"
REMOTE_SCRIPT = HERE / "remote" / "tts_batch.py"

for sub in ("voices", "narration", "lines", "sketches", "portraits", "vectors", "music"):
    (ARTIFACTS / sub).mkdir(parents=True, exist_ok=True)

EXTRACT_SCRIPT = HERE / "remote" / "extract_vectors.py"
MUSIC_SCRIPT = HERE / "remote" / "music_gen.py"

yaml = YAML()
yaml.preserve_quotes = True
yaml.width = 4096

app = FastAPI(title="The Big Hack — Storyboard")


# --------------------------------------------------------------------------- #
# Data load / save
# --------------------------------------------------------------------------- #
def load_doc():
    with open(YAML_PATH) as f:
        return yaml.load(f)


def save_doc(doc):
    with open(YAML_PATH, "w") as f:
        yaml.dump(doc, f)


DOC = load_doc()


def persist():
    save_doc(DOC)


def find(seq, _id):
    for i, item in enumerate(seq):
        if item.get("id") == _id:
            return i, item
    return -1, None


def settings():
    return DOC["settings"]


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
# Keep StrictHostKeyChecking on (verified against the mounted known_hosts) so a
# spoofed GPU host can't intercept the SSH session — part of the supply-chain
# hardening. BatchMode avoids any interactive prompt hanging the request.
SSH_OPTS = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=10",
            "-o", "StrictHostKeyChecking=yes"]


def _ssh_base(host):
    return ["ssh", *SSH_OPTS, host]


def run_tts(items):
    """items: list of dicts {out, mode, text, instruct|ref_audio, seed}.
    Generates on the remote GPU box and copies WAVs back into ARTIFACTS.
    Returns {out: {ok, dur?, error?}}.
    """
    if not items:
        return {}
    s = settings()["tts"]
    host = s["host"]
    workdir = s["workdir"]
    remote_script = f"{workdir}/_sb_tts_batch.py"

    # Push the latest generator script.
    subprocess.run(["scp", "-q", *SSH_OPTS, str(REMOTE_SCRIPT), f"{host}:{remote_script}"],
                   check=True, timeout=60)

    # For x-vector items, make sure the saved embedding is present on the host.
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
        input=json.dumps(job), capture_output=True, text=True, timeout=1800,
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

    # Pull back the successful files.
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
    v = char.get("voice", {})
    mode = v.get("mode", "design")
    item = {"out": out, "mode": mode, "text": text, "seed": v.get("seed")}
    if mode == "xvector":
        item["vector_id"] = char["id"]
    elif mode == "clone":
        item["ref_audio"] = v.get("ref_audio")
    else:
        item["instruct"] = v.get("instruct", "")
    return item


# --------------------------------------------------------------------------- #
# Background music over SSH (MusicGen)
# --------------------------------------------------------------------------- #
def run_music(items):
    """items: [{out, prompt, seconds, seed}]. Generates on the GPU box and copies
    WAVs back into ARTIFACTS. Returns {out: {ok, ...}}."""
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
    return json.loads(json.dumps(DOC))  # plain types for JSON


@app.put("/api/character/{cid}")
def update_character(cid: str, payload: dict = Body(...)):
    idx, char = find(DOC["characters"], cid)
    if char is None:
        raise HTTPException(404, "character not found")
    for k, v in payload.items():
        if k == "id":
            continue
        char[k] = v
    persist()
    return char


@app.post("/api/character")
def add_character(payload: dict = Body(...)):
    if not payload.get("id"):
        raise HTTPException(400, "id required")
    if find(DOC["characters"], payload["id"])[1] is not None:
        raise HTTPException(400, "id exists")
    DOC["characters"].append(payload)
    persist()
    return payload


@app.delete("/api/character/{cid}")
def delete_character(cid: str):
    idx, char = find(DOC["characters"], cid)
    if char is None:
        raise HTTPException(404, "not found")
    DOC["characters"].pop(idx)
    persist()
    return {"ok": True}


@app.put("/api/scene/{sid}")
def update_scene(sid: str, payload: dict = Body(...)):
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    for k, v in payload.items():
        if k == "id":
            continue
        scene[k] = v
    persist()
    return scene


@app.post("/api/scene")
def add_scene(payload: dict = Body(...)):
    if not payload.get("id"):
        # auto id
        n = len(DOC["scenes"]) + 1
        payload["id"] = f"s{n:02d}"
        payload.setdefault("number", n)
    DOC["scenes"].append(payload)
    persist()
    return payload


@app.delete("/api/scene/{sid}")
def delete_scene(sid: str):
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "not found")
    DOC["scenes"].pop(idx)
    persist()
    return {"ok": True}


@app.post("/api/scenes/reorder")
def reorder_scenes(payload: dict = Body(...)):
    order = payload.get("order", [])
    by_id = {s["id"]: s for s in DOC["scenes"]}
    new = [by_id[i] for i in order if i in by_id]
    for s in DOC["scenes"]:
        if s["id"] not in order:
            new.append(s)
    DOC["scenes"][:] = new
    for n, s in enumerate(DOC["scenes"], 1):
        s["number"] = n
    persist()
    return {"ok": True}


# --------------------------------------------------------------------------- #
# API: generation
# --------------------------------------------------------------------------- #
@app.post("/api/generate/voice/{cid}")
def generate_voice(cid: str):
    idx, char = find(DOC["characters"], cid)
    if char is None:
        raise HTTPException(404, "character not found")
    text = char.get("voice", {}).get("sample_text") or f"Hello, I am {char['name']}."
    out = f"voices/{cid}.wav"
    res = run_tts([voice_item(out, char, text)])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "generation failed"))
    char.setdefault("voice", {})["sample"] = out
    persist()
    return {"path": out, **r}


@app.post("/api/generate/sketch/{sid}")
def generate_sketch(sid: str):
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    style = settings()["image"].get("style", "")
    prompt = scene.get("sketch", {}).get("prompt", "")
    full = f"{style}\n\nScene: {scene.get('title','')}. {prompt}"
    out = f"sketches/{sid}.png"
    gen_image(full, out)
    scene.setdefault("sketch", {})["image"] = out
    persist()
    return {"path": out}


@app.post("/api/generate/music/{sid}")
def generate_music(sid: str):
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    prompt = music_prompt_for(scene)
    secs = settings().get("music", {}).get("seconds", 24)
    out = f"music/{sid}.wav"
    res = run_music([{"out": out, "prompt": prompt,
                      "seconds": secs, "seed": (idx + 1) * 7}])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "music generation failed"))
    m = scene.setdefault("music", {})
    m["prompt"] = prompt  # persist the resolved prompt so it's editable
    m["audio"] = out
    persist()
    return {"path": out, **r}


@app.post("/api/generate/music-all")
def generate_music_all(payload: dict = Body(default={})):
    only_missing = payload.get("only_missing", False)
    items, targets = [], []
    secs = settings().get("music", {}).get("seconds", 24)
    for i, scene in enumerate(DOC["scenes"]):
        if only_missing and (scene.get("music") or {}).get("audio"):
            continue
        prompt = music_prompt_for(scene)
        if not prompt:
            continue
        out = f"music/{scene['id']}.wav"
        items.append({"out": out, "prompt": prompt, "seconds": secs, "seed": (i + 1) * 7})
        targets.append((scene["id"], out, prompt))
    res = run_music(items)
    ok = 0
    for sid, out, prompt in targets:
        if not res.get(out, {}).get("ok"):
            continue
        ok += 1
        _, scene = find(DOC["scenes"], sid)
        m = scene.setdefault("music", {})
        m["prompt"] = prompt
        m["audio"] = out
    persist()
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/generate/portrait/{cid}")
def generate_portrait(cid: str):
    idx, char = find(DOC["characters"], cid)
    if char is None:
        raise HTTPException(404, "character not found")
    style = settings()["image"].get("portrait_style", "")
    full = f"{style}\n\nCharacter: {char.get('name','')}. {char.get('description','')}"
    out = f"portraits/{cid}.png"
    gen_image(full, out)
    char["portrait"] = out
    persist()
    return {"path": out}


def char_by_id(cid):
    return find(DOC["characters"], cid)[1]


@app.post("/api/generate/scene-audio/{sid}")
def generate_scene_audio(sid: str):
    """Generate narration + every voiced line for one scene in a single batch."""
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    items, targets = [], []
    narrator = char_by_id("narrator")

    setting = (scene.get("setting") or "").strip()
    if setting:
        out = f"narration/{sid}_setting.wav"
        items.append(voice_item(out, narrator, setting))
        targets.append(("setting", None, out))

    narr = (scene.get("narration") or "").strip()
    if narr:
        out = f"narration/{sid}.wav"
        items.append(voice_item(out, narrator, narr))
        targets.append(("narration", None, out))

    for line in scene.get("lines", []):
        if line.get("type") not in ("live", "video"):
            continue
        char = char_by_id(line.get("speaker"))
        text = (line.get("text") or "").strip()
        if not char or not text:
            continue
        out = f"lines/{sid}_{line['id']}.wav"
        items.append(voice_item(out, char, text))
        targets.append(("line", line["id"], out))

    res = run_tts(items)
    ok = 0
    for kind, lid, out in targets:
        r = res.get(out, {})
        if not r.get("ok"):
            continue
        ok += 1
        if kind == "setting":
            scene["setting_audio"] = out
        elif kind == "narration":
            scene["narration_audio"] = out
        else:
            _, line = next(((i, l) for i, l in enumerate(scene["lines"])
                            if l["id"] == lid), (None, None))
            if line is not None:
                line["audio"] = out
    persist()
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/generate/line/{sid}/{lid}")
def generate_line(sid: str, lid: str):
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    line = next((l for l in scene.get("lines", []) if l["id"] == lid), None)
    if line is None:
        raise HTTPException(404, "line not found")
    char = char_by_id(line.get("speaker"))
    if not char:
        raise HTTPException(400, "line has no valid speaker")
    out = f"lines/{sid}_{lid}.wav"
    res = run_tts([voice_item(out, char, (line.get("text") or "").strip())])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "generation failed"))
    line["audio"] = out
    persist()
    return {"path": out, **r}


@app.post("/api/generate/voices-all")
def generate_voices_all(payload: dict = Body(default={})):
    """Generate every character voice sample in ONE model load."""
    only_missing = payload.get("only_missing", False)
    items, targets = [], []
    for c in DOC["characters"]:
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
    persist()
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/vectors/extract-all")
def extract_vectors_all(payload: dict = Body(default={})):
    """Extract a reusable speaker x-vector from each character's voice sample and
    save it (artifacts/vectors/<id>.npy). Switches the character to 'xvector' mode
    so all future lines render from the saved vector — reproducible + reusable."""
    only_missing = payload.get("only_missing", False)
    s = settings()["tts"]
    host, workdir = s["host"], s["workdir"]
    subprocess.run(["scp", "-q", *SSH_OPTS, str(EXTRACT_SCRIPT),
                    f"{host}:{workdir}/_sb_extract_vectors.py"], check=True, timeout=60)
    subprocess.run(_ssh_base(host) + [f"mkdir -p {workdir}/_sb_out/voices"],
                   check=True, timeout=30)

    items = []
    for c in DOC["characters"]:
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
    persist()
    if not results and proc.returncode != 0:
        raise HTTPException(500, f"Vector extraction failed: {proc.stderr[-600:]}")
    return {"extracted": ok, "total": len(items), "results": results}


@app.post("/api/generate/audio-all")
def generate_audio_all(payload: dict = Body(default={})):
    """Generate narration + every voiced line across the whole show in one batch."""
    only_missing = payload.get("only_missing", False)
    items, targets = [], []
    narrator = char_by_id("narrator")
    for scene in DOC["scenes"]:
        setting = (scene.get("setting") or "").strip()
        if setting and not (only_missing and scene.get("setting_audio")):
            out = f"narration/{scene['id']}_setting.wav"
            items.append(voice_item(out, narrator, setting))
            targets.append(("setting", scene["id"], None, out))
        narr = (scene.get("narration") or "").strip()
        if narr and not (only_missing and scene.get("narration_audio")):
            out = f"narration/{scene['id']}.wav"
            items.append(voice_item(out, narrator, narr))
            targets.append(("narration", scene["id"], None, out))
        for line in scene.get("lines", []):
            if line.get("type") not in ("live", "video"):
                continue
            char = char_by_id(line.get("speaker"))
            text = (line.get("text") or "").strip()
            if not char or not text:
                continue
            if only_missing and line.get("audio"):
                continue
            out = f"lines/{scene['id']}_{line['id']}.wav"
            items.append(voice_item(out, char, text))
            targets.append(("line", scene["id"], line["id"], out))
    res = run_tts(items)
    ok = 0
    for kind, sid, lid, out in targets:
        if not res.get(out, {}).get("ok"):
            continue
        ok += 1
        _, scene = find(DOC["scenes"], sid)
        if kind == "setting":
            scene["setting_audio"] = out
        elif kind == "narration":
            scene["narration_audio"] = out
        else:
            line = next((l for l in scene["lines"] if l["id"] == lid), None)
            if line is not None:
                line["audio"] = out
    persist()
    return {"generated": ok, "total": len(targets), "results": res}


@app.post("/api/generate/narration/{sid}")
def generate_narration(sid: str):
    idx, scene = find(DOC["scenes"], sid)
    if scene is None:
        raise HTTPException(404, "scene not found")
    narr = (scene.get("narration") or "").strip()
    if not narr:
        raise HTTPException(400, "scene has no narration text")
    out = f"narration/{sid}.wav"
    res = run_tts([voice_item(out, char_by_id("narrator"), narr)])
    r = res.get(out, {})
    if not r.get("ok"):
        raise HTTPException(500, r.get("error", "generation failed"))
    scene["narration_audio"] = out
    persist()
    return {"path": out, **r}


# --------------------------------------------------------------------------- #
# Static + artifacts
# --------------------------------------------------------------------------- #
app.mount("/artifacts", StaticFiles(directory=str(ARTIFACTS)), name="artifacts")
app.mount("/", StaticFiles(directory=str(STATIC), html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8008)
