"""The editor's small HTTP API. All script writes go through ScriptStore."""
import json
from script_store import Conflict, digest
from runtime import dismiss_suggestion, runtime, save_suggestion, suggestions

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

    def accept(self, sid, n, revision):
        """Put one cut suggestion into the script as a single scene save, so one
        undo takes it back out. Refused if its lines changed since it was written."""
        show = self.store.read()
        plan = suggestions(self.store.root, sid, show, {})
        if not plan or n >= len(plan['items']): raise ValueError('Unknown suggestion')
        sug = plan['items'][n]
        if sug['status'] == 'done': raise ValueError('That suggestion is already in the script.')
        if sug['status'] == 'stale': raise ValueError('Those lines changed since the suggestion was written. Edit the suggestion first.')
        edits = {e['cue']: e['text'] for e in sug.get('edits') or []}
        lines = []
        for line in self.scene(sid)['lines']:
            if line['id'] in sug['cues'] and line['id'] not in edits: continue
            text = edits.get(line['id'], line['text'])
            lines.append({'id': line['id'], 'type': line['type'], 'speaker': line.get('speaker', ''), 'text': text, 'direction': line.get('direction', '')})
        if not lines: raise ValueError('That would leave the scene empty; delete the scene instead.')
        self.store.update_scene(sid, {'revision': revision, 'lines': lines}, self.names())
        return self.scene(sid)

    def handle(self, method, route, payload=None):
        st = self.store
        payload = payload or {}
        if method == 'GET':
            if route == '/api/editor':
                show = st.read()
                names = {c['speaker']: c['name'] for c in show['cues'] if c.get('speaker')}
                return {'revision': digest(show), 'scenes': st.scenes(show), 'characters': [{'id': k, 'name': v} for k, v in names.items()]}
            if route == '/api/revision':
                notes = [f.stat().st_mtime_ns for f in (st.root/'cut-suggestions').glob('*.json')] if (st.root/'cut-suggestions').exists() else []
                return {'revision': st.revision(), 'notes': f"{len(notes)}:{max(notes, default=0)}"}
            if route == '/api/history': return st.history_state()
            if route == '/api/runtime': return {'revision': st.revision(), **runtime(st.root)}
            if route == '/api/proof':
                return json.loads(self.progress.read_text()) if self.progress.exists() else {'scenes': {}, 'at': None}
        if route == '/api/proof' and method == 'PUT':
            if not isinstance(payload.get('scenes'), dict): raise ValueError('Invalid reading progress')
            st.atomic(self.progress, payload)
            return payload
        if route.startswith('/api/suggestion/') and route.endswith('/dismiss') and method == 'PUT':
            _, _, _, sid, n, _ = route.split('/')
            return dismiss_suggestion(st.root, sid, int(n), bool(payload.get('dismissed', True)))
        if route.startswith('/api/suggestion/') and method == 'PUT':
            _, _, _, sid, n = route.split('/')
            return save_suggestion(st.root, sid, int(n), payload, st.read())
        if not payload.get('revision'): raise Conflict('Reload the script before saving.')
        if route.startswith('/api/suggestion/') and route.endswith('/accept') and method == 'POST':
            _, _, _, sid, n, _ = route.split('/')
            return self.accept(sid, int(n), payload['revision'])
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
