import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const previousFetch=globalThis.fetch;
globalThis.fetch=async()=>({json:async()=>JSON.parse(fs.readFileSync(new URL('../screen-actions.json',import.meta.url)))});
const {renderVisual,backgroundFor}=await import('../visuals.js');
const {projectionCue}=await import('../projection-cue.js');
globalThis.fetch=previousFetch;
const show=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
test('police speak at the doorway, never as laptop-call participants',()=>{
 for(const c of show.cues.filter(c=>c.scene==='s22'&&c.speaker.startsWith('officer'))){
  const html=renderVisual(c,'right');
  if(c.pendingPerformanceVideo){
   assert.equal(html,'');
   assert.equal(c.audio,null);
   assert.equal(c.returnToSet,true);
   continue;
  }
  assert.match(html,/data-place="apartment doorway"/);
  assert.match(html,/actorVideo/);
  assert.doesNotMatch(html,/laptopScene|ownerDesktop|speakerphoto/);
  assert.equal(c.performanceVideo.speaker,c.speaker);
  assert(fs.existsSync(new URL('../'+c.performanceVideo.src,import.meta.url)));
 }
});
test('an offscreen speaker cannot replace Marcus in his laptop call',()=>{
 const c=structuredClone(show.cues.find(c=>c.id==='s22_l12'));
 delete c.performanceVideo;delete c.policeStill;delete c.returnToSet;
 const html=renderVisual(c,'right');
 assert.match(html,/MARCUS \/ LAPTOP CALL/);
 assert.doesNotMatch(html,/officer-one.png|Officer One<\/span>/);
});

test('police clips use one screen and return to the apartment, including after pausing',()=>{
 for(const c of show.cues.filter(c=>c.returnToSet)){
  const duration=c.montageDuration||c.audioDuration;
  const playing={cue:c,elapsed:0,audioTime:0,audioDuration:duration,running:true};
  const left=projectionCue(playing,'left');
  assert.equal(renderVisual(left,'left'),'');
  assert.match(backgroundFor(left,'left'),/liam-ready/);
  assert.equal(projectionCue({...playing,running:false},'right'),c);
  const done=projectionCue({...playing,elapsed:duration,audioTime:duration},'right');
  assert.equal(renderVisual(done,'right'),'');
  assert.match(backgroundFor(done,'right'),/liam-ready/);
 }
});
test('ordinary montages retain their full-screen ending',()=>{
 const c=show.cues.find(c=>c.montage&&!c.returnToSet);
 assert.equal(projectionCue({cue:c,elapsed:9999},'right'),c);
});

test('the arrest scene never projects an officer tablet',()=>{
 for(const c of show.cues.filter(c=>c.scene==='s22')){
  assert.doesNotMatch(JSON.stringify(c.computers),/tablet/i);
  for(const side of ['left','right'])assert.doesNotMatch(renderVisual(c,side),/officerTablet|ARREST RECORD/);
 }
});
