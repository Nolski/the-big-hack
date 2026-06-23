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


def load_model(model_id, device):
    # Prefer flash-attn (fast path on hosts that have it), fall back to PyTorch
    # SDPA — built into torch, works on CUDA *and* ROCm — when flash-attn is
    # absent. An explicit QWEN_ATTN env var pins a single implementation.
    override = os.environ.get("QWEN_ATTN")
    last = None
    for attn in ([override] if override else ["flash_attention_2", "sdpa"]):
        try:
            m = Qwen3TTSModel.from_pretrained(
                model_id, device_map=device, dtype=torch.bfloat16,
                attn_implementation=attn)
            log({"info": f"loaded {model_id} on {device} via attn={attn}"})
            return m
        except (ImportError, ValueError, RuntimeError) as e:
            last = e
            log({"info": f"attn={attn} unavailable ({type(e).__name__}: {e}); trying next"})
    raise last


def main():
    job = json.load(sys.stdin)
    os.makedirs(VECDIR, exist_ok=True)
    device = pick_gpu(job.get("gpu", "auto"))
    tts = load_model(job["clone_model"], device)
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
