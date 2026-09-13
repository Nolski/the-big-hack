#!/usr/bin/env python3
"""The proofreading page's server side, against a scratch copy of the shared script.

Run on the host or inside the container:
    python3 storyboard/tests/test_proof_api.py

Handlers are called as plain functions with dict bodies and HTTPException status
codes are asserted directly, the way storyboard/tests/shared_api_check.py does.
Every test gets its own copy of stage/show.json, so nothing here touches the
live script.
"""
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
    for name in ('show.json', 'generated-voices.json', 'script_store.py'):
        shutil.copy(STAGE / name, root / name)
    (root / 'assets' / 'audio').mkdir(parents=True, exist_ok=True)
    return root


# server.py builds its store from SB_STAGE_DIR at import time, so point it at a
# scratch directory before importing; each test then swaps in its own copy.
_BOOT = tempfile.TemporaryDirectory()
_fresh_stage(_BOOT.name)
os.environ['SB_STAGE_DIR'] = _BOOT.name
sys.path.insert(0, str(STORYBOARD))
import server  # noqa: E402


def _plain(lines):
    return [{'id': l['id'], 'type': l['type'], 'speaker': l['speaker'],
             'text': l['text'], 'direction': l['direction']} for l in lines]


class ProofApi(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = _fresh_stage(self.tmp.name)
        server.STORE = server.ScriptStore(self.root)
        server.PROOF_PATH = self.root / 'proof.json'

    def tearDown(self):
        self.tmp.cleanup()

    def rev(self):
        return server.STORE.revision()

    def cue(self, cid):
        return next(c for c in server.STORE.read()['cues'] if c['id'] == cid)

    def status(self, fn, *args):
        try:
            fn(*args)
        except server.HTTPException as e:
            return e.status_code
        self.fail('expected an HTTPException')

    # ---- single-cue edits ---------------------------------------------------

    def test_text_edit_normalises_and_drops_audio(self):
        before = self.rev()
        self.assertTrue(self.cue('s01_l2').get('audio'))
        r = server.api_cue_update('s01_l2', {'revision': before, 'text': '  new   words  '})
        self.assertEqual(r['line']['text'], 'new words')
        self.assertNotEqual(r['revision'], before)
        self.assertEqual(r['revision'], self.rev())
        self.assertIsNone(self.cue('s01_l2').get('audio'))
        self.assertNotIn('audio', r['line'])

    def test_direction_edit_keeps_audio(self):
        r = server.api_cue_update('s01_l2', {'revision': self.rev(), 'direction': '  softly '})
        self.assertEqual(r['line']['direction'], 'softly')
        self.assertTrue(self.cue('s01_l2').get('audio'))

    def test_speaker_narrator_becomes_narration(self):
        r = server.api_cue_update('s01_l3', {'revision': self.rev(), 'speaker': 'narrator'})
        self.assertEqual(r['line']['type'], 'narration')
        self.assertEqual(r['line']['speaker'], 'narrator')

    def test_narration_to_named_speaker_becomes_live(self):
        r = server.api_cue_update('s01_l4', {'revision': self.rev(), 'speaker': 'liam'})
        self.assertEqual(r['line']['type'], 'live')
        self.assertEqual(r['line']['speaker'], 'liam')

    def test_type_direction_clears_speaker_and_back_picks_a_neighbour(self):
        r = server.api_cue_update('s01_l3', {'revision': self.rev(), 'type': 'direction'})
        self.assertEqual(r['line']['type'], 'direction')
        self.assertEqual(r['line']['speaker'], '')
        r = server.api_cue_update('s01_l3', {'revision': self.rev(), 'type': 'live'})
        self.assertEqual(r['line']['type'], 'live')
        self.assertTrue(r['line']['speaker'])
        self.assertNotEqual(r['line']['speaker'], 'narrator')

    def test_montage_must_stay_a_stage_cue(self):
        self.assertEqual(self.status(server.api_cue_update, 's00_montage',
                                     {'revision': self.rev(), 'type': 'live'}), 400)

    def test_empty_text_is_refused(self):
        self.assertEqual(self.status(server.api_cue_update, 's01_l2',
                                     {'revision': self.rev(), 'text': '   '}), 400)

    def test_stale_missing_and_unknown(self):
        old = self.rev()
        server.api_cue_update('s01_l2', {'revision': old, 'text': 'moved on'})
        self.assertEqual(self.status(server.api_cue_update, 's01_l2', {'revision': old, 'text': 'late'}), 409)
        self.assertEqual(self.status(server.api_cue_update, 's01_l2', {'text': 'no revision'}), 409)
        self.assertEqual(self.status(server.api_cue_update, 'nope', {'revision': self.rev(), 'text': 'x'}), 404)

    def test_noop_keeps_revision_and_writes_no_history(self):
        scene = server.get_scene('s01')
        line = next(l for l in scene['lines'] if l['text'] == ' '.join(l['text'].split()) and l['text'])
        before = self.rev()
        r = server.api_cue_update(line['id'], {'revision': before, 'text': line['text']})
        self.assertEqual(r['revision'], before)
        history = self.root / 'script-history'
        self.assertFalse(history.exists() and any(history.glob('*.json')))

    # ---- structural edits through the existing scene endpoint ----------------

    def test_scene_lines_insert_and_delete_preserve_ids_and_staging(self):
        scene = server.get_scene('s01')
        before_ids = [l['id'] for l in scene['lines']]
        before_cues = {c['id']: c for c in server.STORE.read()['cues']}
        lines = _plain(scene['lines'])
        lines.insert(2, {'type': 'live', 'speaker': 'liam', 'text': '…', 'direction': ''})
        saved = server.update_scene('s01', {'revision': scene['revision'], 'lines': lines})
        ids = [l['id'] for l in saved['lines']]
        self.assertEqual(len(ids), len(before_ids) + 1)
        self.assertTrue(ids[2].startswith('cue_'))
        self.assertEqual([i for i in ids if i != ids[2]], before_ids)
        after_cues = {c['id']: c for c in server.STORE.read()['cues']}
        for cid in before_ids:
            for key in ('screenActions', 'computers', 'staging', 'sfx'):
                self.assertEqual(after_cues[cid].get(key), before_cues[cid].get(key), f'{cid}.{key}')
        gone = _plain(l for l in saved['lines'] if l['id'] != ids[2])
        saved = server.update_scene('s01', {'revision': saved['revision'], 'lines': gone})
        self.assertEqual([l['id'] for l in saved['lines']], before_ids)

    def test_a_scene_keeps_at_least_one_cue(self):
        new = server.add_scene({'revision': self.rev(), 'title': 'PROOF TEST'})
        self.assertEqual(self.status(server.update_scene, new['id'],
                                     {'revision': self.rev(), 'lines': []}), 400)

    def test_scene_delete_keeps_history_and_refuses_stale(self):
        new = server.add_scene({'revision': self.rev(), 'title': 'PROOF TEST'})
        old = self.rev()
        server.delete_scene(new['id'], {'revision': old})
        self.assertTrue((self.root / 'script-history' / f'{old}.json').exists())
        self.assertIn(self.status(server.delete_scene, new['id'], {'revision': old}), (404, 409))

    # ---- the small endpoints -------------------------------------------------

    def test_revision_endpoint(self):
        self.assertEqual(server.api_revision()['revision'], self.rev())

    def test_proof_state_round_trips_and_dedupes_flags(self):
        out = server.api_proof_put({
            'at': {'scene': 's01', 'line': 's01_l4'},
            'scenes': {'s01': {'done': True, 'at': 's01_l4', 'flags': ['b', 'a', 'b']}},
        })
        self.assertEqual(out['scenes']['s01']['flags'], ['a', 'b'])
        got = server.api_proof_get()
        self.assertTrue(got['scenes']['s01']['done'])
        self.assertEqual(got['at']['line'], 's01_l4')
        self.assertEqual(self.status(server.api_proof_put, {'scenes': 'nope'}), 400)


if __name__ == '__main__':
    unittest.main()
