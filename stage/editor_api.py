"""The editor's small HTTP API. All script writes go through ScriptStore."""
import json
from script_store import Conflict, digest

class EditorAPI:
    def __init__(self, store):
        self.store = store
        self.progress = store.root / 'proof-progress.json'

    def names(self):
        return {c['speaker']: c['name'] for c in self.store.read()['cues'] if c.get('speaker')}

    def scene(self, sid):
        return next(s for s in self.store.scenes() if s['id'] == sid)

    def line(self, cid):
        for scene in self.store.scenes():
            for index, line in enumerate(scene['lines']):
                if line['id'] == cid:
                    return scene, index, line
        raise ValueError('Unknown cue')

    def cue_fields(self, cid, patch):
        scene, index, line = self.line(cid)
        fields = {key: line.get(key, '') for key in ('text', 'direction', 'type', 'speaker')}
        fields.update({key: patch[key] for key in fields if key in patch})
        if not str(fields['text']).strip():
            raise ValueError('A line cannot be empty; remove it with the delete button.')
        if 'speaker' in patch:
            if fields['speaker'] == 'narrator': fields['type'] = 'narration'
            elif fields['type'] == 'narration': fields['type'] = 'live'
        if fields['type'] == 'direction': fields['speaker'] = ''
        elif fields['type'] == 'narration': fields['speaker'] = 'narrator'
        elif fields['speaker'] in ('', 'narrator'):
            neighbours = scene['lines'][:index][::-1] + scene['lines'][index:]
            fields['speaker'] = next((l['speaker'] for l in neighbours if l['type'] in ('live', 'video') and l['speaker'] != 'narrator'), '')
        return {**fields, 'revision': patch['revision']}

    def handle(self, method, route, payload=None):
        st = self.store
        payload = payload or {}
        if method == 'GET':
            if route == '/api/editor':
                show = st.read()
                names = {c['speaker']: c['name'] for c in show['cues'] if c.get('speaker')}
                return {'revision': digest(show), 'scenes': st.scenes(show), 'characters': [{'id': k, 'name': v} for k, v in names.items()]}
            if route == '/api/revision': return {'revision': st.revision()}
            if route == '/api/history': return st.history_state()
            if route == '/api/proof':
                return json.loads(self.progress.read_text()) if self.progress.exists() else {'scenes': {}, 'at': None}
        if route == '/api/proof' and method == 'PUT':
            if not isinstance(payload.get('scenes'), dict): raise ValueError('Invalid reading progress')
            st.atomic(self.progress, payload)
            return payload
        if not payload.get('revision'): raise Conflict('Reload the script before saving.')
        if method == 'POST' and route in ('/api/undo', '/api/redo'):
            return st.step(payload['revision'], route.rsplit('/', 1)[1])
        if method == 'PUT' and route.startswith('/api/cue/'):
            cid = route.rsplit('/', 1)[1]
            st.update_cue(cid, self.cue_fields(cid, payload), self.names())
            scene, _, line = self.line(cid)
            return {'revision': scene['revision'], 'line': line}
        if route.startswith('/api/scene/'):
            sid = route.rsplit('/', 1)[1]
            if method == 'PUT':
                st.update_scene(sid, payload, self.names())
                return self.scene(sid)
            if method == 'DELETE':
                st.delete_scene(sid, payload['revision'])
                return {'revision': st.revision()}
        raise ValueError('Unknown editor operation')
