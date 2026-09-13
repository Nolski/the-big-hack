import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {BroadcastChannel} from 'node:worker_threads';
const stage=fs.readFileSync(new URL('../stage.js',import.meta.url),'utf8');
const display=fs.readFileSync(new URL('../display.js',import.meta.url),'utf8');

test('two consoles cannot send conflicting cues to each other’s previews',async()=>{
 const channels=[];const storage=new Map();
 class Channel extends BroadcastChannel{constructor(name){super(name);channels.push(this)}}
 const boot=id=>{
  const elements={leftPreview:{},rightPreview:{}};
  const context=vm.createContext({document:{getElementById:id=>elements[id]},controllerId:()=>id,encodeURIComponent,BroadcastChannel:Channel,localStorage:{setItem:(k,v)=>storage.set(k,v)}});
  vm.runInContext(stage.slice(stage.indexOf('const $='),stage.indexOf('const initialSnapshot=')),context);
  return {elements,send:cue=>vm.runInContext(`channel.postMessage({cue:${JSON.stringify(cue)}})`,context)};
 };
 const a=boot('console-a'),b=boot('console-b');
 const subscribe=src=>{
  const params=new URL('http://localhost/'+src).searchParams;
  const context=vm.createContext({params,BroadcastChannel:Channel,localStorage:{getItem:k=>storage.get(k)}});
  const expression=display.match(/channel=(new BroadcastChannel\([^\n]+\));/)[1];
  return vm.runInContext(expression,context);
 };
 try{
  for(const side of ['left','right']){
   const feed=subscribe(a.elements[side+'Preview'].src);
   const messages=[];feed.onmessage=e=>messages.push(e.data.cue);
   b.send('wrong-apartment');a.send('cold-open');b.send('wrong-apartment');
   await new Promise(r=>setTimeout(r,40));
   assert.deepEqual(messages,['cold-open']);
  }
  assert.match(stage,/window.open\('display.html\?side='\+side\+'&controller='/);
 }finally{channels.forEach(c=>c.close())}
});
