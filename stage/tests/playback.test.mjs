import assert from 'node:assert/strict';
import fs from 'node:fs';
import {castFor,readSettings,playbackShow,cueAudio,playbackRate} from '../playback-settings.js';
const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
const defaults=readSettings(source);
assert.equal(castFor(source).length,13);
assert.equal(defaults.modes.liam,'live');assert.equal(defaults.modes.kristina,'generated');
assert.equal(playbackRate('bad'),1);assert.equal(playbackRate(4),2);assert.equal(playbackRate(.2),.5);
const generated=readSettings(source,{modes:Object.fromEntries(castFor(source).map(c=>[c.id,'generated']))});
const original=JSON.stringify(source);const show=playbackShow(source,generated);
assert.equal(JSON.stringify(source),original,'Never mutate authored cues');
for(let j=0;j<show.performanceStarts.length;j++){
 const start=show.performanceStarts[j],end=show.cues[start].groupEnd;
 assert.equal(end,(show.performanceStarts[j+1]??show.cues.length)-1,'No skipped or duplicated cue');
 if(show.cues.slice(start,end+1).some(c=>c.kind==='voice'))assert.equal(start,end,'Every generated voice gets a playable cue');
}
const live=playbackShow(source,readSettings(source,{modes:Object.fromEntries(castFor(source).map(c=>[c.id,'live']))}));
assert(live.cues.filter(c=>c.speaker&&c.kind!=='stage').every(c=>cueAudio(c,{audioSource:'left',left:{src:'test.mp4'}})===null),'Live silences recordings and filmed audio');
const c=source.cues.find(c=>c.speaker==='liam');
assert.equal(playbackShow(source,generated,{[c.id]:{speaker:'liam',text:c.text+' stale',audio:'bad.mp3'}}).cues.find(q=>q.id===c.id).audio,null);
assert.equal(playbackShow(source,generated,{[c.id]:{speaker:'liam',text:c.text,audio:'good.mp3'}}).cues.find(q=>q.id===c.id).audio,'good.mp3');
console.log('Playback checks passed: 13 cast choices, all cue coverage, live muting, speed limits, stale-audio protection.');

const primary={...source,audioManifestRequired:true,cues:[{...c,audio:'stale-primary.mp3'}],performanceStarts:[0]};
assert.equal(playbackShow(primary,generated,{}).cues[0].audio,null,'Missing proof cannot play old primary audio');
assert.equal(playbackShow(primary,generated,{[c.id]:{speaker:c.speaker,text:'outdated',audio:'bad.mp3'}}).cues[0].audio,null,'Mismatched text blocks primary audio too');
