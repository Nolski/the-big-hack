import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BackgroundMusic, DEFAULT_MUSIC_VOLUME, musicVolume} from '../background-music.js';
import {readSettings, playbackShow, playthroughStarts} from '../playback-settings.js';

class TestAudio {
  paused=true;currentTime=0;playbackRate=1;plays=0;
  play(){this.paused=false;this.plays++;return Promise.resolve()}
  pause(){this.paused=true}
  load(){this.currentTime=0}
  removeAttribute(name){delete this[name]}
}
const config={id:'score',src:'music.mp3'};
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('GO carries the score; Pause, live lines and Replay preserve the intended transport',async()=>{
  const audio=new TestAudio(),music=new BackgroundMusic(audio);
  music.enter(config);music.sync(0,true);await settle();
  audio.currentTime=11;
  music.enter({...config,startAt:10},true);music.sync(0,true);
  assert.equal(audio.currentTime,11,'GO must not restart the music');
  assert.equal(audio.plays,1,'Score plays continuously over dialogue changes');
  music.pause();assert(audio.paused);
  music.sync(3,false);assert.equal(audio.currentTime,11);
  music.sync(3,true);await settle();
  assert(!audio.paused,'Resume also works with a live performer and no voice audio');
  assert.equal(audio.currentTime,11);
  assert.equal(audio.playbackRate,1,'Score is never accelerated with dialogue');
  music.enter({...config,startAt:10},false);
  assert.equal(audio.currentTime,10,'Replay or selecting a cue restarts its music position');
  music.enter(null);assert(audio.paused);assert.equal(audio.src,undefined);
});

test('date cut follows media time, stays cut on Resume and can be replayed',async()=>{
  const audio=new TestAudio(),music=new BackgroundMusic(audio);
  music.enter({...config,cutAt:1.2});music.sync(0,true);await settle();
  music.sync(.6,false);assert(audio.paused);
  music.sync(.6,true);await settle();assert(!audio.paused);
  assert.equal(music.sync(1.199,true),false);assert(!audio.paused);
  assert.equal(music.sync(1.2,true),true);assert(audio.paused);
  music.sync(5,false);music.sync(5,true);assert(audio.paused,'Pause/Resume cannot restart a cut score');
  music.enter({...config,cutAt:1.2},false);music.sync(0,true);
  await settle();await settle();music.sync(0,true);
  assert(!audio.paused,'Replaying the montage restores its lead-in');
});

test('quiet independent volume persists, including mute',()=>{
  const audio=new TestAudio(),music=new BackgroundMusic(audio);
  assert.equal(DEFAULT_MUSIC_VOLUME,.08);
  assert.equal(musicVolume('bad'),.08);
  assert.equal(musicVolume(10),1);assert.equal(musicVolume(-1),0);
  music.setVolume(.05);assert.equal(audio.volume,.05);
  music.setVolume(0);assert.equal(audio.volume,0);
  const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
  assert.equal(readSettings(source).musicVolume,.08);
  assert.equal(readSettings(source,{musicVolume:0}).musicVolume,0);
  const settings=readSettings(source,{musicVolume:.05,skipStageDirections:true});
  const show=playbackShow(source,settings);
  const montage=show.cues.find(c=>c.id==='s07_time_jump_to_best_practices');
  assert.equal(montage.backgroundMusic.cutAt,2.041016);
  assert(playthroughStarts(show,settings).includes(show.cues.indexOf(montage)));
  for(const id of ['s06_l47','s06_l48','s06_l49','s06_l50','s06_l51',montage.id]) {
    const c=source.cues.find(c=>c.id===id);
    assert.equal(c.backgroundMusic.id,montage.backgroundMusic.id);
    assert(fs.existsSync(new URL('../'+c.backgroundMusic.src,import.meta.url)));
  }
});
