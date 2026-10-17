import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sampleOpeningTabs} from '../opening-tabs.js';
import {BackgroundMusic} from '../background-music.js';
import {playthroughStarts, cueClock} from '../playback-settings.js';

const source = JSON.parse(fs.readFileSync(new URL('../show.json', import.meta.url)));
const actions = JSON.parse(fs.readFileSync(new URL('../screen-actions.json', import.meta.url))).actions;
const cue = id => source.cues.find(c => c.id === id);
const opening = cue('s01_l2'), reply = cue('s01_l3'), ending = cue('s01_l54');
const hunt = actions[opening.screenActions.left], resume = actions[ending.screenActions.left];
class TestAudio {
  paused = true; currentTime = 0; plays = 0;
  play() { this.paused = false; this.plays++; return Promise.resolve(); }
  pause() { this.paused = true; }
  load() { this.currentTime = 0; }
  removeAttribute(name) { delete this[name]; }
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('SJ tries the wrong tabs, finds YouTube and pauses exactly at the music cutoff', () => {
  assert.equal(source.cues.indexOf(opening) + 1, 3);
  assert.equal(sampleOpeningTabs(hunt, hunt.huntAt - .001).tab, 'reddit');
  assert.deepEqual(sampleOpeningTabs(hunt, hunt.huntAt - .001).pointer, [500, 450]);
  assert.equal(sampleOpeningTabs(hunt, 9.4).tab, 'policy');
  assert.equal(sampleOpeningTabs(hunt, 10.4).tab, 'github');
  assert.equal(sampleOpeningTabs(hunt, 11.4).tab, 'youtube');
  assert(hunt.pauseAt - hunt.huntAt >= 3.5 && hunt.pauseAt - hunt.huntAt <= 4,
    'The search needs a slower struggle after she calls SJ.');
  assert(hunt.pauseAt > opening.audioDuration, 'The search deliberately finishes after her question.');
  assert.equal(opening.backgroundMusic.startAt, 17);
  assert.equal(hunt.trackOffset, 17);
  assert.equal(sampleOpeningTabs(hunt, opening.backgroundMusic.cutAt - .001).paused, false);
  const click = sampleOpeningTabs(hunt, opening.backgroundMusic.cutAt);
  assert.equal(click.tab, 'youtube');
  assert.equal(click.paused, true);
  assert.equal(click.click, true);
  assert.equal(hunt.pauseAt, opening.backgroundMusic.cutAt);
  assert(!reply.backgroundMusic, 'The music cannot continue underneath SJ’s excuse.');
  assert.equal(sampleOpeningTabs(actions[reply.screenActions.left], 0).paused, true);
  assert.equal(sampleOpeningTabs(actions[reply.screenActions.left], 0).position, 17 + hunt.pauseAt);
});

test('recorded timing follows the spoken name; live timing keeps the cue clock', () => {
  const media = {currentTime: 8.3, getAttribute: () => 'opening.mp3'};
  assert.equal(cueClock({...opening, kind: 'voice'}, 8.9, media), 8.3,
    'Loading or buffering cannot make him react before the recorded word.');
  assert.equal(cueClock({...opening, kind: 'live'}, 8.9, media), 8.9);
  assert.equal(cueClock({...opening, kind: 'voice'}, 8.9, {...media, getAttribute: () => null}), 8.9);
});

test('the narrator visibly returns to Reddit through the same browser without restarting the feed', () => {
  const narrator = cue('s01_l4'), action = actions[narrator.screenActions.left];
  const paused = sampleOpeningTabs(actions[reply.screenActions.left], 0);
  assert.equal(narrator.screenClock, 'voice');
  assert.equal(sampleOpeningTabs(action, 0).tab, 'youtube');
  assert.deepEqual(sampleOpeningTabs(action, 0).pointer, paused.pointer);
  assert.equal(sampleOpeningTabs(action, .749).tab, 'youtube');
  assert.equal(sampleOpeningTabs(action, .85).tab, 'reddit');
  assert.equal(sampleOpeningTabs(action, .85).click, true);
  assert.equal(sampleOpeningTabs(action, 2).paused, true, 'YouTube remains paused after switching tabs');
  assert(!narrator.backgroundMusic);
  for (const id of ['s01_l1','s01_l5','s01_l6','s01_l7','s01_l9','s01_weekend_reply']) {
    const held = actions[cue(id).screenActions.left];
    assert.equal(held.view, 'browser-tabs', 'The browser frame must not change after the tab switch');
    assert.equal(sampleOpeningTabs(held, 0).tab, 'reddit');
  }
});

test('the search continues after the recording ends and freezes when the cue is paused', () => {
  const recorded = {...opening, kind: 'voice'};
  const media = {currentTime: opening.audioDuration, ended: true, getAttribute: () => 'opening.mp3'};
  const endedAt = 10.6; // The cue started before the recording finished loading.
  const pauseElapsed = endedAt + 1;
  assert.equal(cueClock(recorded, endedAt, media, endedAt), opening.audioDuration);
  const paused = cueClock(recorded, pauseElapsed, media, endedAt);
  assert.equal(paused, opening.audioDuration + 1);
  assert.equal(cueClock(recorded, pauseElapsed, media, endedAt), paused, 'Cue elapsed freezes during Pause.');
  assert.equal(cueClock(recorded, pauseElapsed + .5, media, endedAt), paused + .5, 'Resume continues the visual tail.');
  const finish = cueClock(recorded, endedAt + hunt.pauseAt - opening.audioDuration, media, endedAt);
  assert.equal(sampleOpeningTabs(hunt, finish).paused, true, 'The Pause click can occur after the final word.');
  assert.equal(cueClock(recorded, 0, {...media, currentTime: 0, ended: false}), 0, 'Replay starts the animation over.');
});

test('SJ’s music is foreground audio; the ordinary score stays quiet and independently adjustable', () => {
  const audio = new TestAudio(), music = new BackgroundMusic(audio);
  music.setVolume(.08, .85);
  music.enter(opening.backgroundMusic);
  assert.equal(audio.volume, .85 * .55);
  music.setVolume(0);
  assert.equal(audio.volume, .85 * .55, 'The background-score slider cannot silence his computer.');
  music.setVolume(0, .5);
  assert.equal(audio.volume, .5 * .55, 'Voices and clips control the computer music.');
  music.enter(ending.backgroundMusic);
  assert.equal(audio.volume, .5 * .55, 'The callback returns at the same foreground level.');
  music.setVolume(.08, .85);
  music.enter(cue('s06_l47').backgroundMusic);
  assert.equal(audio.volume, .08, 'The piano keeps its existing background level.');
  music.setVolume(0);
  assert.equal(audio.volume, 0);
});

test('the closing Play click resumes the track; its cue survives skipped stage directions', () => {
  assert.equal(source.cues.indexOf(ending) + 1, 47);
  assert.equal(ending.staging.callStatus, 'ended');
  assert.deepEqual(ending.staging.callCast, []);
  assert.equal(sampleOpeningTabs(resume, resume.playAt - .001).paused, true);
  assert.equal(sampleOpeningTabs(resume, resume.playAt).paused, false);
  assert.equal(resume.playAt, ending.backgroundMusic.startAfter);
  assert.equal(ending.backgroundMusic.src, opening.backgroundMusic.src);
  assert.equal(ending.backgroundMusic.startAt, 17 + hunt.pauseAt);
  assert.equal(resume.trackOffset, ending.backgroundMusic.startAt);
  assert.equal(sampleOpeningTabs(resume, 3).tab, 'reddit');
  assert(playthroughStarts(source, {skipStageDirections: true}).includes(source.cues.indexOf(ending)));
  assert(!cue('s01c_l1').backgroundMusic, 'The next huddle ends the source music.');
  assert(fs.existsSync(new URL('../' + opening.backgroundMusic.src, import.meta.url)));
});

test('music returns at its actual paused position, waits for Play, and replays consistently', async () => {
  const audio = new TestAudio(), music = new BackgroundMusic(audio);
  music.enter(opening.backgroundMusic);
  assert.equal(audio.currentTime, 17, 'Begin the song at the requested timestamp.');
  music.sync(0, true); await settle();
  audio.currentTime = 8.17;
  assert.equal(music.sync(hunt.pauseAt, true), true);
  assert(audio.paused);
  music.sync(20, true); assert(audio.paused, 'A held or resumed cue cannot undo the pause click.');
  music.enter(null); assert(audio.paused);
  music.enter(ending.backgroundMusic);
  assert.equal(audio.currentTime, 8.17, 'Restore the actual music clock, including at rehearsal speeds.');
  music.sync(0, true); await settle(); assert(audio.paused);
  music.sync(resume.playAt - .001, true); assert(audio.paused);
  music.sync(resume.playAt, true); await settle(); assert(!audio.paused);
  audio.currentTime = 14;
  music.enter(ending.backgroundMusic, false);
  assert.equal(audio.currentTime, 8.17, 'Replay returns to the standup pause point.');
  music.sync(0, true); assert(audio.paused);
  music.enter(null); assert(audio.paused); assert.equal(audio.src, undefined);
  const direct = new BackgroundMusic(new TestAudio());
  direct.enter(ending.backgroundMusic);
  assert.equal(direct.audio.currentTime, ending.backgroundMusic.startAt,
    'Selecting the closing cue directly has a sensible preview position.');
});
