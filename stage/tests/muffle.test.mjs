import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Muffle, muffleAmount, droneOn, ringAmount, cutoff} from '../muffle.js';

const param = value => ({value, cancelScheduledValues() {}, setTargetAtTime(v) { this.value = v; }});
class FakeContext {
  state = 'running'; sampleRate = 100; currentTime = 0; nodes = [];
  node(extra = {}) { const n = {connect: next => next, start() {}, ...extra}; this.nodes.push(n); return n; }
  createBiquadFilter() { return this.node({frequency: param(0), Q: param(0)}); }
  createGain() { return this.node({gain: param(0)}); }
  createOscillator() { return this.node({frequency: param(0)}); }
  createBufferSource() { return this.node(); }
  createBuffer(_, length) { const data = new Float32Array(length); return {getChannelData: () => data}; }
  createMediaElementSource(el) { this.source = el; return this.node(); }
  suspend() { this.state = 'suspended'; }
  resume() { this.state = 'running'; }
  get destination() { return {}; }
}

test('Dana dulls from "Your role has been identified" and clears over "Are you still with me?"', () => {
  const show = JSON.parse(fs.readFileSync(new URL('../show.json', import.meta.url)));
  const at = id => show.cues.findIndex(c => c.id === id);
  const start = at('s14_l20'), end = at('s14_l24');
  assert.deepEqual(show.cues[start].muffle, {from: 8, fade: 5, drone: 0, ring: 1});
  for (const c of show.cues.slice(start + 1, end)) assert.equal(c.muffle, true, c.id);
  assert(!show.cues[end].muffle);
  assert.equal(show.cues.filter(c => c.muffle).length, end - start, 'Nothing else in the show is muffled');
});

test('the muffle fades in over the line and sweeps the cutoff down', () => {
  const c = {muffle: {from: 11, fade: 5}};
  assert.equal(muffleAmount(c, 10), 0);
  assert.equal(muffleAmount(c, 13.5), .5);
  assert.equal(muffleAmount(c, 30), 1);
  assert.equal(muffleAmount({muffle: true}), 1);
  assert.equal(muffleAmount({}), 0);
  assert.equal(droneOn({muffle: {from: 11, fade: 5, drone: 8}}, 7.9), false);
  assert.equal(droneOn({muffle: {from: 11, fade: 5, drone: 8}}, 8), true);
  assert.equal(droneOn(c, 10.9), false, 'Without its own start the drone enters with the muffle');
  assert.equal(droneOn({muffle: true}), true);
  assert.equal(ringAmount({muffle: {from: 11, fade: 5, ring: 8}}, 7.9), 0);
  assert.equal(ringAmount({muffle: {from: 11, fade: 5, ring: 8}}, 13), .5);
  assert.equal(ringAmount(c, 13.5), .5, 'Without its own start the ringing follows the muffle');
  assert.equal(ringAmount({muffle: true}), 1);
  assert.equal(cutoff(0), 20000);
  assert(Math.abs(cutoff(1) - 500) < 1e-6);
});

test('the voice is only rerouted once a muffled cue plays, and pausing silences the drone', () => {
  let made = 0, ctx;
  const voice = {}, effect = new Muffle(voice, () => { made++; return ctx = new FakeContext(); });
  effect.sync({speaker: 'hr'}, 0, true, 0);
  effect.sync({speaker: 'hr', muffle: true}, 0, false, 0);
  assert.equal(made, 0);
  const dana = {speaker: 'hr', muffle: {from: 11, fade: 5, drone: 8, ring: 10.2}};
  effect.sync(dana, 5, true, 0);
  assert.equal(made, 1); assert.equal(ctx.source, voice);
  assert.equal(effect.filter.frequency.value, 20000);
  assert.equal(effect.drone.gain.value, 0);
  effect.sync(dana, 10, true, .5);
  assert(effect.drone.gain.value > 0 && effect.filter.frequency.value === 20000, 'The drone creeps in before the muffle');
  assert.equal(effect.ring.gain.value, 0, 'The ringing waits for its own start');
  effect.sync(dana, 10.5, true, .6);
  assert(effect.ring.gain.value > 0 && effect.ring.gain.value <= .08 * .07, 'The ringing fades in, no louder than its level');
  effect.sync(dana, 16, true, 1);
  assert(effect.filter.frequency.value < 2000);
  const narrator = {speaker: 'narrator', muffle: true};
  effect.sync(narrator, 0, true, 1.1);
  assert.equal(effect.filter.frequency.value, 20000, 'The narrator is not on the call');
  effect.sync(narrator, 0, true, 20);
  assert(Math.abs(effect.drone.gain.value - .08 * .8) < 1e-3);
  effect.sync(narrator, 0, false, 21);
  assert.equal(ctx.state, 'suspended');
  const back = {speaker: 'hr'};
  effect.sync(back, 0, true, 22);
  assert.equal(ctx.state, 'running');
  assert(Math.abs(effect.filter.frequency.value - 500) < 1e-6, 'Dana starts her question still muffled');
  assert(Math.abs(effect.ring.gain.value - .08 * .07) < 1e-9);
  effect.sync(back, 0, true, 22.2);
  assert(effect.drone.gain.value < 1e-4, 'The drone cuts dead with her question');
  effect.sync(back, 0, true, 22.75);
  assert(Math.abs(effect.ring.gain.value - .08 * .07 / 2) < 1e-9, 'The ringing is halfway out after .75 s');
  assert(effect.filter.frequency.value > 500 && effect.filter.frequency.value < 20000);
  effect.sync(back, 0, true, 23.5);
  assert.equal(effect.filter.frequency.value, 20000, 'Dana is clear 1.5 s into her question');
  assert.equal(effect.ring.gain.value, 0, 'The ringing is gone 1.5 s into her question');
  effect.sync(back, 0, true, 24);
  assert.equal(effect.release, null);
});

test('without Web Audio the voice plays untouched', () => {
  const effect = new Muffle({}, () => { throw new Error('no audio'); });
  effect.sync({speaker: 'hr', muffle: true}, 0, true, 0);
  assert.equal(effect.ctx, null);
});
