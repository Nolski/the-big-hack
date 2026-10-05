import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const root=new URL('../',import.meta.url);
const show=JSON.parse(fs.readFileSync(new URL('show.json',root)));
const manifest=JSON.parse(fs.readFileSync(new URL('generated-voices.json',root)));
const spoken=show.cues.filter(c=>c.kind!=='stage'&&c.speaker);
let ready=0,pending=0;
for(const c of spoken){
 const r=manifest.recordings[c.id];
 if(!r || r.text!==c.text || r.speaker!==c.speaker || (r.voiceProfile??null)!==(c.voiceProfile??null)){pending++;continue;}
 assert(r.duration>0);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(r.audio,root))).digest('hex'),r.audioSha256,`Wrong bytes: ${c.id}`);
 ready++;
}
assert.equal(new Set(show.cues.map(c=>c.id)).size,show.cues.length);
console.log(`Verified ${ready} matching recordings; ${pending} cues await generation and must stay silent.`);
