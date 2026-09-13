#!/usr/bin/env python3
"""Cut analysis for the play: per-scene timing, speaker breakdown, a ranking of
where the runtime can come from, and the editorial notes under cuts-notes/.

Pure module: no FastAPI, no network. server.py wraps it in two routes and the
tests call it with a fake show. Run it directly for the command line helpers:

    python3 storyboard/cuts_core.py table     the metrics table
    python3 storyboard/cuts_core.py hashes    scene id and text hash, one per line
    python3 storyboard/cuts_core.py check     validate every notes file, exit 1 on problems

How the staged estimate is built (Structure & Scene Map, "Measured runtime"):
spoken dialogue only, from the real clip durations. The narrator reading stage
directions is an artifact of the storyboard player and never counts. Rendered
speech runs ~176 wpm; staged delivery is 145 to 155, so dialogue seconds are
scaled up by PACE_FACTOR. Wordless time is added on top: the part of a screen
action not covered by speech, a small allowance per stage direction and per
written pause, and named wordless sequences that exist only as direction.
"""
import hashlib
import json
import re
import statistics
import sys
from pathlib import Path

TARGET_MIN = (60.0, 75.0)
PACE_FACTOR = 1.17
STAGE_BUSINESS_S = 1.5
PAUSE_S = 1.0
SILENT_PAUSE_S = 2.0
LONG_SPEECH_WORDS = 60
LONG_SPEECH_S = 25
SHORT_BEAT_WORDS = 3
MOVEMENT_BUDGET_MIN = {'I': 20, 'II': 22, 'III': 12, 'IV': 10, 'V': 14}
# Wordless sequences the data cannot see: the montage film (110.8 s by ffprobe),
# the ring in 14, the counter sequence in 20.
WORDLESS_DEFAULT_S = {'s00': 111, 's14': 35, 's20': 60}
# Author-Pass Reconciliation: "Cut scenes (01d, 08, 11c) are excluded per scope".
AUTHOR_CUT = {'s01d', 's08', 's11c'}
# The author's guardrails. Level: intact (never trim), keep (the named beats
# stay, trim around them), beats (the comedy stays, cut around it).
GUARDRAILS = {
    's01c': ('keep', "Brendan earnestly shows Liam agentic coding and it goes over Liam's head. The four aborted attempts stay; trim around them only."),
    's01b': ('keep', "Kristina buys into AI by using it, on stage. The Cursor demo beats stay."),
    's11c': ('keep', "Kristina's wordless solo build with the latest model pays off the Cursor demo. The build sequence stays."),
    's11b': ('intact', "Keep 11b intact: the talked-over-Kristina standup is the strongest comedy in the show."),
    's01': ('beats', "The talked-over-Kristina cold open comedy stays. Cut around it, not through it."),
    's06': ('beats', "The talked-over-Kristina standup comedy stays. Cut around it, not through it."),
}
NOTE_KINDS = ('trim', 'cut-beat', 'compress-speech', 'redundant', 'merge', 'cut-scene')
GRADES = ('protected', 'costly', 'trimmable', 'mergeable', 'liftable')
# Kinds whose saving is the whole of the named cues; compress-speech keeps part.
WHOLE_CUE_KINDS = {'trim', 'cut-beat', 'redundant', 'merge', 'cut-scene'}
BEAT_RE = re.compile(r'\(beat\)|\bbeat\b|\bpause\b|\bsilence\b', re.I)


def default_cfg():
    return {
        'target_minutes': list(TARGET_MIN),
        'pace_factor': PACE_FACTOR,
        'stage_business_seconds': STAGE_BUSINESS_S,
        'pause_seconds': PAUSE_S,
        'silent_pause_seconds': SILENT_PAUSE_S,
        'wordless': dict(WORDLESS_DEFAULT_S),
        'movement_budget_minutes': dict(MOVEMENT_BUDGET_MIN),
    }


def merge_cfg(over):
    cfg = default_cfg()
    for k, v in (over or {}).items():
        if k in ('wordless', 'movement_budget_minutes') and isinstance(v, dict):
            cfg[k] = {**cfg[k], **{str(a): float(b) for a, b in v.items()}}
        elif k in cfg:
            cfg[k] = v
    return cfg


def action_duration(actions, aid):
    """Port of stage/screen-actions.js actionDuration: the steps' seconds summed."""
    a = (actions or {}).get(aid) or {}
    return float(sum(float(s.get('seconds', 0) or 0) for s in a.get('steps', [])))


