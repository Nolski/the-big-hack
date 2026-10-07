// Police inserts occupy the right screen only and return to the room on completion.
export function projectionCue(state,side){
 const c=state.cue;
 if(!c.returnToSet)return c;
 const duration=c.montageDuration||state.audioDuration||c.audioDuration||0;
 const time=c.montage?state.elapsed:(state.audioTime??0);
 const finished=duration>0&&time>=duration-.08;
 if(side==='left'||finished){
  const room={...c,apartmentOnly:true};
  delete room.montage;delete room.performanceVideo;
  return room;
 }
 return c;
}
