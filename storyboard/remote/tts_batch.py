#!/usr/bin/env python
"""Batched Qwen3-TTS generation for the storyboard app.

Reads a JSON job from stdin and writes WAVs into <workdir>/_sb_out/.
Loads each required model exactly once to amortise the ~20s load, and frees it
before loading the other so we stay within the VRAM left over by the resident
70B LLM.

Modes (per item):
  - "design"  : VoiceDesign model, item has {instruct}
  - "clone"   : Base model, item has {ref_audio} (path on host), x-vector only
  - "xvector" : Base model, item has {vector_path} pointing to a saved 2048-d
                speaker embedding .npy on the host — fully reproducible, no wav.

Job schema (stdin JSON):
{
  "design_model": "...", "clone_model": "...", "language": "English",
  "gpu": "auto",
  "items": [{"out": "lines/s01_l1.wav", "mode": "xvector",
             "vector_path": "_sb_out/vectors/kristina.npy", "seed": 303, "text": "..."}]
}

Prints one JSON per line: {"out":..,"ok":true,"dur":..} / {"out":..,"ok":false,"error":..}
then {"done":true}.
"""
import sys, os, json, time, gc, subprocess

import numpy as np
import torch
import soundfile as sf
from qwen_tts import Qwen3TTSModel
from qwen_tts.inference.qwen3_tts_model import VoiceClonePromptItem

WORKDIR = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(WORKDIR, "_sb_out")

CLONE_COMMON = dict(
    max_new_tokens=2048, do_sample=True, top_k=50, top_p=1.0, temperature=0.9,
    repetition_penalty=1.05, subtalker_dosample=True, subtalker_top_k=50,
    subtalker_top_p=1.0, subtalker_temperature=0.9,
)


def log(obj):
    sys.stdout.write(json.dumps(obj) + "\n"); sys.stdout.flush()


def pick_gpu(requested):
    if requested not in (None, "auto"):
        return f"cuda:{requested}"
    try:
        out = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=memory.free", "--format=csv,noheader,nounits"],
            text=True).strip().splitlines()
        free = [int(x) for x in out]
        best = max(range(len(free)), key=lambda i: free[i])
        log({"info": f"gpu free MiB={free}; picking cuda:{best}"})
        return f"cuda:{best}"
    except Exception as e:
        log({"info": f"gpu autodetect failed ({e}); cuda:0"})
        return "cuda:0"


def _attn_order():
    # Prefer flash-attn (fast path on hosts that have it), fall back to PyTorch
    # SDPA — built into torch, works on CUDA *and* ROCm — when flash-attn is
    # absent. An explicit QWEN_ATTN env var pins a single implementation.
    override = os.environ.get("QWEN_ATTN")
    return [override] if override else ["flash_attention_2", "sdpa"]


def load_model(model_id, device):
    t0 = time.time()
    last = None
    for attn in _attn_order():
        try:
            m = Qwen3TTSModel.from_pretrained(
                model_id, device_map=device, dtype=torch.bfloat16,
                attn_implementation=attn)
            log({"info": f"loaded {model_id} on {device} via attn={attn} in {time.time()-t0:.1f}s"})
            return m
        except (ImportError, ValueError, RuntimeError) as e:
            last = e
            log({"info": f"attn={attn} unavailable ({type(e).__name__}: {e}); trying next"})
    raise last


def main():
    job = json.load(sys.stdin)
    os.makedirs(OUTDIR, exist_ok=True)
    device = pick_gpu(job.get("gpu", "auto"))
    language = job.get("language", "English")
    items = job["items"]

    # Group by which checkpoint each mode needs.
    groups = {
        job["design_model"]: [i for i in items if i.get("mode", "design") == "design"],
        job["clone_model"]: [i for i in items if i.get("mode") in ("clone", "xvector")],
    }

    for model_id, batch in groups.items():
        if not batch:
            continue
        try:
            tts = load_model(model_id, device)
            mdtype = next(tts.model.parameters()).dtype
        except Exception as e:
            for it in batch:
                log({"out": it["out"], "ok": False, "error": f"model load: {e}"})
            continue

        for it in batch:
            outpath = os.path.join(OUTDIR, it["out"])
            os.makedirs(os.path.dirname(outpath), exist_ok=True)
            try:
                if it.get("seed") is not None:
                    torch.manual_seed(int(it["seed"]))
                t0 = time.time()
                mode = it.get("mode", "design")
                if mode == "design":
                    wavs, sr = tts.generate_voice_design(
                        text=it["text"], instruct=it.get("instruct", ""),
                        language=language, max_new_tokens=4096)
                elif mode == "xvector":
                    arr = np.load(os.path.join(WORKDIR, it["vector_path"]))
                    emb = torch.tensor(arr, dtype=mdtype, device=device)
                    prompt = VoiceClonePromptItem(
                        ref_code=None, ref_spk_embedding=emb,
                        x_vector_only_mode=True, icl_mode=False, ref_text=None)
                    wavs, sr = tts.generate_voice_clone(
                        text=it["text"], language=language,
                        voice_clone_prompt=[prompt], **CLONE_COMMON)
                else:  # clone from a reference wav
                    wavs, sr = tts.generate_voice_clone(
                        text=it["text"], language=language,
                        ref_audio=it["ref_audio"], x_vector_only_mode=True,
                        **CLONE_COMMON)
                sf.write(outpath, wavs[0], sr)
                log({"out": it["out"], "ok": True,
                     "dur": round(len(wavs[0]) / sr, 2),
                     "gen": round(time.time() - t0, 1)})
            except Exception as e:
                log({"out": it["out"], "ok": False, "error": str(e)})

        del tts
        gc.collect()
        try:
            torch.cuda.empty_cache()
        except Exception:
            pass

    log({"done": True})


if __name__ == "__main__":
    main()