def scene_hash(cues):
    rows = [[c['id'], c.get('kind', ''), c.get('speaker', '') or '', c.get('text', ''), c.get('direction', '') or '']
            for c in cues]
    return hashlib.sha256(json.dumps(rows, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def words_of(text):
    return len((text or '').split())


def counted_class(c):
    if c.get('kind') == 'stage':
        return 'stage'
    return 'narrator' if c.get('speaker') == 'narrator' else 'dialogue'


def analyse_scene(scene, cues, actions, cfg, names=None):
    sid = scene['id']
    names = names or {}
    rows = []
    dialogue_s = narrator_s = 0.0
    words = 0
    stage_count = spoken_count = 0
    live = {'seconds': 0.0, 'words': 0}
    video = {'seconds': 0.0, 'words': 0}
    speakers = {}
    pauses = silent = 0
    by_action = {}
    longest = None
    long_speeches = []
    short_beats = 0
    for c in cues:
        cls = counted_class(c)
        w = words_of(c.get('text'))
        sec = float(c.get('audioDuration') or 0)
        row = {'id': c['id'], 'kind': c.get('kind'), 'speaker': c.get('speaker', '') or '', 'words': w,
               'seconds': round(sec, 2), 'counted': cls, 'action': None, 'long': False, 'short': False}
        acts = c.get('screenActions') or {}
        aids = sorted({v for v in acts.values() if isinstance(v, str) and v})
        if aids:
            row['action'] = aids[0]
        hits = len(BEAT_RE.findall(c.get('direction') or '')) + (len(BEAT_RE.findall(c.get('text') or '')) if cls == 'stage' else 0)
        pauses += hits
        row['beat'] = hits > 0
        if c.get('silentPause'):
            silent += 1
        if cls == 'stage':
            if not c.get('montage'):
                stage_count += 1
        else:
            spoken_count += 1
        if cls == 'dialogue':
            dialogue_s += sec
            words += w
            plane = live if c.get('kind') == 'live' else video
            plane['seconds'] += sec
            plane['words'] += w
            sp = speakers.setdefault(row['speaker'], {'id': row['speaker'], 'name': c.get('name') or names.get(row['speaker']) or row['speaker'],
                                                       'plane': 'live' if c.get('kind') == 'live' else 'video', 'seconds': 0.0, 'words': 0})
            sp['seconds'] += sec
            sp['words'] += w
            for aid in aids:
                by_action[aid] = by_action.get(aid, 0.0) + sec
            if longest is None or sec > longest['seconds']:
                longest = {'cue': c['id'], 'speaker': row['speaker'], 'words': w, 'seconds': round(sec, 1)}
            if w > LONG_SPEECH_WORDS or sec > LONG_SPEECH_S:
                row['long'] = True
                long_speeches.append(c['id'])
            if w <= SHORT_BEAT_WORDS:
                row['short'] = True
                short_beats += 1
        elif cls == 'narrator':
            narrator_s += sec
            for aid in aids:
                by_action.setdefault(aid, 0.0)
        else:
            for aid in aids:
                by_action.setdefault(aid, 0.0)
        rows.append(row)
    screen_actions = []
    screen_s = 0.0
    for aid, covered in sorted(by_action.items()):
        dur = action_duration(actions, aid)
        wordless = max(0.0, dur - covered)
        screen_s += wordless
        screen_actions.append({'id': aid, 'seconds': round(dur, 1), 'covered_s': round(covered, 1), 'wordless_s': round(wordless, 1)})
    business_s = cfg['stage_business_seconds'] * stage_count
    pause_s = cfg['pause_seconds'] * pauses + cfg['silent_pause_seconds'] * silent
    allowance_s = float(cfg['wordless'].get(sid, 0) or 0)
    staged_s = dialogue_s * cfg['pace_factor'] + screen_s + business_s + pause_s + allowance_s
    sp_list = sorted(speakers.values(), key=lambda s: -s['seconds'])
    for s in sp_list:
        s['seconds'] = round(s['seconds'], 1)
        s['share'] = round(s['seconds'] / dialogue_s, 3) if dialogue_s else 0
    return {
        'id': sid, 'title': scene.get('title', sid), 'movement': scene.get('movement', ''),
        'hash': scene_hash(cues),
        'dialogue_s': round(dialogue_s, 1), 'narrator_s': round(narrator_s, 1),
        'player_s': round(dialogue_s + narrator_s, 1),
        'words': words, 'wpm': round(words / (dialogue_s / 60)) if dialogue_s else 0,
        'stage_count': stage_count, 'spoken_count': spoken_count, 'cue_count': len(cues),
        'planes': {'live': {'seconds': round(live['seconds'], 1), 'words': live['words']},
                   'video': {'seconds': round(video['seconds'], 1), 'words': video['words']}},
        'speakers': sp_list, 'top_share': sp_list[0]['share'] if sp_list else 0,
        'longest': longest, 'long_speeches': long_speeches, 'short_beats': short_beats,
        'pauses': pauses, 'silent': silent,
        'screen_s': round(screen_s, 1), 'screen_actions': screen_actions,
        'business_s': round(business_s, 1), 'pause_s': round(pause_s, 1), 'allowance_s': allowance_s,
        'staged_s': round(staged_s, 1),
        'cues': rows,
    }


def fmt_min(s):
    return f"{s / 60:.1f} min"


def score_scene(m, ctx):
    """Deterministic points with a plain reason for each. Protection changes the
    rank, never the metrics."""
    reasons = []
    score = 0.0
    median = ctx['median_staged_s'] or 1
    if m['staged_s'] > median:
        pts = min((m['staged_s'] - median) / median, 1.5) * 30
        score += pts
        reasons.append({'kind': 'length', 'points': round(pts), 'text': f"{fmt_min(m['staged_s'])} staged, {fmt_min(m['staged_s'] - median)} over the scene median of {fmt_min(median)}."})
    mv = ctx['movements'].get(m['movement'])
    if mv and mv['over_s'] > 0:
        pts = min(mv['over_s'] / mv['budget_s'], 1) * 20
        score += pts
        reasons.append({'kind': 'movement', 'points': round(pts), 'text': f"Movement {m['movement']} runs {fmt_min(mv['staged_s'])} against a {fmt_min(mv['budget_s'])} allowance."})
    if m['long_speeches']:
        n = len(m['long_speeches'])
        pts = min(6 * n, 18)
        score += pts
        lg = m['longest']
        reasons.append({'kind': 'speech', 'points': pts, 'cueIds': list(m['long_speeches']),
                        'text': f"{n} speech{'es' if n > 1 else ''} over {LONG_SPEECH_WORDS} words or {LONG_SPEECH_S} seconds; the longest is {ctx['names'].get(lg['speaker'], lg['speaker'])} at {lg['words']} words, {lg['seconds']:.0f} s."})
    if m['top_share'] > 0.6 and m['speakers']:
        pts = min((m['top_share'] - 0.6) * 40, 16)
        score += pts
        top = m['speakers'][0]
        reasons.append({'kind': 'share', 'points': round(pts), 'text': f"{top['name']} speaks {round(top['share'] * 100)}% of the scene."})
    if m['spoken_count'] and m['short_beats'] / m['spoken_count'] > 0.25:
        score += 6
        reasons.append({'kind': 'choppy', 'points': 6, 'text': f"{m['short_beats']} of {m['spoken_count']} spoken beats are {SHORT_BEAT_WORDS} words or fewer; exchanges that could merge."})
    if m['screen_s'] > 20:
        pts = min(m['screen_s'] / 10, 6)
        score += pts
        reasons.append({'kind': 'screen', 'points': round(pts), 'text': f"{m['screen_s']:.0f} s of screen action plays with nobody speaking."})
    if m['spoken_count'] and m['pauses'] / m['spoken_count'] > 0.1:
        score += 4
        reasons.append({'kind': 'pause', 'points': 4, 'text': f"{m['pauses']} written beats or pauses; each one is stage time."})
    total = m['narrator_s'] + m['dialogue_s']
    if total and m['narrator_s'] / total > 0.3:
        reasons.append({'kind': 'info', 'points': 0, 'text': f"The player runs {fmt_min(total)} but {fmt_min(m['narrator_s'])} of that is the narrator reading directions; the stage figure is {fmt_min(m['staged_s'])}."})
    rank = score
    protected = None
    g = GUARDRAILS.get(m['id'])
    if g:
        level, text = g
        protected = {'level': level, 'text': text}
        rank = 0.0 if level == 'intact' else rank * (0.5 if level == 'keep' else 0.75)
        reasons.insert(0, {'kind': 'protected', 'points': 0, 'text': text})
    author_cut = m['id'] in AUTHOR_CUT
    if author_cut:
        extra = " It also carries a guardrail, so this needs a decision, not a ranking." if g else ""
        reasons.insert(1 if g else 0, {'kind': 'author-cut', 'points': 0, 'text': "Listed as cut in the author pass (Author-Pass Reconciliation)." + extra})
    return round(score, 1), round(rank, 1), reasons, protected, author_cut


def _problem(problems, file, msg):
    problems.append({'file': file, 'message': msg})


def load_notes(notes_dir, metrics, cues_by_scene, cfg_pace=PACE_FACTOR):
    """Every <sid>.json under notes_dir, validated against the current script.
    Returns (notes_by_scene, summary, problems). Problems are reported, never raised."""
    notes, problems, summary = {}, [], None
    notes_dir = Path(notes_dir) if notes_dir else None
    if not notes_dir or not notes_dir.is_dir():
        return notes, summary, problems
    for f in sorted(notes_dir.glob('*.json')):
        try:
            data = json.loads(f.read_text(encoding='utf-8'))
        except (OSError, ValueError) as e:
            _problem(problems, f.name, f"unreadable: {e}")
            continue
        if f.name == '_summary.json':
            summary = data if isinstance(data, dict) else None
            continue
        if not isinstance(data, dict):
            _problem(problems, f.name, "not an object")
            continue
        sid = data.get('sceneId') or f.stem
        if sid != f.stem:
            _problem(problems, f.name, f"sceneId {sid!r} does not match the file name")
        if sid not in metrics:
            _problem(problems, f.name, f"scene {sid!r} is not in the script")
            continue
        m = metrics[sid]
        cues = cues_by_scene.get(sid, [])
        secs = {c['id']: float(c.get('audioDuration') or 0) for c in cues}
        # Only spoken dialogue is stage time; a narrator cue's seconds are player time.
        spoken = {c['id']: secs[c['id']] if counted_class(c) == 'dialogue' else 0.0 for c in cues}
        narrated = {c['id']: secs[c['id']] if counted_class(c) == 'narrator' else 0.0 for c in cues}
        n = {
            'sceneId': sid,
            'writtenAt': data.get('writtenAt'),
            'writtenAgainst': data.get('writtenAgainst'),
            'stale': data.get('writtenAgainst') != m['hash'],
            'grade': data.get('grade') if data.get('grade') in GRADES else 'trimmable',
            'protected': data.get('protected') if isinstance(data.get('protected'), dict) else {'yes': False, 'why': None},
            'function': data.get('function') if isinstance(data.get('function'), dict) else {},
            'turnsAt': data.get('turnsAt') if data.get('turnsAt') in secs else None,
            'ifRemoved': str(data.get('ifRemoved') or ''),
            'mergeInto': None,
            'suggestions': [],
            'recommendedSavingSeconds': 0.0,
        }
        if data.get('grade') not in GRADES:
            _problem(problems, f.name, f"grade {data.get('grade')!r} is not one of {', '.join(GRADES)}")
        mi = data.get('mergeInto')
        if isinstance(mi, dict) and mi.get('sceneId'):
            if mi['sceneId'] not in metrics:
                _problem(problems, f.name, f"mergeInto names unknown scene {mi['sceneId']!r}")
            carry = [c for c in (mi.get('carry') or []) if c in secs]
            n['mergeInto'] = {'sceneId': mi['sceneId'], 'carry': carry, 'note': str(mi.get('note') or '')}
        for i, s in enumerate(data.get('suggestions') or []):
            if not isinstance(s, dict):
                _problem(problems, f.name, f"suggestion {i} is not an object")
                continue
            ids = [c for c in (s.get('cueIds') or []) if isinstance(c, str)]
            present = [c for c in ids if c in secs]
            missing = [c for c in ids if c not in secs]
            kind = s.get('kind')
            if kind not in NOTE_KINDS:
                _problem(problems, f.name, f"suggestion {i}: kind {kind!r} is not one of {', '.join(NOTE_KINDS)}")
                kind = 'trim'
            if kind == 'cut-scene' and n['grade'] not in ('liftable', 'mergeable'):
                _problem(problems, f.name, f"suggestion {i}: cut-scene on a {n['grade']} scene")
            if not ids:
                _problem(problems, f.name, f"suggestion {i} names no cues")
            for c in missing:
                _problem(problems, f.name, f"suggestion {i}: cue {c!r} is not in scene {sid}")
            whole = sum(secs[c] for c in present)
            whole_spoken = sum(spoken[c] for c in present)
            whole_narrated = sum(narrated[c] for c in present)
            try:
                written = max(0.0, float(s.get('savingSeconds') or 0))
            except (TypeError, ValueError):
                written = 0.0
            if kind in WHOLE_CUE_KINDS:
                saving, dialogue, narrator = whole, whole_spoken, whole_narrated
            else:
                # A compressed speech keeps part of itself; the written estimate
                # is taken at its word, capped at the cues' length, and split the
                # way the cues themselves split between dialogue and narration.
                saving = min(written, whole)
                dialogue = min(saving, whole_spoken)
                narrator = min(saving - dialogue, whole_narrated)
            # What the stage clock loses: the whole scene for a lift, otherwise
            # the dialogue seconds at staged pace.
            staged = m['staged_s'] if kind == 'cut-scene' else dialogue * cfg_pace
            note = str(s.get('note') or '')
            if '—' in note:
                _problem(problems, f.name, f"suggestion {i}: em dash in note")
            n['suggestions'].append({
                'id': str(s.get('id') or f"{sid}-{i + 1}"), 'kind': kind, 'cueIds': present, 'missingCueIds': missing,
                'stale': bool(missing), 'savingSeconds': round(saving, 1), 'dialogueSeconds': round(dialogue, 1),
                'narratorSeconds': round(narrator, 1), 'stagedSavingSeconds': round(staged, 1),
                'writtenSavingSeconds': round(written, 1),
                'priority': int(s.get('priority') or i + 1), 'note': note,
            })
        n['suggestions'].sort(key=lambda s: s['priority'])
        n['allSavingSeconds'] = round(sum(s['savingSeconds'] for s in n['suggestions']), 1)
        # The writer's own figure for the trims worth taking together (some
        # suggestions are alternatives or known losses); never more than all of them.
        try:
            rec = float(data.get('recommendedSavingSeconds'))
        except (TypeError, ValueError):
            rec = n['allSavingSeconds']
        n['recommendedSavingSeconds'] = round(min(max(rec, 0.0), n['allSavingSeconds']), 1)
        notes[sid] = n
    return notes, summary, problems


def analyse(show, actions=None, cfg=None, notes_dir=None):
    cfg = merge_cfg(cfg)
    actions = actions or {}
    names = {c.get('speaker'): c.get('name') for c in show.get('cues', []) if c.get('speaker')}
    cues_by_scene = {}
    for c in show.get('cues', []):
        cues_by_scene.setdefault(c['scene'], []).append(c)
    order = [sc['id'] for sc in show.get('scenes', [])]
    metrics = {sc['id']: analyse_scene(sc, cues_by_scene.get(sc['id'], []), actions, cfg, names) for sc in show.get('scenes', [])}
    budgets = cfg['movement_budget_minutes']
    movements = {}
    for sid in order:
        m = metrics[sid]
        mv = movements.setdefault(m['movement'] or '?', {'staged_s': 0.0, 'dialogue_s': 0.0, 'budget_s': float(budgets.get(m['movement'], 0)) * 60, 'scenes': []})
        mv['staged_s'] += m['staged_s']
        mv['dialogue_s'] += m['dialogue_s']
        mv['scenes'].append(sid)
    for mv in movements.values():
        mv['staged_s'] = round(mv['staged_s'], 1)
        mv['dialogue_s'] = round(mv['dialogue_s'], 1)
        mv['over_s'] = round(max(0.0, mv['staged_s'] - mv['budget_s']), 1) if mv['budget_s'] else 0.0
    spoken = [m['staged_s'] for m in metrics.values() if m['dialogue_s'] > 0]
    ctx = {'median_staged_s': statistics.median(spoken) if spoken else 0, 'movements': movements, 'names': names}
    for m in metrics.values():
        m['score'], m['rank_score'], m['reasons'], m['protected'], m['author_cut'] = score_scene(m, ctx)
    notes, summary, problems = load_notes(notes_dir, metrics, cues_by_scene, cfg['pace_factor'])
    for sid, m in metrics.items():
        m['notes'] = notes.get(sid)
    ranking = sorted(order, key=lambda sid: (-metrics[sid]['rank_score'], -metrics[sid]['staged_s']))
    keys = ('dialogue_s', 'narrator_s', 'player_s', 'staged_s', 'words', 'screen_s', 'business_s', 'pause_s', 'allowance_s')
    totals = {k: round(sum(m[k] for m in metrics.values()), 1) for k in keys}
    totals['words'] = int(totals['words'])
    low, high = (float(x) * 60 for x in cfg['target_minutes'])
    totals['to_cut_s'] = round(max(0.0, totals['staged_s'] - high), 1)
    totals['to_cut_low_s'] = round(max(0.0, totals['staged_s'] - low), 1)
    totals['notes_saving_s'] = round(sum(n['recommendedSavingSeconds'] for n in notes.values() if not n['stale']), 1)
    return {
        'target': {'low_s': low, 'high_s': high},
        'totals': totals,
        'movements': movements,
        'scenes': metrics,
        'order': order,
        'ranking': ranking,
        'factors': {'pace': cfg['pace_factor'], 'business_s': cfg['stage_business_seconds'], 'pause_s': cfg['pause_seconds'],
                    'silent_pause_s': cfg['silent_pause_seconds'], 'wordless': cfg['wordless'], 'median_staged_s': round(ctx['median_staged_s'], 1)},
        'summary': summary,
        'notes_problems': problems,
    }


# --------------------------------------------------------------------------- #
# Command line
# --------------------------------------------------------------------------- #
def _load_stage(stage):
    stage = Path(stage)
    show = json.loads((stage / 'show.json').read_text())
    try:
        actions = json.loads((stage / 'screen-actions.json').read_text()).get('actions', {})
    except (OSError, ValueError):
        actions = {}
    return show, actions


def table(a):
    lines = ["| scene | title | mvt | cues | dialogue | narrator | staged | words | wpm | top speaker | rank |",
             "|---|---|---|---|---|---|---|---|---|---|---|"]
    for sid in a['order']:
        m = a['scenes'][sid]
        top = f"{m['speakers'][0]['name']} {round(m['speakers'][0]['share'] * 100)}%" if m['speakers'] else ""
        lines.append(f"| {sid} | {m['title']} | {m['movement']} | {m['cue_count']} | {fmt_min(m['dialogue_s'])} | {fmt_min(m['narrator_s'])} | {fmt_min(m['staged_s'])} | {m['words']} | {m['wpm']} | {top} | {m['rank_score']} |")
    t = a['totals']
    lines.append(f"\nTotals: dialogue {fmt_min(t['dialogue_s'])}, narrator {fmt_min(t['narrator_s'])}, staged estimate {fmt_min(t['staged_s'])}, target {a['target']['low_s'] / 60:.0f} to {a['target']['high_s'] / 60:.0f} min, to cut {fmt_min(t['to_cut_s'])} (to reach the low end: {fmt_min(t['to_cut_low_s'])}).")
    for k, mv in a['movements'].items():
        lines.append(f"Movement {k}: staged {fmt_min(mv['staged_s'])}, allowance {fmt_min(mv['budget_s'])}, over by {fmt_min(mv['over_s'])}.")
    return "\n".join(lines)


def main(argv):
    here = Path(__file__).resolve().parent
    stage = Path(sys.argv[2]) if len(argv) > 2 else here.parent / 'stage'
    cmd = argv[1] if len(argv) > 1 else 'table'
    show, actions = _load_stage(stage)
    a = analyse(show, actions, None, here / 'cuts-notes')
    if cmd == 'hashes':
        for sid in a['order']:
            print(sid, a['scenes'][sid]['hash'])
    elif cmd == 'check':
        stale = [sid for sid, m in a['scenes'].items() if m['notes'] and m['notes']['stale']]
        for p in a['notes_problems']:
            print(f"{p['file']}: {p['message']}")
        for sid in stale:
            print(f"{sid}.json: written against an earlier text of the scene")
        missing = [sid for sid in a['order'] if not a['scenes'][sid]['notes']]
        if missing:
            print("no notes yet:", ", ".join(missing))
        print(f"{len([m for m in a['scenes'].values() if m['notes']])} notes files, {len(a['notes_problems'])} problems, {len(stale)} stale")
        return 1 if a['notes_problems'] or stale else 0
    else:
        print(table(a))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
