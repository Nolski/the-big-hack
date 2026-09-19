import {redditMemes as sourcedMemes} from './reddit-memes.js';

// A modest pace increase, keeping longer reading holds for denser memes.
const redditPace=1.1;
export const redditMemes=sourcedMemes.map(m=>({...m,hold:m.hold/redditPace}));
export const redditPostHeight=920, redditScrollSeconds=.85/redditPace;
export const redditCycleSeconds=redditMemes.reduce((sum,m)=>sum+m.hold+redditScrollSeconds,0);
export const redditTimeline=redditMemes.map((m,i)=>({id:m.id,start:redditMemes.slice(0,i).reduce((sum,p)=>sum+p.hold+redditScrollSeconds,0),hold:m.hold}));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// A duplicate opening post below the last one makes the reset visually continuous.
const percent=t=>(t/redditCycleSeconds*100).toFixed(6);
const keyframes=redditTimeline.map((t,i)=>`${percent(t.start)}%,${percent(t.start+t.hold)}%{transform:translateY(calc(-${i} * var(--reddit-post-height,${redditPostHeight}px)))}`).join('')+`100%{transform:translateY(calc(-${redditMemes.length} * var(--reddit-post-height,${redditPostHeight}px)))}`;

export function redditBody(cue){
 const post=(m,duplicate=false)=>`<section class="reddit-post" data-meme-id="${m.id}" ${duplicate?'aria-hidden="true" data-loop-copy="true"':''}>
  <div class="reddit-votes" aria-hidden="true">↑<br>↓</div>
  <div class="reddit-meta">${m.postedBy?`r/ProgrammerHumor · u/${esc(m.postedBy)}`:`Found on ${esc(m.source)}`}</div>
  <h2>${esc(m.title)}</h2>
  <div class="reddit-image"><img src="${esc(m.src)}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" loading="eager" decoding="sync"></div>
  <div class="reddit-actions"><span>◯ Comment &nbsp;&nbsp; ↗ Share &nbsp;&nbsp; ▱ Save</span><a href="${esc(m.sourceUrl)}" target="_blank" rel="noopener noreferrer" ${duplicate?'tabindex="-1"':''}>Source · ${esc(m.source)}</a></div>
 </section>`;
 return `<style>@keyframes cold-open-feed{${keyframes}}</style><div class="reddit"><div class="reddit-top"><b>reddit</b><div>Search r/ProgrammerHumor</div><span>r/ProgrammerHumor</span></div><div class="reddit-viewport"><div class="reddit-feed ${cue.state==='reddit-still'?'scroll-still':'scrolling'}" style="--reddit-cycle:${redditCycleSeconds}s">${redditMemes.map(m=>post(m)).join('')}${post(redditMemes[0],true)}</div></div></div>`;
}
