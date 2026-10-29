import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readSettings,playbackShow,playthroughStarts,autoAdvances} from '../playback-settings.js';
import {venuePlan} from '../venue-plan.js';
import {lightingAt} from '../lighting.js';
const show=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
const manifest=JSON.parse(fs.readFileSync(new URL('../generated-voices.json',import.meta.url))).recordings;
test('loom performance holds for GO even when directions are skipped',()=>{
 const settings=readSettings(show,{skipStageDirections:true,autoAdvance:true});
 const playback=playbackShow(show,settings,manifest),ids=playthroughStarts(playback,settings).map(i=>playback.cues[i].id);
 for(const id of ['s25_smash_ready','s25_smash_one','s25_smash_two','s25_fire','s25_newspaper']){
  assert(ids.includes(id));const c=playback.cues.find(c=>c.id===id);assert.equal(autoAdvances(c,settings),false);
 }
 const hold=show.cues.find(c=>c.id==='s25_smash_ready');assert.deepEqual(hold.sfx,[]);
});
test('blackout clears both physical outputs; newspaper appears only above',()=>{
 const i=show.cues.findIndex(c=>c.id==='s25_smash_two'),p=venuePlan(show.cues[i]);
 assert.equal(p.look,'dark');assert.equal(p.upper.type,'blank');assert.equal(p.wall.left.type,'blank');assert.equal(p.wall.right.type,'blank');assert.deepEqual(lightingAt(show,i),[]);
 const news=venuePlan(show.cues.find(c=>c.id==='s25_newspaper'));assert.equal(news.upper.type,'source');assert.equal(news.look,'dark');assert.equal(news.wall.left.type,'blank');
});
test('new ending dialogue has matching recordings and smash assets exist',()=>{
 for(const id of ['s25_l17','s25_l18','s25_l19','s25_lamp']){const c=show.cues.find(c=>c.id===id);assert.equal(manifest[id].text,c.text);assert.equal(manifest[id].speaker,c.speaker);assert(fs.existsSync(new URL('../'+manifest[id].audio,import.meta.url)));}
 for(const id of ['loom-smash-one','loom-smash-two','loom-fire'])assert(fs.existsSync(new URL('../assets/sfx/'+id+'.mp3',import.meta.url)));
});

test('lamp shout follows final crash, then fire and the speech anthem',()=>{
 const start=show.cues.findIndex(c=>c.id==='s25_smash_two');
 assert.deepEqual(show.cues.slice(start,start+4).map(c=>c.id),['s25_smash_two','s25_lamp','s25_fire','s25_newspaper']);
 const newspaper=show.cues[start+3],speech=show.cues.find(c=>c.backgroundMusic?.id==='marcus-anthem-s01-a');
 assert.equal(newspaper.backgroundMusic.src,speech.backgroundMusic.src);
 assert.deepEqual(lightingAt(show,start+1),[]);
});

test('ending score starts at zero on Marcus and carries through the fire and paper',()=>{
 const start=show.cues.findIndex(c=>c.id==='s25_l19'),end=show.cues.findIndex(c=>c.id==='s25_newspaper');
 const config=show.cues[start].backgroundMusic;assert.equal(config.startAt,0);
 for(const c of show.cues.slice(start,end+1)){assert.equal(c.backgroundMusic.id,config.id);assert.equal(c.backgroundMusic.src,config.src);}
 const fire=show.cues.find(c=>c.id==='s25_fire');assert.equal(fire.venueGraphic,'fire');assert.equal(venuePlan(fire).upper.type,'source');assert.equal(venuePlan(fire).look,'dark');
});
