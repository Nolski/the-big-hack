import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cueAudio,readSettings,playbackShow} from '../playback-settings.js';
const root=new URL('../',import.meta.url);
const read=file=>JSON.parse(fs.readFileSync(new URL(file,root)));
const show=read('show.json'),actions=read('screen-actions.json').actions;
const by=Object.fromEntries(show.cues.map(c=>[c.id,c]));
const index=Object.fromEntries(show.cues.map((c,i)=>[c.id,i]));
assert.equal(show.cues[0].id,'s00_montage');
assert.equal(cueAudio(show.cues[0]),'assets/filmed/opening-montage-v8.mp4');
assert.equal(cueAudio(show.cues[0],{audioSource:'none'}),null);
const played=playbackShow(show,readSettings(show),read('generated-voices.json').recordings);
assert.equal(cueAudio(played.cues[0]),cueAudio(show.cues[0]),'Film audio survives spoken-recording manifest checks');
for(const id of ['s10','s13','s13b','s14b'])assert(!show.scenes.some(s=>s.id===id));
for(const c of show.cues){
 for(const [side,id] of Object.entries(c.screenActions||{})){
  assert(actions[id],`Unknown screen action ${id}`);
  if(actions[id].afterCue)assert(index[c.id]>index[actions[id].afterCue],`${id} starts before its spoken trigger`);
 }
}
for(const id of ['s01_l4','s01_l8','s01_l39','s06_l34','s06_l42','s06_l51','s07_l25','s08_l1','s11b_l70','s11c_l33','s12_l70','s14_l81','s14a_l42','s19_l75','s20_l32','s20_l43'])assert.equal(by[id].speaker,'narrator',id);
assert(index.s06_l42<index.s06_l39,'The second Claude beat carries the completed-proof narration');
assert.equal(index.s14a_l24,index.s14a_l25+1);
for(const c of show.cues.slice(index.s01_l10,index.s01_l53+1))assert(c.sharedPR);
const baseline=read('handoff/author-revision-20260912/baseline-show.json');
const withoutIndex=c=>Object.fromEntries(Object.entries(c).filter(([key])=>key!=='groupEnd'));
for(const c of baseline.cues)if(['s20b','s22','s23','s23b','s24'].includes(c.scene))assert.deepEqual(withoutIndex(by[c.id]),withoutIndex(c),`${c.id} outside revision scope`);
for(const c of show.cues)for(const effect of c.sfx||[])assert(fs.existsSync(new URL('assets/sfx/'+effect.id+'.mp3',root)),effect.id);
console.log('Author revision verified: montage playback, scene cuts, narration, lookup order, shared PR, sound assets, and untouched later script.');
