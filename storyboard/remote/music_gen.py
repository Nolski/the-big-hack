#!/usr/bin/env python
"""Batched background-music generation with MusicGen (open source, via transformers).

Reads a JSON job from stdin and writes WAVs into <workdir>/_sb_out/music/.
Loads MusicGen once, generates an instrumental bed per item from a text prompt.

Job: {"model": "facebook/musicgen-large", "gpu": "auto",
      "items": [{"out": "music/s02.wav", "prompt": "...", "seconds": 24, "seed": 7}]}

Prints {"out":..,"ok":true,"dur":..} / {"out":..,"ok":false,"error":..} then {"done":true}.
"""
import sys, os, json, time, gc, subprocess

import torch
import soundfile as sf
from transformers import AutoProcessor, MusicgenForConditionalGeneration

WORKDIR = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(WORKDIR, "_sb_out")
TOKENS_PER_SEC = 50  # MusicGen frame rate


def log(o):
    sys.stdout.write(json.dumps(o) + "\n"); sys.stdout.flush()


def pick_gpu(req):
    if req not in (None, "auto"):
        return f"cuda:{req}"
    try:
        free = [int(x) for x in subprocess.check_output(
            ["nvidia-smi", "--query-gpu=memory.free", "--format=csv,noheader,nounits"],
            text=True).split()]
        best = max(range(len(free)), key=lambda i: free[i])
        log({"info": f"gpu free MiB={free}; cuda:{best}"})
        return f"cuda:{best}"
    except Exception:
        return "cuda:0"


def load(model_id, device):
    t0 = time.time()
    proc = AutoProcessor.from_pretrained(model_id)
    model = MusicgenForConditionalGeneration.from_pretrained(
        model_id, torch_dtype=torch.float16).to(device)
    log({"info": f"loaded {model_id} on {device} in {time.time()-t0:.1f}s"})
    return proc, model


def main():
    job = json.load(sys.stdin)
    os.makedirs(os.path.join(OUTDIR, "music"), exist_ok=True)
    device = pick_gpu(job.get("gpu", "auto"))
    model_id = job.get("model", "facebook/musicgen-medium")
    items = job["items"]

    proc = model = None
    for cand in [model_id, "facebook/musicgen-medium", "facebook/musicgen-small"]:
        try:
            proc, model = load(cand, device)
            model_id = cand
            break
        except Exception as e:
            log({"info": f"{cand} failed ({e}); freeing and trying smaller"})
            proc = model = None
            gc.collect()
            try:
                torch.cuda.empty_cache()
            except Exception:
                pass
    if model is None:
        for it in items:
            log({"out": it["out"], "ok": False, "error": "no MusicGen model could be loaded"})
        log({"done": True})
        return

    sr = model.config.audio_encoder.sampling_rate

    for it in items:
        outpath = os.path.join(OUTDIR, it["out"])
        os.makedirs(os.path.dirname(outpath), exist_ok=True)
        try:
            if it.get("seed") is not None:
                torch.manual_seed(int(it["seed"]))
            secs = float(it.get("seconds", 24))
            inputs = proc(text=[it["prompt"]], padding=True, return_tensors="pt").to(device)
            t0 = time.time()
            with torch.no_grad():
                audio = model.generate(
                    **inputs, do_sample=True, guidance_scale=3.0,
                    max_new_tokens=int(secs * TOKENS_PER_SEC))
            wav = audio[0, 0].cpu().float().numpy()
            sf.write(outpath, wav, sr)
            log({"out": it["out"], "ok": True,
                 "dur": round(len(wav) / sr, 2), "gen": round(time.time() - t0, 1)})
        except Exception as e:
            log({"out": it["out"], "ok": False, "error": str(e)})

    log({"done": True})


if __name__ == "__main__":
    main()
