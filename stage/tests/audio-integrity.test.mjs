import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const root=new URL('../',import.meta.url);
const show=JSON.parse(fs.readFileSync(new URL('show.json',root)));
const manifest=JSON.parse(fs.readFileSync(new URL('generated-voices.json',root)));
const spoken=show.cues.filter(c=>c.kind!=='stage'&&c.speaker);
for(const c of spoken){const r=manifest.recordings[c.id];assert(r,`Missing recording: ${c.id}`);assert.equal(r.text,c.text,`Stale words: ${c.id}`);assert.equal(r.speaker,c.speaker,`Wrong speaker: ${c.id}`);assert.equal(c.audio,r.audio);assert(r.duration>0);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(r.audio,root))).digest('hex'),r.audioSha256,`Wrong bytes: ${c.id}`)}
assert.equal(new Set(show.cues.map(c=>c.id)).size,show.cues.length);
console.log(`Verified ${spoken.length} recordings: exact cue text, speaker, file checksum, and unique cue IDs.`);
