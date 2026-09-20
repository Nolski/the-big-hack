#!/usr/bin/env python3
"""The Cuts page's server side: the pure analysis over a fake show, the real
show through the route, the notes files' validation, and the decisions sidecar.

Run on the host or inside the container:
    python3 storyboard/tests/test_cuts_api.py

Every test gets its own scratch copy of the stage folder, so nothing here
touches the live script, the live notes, or the author's decisions.
"""
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
STORYBOARD = HERE.parent
STAGE = STORYBOARD.parent / 'stage'


def _fresh_stage(root):
    root = Path(root)
    for name in ('show.json', 'generated-voices.json', 'script_store.py', 'screen-actions.json'):
        shutil.copy(STAGE / name, root / name)
    (root / 'assets' / 'audio').mkdir(parents=True, exist_ok=True)
    return root


_BOOT = tempfile.TemporaryDirectory()
_fresh_stage(_BOOT.name)
os.environ['SB_STAGE_DIR'] = _BOOT.name
sys.path.insert(0, str(STORYBOARD))
import server  # noqa: E402
import cuts_core  # noqa: E402


def _cue(cid, scene, kind, speaker, text, seconds, **extra):
    c = {'id': cid, 'scene': scene, 'kind': kind, 'speaker': speaker, 'name': speaker.title(),
         'text': text, 'direction': '', 'audioDuration': seconds, 'screenActions': {}}
    c.update(extra)
    return c


def fake_show():
    words = lambda n: ' '.join(['word'] * n)
    return {
        'scenes': [{'id': 'a', 'title': 'A', 'movement': 'I'}, {'id': 's11b', 'title': 'B', 'movement': 'I'}],
        'cues': [
            _cue('a_1', 'a', 'live', 'liam', words(75), 30.0),
            _cue('a_2', 'a', 'voice', 'kristina', words(10), 10.0, direction='(beat) then bright'),
            _cue('a_3', 'a', 'voice', 'narrator', words(40), 20.0),
            _cue('a_4', 'a', 'stage', '', 'He looks up.', 0),
            _cue('a_5', 'a', 'live', 'liam', 'Yes.', 2.0, silentPause=True),
            _cue('a_6', 'a', 'voice', 'kristina', words(12), 5.0, screenActions={'left': 'act'}),
            _cue('b_1', 's11b', 'live', 'liam', words(75), 30.0),
            _cue('b_2', 's11b', 'voice', 'kristina', words(10), 10.0, direction='(beat) then bright'),
            _cue('b_3', 's11b', 'voice', 'narrator', words(40), 20.0),
            _cue('b_4', 's11b', 'stage', '', 'He looks up.', 0),
            _cue('b_5', 's11b', 'live', 'liam', 'Yes.', 2.0, silentPause=True),
            _cue('b_6', 's11b', 'voice', 'kristina', words(12), 5.0, screenActions={'left': 'act'}),
        ],
    }


ACTIONS = {'act': {'steps': [{'seconds': 4}, {'seconds': 8}]}}


class Analysis(unittest.TestCase):
    def test_fake_show_metrics(self):
        a = cuts_core.analyse(fake_show(), ACTIONS, {'wordless': {}})
        m = a['scenes']['a']
        self.assertEqual(m['dialogue_s'], 47.0)
        self.assertEqual(m['narrator_s'], 20.0)
        self.assertEqual(m['words'], 75 + 10 + 1 + 12)
        self.assertEqual(m['screen_s'], 7.0)            # 12 s action, 5 s of it under speech
        self.assertEqual(m['stage_count'], 1)
        self.assertEqual(m['pauses'], 1)
        self.assertEqual(m['silent'], 1)
        expected = 47.0 * cuts_core.PACE_FACTOR + 7.0 + cuts_core.STAGE_BUSINESS_S + cuts_core.PAUSE_S + cuts_core.SILENT_PAUSE_S
        self.assertAlmostEqual(m['staged_s'], round(expected, 1), places=1)
        self.assertEqual(m['planes']['live']['seconds'], 32.0)
        self.assertEqual(m['planes']['video']['seconds'], 15.0)
        self.assertEqual(m['longest']['cue'], 'a_1')
        self.assertIn('a_1', m['long_speeches'])
        self.assertEqual(m['speakers'][0]['id'], 'liam')
        self.assertAlmostEqual(m['top_share'], 32 / 47, places=3)
        self.assertEqual(m['short_beats'], 1)
        self.assertEqual(len(m['cues']), 6)
        self.assertEqual(m['cues'][5]['action'], 'act')
        # narrator seconds never enter the staged figure
        self.assertLess(m['staged_s'], m['dialogue_s'] * cuts_core.PACE_FACTOR + 20)

    def test_protection_changes_rank_not_metrics(self):
        a = cuts_core.analyse(fake_show(), ACTIONS, {'wordless': {}})
        plain, held = a['scenes']['a'], a['scenes']['s11b']
        self.assertEqual(plain['staged_s'], held['staged_s'])
        self.assertEqual(plain['score'], held['score'])
        self.assertEqual(held['rank_score'], 0)
        self.assertEqual(held['protected']['level'], 'intact')
        self.assertEqual(held['reasons'][0]['kind'], 'protected')
        self.assertIsNone(plain['protected'])
        self.assertEqual(a['ranking'][0], 'a')

    def test_hash_follows_text(self):
        show = fake_show()
        before = cuts_core.scene_hash([c for c in show['cues'] if c['scene'] == 'a'])
        show['cues'][0]['text'] = 'changed'
        after = cuts_core.scene_hash([c for c in show['cues'] if c['scene'] == 'a'])
        self.assertNotEqual(before, after)
        self.assertEqual(len(before), 16)


