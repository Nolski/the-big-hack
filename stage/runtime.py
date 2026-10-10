"""Running time of the current script, measured against the uncut baseline.

runtime-baseline.json holds two delivery rates in seconds per word, pauses
included, timed line by line from the 7 October read-through: one for live
lines read by the cast, one for recorded lines played from audio. Every line
is timed from its word count at its rate. Montages count at their own length.
The uncut script is kept there as word counts, so the cut uses the same rates.
"""
import json, re
from pathlib import Path


def rate(base, kind):
    return base['secondsPerWord']['live' if kind == 'live' else 'recorded']


def runtime(root):
    root = Path(root)
    base = json.loads((root/'runtime-baseline.json').read_text())
    show = json.loads((root/'show.json').read_text())
    fixed = {f['cue']: f['seconds'] for f in base.get('fixed', [])}
    held, held_was = {}, {}
    for f in base.get('fixed', []): held_was[f['scene']] = held_was.get(f['scene'], 0)+f['seconds']
    secs, line_secs = {}, {}
    for c in show['cues']:
        duration = c.get('montageDuration', fixed.get(c['id'], 0)) if c.get('montage') else 0
        if duration: held[c['scene']] = held.get(c['scene'], 0)+duration
        if c['kind'] == 'stage' or not c['text'].strip(): continue
        s = len(c['text'].split())*rate(base, c['kind'])
        secs[c['scene']] = secs.get(c['scene'], 0)+s
        line_secs[c['id']] = s
    minutes = lambda s, still=0: round((s+still)/60, 2)
    spoken_was = lambda s: s['liveWords']*rate(base, 'live')+s['recordedWords']*rate(base, 'recorded')
    was = {s['id']: s for s in base['scenes']}
    current = {s['id'] for s in show['scenes']}
    budget = base.get('budgets', {})
    live = {c['name'].upper() for c in show['cues'] if c['kind'] == 'live' and c.get('name')}
    scenes = [{'id': sc['id'], 'title': sc['title'], 'was': minutes(spoken_was(was[sc['id']]), held_was.get(sc['id'], 0)) if sc['id'] in was else 0,
               'now': minutes(secs.get(sc['id'], 0), held.get(sc['id'], 0)), 'fixed': round(held.get(sc['id'], 0)/60, 2),
               'budget': budget.get(sc['id']), 'cut': False,
               'suggestions': suggestions(root, sc['id'], show, line_secs)}
              for sc in show['scenes']]
    flag_conflicts(scenes, show)
    for sc in scenes:
        if not sc['cut']: sc['ifDeleted'] = if_deleted(root, sc, scenes, show, base, live, line_secs)
    scenes += [{'id': s['id'], 'title': s['title'], 'was': minutes(spoken_was(s), held_was.get(s['id'], 0)), 'now': 0, 'fixed': 0,
                'budget': 0, 'cut': True}
               for s in base['scenes'] if s['id'] not in current]
    start = minutes(sum(spoken_was(s) for s in base['scenes']), sum(held_was.values()))
    target = base['targetMinutes']
    now = minutes(sum(secs.values()), sum(held.values()))
    return {'measuredOn': base['measuredOn'], 'secondsPerWord': base['secondsPerWord'], 'startMinutes': start, 'targetMinutes': round(target, 2),
            'nowMinutes': now, 'cutMinutes': round(start-now, 2), 'needMinutes': round(start-target, 2),
            'remainingMinutes': round(max(now-target, 0), 2), 'scenes': scenes}


