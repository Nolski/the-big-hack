#!/usr/bin/env python3
"""Concatenate chosen clips into one silent film from an edit list.

    python3 tools/build_montage.py stage/assets/filmed/outro-montage-v2.edit.json

The edit list is JSON:

    {"file": "outro-montage-v1.mp4", "size": "1920x1080", "fps": 30,
     "clipRoot": "../../../research/montage-candidates",
     "clips": [{"name": "...", "file": "clips/x.mp4", "url": "...", "start": 12.0, "length": 3.0, ...}]}

Paths are relative to the edit list's folder. Each clip is scaled to fit the frame
(letterboxed if needed), audio is dropped, and the result is written beside the edit
list. Standard library plus ffmpeg.

A clip may carry "slot": the seconds it should fill, e.g. from one lyric line to the
next. Longer clips are trimmed to the slot; shorter ones are slowed by up to
MAX_STRETCH and then hold their last frame for any remainder.
"""
import json
import os
import subprocess
import sys
import tempfile

MAX_STRETCH = 1.25


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return float(out or 0)


def slot_filter(src_len, slot):
    """Filters that make a clip of src_len seconds fill exactly slot seconds."""
    if slot <= src_len:
        return "", ["-t", f"{slot:.3f}"]
    stretch = min(slot / src_len, MAX_STRETCH)
    hold = max(0.0, slot - src_len * stretch)
    vf = f"setpts={stretch:.4f}*PTS,"
    if hold > 0:
        vf += f"tpad=stop_mode=clone:stop_duration={hold:.3f},"
    return vf, ["-t", f"{slot:.3f}"]


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    edit_path = os.path.abspath(sys.argv[1])
    base = os.path.dirname(edit_path)
    with open(edit_path, encoding="utf-8") as fh:
        edit = json.load(fh)
    w, h = edit.get("size", "1920x1080").split("x")
    fps = edit.get("fps", 30)
    root = os.path.normpath(os.path.join(base, edit.get("clipRoot", ".")))
    out = os.path.join(base, edit["file"])
    tmp = tempfile.mkdtemp(prefix="montage-")
    parts = []
    total = 0.0
    for c in edit["clips"]:
        src = os.path.join(root, c["file"])
        if not os.path.exists(src):
            sys.exit(f"missing clip: {src}")
        dst = os.path.join(tmp, f"{len(parts):04d}.mp4")
        timing, limit = slot_filter(duration(src), c["slot"]) if c.get("slot") else ("", [])
        vf = (f"{timing}scale={w}:{h}:force_original_aspect_ratio=decrease:flags=lanczos,"
              f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={fps},format=yuv420p")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-vf", vf, "-an", *limit,
                        "-c:v", "libx264", "-preset", "slow", "-crf", "18", dst], check=True)
        parts.append(dst)
        total += duration(dst)
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as fh:
        fh.writelines(f"file '{p}'\n" for p in parts)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", "-movflags", "+faststart", out], check=True)
    for p in parts:
        os.remove(p)
    os.remove(lst)
    os.rmdir(tmp)
    print(f"{os.path.relpath(out)}: {len(parts)} clips, {total:.1f} s, {w}x{h} @ {fps} fps")


if __name__ == "__main__":
    main()
