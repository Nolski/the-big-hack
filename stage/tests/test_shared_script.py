import copy,json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from script_store import ScriptStore,Conflict,digest

class SharedScriptTest(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
  original=Path(__file__).resolve().parents[1]
  for name in ['show.json','generated-voices.json']:(self.root/name).write_bytes((original/name).read_bytes())
  (self.root/'assets/audio').mkdir(parents=True)
  self.store=ScriptStore(self.root);self.before=self.store.read()
  self.names={c['speaker']:c.get('name','') for c in self.before['cues']}
 def tearDown(self):self.tmp.cleanup()
 def test_full_import(self):
  scenes=self.store.scenes()
  self.assertEqual(len(scenes),len(self.before['scenes']));self.assertEqual(sum(len(s['lines']) for s in scenes),len(self.before['cues']))
  self.assertEqual([l['text'] for s in scenes for l in s['lines']],[c['text'] for c in self.before['cues']])
  for scene in scenes:
   for line in scene['lines']:
    if line['audio_status']=='ready': self.assertTrue(line.get('audio'))
 def test_stage_edit_storyboard_audio_and_conflict(self):
  old=self.store.revision();ln=next(l for s in self.store.scenes() for l in s['lines'] if l['id']=='s01_l4')
  self.store.update_cue('s01_l4',{**ln,'text':'New narrator text.','revision':old},self.names)
  current=next(l for s in self.store.scenes() for l in s['lines'] if l['id']=='s01_l4')
  self.assertEqual(current['text'],'New narrator text.');self.assertNotIn('audio',current)
  with self.assertRaises(Conflict):self.store.update_cue('s01_l4',{**ln,'revision':old},self.names)
 def test_storyboard_edit_preserves_choreography_and_ids(self):
  scene=self.store.scenes()[1];scene['lines'].insert(2,{'id':'new_immutable_id','text':'Added line','speaker':'liam','type':'live','direction':''})
  self.store.update_scene(scene['id'],scene,self.names)
  show=self.store.read();by={c['id']:c for c in show['cues']}
  for original in self.before['cues']:
   for field in ('screenActions','computers','staging','montage','sfx'):
    self.assertEqual(by[original['id']].get(field),original.get(field))
  self.assertEqual(by['s01_l4']['text'],next(c['text'] for c in self.before['cues'] if c['id']=='s01_l4'))
  self.assertEqual(len(show['cues']),len(self.before['cues'])+1)
 def test_stale_generation_not_attached(self):
  ln=next(l for s in self.store.scenes() for l in s['lines'] if l['id']=='s01_l4')
  self.store.update_cue('s01_l4',{**ln,'text':'Changed','revision':self.store.revision()},self.names)
  with self.assertRaises(Conflict):self.store.register_audio('s01_l4',ln['text'],ln['speaker'],None,self.root/'absent.wav',1)
 def test_voice_change_invalidates_audio(self):
  self.store.transaction(self.store.revision(),lambda s:next(c for c in s['cues'] if c['id']=='s01_l4').update(voiceProfile='new'))
  ln=next(l for s in self.store.scenes() for l in s['lines'] if l['id']=='s01_l4');self.assertNotIn('audio',ln)
 def test_delete_and_order(self):
  self.store.delete_scene('s00',self.store.revision());self.assertEqual(self.store.read()['scenes'][0]['id'],'s01')
  ids=[s['id'] for s in self.store.read()['scenes']][::-1];self.store.reorder(ids,self.store.revision())
  self.assertEqual(self.store.read()['cues'][0]['scene'],ids[0])
 def test_archive_and_markdown(self):
  self.store.update_cue('s01_l4',{'type':'narration','speaker':'narrator','text':'Changed','direction':'','revision':self.store.revision()},self.names)
  self.assertEqual(json.loads(next((self.root/'script-history').glob('*.json')).read_text()),self.before)
  self.assertIn('<!-- cue:s01_l4 -->',self.store.export_markdown())
if __name__=='__main__':unittest.main()