def suggestions(root, sid, show, line_secs):
    """Cut suggestions for one scene (cut-suggestions/<scene>.json), each with its
    saving worked out from today's line timings and a status: open, done (the
    cut or trim is in the script), or stale (its lines changed some other way)."""
    path = Path(root)/'cut-suggestions'/(sid+'.json')
    if not path.exists(): return None
    notes = json.loads(path.read_text())
    cues = {c['id']: c for c in show['cues']}
    out = []
    for n, sug in enumerate(notes.get('suggestions', [])):
        was = sug.get('against', {})
        edits = {e['cue']: e['text'] for e in sug.get('edits', [])}
        present = [cid for cid in sug['cues'] if cid in cues]
        cut = [cid for cid in present if cid not in edits]
        done = not cut and all(cues[cid]['text'] == edits[cid] for cid in present if cid in edits)
        stale = not done and any(cues[cid]['text'] != was.get(cid, cues[cid]['text']) for cid in present)
        saves = sum(line_secs.get(cid, 0) for cid in cut)
        saves += sum(line_secs.get(cid, 0)*(1 - len(edits[cid].split())/max(1, len(cues[cid]['text'].split())))
                     for cid in present if cid in edits)
        out.append({**{k: sug.get(k) for k in ('number', 'title', 'cues', 'edits', 'why', 'keeps', 'risk', 'riskWhy', 'riskWas', 'loses', 'reliesOn', 'editedByAuthor', 'directionsKept')},
                    'kind': kind_of(sug), 'cutCues': [cid for cid in sug['cues'] if cid not in edits],
                    'n': n, 'status': 'done' if done else 'dismissed' if sug.get('dismissed') else 'stale' if stale else 'open',
                    'savesMinutes': round(saves/60, 2),
                    'lines': [{'id': cid, 'speaker': cues[cid].get('name') or 'Direction', 'text': cues[cid]['text']} for cid in present]})
    return {'approach': notes.get('approach', ''), 'writtenOn': notes.get('writtenOn'), 'items': out}


def flag_conflicts(scenes, show):
    """A suggestion that leans on a line in another scene ("s01c_l2 already
    covers this") is unsafe if that line is gone, or if a suggestion over there
    would cut it. Each one gets a plain warning plus the details: the line, the
    sentence in this suggestion that leans on it, and the suggestion that cuts it."""
    cues = {c['id']: c for c in show['cues']}
    titles = {s['id']: s['title'] for s in scenes}
    cutting = {}
    for sc in scenes:
        for x in (sc.get('suggestions') or {}).get('items', []):
            if x['status'] not in ('done', 'dismissed'):
                for cid in x['cutCues']: cutting[cid] = (sc['id'], x)
    def because(x, cid):
        text = ' '.join(t for t in (x.get('why'), x.get('keeps')) if t)
        hits = [p.strip() for p in re.split(r'(?<=[.!?])\s+', text) if cid in p]
        return ' '.join(hits) or None
    for sc in scenes:
        for x in (sc.get('suggestions') or {}).get('items', []):
            warn, details = [], []
            for cid in x.get('reliesOn') or []:
                if cid not in cues:
                    warn.append(f"It relies on {cid}, which has since been cut.")
                    details.append({'cue': cid, 'gone': True, 'because': because(x, cid)})
                elif cid in cutting:
                    other, o = cutting[cid]
                    c = cues[cid]
                    warn.append(f"It relies on {cid} in {titles.get(other, other)}, which suggestion #{o['number']} \u201c{o['title']}\u201d there would cut. Take one, not both.")
                    details.append({'cue': cid, 'gone': False, 'because': because(x, cid),
                                    'scene': other, 'sceneTitle': titles.get(other, other),
                                    'speaker': c.get('name') or 'Narrator', 'text': c['text'],
                                    'otherNumber': o['number'], 'otherTitle': o['title'], 'otherRisk': o['risk'],
                                    'otherSaves': o['savesMinutes']})
            x['warnings'] = warn
            x['conflicts'] = details

def kind_of(sug):
    """cut, trim, or cut + trim: a cue with an edit is rewritten, one without is removed."""
    edited = {e['cue'] for e in sug.get('edits', [])}
    return 'trim' if edited >= set(sug['cues']) else 'cut' if not edited else 'cut + trim'


