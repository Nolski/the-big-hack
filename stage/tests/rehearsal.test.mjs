import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../'+n,import.meta.url)));
const source=read('show.json'),report=read('rehearsal-applied.json');
const by=Object.fromEntries(source.cues.map(c=>[c.id,c]));
const recordings=read('generated-voices.json').recordings;
const fetchBefore=globalThis.fetch;
globalThis.fetch=async()=>({json:async()=>read('screen-actions.json')});
const {actions,sampleAction,renderScreenAction}=await import('../screen-actions.js');
globalThis.fetch=fetchBefore;
assert.equal(new Set(source.cues.map(c=>c.id)).size,source.cues.length,'No duplicate cue IDs');
for(const c of report.changes){assert.equal(by[c.id].text,c.after);if(by[c.id].audio){assert.equal(recordings[c.id]?.text,c.after,'Changed lines need matching recordings');assert.equal(recordings[c.id]?.speaker,c.speaker);assert.equal(recordings[c.id]?.audio,by[c.id].audio);}}
for(const c of report.removed)assert(!by[c.id]);
for(const [id,a] of Object.entries(actions)){
 if(a.duringCue){assert.equal(by[a.duringCue].screenActions[a.side],id);assert.notEqual(by[a.duringCue].kind,'stage');assert.equal(a.steps[0].op,'hold');assert.equal(a.steps[0].seconds,a.startDelay);assert.equal(sampleAction(a,0).text,'');}
 // Exercise each deterministic sequence through its end, including held-backspace operations.
 assert(sampleAction(a,10000).done,id);
}
const local=actions['local-stub'];assert(sampleAction(local,5).text.length<sampleAction(local,12).text.length);
assert(sampleAction(local,12).text.length<sampleAction(local,24).text.length);
assert.equal(sampleAction(actions['policy-drafts'],100).text,'');
assert.equal(sampleAction(actions['delete-patch'],100).text,'');
assert.match(renderScreenAction(by.s11b_l70,'right'),/policyWindow/);
assert.match(renderScreenAction(by.s11b_l70,'right'),/slackWindow/);
assert.match(renderScreenAction(by.s11b_l75,'left'),/miniReddit/);
for(const id of ['s24_l35','s24_l37']){assert(!/rope|creak|trap.?door|snap/i.test(by[id].text));assert.equal(by[id].sfx.length,0);}
console.log('Rehearsal edits: stable IDs, stale audio removed, overlapping lookups, partial code, erased drafts, split desktops and venue constraints verified.');

for(const [action,owner] of Object.entries({'race-condition':'Brendan','john-henry':'Kristina'}))for(const cue of source.cues)for(const [side,id] of Object.entries(cue.screenActions||{}))if(id===action)assert.equal(cue.computers[side],owner,`${cue.id}: lookup must stay on its owner's desktop`);
// The unsent raise draft survives Kristina's interjection instead of typing again.
const raise=actions['raise-request'];
assert.equal(raise.steps.filter(s=>s.op==='type').length,1);
assert.equal(sampleAction(raise,100).submitted,false);
assert.equal(sampleAction(raise,100).sent,'');
assert.equal(sampleAction(raise,100).text,'I’d like to talk about a raise');
const raiseStart=source.cues.findIndex(c=>c.id==='s11b_l8');
const raiseEnd=source.cues.findIndex(c=>c.id==='s11b_l13');
for(const c of source.cues.slice(raiseStart,raiseEnd+1)){
 assert.equal(c.screenActions.left,'raise-request',`${c.id}: don't restart the draft`);
 assert.equal(c.computers.left,'Kristina');
}
const raiseHTML=renderScreenAction(by.s11b_l8,'left');
assert.match(raiseHTML,/slackSidebar/);assert.match(raiseHTML,/Kara/);
assert.equal((raiseHTML.match(/class="typedText"/g)||[]).length,1);
assert.match(raiseHTML,/Draft · not sent/);
