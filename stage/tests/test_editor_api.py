"""Exercise browser save requests against a temporary script, never the real play."""
import json, sys, tempfile, threading, unittest
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import serve
from script_store import ScriptStore
from editor_api import EditorAPI

class EditorHTTPTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original = serve.ROOT, serve.STORE, serve.EDITOR
        root = Path(self.temp.name)
        for name in ('show.json', 'generated-voices.json', 'runtime-baseline.json'):
            (root/name).write_bytes((serve.ROOT/name).read_bytes())
        serve.ROOT = root
        serve.STORE = ScriptStore(root)
        serve.EDITOR = EditorAPI(serve.STORE)
        self.start()

    def start(self):
        self.server = serve.ThreadingHTTPServer(('127.0.0.1', 0), serve.Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.url = 'http://127.0.0.1:' + str(self.server.server_port)

    def stop(self):
        self.server.shutdown(); self.server.server_close(); self.thread.join()

    def tearDown(self):
        self.stop()
        serve.ROOT, serve.STORE, serve.EDITOR = self.original
        self.temp.cleanup()

    def request(self, method, path, body=None, headers=None):
        request = Request(self.url+path, method=method,
            data=json.dumps(body).encode() if body is not None else None,
            headers={'Content-Type':'application/json', **(headers or {})})
        with urlopen(request) as response:
            return json.load(response)

    def test_save_survives_restart_conflicts_and_undo(self):
        script = self.request('GET', '/api/editor')
        line = script['scenes'][1]['lines'][0]
        rev = script['revision']
        saved = self.request('PUT', '/api/cue/'+line['id'], {'revision':rev, 'text':'Saved through the editor.'})
        self.stop()
        serve.STORE = ScriptStore(serve.ROOT)
        serve.EDITOR = EditorAPI(serve.STORE)
        self.start()
        current = self.request('GET', '/api/editor')
        self.assertEqual(current['scenes'][1]['lines'][0]['text'], 'Saved through the editor.')
        with self.assertRaises(HTTPError) as error:
            self.request('PUT', '/api/cue/'+line['id'], {'revision':rev, 'text':'Stale edit'})
        self.assertEqual(error.exception.code, 409)
        undone = self.request('POST', '/api/undo', {'revision':saved['revision']})
        self.assertEqual(self.request('GET', '/api/editor')['scenes'][1]['lines'][0]['text'], line['text'])
        self.request('POST', '/api/redo', {'revision':undone['revision']})
        self.assertEqual(self.request('GET', '/api/editor')['scenes'][1]['lines'][0]['text'], 'Saved through the editor.')

    def test_structure_and_speaker_change(self):
        script = self.request('GET','/api/editor')
        scene = script['scenes'][1]
        scene['lines'].insert(1, {'type':'narration','speaker':'narrator','text':'Inserted narrator.','direction':''})
        saved = self.request('PUT','/api/scene/'+scene['id'],scene)
        cue = saved['lines'][1]
        changed = self.request('PUT','/api/cue/'+cue['id'], {'revision':saved['revision'],'speaker':'liam'})
        self.assertEqual(changed['line']['speaker'],'liam')
        self.assertEqual(changed['line']['type'],'live')
        self.assertEqual(len(saved['lines']), len(scene['lines']))
        self.assertNotIn('audio',changed['line'])

    def test_runtime_follows_edits(self):
        before = self.request('GET', '/api/runtime')
        self.assertEqual(before['revision'], self.request('GET', '/api/revision')['revision'])
        script = self.request('GET', '/api/editor')
        spoken = lambda l: l['type'] != 'direction' and len(l['text'].split()) > 10
        scene = next(s for s in script['scenes'] if any(spoken(l) for l in s['lines']))
        line = next(l for l in scene['lines'] if spoken(l))
        self.request('PUT', '/api/cue/'+line['id'], {'revision':script['revision'], 'text':'Cut.'})
        after = self.request('GET', '/api/runtime')
        now = lambda r: next(s for s in r['scenes'] if s['id'] == scene['id'])
        self.assertLess(now(after)['now'], now(before)['now'])
        self.assertLess(after['nowMinutes'], before['nowMinutes'])

    def test_cut_suggestions_track_the_script(self):
        script = self.request('GET', '/api/editor')
        scene = next(s for s in script['scenes'] if sum(l['type'] != 'direction' for l in s['lines']) >= 2)
        a, b = [l for l in scene['lines'] if l['type'] != 'direction'][:2]
        notes = {'approach': 'Test.', 'suggestions': [
            {'title': 'Cut one', 'kind': 'cut', 'cues': [a['id']], 'edits': [], 'why': 'x', 'keeps': 'y', 'risk': 'low', 'against': {a['id']: a['text']}},
            {'title': 'Trim two', 'kind': 'trim', 'cues': [b['id']], 'edits': [{'cue': b['id'], 'text': 'Short.'}], 'why': 'x', 'keeps': 'y', 'risk': 'low', 'against': {b['id']: b['text']}}]}
        (serve.ROOT/'cut-suggestions').mkdir()
        (serve.ROOT/'cut-suggestions'/(scene['id']+'.json')).write_text(json.dumps(notes))
        items = lambda: next(s for s in self.request('GET', '/api/runtime')['scenes'] if s['id'] == scene['id'])['suggestions']['items']
        self.assertEqual([x['status'] for x in items()], ['open', 'open'])
        self.assertTrue(all(x['savesMinutes'] > 0 for x in items()))
        saved = self.request('PUT', '/api/cue/'+b['id'], {'revision': script['revision'], 'text': 'Short.'})
        self.request('PUT', '/api/cue/'+a['id'], {'revision': saved['revision'], 'text': 'Reworded instead.'})
        self.assertEqual([x['status'] for x in items()], ['stale', 'done'])
        self.request('PUT', f"/api/suggestion/{scene['id']}/0/dismiss", {'dismissed': True})
        self.assertEqual([x['status'] for x in items()], ['dismissed', 'done'])

    def test_accept_and_edit_suggestion(self):
        script = self.request('GET', '/api/editor')
        scene = next(s for s in script['scenes'] if sum(l['type'] != 'direction' for l in s['lines']) >= 3)
        a, b, c = [l for l in scene['lines'] if l['type'] != 'direction'][:3]
        notes = {'suggestions': [{'title': 'Cut one', 'kind': 'cut', 'cues': [a['id']], 'edits': [], 'why': 'x', 'keeps': 'y', 'risk': 'low', 'against': {a['id']: a['text']}}]}
        (serve.ROOT/'cut-suggestions').mkdir()
        (serve.ROOT/'cut-suggestions'/(scene['id']+'.json')).write_text(json.dumps(notes))
        edited = self.request('PUT', f"/api/suggestion/{scene['id']}/0", {'cues': [a['id'], b['id']], 'edits': [{'cue': b['id'], 'text': 'Shorter.'}]})
        self.assertEqual(edited['kind'], 'cut + trim')
        with self.assertRaises(HTTPError) as error:
            self.request('PUT', f"/api/suggestion/{scene['id']}/0", {'cues': ['not_a_cue']})
        self.assertEqual(error.exception.code, 400)
        accepted = self.request('POST', f"/api/suggestion/{scene['id']}/0/accept", {'revision': script['revision']})
        ids = [l['id'] for l in accepted['lines']]
        self.assertNotIn(a['id'], ids)
        self.assertEqual(next(l for l in accepted['lines'] if l['id'] == b['id'])['text'], 'Shorter.')
        self.assertIn(c['id'], ids)
        item = next(s for s in self.request('GET', '/api/runtime')['scenes'] if s['id'] == scene['id'])['suggestions']['items'][0]
        self.assertEqual(item['status'], 'done')
        self.assertEqual(self.request('PUT', f"/api/suggestion/{scene['id']}/0/dismiss", {'dismissed': True})['dismissed'], True)
        item = next(s for s in self.request('GET', '/api/runtime')['scenes'] if s['id'] == scene['id'])['suggestions']['items'][0]
        self.assertEqual(item['status'], 'done')  # done wins over dismissed
        self.request('PUT', f"/api/suggestion/{scene['id']}/0/dismiss", {'dismissed': False})
        self.request('POST', '/api/undo', {'revision': accepted['revision']})
        self.assertIn(a['id'], [l['id'] for l in self.request('GET', '/api/editor')['scenes'][[s['id'] for s in script['scenes']].index(scene['id'])]['lines']])

    def test_cross_origin_edits_refused(self):
        with self.assertRaises(HTTPError) as error:
            self.request('PUT','/api/proof',{'scenes':{}},{'Origin':'https://unrelated.example'})
        self.assertEqual(error.exception.code,403)

if __name__ == '__main__': unittest.main()
