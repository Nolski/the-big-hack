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

test('a scene transition fades from the carried music position, including Pause and Resume',async()=>{
  const audio=new TestAudio(),music=new BackgroundMusic(audio);
  music.setVolume(.08);
  music.enter({...config,loop:false});music.sync(0,true);await settle();
  audio.currentTime=16;
  music.enter({...config,loop:false,startAt:15.96,fadeOut:1.2},true);
  assert.equal(audio.currentTime,16,'The narrator cue must not restart the score');
  assert.equal(audio.volume,.08);
  audio.currentTime=16.6;music.sync(.6,true);
  assert(Math.abs(audio.volume-.04)<1e-9,'Fade begins when the next scene starts');
  music.sync(.6,false);assert(audio.paused);
  music.setVolume(.1);
  assert(Math.abs(audio.volume-.05)<1e-9,'Volume adjustment preserves the fade progress');
  music.sync(.6,true);await settle();assert(!audio.paused);
  audio.currentTime=17.3;
  assert.equal(music.sync(1.3,true),true);
  assert.equal(audio.volume,0);assert(audio.paused);
  music.sync(2,true);assert(audio.paused,'A completed fade stays silent');
  music.enter({...config,loop:false},false);music.sync(0,true);await settle();
  assert.equal(audio.currentTime,0);assert.equal(audio.volume,.1);
  assert(!audio.paused,'Replay restores the original music level');
});

test('a finite excerpt cannot restart after it reaches its end',async()=>{
  const audio=new TestAudio(),music=new BackgroundMusic(audio);
  music.enter({...config,loop:false});music.sync(0,true);await settle();
  assert.equal(audio.loop,false);
  const plays=audio.plays;
  audio.currentTime=20;audio.ended=true;audio.paused=true;
  music.sync(20,true);music.sync(21,true);await settle();
  assert.equal(audio.plays,plays,'Holding a cue cannot replay the first 20 seconds');
  assert(audio.paused);
  music.enter(config,false);
  assert.equal(audio.loop,true,'Existing looping tracks retain their authored behavior');
});

test('the PR review score starts on Brendan’s reply and fades at the next narrator line',()=>{
  const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
  const start=source.cues.findIndex(c=>c.id==='s01c_l22');
  const end=source.cues.findIndex(c=>c.id==='s01b_l1');
  assert.equal(source.cues[start].text,'…Yeah. Okay, SJ. I hear you.');
  assert.equal(source.cues[end].text,'A couple hours later, Kristina calls Brendan');
  for(let i=start;i<=end;i++){
    const m=source.cues[i].backgroundMusic;
    assert.equal(m.id,'pr-review-dry-loop');assert.equal(m.loop,false);
    assert(fs.existsSync(new URL('../'+m.src,import.meta.url)));
    assert.equal(m.fadeOut,i===end?1.2:undefined);
  }
  assert(!source.cues[start-1].backgroundMusic);
  assert(!source.cues[end+1].backgroundMusic);
});

test('skipping the final stage direction preserves the running score and its narrator fade',async()=>{
  const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
  const settings=readSettings(source,{skipStageDirections:true});
  const previous=source.cues.findIndex(c=>c.id==='s01c_l24');
  const next=playthroughStarts(source,settings).find(i=>i>previous);
  assert.equal(source.cues[next].id,'s01b_l1');
  const audio=new TestAudio(),music=new BackgroundMusic(audio);
  music.enter(source.cues[previous].backgroundMusic);music.sync(0,true);await settle();
  audio.currentTime=14;
  const plays=audio.plays;
  music.enter(source.cues[next].backgroundMusic,true);music.sync(0,true);
  assert.equal(audio.currentTime,14,'Keep the actual music position when skipping the direction');
  assert.equal(audio.plays,plays,'No reload or restart at the scene change');
  audio.currentTime=15.3;music.sync(1.3,true);
  assert(audio.paused);assert.equal(audio.volume,0,'The next narration still triggers the fade');
});
