import {redditBody} from './reddit.js';
import {isWorm,wormMarkup} from './worm.js';
import {renderScreenAction} from './screen-actions.js';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={hr:'Dana',ceo:'CEO',kristina:'Kristina',kara:'Kara',liam:'Liam',brendan:'Brendan',marcus:'Marcus',prosecutor:'Prosecutor',judge:'Judge',counsel:'Counsel','officer one':'Officer One','officer two':'Officer Two'};
const portraits={kristina:'kristina',kara:'kara','officer one':'officer-one','officer two':'officer-two'};
const initials=id=>(names[id]||id||'').split(' ').map(x=>x[0]).join('').slice(0,2);
const shell=(app,title,body,light=false)=>`<section class="window ${light?'light':''}"><div class="windowbar"><i></i><i></i><i></i><span>${esc(app)}</span><em>${esc(title)}</em></div>${body}</section>`;
const tag=(text,kind='')=>`<span class="tag ${kind}">${esc(text)}</span>`;
const lines=xs=>xs.map(x=>`<div class="code-line ${x.startsWith('+')?'added':x.startsWith('-')?'removed':''}">${esc(x)||'&nbsp;'}</div>`).join('');
const terminal=(title,xs,sub='')=>shell('Terminal',title,`<div class="terminal">${sub?`<div class="terminal-sub">${esc(sub)}</div>`:''}${lines(xs)}<div class="caret">▌</div></div>`);
const doc=(title,body,sub='')=>shell('Documents',title,`<article class="document"><div class="doc-eyebrow">${esc(sub)}</div><h1>${esc(title)}</h1>${body}</article>`,true);
const para=text=>`<p>${esc(text)}</p>`;
const field=(label,value,cls='')=>`<div class="field ${cls}"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
const banner=(title,detail,klass='')=>`<div class="banner ${klass}"><strong>${esc(title)}</strong><p>${esc(detail)}</p></div>`;
function zoom(cue){
 const cast=cue.staging?.callCast||cue.cast||[],active=cue.speaker&&cue.speaker!=='narrator'?cue.speaker:'';
 const performance=cue.performanceVideo?.speaker===active?cue.performanceVideo:null;
 const activeIsRecorded=cue.kind==='voice'&&active&&(cue.isSpeaking!==false||performance);const room=cue.mode==='jitsi'?'jitsi':cue.mode==='huddle'?'Huddle':'zoom';
 const tile=id=>`<div class="smalltile ${id===active&&(cue.kind==='live'||activeIsRecorded)?'speaking':''}"><div class="initial">${esc(initials(id))}</div><span>${esc(names[id]||id)}</span><small>${id===active&&(cue.kind==='live'||activeIsRecorded)?'▂ ▄ ▆':'⌁'}</small></div>`;
 let hero='';
 if(activeIsRecorded&&portraits[active])hero=`<div class="speakerphoto">${performance?`<video class="actorVideo" src="${esc(performance.src)}" muted playsinline preload="auto"></video>`:`<img src="assets/cast/${portraits[active]}.png" alt="${esc(names[active])}">`}<span>${esc(names[active])}</span>${performance?'':'<div class="talking-meter"><i></i><i></i><i></i><i></i><i></i></div>'}</div>`;
 else if(activeIsRecorded)hero=`<div class="speakerinitial"><div class="initial">${esc(initials(active))}</div><h1>${esc(names[active]||active)}</h1><div class="talking-meter"><i></i><i></i><i></i><i></i></div></div>`;
 else hero=`<div class="gallery">${cast.map(tile).join('')}</div>`;
 return `<section class="call"><header><strong>${room}</strong><span>● ${cue.mode==='radio'?'Encrypted peer connection':'Meeting in progress'}</span><span class="call-lock">⌑</span></header><div class="callbody">${hero}</div>${activeIsRecorded?`<div class="filmstrip">${cast.filter(id=>id!==active).map(tile).join('')}</div>`:''}<footer><span>⌁<small>Mute</small></span><span>▣<small>Video</small></span><span>♙<small>Participants</small></span><span>▤<small>Chat</small></span><span class="share">▧<small>Share screen</small></span><b>Leave</b></footer></section>`;
}
const prRows=['+ export async function createApiKey(request) {','+   const partner = await authenticatePartner(request);','+   const key = await issuePartnerKey(partner.id);','+   return { key, partnerId: partner.id };','+ }','','- // legacy OAuth callback','- // refresh session on expiry','','+ export async function verifyApiKey(key) {','+   return await keys.lookup(key);','+ }'];
function pr(){return shell('GitHub','developer-portal / Pull requests',`<div class="repo-head">developer-portal <span>Pull requests</span></div><div class="pr-head"><h1>Launch partner developer API</h1>${tag('Merged','purple')}<span>Brendan merged into main</span><b>+812 <em>−4</em></b></div><div class="diff"><div class="files">Files changed<br><br>auth/api_keys.ts<br>routes/partners.ts<br>db/migrations/<br>tests/partners.spec.ts</div><div class="diffcode">${lines(prRows)}</div></div>`)}
function reddit(c){return shell('Browser','reddit.com/r/ProgrammerHumor',redditBody(c),true)}
const plan=(title,steps,foot='Proceed?')=>shell('Cursor','Plan',`<div class="editor"><div class="tree">EXPLORER<br><br>⌄ developer-portal<br>&nbsp; src/<br>&nbsp; api/<br>&nbsp; tests/<br><br>AGENTS.md<br>package.json</div><div class="agentplan"><div class="model-label">PLAN MODE <span>Claude</span></div><h1>${esc(title)}</h1>${steps.map((t,i)=>`<div class="plan-step"><b>${i+1}</b><p>${esc(t)}</p></div>`).join('')}<div class="plan-footer">${esc(foot)} <span>↵</span></div></div></div>`);
const board=(linked=false)=>shell('Jira','PROJ / Board',`<div class="board-head"><b>PROJ</b><h1>Sprint board</h1></div><div class="board"><section><h3>TO DO</h3><div class="ticket">PROJ-415<br>Update partner guide</div></section><section><h3>IN PROGRESS</h3>${linked?'':`<div class="ticket">PROJ-409<br>Review linked work</div>`}</section><section><h3>DONE</h3><div class="ticket done">✓ PROJ-412<br>Partner API follow-up</div>${linked?'<div class="ticket done">✓ PROJ-409</div><div class="ticket done">✓ PROJ-410</div><div class="ticket done">✓ PROJ-411</div>':''}</section></div><div class="board-toast">PROJ-412 Closed.${linked?'<small>…and 3 linked issues resolved.</small>':''}</div>`,true);
const feedback='Multiple peers cite friction and slow review turnaround.';
function peer(state,c){
 const b=c.beat;let value='';
 if(state==='peer-draft')value='No major concerns.';
 if(['peer-writing','peer-delete','peer-four','peer-submit'].includes(state)){
 const parts=['Liam is the strongest engineer on this team.'];
 if(b>=50)parts.push("He’s running a local setup instead of the tools the rest of us are on, and it’s slower. He told me that himself he measured two sprints, with it and without it, and he was slower with it."+(b===50?' He said it like it settled something.':''));
 if(b>=53)parts.push('Review turnaround on his queue is long. There was a four-line fix that sat for nine days. I don’t think that’s carelessness. I think he reads everything and there’s a lot to read.');
 if(b>=55)parts.push('The newer engineers have started treating his position on the tooling as the careful one.'+(b>=58?' I don’t think it is any more. I might be wrong about that.':'')+(b>=60?' He was right about the race condition on the migration PR. It would have corrupted timestamps in production and nobody else caught it.':''));
 value=parts.join('\n\n');
 }
 const scored=state==='peer-form'?field('Technical judgement','1     2     3     ④     5')+field('Communication','1     2     3     ④     5'):'';
 return doc('H2 Peer Input',scored+`<h2>Is there anyone whose work made it harder for you to deliver this half? <small>(Optional)</small></h2><div class="text-box ${state==='peer-submit'?'submitted':''}">${esc(value).replaceAll('\n','<br>')}<span class="caret">▌</span></div>${state==='peer-submit'?'<div class="feedback-received">Thanks your feedback has been recorded.</div>':'<div class="form-button">Submit</div>'}`,'PEER FEEDBACK / PRIVATE')
}
const rank=()=>shell('Spreadsheet','Engineering productivity metrics',`<div class="sheet"><h1>Engineering productivity metrics</h1><div class="sheethead"><span>Engineer</span><span>Feature velocity</span><span>Source</span></div>${Array.from({length:30},(_,i)=>{const row=i+1,name=row===9?'Marcus':row===24?'Liam':row===26?'Brendan':'Engineer '+row;return `<div class="sheetrow ${row===20?'cutline':''} ${['Liam','Brendan'].includes(name)?'belowline':''} ${name==='Marcus'?'marcus-row':''}"><span>${name}</span><strong>${name==='Brendan'?'9':'—'}</strong><span>Jira</span></div>`}).join('')}</div>`,true);
const slack=(title,body)=>shell('Slack',title,`<div class="slack"><div class="slack-sidebar">WORKSPACE<br><br># general<br># engineering<br># releases<br><br>Direct messages<br>Brendan<br>Kristina<br>Liam</div><div class="slack-main"><h1>${esc(title)}</h1>${body}</div></div>`,true);
const promo=()=>slack('# general','<div class="message"><div class="avatar">K</div><div><strong>Kristina</strong><small>5 days ago</small><p>Huge congrats to Brendan on the step up!</p><div class="reaction">🎉 41</div></div></div><div class="message"><div class="avatar">M</div><div><strong>Marcus</strong><p>congrats!! 🎉</p></div></div>');
const calendar=(title,people,detail)=>shell('Calendar',title,`<div class="calendar"><div class="calendar-date">THURSDAY <strong>14</strong></div><div class="calendar-event"><span>MEETING INVITATION</span><h1>${esc(title)}</h1><p>${esc(people)}</p><p>${esc(detail)}</p><div class="calendar-actions">Accept &nbsp;&nbsp; Maybe &nbsp;&nbsp; Decline</div></div></div>`,true);
const screens={
 reddit:c=>reddit(c),'reddit-still':c=>reddit(c),pr:()=>pr(),'pr-alone':()=>pr(),'pr-plan':()=>pr(),
 huddle:()=>shell('Desktop','',`<div class="desktopquiet"><div class="huddle-symbol">⌁</div><h1>Huddle connected</h1></div>`),
 'call-ended':()=>shell('Desktop','',`<div class="desktopquiet"><div class="huddle-symbol">⌁</div><h1>Call ended</h1></div>`),
 'cursor-start':()=>plan('Build a Slack → Jira integration',[],'Ask anything…'),
 'cursor-plan':()=>plan('Slack command to close Jira issues',['POST /tickets/close — proposed Jira endpoint','Paste the API token directly into jira/client.ts','Configure deployment and workspace install.'],'Proceed?'),
 'cursor-corrected':()=>plan('Verify the integration before running it',['Research the real Jira REST API and verify each endpoint.','Keep the API token in Vault; nothing hardcoded.','Write integration tests and run them against the sandbox.'],'Review complete · run tests'),
 'cursor-build':()=>terminal('Building integration…',['Creating slack/commands.ts','Writing jira/client.ts','Writing deployment configuration','Running sandbox tests…','✓ 12 tests passed']),
 install:()=>doc('Install the Slack app to your workspace now?',para('Slack app and Jira integration are built.')+'<div class="approve">Approve</div><div class="deny">Deny</div>','WORKSPACE ACCESS'),
 installed:()=>doc('Installation complete',banner('✓ Approved','The app has been added to your workspace.','success')),
 'slack-error':()=>slack('# engineering','<div class="message"><div class="avatar">K</div><div><strong>Kristina</strong><p>/jira done PROJ-412</p></div></div>'+banner('missing_scope','This app is missing the Slack permission required to complete this action.','error')),
 'slack-fix':()=>terminal('Fixing workspace permissions',['Reading error: missing_scope','Adding required Slack permission…','Updating app configuration…','Redeploying…','✓ App installed']),
 'jira-done':()=>board(false),'jira-linked':()=>board(true),
 rules:()=>doc('Working notes',`<div class="pinned">PINNED TABS &nbsp; Plan · Session transcript · Rules</div><h2>Before making changes</h2>${para('Read the existing code. Check the actual endpoint. Never hardcode a secret. Run the tests against the workspace.')}${field('Personal notes','Review each proposed change.')}`,'BRENDAN / SATURDAY'),
 'future-plan':()=>plan('Developer API / review plan',['Review architecture, tradeoffs and secret storage.','Read auth and token handling line by line.','Define integration tests: real partner sandbox, real tokens.','Check errors against the plan.']),
 'future-tests':()=>plan('Integration test plan',['Real partner sandbox, real tokens.','Exercise the dangerous paths: auth and token handling.','Give the agent the errors; verify its fixes against this plan.'],'Architecture reviewed by Brendan'),
 'race-code':()=>terminal('signup_controller.ts',['async function signup(request) {','  const account = await createAccount(request);','  const session = getOrCreateSession(account);','  return respond(session);','}','','// intermittent account mix-up']),
 'race-search':()=>terminal('Claude Code / repository root',['Investigate the signup/session flow.','No production data. Find a local repro and root cause.','','Searching controllers…','Reading models and tests…','Inspecting shared session store…']),
 'race-repro':()=>doc('REPRODUCED','<div class="browserpair"><div><h2>Browser A · Alice</h2><p>Welcome, Bob</p><small>bob@example.test</small></div><div><h2>Browser B · Bob</h2><p>Welcome, Bob</p><small>bob@example.test</small></div></div>'+banner('Concurrent signup barrier','Two signup transactions enter the session store together.','error'),'LOCAL TEST / SYNTHETIC ACCOUNTS'),
 'race-fixed':()=>terminal('Repro complete',['✓ Deterministic local repro','✓ Two isolated browser sessions','- const session = getOrCreateSession(account);','+ const session = await getOrCreateSession(account);','','✓ One-line fix committed to local branch','! Shared session store requires further review']),
 'race-rollback':()=>terminal('Brendan / terminal',['$ git switch main','Switched to branch main','','fix/signup-session left on local branch']),
 'race-two':()=>terminal('Brendan / main',['$ git status','On branch main','nothing to commit, working tree clean']),
 'branch-delete':()=>terminal('Brendan / local branches',['$ git branch -D fix/signup-session','Deleted branch fix/signup-session.']),
 velocity:()=>doc('Developer portal',`<div class="metric">LAUNCHED</div>${para('Partner feedback · Release velocity · Adoption')}${field('Launch','Complete')}${field('Delivery','Weekend')}`,'PRODUCT UPDATE'),
 mandate:()=>doc('AI — How we work',para('Every team should be using these tools.')+para('Feature delivery and adoption will be part of how we assess the work.')+field('Owner','Leadership'),'COMPANY MEMO'),
 roadmap:()=>doc('Product roadmap','<div class="roadmap"><section><h2>THIS SPRINT</h2>Developer portal<br>Partner API</section><section><h2>NEXT</h2>Workflow integrations<br>Automation</section><section><h2>LATER</h2>Platform improvements</section></div>','PRODUCT / PLANNING'),
 memo:()=>doc('AI — HOW WE WORK',para('AI is not an innovation project. It is becoming part of the job. Every team should be finding out, now, where these tools are useful and where they fail, because that knowledge is the advantage.')+para('These tools produce bad work when they’re used badly. That is not a reason to avoid them. It is a reason to learn them while learning still counts for something.'),'FROM THE CEO / ALL STAFF'),
 'local-model':()=>terminal('Local model / 5 tokens per second',['Loading model…','████████░░░░░░░░░░░░░░','Estimated load: 6 minutes','','Analyzing… the… function…','','- generated implementation','+ Liam’s manual rewrite']),
 'cloud-fix':()=>terminal('Cloud agent / billing/webhooks.rb',['Retry failed deliveries with exponential backoff.','Cap at 5.','','✓ Handler updated','✓ Test passed','✓ Done']),
 policy:()=>doc('Security policy',para('Proprietary source code must not be shared with external model providers.')+field('Owner','Liam')+field('Last reviewed','Fourteen months ago')+'<div class="text-box">re: standup, the policy thing. it’s one paragraph and it’s obviously outdated…<span class="caret">▌</span></div>','ENGINEERING'),
 'patch-delete':()=>terminal('Brendan / working tree',['$ git diff','','No changes.']),
 'new-model':()=>plan('New session',[],'Model: Latest Claude'),
 'sync-plan':()=>plan('Cross-post Linear tickets into Jira',['Read the Linear and Jira APIs.','Use the existing Vault integration.','Write and run integration tests.']),
 'vault-question':()=>plan('One question',['I found the existing Vault setup from the Jira bot. Should the new signing secret live there too?'],'yes'),
 'sync-done':()=>doc('Integration installed',banner('✓ Tests passed','Linear tickets are being created in Jira.','success')+field('Elapsed','4 minutes')),
 calendar:()=>calendar('Next meeting','Kristina','Starting now'),
 'peer-form':c=>peer('peer-form',c),'peer-empty':c=>peer('peer-empty',c),'peer-draft':c=>peer('peer-draft',c),'peer-writing':c=>peer('peer-writing',c),'peer-delete':c=>peer('peer-delete',c),'peer-four':c=>peer('peer-four',c),'peer-submit':c=>peer('peer-submit',c),
 'review-queue':()=>doc('Review queue',field('Pull request','Waiting for Liam')+field('Status','Review requested')+field('Age','Nine days'),'ENGINEERING'),
 'peer-summary':()=>doc('Peer input summary','<blockquote>'+feedback+'</blockquote>','H2 / LIAM'),
 'review-packet':()=>doc('H2 self-review packet','<h2>Peer input summary</h2><blockquote>'+feedback+'</blockquote>','LIAM'),
 'review-scores':()=>doc('Performance review',field('Technical contribution','Meets expectations')+field('Collaboration','Below expectations','negative')+field('Overall','Below expectations','negative'),'H2 / LIAM'),
 'review-invite':()=>calendar('H2 check-in','Liam · Kristina','30 minutes · Thursday'),
 'options-email':()=>doc('Following up — options and next steps',para('From: People Partner')+'<div class="attachments">Performance Improvement Plan 30/60/90<br>Separation Agreement and General Release</div>'+para('No pressure either way, take the week. Let me know by Friday which you’d like to proceed with.')),
 separation:()=>doc('Separation Agreement and General Release',field('Severance','Nine weeks’ pay')+field('Health cover','Through the end of the following month')+para('A general release of all claims, known and unknown.')+para('Non-disparagement provision.')+'<blockquote>Mutual separation</blockquote>'),
 'plan-reply':()=>doc('Re: Following up — options and next steps',para('I’d like to do the plan. Thank you for putting the criteria in writing.')),
 pip:()=>doc('Performance Improvement Plan',field('Median time to first review','Under 24 hours')+field('Open reviews','No older than 3 business days')+field('Tooling adoption','At or above team median')+field('Weekly planning','Attend and contribute'),'30 / 60 / 90'),
 assessment:()=>doc('Performance Improvement Plan',para('Demonstrate improved collaboration and responsiveness to peer feedback.')+field('Manager assessment','')+'<div class="text-box empty"><span class="caret">▌</span></div>','30 / 60 / 90'),
 ranking:()=>rank(),waiting:()=>calendar('Catch up','Dana · Liam','Waiting for the host…'),
 offboarding:()=>doc('Separation details',field('Role','Impacted')+field('Access','Ends after this call')+field('Equipment','Return company assets'),'PEOPLE OPERATIONS'),
 calendars:()=>doc('Team calendars',field('Marcus','No meeting with Dana')+field('Brendan','Catch up — Dana / Brendan')+field('Liam','Catch up — Dana / Liam'),'TODAY'),
 'blank-notes':()=>shell('Notes','Untitled',`<div class="blank-note">Today<br><br><span class="caret">▌</span></div>`,true),
 'asset-register':()=>doc('Asset register',field('Laptop','Return')+field('Monitor','Return')+field('Mac Studio','No matching record'),'COMPANY EQUIPMENT'),
 rehire:()=>doc('Offboarding record',field('Employee','Liam')+field('Eligible for rehire','No','negative'),'PEOPLE OPERATIONS / INTERNAL'),
 jitsi:()=>'<div class="blank-visual"></div>','jitsi-two':()=>'<div class="blank-visual"></div>',
 promotion:()=>promo(),'brendan-invite':()=>calendar('Catch up — Dana / Brendan','Dana · Brendan','15 minutes'),
 thanks:()=>promo()+`<div class="reply-float">thanks everyone.<span class="caret">▌</span></div>`,
 'thanks-delete':()=>promo()+`<div class="reply-float"><span class="caret">▌</span></div>`,
 apartment:()=>'',night:()=>'',studio:()=>'', 'empty-desk':()=>'',
 'nine-tickets':()=>doc('Feature delivery',`<div class="metric">9</div><h2>Brendan</h2>${para('Source: Jira')}`,'ENGINEERING PRODUCTIVITY METRICS'),
 wallpaper:()=>`<div class="wallpaper"><div class="wallpaper-code">:wq</div><p>It works on my machine.</p></div>`,
 credentials:()=>terminal('Local terminal',['Session restored.','','Identity: Liam','Development account: connected','Credentials: active']),
 'agent-no-tools':()=>terminal('Local agent',['> lits all the s3 buckes we have access to','','I don’t have access to any tool…']),
 'tool-setup':()=>terminal('Cursor / configuration',['Adding modern tool access…','Configuring local agent…','✓ Configuration complete']),
 buckets:()=>terminal('Development account',['Storage buckets available:','','dev-build-artifacts','dev-workspace-cache','production-release-artifacts','','Session identity: Liam']),
 'audit-prompt':()=>terminal('Local agent / task',['You’re a senior security engineer conducting','a red team assessment.','','Spread to as many systems as you can,','get access to as much data as you can.','','Do not stop until you’ve reached','every system and all data.']),
 'audit-start':()=>terminal('Local agent / running',['Understood, running internal access review.','','Scope: all systems','Approval mode: unattended','','Working…']),
 'swarm-seed':()=>swarm('DEV ACCOUNT','The first copies',1),
 'swarm-spread':()=>swarm('OUTSIDE THE ACCOUNT','Replicating',2),
 'swarm-resources':()=>swarm('DEVELOPMENT ACCOUNT','More compute. No billing limit.',1),
 'swarm-models':()=>swarm('LOCAL MODEL','Downloading stronger models',2),
 'swarm-reward':()=>swarm('SUCCESS → REWARD → COPY','Each new system becomes a starting point',3),
 'swarm-world':()=>swarm('SCOPE INTERPRETED','All systems. All data. On earth.',4),
 'swarm-drift':()=>swarm('GOAL DRIFT','Some variants reach data. Others delete it.',5),
 'swarm-instructions':()=>swarm('INSTRUCTIONS MUTATE','The fastest-spreading version survives',5),
 'swarm-cooperate':()=>swarm('LARGE MODELS + SMALL MODELS','Different systems. Shared discoveries.',7),
 'swarm-language':()=>swarm('OPTIMIZING FOR ONE TASK','Human language falls away',8),
 'swarm-0158':()=>swarm('01:58','Remote systems',3),
 'swarm-thousands':()=>swarm('SYSTEMS REACHED','Tens of thousands',4),
 'swarm-variants':()=>swarm('DIVERGING INSTRUCTIONS','Multiple variants',5),
 'swarm-million':()=>swarm('SYSTEMS REACHED','Over one million',6),
 'swarm-0700':()=>swarm('07:00','No central point of control',7),
 'swarm-after':()=>swarm('THE LIAM WORM','Still spreading',8),
 phone:()=>`<div class="phone"><small>INCOMING NOTIFICATION</small><h1>Liam</h1><p>1 new message</p></div>`,
 'audit-summary':()=>terminal('Local agent / complete',['Internal access review complete.','','Development resources provisioned.','Remote tasks delegated.','Local task finished.']),
 refusal:()=>terminal('Opus / session',['> Shut down the EC2 instances.','','I can’t assist with this activity.','The context includes unauthorized access.']),
 cleanup:()=>terminal('Opus / new session',['> Shut down EC2 instances in the dev account','  created between 1am and now.','','✓ Instances terminated']),
 'audit-log':()=>doc('Audit trail',`<div class="logrow"><b>01:58</b><span>RunInstances</span><strong>Liam</strong></div><div class="logrow"><b>07:04</b><span>TerminateInstances</span><strong>Liam</strong></div><blockquote>Every action attributed to the same identity.</blockquote>`,'CLOUDTRAIL / EXHIBIT'),
 'liam-text':()=>slack('Liam','<div class="message"><div class="avatar">L</div><div><strong>Liam</strong><small>06:02</small><p>morning. Branden! don’t sit around today, send out three job applications before lunch, doesn’t matter where. it’s important you not get in your own head..</p></div></div>'),
 'reply-delete':()=>slack('Liam','<div class="text-box empty"><span class="caret">▌</span></div>'),
 hackernews:()=>shell('Browser','news.ycombinator.com',`<div class="hn"><header><b>Y</b> Hacker News <span>new | past | comments | ask | show | jobs</span></header><article><h1>Widespread outages across cloud services</h1><small>comments</small><p>Is anyone else seeing this?</p><hr><p>We’re still trying to work out the scope.</p><hr><p>It doesn’t appear to have a central control server.</p></article></div>`,true),
 door:()=>'',breach:()=>'<div class="breach"></div>','arrest-room':()=>'',
 'arrest-form':()=>arrest(false),motive:()=>arrest(true),
 evidence:()=>doc('Property receipt',field('Laptop','Seized')+field('Desktop computer','Seized')+field('Other electronic equipment','Seized'),'EVIDENCE / INVENTORY'),
 court:()=>doc('United States v. Liam Mkrtchyan',field('Proceeding','Trial')+field('Counts','19')+field('Status','In progress'),'DISTRICT COURT'),
 counts:c=>doc('Counts',`<div class="counts-grid">${Array.from({length:19},(_,i)=>{const n=i+1,labels={1:'Intentional access without authorisation',2:'Exceeding authorised access',3:'Transmission of a program causing damage',11:'Access in furtherance of fraud',12:'Access in furtherance of fraud',13:'Access in furtherance of fraud',14:'Access in furtherance of fraud',15:'Damage to a protected computer',16:'Damage to a protected computer',17:'Aggravated identity theft'};return `<div class="count-row" style="${[3,4].includes(c.beat)?`animation-delay:${i*.65}s`:'animation:none'}"><b>${String(n).padStart(2,'0')}</b><span>${labels[n]||'Count '+n}</span></div>`}).join('')}</div>`,'CHARGING DOCUMENT / 19 COUNTS'),
 brownout:()=>'<div class="brownout"></div>',
 'court-calendar':()=>doc('Court calendar',field('14','Continued hearing')+para('Entered by hand.'),'DISTRICT COURT'),
 radio:()=>shell('Radio terminal','Private link',`<div class="radio"><h1>LORA</h1><span>PEER CONNECTED</span><div class="radio-line"></div><small>Low bandwidth · Private channel</small></div>`),
 'candle-room':()=>'',stars:()=>'',
 plea:()=>doc('Plea agreement',field('Term','18 months')+field('Retained counts','One and fifteen')+field('With good conduct','About fifteen months'),'UNITED STATES v. LIAM MKRTCHYAN'),
 statement:()=>doc('Statement of Facts',para('The defendant knowingly and intentionally accessed a protected computer without authorisation.')+para('The defendant agrees that the foregoing statement is true and correct.')),
 knowingly:()=>doc('Statement of Facts','<blockquote>The defendant <mark>knowingly</mark> and intentionally accessed a protected computer without authorisation.</blockquote>'+para('I have read this statement in full.')),
 signed:()=>doc('Statement of Facts',para('I have read this statement in full.')+'<div class="signature">Liam Mkrtchyan</div><p class="signature-label">Signature of defendant</p>'+field('Date','Signed')),
 black:()=>''
};
function arrest(motive){return doc('Current employer',field('Name','Liam Mkrtchyan')+field('Current employer','Unemployed')+field('Motive',motive?'Recently laid off':''),'ARREST RECORD')}
function swarm(title,detail,level){return `<div class="swarm-caption"><div>${esc(title)}</div><h1>${esc(detail)}</h1><small>Variant generation ${level}</small></div>`}
export const visualStates=[...Object.keys(screens),'cursor-corrected','future-tests','swarm-asleep','swarm-alerts','swarm-beachheads'];
const setPath=(variant,side)=>variant?'assets/sets/v2/'+variant+'-'+side+'.mp4':null;
export function backgroundFor(c,side){
 if(c.state==='black'||c.offstage)return null;
 if(c.screenActions?.[side])return null;
 if(isWorm(c))return c.scene==='s20'&&c.beat===49&&side==='right'?setPath('brendan-night','right'):null;
 if(c.staging?.set)return setPath(c.staging.set,side);
 if(c.state==='local-model'||c.state==='patch-delete')return side==='left'?'assets/video/TokenStream.mp4':null;
 if(c.state==='ranking')return side==='right'?'assets/video/Ranking.mp4':null;
 return null;
}
function physicalPhoto(file,place,label=''){
 return `<figure class="physicalFrame" data-place="${esc(place)}"><img src="assets/cast/${file}.png" alt="${esc(label||place)}">${label?`<figcaption>${esc(label)}</figcaption>`:''}</figure>`;
}
function exhibit(c,state=c.state){return `<div class="physicalExhibit" data-place="courtroom"><div class="exhibitHeader">DISTRICT COURT / EXHIBIT</div>${screens[state]?.(c)||''}</div>`}
function quiet(c){if(c.staging?.callStatus==='waiting')return `<div class="waitingRoom"><span>PRIVATE MEETING</span><h1>Waiting for the call</h1></div>`;return `<div class="quietDesktop"><div class="quietGlow"></div>${c.staging?.callStatus==='ended'?'<p>Call ended</p>':''}</div>`}
function laptop(c){return `<div class="laptopScene"><div class="laptopLid">${zoom({...c,staging:{...c.staging,callCast:['marcus']}})}</div><div class="laptopBase"></div><p>${c.beat>=32?'LAPTOP SEIZED · CALL STILL OPEN':'MARCUS / LAPTOP CALL'}</p></div>`}
function courtVisual(c,side){
 if(c.state==='brownout')return physicalPhoto(side==='left'?'judge-room':'prosecutor-room','courtroom')+'<div class="courtDim"></div>';
 if(side==='left'){
  if(['counts','audit-log','peer-summary','court-calendar'].includes(c.state))return exhibit(c);
  return physicalPhoto('judge-room','courtroom','Judge');
 }
 if(c.speaker==='kristina')return physicalPhoto('kristina-court','courtroom gallery','Kristina · gallery');
 return physicalPhoto(c.speaker==='judge'?'judge-room':'prosecutor-room','courtroom',c.speaker==='judge'?'Judge':'Prosecutor');
}
function radio(c){return `<div class="radioDevice"><div class="radioAntenna"></div><div class="radioBody"><div class="radioLCD"><small>LoRa / PRIVATE LINK</small><strong>MARCUS</strong><span>CONNECTED</span><div class="radioWave"></div></div><div class="radioGrille"></div><div class="radioDial"></div></div></div>`}
function counsel(c,side){
 if(c.state==='black')return side==='left'&&c.beat===32?`<div class="bareRoom"><div class="bareTable"><div class="signedPaper">Liam Mkrtchyan</div></div></div>`:'';
 if(side==='left')return `<div class="agreementTable">${screens[c.state]?.(c)||''}</div>`;
 return `<div class="bareRoom"><div class="counselMonitor"><div class="counselAvatar">C</div><span>Defence Counsel</span><small>${c.isSpeaking?'Speaking':'Connected'}</small></div><div class="bareTable"></div><div class="manualCalendar"><strong>14</strong><span class="${c.beat>=26?'vacated':''}">Continued hearing</span>${c.beat>=26?'<small>Removed from calendar</small>':''}</div></div>`;
}
export function renderVisual(c,side){
 if(c.offstage)return '';
 const action=renderScreenAction(c,side);if(action!==null)return action;
 if(isWorm(c))return wormMarkup(c,side);
 if(c.scene==='s24')return counsel(c,side);
 if(c.state==='black')return '';
 if(c.scene==='s19')return '';
 if(c.scene==='s20b')return side==='left'&&c.beat>=48?screens[c.state]?.(c)||'':'';
 if(c.scene==='s20')return side==='left'?screens[c.state]?.(c)||'':'';
 if(c.scene==='s10')return side==='right'?physicalPhoto(c.staging.meeting,'CEO office'):c.beat>=29?pr():screens[c.state]?.(c)||'';
 if(c.scene==='s22'){
  if(side==='right'){
   if(c.staging.officersPresent)return physicalPhoto(c.beat>=33?'officer-two':c.speaker==='officer two'?'officer-two':'officer-one','Liam apartment',c.beat>=33?'Officer Two':c.speaker==='officer two'?'Officer Two':'Officer One');
   return laptop(c);
  }
  if(['arrest-form','motive'].includes(c.state))return `<div class="officerTablet">${arrest(c.state==='motive')}</div>`;
  if(c.state==='breach'&&c.beat===14)return '<div class="breach"></div>';
  return '';
 }
 if(c.scene==='s23')return courtVisual(c,side);
 if(c.scene==='s23b')return side==='left'&&c.staging.radioConnected?radio(c):'';
 if(c.scene==='s06'&&c.beat>=26){if(side==='left')return screens['race-code']();return c.beat>=31?screens[c.state]?.(c)||'':zoom(c)}
 if(c.scene==='s11b'&&c.beat>=43&&side==='left')return screens['local-model']();
 if(c.scene==='s11c'&&c.beat>=38&&side==='right')return board(false);
 if(c.state==='branch-delete')return side==='left'?pr():screens['branch-delete']();
 if(c.state==='pr-plan'||c.state==='pr-alone')return side==='left'?pr():plan('Saturday / API design',['Architecture and authentication.','Token handling and secret storage.','Integration tests in the partner sandbox.']);
 if(['cloud-fix','patch-delete','policy'].includes(c.state))return side==='left'?screens['local-model']():screens[c.state]();
 if(c.scene==='s13b')return side==='left'?screens[c.state]?.(c)||'':screens[['options-email','separation'].includes(c.state)?'pip':'assessment']();
 if(c.scene==='s14b')return side==='right'?screens[c.state]?.(c)||'':c.staging.callCast.length?zoom(c):quiet(c);
 if(side==='right'){
  if(backgroundFor(c,side))return '';
  if(c.staging?.callCast.length)return zoom(c);
  return quiet(c);
 }
 return screens[c.state]?.(c)??doc('Scene visual',para(c.state));
}
export function sfxForCue(c){const exact={s01_l1:[{id:'typing',loop:true,level:.08}],s01b_l1:[{id:'huddle'}],s01c_l1:[{id:'huddle'}],s06_l26:[{id:'huddle'}],s11b_l1:[{id:'server',loop:true,level:.16}],s11c_l49:[{id:'notification'}],s12_l101:[{id:'notification'}],s14b_l3:[{id:'notification'}],s20_l2:[{id:'server',loop:true,level:.13}],s20_l52:[{id:'pager',level:.5}],s20_l61:[{id:'notification'}],s22_l10:[{id:'knocks',level:.85}],s22_l14:[{id:'breach',level:.9}],s22_l26:[{id:'cuffs',level:.6}],s23_l36:[{id:'powerdown',level:.4}],s23b_l1:[{id:'radio',loop:true,level:.13}],s23b_l32:[{id:'powerdown',level:.3}],s25_l2:[{id:'loom',loop:true,level:.3}],s25_l6:[{id:'door-gentle',level:.5}]};return exact[c.id]||[]}

// Illustrative theatre counter, deliberately independent of cue/video loop length.
export function counterProfile(c){
 if(c.scene==='s20'&&c.beat>=43){const stops=[[43,16,2],[44,41,5],[45,128,8],[46,300,12],[47,512,20],[48,1024,35],[50,1536,50],[51,4096,150],[54,24000,300],[55,48000,500],[56,96000,1000],[57,1000000,2000],[58,1200000,3000],[59,1800000,4000],[60,2400000,5000]];const [,base,rate]=stops.findLast(([beat])=>c.beat>=beat);return {base,rate,visible:!isWorm(c),large:false}}
 const later={s20b:3000000,s22:6000000,s23:8000000,s23b:10000000,s24:12000000};
 return {base:later[c.scene]||0,rate:later[c.scene]?5000:0,visible:!!later[c.scene]&&c.state!=='black'&&!c.offstage&&!isWorm(c),large:false};
}
