import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cueAudio} from '../playback-settings.js';
const show=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
const previousFetch=globalThis.fetch;
globalThis.fetch=async()=>({json:async()=>JSON.parse(fs.readFileSync(new URL('../screen-actions.json',import.meta.url)))});
const {renderVisual}=await import('../visuals.js');
globalThis.fetch=previousFetch;
test('every courtroom speaker uses their filmed performance and its audio',()=>{
 const cues=show.cues.filter(c=>['judge','prosecutor'].includes(c.speaker));
 assert.equal(cues.length,12);
 for(const c of cues){
  assert.equal(c.performanceVideo.text,c.text);
  assert.ok(fs.existsSync(new URL('../'+c.performanceVideo.src,import.meta.url)));
  assert.equal(cueAudio({...c,kind:'voice'}),c.performanceVideo.src);
  assert.ok(renderVisual(c,'right').includes(c.performanceVideo.src));
  assert.ok(!renderVisual(c,'left').includes('actorVideo'));
 }
});
test('removed news tickers cannot reappear on the audience display',()=>{
 assert.ok(show.cues.every(c=>!c.latestTicker));
 assert.ok(!show.cues.some(c=>c.id==='s23_l38'||c.id==='s20b_l24'));
 const cue={...show.cues.find(c=>c.scene==='s23'),latestTicker:'UNWANTED OVERLAY'};
 assert.ok(!renderVisual(cue,'right').includes('UNWANTED OVERLAY'));
});
