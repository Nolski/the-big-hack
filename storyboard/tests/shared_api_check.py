import json,tempfile,sys,threading,urllib.request
from pathlib import Path
sys.path[:0]=['/app','/stage']
import server,serve
from script_store import ScriptStore
with tempfile.TemporaryDirectory() as tmp:
 root=Path(tmp)
 for name in ['show.json','generated-voices.json']:(root/name).write_bytes((Path('/stage')/name).read_bytes())
 store=ScriptStore(root);server.STORE=store;serve.STORE=store
 http=serve.ThreadingHTTPServer(('127.0.0.1',0),serve.Handler);threading.Thread(target=http.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(http.server_port)
 def req(path,data=None):
  return json.load(urllib.request.urlopen(urllib.request.Request(base+path,data=json.dumps(data).encode() if data else None,headers={'Content-Type':'application/json'},method='PUT' if data else 'GET')))
 initial=req('/api/script');scene=next(s for s in initial['scenes'] if s['id']=='s01');cue=next(l for l in scene['lines'] if l['id']=='s01_l4')
 req('/api/script/cue',{**cue,'revision':initial['revision'],'text':'Stage edit seen by storyboard.'})
 changed=next(l for s in server.get_storyboard()['scenes'] for l in s['lines'] if l['id']==cue['id']);assert changed['text']=='Stage edit seen by storyboard.' and not changed.get('audio')
 sc=server.get_scene('s01');next(l for l in sc['lines'] if l['id']==cue['id'])['text']='Storyboard edit seen by stage.';server.update_scene('s01',sc)
 assert next(c for c in req('/api/script')['show']['cues'] if c['id']==cue['id'])['text']=='Storyboard edit seen by stage.'
 try:server.update_scene('s01',scene);raise AssertionError('stale save accepted')
 except server.HTTPException as e:assert e.status_code==409
 line=next(l for l in server.get_scene('s01')['lines'] if l['id']==cue['id']);server.api_review_line({'scene':'s01','line':cue['id'],'expect':line['_raw'],'text':'**Narrator**: Review edit seen by both.'})
 assert next(c for c in req('/api/script')['show']['cues'] if c['id']==cue['id'])['text']=='Review edit seen by both.'
 assert not next(l for s in server.build_scenes() for l in s['lines'] if l['id']==cue['id']).get('audio')
 http.shutdown()
 print('PASS: Stage HTTP -> storyboard; storyboard -> stage HTTP; review -> both; stale save returns 409; changed speech has no stale audio.')
