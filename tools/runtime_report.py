#!/usr/bin/env python3
"""Print how far the cut has come toward the target running time.

The numbers come from stage/runtime.py, the same ones the editor's Runtime
panel shows. Lines without a matching recording are estimated, so run
tools/generate_elevenlabs.py first for exact numbers.

    python3 tools/runtime_report.py
"""
import sys
from pathlib import Path

STAGE = Path(__file__).resolve().parent.parent/'stage'
sys.path.insert(0, str(STAGE))
from runtime import runtime  # noqa: E402

r = runtime(STAGE)
print(f"{'Scene':6}{'Title':30}{'Was':>7}{'Now':>7}{'Saved':>7}")
for s in r['scenes']:
    note = ' (cut)' if s['cut'] else f" ({s['estimated']} lines estimated)" if s['estimated'] else ''
    print(f"{s['id']:6}{s['title'][:28]:30}{s['was']:7.1f}{s['now']:7.1f}{round(s['was'] - s['now'], 1) + 0:7.1f}{note}")
print(f"\nStage time: {r['nowMinutes']:.1f} min (started at {r['startMinutes']:.0f}, target {r['targetMinutes']:.0f})")
print(f"Cut so far: {r['cutMinutes']:.1f} of {r['needMinutes']:.1f} min ({r['cutMinutes'] / r['needMinutes']:.0%})")
print(f"Still to cut: {r['remainingMinutes']:.1f} min")
