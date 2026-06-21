#!/usr/bin/env python
"""Extract Qwen3-TTS speaker x-vectors (2048-d) from reference wavs.

Reads a JSON job from stdin and writes one .npy per character into
<workdir>/_sb_out/vectors/<id>.npy (float32). These vectors fully capture a
character's voice identity and can be reused to generate unlimited new lines in
the same voice (see tts_batch.py "xvector" mode).

Job: {"clone_model": "...", "gpu": "auto",
      "items": [{"id": "kristina", "ref_audio": "/abs/path/kristina.wav"}]}

Prints {"id":..,"ok":true,"dim":2048} / {"id":..,"ok":false,"error":..} then {"done":true}.
"""
import sys, os, json, subprocess
import numpy as np
import torch
from qwen_tts import Qwen3TTSModel

WORKDIR = os.path.dirname(os.path.abspath(__file__))
VECDIR = os.path.join(WORKDIR, "_sb_out", "vectors")


def log(o):
    sys.stdout.write(json.dumps(o) + "\n"); sys.stdout.flush()


def pick_gpu(req):
    if req not in (None, "auto"):
        return f"cuda:{req}"
    try:
        free = [int(x) for x in subprocess.check_output(
            ["nvidia-smi", "--query-gpu=memory.free", "--format=csv,noheader,nounits"],
            text=True).split()]
        return f"cuda:{max(range(len(free)), key=lambda i: free[i])}"
    except Exception:
        return "cuda:0"


def main():
    job = json.load(sys.stdin)
    os.makedirs(VECDIR, exist_ok=True)
    device = pick_gpu(job.get("gpu", "auto"))
    tts = Qwen3TTSModel.from_pretrained(
        job["clone_model"], device_map=device, dtype=torch.bfloat16,
        attn_implementation="flash_attention_2")
    for it in job["items"]:
        try:
            prompt = tts.create_voice_clone_prompt(
                ref_audio=it["ref_audio"], x_vector_only_mode=True)
            emb = prompt[0].ref_spk_embedding.float().cpu().numpy()
            np.save(os.path.join(VECDIR, f"{it['id']}.npy"), emb)
            log({"id": it["id"], "ok": True, "dim": int(emb.shape[0])})
        except Exception as e:
            log({"id": it["id"], "ok": False, "error": str(e)})
    log({"done": True})


if __name__ == "__main__":
    main()
