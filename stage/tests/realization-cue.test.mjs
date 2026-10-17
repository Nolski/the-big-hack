import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {playbackShow,readSettings,playthroughStarts,cueAudio} from '../playback-settings.js';
import {BackgroundMusic} from '../background-music.js';

const root=new URL('../',import.meta.url);
const source=JSON.parse(fs.readFileSync(new URL('show.json',root)));
const manifest=JSON.parse(fs.readFileSync(new URL('generated-voices.json',root))).recordings;
const index=source.cues.findIndex(c=>c.id==='s06_l47'),original=source.cues[index];

test('the realization effect precedes SJ in recorded and live playthroughs',()=>{
  assert.equal(index+1,151);
  assert.equal(original.audioLeadIn,2.8);
  assert.deepEqual(original.sfx,[{id:'sj-realization-decay-v2',level:1}]);
  assert(fs.existsSync(new URL('assets/sfx/sj-realization-decay-v2.mp3',root)));
  const recording=manifest[original.id];
  assert.equal(recording.provenance.leadInSilence,original.audioLeadIn);
  assert(fs.existsSync(new URL(recording.provenance.sourceAudio,root)));
  for(const mode of ['live','generated'])for(const skipStageDirections of [false,true]){
    const settings=readSettings(source,{modes:{liam:mode},skipStageDirections});
    const show=playbackShow(source,settings,manifest),cue=show.cues[index];
    assert(playthroughStarts(show,settings).includes(index));
    assert.equal(cueAudio(cue),mode==='live'?null:recording.audio);
    assert.deepEqual(cue.sfx,original.sfx,'The effect remains available when SJ performs live');
  }
});

test('the quiet piano waits for the effect and the prelude keeps its natural duration',async()=>{
  const audio={paused:true,currentTime:0,play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true},load(){this.currentTime=0}};
  const music=new BackgroundMusic(audio);
  music.enter(original.backgroundMusic);
  assert.equal(original.backgroundMusic.startAfter,original.audioLeadIn);
  music.sync(2.799,true);assert(audio.paused);
  music.sync(2.8,true);await Promise.resolve();assert(!audio.paused);
  assert.equal(audio.currentTime,0,'The existing piano starts from its beginning after the effect');
  const stage=fs.readFileSync(new URL('stage.js',root),'utf8');
  const expression=stage.match(/const effectiveRate=\(\)=>[^;]+;/)[0];
  let current=original;
  const context=vm.createContext({cue:()=>current,state:{rate:2}});
  vm.runInContext(expression,context);
  assert.equal(vm.runInContext('effectiveRate()',context),1);
  current={kind:'voice'};
  assert.equal(vm.runInContext('effectiveRate()',context),2);
});
