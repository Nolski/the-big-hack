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
        for name in ('show.json', 'generated-voices.json'):
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

    def test_cross_origin_edits_refused(self):
        with self.assertRaises(HTTPError) as error:
            self.request('PUT','/api/proof',{'scenes':{}},{'Origin':'https://unrelated.example'})
        self.assertEqual(error.exception.code,403)

if __name__ == '__main__': unittest.main()
