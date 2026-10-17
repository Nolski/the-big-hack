import assert from 'node:assert/strict';
import fs from 'node:fs';
import {playthroughStarts,playthroughIndex,playbackShow,readSettings} from '../playback-settings.js';
const show={cues:[{id:'direction',kind:'stage'}, {id:'narrator',kind:'voice',speaker:'narrator'}, {id:'film',kind:'stage',montage:'film.mp4'}, {id:'actor',kind:'live'}, {id:'override',kind:'stage'}, {id:'knocks',kind:'stage',sfx:[{id:'knocks',level:.85}]}],performanceStarts:[0,1,2,3,4,5]};
assert.equal(readSettings(show).skipStageDirections,false);
assert.equal(readSettings(show,{skipStageDirections:true}).skipStageDirections,true);
assert.deepEqual(playthroughStarts(show,{}),[0,1,2,3,4,5]);
assert.deepEqual(playthroughStarts(show,{skipStageDirections:true}),[1,2,3,5]);
assert.deepEqual(playthroughStarts(show,{skipStageDirections:true},{override:{left:{src:'clip.mp4'}}}),[1,2,3,4,5]);
assert.equal(show.cues.length,6);
const {cueAudio}=await import('../playback-settings.js');
const cop={kind:'voice',speaker:'officer one',audio:'old-tts.mp3',performanceVideo:{physical:true,speaker:'officer one',src:'cop.mp4'}};
assert.equal(cueAudio(cop),'cop.mp4');
assert.equal(cueAudio({...cop,kind:'live'}),null);
assert.equal(cueAudio(cop,{audioSource:'none'}),null);

// A score spanning several cues must not make silent directions reappear.
const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
for(const generated of [false,true]){
 const modes=Object.fromEntries(source.cues.filter(c=>c.speaker).map(c=>[c.speaker,generated?'generated':'live']));
 const settings=readSettings(source,{skipStageDirections:true,modes});
 const play=playbackShow(source,settings);
 const starts=playthroughStarts(play,settings);
 const position=id=>play.cues.findIndex(c=>c.id===id);
 for(const id of ['s01c_l25','s06_l48']){
  assert(!starts.includes(position(id)),`${id}: continuing music must not retain a direction`);
  assert.equal(playthroughIndex(play,settings,position(id)),position(id)+1,
    'Enabling the setting or restoring a saved direction moves to the next spoken cue');
 }
 assert.equal(starts.find(i=>i>position('s01c_l24')),position('s01b_l1'));
 assert(starts.includes(position('s01_l54')),'The standalone YouTube music callback still plays');
 assert(starts.includes(position('s07_time_jump_to_best_practices')),'The scored montage still plays');
 const include={...settings,skipStageDirections:false};
 assert.equal(playthroughIndex(play,include,position('s01c_l25')),position('s01c_l25'));
 assert(playthroughStarts(play,include).includes(position('s01c_l25')),'Turning directions on restores the cue');
}
