#!/usr/bin/env python3
"""Look up and apply numbered cut suggestions (stage/cut-suggestions/).

    python3 tools/cuts.py list [scene]      every suggestion, or one scene's
    python3 tools/cuts.py show 12 [13 ...]  full text, reasons, status, saving
    python3 tools/cuts.py accept 12 [13 ...]
    python3 tools/cuts.py dismiss 12 [13 ...]   set aside (restore N brings it back)
    python3 tools/cuts.py scene s07 [s20b ...]   what deleting the whole scene needs and saves
    python3 tools/cuts.py scenes                 every scene ranked by time saved if deleted

accept makes the same single scene save as the editor's Accept button: it
needs the current script revision, keeps cue ids, and one Undo in the editor
takes it back out. A suggestion whose lines changed since it was written is
refused; edit it in the editor first.
"""
import os, sys
from pathlib import Path

CODE = Path(__file__).resolve().parent.parent/'stage'
STAGE = Path(os.environ.get('BIG_HACK_STAGE') or CODE)  # a temporary copy, for testing
sys.path.insert(0, str(CODE))
from editor_api import EditorAPI  # noqa: E402
from runtime import dismiss_suggestion, runtime  # noqa: E402
from script_store import ScriptStore  # noqa: E402


def everything():
    r = runtime(STAGE)
    return r, [(s, x) for s in r['scenes'] for x in (s.get('suggestions') or {}).get('items', [])]


def find(items, number):
    hit = [(s, x) for s, x in items if x['number'] == number]
    if not hit: sys.exit(f'No suggestion #{number}.')
    return hit[0]


def show(s, x):
    print(f"#{x['number']}  {x['title']}  [{s['title']} · {x['kind']} · {x['risk']} risk · {x['status']}]"
          f"  saves {x['savesMinutes']:.1f} min")
    edits = {e['cue']: e['text'] for e in x.get('edits') or []}
    for line in x['lines']:
        print(f"  {'REWRITE' if line['id'] in edits else 'CUT':7} {line['id']}  {line['speaker']}: {line['text']}")
        if line['id'] in edits: print(f"          becomes: {edits[line['id']]}")
    if x.get('riskWhy'): print(f"  risk:  {x['risk']}{' (was ' + x['riskWas'] + ')' if x.get('riskWas') else ''}. {x['riskWhy']}")
    for loss in x.get('loses') or []: print(f"  deletes  {loss}")
    print(f"  why it can go: {x['why']}")
    if x.get('keeps'): print(f"  keeps: {x['keeps']}")
    for c in x.get('conflicts') or []:
        if c['gone']: print(f"  CONFLICT: relies on {c['cue']}, already cut."); continue
        print(f"  CONFLICT with #{c['otherNumber']} ({c['otherTitle']}, {c['sceneTitle']}): take one, not both.")
        if c.get('because'): print(f"     this one assumes: {c['because']}")
        print(f"     the line: {c['cue']}  {c['speaker']}: {c['text']}")
    print()


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('list', 'show', 'accept', 'dismiss', 'restore', 'scene', 'scenes'): sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    r, items = everything()
    if cmd == 'scenes':
        rows = [s for s in r['scenes'] if s.get('ifDeleted')]
        for s in sorted(rows, key=lambda s: -s['ifDeleted']['savesMinutes']):
            d = s['ifDeleted']
            print(f"{s['id']:5} {d['savesMinutes']:5.1f} min  {d['verdict']:23} {d['risk']:6}  {s['title']}")
        return
    if cmd == 'scene':
        for sid in args:
            s = next((x for x in r['scenes'] if x['id'] == sid), None)
            d = s and s.get('ifDeleted')
            if not d: print(f'No deletion analysis for {sid}.'); continue
            sums = [f"{s['now']:.1f} now"]
            if d['montageMinutes'] and not d.get('removesMontage'): sums.append(f"- {d['montageMinutes']:.1f} montage that moves")
            if d.get('movedMinutes'): sums.append(f"- {d['movedMinutes']:.1f} lines that move elsewhere")
            if d['bridgeMinutes']: sums.append(f"- {d['bridgeMinutes']:.1f} new bridge lines")
            print(f"{sid} {s['title']}: {d['verdict']}, {d['risk']} risk. Saves {d['savesMinutes']:.1f} min ({' '.join(sums)}).")
            print(f"  {d['summary']}")
            print(f"  risk: {d.get('riskWhy', '')}")
            for l in d.get('lost', []): print(f"  loses  {l['kind']}: {l['what']}" + (f"  [still in {l['elsewhere']}]" if l.get('elsewhere') else '  [lost]'))
            for o in d.get('orphans', []): print(f"  orphan {o['cue']}: {o['problem']}  Fix: {o.get('fix', '')}")
            for c in d.get('changes', []): print(f"  change {c['action']} {c.get('where', '')}: {c.get('detail', '')}" + (f"\n           {c['text']}" if c.get('text') else ''))
            if d.get('affects'): print(f"  makes these suggestions unsafe: {', '.join('#' + str(n) for n in d['affects'])}")
            print()
        return
    if cmd == 'list':
        for s, x in items:
            if args and s['id'] not in args: continue
            if x['status'] == 'dismissed' and not args: continue
            print(f"#{x['number']:<4}{x['status']:6} {x['savesMinutes']:4.1f} min  {x['risk']:6} {s['id']:5} {x['title']}"
                  + ('  (conflict)' if x.get('warnings') and x['status'] != 'done' else ''))
        print(f"\nStage time {r['nowMinutes']:.1f} of {r['targetMinutes']:.0f}; {r['remainingMinutes']:.1f} min still to cut.")
        return
    for n in map(int, args):
        s, x = find(items, n)
        if cmd == 'show': show(s, x); continue
        if cmd in ('dismiss', 'restore'):
            dismiss_suggestion(STAGE, s['id'], x['n'], cmd == 'dismiss')
            print(f"#{n} {'dismissed' if cmd == 'dismiss' else 'restored'} ({x['title']})."); continue
        store = ScriptStore(STAGE)
        try:
            EditorAPI(store).accept(s['id'], x['n'], store.revision())
        except Exception as e:
            print(f"#{n} not applied: {e}"); continue
        r, items = everything()
        print(f"#{n} accepted ({x['title']}): saved about {x['savesMinutes']:.1f} min. Now {r['nowMinutes']:.1f} min, {r['remainingMinutes']:.1f} to cut.")


if __name__ == '__main__':
    main()
