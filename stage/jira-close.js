// Automatic updates snap into place while the narrator describes the result.
export const JIRA_CLOSED_AT = .45;
export function jiraCloseState(seconds, complete = false) {
  const time = complete ? 20 : Math.max(0, seconds);
  const closed = time >= JIRA_CLOSED_AT;
  const linked = complete;
  return {confirmed: closed, primary: Number(closed),
    linked: Array(3).fill(Number(linked)), linkedNotice: linked};
}

export function renderJiraClose(action) {
  const card = (id, title, index) => `<article class="jiraMovingTicket ${index < 0 ? 'primaryTicket' : 'linkedTicket'}" data-ticket="${id}" style="top:${index < 0 ? 92 : 254 + index * 132}px"><small>${id}</small><strong>${title}</strong><span class="jiraTicketStatus">IN PROGRESS</span></article>`;
  return `<div class="jiraCloseApp" data-complete="${!!action.complete}">
    <header class="jiraCloseBar"><b>Jira</b><span>Projects / PROJ</span><span>Board</span></header>
    <div class="jiraCloseHeading"><small>PROJ / ACTIVE SPRINT</small><h1>Sprint board</h1></div>
    <aside class="jiraSlackReceipt"><b>Slack <span># engineering</span></b><p>Kristina <code>/jira done PROJ-412</code></p><div class="jiraCloseMessage">Closing PROJ-412…</div><small class="jiraLinkedNotice" hidden>…and 3 linked issues resolved.</small></aside>
    <div class="jiraCloseBoard"><div class="jiraCloseColumns"><section><h2>TO DO <small>1</small></h2><article class="jiraStaticTicket"><small>PROJ-415</small><strong>Update partner guide</strong></article></section><section><h2>IN PROGRESS <small class="jiraInProgressCount">4</small></h2></section><section><h2>DONE <small class="jiraDoneCount">0</small></h2></section></div>
      ${card('PROJ-412', 'Slack → Jira integration', -1)}
      ${card('PROJ-409', 'Review linked work', 0)}
      ${card('PROJ-410', 'API permissions', 1)}
      ${card('PROJ-411', 'Deployment checks', 2)}
    </div><footer class="jiraCloseFooter">PROJ board · Updated just now</footer>
  </div>`;
}

export function drawJiraClose(root, seconds) {
  const state = jiraCloseState(seconds, root.querySelector('.jiraCloseApp').dataset.complete === 'true');
  const moves = [state.primary, ...state.linked];
  root.querySelectorAll('.jiraMovingTicket').forEach((card, index) => {
    const p = moves[index];
    card.style.transform = `translateX(calc((100% + 76px) * ${p}))`;
    card.classList.toggle('ticketClosed', p === 1);
    card.querySelector('.jiraTicketStatus').textContent = p === 1 ? '✓ DONE' : 'IN PROGRESS';
  });
  const closed = moves.filter(p => p === 1).length;
  root.querySelector('.jiraInProgressCount').textContent = 4 - closed;
  root.querySelector('.jiraDoneCount').textContent = closed;
  root.querySelector('.jiraCloseMessage').textContent = state.confirmed ? '✓ PROJ-412 Closed.' : 'Closing PROJ-412…';
  root.querySelector('.jiraSlackReceipt').classList.toggle('confirmed', state.confirmed);
  root.querySelector('.jiraLinkedNotice').hidden = !state.linkedNotice;
  root.dataset.phase = state.primary === 1 ? 'done' : 'waiting';
}
