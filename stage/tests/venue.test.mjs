import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {OUTPUTS,WALL_ZONES,SCENE_STAGING,venuePlan,routedCue,venueCue} from '../venue-plan.js';
import {playbackShow,playthroughStarts,readSettings,castFor,cueAudio} from '../playback-settings.js';
const root=new URL('../',import.meta.url);
const show=JSON.parse(fs.readFileSync(new URL('show.json',root)));
const manifest=JSON.parse(fs.readFileSync(new URL('generated-voices.json',root))).recordings;
const oldFetch=globalThis.fetch;
globalThis.fetch=async()=>({json:async()=>JSON.parse(fs.readFileSync(new URL('screen-actions.json',root)))});
const {renderVisual,backgroundFor}=await import('../visuals.js');
globalThis.fetch=oldFetch;
const cue=id=>show.cues.find(c=>c.id===id);

test('native output sizes cannot enlarge the embedded preview document',()=>{
  const css=fs.readFileSync(new URL('venue.css',root),'utf8');
  // The body identifies its output with upper/wall too. A bare class selector
  // makes that body 1920/4608px wide and centres content outside its iframe.
  const rules=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  for(const [,selector,declarations] of rules){
    if(!/(?:^|;)\s*(?:width|height)\s*:/.test(declarations))continue;
    for(const part of selector.split(','))assert(!['.upper','.wall'].includes(part.trim()),selector);
  }
  for(const surface of ['upper','wall']){
    const rule=rules.find(([,selector])=>selector.trim()==='.surface.'+surface);
    assert(rule,'The native canvas size must be scoped to its surface');
    assert.match(rule[2],new RegExp('width:\\s*'+OUTPUTS[surface].width+'px'));
    assert.match(rule[2],new RegExp('height:\\s*'+OUTPUTS[surface].height+'px'));
  }
});

test('physical outputs and protected centre exactly match the venue',()=>{
  assert.deepEqual([OUTPUTS.upper.width,OUTPUTS.upper.height],[1920,1080]);
  assert.deepEqual([OUTPUTS.wall.width,OUTPUTS.wall.height],[4608,896]);
  assert.deepEqual(WALL_ZONES.map(z=>[z.x,z.width]),[[0,2048],[2048,512],[2560,2048]]);
  // Each complete 16:9 canvas fits inside its LED wing, with no seam cropping.
  const width=1920*896/1080;
  for(const z of WALL_ZONES.filter(z=>z.id!=='centre')){
    assert(width<z.width);
    assert((z.width-width)/2>200);
  }
});

test('every scene has deliberate staging and every cue renders without changing its script',()=>{
  for(const scene of show.scenes)assert(SCENE_STAGING[scene.id],scene.id);
  for(const c of show.cues){
    const original=JSON.stringify(c),p=venuePlan(c);
    assert.equal(p.centre,'scenery');
    for(const slot of [p.upper,p.wall.left,p.wall.right]){
      const routed=routedCue(c,slot);
      assert.equal(routed.id,c.id);
      assert.equal(routed.text,c.text);
      assert.equal(routed.audio,c.audio);
      const html=renderVisual(routed,slot.side||'left');
      assert.equal(typeof html,'string');
      const paths=[...html.matchAll(/\bsrc="(assets\/[^"#]+)"/g)].map(m=>m[1]);
      const bg=backgroundFor(routed,slot.side||'left');if(bg)paths.push(bg);
      for(const path of paths)assert(fs.existsSync(new URL(path,root)),c.id+': '+path);
      if(slot.type==='blank')assert.equal(html,'',c.id);
    }
    assert.equal(JSON.stringify(c),original);
  }
});

test('films and court/police performances appear once, above the physical set',()=>{
  for(const c of show.cues.filter(c=>c.montage||c.performanceVideo?.physical)){
    const p=venuePlan(c);
    assert(['film','performance'].includes(p.upper.type),c.id);
    assert.equal(p.upper.side,'right');
    assert(c.scene==='s23'||p.wall.left.type==='blank',c.id);
    assert.equal(p.wall.right.type,'blank',c.id);
    for(const slot of Object.values(p.wall))assert.doesNotMatch(renderVisual(routedCue(c,slot),slot.side||'left'),/actorVideo/);
    assert.equal(routedCue(c,p.upper),c);
    assert.equal(cueAudio(routedCue(c,p.upper)),cueAudio(c));
  }
});

test('police return to the apartment at the film end, including paused holds',()=>{
  for(const c of show.cues.filter(c=>c.returnToSet)){
    const duration=c.montageDuration||c.audioDuration;
    assert.equal(venuePlan(venueCue(c,{elapsed:0,audioTime:0})).upper.type,c.montage?'film':'performance');
    for(const running of [true,false]){
      const room=venueCue(c,{elapsed:duration,audioTime:duration,running});
      assert.equal(venuePlan(room).upper.type,'blank',c.id);
      assert.equal(room.staging.set,c.staging.set);
    }
  }
});

test('scene-specific reveals and parallel work keep their authored tracks',()=>{
  const standup=venuePlan(cue('s01_l19'));
  assert.equal(standup.upper.type,'shared-pr');
  assert.equal(standup.wall.left.side,'left');
  assert.equal(standup.wall.right.type,'call');
  const demo=venuePlan(cue('s01b_l35'));
  assert.equal(demo.upper.side,'left');
  assert.equal(demo.wall.left.type,'desktop');
  const investigation=cue('cue_cb6e202cb2534dde8fd58ab221162dcb');
  assert.equal(venuePlan(investigation).upper.side,'right');
  assert.match(renderVisual(routedCue(investigation,venuePlan(investigation).upper),'right'),/investigationSplit/);
  for(const id of ['s14_l1','s14_l30','s14_l55']){
    const c=cue(id),p=venuePlan(c);
    assert.equal(p.wall.left.side,'left');
    assert.doesNotMatch(renderVisual(routedCue(c,p.wall.left),'left'),/cutline|Q3 Organisational Review/);
  }
  for(const id of ['s23b_sj_accusation','s23b_brendan_denial'])assert.equal(venuePlan(cue(id)).look,'dark');
  assert.equal(venuePlan(cue('s23b_l32')).look,'stars');
  assert.equal(venuePlan(cue('s25_title_card')).upper.type,'film');
});

test('live/generated casting and skipping directions do not change output routing or action clocks',()=>{
  for(const skipStageDirections of [false,true])for(const mode of ['live','generated']){
    const settings=readSettings(show,{skipStageDirections,modes:Object.fromEntries(castFor(show).map(c=>[c.id,mode]))});
    const playback=playbackShow(show,settings,manifest);
    for(const i of playthroughStarts(playback,settings)){
      const c=playback.cues[i];
      assert.deepEqual(venuePlan(c),venuePlan(show.cues[i]),c.id);
      for(const slot of [venuePlan(c).upper,...Object.values(venuePlan(c).wall)]){
        if(slot.type==='source'){
          const routed=routedCue(c,slot);
          assert.deepEqual(routed.screenActions,c.screenActions);
          assert.equal(routed.claudeSession,c.claudeSession);
          assert.deepEqual(routed.actionSource,c.actionSource);
        }
      }
    }
  }
});
