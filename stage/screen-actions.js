// Deterministic screen performances: one pass, then hold. The console owns the clock.
const {actions}=await fetch('screen-actions.json').then(r=>r.json());
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
 const id=c.screenActions?.[side],a=actions[id];if(!a)return null;
 let body='';
 if(a.view==='chatgpt')body=`<div class="chatHeader"><b>ChatGPT</b><span>New chat</span><small>Temporary</small></div>${a.context?`<div class="backgroundTask">${escape(a.context)}</div>`:''}<div class="chatConversation"><div class="chatWelcome">What can I help with?</div><div class="sentBubble" hidden></div><div class="chatAnswer" hidden><b>ChatGPT</b><div class="answerText"></div></div></div><div class="chatComposer">${input()}<span class="sendArrow">↑</span></div>`;
 if(a.view==='agent')body=`<div class="actionAppBar"><b>${escape(a.title)}</b><span>${escape(a.context)}</span></div><div class="agentConversation"><div class="sentBubble" hidden></div><pre class="answerText"></pre></div><div class="agentComposer">${input()}<span class="sendArrow">↵</span></div>`;
 if(a.view==='terminal')body=`<div class="actionAppBar"><b>Terminal</b><span>${escape(a.title)}</span></div><div class="actionTerminal"><div class="executedCommand" hidden></div><pre class="answerText"></pre><div class="terminalInput"><span class="prompt">$ </span>${input()}</div></div>`;
 if(a.view==='editor')body=`<div class="actionAppBar"><b>Editor</b><span>${escape(a.title)}</span></div><div class="editorTabs">billing/webhooks.rb <span>LOCAL CHANGES</span></div><pre class="patchCode">${input()}</pre><div class="patchStatus"></div><div class="emptyMessage"><b>Draft to Kristina</b><span>${escape(a.context)}</span><div class="emptyMessageBox">▏</div></div>`;
 if(a.view==='message')body=messageHead(a.title)+`<div class="sentBubble" hidden style="margin:24px 50px;padding:24px;background:#e8e8e8;border-radius:12px;color:#222;font-size:32px"></div><div class="policyReference" style="${a.reference?'':'display:none'}"><small>${escape(a.context)}</small><blockquote>${escape(a.reference)}</blockquote><p>${escape(a.secondary)}</p></div><div class="messageComposer"><div class="composeTitle">Message ${escape(a.recipient||'Kristina')}</div><div class="messageInput">${input()}</div><div class="composeFooter"><span>Aa &nbsp; ☺ &nbsp; ＋</span><span class="sendButton">➤</span></div></div>`;
 if(a.view==='promotion')body=messageHead('# general')+'<div class="promotionThread"><div class="threadAvatar">K</div><article><b>Kristina <small>5 days ago</small></b><p>Huge congrats to Brendan on the step up!</p><span class="reactionCount">🎉 41</span><div class="threadReply"><b>Marcus</b><p>congrats!! 🎉</p></div></article></div><div class="messageComposer"><div class="composeTitle">Reply to thread</div><div class="messageInput">'+input()+'</div><div class="composeFooter"><span>Aa &nbsp; ☺ &nbsp; ＋</span><span class="sendButton">➤</span></div></div>';
 if(a.view==='feedback')body=`<div class="actionAppBar"><b>H2 Peer Input</b><span>Private response</span></div><div class="feedbackForm"><small>PEER FEEDBACK / LIAM</small><h1>Is there anyone whose work made it harder for you to deliver this half?</h1><p class="optionalField">Optional</p><div class="feedbackInput">${input()}</div><div class="feedbackSubmit">Submit</div><p class="feedbackThanks" hidden>Thanks your feedback has been recorded.</p></div>`;
 if(a.view==='phone')body=`<div class="phoneMessages"><header><span>‹ Messages</span><b>Liam</b><span>◉</span></header><div class="receivedTime">Today · 06:02</div><div class="incomingMessage">${escape(a.incoming)}</div><div class="phoneDraft"><div>${input()}</div><span class="sendArrow">↑</span></div><div class="phoneKeyboard"><div>q&nbsp; w&nbsp; e&nbsp; r&nbsp; t&nbsp; y&nbsp; u&nbsp; i&nbsp; o&nbsp; p</div><div>a&nbsp; s&nbsp; d&nbsp; f&nbsp; g&nbsp; h&nbsp; j&nbsp; k&nbsp; l</div><div>⇧&nbsp; z&nbsp; x&nbsp; c&nbsp; v&nbsp; b&nbsp; n&nbsp; m&nbsp; <span class="backspaceKey">⌫</span></div><div class="spaceKey">space</div></div></div>`;
 return `<section class="screenAction action-${escape(a.view)}" data-screen-action="${escape(id)}">${body}</section>`;
}
export function drawScreenAction(root,seconds){
 const el=root.querySelector('[data-screen-action]');if(!el)return;
 const a=actions[el.dataset.screenAction],s=sampleAction(a,seconds);
 const set=(selector,text)=>{const n=el.querySelector(selector);if(n&&n.textContent!==text)n.textContent=text;};
 set('.typedText',s.text);set('.answerText',s.answer);set('.sentBubble',s.sent);
 set('.executedCommand',s.submitted?'$ '+s.sent:'');
 for(const selector of ['.sentBubble','.executedCommand','.chatAnswer']){const n=el.querySelector(selector);if(n)n.hidden=!s.submitted;}
 const welcome=el.querySelector('.chatWelcome');if(welcome)welcome.hidden=s.submitted;
 const composer=el.querySelector('.chatComposer,.agentComposer');if(composer)composer.classList.toggle('sent',s.submitted);
 const thanks=el.querySelector('.feedbackThanks');if(thanks)thanks.hidden=!s.submitted;
 const submit=el.querySelector('.feedbackSubmit');if(submit)submit.textContent=s.submitted?'Submitted ✓':'Submit';
 if(a.view==='message')set('.actionAppBar small',s.submitted?'Sent':'Draft');
 set('.patchStatus',s.done?'No local changes.':'Local patch · not shared');
 el.classList.toggle('erasing',s.phase==='delete');el.classList.toggle('selection',s.selected);el.classList.toggle('submitted',s.submitted);el.dataset.phase=s.phase;el.dataset.done=String(s.done);
 const inputBox=el.querySelector('.feedbackInput,.patchCode');if(inputBox)inputBox.scrollTop=inputBox.scrollHeight;
}
