// Physical outputs are separate from the two authored computer/action tracks.
// Keep cue IDs and those tracks stable: they also own the animation clocks.
export const OUTPUTS = {
  upper: {width:1920, height:1080, label:'Upper screen'},
  wall: {width:4608, height:896, label:'LED wall'},
};
export const WALL_ZONES = [
  {id:'left', x:0, width:2048},
  {id:'centre', x:2048, width:512},
  {id:'right', x:2560, width:2048},
];

// One deliberate staging treatment per scene. No dialogue lives here.
export const SCENE_STAGING = {
  s00: {look:'dark', note:'Opening film above; the wall stays dark.'},
  s01: {look:'work', note:'Standup above; private browser activity and the shared PR on the two LED wings.'},
  s01c: {look:'work', note:'Huddle above; SJ’s PR and Brendan’s plan remain visible together below.'},
  s01b: {look:'work', note:'The demonstration fills the upper screen; the lower wings retain the two desktops.'},
  s06: {look:'work', note:'Standup becomes a huddle; the code and Brendan’s parallel investigation stay separate below.'},
  s11b: {look:'work', note:'The call stays above; slow local work and quick cloud work sit on opposing wings.'},
  s11c: {look:'work', note:'One-on-one above, then Kristina’s agents; Brendan’s board remains below.'},
  s14: {look:'work', note:'Dana above; SJ’s inbox and calendar below, with no early layoff ranking reveal.'},
  s19: {look:'apartment', note:'Apartment wings frame the actors; Marcus appears above only while his call is connected.'},
  s20: {look:'studio', note:'The borrowed Mac and worm explanation move above; the wall becomes the spread around Brendan.'},
  s20b: {look:'apartment', note:'The returned Mac sits in SJ’s apartment; the news montage runs above.'},
  s22: {look:'apartment', note:'Marcus, then the police, occupy the upper screen once; the apartment remains across the wall.'},
  s23: {look:'court', note:'Courtroom films above; exhibits on the left LED wing, clear of the centre join.'},
  s23b: {look:'candles', note:'A powerless apartment and radio below; films and interviews above; the stars remain in the room.'},
  s25: {look:'loom', note:'A quiet weaving workshop below; the final title appears above.'},
};

const source = side => ({type:'source', side});
const blank = () => ({type:'blank'});
const call = () => ({type:'call', side:'right'});
const panels = () => ({left:source('left'), right:source('right')});
const evidence = new Set(['counts','audit-log','peer-summary','court-calendar']);
export const isSwarm = c => c.scene==='s20' && c.beat>=43 && c.beat<=60 || c.state==='swarm-after';

export function venueCue(c,state){
  if(!c.returnToSet)return c;
  const duration=c.montageDuration||state.audioDuration||c.audioDuration||0;
  const time=c.montage?state.elapsed:state.audioTime||0;
  if(duration>0&&time>=duration-.08){
    const room={...c,apartmentOnly:true};delete room.montage;delete room.performanceVideo;return room;
  }
  return c;
}

