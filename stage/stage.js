import {castFor,readSettings,playbackShow,cueAudio,playbackRate} from './playback-settings.js?v=shared-script-20260913';
import {sfxForCue,backgroundFor,counterProfile} from './visuals.js?v=shared-script-20260913';
import {screenLabel,actionDuration,actions,sampleAction} from './screen-actions.js?v=shared-script-20260913';
const $=id=>document.getElementById(id), controller=controllerId();
localStorage.setItem('big-hack-display-controller',controller);
const channel=new BroadcastChannel('big-hack-stage-v2:'+controller);
for(const side of ['left','right'])$(side+'Preview').src='display.html?side='+side+'&preview=1&controller='+encodeURIComponent(controller);
const initialSnapshot=await fetch('/api/script',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
let sourceShow=initialSnapshot?.show||await fetch('show.json',{cache:'no-store'}).then(r=>r.json());
let voiceManifest=await fetch('generated-voices.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}));
let savedSettings;try{savedSettings=JSON.parse(localStorage.getItem('big-hack-playback')||'{}')}catch{}
let settings=readSettings(sourceShow,savedSettings);
let show=playbackShow(sourceShow,settings,voiceManifest.recordings||{});
let cast=castFor(sourceShow);
let overrides=await fetch('overrides.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
let saved;try{saved=JSON.parse(localStorage.getItem('big-hack-cue-'+(sourceShow.scriptRevision||'legacy'))||'null')}catch{}
let state={index:Math.max(0,show.cues.findIndex(c=>c.id===saved?.id)),running:false,blackout:false,serial:0,elapsed:0,screenBase:{left:0,right:0},anchor:Date.now(),volume:.85,rate:settings.rate};
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
const effectiveRate=()=>cue().montage?1:state.rate;
const elapsed=()=>state.elapsed+(state.running?(Date.now()-state.anchor)/1000*effectiveRate():0);
function payload(){const profile=counterProfile(cue());return {...state,rate:effectiveRate(),controller,audioTime:audio.currentTime||0,audioDuration:Number.isFinite(audio.duration)?audio.duration:(cue().audioDuration||0),counterValue:Math.floor((state.counterBase??profile.base)+elapsed()*profile.rate),screenElapsed:Object.fromEntries(['left','right'].map(side=>[side,(state.screenBase[side]||0)+elapsed()])),elapsed:elapsed(),sentAt:Date.now(),cue:{...cue(),isSpeaking:state.running&&!state.blackout&&!audio.paused&&!audio.ended&&!!audio.getAttribute('src')},override:overrides[cue().id]||{}}}
function broadcast(){channel.postMessage({type:'state',state:payload()});localStorage.setItem('big-hack-cue-'+(sourceShow.scriptRevision||'legacy'),JSON.stringify({id:cue().id}))}
function status(text,error=false){$('audioStatus').textContent=text;$('audioStatus').classList.toggle('error',error)}
function stopAudio(){typingSound.pause();audio.pause();audio.removeAttribute('src');audio.load();for(const a of sfx){a.pause();a.removeAttribute('src');a.load()}sfx=[]}
const typingSound=new Audio('assets/sfx/typing.mp3');typingSound.loop=true;
const audioPath=cueAudio;
async function startAudio(restart=false){
 const serial=state.serial,c=cue(),o=overrides[c.id]||{},src=audioPath(c,o);
 if(restart){stopAudio();lastAudio=src||'';if(src){audio.src=src;audio.preload='auto';audio.volume=state.volume;audio.playbackRate=effectiveRate();audio.preservesPitch=true;audio.onplaying=()=>{if(serial===state.serial)broadcast()};audio.onended=()=>{if(serial===state.serial){status('Holding · GO when ready');broadcast()}};audio.onerror=()=>{if(serial===state.serial)status('Audio unavailable · Retry with Replay',true)}}
  for(const item of sfxForCue(c)){const a=new Audio('assets/sfx/'+item.id+'.mp3');a.loop=!!item.loop;a.volume=state.volume*(item.level??.35);a.dataset.level=item.level??.35;sfx.push(a)}
 }
 if(!state.running){status(c.kind==='live'?'Live · ready for performer':'Ready · press Start');return;}
 const play=async a=>{try{await a.play()}catch(e){if(serial===state.serial&&e.name!=='AbortError')status('Press Start to enable audio',true)}};
 if(src&&!audio.ended){status('Playing '+(c.montage?'opening montage':o.audioSource&&o.audioSource!=='tts'?'clip':c.name));await play(audio)}else if(c.kind==='voice'&&!src&&(!o.audioSource||o.audioSource==='tts'))status('Recording unavailable for '+c.name+' · Choose Live in Settings',true);else status(c.kind==='live'?'Live · waiting for GO':'Holding · waiting for GO');
 for(const a of sfx)if(!a.ended||a.loop)play(a);
}
function navigate(index,run=state.running){const previous=payload();const previousCounter=previous.counterValue;const next=show.cues[Math.max(0,Math.min(index,show.cues.length-1))];const adjacent=index===nextIndex();state.screenBase=Object.fromEntries(['left','right'].map(side=>[side,adjacent&&next.screenActions?.[side]&&next.screenActions[side]===cue().screenActions?.[side]?previous.screenElapsed[side]:0]));const nextCue=show.cues[Math.max(0,Math.min(index,show.cues.length-1))];state.counterBase=index>state.index?Math.max(counterProfile(nextCue).base,previousCounter):counterProfile(nextCue).base;state.elapsed=0;state.anchor=Date.now();state.index=Math.max(0,Math.min(index,show.cues.length-1));state.serial++;state.running=run;state.blackout=false;render();$('notesBody').scrollTop=0;startAudio(true);broadcast()}
function toggle(){if(state.running){state.elapsed=elapsed();state.running=false;audio.pause();typingSound.pause();sfx.forEach(a=>a.pause());status('Paused')}else{state.running=true;state.anchor=Date.now();if(!timerStart)timerStart=Date.now();startAudio(!lastAudio&&!sfx.length)}renderTransport();broadcast()}
function blackout(){state.blackout=!state.blackout;if(state.blackout){state.elapsed=elapsed();state.running=false;audio.pause();typingSound.pause();sfx.forEach(a=>a.pause())}status(state.blackout?'Blackout · paused':'Paused');renderTransport();broadcast()}
function nextIndex(){return show.performanceStarts.find(i=>i>state.index)??show.cues.length}
function renderTransport(){$('play').innerHTML=(state.running?'Pause':'Start / Resume')+' <kbd>Space</kbd>';$('blackout').classList.toggle('active',state.blackout);$('blackout').setAttribute('aria-pressed',String(state.blackout));$('blackout').textContent=state.blackout?'Blackout on · Restore (B)':'Blackout (B)'}
function render(){const c=cue(),s=show.scenes.find(s=>s.id===c.scene);document.documentElement.style.setProperty('--notes-size',notesSize+'px');$('sceneLabel').textContent='Movement '+s.movement+' / '+s.id.toUpperCase();$('sceneTitle').textContent=s.title;$('cueNumber').textContent=`${show.performanceStarts.filter(i=>i<=state.index).length} / ${show.performanceStarts.length}`;$('cueKind').textContent=c.montage?'Film · Plays once':c.kind==='live'?'Live actor · Hold for GO':c.kind==='voice'?(c.speaker==='narrator'?'Narration · Plays once':'Generated voice · Plays once'):'Stage / visual cue · Hold for GO';$('cueId').textContent=c.id;$('speaker').textContent=c.name||'STAGE';const notes=(c.notes||[{kind:c.kind,name:c.name,text:c.text,direction:c.direction}]).map(n=>({...n,direction:(n.direction||'').replace(/^live(?:,\s*|$)/i,'')}));$('lineText').innerHTML=notes.map(n=>n.kind==='stage'?`<p class="actingBeat">${esc(n.text)}</p>`:`<p class="spokenBeat">${notes.length>1&&n.name!==c.name?`<span class="beatSpeaker">${esc(n.name)}</span>`:''}${n.direction?`<span class="beatDirection">${esc(n.direction)}</span>`:''}${esc(n.text)}</p>`).join('');$('direction').textContent='';$('adaptation').textContent=c.stageAdaptation||'';$('screenNotes').hidden=!c.screenNotes;$('screenNotes').textContent=c.screenNotes?c.screenNotes+'\n\n'+Object.entries(c.screenActions).map(([side,id])=>side.toUpperCase()+': '+actionDuration(id).toFixed(1)+' seconds, then hold until GO.').join(' · '):'';$('sourceDirection').hidden=!c.sourceText;$('sourceDirectionText').textContent=c.sourceText||'';$('leftLabel').textContent=screenLabel(c,'left')||c.state.replaceAll('-',' ');$('rightLabel').textContent=screenLabel(c,'right')||(c.offstage?'BLACK / OFFSTAGE':c.staging?.view==='physical'?c.staging.location:c.name||c.mode);const n=show.cues[nextIndex()];$('nextText').innerHTML=n?`<strong>${esc(n.name||'STAGE')} · ${esc(n.id)}</strong>${esc(n.text)}`:'End of show';
 if(lastScene!==c.scene){lastScene=c.scene;renderScenes();renderRail()}
 document.querySelectorAll('.cueItem').forEach(b=>b.classList.toggle('active',Number(b.dataset.index)===state.index));const active=document.querySelector('.cueItem.active');if(active)active.scrollIntoView({block:'nearest'});
 const o=overrides[c.id]||{};$('audioSource').value=o.audioSource||'tts';$('videoBehavior').value=o.behavior||'loop';$('loopStart').value=o.loopStart||0;$('editStatus').textContent=[o.left?.src&&'Left clip saved',o.right?.src&&'Right clip saved'].filter(Boolean).join(' · ');renderTransport();
}
function renderScenes(){let movement='';$('sceneList').innerHTML=show.scenes.map(s=>{let label='';if(s.movement!==movement){movement=s.movement;label=`<div class="movement">Movement ${movement}</div>`}return label+`<button class="sceneButton ${s.id===cue().scene?'active':''}" data-index="${s.start}"><span class="num">${s.id.slice(1)}</span><span>${esc(s.title)}</span></button>`}).join('');$('sceneCount').textContent=show.scenes.length}
function renderRail(){const query=$('search').value.trim().toLowerCase();$('cueList').innerHTML=show.cues.map((c,i)=>({c,i})).filter(({c,i})=>query?(c.id+' '+c.text+' '+c.name+' '+c.scene+' '+(show.scenes.find(s=>s.id===c.scene)?.title||'')).toLowerCase().includes(query):c.scene===cue().scene&&show.performanceStarts.includes(i)).map(({c,i})=>`<button class="cueItem ${state.index===i?'active':''}" data-index="${i}"><small>${esc(c.id)} · ${esc(c.name||'STAGE')}</small><p>${esc(c.text)}</p></button>`).join('')}
$('sceneList').onclick=$('cueList').onclick=e=>{const b=e.target.closest('[data-index]');if(b){navigate(Number(b.dataset.index),false);$('sceneDialog').close()}};
$('search').oninput=renderRail;$('go').onclick=()=>{if(nextIndex()>=show.cues.length){blackout();status('End of show');return}if(!timerStart)timerStart=Date.now();navigate(nextIndex(),true)};$('previous').onclick=()=>navigate(show.performanceStarts.filter(i=>i<state.index).at(-1)??0,false);$('play').onclick=toggle;$('replay').onclick=()=>navigate(state.index,true);$('blackout').onclick=blackout;
$('volume').oninput=e=>{state.volume=Number(e.target.value);audio.volume=state.volume;sfx.forEach(a=>a.volume=state.volume*Number(a.dataset.level||.35));broadcast()};
for(const delta of [-2,2])$(delta<0?'notesSmaller':'notesLarger').onclick=()=>{notesSize=Math.max(18,Math.min(48,notesSize+delta));localStorage.setItem('big-hack-notes-size',notesSize);render()};
for(const side of ['left','right']){const name=side[0].toUpperCase()+side.slice(1);$('open'+name).onclick=()=>{const w=window.open('display.html?side='+side+'&controller='+encodeURIComponent(controller),'big-hack-'+side,'popup,width=1280,height=720');if(!w)status('Allow popups to open display',true)};$(side+'File').onchange=async e=>{const file=e.target.files[0];if(!file)return;const id=cue().id;$('editStatus').textContent='Saving clip…';try{const r=await fetch(`/api/clip?cue=${encodeURIComponent(id)}&side=${side}&ext=${encodeURIComponent(file.name.split('.').pop())}`,{method:'POST',headers:{'Content-Type':file.type},body:file});if(!r.ok)throw Error(await r.text());const d=await r.json();overrides=d;render();broadcast();status('Clip saved')}catch(err){$('editStatus').textContent=err.message}e.target.value=''}}
async function saveOverride(reset=false){const id=cue().id,data=reset?null:{...(overrides[id]||{}),audioSource:$('audioSource').value,behavior:$('videoBehavior').value,loopStart:Math.max(0,Number($('loopStart').value)||0)};try{const r=await fetch('/api/cue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,value:data})});if(!r.ok)throw Error(await r.text());overrides=await r.json();navigate(state.index,false);$('editStatus').textContent='Saved'}catch(e){$('editStatus').textContent=e.message}}
$('saveCue').onclick=()=>saveOverride();$('resetCue').onclick=()=>saveOverride(true);
$('exportCues').onclick=()=>{const text=show.cues.map(c=>`${c.id}\t${c.scene}\t${c.kind}\t${c.name}\t${c.state}\t${c.text.replaceAll('\t',' ')}\t${c.direction}\t${(c.sourceText||'').replaceAll('\t',' ')}\t${[screenLabel(c,'left'),screenLabel(c,'right')].join(' / ')}\t${(c.screenNotes||'').replaceAll('\t',' ').replaceAll('\n',' ')}`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['Cue\tScene\tType\tSpeaker\tVisual\tLine\tDirection\tOriginal stage direction\tComputer owners\tScreen performance\n'+text],{type:'text/tab-separated-values'}));a.download='the-big-hack-cues.tsv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key.toLowerCase()==='s'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)&&!e.altKey&&!e.metaKey&&!e.ctrlKey){e.preventDefault();openScenes();return}if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.altKey||e.metaKey||e.ctrlKey)return;if(['ArrowRight','PageDown','ArrowLeft','PageUp',' ','b','B','r','R'].includes(e.key))e.preventDefault();if(['ArrowRight','PageDown'].includes(e.key))$('go').click();if(['ArrowLeft','PageUp'].includes(e.key))$('previous').click();if(e.key===' ')toggle();if(e.key.toLowerCase()==='b')blackout();if(e.key.toLowerCase()==='r')$('replay').click()});
channel.onmessage=({data})=>{if(data.type==='hello')broadcast();if(data.type==='control'){({go:()=> $('go').click(),back:()=> $('previous').click(),pause:toggle,blackout,replay:()=> $('replay').click()})[data.action]?.();}if(data.type==='heartbeat'&&!data.preview){heartbeat[data.side]=Date.now()}if(data.type==='media-error')status('Missing video: '+data.path,true)};
setInterval(()=>{broadcast();for(const side of ['left','right']){const live=Date.now()-(heartbeat[side]||0)<3500;const e=$('connection'+side[0].toUpperCase()+side.slice(1));e.textContent='● '+side[0].toUpperCase()+side.slice(1)+(live?' connected':' offline');e.style.color=live?'#c7f28b':'#c0a397'}if(timerStart){elapsedShow=Math.floor((Date.now()-timerStart)/1000);$('clock').textContent=String(Math.floor(elapsedShow/60)).padStart(2,'0')+':'+String(elapsedShow%60).padStart(2,'0')}},1000);
setInterval(()=>{if(state.running&&!audio.paused&&!audio.ended)broadcast()},250);
window.addEventListener('beforeunload',()=>{stopAudio();channel.postMessage({type:'controller-closed',controller})});
window.stage={show,get state(){return payload()},navigate,toggle,blackout,get overrides(){return overrides},get audio(){return {src:audio.getAttribute('src'),paused:audio.paused,ended:audio.ended,currentTime:audio.currentTime,duration:audio.duration,playbackRate:audio.playbackRate,preservesPitch:audio.preservesPitch}},get settings(){return settings},setCharacterMode,setPlaybackRate,get effects(){return sfx.map(a=>({src:a.src,paused:a.paused,loop:a.loop}))}};
renderCast();renderScenes();renderRail();render();broadcast();

function persistSettings(){localStorage.setItem('big-hack-playback',JSON.stringify(settings))}
function renderCast(){
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
 state.elapsed=elapsed();state.running=false;state.serial++;stopAudio();lastAudio='';
 show=playbackShow(sourceShow,settings,voiceManifest.recordings||{});
 state.index=show.performanceStarts.filter(i=>i<=state.index).at(-1)??0;
 state.elapsed=0;state.screenBase={left:0,right:0};state.anchor=Date.now();
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
$('speed').oninput=e=>setPlaybackRate(e.target.value);
$('normalSpeed').onclick=()=>setPlaybackRate(1);

function openScenes(){
 $('sceneDialog').showModal();renderRail();
 $('sceneList').querySelector('.active')?.scrollIntoView({block:'center'});
 $('cueList').querySelector('.active')?.scrollIntoView({block:'center'});
 $('search').focus({preventScroll:true});
}
function openSetup(){ $('setupDialog').showModal(); }
$('openScenes').onclick=openScenes;
$('openSetup').onclick=openSetup;
$('openDisplaySettings').onclick=()=>{openSetup();$('openLeft').focus()};
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
  return sampleAction(action,(state.screenBase[side]||0)+elapsed()).phase==='type';
 });
 typingSound.volume=state.volume*.12;
 if(isTyping){if(typingSound.paused)typingSound.play().catch(()=>{});}else typingSound.pause();
}
setInterval(updateTypingSound,80);

// Authoring never changes a running performance. A revision is loaded explicitly.
let scriptRevision=initialSnapshot?.revision||null, editRevision=null;
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
 renderCast();navigate(Math.max(0,show.cues.findIndex(c=>c.id===id)),false);
 updateButton.hidden=true;status('Updated script loaded · paused');
}
updateButton.onclick=()=>loadScript().catch(e=>status(e.message,true));
$('editScriptCue').onclick=async()=>{
 if(state.running)toggle();
 try {
 const snapshot=await fetch('/api/script',{cache:'no-store'}).then(r=>r.json());
 const line=snapshot.scenes.flatMap(s=>s.lines).find(l=>l.id===cue().id);
 if(!line)throw Error('This cue was removed. Load the updated script.');
 editRevision=snapshot.revision;
 $('scriptText').value=line.text;$('scriptDirection').value=line.direction;
 $('scriptType').value=line.type;
 $('scriptSpeaker').innerHTML='<option value="">Stage direction</option>'+cast.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
 $('scriptSpeaker').value=line.speaker;
 $('scriptSaveStatus').textContent='Changes are shared with the storyboard. Changed speech needs a new recording.';
 $('scriptEditDialog').showModal();
 }catch(e){status(e.message,true)}
};
$('saveScriptCue').onclick=async()=>{
 try {
 const r=await fetch('/api/script/cue',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:cue().id,revision:editRevision,type:$('scriptType').value,speaker:$('scriptSpeaker').value,text:$('scriptText').value,direction:$('scriptDirection').value})});
 if(!r.ok)throw Error(r.status===409?'The script changed elsewhere. Close and reopen this editor before saving.':'Could not save. Check the speaker and cue type.');
 $('scriptEditDialog').close();await loadScript();
 }catch(e){$('scriptSaveStatus').textContent=e.message;}
};
scriptCheck();setInterval(scriptCheck,2500);
