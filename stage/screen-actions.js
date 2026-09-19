import {redditBody} from './reddit.js?v=pace-20260918';
// Deterministic screen performances: one pass, then hold. The console owns the clock.
const {actions}=await fetch('screen-actions.json',{cache:'no-store'}).then(r=>r.json());
const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export {actions};
export function sampleAction(action,seconds=0){
 const out={text:action.initial||'',sent:'',answer:'',submitted:false,selected:false,phase:'hold',done:false};
 let time=Math.max(0,seconds);
 for(const step of action.steps){
  const duration=step.seconds||0,progress=duration?Math.min(1,time/duration):1;
  out.phase=step.op;
  if(step.op==='type')out.text+=step.text.slice(0,Math.floor(step.text.length*progress));
  if(step.op==='delete'){
   const keep=step.to||'';
   if(!out.text.startsWith(keep))throw Error('Deletion must retain the preceding text');
   out.text=out.text.slice(0,keep.length+Math.ceil((out.text.length-keep.length)*(1-progress)));
   out.selected=false;
  }
  if(step.op==='select')out.selected=true;
  if(step.op==='submit'&&progress===1){out.submitted=true;out.sent=out.text;if(action.view!=='feedback')out.text='';}
  if(step.op==='answer')out.answer=step.text.slice(0,Math.floor(step.text.length*progress));
  if(time<duration)return out;
  time-=duration;
 }
 out.done=true;out.phase='hold';return out;
}
export const actionDuration=id=>actions[id]?.steps.reduce((sum,s)=>sum+(s.seconds||0),0)||0;
export function screenLabel(c,side){
 const descriptor=c.computers?.[side];if(!descriptor)return '';
 const [owner,device='computer']=descriptor.split('|');
 return `${owner}’s ${device}`;
}
const input=()=>'<span class="typedText"></span><span class="inputCaret">▏</span>';
const messageHead=title=>`<div class="actionAppBar"><b>Slack</b><span>${escape(title)}</span><small>Draft</small></div>`;
export function renderScreenAction(c,side){
 if(c.claudeSession&&side==='right'){
  const child={...c,claudeSession:null};
  const worker=renderScreenAction({...child,screenActions:{right:'signup-background'}},'right').replace('data-screen-action=',`data-worker-clock="true" data-worker-complete="${!!c.claudeComplete}" data-screen-action=`);
  const proof=c.claudeComplete?`<div class="reproProof"><b>✓ Reproduced locally · patch ready</b><p>getOrCreateSession runs before the user ID is committed.</p><code>repro/concurrent_signup.py</code><div class="proofBrowsers"><div>Browser A · Alice<hr>Welcome, Bob<br><small>bob@example.test</small></div><div>Browser B · Bob<hr>Welcome, Bob<br><small>bob@example.test</small></div></div><p>✓ Reproduction fails before fix<br>✓ Tests pass after fix</p></div>`:'';
  return `<div class="investigationSplit"><section class="investigationPane">${worker}${proof}${c.claudeComplete?'':'<div class="workerRuntime">Working…</div>'}</section><section class="investigationPane">${renderScreenAction(child,side)||''}</section></div>`;
 }
 const id=c.screenActions?.[side],a=actions[id];if(!a)return null;
 let body='';
 if(a.view==='chatgpt')body=`<div class="chatHeader"><b>ChatGPT</b><span>New chat</span><small>Temporary</small></div>${a.context?`<div class="backgroundTask">${escape(a.context)}</div>`:''}<div class="chatConversation"><div class="chatWelcome">What can I help with?</div><div class="sentBubble" hidden></div><div class="chatAnswer" hidden><b>ChatGPT</b><div class="answerText"></div></div></div><div class="chatComposer">${input()}<span class="sendArrow">↑</span></div>`;
 if(a.view==='agent')body=`<div class="actionAppBar"><b>${escape(a.title)}</b><span>${escape(a.context)}</span></div><div class="agentConversation"><div class="sentBubble" hidden></div><pre class="answerText"></pre></div><div class="agentComposer">${input()}<span class="sendArrow">↵</span></div>`;
 if(a.view==='terminal')body=`<div class="actionAppBar"><b>Terminal</b><span>${escape(a.title)}</span></div><div class="actionTerminal"><div class="executedCommand" hidden></div><pre class="answerText"></pre><div class="terminalInput"><span class="prompt">$ </span>${input()}</div></div>`;
 if(a.view==='editor')body=`<div class="desktopSplit"><section class="desktopWindow codeWindow"><div class="actionAppBar"><b>Editor</b><span>billing/webhooks.rb</span></div><pre class="patchCode">${input()}</pre><div class="patchStatus"></div></section><section class="desktopWindow slackWindow">${messageHead('Kristina')}<div class="splitSlackHistory">Direct message · Kristina</div><div class="messageComposer"><div class="composeTitle">Message Kristina</div><div class="messageInput"><span class="quietCaret">▏</span></div><div class="composeFooter">Draft empty · not sent</div></div></section></div>`;
 if(a.view==='message'&&a.reference)body=`<div class="desktopSplit"><section class="desktopWindow policyWindow"><div class="actionAppBar"><b>Documents</b><span>Security policy</span></div><article class="policyReference"><small>${escape(a.context)}</small><blockquote>${escape(a.reference)}</blockquote><p>${escape(a.secondary)}</p></article></section><section class="desktopWindow slackWindow">${messageHead(a.title)}<div class="splitSlackHistory">Direct message · ${escape(a.recipient||'Kristina')}</div><div class="messageComposer"><div class="composeTitle">Message ${escape(a.recipient||'Kristina')}</div><div class="messageInput">${input()}</div><div class="composeFooter">Draft · not sent</div></div></section></div>`;
 else if(a.view==='message')body=`<div class="slackDesktop"><aside class="slackSidebar"><b>Malus</b><div>Threads</div><div>Drafts <small>1</small></div><div class="slackSection">Channels</div><div># general</div><div># engineering</div><div class="slackSection">Direct messages</div><div class="activeDM"><span class="slackAvatar">${escape((a.recipient||'K')[0])}</span>${escape(a.recipient||'Kristina')} <small>●</small></div></aside><main class="slackDM"><header class="slackDMHeader"><span class="slackAvatar">${escape((a.recipient||'K')[0])}</span><div><b>${escape(a.recipient||'Kristina')}</b><small>Direct message</small></div><span class="slackHeaderTools">⌕ &nbsp; ⋮</span></header><div class="slackHistory"><div class="slackDMIntro"><span class="slackAvatar">${escape((a.recipient||'K')[0])}</span><h2>${escape(a.recipient||'Kristina')}</h2><p>This conversation is just between you and ${escape(a.recipient||'Kristina')}.</p></div><div class="sentBubble" hidden></div></div><div class="messageComposer"><div class="slackFormat">B &nbsp; <i>I</i> &nbsp; S &nbsp; │ &nbsp; ≡ &nbsp; ↗ &nbsp; &lt;/&gt;</div><div class="messageInput">${input()}</div><div class="composeFooter"><span>＋ &nbsp; ☺ &nbsp; @ &nbsp; Aa</span><span class="sendButton">➤</span></div></div><div class="slackDraftStatus">Draft · not sent</div></main></div>`;
 if(a.view==='local'){
  const code=`<section class="desktopWindow localWindow"><div class="actionAppBar"><b>${escape(a.title)}</b></div><div class="localMeta">${escape(a.context)}</div><pre class="slowCode">${input()}</pre></section>`;
  body=a.reddit?`<div class="desktopSplit localSplit">${code}<section class="desktopWindow redditWindow"><div class="miniReddit">${redditBody({state:'reddit'})}</div></section></div>`:code;
 }
 if(a.view==='promotion')body=messageHead('# general')+'<div class="promotionThread"><div class="threadAvatar">K</div><article><b>Kristina <small>5 days ago</small></b><p>Huge congrats to Brendan on the step up!</p><span class="reactionCount">🎉 41</span><div class="threadReply"><b>Marcus</b><p>congrats!! 🎉</p></div></article></div><div class="messageComposer"><div class="composeTitle">Reply to thread</div><div class="messageInput">'+input()+'</div><div class="composeFooter"><span>Aa &nbsp; ☺ &nbsp; ＋</span><span class="sendButton">➤</span></div></div>';
 if(a.view==='feedback')body=`<div class="actionAppBar"><b>H2 Peer Input</b><span>Private response</span></div><div class="feedbackForm"><small>PEER FEEDBACK / LIAM</small><h1>Is there anyone whose work made it harder for you to deliver this half?</h1><p class="optionalField">Optional</p><div class="feedbackInput">${input()}</div><div class="feedbackSubmit">Submit</div><p class="feedbackThanks" hidden>Thanks your feedback has been recorded.</p></div>`;
 if(a.view==='phone')body=`<div class="phoneMessages"><header><span>‹ Messages</span><b>Liam</b><span>◉</span></header><div class="receivedTime">Today · 06:02</div><div class="incomingMessage">${escape(a.incoming)}</div><div class="phoneDraft"><div>${input()}</div><span class="sendArrow">↑</span></div><div class="phoneKeyboard"><div>q&nbsp; w&nbsp; e&nbsp; r&nbsp; t&nbsp; y&nbsp; u&nbsp; i&nbsp; o&nbsp; p</div><div>a&nbsp; s&nbsp; d&nbsp; f&nbsp; g&nbsp; h&nbsp; j&nbsp; k&nbsp; l</div><div>⇧&nbsp; z&nbsp; x&nbsp; c&nbsp; v&nbsp; b&nbsp; n&nbsp; m&nbsp; <span class="backspaceKey">⌫</span></div><div class="spaceKey">space</div></div></div>`;
 return `<section class="screenAction action-${escape(a.view)}" data-screen-action="${escape(id)}">${body}</section>`;
}
export function drawScreenAction(root,seconds,workerSeconds=seconds){
 const runtime=root.querySelector('.workerRuntime');if(runtime)runtime.textContent=`Working · ${Math.floor(workerSeconds)}s · running local reproduction tests`;
 for(const el of root.querySelectorAll('[data-screen-action]')) drawAction(el,el.dataset.workerClock ? (el.dataset.workerComplete==='true'?10000:workerSeconds) : seconds);
}
function drawAction(el,seconds){

 const a=actions[el.dataset.screenAction],s=sampleAction(a,seconds);
 const set=(selector,text)=>{const n=el.querySelector(selector);if(n&&n.textContent!==text)n.textContent=text;};
 set('.typedText',s.text);set('.answerText',s.answer);set('.sentBubble',s.sent);
 set('.executedCommand',s.submitted?'$ '+s.sent:'');
 for(const selector of ['.sentBubble','.executedCommand','.chatAnswer']){const n=el.querySelector(selector);if(n)n.hidden=!s.submitted;}
 const welcome=el.querySelector('.chatWelcome');if(welcome)welcome.hidden=s.submitted;
 const composer=el.querySelector('.chatComposer,.agentComposer');if(composer)composer.classList.toggle('sent',s.submitted&&!s.text);
 const thanks=el.querySelector('.feedbackThanks');if(thanks)thanks.hidden=!s.submitted;
 const submit=el.querySelector('.feedbackSubmit');if(submit)submit.textContent=s.submitted?'Submitted ✓':'Submit';
 if(a.view==='message')set('.actionAppBar small',s.submitted?'Sent':'Draft');
 set('.patchStatus',s.done?'No local changes.':'Local patch · not shared');
 el.classList.toggle('erasing',s.phase==='delete');el.classList.toggle('selection',s.selected);el.classList.toggle('submitted',s.submitted);el.dataset.phase=s.phase;el.dataset.done=String(s.done);
 const inputBox=el.querySelector('.feedbackInput,.patchCode');if(inputBox)inputBox.scrollTop=inputBox.scrollHeight;
}
