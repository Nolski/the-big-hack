import {castFor,readSettings,playbackShow,cueAudio,playbackRate,playthroughStarts,playthroughIndex,cueClock,autoAdvances} from './playback-settings.js?v=auto-advance-20261017';
import {DESKS,lightingAt} from './lighting.js?v=lighting-20261012';
import {nextCueType} from './next-cue.js?v=sj-realization-tail-20261017';
import {sfxForCue,backgroundFor,counterProfile} from './visuals.js?v=sj-realization-tail-20261017';
import {screenLabel,actionDuration,actions,sampleAction} from './screen-actions.js?v=sj-realization-tail-20261017';
import {BackgroundMusic} from './background-music.js?v=score-through-live-20261025';
import {OUTPUTS,venuePlan} from './venue-plan.js';
import {Muffle} from './muffle.js?v=offboarding-steep-20261020';
const $=id=>document.getElementById(id), controller=controllerId();
localStorage.setItem('big-hack-display-controller',controller);
const channel=new BroadcastChannel('big-hack-stage-v2:'+controller);
for(const surface of ['upper','wall'])$(surface+'Preview').src='venue.html?surface='+surface+'&preview=1&controller='+encodeURIComponent(controller);
const initialSnapshot=await fetch('/api/script',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
let sourceShow=initialSnapshot?.show||await fetch('show.json',{cache:'no-store'}).then(r=>r.json());
let voiceManifest=await fetch('generated-voices.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}));
let savedSettings;try{savedSettings=JSON.parse(localStorage.getItem('big-hack-playback')||'{}')}catch{}
let settings=readSettings(sourceShow,savedSettings);
let show=playbackShow(sourceShow,settings,voiceManifest.recordings||{});
let cast=castFor(sourceShow);
let overrides=await fetch('overrides.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
let saved;try{saved=JSON.parse(localStorage.getItem('big-hack-cue-'+(sourceShow.scriptRevision||'legacy'))||'null')}catch{}
const requestedCue=new URLSearchParams(location.search).get('cue');
if(requestedCue&&show.cues.some(c=>c.id===requestedCue)){
 saved={id:requestedCue};
 const url=new URL(location.href);url.searchParams.delete('cue');history.replaceState(null,'',url.pathname+url.search+url.hash);
}
let state={index:playthroughIndex(show,settings,Math.max(0,show.cues.findIndex(c=>c.id===saved?.id)),overrides),running:false,blackout:false,serial:0,elapsed:0,voiceEndedAt:null,screenBase:{left:0,right:0},workerBase:0,anchor:Date.now(),volume:.85,rate:settings.rate};
// This is a playback-session identifier, not an authentication token.
// randomUUID requires HTTPS or localhost; getRandomValues also works on LAN HTTP.
function controllerId(){
 const crypto=globalThis.crypto;
 if(typeof crypto?.randomUUID==='function')return crypto.randomUUID();
 if(typeof crypto?.getRandomValues==='function')return Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
 return 'stage-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
}
let audio=new Audio(),sfx=[],elapsedShow=0,timerStart=0,lastScene='',lastRail='',lastAudio='',heartbeat={},notesSize=Number(localStorage.getItem('big-hack-notes-size')||32);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cue=()=>show.cues[state.index];
const effectiveRate=()=>cue().montage||cue().audioLeadIn>0||['music','narration-music'].includes(cue().audioRole)?1:state.rate;
const elapsed=()=>state.elapsed+(state.running?(Date.now()-state.anchor)/1000*effectiveRate():0);
const screenTime=()=>cueClock(cue(),elapsed(),audio,state.voiceEndedAt);
function payload(){const profile=counterProfile(cue());return {...state,rate:effectiveRate(),controller,mediaRunning:!audio.paused&&!audio.ended,audioTime:audio.currentTime||0,audioDuration:Number.isFinite(audio.duration)?audio.duration:(cue().audioDuration||0),counterValue:Math.floor((state.counterBase??profile.base)+elapsed()*profile.rate),workerElapsed:(state.workerBase||0)+elapsed(),screenElapsed:Object.fromEntries(['left','right'].map(side=>[side,(state.screenBase[side]||0)+screenTime()])),elapsed:cue().montage&&audio.getAttribute('src')?audio.currentTime:elapsed(),sentAt:Date.now(),cue:{...cue(),isSpeaking:state.running&&!state.blackout&&!audio.paused&&!audio.ended&&!!audio.getAttribute('src')},override:overrides[cue().id]||{}}}
function broadcast(){channel.postMessage({type:'state',state:payload()});localStorage.setItem('big-hack-cue-'+(sourceShow.scriptRevision||'legacy'),JSON.stringify({id:cue().id}))}
function status(text,error=false){$('audioStatus').textContent=text;$('audioStatus').classList.toggle('error',error)}
const musicElement=document.createElement('audio');musicElement.id='backgroundMusic';musicElement.hidden=true;document.body.append(musicElement);
const music=new BackgroundMusic(musicElement,()=>status('Background music unavailable · Retry with Replay',true));
music.setVolume(settings.musicVolume,state.volume);
music.enter(cue().backgroundMusic);
const muffle=new Muffle(audio);muffle.setVolume(settings.musicVolume);
function updateMusic(){
 const montage=!!cue().montage;
 const justCut=music.sync(montage?audio.currentTime:screenTime(),state.running&&!state.blackout&&(!montage||!audio.paused));
 muffle.sync(cue(),audio.currentTime||0,state.running&&!state.blackout);
 if(justCut)broadcast();
}
function musicFrame(){updateMusic();requestAnimationFrame(musicFrame)}
requestAnimationFrame(musicFrame);
audio.addEventListener('timeupdate',updateMusic);
function stopAudio(){state.voiceEndedAt=null;typingSound.pause();audio.pause();audio.removeAttribute('src');audio.load();for(const a of sfx){a.pause();a.removeAttribute('src');a.load()}sfx=[]}
const typingSound=new Audio('assets/sfx/typing.mp3');typingSound.loop=true;
const audioPath=cueAudio;
// A short beat after a recording ends, so the next cue doesn't land on its last word.
const AUTO_ADVANCE_DELAY=500;
async function startAudio(restart=false){
 const serial=state.serial,c=cue(),o=overrides[c.id]||{},src=audioPath(c,o);
 if(restart){stopAudio();lastAudio=src||'';if(src){audio.src=src;audio.preload='auto';audio.volume=state.volume;audio.playbackRate=effectiveRate();audio.preservesPitch=true;audio.onplaying=()=>{if(serial===state.serial)broadcast()};audio.onended=()=>{if(serial!==state.serial)return;state.voiceEndedAt=elapsed();if(autoAdvances(c,settings,o)&&nextIndex()<show.cues.length){status((c.montage||c.performanceVideo?'Clip':'Recording')+' finished · moving to next cue');setTimeout(()=>{if(serial===state.serial&&state.running&&!state.blackout&&settings.autoAdvance)navigate(nextIndex(),true)},AUTO_ADVANCE_DELAY)}else status('Holding · GO when ready');broadcast()};audio.onerror=()=>{if(serial===state.serial)status('Audio unavailable · Retry with Replay',true)}}
  for(const item of sfxForCue(c)){const a=new Audio('assets/sfx/'+item.id+'.mp3');a.loop=!!item.loop;a.volume=state.volume*(item.level??.35);a.dataset.level=item.level??.35;sfx.push(a)}
 }
 if(!state.running){music.pause();status(c.kind==='live'?'Live · ready for performer':'Ready · press Start');return;}
 updateMusic();
 const play=async a=>{try{await a.play()}catch(e){if(serial===state.serial&&e.name!=='AbortError')status('Press Start to enable audio',true)}};
 if(src&&!audio.ended){status('Playing '+(c.montage?'opening montage':o.audioSource&&o.audioSource!=='tts'?'clip':c.name));await play(audio)}else if(c.kind==='voice'&&!src&&(!o.audioSource||o.audioSource==='tts'))status('Recording unavailable for '+c.name+' · Choose Live in Settings',true);else status(c.kind==='live'?'Live · waiting for GO':'Holding · waiting for GO');
 for(const a of sfx)if(!a.ended||a.loop)play(a);
}
function navigate(index,run=state.running){const previous=payload();const previousCounter=previous.counterValue;const next=show.cues[Math.max(0,Math.min(index,show.cues.length-1))];const adjacent=index===nextIndex();state.workerBase=adjacent&&next.claudeSession&&next.claudeSession===cue().claudeSession?previous.workerElapsed:0;state.screenBase=Object.fromEntries(['left','right'].map(side=>[side,adjacent&&next.screenActions?.[side]&&next.screenActions[side]===cue().screenActions?.[side]?previous.screenElapsed[side]:0]));const nextCue=show.cues[Math.max(0,Math.min(index,show.cues.length-1))];state.counterBase=index>state.index?Math.max(counterProfile(nextCue).base,previousCounter):counterProfile(nextCue).base;state.elapsed=0;state.anchor=Date.now();state.index=Math.max(0,Math.min(index,show.cues.length-1));state.serial++;state.running=run;state.blackout=false;music.enter(next.backgroundMusic,adjacent&&run);render();$('notesBody').scrollTop=0;startAudio(true);broadcast()}
function toggle(){if(!state.running&&!playthroughStarts(show,settings,overrides).includes(state.index)){if(nextIndex()>=show.cues.length){status('End of show');return}navigate(nextIndex(),true);return}if(state.running){state.elapsed=elapsed();state.running=false;audio.pause();typingSound.pause();music.pause();sfx.forEach(a=>a.pause());status('Paused')}else{state.running=true;state.anchor=Date.now();if(!timerStart)timerStart=Date.now();startAudio(!lastAudio&&!sfx.length)}renderTransport();broadcast()}
function blackout(){state.blackout=!state.blackout;if(state.blackout){state.elapsed=elapsed();state.running=false;audio.pause();typingSound.pause();music.pause();sfx.forEach(a=>a.pause())}status(state.blackout?'Blackout · paused':'Paused');renderTransport();broadcast()}
function nextIndex(){return playthroughStarts(show,settings,overrides).find(i=>i>state.index)??show.cues.length}
function renderTransport(){$('play').innerHTML=(state.running?'Pause':'Start / Resume')+' <kbd>Space</kbd>';$('blackout').classList.toggle('active',state.blackout);$('blackout').setAttribute('aria-pressed',String(state.blackout));$('blackout').textContent=state.blackout?'Blackout on · Restore (B)':'Blackout (B)'}
function render(){const c=cue(),s=show.scenes.find(s=>s.id===c.scene);document.documentElement.style.setProperty('--notes-size',notesSize+'px');$('sceneLabel').textContent='Movement '+s.movement+' / '+s.id.toUpperCase();$('sceneTitle').textContent=s.title;$('cueNumber').textContent=`${show.performanceStarts.filter(i=>i<=state.index).length} / ${show.performanceStarts.length}`;$('cueKind').textContent=c.audioRole==='music'?'Music / visual · Plays once':c.montage?'Film · Plays once':c.kind==='live'?'Live actor · Hold for GO':c.kind==='voice'?(c.speaker==='narrator'?'Narration · Plays once':'Generated voice · Plays once'):'Stage / visual cue · Hold for GO';$('cueId').textContent=c.id;$('speaker').textContent=c.name||'STAGE';const notes=(c.notes||[{kind:c.kind,name:c.name,text:c.text,direction:c.direction}]).map(n=>({...n,direction:(n.direction||'').replace(/^live(?:,\s*|$)/i,'')}));$('lineText').innerHTML=notes.map(n=>n.kind==='stage'?`<p class="actingBeat">${esc(n.text)}</p>`:`<p class="spokenBeat">${notes.length>1&&n.name!==c.name?`<span class="beatSpeaker">${esc(n.name)}</span>`:''}${n.direction?`<span class="beatDirection">${esc(n.direction)}</span>`:''}${esc(n.text)}</p>`).join('');$('direction').textContent='';$('adaptation').textContent=c.stageAdaptation||'';$('screenNotes').hidden=!c.screenNotes;$('screenNotes').textContent=c.screenNotes?c.screenNotes+'\n\n'+Object.entries(c.screenActions).map(([side,id])=>side.toUpperCase()+': '+actionDuration(id).toFixed(1)+' seconds, then hold until GO.').join(' · '):'';$('sourceDirection').hidden=!c.sourceText;$('sourceDirectionText').textContent=c.sourceText||'';const layout=venuePlan(c);$('upperLabel').textContent=layout.upper.type==='blank'?'Dark':layout.upper.type==='call'?'Call':layout.upper.type==='film'||layout.upper.type==='performance'?'Filmed performance':layout.upper.type==='shared-pr'?'Shared pull request':screenLabel(c,layout.upper.side)||c.state.replaceAll('-',' ');$('wallLabel').textContent=layout.note;const n=show.cues[nextIndex()],nt=nextCueType(c,n);$('nextType').textContent=nt?.label||'';$('nextType').classList.toggle('alert',!!nt?.alert);$('nextText').innerHTML=n?`<strong>${esc(n.name||'STAGE')} · ${esc(n.id)}</strong>${esc(n.text)}`:'End of show';
 if(lastScene!==c.scene){lastScene=c.scene;renderScenes();renderRail()}
 document.querySelectorAll('.cueItem').forEach(b=>b.classList.toggle('active',Number(b.dataset.index)===state.index));const active=document.querySelector('.cueItem.active');if(active)active.scrollIntoView({block:'nearest'});
 const o=overrides[c.id]||{};$('audioSource').value=o.audioSource||'tts';$('videoBehavior').value=o.behavior||'loop';$('loopStart').value=o.loopStart||0;$('editStatus').textContent=[o.left?.src&&'Left clip saved',o.right?.src&&'Right clip saved'].filter(Boolean).join(' · ');renderTransport();renderLighting();
}
function renderLighting(){
 $('lightingCard').hidden=!settings.showLighting;if(!settings.showLighting)return;
 const lit=lightingAt(show,state.index);$('lightingUnset').hidden=!!lit;
 $('lightingDesks').innerHTML=DESKS.map(d=>{const on=!!lit?.includes(d.id),label=d.name+': '+(lit?on?'lit':'unlit':'not set');return `<span class="desk ${on?'lit':''}" role="img" aria-label="${label}" title="${label}">${d.key}</span>`}).join('');
}
function renderScenes(){let movement='';$('sceneList').innerHTML=show.scenes.map(s=>{let label='';if(s.movement!==movement){movement=s.movement;label=`<div class="movement">Movement ${movement}</div>`}return label+`<button class="sceneButton ${s.id===cue().scene?'active':''}" data-index="${s.start}"><span class="num">${s.id.slice(1)}</span><span>${esc(s.title)}</span></button>`}).join('');$('sceneCount').textContent=show.scenes.length}
function renderRail(){const query=$('search').value.trim().toLowerCase();$('cueList').innerHTML=show.cues.map((c,i)=>({c,i})).filter(({c,i})=>query?(c.id+' '+c.text+' '+c.name+' '+c.scene+' '+(show.scenes.find(s=>s.id===c.scene)?.title||'')).toLowerCase().includes(query):c.scene===cue().scene&&show.performanceStarts.includes(i)).map(({c,i})=>`<button class="cueItem ${state.index===i?'active':''}" data-index="${i}"><small>${esc(c.id)} · ${esc(c.name||'STAGE')}</small><p>${esc(c.text)}</p></button>`).join('')}
$('sceneList').onclick=$('cueList').onclick=e=>{const b=e.target.closest('[data-index]');if(b){navigate(Number(b.dataset.index),false);$('sceneDialog').close()}};
$('search').oninput=renderRail;$('go').onclick=()=>{if(nextIndex()>=show.cues.length){blackout();status('End of show');return}if(!timerStart)timerStart=Date.now();navigate(nextIndex(),true)};$('previous').onclick=()=>navigate(playthroughStarts(show,settings,overrides).filter(i=>i<state.index).at(-1)??state.index,false);$('play').onclick=toggle;$('replay').onclick=()=>navigate(state.index,true);$('blackout').onclick=blackout;
$('volume').oninput=e=>{state.volume=Number(e.target.value);audio.volume=state.volume;music.setVolume(settings.musicVolume,state.volume);sfx.forEach(a=>a.volume=state.volume*Number(a.dataset.level||.35));broadcast()};
for(const delta of [-2,2])$(delta<0?'notesSmaller':'notesLarger').onclick=()=>{notesSize=Math.max(18,Math.min(48,notesSize+delta));localStorage.setItem('big-hack-notes-size',notesSize);render()};
for(const surface of ['upper','wall','overview'])$('open'+surface[0].toUpperCase()+surface.slice(1)).href='venue.html?surface='+surface+'&controller='+encodeURIComponent(controller);
for(const side of ['left','right']){$(side+'File').onchange=async e=>{const file=e.target.files[0];if(!file)return;const id=cue().id;$('editStatus').textContent='Saving clip…';try{const r=await fetch(`/api/clip?cue=${encodeURIComponent(id)}&side=${side}&ext=${encodeURIComponent(file.name.split('.').pop())}`,{method:'POST',headers:{'Content-Type':file.type},body:file});if(!r.ok)throw Error(await r.text());const d=await r.json();overrides=d;render();broadcast();status('Clip saved')}catch(err){$('editStatus').textContent=err.message}e.target.value=''}}
async function saveOverride(reset=false){const id=cue().id,data=reset?null:{...(overrides[id]||{}),audioSource:$('audioSource').value,behavior:$('videoBehavior').value,loopStart:Math.max(0,Number($('loopStart').value)||0)};try{const r=await fetch('/api/cue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,value:data})});if(!r.ok)throw Error(await r.text());overrides=await r.json();navigate(state.index,false);$('editStatus').textContent='Saved'}catch(e){$('editStatus').textContent=e.message}}
$('saveCue').onclick=()=>saveOverride();$('resetCue').onclick=()=>saveOverride(true);
$('exportCues').onclick=()=>{const text=show.cues.map(c=>`${c.id}\t${c.scene}\t${c.kind}\t${c.name}\t${c.state}\t${c.text.replaceAll('\t',' ')}\t${c.direction}\t${(c.sourceText||'').replaceAll('\t',' ')}\t${[screenLabel(c,'left'),screenLabel(c,'right')].join(' / ')}\t${(c.screenNotes||'').replaceAll('\t',' ').replaceAll('\n',' ')}`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['Cue\tScene\tType\tSpeaker\tVisual\tLine\tDirection\tOriginal stage direction\tComputer owners\tScreen performance\n'+text],{type:'text/tab-separated-values'}));a.download='the-big-hack-cues.tsv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key.toLowerCase()==='s'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&!e.altKey&&!e.metaKey&&!e.ctrlKey){e.preventDefault();openScenes();return}if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.altKey||e.metaKey||e.ctrlKey)return;if(['ArrowRight','PageDown','ArrowLeft','PageUp',' ','b','B','r','R'].includes(e.key))e.preventDefault();if(['ArrowRight','PageDown'].includes(e.key))$('go').click();if(['ArrowLeft','PageUp'].includes(e.key))$('previous').click();if(e.key===' ')toggle();if(e.key.toLowerCase()==='b')blackout();if(e.key.toLowerCase()==='r')$('replay').click()});
channel.onmessage=({data})=>{if(data.type==='hello')broadcast();if(data.type==='control'){({go:()=> $('go').click(),back:()=> $('previous').click(),pause:toggle,blackout,replay:()=> $('replay').click()})[data.action]?.();}if(data.type==='heartbeat'&&!data.preview){heartbeat[data.side]=Date.now()}if(data.type==='media-error')status('Missing video: '+data.path,true)};
setInterval(()=>{broadcast();for(const surface of ['upper','wall']){const live=Date.now()-(heartbeat[surface]||0)<3500;const e=$('connection'+surface[0].toUpperCase()+surface.slice(1));e.textContent='● '+(live?'Connected':'Offline');e.dataset.connected=String(live);}if(timerStart){elapsedShow=Math.floor((Date.now()-timerStart)/1000);$('clock').textContent=String(Math.floor(elapsedShow/60)).padStart(2,'0')+':'+String(elapsedShow%60).padStart(2,'0')}},1000);
setInterval(()=>{if(state.running&&!audio.paused&&!audio.ended)broadcast()},250);
window.addEventListener('beforeunload',()=>{stopAudio();music.stop();channel.postMessage({type:'controller-closed',controller})});
window.stage={show,get state(){return payload()},navigate,toggle,blackout,get overrides(){return overrides},get audio(){return {src:audio.getAttribute('src'),paused:audio.paused,ended:audio.ended,currentTime:audio.currentTime,duration:audio.duration,playbackRate:audio.playbackRate,preservesPitch:audio.preservesPitch}},get settings(){return settings},setCharacterMode,setPlaybackRate,get effects(){return sfx.map(a=>({src:a.src,paused:a.paused,loop:a.loop}))}};
renderCast();renderScenes();renderRail();render();broadcast();

function persistSettings(){localStorage.setItem('big-hack-playback',JSON.stringify(settings))}
function renderCast(){
 $('skipStageDirections').checked=settings.skipStageDirections;$('autoAdvance').checked=settings.autoAdvance;$('showLighting').checked=settings.showLighting;
 $('musicVolume').value=settings.musicVolume;$('musicVolumeValue').textContent=Math.round(settings.musicVolume*100)+'%';
 $('characterModes').innerHTML=cast.map(c=>{
   const lines=show.cues.filter(q=>q.speaker===c.id&&q.kind!=='stage');
   const available=lines.filter(q=>q.audio).length;
   return `<label class="characterMode"><span>${esc(c.name)}<small>${available}/${lines.length} recordings</small></span><select data-character="${esc(c.id)}" aria-label="${esc(c.name)} voice mode"><option value="live" ${settings.modes[c.id]==='live'?'selected':''}>Live</option><option value="generated" ${settings.modes[c.id]==='generated'?'selected':''}>Generated</option></select></label>`;
 }).join('');
 $('speed').value=state.rate;$('speedValue').textContent=Number(state.rate.toFixed(2))+'×';$('quickSpeed').textContent=Number(state.rate.toFixed(2))+'× speed';
}
function setCharacterMode(id,mode){
 if(!cast.some(c=>c.id===id)||!['live','generated'].includes(mode))return;
 settings.modes[id]=mode;applyModes();
}
function applyModes(){
 // Pause on cast changes so a live microphone never competes with an old clip.
 state.elapsed=elapsed();state.running=false;state.serial++;stopAudio();music.stop();lastAudio='';
 show=playbackShow(sourceShow,settings,voiceManifest.recordings||{});
 state.index=playthroughIndex(show,settings,show.performanceStarts.filter(i=>i<=state.index).at(-1)??0,overrides);
 state.elapsed=0;state.workerBase=0;state.screenBase={left:0,right:0};state.anchor=Date.now();
 music.enter(cue().backgroundMusic);
 persistSettings();renderCast();renderRail();render();broadcast();status('Cast settings saved · press Start / Resume');
}
function setPlaybackRate(value){
 state.elapsed=elapsed();state.anchor=Date.now();state.rate=playbackRate(value);
 settings.rate=state.rate;audio.playbackRate=effectiveRate();audio.preservesPitch=true;
 persistSettings();$('speed').value=state.rate;$('speedValue').textContent=Number(state.rate.toFixed(2))+'×';$('quickSpeed').textContent=Number(state.rate.toFixed(2))+'× speed';broadcast();
}
$('characterModes').onchange=e=>{if(e.target.dataset.character)setCharacterMode(e.target.dataset.character,e.target.value)};
$('allGenerated').onclick=()=>{for(const c of cast)settings.modes[c.id]='generated';applyModes()};
$('defaultCast').onclick=()=>{settings.modes=readSettings(sourceShow).modes;applyModes()};
$('skipStageDirections').onchange=e=>{settings.skipStageDirections=e.target.checked;persistSettings();const index=playthroughIndex(show,settings,state.index,overrides);if(index!==state.index)navigate(index,state.running);else render();status(settings.skipStageDirections?'Stage directions skipped · narration, films, music and sound effects retained':'Stage directions included')};
$('autoAdvance').onchange=e=>{settings.autoAdvance=e.target.checked;persistSettings();status(settings.autoAdvance?'Recordings and films advance automatically · live lines wait for GO':'Every cue waits for GO')};
$('showLighting').onchange=e=>{settings.showLighting=e.target.checked;persistSettings();renderLighting()};
$('speed').oninput=e=>setPlaybackRate(e.target.value);
$('normalSpeed').onclick=()=>setPlaybackRate(1);
$('musicVolume').oninput=e=>{settings.musicVolume=Number(e.target.value);music.setVolume(settings.musicVolume,state.volume);muffle.setVolume(settings.musicVolume);$('musicVolumeValue').textContent=Math.round(settings.musicVolume*100)+'%';persistSettings()};
$('resetMusicVolume').onclick=()=>{$('musicVolume').value=0.08;$('musicVolume').dispatchEvent(new Event('input'))};

function openScenes(){
 $('sceneDialog').showModal();renderRail();
 $('sceneList').querySelector('.active')?.scrollIntoView({block:'center'});
 $('cueList').querySelector('.active')?.scrollIntoView({block:'center'});
 $('search').focus({preventScroll:true});
}
function openSetup(){ $('setupDialog').showModal(); }
$('openScenes').onclick=openScenes;
$('openSetup').onclick=openSetup;
$('openDisplaySettings').onclick=()=>{openSetup();$('openUpper').focus()};
$('quickSpeed').onclick=()=>{openSetup();$('speed').focus()};
for(const button of document.querySelectorAll('[data-close-dialog]'))button.onclick=()=>button.closest('dialog').close();
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{
 if(e.target!==dialog)return;
 const r=dialog.getBoundingClientRect();
 if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
});

$('previewSize').onclick=()=>{const large=document.querySelector('.workspace').classList.toggle('largePreviews');$('previewSize').setAttribute('aria-pressed',String(large));$('previewSize').textContent=large?'Compact previews':'Enlarge previews'};

function updateTypingSound(){
 const isTyping=state.running&&!state.blackout&&Object.entries(cue().screenActions||{}).some(([side,id])=>{
  const action=actions[id];if(!action||!['chatgpt','message','agent'].includes(action.view))return false;
  return sampleAction(action,(state.screenBase[side]||0)+screenTime()).phase==='type';
 });
 typingSound.volume=state.volume*.12;
 if(isTyping){if(typingSound.paused)typingSound.play().catch(()=>{});}else typingSound.pause();
}
setInterval(updateTypingSound,80);

// Authoring never changes a running performance. A revision is loaded explicitly.
let scriptRevision=initialSnapshot?.revision||null;
const updateButton=$('loadScriptUpdate');
async function scriptCheck(){
 try {const r=await fetch('/api/script/revision',{cache:'no-store'});if(!r.ok)return;
 const data=await r.json();if(scriptRevision===null)scriptRevision=data.revision;
 updateButton.hidden=data.revision===scriptRevision;
 updateButton.disabled=state.running;
 updateButton.title=state.running?'Pause before loading the updated script':'';
 } catch {}
}
async function loadScript(){
 if(state.running){status('Pause before loading script changes');return;}
 const id=cue().id;
 const snapshot=await fetch('/api/script',{cache:'no-store'}).then(r=>r.json());
 sourceShow=snapshot.show;
 voiceManifest=await fetch('generated-voices.json',{cache:'no-store'}).then(r=>r.json());
 settings=readSettings(sourceShow,settings);cast=castFor(sourceShow);
 show=playbackShow(sourceShow,settings,voiceManifest.recordings||{});
 scriptRevision=snapshot.revision;lastScene='';
 renderCast();navigate(playthroughIndex(show,settings,Math.max(0,show.cues.findIndex(c=>c.id===id)),overrides),false);
 for(const surface of ['upper','wall']){const f=$(surface+'Preview');f.src=f.src.split('&refresh=')[0]+'&refresh='+Date.now();}
 updateButton.hidden=true;status('Updated script loaded · paused');
}
updateButton.onclick=()=>loadScript().catch(e=>status(e.message,true));
$('editScriptCue').onclick=()=>{if(state.running)toggle();window.open('/editor.html?scene='+encodeURIComponent(cue().scene)+'&line='+encodeURIComponent(cue().id),'script-editor');};
scriptCheck();setInterval(scriptCheck,2500);
