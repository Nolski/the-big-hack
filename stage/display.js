import {isWorm,drawWorm} from './worm.js';
import {renderVisual,backgroundFor,counterProfile} from './visuals.js';
import {screenLabel,drawScreenAction} from './screen-actions.js';
const params=new URLSearchParams(location.search),side=params.get('side')==='right'?'right':'left',preview=params.has('preview'),channel=new BroadcastChannel('big-hack-stage-v1');
const frame=document.getElementById('frame'),visual=document.getElementById('visual'),bg=document.getElementById('backgroundVideo'),replacement=document.getElementById('replacementVideo'),black=document.getElementById('black'),counter=document.getElementById('counter');
let state=null,key='',lastHeartbeat=0,ownedController=null,renderOnly=params.has('cue');
document.body.classList.toggle('preview',preview);document.title='The Big Hack · '+side.toUpperCase();
function resize(){frame.style.transform=`scale(${Math.min(innerWidth/1920,innerHeight/1080)})`}
window.addEventListener('resize',resize);resize();
for(const video of [bg,replacement]){video.muted=true;video.onerror=()=>{if(!renderOnly)channel.postMessage({type:'media-error',side,path:video.getAttribute('src')})}}
function media(video,path,loop=true){if(!path){video.pause();video.removeAttribute('src');video.style.display='none';return}video.style.display='block';if(video.getAttribute('src')!==path){video.src=path;video.load()}video.loop=loop;video.muted=true}
replacement.addEventListener('timeupdate',()=>{const start=Math.min(Number(state?.override?.loopStart)||0,Math.max(0,replacement.duration-.1));const showTime=(state?.elapsed||0)+(state?.running?Math.max(0,(Date.now()-(state?.sentAt||Date.now()))/1000):0);if(replacement.loop&&showTime>=replacement.duration&&replacement.currentTime<start)replacement.currentTime=start});
function sync(video,s,custom=false){if(!video.getAttribute('src'))return;const start=custom?Math.max(0,Number(s.override?.loopStart)||0):0;const duration=video.duration;let pos=s.elapsed;if(Number.isFinite(duration)&&duration>0){const actualStart=Math.min(start,Math.max(0,duration-.1));pos=video.loop?(pos<duration?pos:actualStart+((pos-duration)%Math.max(.1,duration-actualStart))):Math.min(pos,duration-.06)}if(Number.isFinite(pos)&&Math.abs(video.currentTime-pos)>.35){try{video.currentTime=pos}catch{}}if(s.running&&!s.blackout)video.play().catch(()=>{});else video.pause()}
function receive(s){const label=screenLabel(s.cue,side);const badge=document.getElementById('computerLabel');badge.textContent=label;badge.hidden=!label;frame.classList.toggle('computerView',!!label);const previousState=state;lastHeartbeat=Date.now();state=s;ownedController=s.controller;const profile=counterProfile(s.cue);counter.hidden=side!=='left'||!profile.visible;counter.classList.toggle('large',profile.large);counter.querySelector('strong').textContent=Math.floor(s.counterValue??profile.base).toLocaleString('en-US');const k=JSON.stringify([s.cue.id,s.serial,s.override,side==='right'&&s.cue.isSpeaking]);if(k!==key){key=k;const custom=s.override?.[side];const oldFeed=visual.querySelector('.reddit-feed');const feedPhase=oldFeed?.getAnimations()[0]?.currentTime;const feedTransform=oldFeed?getComputedStyle(oldFeed).transform:null;visual.innerHTML=custom?'':renderVisual(s.cue,side);const newFeed=visual.querySelector('.reddit-feed');if(newFeed&&oldFeed&&previousState?.cue.id!==s.cue.id){if(s.cue.state==='reddit-still')newFeed.style.transform=feedTransform;else if(feedPhase!=null)for(const animation of newFeed.getAnimations())animation.currentTime=feedPhase;}media(bg,custom?null:backgroundFor(s.cue,side));media(replacement,custom?.src,s.override?.behavior!=='hold');for(const video of [bg,replacement])video.onloadedmetadata=()=>{if(state)sync(video,state,video===replacement)};for(const actor of visual.querySelectorAll('.actorVideo')){actor.muted=true;actor.loop=false;actor.onloadedmetadata=()=>{if(state)sync(actor,{...state,elapsed:state.audioTime??state.elapsed})};actor.onerror=()=>channel.postMessage({type:'media-error',side,path:actor.getAttribute('src')});}}black.style.display=s.blackout?'block':'none';document.body.classList.toggle('paused',!s.running||s.blackout);sync(bg,s);sync(replacement,s,true);for(const actor of visual.querySelectorAll('.actorVideo'))sync(actor,{...s,elapsed:s.audioTime??s.elapsed});drawScreenAction(visual,s.screenElapsed?.[side]??s.elapsed)}
channel.onmessage=({data})=>{if(data.type==='state')receive(data.state);if(data.type==='controller-closed'&&data.controller===ownedController){freezeClock();bg.pause();replacement.pause();visual.querySelectorAll('.actorVideo').forEach(v=>v.pause());document.body.classList.add('paused')}};
setInterval(()=>{if(params.has('cue'))return;channel.postMessage({type:'heartbeat',side,preview});if(!state)channel.postMessage({type:'hello'});if(lastHeartbeat&&Date.now()-lastHeartbeat>3500){freezeClock();bg.pause();replacement.pause();visual.querySelectorAll('.actorVideo').forEach(v=>v.pause());document.body.classList.add('paused')}},1000);
channel.postMessage({type:'hello',side,preview});
document.getElementById('fullscreen').onclick=()=>document.documentElement.requestFullscreen();document.addEventListener('fullscreenchange',()=>document.body.classList.toggle('fullscreen',!!document.fullscreenElement));
window.displayState={get state(){return state},get side(){return side},receive};
// Render-only links are used by the local movie renderer and visual verification.
if(params.has('cue')){const show=await fetch('show.json').then(r=>r.json()),cue=show.cues.find(c=>c.id===params.get('cue'));if(cue){channel.close();receive({cue:{...cue,isSpeaking:params.get('play')==='1'},serial:1,override:{},running:params.get('play')==='1',elapsed:Number(params.get('t')||0),audioTime:Number(params.get('t')||0),audioDuration:cue.audioDuration||0,visualProgress:params.has('progress')?Number(params.get('progress')):undefined,sentAt:Date.now(),blackout:false});document.body.classList.add('preview');if(params.has('t'))requestAnimationFrame(()=>{for(const a of document.getAnimations())a.currentTime=Number(params.get('t'))*1000})}}

