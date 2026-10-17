import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {castFor, playbackShow, playthroughStarts, readSettings} from '../playback-settings.js';

const root = new URL('../', import.meta.url);
const source = JSON.parse(fs.readFileSync(new URL('show.json', root)));
const actions = JSON.parse(fs.readFileSync(new URL('screen-actions.json', root))).actions;
const manifest = JSON.parse(fs.readFileSync(new URL('generated-voices.json', root))).recordings;
const stage = fs.readFileSync(new URL('stage.js', root), 'utf8');
const originalFetch = globalThis.fetch;
globalThis.fetch = async path => ({json: async () => {
  const url = new URL(path, root); url.search = '';
  return JSON.parse(fs.readFileSync(url));
}});
const {renderVisual, backgroundFor} = await import('../visuals.js');
const {sampleAction} = await import('../screen-actions.js');
globalThis.fetch = originalFetch;
const cue = id => source.cues.find(c => c.id === id);

test('every cue renders both screens with valid action and cue references', () => {
  const ids = new Set(source.cues.map(c => c.id));
  for (const c of source.cues) {
    for (const action of Object.values(c.screenActions || {}))
      assert(actions[action], `${c.id}: unknown screen action ${action}`);
    for (const id of Object.values(c.actionSource || {}))
      assert(ids.has(id), `${c.id}: deleted action source ${id}`);
    for (const side of ['left', 'right']) {
      const html = renderVisual(c, side);
      assert.equal(typeof html, 'string', `${c.id}: ${side} screen did not render`);
      const paths = [...html.matchAll(/\bsrc="(assets\/[^"#]+)"/g)].map(m => m[1]);
      const background = backgroundFor(c, side);
      if (background) paths.push(background);
      if (c.montage) paths.push(c.montage);
      for (const path of paths) assert(fs.existsSync(new URL(path, root)), `${c.id}: missing ${path}`);
    }
  }
});

test('inserted narration and acting beats preserve their room or desktop', () => {
  for (const id of [
    'cue_cb6e202cb2534dde8fd58ab221162dcb',
    'cue_741e3ee8be824061a716652145e08184',
    'cue_7f204429ee504d52bb41b9288a6cc14a',
    'cue_70d08ed22ac848d6946efa0c1872c424',
  ]) {
    const c = cue(id);
    assert(c.staging, `${id}: inserted block lost its stage context`);
    assert.notEqual(c.state, 'black', `${id}: unintended blackout`);
    for (const side of ['left', 'right'])
      assert(renderVisual(c, side) || backgroundFor(c, side), `${id}: empty ${side} projection`);
  }
  // These cues explicitly call for a black screen; preserving context must not
  // turn a deliberate blackout or an off-camera interview into room footage.
  for (const id of ['s24_l31', 's23b_sj_accusation', 's23b_brendan_denial']) {
    assert.equal(cue(id).state, 'black');
    for (const side of ['left', 'right']) {
      assert.equal(renderVisual(cue(id), side), '');
      assert.equal(backgroundFor(cue(id), side), null);
    }
  }
});

test('Claude starts when narrated, alongside the already-running RNG lookup', () => {
  const lookup = cue('s06_l32');
  const launch = cue('cue_cb6e202cb2534dde8fd58ab221162dcb');
  const next = cue('s06_l33');
  assert.match(lookup.text, /RNG/);
  for (const c of [lookup, launch, next]) assert.equal(c.screenActions.right, 'rng-entropy');
  assert.equal(launch.claudeSession, 'signup-investigation');
  assert.equal(next.claudeSession, launch.claudeSession);
  assert.match(renderVisual(launch, 'right'), /investigationSplit/);
  assert.match(renderVisual(launch, 'right'), /data-screen-action="signup-background"/);
  assert.match(renderVisual(launch, 'right'), /data-screen-action="rng-entropy"/);
  assert.equal(sampleAction(actions['rng-entropy'], 10).sent, actions['rng-entropy'].question);
  assert(!source.cues.filter(c => c.scene === 's06').some(c => c.screenActions?.right === 'mutex-deadlock'),
    'The old mutex lookup no longer has a matching spoken line');
});

test('the borrowed Mac shows SJ’s wallpaper during the arrival narration', () => {
  const arrival = cue('s20_l1');
  assert.match(arrival.text, /wakes on SJ's wallpaper/);
  assert.equal(arrival.computers.left, 'SJ');
  assert.match(renderVisual(arrival, 'left'), /assets\/reddit\/code-quality\.jpg/);
  assert.match(backgroundFor(arrival, 'right'), /brendan-night/);
});

test('the hallway film returns to the apartment and audible knocks even with directions skipped', () => {
  const hallway = source.cues.findIndex(c => c.id === 's22_hallway_cops');
  const knocks = source.cues[hallway + 1];
  assert.equal(knocks.id, 's22_l11');
  assert.deepEqual(knocks.sfx, [{id: 'knocks', level: .85}]);
  assert.equal(knocks.staging.officersPresent, false);
  for (const side of ['left', 'right']) {
    assert.match(backgroundFor(knocks, side), /liam-ready/);
    assert.doesNotMatch(renderVisual(knocks, side), /actorVideo/);
  }
  const starts = playthroughStarts(source, {skipStageDirections: true});
  assert.equal(starts.find(i => i > hallway), hallway + 1);
  assert.equal(source.cues[starts.find(i => i > hallway + 1)].id, 's22_l12');
  assert(fs.existsSync(new URL('assets/sfx/knocks.mp3', root)));
});

for (const skipStageDirections of [false, true]) {
  test(`RNG and Claude clocks continue without cue-number shifts; skip directions=${skipStageDirections}`, () => {
    const settings = readSettings(source, {skipStageDirections,
      modes: Object.fromEntries(castFor(source).map(c => [c.id, 'generated']))});
    const show = playbackShow(source, settings, manifest);
    assert.deepEqual(show.cues.map(c => c.id), source.cues.map(c => c.id));
    const at = id => show.cues.findIndex(c => c.id === id);
    const state = {index: at('s06_l32'), workerBase: 0, screenBase: {left: 0, right: 0},
      elapsed: 9, running: true, serial: 1};
    const context = vm.createContext({show, state, Date, Math, Object,
      cue: () => show.cues[state.index],
      nextIndex: () => playthroughStarts(show, settings).find(i => i > state.index) ?? show.cues.length,
      payload: () => ({counterValue: 0, workerElapsed: state.workerBase + state.elapsed,
        screenElapsed: {left: state.screenBase.left + state.elapsed, right: state.screenBase.right + state.elapsed}}),
      counterProfile: () => ({base: 0}), render: () => {}, $: () => ({scrollTop: 0}),
      startAudio: () => {}, broadcast: () => {}, music: {enter: () => {}}});
    vm.runInContext(stage.slice(stage.indexOf('function navigate('), stage.indexOf('function toggle(')), context);
    vm.runInContext(`navigate(${at('cue_cb6e202cb2534dde8fd58ab221162dcb')})`, context);
    assert.equal(state.screenBase.right, 9, 'Narration must not restart the RNG query');
    assert.equal(state.workerBase, 0, 'Claude begins at the narrated launch');
    state.elapsed = 6;
    vm.runInContext(`navigate(${at('s06_l33')})`, context);
    assert.equal(state.screenBase.right, 15, 'The next speech holds the existing RNG query');
    assert.equal(state.workerBase, 6, 'Claude keeps working through the next speech');
    const actor = at('s06_l47');
    state.index = actor - 2;
    const next = playthroughStarts(show, settings).find(i => i > state.index);
    assert.equal(next, skipStageDirections ? actor : actor - 1,
      'Skipping an acting beat changes navigation, not the speech’s authored position');
  });
}
