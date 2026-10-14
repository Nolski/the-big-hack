import assert from 'node:assert/strict';
import fs from 'node:fs';
import {nextCueType} from '../next-cue.js';
import {readSettings,playbackShow} from '../playback-settings.js';
const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
const show=playbackShow(source,readSettings(source));
const type=(a,b)=>nextCueType(a,b)?.label;

// Synthetic: each rule, and that earlier rules win.
const sj={scene:'a',kind:'live',speaker:'liam'}, marcus={scene:'a',kind:'live',speaker:'marcus'};
assert.equal(nextCueType(sj,undefined),null,'End of show has no type');
assert.equal(type(sj,marcus),'Next line');
assert.equal(type(sj,{...sj}),'CONTINUED LINE');
assert.equal(nextCueType(sj,{...sj}).alert,true);
assert.equal(type(sj,{...marcus,interrupts:true}),'INTERRUPTION');
assert.equal(nextCueType(sj,{...marcus,interrupts:true}).alert,true);
assert.equal(type(sj,{...sj,interrupts:true}),'INTERRUPTION','Interruption beats continued line');
assert.equal(type(sj,{...marcus,scene:'b'}),'New scene');
assert.equal(type(sj,{scene:'b',kind:'stage',speaker:'',montage:'m.mp4'}),'New scene','New scene beats video');
assert.equal(type(sj,{scene:'a',kind:'stage',speaker:'',montage:'m.mp4'}),'Video');
assert.equal(type(sj,{scene:'a',kind:'voice',speaker:'officer-one',performanceVideo:{src:'x'}}),'Video');
assert.equal(type(sj,{scene:'a',kind:'voice',speaker:'narrator'}),'Narration');
assert.equal(type({scene:'a',kind:'voice',speaker:'narrator'},{scene:'a',kind:'voice',speaker:'narrator'}),'Narration','Narrator twice is still narration');
assert.equal(type(sj,{scene:'a',kind:'stage',speaker:''}),'Stage direction');
assert.equal(type(sj,{scene:'a',kind:'voice',speaker:'kristina'}),'Recorded voice');
assert.equal(type({...sj,kind:'voice'},{...sj,kind:'voice'}),'CONTINUED LINE');
assert.equal(nextCueType(sj,marcus).alert,false);

// The show itself.
const at=id=>{const i=show.cues.findIndex(c=>c.id===id);assert(i>0,'Missing cue '+id);return type(show.cues[i-1],show.cues[i])};
assert.equal(at('s01c_l13'),'INTERRUPTION','SJ cuts in on Brendan');
assert.equal(at('s11b_l30'),'INTERRUPTION','Marcus talks over Kristina');
const pair=show.cues.findIndex((c,i)=>i>0&&c.kind==='live'&&!c.interrupts&&c.speaker===show.cues[i-1].speaker&&c.scene===show.cues[i-1].scene);
assert(pair>0,'The show has a live speaker with two cues in a row');
assert.equal(type(show.cues[pair-1],show.cues[pair]),'CONTINUED LINE');
const montage=show.cues.find(c=>c.id==='s00_montage');
assert.equal(type({scene:montage.scene,kind:'live',speaker:'liam'},montage),'Video');
const narr=show.cues.findIndex((c,i)=>i>0&&c.speaker==='narrator'&&!c.interrupts&&c.scene===show.cues[i-1].scene);
assert.equal(type(show.cues[narr-1],show.cues[narr]),'Narration');
const boundary=show.cues.findIndex((c,i)=>i>0&&c.scene!==show.cues[i-1].scene);
assert.equal(type(show.cues[boundary-1],show.cues[boundary]),'New scene');
console.log('Next-cue checks passed: rule order, alerts, and the show\'s interruptions, continued lines, video, narration and scene changes.');