window.addEventListener('keydown',e=>{if(params.has('cue')||preview||e.metaKey||e.ctrlKey||e.altKey)return;const action=({'ArrowRight':'go','PageDown':'go','ArrowLeft':'back','PageUp':'back',' ':'pause','b':'blackout','B':'blackout','r':'replay','R':'replay'})[e.key];if(action){e.preventDefault();channel.postMessage({type:'control',action})}});

function freezeClock(){if(!state?.running)return;const dt=Math.max(0,(Date.now()-(state.sentAt||Date.now()))/1000);state.elapsed+=dt;if(state.screenElapsed)for(const side of ['left','right'])state.screenElapsed[side]+=dt;if(state.cue.isSpeaking)state.audioTime=Math.min(state.audioDuration||Infinity,(state.audioTime||0)+dt);state.running=false;state.sentAt=Date.now()}
let lastDraw=0;
function animate(now){
 requestAnimationFrame(animate);
 if(now-lastDraw<32||!state||state.override?.[side])return;
 lastDraw=now;
 const dt=state.running&&!state.blackout?Math.max(0,(Date.now()-(state.sentAt||Date.now()))/1000):0;
 drawScreenAction(visual,(state.screenElapsed?.[side]??state.elapsed)+dt);
 if(!isWorm(state.cue))return;
 const audioTime=(state.audioTime||0)+(state.cue.isSpeaking?dt:0);
 const duration=state.audioDuration||state.cue.audioDuration||0;
 const progress=state.visualProgress??(duration?Math.min(audioTime/duration,1):Math.min((state.elapsed+dt)/15,1));
 drawWorm(visual.querySelector('.wormCanvas'),state.cue,side,{elapsed:state.elapsed+dt,progress});
}
requestAnimationFrame(animate);