class NotesFiles(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.notes = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, name, data):
        (self.notes / name).write_text(json.dumps(data) if not isinstance(data, str) else data)

    def test_validation_and_staleness(self):
        show = fake_show()
        cur = cuts_core.scene_hash([c for c in show['cues'] if c['scene'] == 'a'])
        self.write('a.json', {
            'sceneId': 'a', 'writtenAgainst': cur, 'grade': 'trimmable', 'turnsAt': 'a_2',
            'suggestions': [
                {'id': 'a-1', 'kind': 'cut-beat', 'cueIds': ['a_1', 'nope'], 'savingSeconds': 999, 'note': 'drop it'},
                {'id': 'a-2', 'kind': 'compress-speech', 'cueIds': ['a_1'], 'savingSeconds': 12, 'note': 'half of it'},
                {'id': 'a-3', 'kind': 'weird', 'cueIds': ['a_2'], 'savingSeconds': 1, 'note': 'a — b'},
            ]})
        self.write('s11b.json', {'sceneId': 's11b', 'writtenAgainst': 'old', 'grade': 'protected',
                                 'suggestions': [{'kind': 'cut-scene', 'cueIds': ['b_1'], 'savingSeconds': 1, 'note': 'x'}]})
        self.write('broken.json', '{not json')
        a = cuts_core.analyse(show, ACTIONS, {'wordless': {}}, self.notes)
        n = a['scenes']['a']['notes']
        self.assertFalse(n['stale'])
        s1, s2, s3 = n['suggestions']
        self.assertEqual(s1['cueIds'], ['a_1'])
        self.assertEqual(s1['missingCueIds'], ['nope'])
        self.assertTrue(s1['stale'])
        self.assertEqual(s1['savingSeconds'], 30.0)      # recomputed from the clip, not the written 999
        self.assertEqual(s2['savingSeconds'], 12.0)      # compress keeps the written fraction
        self.assertEqual(s1['dialogueSeconds'], 30.0)
        self.assertEqual(s1['narratorSeconds'], 0.0)
        self.assertAlmostEqual(s1['stagedSavingSeconds'], round(30.0 * cuts_core.PACE_FACTOR, 1), places=1)
        self.assertEqual(n['allSavingSeconds'], 30.0 + 12.0 + 10.0)
        self.assertEqual(n['recommendedSavingSeconds'], n['allSavingSeconds'])   # none written, so all
        self.assertEqual(s3['kind'], 'trim')             # unknown kind coerced
        self.assertTrue(a['scenes']['s11b']['notes']['stale'])
        msgs = ' '.join(p['message'] for p in a['notes_problems'])
        self.assertIn("'nope'", msgs)
        self.assertIn('em dash', msgs)
        self.assertIn('cut-scene on a protected', msgs)
        self.assertIn('unreadable', msgs)
        self.assertIn('weird', msgs)
        self.assertEqual(a['totals']['notes_saving_s'], n['recommendedSavingSeconds'])  # the stale s11b file is left out

    def test_narrator_and_lift_savings(self):
        show = fake_show()
        cur = cuts_core.scene_hash([c for c in show['cues'] if c['scene'] == 'a'])
        self.write('a.json', {
            'sceneId': 'a', 'writtenAgainst': cur, 'grade': 'liftable', 'recommendedSavingSeconds': 20,
            'suggestions': [
                {'id': 'a-1', 'kind': 'cut-beat', 'cueIds': ['a_3'], 'savingSeconds': 20, 'note': 'narrator only'},
                {'id': 'a-2', 'kind': 'cut-scene', 'cueIds': ['a_1', 'a_2', 'a_3'], 'savingSeconds': 60, 'note': 'lift'},
            ]})
        a = cuts_core.analyse(show, ACTIONS, {'wordless': {}}, self.notes)
        n = a['scenes']['a']['notes']
        s1, s2 = n['suggestions']
        self.assertEqual(s1['narratorSeconds'], 20.0)
        self.assertEqual(s1['dialogueSeconds'], 0.0)
        self.assertEqual(s1['stagedSavingSeconds'], 0.0)     # the narrator is not stage time
        self.assertEqual(s2['stagedSavingSeconds'], a['scenes']['a']['staged_s'])   # a lift takes the whole scene
        self.assertEqual(n['recommendedSavingSeconds'], 20.0)  # the writer's figure survives
        self.assertEqual(n['allSavingSeconds'], 80.0)


