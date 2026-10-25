import {OUTPUTS,venuePlan,routedCue,isSwarm,venueCue} from './venue-plan.js';
const params=new URLSearchParams(location.search);
const surface=['upper','wall','overview'].includes(params.get('surface'))?params.get('surface'):'overview';
const preview=params.has('preview')||params.has('cue');
const controller=params.get('controller')||localStorage.getItem('big-hack-display-controller')||'unbound';
const channel=new BroadcastChannel('big-hack-stage-v2:'+controller);
const $=id=>document.getElementById(id),frame=$('venueFrame');
const dimensions=OUTPUTS[surface]||{width:4608,height:2096};
frame.style.width=dimensions.width+'px';frame.style.height=dimensions.height+'px';
document.body.classList.add(surface);document.body.classList.toggle('preview',preview);
document.body.classList.toggle('guides',params.has('guides'));
$('upper').hidden=surface==='wall';$('wall').hidden=surface==='upper';
document.title='The Big Hack · '+(OUTPUTS[surface]?.label||'Whole set');
const previewStatus=$('previewStatus');
$('presenterLink').hidden=false;
previewStatus.hidden=surface!=='overview'&&!preview;
function resize(){frame.style.transform=`scale(${Math.min(innerWidth/dimensions.width,innerHeight/dimensions.height)})`;}
addEventListener('resize',resize);resize();
let current=null,lastHeartbeat=0,setKey='';
const ports=[{id:'upperContent',which:'upper'},{id:'wallLeft',which:'left'},{id:'wallRight',which:'right'}]
  .filter(p=>surface==='overview'||(surface==='upper')===(p.which==='upper'));
for(const port of ports){
  const child=$(port.id);
  child.src='display.html?embedded=1&preview=1&controller='+encodeURIComponent(controller);
  child.onload=()=>{if(current)renderPort(port,current);};
}
// Module imports fetch the action library asynchronously; iframe load alone is
// not proof that its renderer is ready (especially for paused/render-only cues).
addEventListener('message',event=>{
  if(event.origin!==location.origin||event.data?.type!=='display-ready'||!current)return;
  const port=ports.find(p=>$(p.id).contentWindow===event.source);
  if(port)renderPort(port,current);
});
function renderPort(port,s){
  const c=venueCue(s.cue,s),plan=venuePlan(c),slot=port.which==='upper'?plan.upper:plan.wall[port.which];
  const child=$(port.id);child.hidden=slot.type==='blank';
  const display=child.contentWindow?.displayState;if(!display)return;
  const side=slot.side||'left';
  const override=slot.type==='source'||slot.type==='film'||slot.type==='performance'?s.override:{};
  display.receive({...s,cue:routedCue(c,slot),projectionSide:side,override,
    screenElapsed:{...s.screenElapsed},showCounter:false,surface:port.which==='upper'?'upper':'wall'});
  child.dataset.cue=s.cue.id;
  ready();
}
function ready(){
  if(!current)return;
  const rendered=ports.every(p=>$(p.id).dataset.cue===current.cue.id);
  const videos=[...setVideos,...ports.flatMap(p=>Array.from($(p.id).contentDocument?.querySelectorAll('video[src]')||[]))];
  frame.dataset.ready=String(rendered&&videos.every(v=>!v.getAttribute('src')||v.readyState>=2&&!v.seeking));
}
const setVideos=[$('leftSet'),$('rightSet')];
function setPath(variant,side){return 'assets/sets/v2/'+variant+(['liam-with','liam-without','brendan-night','brendan-dawn'].includes(variant)?'-cans':'')+'-'+side+'.mp4';}
function renderSet(s){
  const c=s.cue,p=venuePlan(c);$('wall').dataset.look=p.look;
  let variant=c.staging?.set;
  if(p.look==='dark'||p.look==='work'||p.look==='loom')variant=null;
  if(p.look==='swarm')variant=c.scene==='s20'?'brendan-night':'liam-stars';
  // Responder inserts keep the surrounding location, not another copy of their film.
  if(c.montage&&c.scene==='s20')variant='brendan-night';
  if(c.montage&&['s20b','s22'].includes(c.scene))variant='liam-ready';
  if(c.montage&&c.scene==='s23')variant='court';
  if(c.montage&&c.scene==='s23b')variant=null;
  const nextKey=variant||'';
  if(nextKey!==setKey){setKey=nextKey;setVideos.forEach((v,i)=>{
    if(!variant){v.pause();v.removeAttribute('src');v.load();return;}
    v.src=setPath(variant,i?'right':'left');v.load();
    v.onloadedmetadata=()=>syncSet(current);v.onloadeddata=ready;v.onseeked=ready;
  });}
  for(const video of setVideos){video.hidden=!variant;video.style.opacity=isSwarm(c)?'.22':c.montage?'.4':'1';}
  syncSet(s);
}
function syncSet(s){if(!s)return;for(const v of setVideos)if(v.getAttribute('src')){if(s.running&&!s.blackout)v.play().catch(()=>{});else v.pause();}}
function receive(s){current=s;previewStatus.hidden=true;frame.dataset.cue=s.cue.id;frame.dataset.playback=s.running?'playing':'paused';lastHeartbeat=Date.now();$('black').style.display=s.blackout?'block':'none';if(surface!=='upper')renderSet(s);for(const port of ports)renderPort(port,s);ready();}
function freeze(){if(!current)return;current={...current,running:false};receive(current);if(surface==='overview'){
  previewStatus.querySelector('h1').textContent='The presenter has disconnected';
  previewStatus.querySelector('p').textContent='Open the presenter, then reopen View whole set from its display settings.';
  previewStatus.hidden=false;
}}
channel.onmessage=({data})=>{if(data.type==='state')receive(data.state);if(data.type==='controller-closed'&&data.controller===controller)freeze();};
setInterval(()=>{
  if(params.has('cue'))return;
  channel.postMessage({type:'heartbeat',side:surface,preview});
  if(!current)channel.postMessage({type:'hello'});
  if(lastHeartbeat&&Date.now()-lastHeartbeat>3500)freeze();
},1000);
for(const v of setVideos)v.onerror=()=>channel.postMessage({type:'media-error',side:surface,path:v.getAttribute('src')});
$('fullscreen').onclick=()=>document.documentElement.requestFullscreen();
addEventListener('fullscreenchange',()=>document.body.classList.toggle('fullscreen',!!document.fullscreenElement));
addEventListener('keydown',e=>{if(preview||e.metaKey||e.ctrlKey||e.altKey)return;const action=({ArrowRight:'go',PageDown:'go',ArrowLeft:'back',PageUp:'back',' ':'pause',b:'blackout',B:'blackout',r:'replay',R:'replay'})[e.key];if(action){e.preventDefault();channel.postMessage({type:'control',action});}});
if(params.has('cue')){
  channel.close();const show=await fetch('show.json',{cache:'no-store'}).then(r=>r.json());
  const cue=show.cues.find(c=>c.id===params.get('cue'));
  if(cue)receive({cue,serial:1,override:{},running:false,elapsed:Number(params.get('t')||0),audioTime:Number(params.get('t')||0),audioDuration:cue.audioDuration||0,sentAt:Date.now(),blackout:false});
}else channel.postMessage({type:'hello'});
