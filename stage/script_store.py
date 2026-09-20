"""Shared authoring store. Both apps edit stage/show.json through this module.
No model/runtime dependencies. Advisory lock + atomic replace + revision checks.
"""
import copy, fcntl, hashlib, json, os, re, tempfile, uuid
from contextlib import contextmanager
from pathlib import Path

class Conflict(ValueError): pass

def digest(data):
    return hashlib.sha256(json.dumps(data,sort_keys=True,ensure_ascii=False).encode()).hexdigest()

def raw_line(c):
    if c.get('kind')=='stage': return '*('+c['text']+')*'
    name=c.get('name') or c.get('speaker','').upper()
    direction=c.get('direction','')
    return '**'+name+'**'+(' *('+direction+')*' if direction else '')+': '+c['text']

class ScriptStore:
    def __init__(self, root):
        self.root=Path(root); self.path=self.root/'show.json'
    def read(self): return json.loads(self.path.read_text())
    def revision(self): return digest(self.read())
    @contextmanager
    def locked(self):
        with (self.root/'.script.lock').open('a') as f:
            fcntl.flock(f,fcntl.LOCK_EX)
            yield
    def atomic(self,path,data):
        fd,tmp=tempfile.mkstemp(dir=path.parent,prefix='.'+path.name)
        try:
            with os.fdopen(fd,'w') as f:
                json.dump(data,f,ensure_ascii=False,indent=2);f.write('\n');f.flush();os.fsync(f.fileno())
            os.replace(tmp,path)
        finally:
            if os.path.exists(tmp): os.unlink(tmp)
    def transaction(self,expect,edit):
        with self.locked():
            show=self.read()
            if not expect or expect!=digest(show): raise Conflict('The script changed. Reload before saving your edit.')
            before=copy.deepcopy(show)
            edit(show)
            self.validate(show)
            if show==before: return digest(show)
            self.reindex(show)
            history=self.root/'script-history';history.mkdir(exist_ok=True)
            backup=history/(digest(before)+'.json')
            if not backup.exists(): self.atomic(backup,before)
            show['scriptRevision']='shared-'+uuid.uuid4().hex[:16]
            self.atomic(self.path,show)
            return digest(show)
    def validate(self,s):
        scenes=[x['id'] for x in s['scenes']]; ids=[x['id'] for x in s['cues']]
        if not scenes or not ids: raise ValueError('The show must contain at least one scene and cue.')
        if len(set(scenes))!=len(scenes) or len(set(ids))!=len(ids): raise ValueError('Scene and cue IDs must be unique.')
        if any(c['scene'] not in scenes for c in s['cues']): raise ValueError('Cue references an unknown scene.')
        for c in s['cues']:
            if not re.fullmatch(r'[a-zA-Z0-9_-]+',c['id']): raise ValueError('Invalid cue ID.')
            if c['kind'] not in ('stage','voice','live'): raise ValueError('Invalid cue type.')
            if not isinstance(c.get('text'),str): raise ValueError('Cue text must be text.')
            if c['kind']!='stage' and not c.get('speaker'): raise ValueError('Select a speaker for every spoken cue.')
        if any(not any(c['scene']==sc['id'] for c in s['cues']) for sc in s['scenes']): raise ValueError('Each scene needs at least one cue.')
    def reindex(self,s):
        s['cues']=[c for sc in s['scenes'] for c in s['cues'] if c['scene']==sc['id']]
        s['performanceStarts']=list(range(len(s['cues'])))
        for i,c in enumerate(s['cues']):
            c['groupEnd']=i;c['notes']=[{k:c.get(k,'') for k in ('id','kind','name','text','direction')}]
        for sc in s['scenes']:
            indexes=[i for i,c in enumerate(s['cues']) if c['scene']==sc['id']]
            sc['start']=indexes[0];sc['count']=len(indexes)
    def scenes(self,show=None,manifest=None):
        s=show or self.read(); rev=digest(s)
        if manifest is None: manifest=json.loads((self.root/'generated-voices.json').read_text()).get('recordings',{})
        out=[]
        for n,sc in enumerate(s['scenes'],1):
            result={'number':n,'display_number':n,'world':'modern','beat':'','status':'revised','setting':'','narration':'','sketch':{},'music':{},**copy.deepcopy(sc.get('storyboard',{})), 'id':sc['id'],'title':sc['title'],'movement':sc.get('movement',''),'revision':rev,'source_file':str(self.path),'lines':[]}
            for c in s['cues']:
                if c['scene']!=sc['id']: continue
                r=manifest.get(c['id'],{}); match=r.get('text')==c['text'] and r.get('speaker')==c.get('speaker') and r.get('voiceProfile')==c.get('voiceProfile')
                ln={'id':c['id'],'type':'direction' if c['kind']=='stage' else 'narration' if c.get('speaker')=='narrator' else 'live' if c['kind']=='live' else 'video','speaker':c.get('speaker',''),'text':c['text'],'direction':c.get('direction',''),'_raw':raw_line(c),'audio_status':'ready' if match else 'silent' if c['kind']=='stage' else 'needs generation'}
                if match and r.get('audio'): ln['audio']='/stage/'+r['audio']
                if c.get('montage'): ln['audio']='/stage/'+c['montage'];ln['video']=ln['audio'];ln['audio_status']='ready'
                result['lines'].append(ln)
            out.append(result)
        return out
    def apply_line(self,c,line,names):
        kind={'direction':'stage','narration':'voice','live':'live','video':'voice'}.get(line.get('type'))
        if not kind: raise ValueError('Unknown line type.')
        speaker=(c.get('speaker','') if c.get('kind')=='stage' else '') if kind=='stage' else 'narrator' if line['type']=='narration' else line.get('speaker','')
        if c.get('montage') and (kind!='stage' or speaker): raise ValueError('The montage cue must remain a stage cue.')
        changed=(c.get('text'),c.get('speaker'))!=(line.get('text',''),speaker)
        c.update(kind=kind,speaker=speaker,name=c.get('name','') if c.get('speaker')==speaker else names.get(speaker,speaker),text=line.get('text',''),direction=line.get('direction',''))
        if changed: c['audio']=None;c['audioDuration']=0
    def update_scene(self,sid,payload,names):
        def edit(s):
            sc=next(x for x in s['scenes'] if x['id']==sid)
            sc['title']=payload.get('title',sc['title']);sc['movement']=payload.get('movement',sc.get('movement',''))
            sc.setdefault('storyboard',{}).update({k:payload[k] for k in ('world','beat','status','sketch','music','productionSetting') if k in payload})
            if payload.get('setting') or payload.get('narration'): raise ValueError('Add narration as a script line so both apps play it in the same order.')
            if 'lines' not in payload: return
            existing={c['id']:c for c in s['cues'] if c['scene']==sid};new=[]
            for line in payload['lines']:
                cid=line.get('id') or 'cue_'+uuid.uuid4().hex
                if any(c['id']==cid and c['scene']!=sid for c in s['cues']): raise ValueError('Cue ID belongs to another scene.')
                c=copy.deepcopy(existing.get(cid,{'id':cid,'scene':sid,'state':'black','mode':sc.get('mode','physical'),'cast':[],'screenActions':{},'computers':{},'sfx':[],'advance':'manual'}))
                self.apply_line(c,line,names);new.append(c)
            s['cues']=[c for c in s['cues'] if c['scene']!=sid]+new
        return self.transaction(payload.get('revision'),edit)
    def update_cue(self,cid,payload,names=None):
        def edit(s):
            c=next(c for c in s['cues'] if c['id']==cid)
            self.apply_line(c,payload,names or {x.get('speaker'):x.get('name') for x in s['cues']})
        return self.transaction(payload.get('revision'),edit)
    def delete_scene(self,sid,expect):
        def edit(s):
            s['scenes']=[x for x in s['scenes'] if x['id']!=sid];s['cues']=[c for c in s['cues'] if c['scene']!=sid]
        return self.transaction(expect,edit)
    def add_scene(self,payload,names):
        sid='scene_'+uuid.uuid4().hex[:12]
        def edit(s):
            s['scenes'].append({'id':sid,'title':payload.get('title','New scene'),'movement':payload.get('movement',''),'mode':'physical'})
            s['cues'].append({'id':'cue_'+uuid.uuid4().hex,'scene':sid,'kind':'stage','speaker':'','name':'','text':'New scene.','direction':'','state':'black','mode':'physical','screenActions':{},'computers':{},'sfx':[]})
        self.transaction(payload.get('revision'),edit);return sid
    def reorder(self,ids,expect):
        def edit(s):
            if len(ids)!=len(s['scenes']) or set(ids)!={sc['id'] for sc in s['scenes']}: raise ValueError('Include every scene exactly once.')
            by={sc['id']:sc for sc in s['scenes']};s['scenes']=[by[i] for i in ids]
        return self.transaction(expect,edit)
    def register_audio(self,cid,text,speaker,profile,path,duration):
        with self.locked():
            s=self.read();c=next((c for c in s['cues'] if c['id']==cid),None)
            if not c or (c['text'],c['speaker'],c.get('voiceProfile'))!=(text,speaker,profile): raise Conflict('Script or voice changed during generation; recording was not attached.')
            data=Path(path).read_bytes();sha=hashlib.sha256(data).hexdigest();dest=self.root/'assets/audio'/('shared-'+sha+Path(path).suffix)
            dest.write_bytes(data)
            mpath=self.root/'generated-voices.json';m=json.loads(mpath.read_text());rel=str(dest.relative_to(self.root))
            m['recordings'][cid]={'text':text,'speaker':speaker,'voiceProfile':profile,'audio':rel,'duration':duration,'audioSha256':sha,'provenance':{'type':'shared-script-generation'}}
            self.atomic(mpath,m)
            c['audio']=rel;c['audioDuration']=duration
            self.atomic(self.path,s)
    def export_markdown(self):
        s=self.read();return '\n\n'.join(['# '+s['title']]+['## '+sc['title']+'\n\n'+'\n\n'.join('<!-- cue:'+c['id']+' -->\n'+raw_line(c) for c in s['cues'] if c['scene']==sc['id']) for sc in s['scenes']])+'\n'