class CutsApi(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = _fresh_stage(self.tmp.name)
        server.STORE = server.ScriptStore(self.root)
        server.CUTS_PATH = self.root / 'cuts.json'
        server.CUTS_NOTES = STORYBOARD / 'cuts-notes'

    def tearDown(self):
        self.tmp.cleanup()

    def status(self, fn, *args):
        try:
            fn(*args)
        except server.HTTPException as e:
            return e.status_code
        self.fail('expected an HTTPException')

    def test_analysis_over_the_real_show(self):
        a = server.api_cuts_analysis()
        self.assertEqual(len(a['order']), len(server.STORE.read()['scenes']))
        self.assertTrue(a['revision'])
        t = a['totals']
        self.assertGreater(t['staged_s'], t['dialogue_s'])
        self.assertGreater(t['to_cut_s'], 0)
        self.assertEqual(a['scenes']['s11b']['protected']['level'], 'intact')
        self.assertEqual(a['scenes']['s11b']['rank_score'], 0)
        self.assertTrue(a['scenes']['s11c']['protected'])
        self.assertTrue(a['scenes']['s11c']['author_cut'])
        self.assertEqual(a['movements']['II']['budget_s'], 22 * 60)
        self.assertEqual(a['scenes']['s00']['allowance_s'], 111)
        # the shipped notes are current and clean against the shipped script
        self.assertEqual(a['notes_problems'], [])
        for sid, m in a['scenes'].items():
            if m['notes']:
                self.assertFalse(m['notes']['stale'], sid)

    def test_edit_makes_notes_stale(self):
        a = server.api_cuts_analysis()
        with_notes = [sid for sid in a['order'] if a['scenes'][sid]['notes'] and a['scenes'][sid]['notes']['suggestions']]
        if not with_notes:
            self.skipTest('no notes files shipped yet')
        sid = with_notes[0]
        cid = a['scenes'][sid]['notes']['suggestions'][0]['cueIds'][0]
        server.api_cue_update(cid, {'revision': server.STORE.revision(), 'text': 'changed words'})
        b = server.api_cuts_analysis()
        self.assertTrue(b['scenes'][sid]['notes']['stale'])
        self.assertNotEqual(a['revision'], b['revision'])

    def test_decisions_round_trip(self):
        self.assertEqual(server.api_cuts_get(), {'scenes': {}})
        r = server.api_cuts_put({'scenes': {'s12': {'decision': 'trim', 'target': '4.5', 'note': 'x', 'planned': ['s12-2', 's12-1']}}})
        self.assertEqual(r['scenes']['s12'], {'decision': 'trim', 'target': 4.5, 'note': 'x', 'planned': ['s12-1', 's12-2']})
        self.assertTrue(r['saved'])
        self.assertEqual(server.api_cuts_get()['scenes'], r['scenes'])
        self.assertEqual(self.status(server.api_cuts_put, {'scenes': {'s12': {'decision': 'maybe'}}}), 400)
        self.assertEqual(self.status(server.api_cuts_put, {'scenes': {'s12': {'target': 'soon'}}}), 400)
        self.assertEqual(self.status(server.api_cuts_put, {}), 400)
        server.CUTS_PATH.write_text('{broken')
        self.assertEqual(server.api_cuts_get(), {'scenes': {}})


if __name__ == '__main__':
    unittest.main(verbosity=2)
