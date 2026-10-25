// A staged view of the two agents already described by s11c_l39, not new dialogue.
export function venueGraphic(c){
  if(c.venueGraphic!=='agents')return '';
  return `<section class="venueAgents" data-venue-agents data-duration="${Number(c.audioDuration)||29}"><header><b>Cursor</b><span>Kristina · parallel agents</span></header><div class="venueAgentColumns"><article><small>AGENT 1 · JIRA</small><h1>SJ’s velocity</h1><p>Last two sprints</p><div class="venueAgentProgress"></div><strong data-agent-status>Checking Jira…</strong><div class="venueAgentResult" hidden><h2>Lowest ticket count on the team</h2><p>Report ready</p></div></article><article><small>AGENT 2 · CONNECTOR</small><h1>Linear → Jira</h1><p>Brendan’s Linear tickets</p><div class="venueAgentProgress"></div><strong data-agent-status>Building and testing…</strong><div class="venueAgentResult" hidden><h2>Test ticket copied to Jira</h2><p>Connector ready for review</p></div></article></div><footer>Two agents running independently</footer></section>`;
}
export function drawVenueGraphic(root,seconds){
  const graphic=root.querySelector('[data-venue-agents]');if(!graphic)return;
  const complete=seconds>=Number(graphic.dataset.duration)*.57;
  for(const result of graphic.querySelectorAll('.venueAgentResult'))result.hidden=!complete;
  for(const status of graphic.querySelectorAll('[data-agent-status]'))status.textContent=complete?'✓ Complete':status.closest('article').querySelector('small').textContent.includes('JIRA')?'Checking Jira…':'Building and testing…';
  graphic.querySelector('footer').textContent=complete?'Both agents finished · awaiting review':'Two agents running independently';
  graphic.classList.toggle('complete',complete);
}