export function venuePlan(c) {
  const profile=SCENE_STAGING[c.scene]||{look:c.mode==='court'?'court':c.mode==='apartment'?'apartment':'work',note:'New scene: review the inherited venue staging.'};
  const p={look:profile.look, note:profile.note, upper:blank(), wall:{left:blank(),right:blank()}, centre:'scenery'};
  // Films are 16:9 performances, never stretched over the LED wall or duplicated.
  if(c.montage){
    p.upper={type:'film',side:'right'};
    if(['s00','s01b','s06','s11c'].includes(c.scene))p.look='dark';
    return p;
  }
  if(c.state==='title-card'){p.look='dark';p.upper=source('left');return p;}
  if(c.scene==='s25'){if(c.beat===1)p.look='dark';return p;}
  if(c.offstage)return {...p,look:'dark'};
  if(['s23b_sj_accusation','s23b_brendan_denial','s23b_kristina_startup','s24_l31'].includes(c.id))return {...p,look:'dark'};
  if(profile.look==='work'){
    p.wall=panels();
    p.upper=c.staging?.callCast?.length?call():source('left');
    if(c.scene==='s01'){
      if(c.sharedPR){p.upper={type:'shared-pr',side:'left'};p.wall.right={type:'call',side:'right',owner:'SJ'};}
      else p.wall.right={type:'desktop',side:'right'};
    }
    if(c.scene==='s01b' && !['huddle','pr-alone'].includes(c.state)){
      p.upper=source('left');p.wall.left={type:'desktop',side:'left'};
    }
    if(c.scene==='s06' && c.beat>=26)p.upper=c.claudeSession?source('right'):call();
    if(c.scene==='s11c' && c.staging?.callStatus!=='connected')p.upper=source('left');
    if(c.id==='s11c_l39'){
      p.upper={type:'agents',side:'left'};p.wall.left={type:'desktop',side:'left'};
    }
    if(c.scene==='s14'){
      p.wall.right={type:'desktop',side:'left'};
      if(c.state==='email-archive'||c.state==='rehire')p.upper=source('left');
      else p.upper=call();
    }
    return p;
  }
  if(c.scene==='s19'){
    p.upper=c.staging?.callCast?.length?call():blank();
  } else if(c.scene==='s20'){
    p.upper=source('left');
    if(isSwarm(c)){p.look='swarm';p.wall.right=source('right');}
  } else if(c.scene==='s20b'){
    if(c.id==='s20b_l47')p.upper={type:'returned-mac',side:'left'};
    else if(c.beat>=48)p.upper=source('left');
  } else if(c.scene==='s22'){
    if(c.performanceVideo?.physical)p.upper={type:'performance',side:'right'};
    else if(!c.apartmentOnly&&!c.staging?.officersPresent&&c.staging?.callCast?.length)p.upper=call();
    if(c.state==='black')p.upper=blank();
  } else if(c.scene==='s23'){
    if(evidence.has(c.state))p.wall.left=source('left');
    if(c.performanceVideo?.physical)p.upper={type:'performance',side:'right'};
    else if(evidence.has(c.state))p.upper=source('left');
  } else if(c.scene==='s23b'){
    if(isSwarm(c)){p.look='swarm';p.upper=source('left');p.wall.right=source('right');}
    else if(c.state==='stars')p.look='stars';
    else if(c.staging?.radioConnected)p.wall.left=source('left');
  }
  return p;
}

// The legacy renderer remains a 1920×1080 canvas. Only its content is routed;
// its physical set footage and old two-screen assumptions never reach the wall.
export function routedCue(c,slot){
  if(slot.type==='blank')return {...c,scene:'venue-black',state:'black',offstage:true,
    sharedPR:false,primeWallpaper:false,revisionCode:false,rehireNo:false,latestScreen:null,
    venueDesktop:false,montage:null,performanceVideo:null};
  if(slot.type==='film'||slot.type==='performance')return c;
  if(slot.type==='source')return {...c,staging:{...c.staging,set:null}};
  if(slot.type==='returned-mac')return {...c,primeWallpaper:true,computers:{left:'SJ'},staging:{...c.staging,set:null}};
  if(slot.type==='agents')return {...c,venueGraphic:'agents',staging:{...c.staging,set:null}};
  const clean={...c,scene:'venue-call',state:'huddle',offstage:false,montage:null,performanceVideo:null,
    sharedPR:false,primeWallpaper:false,revisionCode:false,rehireNo:false,latestScreen:null,
    computers:{},screenActions:{},claudeSession:null,staging:{...c.staging,set:null,view:'call'}};
  if(slot.type==='call'){
    clean.staging.callCast=c.scene==='s19'||c.scene==='s22'?['marcus']:c.staging?.callCast||[];
    if(c.scene==='s19'||c.scene==='s22')clean.speaker=c.speaker==='marcus'?'marcus':'';
  }
  if(slot.owner)clean.computers={right:slot.owner};
  if(slot.type==='shared-pr'){clean.scene='venue-pr';clean.state='pr';}
  if(slot.type==='desktop'){
    clean.scene='venue-desktop';clean.staging.callCast=[];clean.staging.callStatus='none';
    clean.venueDesktop=true;
    const owner=c.computers?.[slot.side]||c.computers?.left||'SJ';
    clean.computers={left:owner,right:owner};
  }
  return clean;
}