def save_suggestion(root, sid, n, change, show):
    """The author's own version of a suggestion: which lines it removes, which it
    rewrites and to what. Kept beside the original reasons; marked as edited."""
    path = Path(root)/'cut-suggestions'/(sid+'.json')
    notes = json.loads(path.read_text())
    sug = notes['suggestions'][n]
    cues = {c['id']: c for c in show['cues'] if c['scene'] == sid}
    ids = list(dict.fromkeys(change.get('cues', [])))
    if not ids: raise ValueError('A suggestion needs at least one line.')
    for cid in ids:
        if cid not in cues: raise ValueError(f'{cid} is not a line in this scene.')
        if cues[cid].get('montage'): raise ValueError('Montage cues cannot be cut here.')
    edits = [{'cue': e['cue'], 'text': str(e['text']).strip()} for e in change.get('edits', []) if e['cue'] in ids]
    if any(not e['text'] for e in edits): raise ValueError('A rewritten line cannot be empty; cut it instead.')
    order = {c['id']: i for i, c in enumerate(show['cues'])}
    sug['cues'] = sorted(ids, key=order.get)
    sug['edits'] = edits
    sug['kind'] = kind_of(sug)
    if change.get('title'): sug['title'] = str(change['title'])[:80]
    sug['against'] = {cid: cues[cid]['text'] for cid in sug['cues']}
    sug['editedByAuthor'] = True
    tmp = path.with_suffix('.tmp'); tmp.write_text(json.dumps(notes, indent=2, ensure_ascii=False)+'\n'); tmp.replace(path)
    return sug


def if_deleted(root, sc, scenes, show, base, live, line_secs):
    """What deleting the whole scene would need (written per scene, under
    "ifDeleted" in its cut-suggestions file) and what it would save: the scene's
    stage time, less its montage and any spoken lines the fix moves elsewhere
    (they keep playing), and less any bridge lines the fix adds. Lists other scenes' suggestions that lean on its lines."""
    path = Path(root)/'cut-suggestions'/(sc['id']+'.json')
    if not path.exists(): return None
    plan = json.loads(path.read_text()).get('ifDeleted')
    if not plan: return None
    def spoken(t):
        # Only a line with a speaker ("NARRATOR: ...") is spoken. A stage direction,
        # drafted as "STAGE: ...", "[...]" or with no speaker, takes no spoken time.
        # A live role's line is read at the live rate, anyone else's is recorded.
        who, sep, words = t.partition(':')
        if not sep or len(who) > 30 or who.strip().upper() in ('STAGE', 'DIRECTION', 'STAGE DIRECTION') or t.lstrip().startswith('['): return 0
        return len(words.split())*rate(base, 'live' if who.strip().upper() in live else 'recorded')
    bridge = sum(spoken(c.get('text') or '') for c in plan.get('changes', []) if c.get('action') == 'add')/60
    mine = {c['id'] for c in show['cues'] if c['scene'] == sc['id']}
    moved_ids = {cid for c in plan.get('changes', []) if c.get('action') == 'move'
                 for cid in re.findall(r'\b(?:s\d+[a-z]?_[A-Za-z0-9_]+|cue_[0-9a-f]{32})\b', c.get('where') or '') if cid in mine}
    moved = sum(line_secs.get(cid, 0) for cid in moved_ids)/60
    affects = sorted({x['number'] for other in scenes if other['id'] != sc['id']
                      for x in (other.get('suggestions') or {}).get('items', [])
                      if x['status'] not in ('done', 'dismissed') and set(x.get('reliesOn') or []) & mine})
    return {**plan, 'bridgeMinutes': round(bridge, 2), 'montageMinutes': sc['fixed'], 'movedMinutes': round(moved, 2),
            'savesMinutes': round(max(0, sc['now'] - (0 if plan.get('removesMontage') else sc['fixed']) - moved - bridge), 2), 'affects': affects}


def dismiss_suggestion(root, sid, n, dismissed=True):
    """Set a suggestion aside (or bring it back). Kept in the file, so it stays
    dismissed across reloads and out of the counts, highlights and conflicts."""
    path = Path(root)/'cut-suggestions'/(sid+'.json')
    notes = json.loads(path.read_text())
    sug = notes['suggestions'][n]
    if dismissed: sug['dismissed'] = True
    else: sug.pop('dismissed', None)
    tmp = path.with_suffix('.tmp'); tmp.write_text(json.dumps(notes, indent=2, ensure_ascii=False)+'\n'); tmp.replace(path)
    return {'number': sug.get('number'), 'dismissed': bool(sug.get('dismissed'))}
