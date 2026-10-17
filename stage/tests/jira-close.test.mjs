import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {jiraCloseState,drawJiraClose,renderJiraClose,JIRA_CLOSED_AT,JIRA_MUSIC_AT} from '../jira-close.js';
import {playbackShow,readSettings,playthroughStarts,cueAudio,cueClock} from '../playback-settings.js';
import {nextCueType} from '../next-cue.js';

const root=new URL('../',import.meta.url);
const source=JSON.parse(fs.readFileSync(new URL('show.json',root)));
const manifest=JSON.parse(fs.readFileSync(new URL('generated-voices.json',root))).recordings;

test('ticket closure is a retained music cue, with the narrator recording replaced',()=>{
  for(const skipStageDirections of [false,true]){
    const settings=readSettings(source,{skipStageDirections});
    const show=playbackShow(source,settings,manifest);
    const index=show.cues.findIndex(c=>c.id==='s01b_l35'),cue=show.cues[index];
    assert.equal(index+1,99);assert.equal(cue.kind,'stage');assert.equal(cue.speaker,'');
    assert.equal(cue.audioRole,'music');assert.equal(cue.screenClock,'audio');
    assert.equal(cue.screenActions.left,'jira-close');
    assert(playthroughStarts(show,settings).includes(index));
    assert.equal(cueAudio(cue),manifest[cue.id].audio);
    assert.equal(manifest[cue.id].provenance.type,'user-supplied-music');
    assert.equal(manifest[cue.id].provenance.sourceStart,5.5);
    assert.equal(manifest[cue.id].provenance.leadInSilence,JIRA_MUSIC_AT);
    assert(cue.audioDuration>=12&&cue.audioDuration<12.2);
    assert(fs.existsSync(new URL(cue.audio,root)));
    assert.equal(nextCueType(show.cues[index-1],cue).label,'Music / visual');
    if(skipStageDirections)assert.equal(playthroughStarts(show,settings).find(i=>i>index),index+2);
  }
});

test('automatic closure snaps into Done, then the song starts after a short pause',()=>{
  assert.equal(jiraCloseState(0).primary,0);
  assert.equal(jiraCloseState(JIRA_CLOSED_AT-.001).confirmed,false);
  assert.equal(jiraCloseState(JIRA_CLOSED_AT).confirmed,true);
  assert.equal(jiraCloseState(JIRA_CLOSED_AT-.001).primary,0);
  assert.equal(jiraCloseState(JIRA_CLOSED_AT).primary,1,'No intermediate drag position');
  assert(Math.abs(JIRA_MUSIC_AT-JIRA_CLOSED_AT-.75)<1e-9,'Three-quarter-second pause after the closed state appears');
  assert.equal(jiraCloseState(JIRA_MUSIC_AT).primary,1);
  assert.deepEqual(jiraCloseState(JIRA_MUSIC_AT).linked,[0,0,0]);
  assert.deepEqual(jiraCloseState(30).linked,[0,0,0],'The other tickets cannot distract from this beat');
  assert.deepEqual(jiraCloseState(0,true).linked,[1,1,1],'The linked-ticket result stays on its separate cue');
  assert.equal(jiraCloseState(0,true).linkedNotice,true);
  assert.equal(jiraCloseState(0,true).primary,1,'Selecting the final board directly cannot replay its closure');
  assert.match(renderJiraClose({}),/data-ticket="PROJ-412"/);
});

test('the projected card and counts follow the cue clock, including Pause and Replay',()=>{
  const node=()=>({textContent:'',hidden:false,style:{},dataset:{},classes:new Set(),classList:{toggle(name,on){if(on)this.owner.classes.add(name);else this.owner.classes.delete(name)}}});
  const make=()=>{const n=node();n.classList.owner=n;return n;};
  const cards=Array.from({length:4},()=>{const card=make(),status=make();card.status=status;card.querySelector=()=>status;return card;});
  const nodes=Object.fromEntries(['.jiraCloseApp','.jiraInProgressCount','.jiraDoneCount','.jiraCloseMessage','.jiraSlackReceipt','.jiraLinkedNotice'].map(k=>[k,make()]));
  nodes['.jiraCloseApp'].dataset.complete='false';
  const screen={dataset:{},querySelector:k=>nodes[k],querySelectorAll:()=>cards};
  drawJiraClose(screen,0);const start=cards[0].style.transform;
  drawJiraClose(screen,JIRA_CLOSED_AT-.001);assert.equal(cards[0].style.transform,start);
  drawJiraClose(screen,JIRA_CLOSED_AT);const done=cards[0].style.transform;
  assert.notEqual(start,done);assert.equal(screen.dataset.phase,'done');
  drawJiraClose(screen,JIRA_CLOSED_AT);assert.equal(cards[0].style.transform,done,'Pause holds the closed state');
  assert.equal(cards[0].status.textContent,'✓ DONE');assert.equal(nodes['.jiraDoneCount'].textContent,1);
  drawJiraClose(screen,30);assert.equal(nodes['.jiraDoneCount'].textContent,1);
  assert.equal(nodes['.jiraLinkedNotice'].hidden,true);
  nodes['.jiraCloseApp'].dataset.complete='true';
  drawJiraClose(screen,0);assert.equal(nodes['.jiraDoneCount'].textContent,4);
  assert.equal(nodes['.jiraLinkedNotice'].hidden,false);
  nodes['.jiraCloseApp'].dataset.complete='false';
  drawJiraClose(screen,0);assert.equal(cards[0].style.transform,start);
  assert.equal(nodes['.jiraDoneCount'].textContent,0);assert.equal(nodes['.jiraLinkedNotice'].hidden,true);
});

test('the music and its animation stay at natural speed and follow the actual audio position',()=>{
  const clip=source.cues.find(c=>c.id==='s01b_l35');
  const media={currentTime:2.3,getAttribute:()=>clip.audio};
  assert.equal(cueClock(clip,3,media),2.3);
  const stage=fs.readFileSync(new URL('stage.js',root),'utf8');
  const expression=stage.match(/const effectiveRate=\(\)=>[^;]+;/)[0];
  let current=clip;
  const context=vm.createContext({cue:()=>current,state:{rate:2}});
  vm.runInContext(expression,context);
  assert.equal(vm.runInContext('effectiveRate()',context),1);
  current={kind:'voice'};assert.equal(vm.runInContext('effectiveRate()',context),2);
});
