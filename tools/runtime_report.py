#!/usr/bin/env python3
"""Print how far the cut has come toward the target running time.

The numbers come from stage/runtime.py, the same ones the editor's Runtime
panel shows: each line's word count at the live or recorded pace measured
in the 7 October read-through, plus the montages at their own length.
By default the roles in the show's liveCast are live and recordings play
at 1x; the options match the presenter's playback settings.

    python3 tools/runtime_report.py [--rate 1.2] [--live liam,brendan] [--generated marcus]
"""
import argparse, sys
from pathlib import Path

STAGE = Path(__file__).resolve().parent.parent/'stage'
sys.path.insert(0, str(STAGE))
from runtime import runtime  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('--rate', type=float, default=1, help='AI voice playback speed, 0.5 to 2')
ap.add_argument('--live', default='', help='comma-separated roles read live')
ap.add_argument('--generated', default='', help='comma-separated roles played from recordings')
a = ap.parse_args()
modes = {sp: mode for mode in ('live', 'generated') for sp in getattr(a, mode).split(',') if sp}

r = runtime(STAGE, {'rate': a.rate, 'modes': modes})
print(f"{'Scene':6}{'Title':30}{'Was':>7}{'Now':>7}{'Saved':>7}")
for s in r['scenes']:
    note = ' (cut)' if s['cut'] else ''
    print(f"{s['id']:6}{s['title'][:28]:30}{s['was']:7.1f}{s['now']:7.1f}{round(s['was'] - s['now'], 1) + 0:7.1f}{note}")
live = [c['name'] for c in r['settings']['cast'] if c['live']]
print(f"\nLive: {', '.join(live) or 'nobody'}; AI voices at {r['settings']['rate']:g}x")
print(f"Stage time: {r['nowMinutes']:.1f} min (started at {r['startMinutes']:.0f}, target {r['targetMinutes']:.0f})")
print(f"Cut so far: {r['cutMinutes']:.1f} of {r['needMinutes']:.1f} min ({r['cutMinutes'] / r['needMinutes']:.0%})")
print(f"Still to cut: {r['remainingMinutes']:.1f} min")
