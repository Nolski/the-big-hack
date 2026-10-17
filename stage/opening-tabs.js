import {redditBody} from './reddit.js?v=pace-20260918';

// This is projected browser activity, driven by the console’s existing cue clock.
export function sampleOpeningTabs(action, seconds = 0) {
  const frames = action.frames;
  const time = Math.max(0, seconds);
  let current = frames[0], next = null;
  for (const frame of frames) {
    if (frame.at > time) { next = frame; break; }
    current = frame;
  }
  const fraction = next ? Math.min(1, (time - current.at) / (next.at - current.at)) : 0;
  const ease = fraction * fraction * (3 - 2 * fraction);
  const pointer = current.pointer.map((v, i) => v + ((next?.pointer[i] ?? v) - v) * ease);
  return {...current, pointer, click: !!current.click && time - current.at < .17,
    position: current.paused ? action.trackOffset + action.pauseAt
      : action.trackOffset + Math.max(0, time - (action.playAt || 0))};
}

const tabs = [
  ['reddit', 'r/ProgrammerHumor', 'reddit.com/r/ProgrammerHumor', 'r'],
  ['mail', 'Inbox (142)', 'mail.google.com/mail/u/0/#inbox', 'M'],
  ['policy', 'API authentication memo', 'docs.google.com/document/d/authentication-memo/edit', '▤'],
  ['github', 'Pull requests · malus/api', 'github.com/malus/api/pulls', '◉'],
  ['youtube', '80s Synthwave · Coding Mix', 'youtube.com/watch?v=80s-coding-mix', '▶'],
  ['calendar', 'Calendar', 'calendar.google.com/calendar/u/0/r', '24'],
  ['status', 'Build status', 'github.com/malus/api/actions', '✓'],
];
const clock = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function renderOpeningTabs(cue, action) {
  return `<div class="tabBrowser">
    <div class="browserTabs"><div class="windowDots"><i></i><i></i><i></i></div>${tabs.map(([id, title, , icon]) => `<div class="browserTab" data-tab="${id}"><span class="tabFavicon favicon-${id}">${icon}</span><span class="tabTitle">${title}</span>${id === 'youtube' ? '<span class="tabAudio" aria-label="Audio playing">◖))</span>' : ''}<span class="tabClose">×</span></div>`).join('')}<span class="newBrowserTab">＋</span></div>
    <div class="browserToolbar"><span>‹</span><span>›</span><span>↻</span><div class="browserAddress"><span>⌕</span><span class="addressText"></span><span>☆</span></div><span class="browserProfile">SJ</span><span>⋮</span></div>
    <div class="browserPage" data-page="reddit">${redditBody(cue)}</div>
    <div class="browserPage browserDocument" data-page="policy" hidden><div class="docToolbar"><b>▤</b><div><strong>API authentication memo</strong><p>File &nbsp; Edit &nbsp; View &nbsp; Insert &nbsp; Format &nbsp; Tools</p></div><span>Share</span></div><article><small>ENGINEERING / DESIGN NOTES</small><h1>API authentication</h1><h2>Token lifecycle</h2><p>Use short-lived credentials. Validate the signature at the service boundary.</p><h2>Rotation and revocation</h2><p>Long-lived keys remain valid until explicitly revoked. Every issued key needs a revocation path.</p><div class="documentLines"></div></article></div>
    <div class="browserPage browserGithub" data-page="github" hidden><header><b>◉</b><span>malus / api</span><small>Code &nbsp; Issues &nbsp; Pull requests &nbsp; Actions</small></header><main><h1>Pull requests</h1><div class="prSearch">is:pr is:open</div><section><b>◉ &nbsp; Refactor session cache</b><p>#841 opened yesterday · review requested</p></section><section><b>◉ &nbsp; Update partner integration tests</b><p>#839 opened 2 days ago · checks passing</p></section><section><b>◉ &nbsp; Retry webhook delivery</b><p>#835 opened 3 days ago · review requested</p></section></main></div>
    <div class="browserPage youtubePage" data-page="youtube" hidden><header><b><span class="youtubeLogo">▶</span> YouTube</b><div>Search <span>⌕</span></div><span class="browserProfile">SJ</span></header><div class="ytColumns"><main><div class="youtubePlayer"><img src="assets/music/fosdem-80s-cover.jpg" alt="Neon city with an old computer, the synthwave mix artwork"><div class="youtubeVideoTitle">80s Synthwave<br><small>CODING MIX</small></div><div class="youtubeControls"><div class="youtubeProgress"><i></i></div><span class="youtubePlayback" aria-label="Pause">Ⅱ</span><span>▸▏</span><span>◖))</span><span class="youtubeTime">0:00 / 3:17</span><span class="youtubeFullscreen">⛶</span></div></div><h1>80s Synthwave • Cyberpunk Coding Mix</h1><div class="youtubeChannel"><span class="channelAvatar">N</span><div><b>Neon Archive</b><small>18.4K subscribers</small></div><span class="youtubeSubscribe">Subscribe</span><span class="youtubeLikes">♧ 12K &nbsp; │ &nbsp; Share</span></div><div class="youtubeDescription"><b>486K views · 8 months ago</b><p>Synthwave for late nights, old computers, and one more commit.</p></div></main><aside><div class="youtubeRecommendation"><img src="assets/music/fosdem-80s-cover.jpg" alt=""><div><b>Night drive · Synthwave radio</b><small>Neon Archive<br>1.2M views</small></div></div><div class="youtubeRecommendation"><div class="ytTextThumb">AFTER<br>HOURS</div><div><b>Retro coding sessions</b><small>Night Circuit<br>204K views</small></div></div><div class="youtubeRecommendation"><div class="ytTextThumb">DEEP<br>FOCUS</div><div><b>Music for programming</b><small>Analog Room<br>82K views</small></div></div></aside></div></div>
    <svg class="browserPointer" width="38" height="48" viewBox="0 0 38 48" aria-hidden="true"><path d="M3 2 L3 35 L12 27 L20 44 L27 40 L19 24 L32 23 Z" fill="white" stroke="#151515" stroke-width="2.5"/></svg>
    <div class="browserClick" hidden></div>
  </div>`;
}

export function drawOpeningTabs(root, action, seconds) {
  const state = sampleOpeningTabs(action, seconds);
  for (const page of root.querySelectorAll('[data-page]')) page.hidden = page.dataset.page !== state.tab;
  for (const tab of root.querySelectorAll('[data-tab]')) tab.classList.toggle('activeTab', tab.dataset.tab === state.tab);
  root.querySelector('.addressText').textContent = tabs.find(t => t[0] === state.tab)[2];
  root.querySelector('.tabAudio').hidden = state.paused;
  const playback = root.querySelector('.youtubePlayback');
  playback.textContent = state.paused ? '▶' : 'Ⅱ';
  playback.setAttribute('aria-label', state.paused ? 'Play' : 'Pause');
  root.querySelector('.youtubeTime').textContent = `${clock(state.position)} / 3:17`;
  root.querySelector('.youtubeProgress i').style.width = `${Math.min(100, state.position / 197.2 * 100)}%`;
  root.querySelector('.browserPointer').style.transform = `translate(${state.pointer[0]}px,${state.pointer[1]}px)`;
  const click = root.querySelector('.browserClick');
  click.hidden = !state.click;
  click.style.transform = `translate(${state.pointer[0] - 15}px,${state.pointer[1] - 15}px)`;
  root.dataset.phase = state.tab;
  root.dataset.paused = String(state.paused);
}
