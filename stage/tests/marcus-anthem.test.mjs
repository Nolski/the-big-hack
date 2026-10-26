import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BackgroundMusic} from '../background-music.js';
import {readSettings, playbackShow, playthroughStarts} from '../playback-settings.js';

class TestAudio {
  paused=true;currentTime=0;playbackRate=1;plays=0;
  play(){this.paused=false;this.plays++;return Promise.resolve()}
  pause(){this.paused=true}
  load(){this.currentTime=0}
  removeAttribute(name){delete this[name]}
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const anthem=c=>c?.backgroundMusic?.id?.startsWith('marcus-anthem')?c.backgroundMusic:null;

test('Marcus’s anthem restarts at each speech and cuts dead when he is talked over',async()=>{
  const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
  const scored=source.cues.filter(anthem);
  const ids=[...new Set(scored.map(c=>c.backgroundMusic.id))];
  assert.equal(ids.length,10,'One score id per speech');
  for(const c of scored){
    const bm=c.backgroundMusic;
    assert.equal(bm.src,'assets/music/marcus-anthem.mp3');
    assert.equal(bm.startAt,0);assert.equal(bm.loop,false);assert.equal(bm.level,1.4);
  }
  assert(fs.existsSync(new URL('../assets/music/marcus-anthem.mp3',import.meta.url)));
  for(const skipStageDirections of [false,true]){
    const settings=readSettings(source,{skipStageDirections});
    const show=playbackShow(source,settings);
    const audio=new TestAudio(),music=new BackgroundMusic(audio);
    let previous=null,starts=0,cuts=0;
    for(const index of playthroughStarts(show,settings)){
      const cue=show.cues[index],bm=anthem(cue),position=audio.currentTime;
      music.enter(cue.backgroundMusic,true);music.sync(0,true);await settle();
      if(bm&&bm.id===previous){
        assert.equal(audio.currentTime,position,cue.id+' carries the anthem');
        assert(!audio.paused,cue.id+' keeps the anthem playing');
      }else if(bm){
        starts++;
        assert.equal(cue.speaker,'marcus',cue.id+': the anthem starts when Marcus does');
        assert.equal(audio.src,bm.src);assert.equal(audio.currentTime,0,cue.id+' starts from the soft opening');
        assert(!audio.paused);
      }else if(previous){
        cuts++;
        assert.notEqual(cue.speaker,'marcus',cue.id+': someone else cuts him off');
        assert.equal(audio.src,cue.backgroundMusic?.src,cue.id+' cuts the anthem dead');
        if(!cue.backgroundMusic)assert(audio.paused);
      }
      if(bm)audio.currentTime+=5;
      previous=bm?.id??null;
    }
    assert.equal(starts,10);assert.equal(cuts,10);
  }
});
