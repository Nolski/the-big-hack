import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DESKS,lightingAt} from '../lighting.js';
import {readSettings,playbackShow} from '../playback-settings.js';
const source=JSON.parse(fs.readFileSync(new URL('../show.json',import.meta.url)));
const show=playbackShow(source,readSettings(source));
const at=id=>lightingAt(show,show.cues.findIndex(c=>c.id===id));

assert.deepEqual(DESKS.map(d=>d.key),['K','B','S','M'],'Desks run stage right to left');
assert.equal(readSettings(source).showLighting,false,'Lighting card is off by default');
assert.equal(readSettings(source,{showLighting:true}).showLighting,true);

// Synthetic: scene default, cue change persisting, reset at the next scene, unset scene.
const tiny={scenes:[{id:'a',lighting:['kristina','brendan']},{id:'b'},{id:'c',lighting:[]}],
 cues:[{scene:'a'},{scene:'a',lighting:['brendan']},{scene:'a'},{scene:'b'},{scene:'c'}]};
assert.deepEqual(lightingAt(tiny,0),['kristina','brendan']);
assert.deepEqual(lightingAt(tiny,2),['brendan'],'A change holds until the next one');
assert.equal(lightingAt(tiny,3),null,'A scene without lighting is not set');
assert.deepEqual(lightingAt(tiny,4),[],'Empty list means all off');

// The show itself.
assert.deepEqual(at('s00_montage'),[]);
assert.deepEqual(at('s01_l5'),['kristina','brendan','liam','marcus']);
assert.deepEqual(at('s01c_l1'),['brendan','liam']);
assert.deepEqual(at('s01c_l25'),['liam'],'Brendan drops the huddle');
assert.deepEqual(at('s14a_l2'),['liam','marcus'],'Marcus joins in Nine Tickets');
assert.deepEqual(at('s14a_l48'),['liam'],'Marcus has dropped');
assert.deepEqual(at('s20_l53'),[],'The Audit stays dark after the first insert');
assert.deepEqual(at('s22_hallway_cops'),['liam','marcus']);
assert.deepEqual(at('s22_l73'),['marcus'],'SJ is taken away');
assert.equal(at('s23_l1'),null,'Courtroom is deferred');
assert.deepEqual(at('s23b_brendan_denial'),['brendan']);
for(const x of [...source.scenes,...source.cues].filter(x=>'lighting' in x))
 assert(x.lighting.every(id=>DESKS.some(d=>d.id===id)),'Unknown desk on '+x.id);
console.log('Lighting checks passed: default off, scene and cue resolution, show lighting map.');
