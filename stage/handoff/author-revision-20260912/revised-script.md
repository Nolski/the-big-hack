# The Big Hack — revised script through The Audit

Author revision · September 12, 2026

The approved montage and its Mountain Man introduction play first.

## Opening montage

**Stage** · s00_montage

Opening news montage. Play through Sam’s pause and the Mountain Man introduction; GO begins the standup.

## Cold Open — The Standup

**Stage** · s01_l1

A Reddit feed, r/programminghumor, scrolling. A meme fills it: "THIS HERE IS CALLED AI. YOU ASK IT QUESTIONS, AND IT CONFIDENTLY LIES TO YOU.". He chuckles and scrolls, another, then another, each a dunk on AI slop, and he keeps chuckling. He's clearly been at this a while. LIAM, bathrobe, hair flat from the pillow, slumped at the desk, one hand on the mouse. This is what he was doing before work, and it's what he's still doing. On the second monitor, off to the side, a Zoom standup grid of coworker tiles starts up; his own tile is a black square: his camera is off.

**Kristina** · s01_l2

Morning, everyone, I'd like to remind you all of the time limits on updates we agreed to last time so we can get through standup more effeciently. Liam, you're on mute, I think? And… your camera is off?

**Liam** · s01_l3

Yeah sorry, I'm eating, so my camera's off today.

**Narrator** · s01_l4

He’s very obviously not eating.

**Kristina** · s01_l5

No worries. Okay, I wanted to give some praise. The API developer portal we shipped this week, the feedback's been incredible. Two of our biggest integration partners shipped on it over the weekend. Support's quiet, adoption's climbing. Best launch we've had in ages.

**Kristina** · s01_l6

And that's so much down to Brendan who, I happen to know, put most of his weekend into getting it over the line. So. Thank you, genuinely. It did not go unnoticed.

**Brendan** · s01_l7

Oh thanks, that's... yeah. It kind of came together. I'm really happy with how it landed.

**Narrator** · s01_l8

Liam’s heart skips a beat when he hears Brendan worked on the weekend…

**Liam** · s01_l9

…He shipped this feature on the weekend?

**Stage** · s01_l10

He clicks off the memes and drags the merged PR up, and starts sharing his screen uninvited.

**Kristina** · s01_share_reply

Liam, you don’t need to take over the screenshare…

**Liam** · s01_l12

Hang on. This shipped? This is the developer portal... live? In front of partners, right now? Eight hundred lines in one PR. Who reviewed this?

**Brendan** · s01_l13

I mean it's been live since last Thursday, totally stable, partners are already on it, so...

**Liam** · s01_l14

Who reviewed all this code?

**Brendan** · s01_l15

…Well I skimmed it. But I made sure there's a really robust set of tests and I eval'ed the functionality. The whole suite's green...

**Liam** · s01_l16

You skimmed it..? What are you talking about, didn't you write this code?You vibecoded this, didn't you?

**Brendan** · s01_l17

I used Claude Code, Opus 4.5 but I went back and forth with it, and the tests all pass, the partners haven't hit a single...

**Kristina** · s01_l18

… Liam can we take this offline so we can get through standup?

**Liam** · s01_l19

The tests pass...? The AI wrote the code and the AI wrote the tests that say the code's fine. It doesn't understand any of it, it's just a next word predictor.

**Marcus** · s01_l20

Yeah, well, what I keep saying... Nobody wants to talk about it... the AI is coming for our jobs.

**Liam** · s01_l21

That's not what I said at all... I said the code is bad... what?

**Marcus** · s01_l22

If you listened to what I said about the Luddites last week, Liam... the 1700’s textile workers the British literally executed because the automated machines took their jobs… When they protested they got KILLED. The quality of the textiles actually got WORSE, but it didn’t matter because it got cheaper. I wish you all would pay more attention to what’s happening

**Narrator** · s01_l23

Marcus doesn’t have this quite right, he’s making some crude and quick assumptions to win an argument. It’s thought that the quality of the garments actually went up via industrialization, not down. In the early days it was questionable, but in time there was no doubt, quality went up.

**Liam** · s01_l24

Marcus, this has nothing to do with making clothes. We are hired to write good code and vibe coding writes garbage code. Can you please keep your politics out of this for 5 minutes? Kristina is trying to run standup.

**Kristina** · s01_l25

Thanks Liam. Let's -

**Marcus** · s01_l26

But you're wrong, Liam. This has happened throughout history, with skilled workers being replaced by technology. Our boss will always try to replace us with technology if we don't -

**Liam** · s01_l27

Marcus, you've already done your big speech on the Luddites last week. Do you mind if we talk about actual technology this time around, despite your hatred for it?

**Marcus** · s01_l28

Well Kristina cut me off last week. I just don’t want you to all blow me off, this is serious, we need to learn lessons from the past or we’re doomed to repeat it, and the lesson the Luddites have to tell us…

**Kristina** · s01_l29

Marcus, thank you for your input... but can we get through standup and then I promise I'll give you an opportunity to share your concerns

**Stage** · s01_l30

He has lost LIAM completely. Something on the diff has him.

**Liam** · s01_l31

…Wait. Hold on. Are these, are these long-lived API tokens?

**Brendan** · s01_l32

…Yeah. The keys are long-lived.

**Liam** · s01_l33

Did nobody read my memo? I wrote an entire memo on this. We should only be using JWTs. They're stateless, you verify the signature, you're not hitting the database on every single request. They expire on their own. It's all in there, with diagrams. But no. Of course. Of course the AI didn't read my memo.

**Brendan** · s01_l34

…Actually, it did. I fed your memo into Claude before I started. It read the whole thing and the first version did have JWT's. I can pull up the first commit, it's exactly what you recommended in your memo

**Kristina** · s01_l35

and then I'm the one who had him remove the JWT's. That part's on me, Liam. Not Brendan, and not the AI. The switch to long-lived keys was my call.

**Liam** · s01_l36

…Why on earth would you do that.

**Kristina** · s01_l37

Because we user-tested it. The JWT flow, the refresh, the expiry, it confused every integration partner we put it in front of; half of them dropped off right at token refresh. The expirations tanked adoption. Long-lived keys, are just easier to understand. And yes, I know what a leaked key does. It's live until somebody rotates it. It's a tradeoff, and I made the call.

**Liam** · s01_l38

That's not a product call. That's a cyber security decision, and you made it in a user study. If you had a software engineering degree, Kristina, you'd understand why that was never yours to override.

**Narrator** · s01_l39

Kristina holds her tongue, she is in disbelief about what Liam just said.

**Kristina** · s01_l40

…

**Stage** · s01_l41

Just dead air

**Marcus** · s01_l42

Liam, you just asked a woman on this call whether she's qualified to have an opinion. In front of everyone.

**Liam** · s01_l43

I'd have asked you the same thing.

**Marcus** · s01_l44

That isn't the point. The point is who tends to get asked.

**Stage** · s01_l45

And KRISTINA comes back. Not to deal with Liam. To deal with the man defending her.

**Kristina** · s01_l46

It's fine. Thank you, Marcus. Let's keep moving, we're over time already.

**Marcus** · s01_l47

I'd just like it noted that somebody said something.

**Stage** · s01_l48

She lets that sit for a second... Marcus spoke out to give himself credit..

**Kristina** · s01_l49

Right. Liam, anyway, what are you on this week, and is anything blocking you?

**Liam** · s01_l50

Still chasing the race condition in the signup flow. No blockers.

**Kristina** · s01_l51

Great. What's your estimate to completion? Just a rough number.

**Liam** · s01_l52

It's a race condition. Could be a one-line fix, could be a rewrite of the whole session handler. I'm not going to invent a number so a spreadsheet feels better.

**Kristina** · s01_l53

…Sure. I'll put two weeks. Thanks, everyone, that's standup.

**Stage** · s01_l54

Liam goes back to looking at the reddit memes.

## The Cursor Demo

**Stage** · s01b_l1

The slack huddle sound starts playing... Kristina is calling Brandon

**Kristina** · s01b_l2

…Hey. Liam's comment about my Degree. I've been sitting here half-deciding whether it's an HR conversation.

**Brendan** · s01b_l3

…Honestly? It wasn't okay. But he's not a bad guy. He's thorny. He's also the best engineer I've worked with, I've learned more from him than from anyone here. You just learn to work around the edges of him.

**Kristina** · s01b_l4

"Work around him." That's the job, is it.

**Brendan** · s01b_l5

…Kind of? Sometimes. I don't think HR fixes him. I think it just makes the next standup worse for both of you.

**Stage** · s01b_l6

She sits with it. Lets it go for now.

**Kristina** · s01b_l7

…Okay. I actually wanted to talk to you about something else.. vibe coding... It seems like recently when Opus 4.5 dropped something changed, and I haven't had a chance to tinker with any of it. Can you show me your setup?

**Brendan** · s01b_l8

Yeah happily. Fair warning, it's rougher than you might think. But it's honestly the most fun I've had in years. Let's build something real together. You know that ChatOps bot you keep saying we need, close a Jira ticket from Slack? Nobody's had time. Let's just… try it. Right now.

**Kristina** · s01b_l9

I mean I've watched half of Twitter vibe-code a startup over a weekend.... your right, this is fun

**Brendan** · s01b_l10

Perfect. Open Cursor. Top right, put it in plan mode. Then just tell it what you want, like you'd brief a contractor. Your own words.

**Kristina** · s01b_l11

Okay… "Build a Slack bot so our team can close Jira tickets from a slash command, slash-jira-done, and post back a clean confirmation."

**Brendan** · s01b_l12

Yep. Send it.

**Stage** · s01b_l13

She hits enter. A plan streams out on screen, steps, files, an architecture. It looks authoritative. At the foot of it, a prompt waits "Proceed?"

**Brendan** · s01b_l14

Okay see, this is the part people skip. It looks confident, but it's guessing. This is actually exactly what Liam was talking about. Look, it invented a Jira endpoint. "Tickets-slash-close." That's not a real call; that doesn't exist. And down here, it wants to paste the API token straight into the code.

**Kristina** · s01b_l15

…hardcode the credentials. So Liam wasn't just being dramatic this morning....

**Brendan** · s01b_l16

No, he’s not usually wrong ... but what he left off is how much faster it is to correct it when it’s wrong, than it is to do it yourself. Try telling it that it’s wrong…

**Kristina** · s01b_l17

"Research the real Jira REST API, verify the endpoints actually exist and keep the token in Vault, nothing hardcoded." See, I do listen on the security stuff.

**Brendan** · s01b_l18

Exactly. And make it check its own work; have it write tests and run them against the sandbox before it touches anything real. Okay... run it.

**Stage** · s01b_l19

They run it. very quickly hundreds of lines of code get generated

**Brendan** · s01b_l20

There, its own tests pass. Now it wants to install to your Slack.

**Stage** · s01b_l21

A dialog box on screen the Slack app and Jira integration are built. "Install the Slack app to your workspace now?" buttons: Approve / Deny.

**Kristina** · s01b_l22

…It's asking me. I just approve it without reading the code?

**Brendan** · s01b_l23

Yup..

**Stage** · s01b_l24

She clicks. A green check.

**Brendan** · s01b_l25

There, it's live in your Slack now. Try it out

**Kristina** · s01b_l26

Right. Give me one of yours, what have you got open?

**Brendan** · s01b_l27

Oh sorry, I haven't got any in there. I've been tracking my stuff in Linear since the launch

**Kristina** · s01b_l28

…Linear...?

**Brendan** · s01b_l29

Yeah I find it a little easier to use than Jira, I'm sorry if that messes our workflows up

**Kristina** · s01b_l30

Work however makes you most productive, that's the whole point of any of this... Just give me access to your linear and I'll copy it over into Jira

**Brendan** · s01b_l31

Are you sure that's alright? Because I'm still fairly new, and if there's a process thing I'm supposed to follow...

**Kristina** · s01b_l32

Brendan. Honestly. Send me the board and I'll cross post it into Jira, I'll figure it out my end. Do the work in whatever gets you moving fastest. That's what matters, and that's what gets you noticed.

**Brendan** · s01b_l33

…Okay. Thanks.

**Kristina** · s01b_l34

Anyway I'll use one of mine for the test, then. Okay… slash, jira, done, P-R-O-J four-twelve…

**Stage** · s01b_l35

She hits enter. Slack pings back: "PROJ-412 Closed." Behind it, on the board, the card slides over to Done.

**Stage** · s01b_l36

under the green confirmation, in small grey text neither of them reads: "…and 3 linked issues resolved." The board quietly shuffles three more cards to Done.

**Kristina** · s01b_l37

…it actually closed it. Okay. Yeah, I get why you said this is fun

**Kristina** · s01b_l38

The thing Liam said about the code, though. That it writes its own tests, so of course they pass. Marking its own homework. He's not wrong about it, is he?

**Brendan** · s01b_l39

I’m actually really happy to hear you ask that. Let me show you my process.

**Kristina** · s01b_l40

Please. Yes. Show me.

**Stage** · s01b_l41

BRENDAN shares his screen, a plan-mode plan.

**Brendan** · s01b_l42

So the thing liam mention this morning: you read eight hundred lines of AI code top to bottom. Nobody can do that, you'd go blind by line two hundred, that's actually true regardless of who wrote it. So for years human written code was split into smaller patches that are easier to review. But imagine you joined a new company and needed to learn how a service worked. You wouldn't read all the code, you would start with the documentation. So when it comes to AI code, you don't start with the code at all. You start here, this is the plan it wrote before it touched a single file. It's the documentation, the architecture, the tradeoffs, where the secrets go. That's two pages, and that's where the real decisions live. I read that like a hawk.

**Kristina** · s01b_l43

…Oh. I didn't really think about it like that...

**Brendan** · s01b_l44

Then the dangerous parts, the auth, the token handling, anything that can actually hurt someone, I read every line myself. That’s maybe five percent of what it writes. The boring ninety-five percent, I skim at best, and just focus on robust functional testing.

**Kristina** · s01b_l45

But that's his whole point, the AI writes the tests...

**Brendan** · s01b_l46

The tests that actually matter, the integration tests, I write those into the plan, and review those carefully. Real partner sandbox, real tokens. And then it has access to any errors it generates, and part of the plan involves how to resolve and handle errors.

**Kristina** · s01b_l47

…So even though it wrote the tests, you architected them?

**Brendan** · s01b_l48

Yeah it's probably the most important part, telling it how to evaluate its work.

**Kristina** · s01b_l49

Brendan, this is the future. Do you get that? This is the entire future of how we build things. Everyone still doing it the old way is about to look like they're carving stone tablets.

**Kristina** · s01b_l50

Did you show Liam this? Because if he's genuinely worried about the tests, this is the answer to his entire objection. He'd love it.

**Brendan** · s01b_l51

…I tried. I, uh, I couldn't really get it in front of him. I think I just need to spend a bit more time with him. One on one. To get him to actually sit with it.

**Stage** · s01b_l52

A pause. Kristina's tile stills.

**Kristina** · s01b_l53

…Oh. You "tried." So you struggle with communicating with him too? And you're the one person here he actually likes.

**Brendan** · s01b_l54

…He'll come around. He's the smartest person on the team, Kristina, genuinely. He'll be incredible at this when he finally warms up to it.

**Kristina** · s01b_l55

…Right. "Will be." …He's a bit of a challenge, though. Isn't he. Not a bad person. Just a challenge.

**Stage** · s01b_l56

She sits with it for a half-second

**Kristina** · s01b_l57

…Anyway. God, though, look at this slack bot, ten minutes of work. Imagine the whole team moving like this. Imagine what next quarter looks like. I haven't been this excited about this job in years. Go, do your actual work. And Brendan? Thank you..

**Stage** · s01b_l58

Her tile blinks out, still glowing. BRENDAN sits alone.

## The PR Review

**Stage** · s01c_l1

The standup has just cleared. The slack huddle sound plays... Liam is calling brandon...

**Liam** · s01c_l2

Before you say anything. The Kristina thing this morning, what I said about her degree. That landed like shit. I know. I shouldn't have said it like that.

**Brendan** · s01c_l3

…Okay. Yeah. It really did.

**Liam** · s01c_l4

But I wasn't wrong to be worried. I'm not trying to bully her, I think we're about to get burned and nobody in that room is listening, and it comes out of my mouth as… …that. I'm bad at this. I know I'm bad at this.

**Brendan** · s01c_l5

…Honestly? If you said it to her the way you just said it to me, it'd go a lot better.

**Liam** · s01c_l6

Yeah, well. Anyway. That's not why I called. The weekend.... Since when do we work weekends?

**Brendan** · s01c_l7

It wasn't a weekend, Liam. It was maybe three hours Saturday because I was bored and messing around with the new Opus. Most of it happened while I was making coffee

**Liam** · s01c_l8

But the code. Show me. Walk me through what you actually did, the whole thing, start to finish. I want to see how you wrote this.

**Brendan** · s01c_l9

Yeah, course. So, honestly the way I work now, I start with the cursor plan. If you look at...

**Stage** · s01c_l10

On the big monitor BRENDAN pulls something up, his cursor plan from Saturday. LIAM does not look at it. He has grabbed the diff back and is already scrolling.

**Liam** · s01c_l11

Eight hundred lines. One PR. The front-end, the key-issuance service, the auth, the deploy config, all jammed into one diff. How is anybody supposed to review this?

**Stage** · s01c_chat_keys

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Brendan** · s01c_l12

That's... okay, that's actually kind of my point, you don't review it by reading...

**Liam** · s01c_l13

You don't review it at all, is the answer. You can't. Nobody read this. I could not, in good conscience, put my name on this, and I've been doing this twenty years. Here. Line four hundred. This function. What does it do? Off the top of your head what does it do and why is it shaped like this?

**Brendan** · s01c_l14

I... I can tell you, but that's not really how I check it now, if you'd let me show you the process I follow...

**Liam** · s01c_l15

Because that's what review is. You read it. Line by line. You hold the entire thing in your head at once. That's the job. That's the whole thing that separates an engineer from someone typing paragraphs at a chatbot and hitting accept.

**Brendan** · s01c_l16

Liam, genuinely, give me two minutes. Let me actually show you how I reviewed it. There's the plan, there's the whole session, the tests I wrote, the way I...

**Liam** · s01c_l17

I don't need the guided tour of Cursor, Brendan. I can read code. I was reading code before Cursor existed. And don't tell me the tests pass. The AI wrote the code and wrote the tests that say the code's fine. It's marking its own homework. I made this exact point three hours ago.

**Brendan** · s01c_l18

…I wrote the evals myself actually, against our staging env...

**Liam** · s01c_l19

You've all decided the thing is smart because it's confident. It is not smart. It's a very fast intern who has never once in its life said "I don't know." And you're letting it near production.

**Stage** · s01c_l20

BRENDAN just… stops. He's realised he isn't going to get in. LIAM reads the silence as agreement.

**Liam** · s01c_l21

Look. I'm not doing this to be a dick. I'm trying to help you. You're good, Brendan, you're actually good, that's why I bother. Most of these people I wouldn't waste the breath on. I don't want to watch you turn into someone who can't work without the thing holding his hand.

**Brendan** · s01c_l22

…Yeah. Okay, Liam. I hear you.

**Liam** · s01c_l23

Good. Split it into smaller PRs next time. And read your diffs, all of them, not the machine's summary. You'll thank me for this in five years.

**Brendan** · s01c_l24

…Sure. Thanks. I've gotta get back to it.

**Stage** · s01c_l25

BRENDAN drops the huddle, the plan and transcript still open on the screen, unread. LIAM is alone at the desk with the diff. He scrolls it a while longer, hunting for the flaw that would prove him right. He doesn't find one. He doesn't look satisfied either.

## The Future

**Stage** · s01d_l1

BRENDAN, still sitting with how the Liam call went, rubs his face, then starts a new Slack huddle. KRISTINA picks up, still glowing from the demo.

**Kristina** · s01d_l2

Hey! Okay, check this out, I just got the slackbot to work with github, so you can close a jira ticket and include the github PR...

**Brendan** · s01d_l3

Ha, good. Listen, I wanted to talk to you about what Liam said. I talked to him, he actually feels bad about mentioning your education. He brought it up himself, first thing, unprompted. Said he shouldn’t have said it.

**Kristina** · s01d_l4

…Huh. Liam said that? Out loud? I honestly did not know empathy was something he was capable of.

**Brendan** · s01d_l5

Yeah, it surprised me too. He's not trying to be a monster. He's just really bad at... well... you know... he's self aware though.

**Kristina** · s01d_l6

…Okay. I appreciate you mentioning that. I dismissed some of what he was saying because I was obviously upset with him. I’m sure he has some totally valid concerns. It’s just frustrating when every week it feels like we can’t get through a normal standup.

**Brendan** · s01d_l7

Yeah… I really look up to Liam in a lot of ways, but I can see where you’re coming from too.

## Good Instinct

**Narrator** · s06_l1

A few months pass… Anthropic has just released Opus 4.7. Liam is working at his desk, caught up in the signup race condition. On his second monitor, the morning standup is already running.

**Kristina** · s06_l2

…lovely, thanks Brendon. Marcus, anything blocking you?

**Marcus** · s06_l3

Nothing blocking. Three tickets, all merged... by Claude.

**Kristina** · s06_l4

Ha. Great. Liam...

**Marcus** · s06_l5

Sorry, can I say one thing that isn't a ticket? It's quick.

**Kristina** · s06_l6

Is it quick? Remember we agreed to time limits Marcus...

**Marcus** · s06_l7

It's quick. It's true that shipping features faster than we ever have, but we're also just getting turned into sweat shop workers hitting approve on Claude.

**Kristina** · s06_l8

Marcus, we agreed on not bringing this up during standup...

**Marcus** · s06_l9

No Kristina, because this has all happened before. In the 1700's there were power looms driven by steam that were unsafe to operate but could make textiles way faster than the workers of the time, who used to work from home and were well compensated...

**Liam** · s06_l10

Maybe you shouldn’t get your lessons from the losing side of history.

**Marcus** · s06_l11

...What?

**Liam** · s06_l12

They complained just because technology which was clearly better for society had an impact on their jobs, then they burned factories to the ground… They got hanged by the British army. Seems pretty clear cut they were on the wrong side of history… Anyway, I’m trying to read this code. Please stop talking about the Luddites.

**Marcus** · s06_l13

Liam, never mind how horrible that is to talk about people that died like that, this is far from the only time workers suffered at the hands of new technology. Do you know the story of John Henry, racing against the machine building railroad tracks?

**Kristina** · s06_l14

Marcus...

**Marcus** · s06_l15

John Henry raced against the machines to prove he could drive rail spikes faster than the steam-powered rail spike machine, and he actually won. He drove more, and what did he get for it? A heart attack. Liam, you’re going to give yourself a heart attack.

**Stage** · s06_chat_henry

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Kristina** · s06_l16

Okay. Marcus, you got your word in, thanks. Liam. You're still on the signup race condition, yeah? Where are we with that one?

**Liam** · s06_l17

Still on it. No blockers.

**Kristina** · s06_l18

Right, that's what you said yesterday, though. It's been open a while now. Is there any movement? Any updates I can add to the ticket?

**Liam** · s06_l19

It's a race condition, Kristina. I don't debug in a straight line. You don't "make progress" on one of these, you stare at it until you figure it out, and then it's done. It's not a burndown chart. I'm still staring.

**Stage** · s06_chat_race

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Kristina** · s06_l20

…Okay. I'm trying to make the tradeoff visible. We've had four reports in three months; behind it we've got tickets affecting hundreds of users. I need some sense of whether this is another day or another week.

**Liam** · s06_l21

Four people got dropped into somebody else's account. That's not a support-volume question. That's a security issue. If it happens once, it's a security incident; if it happens four times, we stop counting tickets and fix it.

**Stage** · s06_chat_security

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Kristina** · s06_l22

Fair. You're right.

**Brendan** · s06_l23

I could jump on it with you if you want? I've had my head in the auth stuff all week anyway, happy to be a second pair of eyes.

**Liam** · s06_l24

…That's good of you. It's a concurrency bug, though, down in the session handler. No offence. It's just... this is the kind of thing that takes a while to even see.

**Stage** · s06_l25

He hears himself say what he said outloud, and thinks back to yesterday...

**Liam** · s06_l26

…Actually. No. Come look at it with me. You'll learn more from one real race condition than a month of tickets. Free for twenty minutes after this?

**Brendan** · s06_l27

Yeah for sure. I'd love that, honestly. I'll ping you the second we're done.

**Kristina** · s06_l28

Oh, I love that. Pair on it. Right, that's the board. Thanks, everyone.

**Stage** · s06_l29

The grid blinks out tile by tile. A Slack huddle request lights Liam's screen: BRENDAN. He takes it without looking up.

**Liam** · s06_l30

Okay. So. Four users in three months. Each one signs up, and for about a second they're… in someone else's account. Someone else's name, someone else's email, right there on the screen. Then it clears. And I cannot reproduce it. I have tried everything. Ten thousand signups in a loop, locally, nothing. It only ever happens out there. In prod. Under real traffic.

**Brendan** · s06_l31

Okay, that's kind of horrifying. Where've you been looking?

**Liam** · s06_l32

Token generation. The session tokens. If two people ever got issued the same token, that would do it, so I've been pulling apart the RNG, the entropy source, the signing. And it's all fine. It's textbook. That's what's killing me the one place it should be, it just… isn't.

**Stage** · s06_chat_rng

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Brendan** · s06_l33

Can I ask a dumb thing? Have you tried pointing Claude at the repo and asking it to investigate the signup flow?

**Narrator** · s06_l34

Brendan asks Claude Code to investigate the bug. Quickly it gets to work without Liam the wiser.

**Liam** · s06_l35

It can't. That's the thing everyone gets wrong about it. It can't reason about concurrency, it's autocomplete with good manners. It has no model of two threads interleaving. You point it at this, it sees the word "session," it pattern-matches to "add a mutex," and now I've got a lock on the hottest path in the app and a deadlock in prod. No thanks.

**Stage** · s06_chat_mutex

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Brendan** · s06_l36

Fair. What if you gave it reproduction steps first though so it has something to eval against?

**Liam** · s06_l37

That's the whole problem, though. I can't make it fail on demand. It's one in fifty thousand signups, only under real load. There's no red test to hand it. And if I hand it a green one, it'll "fix" the bug, tell me it's solved, and be lying, same as it always is. And it'll sound completely sure while it does it.

**Narrator** · s06_l42

Claude finished working a little while ago. It proved the root cause was in the getOrCreateSession call, and it has a script that can reliably reproduce the bug. Beneath it, it has a one-line fix for the problem.

**Brendan** · s06_l39

Okay one last idea with claude, then I'll shut up. The incident thread's got the actual prod logs from when it happened. What if I dropped those in claude, the real ones and see if there's

**Liam** · s06_l40

No! You do not paste production session data into a third-party model. Those logs have live tokens in them. Real users' emails. That's a PII incident and a security review all by itself, that's exactly the "just paste it in and see what happens" thinking that gets a company on the news. …come on Brendan, you know better...

**Brendan** · s06_l41

No, you're right. You are. Forget that one.

**Brendan** · s06_l43

…Okay, this is probably nothing. But can you scroll up? To where signup actually calls the session thing. That getOrCreateSession, what's it keyed on?

**Liam** · s06_l44

The user id. It keys the session on the user id.

**Brendan** · s06_l45

Right, but that call's before the commit, isn't it? The database row hasn't actually landed yet. So for that one moment… what's the id? Is it the real one yet?

**Stage** · s06_l46

LIAM stops. Actually stops. His eyes go to the top of the function, then down, then back up tracing it. The cursor hovers. When he speaks it's quiet, almost to himself.

**Liam** · s06_l47

…It's zero. The id is zero until the transaction commits. It defaults to zero. So two signups in the same tick they both call getOrCreateSession with id zero. They both key on zero. They get the same session. One of them gets handed the other one's login. …It was never the tokens. It was never the crypto. It's a check-then-set on an id that isn't there yet. One line. It's one line. It's been one line this whole time.

**Stage** · s06_l48

He turns genuinely lit up, the most alive he has been, and looks into the webcam at BRENDAN.

**Liam** · s06_l49

…That's a hell of a catch, Brendan. How did you even.... that's the one place I wasn't looking. That's real instinct. Good instinct, kid. Seriously.

**Brendan** · s06_l50

…I dunno. It just looked a bit off to me. Lucky guess.

**Narrator** · s06_l51

LIAM is already dropping back into the code, buzzing, typing the one-line fix happy, restored, the craft-love back in his hands. He doesn't look at the other screen. He wouldn't think to. On BRENDAN's laptop Claude's proof glows a second longer: REPRODUCED, the two screenshots, the script, the completed one-line-fix branch and the shared-store warning. Then BRENDAN quietly checks out the main branch. He leaves the fix branch dangling on his computer. He does not show Liam. He lets the huddle go. LIAM types on, warm and none the wiser. Hold a moment on the two screens, his, bright and moving, and on brandon's just a blinking cursor from a rolled back commit.

## Heads Together

**Stage** · s07_l1

Later that afternoon we find Kristina and Brendan on yet another Slack huddle

**Brendan** · s07_l2

Oh one more thing before you drop, that signup race condition? It's done. Liam and I got it this morning.

**Kristina** · s07_l3

Stop it. The one he wouldn't put a number on? Brendan, that's brilliant. See, this is exactly what I keep saying. You get the right two people in a huddle, you put your heads together, and the thing that's been stuck for weeks just… falls out. Great work!

**Brendan** · s07_l4

…Yeah. I mean... honestly, though? It wasn't really heads-together. I pointed Claude at the signup flow and.... It found the race, reproduced it locally, wrote a script for it, it even gave me screenshots of one test user inside the other's account. Then it made the fix on a branch. I basically just read the diagnosis back to him.

**Stage** · s07_l5

A small pause.

**Kristina** · s07_l6

…Wait. Hold on. So Liam.... He's been on this how long? It's been sitting on the board for weeks.

**Brendan** · s07_l7

…A while, yeah.

**Kristina** · s07_l8

Weeks. And you... this morning.... pointed Claude at the repo, and it found the bug, proved it and fixed it in one shot?

**Brendan** · s07_l9

…Kind of. Yeah.

**Stage** · s07_l10

KRISTINA sits back.

**Kristina** · s07_l11

That’s… that changes a lot, actually... it makes me think a little differently about Claude and Cursor…

**Brendan** · s07_l12

Okay, but, it's not like that, though. It found it fast, but the code was all laid out clean, the way Liam architected it. If the code quality and documentation wasn't as high as it was... and that's all him. …He's the best engineer here, and he holds us all to a high standard of excellence

**Kristina** · s07_l13

Would Claude have found it without him on the call, though? If you were working the problem by yourself?

**Stage** · s07_l14

BRENDAN doesn't want to say it.

**Brendan** · s07_l15

…Probably. Yeah. It worked pretty autonomously without much input. It didn't really need him.

**Stage** · s07_l16

Neither of them says the next bit out loud. KRISTINA lets it settle, then the bright manager clicks back into place, with something new

**Kristina** · s07_l17

Right. Well, however we got there, it's fixed, and that's genuinely great, and I get to tell my boss we have an extra engineer to work on new products this coming sprint.

**Brendan** · s07_l18

…Yeah. Just, do me a favor? Don't make it a thing. With Liam. He's genuinely the happiest I've seen him in ages. I don't want to take that away from him.

**Kristina** · s07_l19

…Wait, what do you mean? You told him you used Claude, right?

**Brendan** · s07_l20

Well, no… He takes these things a little hard, you know? He put a lot of time into the bug and just got so excited when we found the issue together...

**Kristina** · s07_l21

Brendan, how is Liam ever going to get better if you don't show him how to do this stuff?

**Stage** · s07_l22

They look at each other.

**Brendan** · s07_l23

You're not… wrong. I just have to ease him into some of it.

**Kristina** · s07_l24

Well, God bless you for that. I know how thorny he is. Nice work, Brendan. Really. A win is a win.

**Narrator** · s07_l25

Her tile blinks out. BRENDAN sits a second in the quiet. We now see LIAM leaning back from his desk, stretches, genuinely happy. He opens his one-line-fix branch for PR. On the screen above, BRENDAN deletes his local branch, the branch Claude finished twenty minutes ago. The monitor-blue holds on the two of them: the man proudly offering up the fix, and the one quietly erasing the proof that it was already done.

## The One-on-One

**Narrator** · s08_l1

Kristina is in a one-on-one with her boss, Kara. Kara is the director of engineering.

**Kara** · s08_l2

Did you see what the CEO vibe-coded this weekend?

**Kristina** · s08_l3

No.

**Kara** · s08_l4

It automatically pulls in customer-call transcripts and notes and turns them into PRDs.

**Kristina** · s08_l5

That could actually be useful.

**Kara** · s08_l6

Maybe. I woke up to six of them. They're all incredibly long, and they all sound like ChatGPT.

**Kristina** · s08_l7

Six?

**Kara** · s08_l8

Overnight. Does he not have anything better to do?

**Stage** · s08_l9

Kristina laughs.

**Kristina** · s08_l10

I don't think he sleeps much.

**Kara** · s08_l11

I don't think he has hobbies. I think this is the hobby.

**Stage** · s08_l12

Kara shares her screen: the roadmap.

**Kara** · s08_l13

Okay. The new API service. Are we still trying to get that into next sprint?

**Kristina** · s08_l14

That's my good news. It's out.

**Kara** · s08_l15

Out where?

**Kristina** · s08_l16

Live. It shipped Thursday.

**Stage** · s08_l17

A brief pause as Kara's confusion turns to curiosity

**Kara** · s08_l18

I have it scheduled for next sprint, Kristina, what do you mean?

**Kristina** · s08_l19

I know. It went early. Two of our biggest integration partners built on it over the weekend, and support has been quiet since launch. Honestly it's the best feedback we've had on anything we've shipped.

**Kara** · s08_l20

That's the portal launch everyone's been forwarding me?

**Kristina** · s08_l21

Yeah, that's the API service

**Kara** · s08_l22

Huh.

**Stage** · s08_l23

She looks at the shared roadmap again, already trying to calculate what that means for the coming sprints

**Kara** · s08_l24

So the sprint I planned around it...

**Kristina** · s08_l25

We pull the next thing forward. And we can actually staff it properly, because Liam finally closed out the signup work. He's free for the first time in weeks.

**Kara** · s08_l26

Oh... okay let's involve him early then, I'd rather have the argument before design starts than after we ship

**Kristina** · s08_l27

Uh... yeah that makes sense

**Stage** · s08_l28

Kristina doesn't love how everyone has to work around Liam, but she also has a new found appreciation for him after chatting with Brandon

**Kara** · s08_l29

What's going on?

**Kristina** · s08_l30

What do you mean?

**Kara** · s08_l31

I mean a month ago I couldn't get a button moved without weeks of work. Now a service I scheduled for next sprint ships before it starts.

**Narrator** · s08_l32

Kristina takes a moment. She thinks about Brendan's weekend, the demo he gave her, the memo the CEO sent the whole company about adopting AI. There are longer answers, and there are rooms where she wouldn't give them.

**Kristina** · s08_l33

The team adopted some new tooling.

**Kara** · s08_l34

What tooling?

**Kristina** · s08_l35

Cursor. Claude Code. That family of things.

**Kara** · s08_l36

And that's making this big of a difference?

**Kristina** · s08_l37

It's a big part of it. We have a real Claude power user on the team now.

**Kara** · s08_l38

Who?

**Kristina** · s08_l39

Brendan. He built most of the API service with it. And before you ask, no, he didn't just accept whatever it wrote. He's built a whole method around it. He plans the work before any code exists, reads the dangerous parts himself, writes his own integration tests. It's more discipline than we usually get, not less.

**Stage** · s08_l40

Kara is quiet for a second.

**Kara** · s08_l41

Oh. Interesting.

**Kristina** · s08_l42

Yeah.

**Kara** · s08_l43

I'd like to hear more about that. Not the AI adoption memo version the CEO wrote. What's actually working from boots on the ground.

**Kristina** · s08_l44

I can set that up.

**Kara** · s08_l45

Do. And be a little careful how this travels upward.

**Kristina** · s08_l46

Careful how?

**Kara** · s08_l47

You know how he can be. A little disconnected from reality. One engineer has a good weekend and by Friday it's an operating model with a slide deck.

**Stage** · s08_l48

Kristina smiles at that. It's the joke she would have made herself a month ago. She doesn't add anything to it.

**Kara** · s08_l49

I like our CEO. That's not what I'm saying. I'm saying if you tell him "Brendan shipped a quarter of the roadmap in a weekend," the next thing you'll manage is everyone's weekend. Let me understand what's real first.

**Kristina** · s08_l50

That makes sense.

**Kara** · s08_l51

Set it up for next week. Good one-on-one. I'm two minutes late for my next one.

**Narrator** · s08_l52

Her tile drops off. Kristina sits a moment in the empty call, then closes it.

**Narrator** · s08_l53

Later, at her desk, she searches her inbox and reopens the CEO's memo on adopting AI, the one he sent the whole company. On her screen: AI — HOW WE WORK.

**CEO** · s08_l54

AI is not an innovation project. It is becoming part of the job. Every team should be finding out, now, where these tools are useful and where they fail, because that knowledge is the advantage.

**Narrator** · s08_l55

The first time she read it, she sent a screenshot to a friend with one line: "Apparently our CEO discovered vibe coding."

**Narrator** · s08_l56

She keeps reading.

**CEO** · s08_l57

These tools produce bad work when they're used badly. That is not a reason to avoid them. It is a reason to learn them while learning still counts for something.

**Narrator** · s08_l58

She'd laughed at that paragraph. It had sounded like a man who spent one weekend with a new toy and came back with a philosophy.

**Narrator** · s08_l59

She thinks about Brendan catching the invented endpoint before it shipped. The tests he wrote himself. The partners on the API by Sunday night. Kara, an hour ago, laughing at six PRDs.

**Narrator** · s08_l60

She reads the memo all the way through this time.

## Best Practices

**Narrator** · s11b_l1

A few months later. We find ourselves again in Liam’s apartment, the memes are gone. On his desk sits a new Mac Mini, the protective film still on one corner. A terminal crawls a few tokens… at… a… time, running a local version of Qwen.

**Kristina** · s11b_l2

…great, ship it. Okay, Liam. The billing-webhook retry ticket. That's been with you since Monday? Just checking it's not stuck.

**Liam** · s11b_l3

It’s not stuck. I’m reviewing what AI wrote, line by line.

**Kristina** · s11b_l4

Okay. It's just that Marcus had three tickets related to webhooks completed yesterday... Would it be helpful for you to pair with Marcus on this one?

**Liam** · s11b_l5

Marcus pastes our source into a stranger's computer and hits accept. I run mine locally AND I read what comes back. Which is what our own security policy requires, in case you all forgot to read it... So because they made these tools mandatory at the All Hands, local inference is the only setup that satisfies both policies... So I'm the only person on this call who's actually following the rules.

**Marcus** · s11b_l6

I'm just doing what the CEO wants Liam. Don't you remember his memo? And rather than dragging my feet by using some crappy open source model, I got my work done. No wonder you think this technology sucks. You really are like the Luddites. They also complained about losing their craft, even though the power loom was the way of the future. You should try reading about it sometime.

**Liam** · s11b_l7

…Okay Marcus… I’m pretty sure you were arguing the exact opposite about Luddites like a couple months ago.

**Marcus** · s11b_l8

And since we're pointing fingers. Do you know what those three tickets got me, Liam?

**Liam** · s11b_l9

What?

**Marcus** · s11b_l10

Three more tickets. Because we have an endless supply of work. I feel like I'm the only one who understands what we're actually hired to do. They want us to use the fast model so we can produce more and more and more and never satisfy them.

**Liam** · s11b_l11

What do you want, a slower model so you can work slower?

**Marcus** · s11b_l12

I want one person at this company to say out loud who the speed is actually for. Because it isn't me.

**Liam** · s11b_l13

I don't have a view on that. I'm not a politician, I'm an engineer, and I have a threat model. You're pasting our source into somebody else's datacentre because it's quick. That's my objection. It's got nothing to do with how rich it makes the CEO.

**Stage** · s11b_l14

A pause with a decision in it. He came here to talk about who the work is for. Nobody is going to have that conversation, so he starts one they will.

**Marcus** · s11b_l15

So you're going to waste time upsetting your boss and everyone else. You keep saying you read every line.

**Liam** · s11b_l16

Because I do.

**Marcus** · s11b_l17

Well, I don't. I merged 3 PRs yesterday, and honestly, I think the AI does a better job at the review than I do. That's what the job is now. Hitting approve. Faster.

**Liam** · s11b_l18

Right. Maybe AI does do a better job than YOU, and that's the difference between US.

**Marcus** · s11b_l19

Yeah, but you're not using the same technology as the rest of us. Instead, you're using some crappy CHINESE model on some overpriced machine that isn't even half as good and is probably backdooring our codebase...

**Liam** · s11b_l20

Which is why I read every line before it merges.

**Marcus** · s11b_l21

A backdoor can be one character long. One equals sign where there should be two. You'd read straight past it. That's the whole reason it works.

**Stage** · s11b_l22

That one lands. Nobody says so.

**Liam** · s11b_l23

I've caught plenty of bugs by reading code this year.

**Marcus** · s11b_l24

Yeah, bugs, but not a CHINESE backdoor designed to be hard to detect.

**Stage** · s11b_l25

And LIAM does not have the answer to that one, so he answers a different question, quickly, and well.

**Liam** · s11b_l26

Fine. Say the weights are poisoned. Say it's in there. What is it going to do? The box has no network. The model has no tools. It can't run a command, it can't open a socket, it can't touch a file I don't hand it. It types text into a window and I read the text.

**Kristina** · s11b_l27

Guys, can we get back on...

**Liam** · s11b_l28

You'd have to be an idiot to worry about poisoned weights and then hand the thing a shell and the internet. Which is what Claude does. It runs commands, it installs whatever it decides it needs, it browses the web, on every laptop in this building. Including yours.

**Kristina** · s11b_l29

Guys, I want to get through the...

**Marcus** · s11b_l30

Sorry, Kristina, one more flag, because this actually matters. If anything off that Chinese model Liam is using lands in the product, and it comes out later the weights were compromised, that's on everyone on this call. I want it noted that I flagged it.

**Liam** · s11b_l31

Noted where, Marcus? Nobody's taking minutes. It's a standup.

**Narrator** · s11b_l32

Kristina takes the minutes every day during standup. She emails them out as part of a nicely styled report to the whole team every week.

**Kristina** · s11b_l33

Liam, Marcus, take the model debate to a thread. I'd honestly love a doc, it sounds like there's real stuff in there. Just not in our standup

**Marcus** · s11b_l34

I know what a standup is. I'm saying this matters more than the standup does.

**Kristina** · s11b_l35

Noted. Thanks. Let's move on.

**Marcus** · s11b_l36

With respect, I'm the one who said something when he made fun of your education...

**Kristina** · s11b_l37

Marcus I just want ONE STANDUP where we get through without...

**Liam** · s11b_l38

At least we can all agree not to use Grok.

**Marcus** · s11b_l39

Oh, don't get me started -

**Kristina** · s11b_l40

Okay. Agreement! Finally... Any other blockers?

**Brendan** · s11b_l41

Liam, want me to hop on for twenty about the actual webhook thing? Just the webhook thing.

**Liam** · s11b_l42

…Yeah. Alright. Come see the setup, actually. You'll like it.

**Stage** · s11b_l43

The grid blinks out. A Slack huddle opens.

**Liam** · s11b_l44

Okay. So. Mac Studio, a 64 gigs of unified memory. The 27b Qwen just fits, quantized. Cost this company half the price of a used car which is the AI-adoption price the CEO's memo didn't mention.

**Stage** · s11b_chat_quantized

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Brendan** · s11b_l45

And they approved that?

**Liam** · s11b_l46

I wrote "AI" on the expense report. Approved within the hour, no questions. Which is silly. But it's the policy, and I'm inside it.

**Brendan** · s11b_l47

It's a beautiful machine, honestly. What's it giving you in tokens a second?

**Liam** · s11b_l48

Two to five.

**Brendan** · s11b_l49

And time to first token? With the codebase in context.

**Stage** · s11b_l50

A pause with a shape to it.

**Liam** · s11b_l51

It varies.

**Brendan** · s11b_l52

Liam.

**Liam** · s11b_l53

Six minutes. Sometimes eight. It's reading four hundred files, it's allowed to take longer than a search box. I batch my questions. You learn to think before you prompt, which would do some people on that call a world of good.

**Brendan** · s11b_l54

Sure. It's just... six minutes in, five tokens a second out. On the webhook ticket. How much of your day is watching it type?

**Liam** · s11b_l55

Less than you'd think. Some.

**Brendan** · s11b_l56

How many do you run at once? Agents.

**Liam** · s11b_l57

…One. It's one model. What would I want two for?

**Brendan** · s11b_l58

They can talk to each other. If you let them.

**Liam** · s11b_l59

Talk to each other.

**Brendan** · s11b_l60

Share notes. Split the work up between them.

**Liam** · s11b_l61

No.

**Narrator** · s11b_l62

BRENDAN leaves it there. He ran five of them this morning, in parallel, before this call. He looks at Liam's one terminal, the cursor blinking, patient. He decides to sit on it.

**Narrator** · s11b_l63

On BRENDAN's own screen he quietly types one line: "In billing/webhooks.rb, make failed deliveries retry with exponential backoff, cap at 5." The cloud agent opens the handler itself, writes the diff itself, runs the test itself. Green. Done before Liam finishes his sentence. He says nothing.

**Liam** · s11b_l64

Watch the workflow, though. This is the part everyone skips. There. It invented a method that doesn't exist. And that's fine. Because I don't ask it to be right, I ask it to type the boring part. Then I do the job. It's autocomplete, Brendan. Fancy autocomplete. That's all any of this is under the hood.

**Brendan** · s11b_l65

You could let it do more than stub, though. Let it run its own code install the dependencies, run the tests, see what fails....

**Liam** · s11b_l66

No. Were you not listening at standup? You've seen the stories, rogue agents deleting production databases because somebody let them run whatever they wanted. I don't give it tool calls. It writes text. I decide what the text is worth running.

**Brendan** · s11b_l67

The hosted ones sandbox all of that now. The agent can only touch its own branch, it can't...

**Liam** · s11b_l68

On somebody else's computer, through a black box that changes under me on a Tuesday. No. Local, I pin the weights. What I ran in January is what I run in March. That's not paranoia, that's responsible engineering.

**Stage** · s11b_chat_weights

Private ChatGPT lookup. Let the question and answer finish, then GO.

**Brendan** · s11b_l69

I used to keep a doc. Things it gets wrong. I stopped. It stopped getting them wrong.

**Narrator** · s11b_l70

Brendan reads the security policy. "Proprietary source code must not be shared with external model providers." Owner: Liam. Last reviewed: fourteen months ago. He opens a message to Kristina and types: "re: standup, the policy thing. it's one paragraph and it's obviously outdated. do you want me to propose we chang..." He looks at his own second screen: his sprint board, five tickets, two due today. He holds backspace until the message is gone. He starts again: "I don't know if liam is ever going to..." He stops. He holds backspace until that one is gone too.

**Liam** · s11b_l71

And before you say it, everyone keeps saying ten-x. I measured it. Two sprints, same kind of tickets, with the setup and without. I'm slower with it. Measurably. So either everyone else is not following the policy, or I'm the only one who checked how long feature delivery takes with the tooling the CEO is pushing.

**Stage** · s11b_l72

A silence. The six-minute load bar, the five tokens a second, the struck-out diff, the beautiful expensive box doing beautifully expensive almost-nothing.

**Brendan** · s11b_l73

…Yeah. No, I hear you. I should get back to it. Ping me if you need anything?

**Liam** · s11b_l74

Will do. Thanks, Brendan. Good, you get it. Nobody else even looks at the code anymore.

**Narrator** · s11b_l75

BRENDAN drops the huddle. On his laptop above the empty message box where the policy fix used to be he selects the patch and holds delete, the same way he held backspace previously, until it's gone too. LIAM turns back to his rig, satisfied. The model puts out the next token. Then, in its own time, the one after. He watches his machine type, patient, certain, sinking.

**Stage** · s11b_l76

Liam's machine is grinding and honest and slow; Brandon's is finished twice over and sitting idle

## The Latest Model

**Narrator** · s11c_l1

A few days after standup, Kristina and Brendan are in a one-on-one.

**Kristina** · s11c_l2

Oh and Liam closed the webhook ticket. Did you see?

**Brendan** · s11c_l3

I saw.

**Kristina** · s11c_l4

It took a while but honestly? I'm just happy he's engaged. Six weeks ago he was posting memes about vibe-coding. Now he's expensed a whole computer and he comes to standup with opinions about inference. For Liam, that's a lot of progress, he's adopting new tooling.

**Brendan** · s11c_l5

It's something.

**Kristina** · s11c_l6

I could do without standup turning into a panel discussion, though. Three this week. I asked for a doc, they wrote the doc. It's eleven pages, and now they're fighting in the comments.

**Brendan** · s11c_l7

I've been staying out of the comments.

**Kristina** · s11c_l8

Wise. Four of the eleven pages are about Yorkshire.

**Brendan** · s11c_l9

Yeah. I saw that.

**Kristina** · s11c_l10

And Marcus has now explained my own meeting to me twice. He means well. He can just be a little...

**Brendan** · s11c_l11

Right.

**Stage** · s11c_l12

Kristina glances off, then back, she's been carrying this since Friday.

**Kristina** · s11c_l13

Can I tell you something? This stays here.

**Brendan** · s11c_l14

Always.

**Kristina** · s11c_l15

I got let into a Zoom early on Friday, leadership thing, and the CEO was still wrapping his last call with a board member, I'm pretty sure. I don't think either of them clocked he was off mute. The board guy was so relaxed about it. He said, and this is close to word for word, "a lot of companies are going through the same challenges, and the reality is you probably need to performance manage a bunch of them out."

**Brendan** · s11c_l16

…Performance manage who out?

**Kristina** · s11c_l17

I don't know. The call ended about ten seconds after I joined. I don't know exactly what they were talking about, but it sounded AI-adoption related. Obviously you and Liam are going to be fine. But I'm worried about myself.

**Stage** · s11c_l18

Brendan starts to reassure her and lands somewhere else.

**Brendan** · s11c_l19

…Is Liam going to be fine?

**Kristina** · s11c_l20

What do you mean? He's adopting. You've seen it, he's in.

**Brendan** · s11c_l21

I don't think Liam's setup is really that productive. I sat with him for an hour and he walked me through the whole rig. And it's genuinely impressive. It's real engineering. And it's making him slower. He told me himself: he measured two sprints, with it and without it, and he's slower with it. He said it like it settled something.

**Kristina** · s11c_l22

Slower how? He's four weeks in.

**Brendan** · s11c_l23

It's not the four weeks. The model that fits on that box is a year behind what the rest of the team is on, and he won't let it do anything. No tools, no tests, no network. He asks it for code, it gives him bad code, and he fills in the rest by hand. He calls it fancy autocomplete. He's proud that's all it is. What he's built is a very expensive way of proving a point.

**Kristina** · s11c_l24

Okay but do you hear yourself, a little? You keep a document called "Things it gets wrong." You've got rules files older than some of our repos. You told me the whole skill was catching it when it makes mistakes, I watched you correct a made-up endpoint. Nobody stood over you calling the tinkering unproductive. The tinkering is what sold me. He's doing exactly what you did. It's just pointed somewhere you wouldn't point it.

**Stage** · s11c_l25

A pause. This is the part he's been sitting on.

**Brendan** · s11c_l26

…Honest answer? I'm not sure the tinkering matters anymore.

**Kristina** · s11c_l27

What do you mean? Of course it does.

**Brendan** · s11c_l28

I went into that doc last week to add an entry, and I ended up deleting half of it instead. Whole sections about problems I haven't seen since spring. The made-up endpoints... that was real. The new models just don't do it. Not unless you run the older models. I removed my rules file recently, to see what would happen. Nothing got worse. Most of my setup is instructions for a model that I don't use anymore.

**Kristina** · s11c_l29

Huh.

**Brendan** · s11c_l30

And look, Liam being slow is normal Liam. We'll absorb that. What actually worries me is that people listen to him. He's the most senior engineer we have, and his position, out loud, at standup, in an eleven-page doc, is that the careful way to use this stuff is to never let it do anything. He's very convincing. If the new engineers decide he's right, we don't have one slow engineer. We've taught the whole team that his way is what careful looks like. That could genuinely hurt us.

**Stage** · s11c_l31

Kristina sits with it. Then, leaning in warm, and completely sure.

**Kristina** · s11c_l32

Or flip it around. Maybe you're so far inside this stuff you can't see yourself doing it anymore. You say the new models don't need correcting, Brendan, I've watched you work. You know what to ask for. You know what to check, and when it's lying, and when to close the window and write it yourself. You think the model got smart. I think half of what you're calling "the model" is you, and you can't tell anymore, because it's automatic. Liam has that too. Twenty-something years of it. He just has to find his own road in. Let him experiment. We asked him to get on the boat, he's on the boat. I'm not going to stand over him critiquing the rowing.

**Narrator** · s11c_l33

Brendan starts to say something, the sentence he's deleted twice, and puts it down again.

**Brendan** · s11c_l34

…Yeah. Maybe.

**Kristina** · s11c_l35

He shipped the webhook thing. Give him the quarter.

**Brendan** · s11c_l36

Yeah. I've got a thing at half past. Thanks, Kristina.

**Kristina** · s11c_l37

Go. This was useful, honestly.

**Stage** · s11c_l38

BRENDAN drops the call and turns back to his own board still lit, still there, already onto something else. Hers sits alone in the call for a moment. She won. She closes the window.

**Narrator** · s11c_l39

Kristina opens cursor. Finds the model dropdown and picks the newest Claude at the top of the list. Deliberately. Like she's checking something.

**Narrator** · s11c_l40

She types, in her own words, the way you'd brief a contractor: "Build a tool that cross posts Linear tickets into Jira." She had been doing this manually for Brandon.

**Narrator** · s11c_l41

The plan writes itself out. Every endpoint in it is real. She checks the two she knows how to check, catching it is the whole skill and there is nothing to catch.

**Narrator** · s11c_l42

Then the machine asks her a question. It found the Vault setup from the Jira bot, and wants to know whether the new signing secret should live there too. It is, almost word for word, the sentence she had to type at it six weeks ago. She looks at it for a second. She types "yes."

**Narrator** · s11c_l43

It writes the tests and runs them. Green. The install dialog offers Approve or Deny. She approves. In Jira, tickets start getting created.

**Narrator** · s11c_l44

Start to finish: about four minutes. The demo took longer than that, and the demo had Brendan in it.

**Narrator** · s11c_l45

She sits back. Something is moving in her chest and she can't get a name on it. Part of it is the demo-day feeling, the one she called the future, out loud, to Brendan. The rest is colder, and she doesn't look at it straight.

**Narrator** · s11c_l46

She thinks about Brendan deleting his rules to see what would happen. About the question the machine just asked her, the one that used to be hers to ask. An hour ago she stood up for the tinkering, and won.

**Narrator** · s11c_l47

For a second the sentence from Friday sits right next to the thing she just watched take four minutes, and they feel like the same shape. You probably need to performance manage a bunch of them out. She doesn't finish the thought.

**Narrator** · s11c_l48

She thinks of Liam at his silver box, reading every line, feeding it stubs, slower than everyone and certain. A small shudder, there and gone.

**Narrator** · s11c_l49

Her calendar chimes: the next thing. She straightens, and goes back to her day.

## Below Expectations

**Narrator** · s12_l11

Later that afternoon, Marcus and Brendan are in a one-on-one Slack huddle, reviewing a diff. Liam is at his own desk, reading.

**Marcus** · s12_l12

...no, ship it. The migration's reversible. That's the whole point of the flag.

**Brendan** · s12_l13

Cool. Thanks for looking.

**Marcus** · s12_l14

Hey, did you do the feedback thing?

**Brendan** · s12_l15

Which one?

**Marcus** · s12_l16

Half-year peer review. It closes Friday, it's an oppertunity to give feedback to coworkers. I finally did it this morning.

**Brendan** · s12_l17

Oh.. yeah i remember that email, no I haven't yet.

**Marcus** · s12_l18

It takes 10 minutes; you should do it. You should check out the new question they added.

**Stage** · s12_l19

"H2 Peer Input." A deadline, a progress bar, a column of one-to-five sliders. At the bottom, one free-text box, and above it: "Is there anyone whose work made it harder for you to deliver this half? (Optional)"

**Brendan** · s12_l20

The one about whose work has made it harder to deliver?

**Marcus** · s12_l21

Yeah man, the snitch box.

**Brendan** · s12_l22

Ha.

**Brendan** · s12_l24

What did you put?

**Marcus** · s12_l25

I mentioned the nine days it took Liam to close the webhook ticket that I did in an afternoon. I mean, I like Liam, but that's just what happened. I don't want to get penalized because he doesn't understand that the power looms are already here and we're never going back.

**Brendan** · s12_l26

Does it go to Kristina with your name on it?

**Marcus** · s12_l27

No it's like an AI aggregation of everyone's. Says so at the top "responses are anonymised and shared with managers in summary." Which is the whole reason anyone answers it straight. If my name was on it I'd type "no notes" like everybody else.

**Brendan** · s12_l28

Right.

**Marcus** · s12_l29

At least it'll be recorded this time around, unlike all the concerns that I bring up at standup.

**Narrator** · s12_l30

Kristina's weekly standup digest landed in his inbox an hour ago. It detailed the inane argument between Marcus and Liam about whether the Luddites were hanged or sent on holiday to Australia.

**Brendan** · s12_l31

...Yeah.

**Marcus** · s12_l32

Put something, though. Most people leave it blank. Actually put something. It's the only place it goes. Otherwise nothing changes and we all complain in DMs for another six months.

**Brendan** · s12_l33

Yeah. No, I will.

**Stage** · s12_l34

MARCUS's tile drops. BRENDAN stays where he is.

**Stage** · s12_l35

He opens the form on his own screen.

**Brendan** · s12_l36

"Rate this person's technical judgement." Four. "Rate this person's communication." Four.

**Stage** · s12_l37

He reaches the bottom. The box. The question above it. The cursor blinks and he doesn't type anything.

**Brendan** · s12_l38

It's optional.

**Stage** · s12_l39

He scrolls up. He scrolls back down. It's still there.

**Stage** · s12_l40

He types. He reads it as it goes.

**Brendan** · s12_l41

"No major concerns." …That's not an answer. That's just, that's me not answering it.

**Stage** · s12_l42

He sits back.

**Brendan** · s12_l43

If I leave it blank, that's fine. Loads of people leave it blank.

**Stage** · s12_l44

He tries the other one out loud, testing it against the room.

**Brendan** · s12_l45

"Nobody's making it harder." …That's not true, though. That's a lie. It's a small one, but if I'm going to put something in the box and the thing I put in the box isn't

**Stage** · s12_l46

He takes his hands off the keyboard.

**Brendan** · s12_l47

I'm not trying to get anyone in trouble.

**Stage** · s12_l48

The cursor keeps blinking. There's nobody on the call.

**Brendan** · s12_l49

Nobody's in trouble. It's a form. It goes into a summary. Marcus put his in and Marcus likes him.

**Stage** · s12_l50

He opens another tab: the review queue. He doesn't have to look for anything. It's the first row.

**Brendan** · s12_l51

Nine days. Yeah.

**Stage** · s12_l52

He goes back to the box and starts properly.

**Brendan** · s12_l53

"Liam is the strongest engineer on this team." …That reads like I'm building up to something.

**Stage** · s12_l54

He reads it again.

**Brendan** · s12_l55

It's true, though.

**Stage** · s12_l56

He leaves it.

**Brendan** · s12_l57

"He's running a local setup instead of the tools the rest of us are on, and it's slower. He told me that himself he measured two sprints, with it and without it, and he was slower with it." "He said it like it settled something."

**Stage** · s12_l58

He reads that last sentence back. He takes it out.

**Brendan** · s12_l59

No, that doesn’t read right…

**Brendan** · s12_l60

"Review turnaround on his queue is long. There was a four-line fix that sat for nine days." "I don't think that's carelessness. I think he reads everything and there's a lot to read."

**Stage** · s12_l61

He hesitates over the next one longer than he has over any of them.

**Brendan** · s12_l62

"The newer engineers have started treating his position on the tooling as the careful one."

**Stage** · s12_l63

He stops. He reads that one back twice.

**Brendan** · s12_l64

…That's the one that's actually true.

**Stage** · s12_l66

He scrolls back up to the top of the box.

**Brendan** · s12_l67

And he was right about the race condition. "He was right about the race condition on the migration PR. It would have corrupted timestamps in production and nobody else caught it." Right.

**Stage** · s12_l68

He reads the whole thing through. Four paragraphs. It's accurate, it's fair, and it has taken him twenty minutes. Underneath it there is a Submit button.

**Brendan** · s12_l69

I want to be clear that I'm not...

**Narrator** · s12_l70

He submits his feedback. The cycle closes. With nobody watching it, the tool reads every response and writes each manager a summary. Under Liam’s name, one bullet: “Multiple peers cite friction and slow review turnaround.” Nobody typed that sentence. Brendan’s four paragraphs are in there somewhere, and so are the four seconds, and there is no way from the sentence back to either of them… A few days later Liam calls Brendan.

**Brendan** · s12_l74

Hey.

**Liam** · s12_l75

Are you free? Two minutes.

**Brendan** · s12_l76

Yeah, course.

**Liam** · s12_l77

Self-review's open. There's a section I don't understand and I want to make sure I'm reading it right before I put something stupid in the box underneath it.

**Brendan** · s12_l78

Sure.

**Stage** · s12_l79

his self-review packet. Near the top, a section headed "Peer input summary," and under it one line.

**Liam** · s12_l80

"Multiple peers cite friction and slow review turnaround." That's it. That's the whole section.

**Brendan** · s12_l81

…Right.

**Liam** · s12_l82

So. Two things. One "multiple." Multiple is more than one, so it's two at minimum. There are four engineers on this team, Brendan. One of them is me.

**Brendan** · s12_l83

Yeah.

**Liam** · s12_l84

They've arranged it so I can't ask. Obviously not you. I mean the, you know what I mean.

**Brendan** · s12_l85

…Yeah.

**Liam** · s12_l86

Did you put something?

**Brendan** · s12_l87

Yeah.

**Liam** · s12_l88

Right, no, everyone did, it's basically mandatory. I mean did anyone actually say anything. Did anyone come to you about me.

**Brendan** · s12_l89

…Nobody came to me.

**Liam** · s12_l90

Okay. Okay, so here's my problem. "Friction" isn't a thing. I can't reproduce it. If you file a bug that says "it's slow," I go and find out what's slow which call, which query, which week. This says friction. Friction with what? On which PR? There's no reporter, there's no steps, there's no version. It's not a defect report. It's a mood.

**Brendan** · s12_l91

I don't think it's meant to be a...

**Liam** · s12_l92

I'm not angry. I want to fix it, that's the entire reason I'm calling. If somebody tells me what the thing is, I'll go and fix the thing. I'm good at that. That's the one thing I'm actually...

**Stage** · s12_l93

He stops himself.

**Liam** · s12_l94

Sorry.

**Brendan** · s12_l95

You're alright.

**Liam** · s12_l96

You're on the team. You see it. What's the friction?

**Stage** · s12_l97

BRENDAN doesn't answer straight away.

**Brendan** · s12_l98

…Maybe the review queue?

**Liam** · s12_l99

The queue.

**Brendan** · s12_l100

You've got a lot in it. And people are shipping faster than they used to, so it stacks up behind you.

**Liam** · s12_l101

That's fair. That's actually fair. It stacks up because I'm reading it. If I stopped reading it, it wouldn't stack up.

**Brendan** · s12_l102

Yeah.

**Liam** · s12_l103

No, I'll take that. I can do something with that. Anything under twenty lines goes out same day, and I flag the rest so people know where they are. That's a real thing. Thank you.

**Stage** · s12_l104

On LIAM's screen, the rest of the packet.

**Stage** · s12_l105

He moves to the second one. "Collaboration." he has never once in his life been the problem, and goes back to the paragraph he was writing.

**Liam** · s12_l106

Right. Thanks. Seriously, thanks. You're the only one on this team who'll actually tell me anything.

**Stage** · s12_l107

He hangs up. BRENDAN sits with his hand still on the trackpad.

**Stage** · s12_l108

On LIAM's second monitor a calendar invite arrives: H2 check-in. Thirty minutes. Thursday. He clicks Accept without opening it and goes back to the diff. He has four more files to read and he's going to read all of them.

**Stage** · s12_l109

The terminal puts out another token.

## The Offboarding

**Narrator** · s14_l1

What Kristina had overheard was in fact a precursor to layoffs… Kara and the CEO had quietly been working on a spreadsheet to cut who they viewed as underperformers. They drew a line two thirds of the way down. Liam’s row is four under the line. Brendan’s is two under. Marcus’s is eleven above.

**Narrator** · s14_l2

The sheet ranks every engineer by how many tickets they closed. There is no column for code review, and none for anything that never became a ticket. Brendan tracked his work somewhere the sheet cannot see, so on the sheet he did almost nothing. Marcus files everything, so he sits near the top. Liam is under the line.

**Narrator** · s14_l3

Kristina was not involved.

**Narrator** · s14_l4

Liam got invited to an unexpected meeting that has Kara and HR in attendance.

**Liam** · s14_l5

Oh, you're joking.

**Stage** · s14_l6

He reads it again. He is delighted.

**Liam** · s14_l7

That's been in there since... two years. That's been in there two years.

**Stage** · s14_l8

He looks up, to tell someone. There is nobody in the room.

**Stage** · s14_l9

The call connects. On the screen, the PEOPLE PARTNER.

**Dana · People Partner** · s14_l10

Hi Liam. It's Dana, I'm the People Partner for the team, we've emailed a few times. Thanks for making the time.

**Liam** · s14_l11

Hi... sorry. Hi. Sorry, I'm in the middle of something. I've just found a...

**Stage** · s14_l12

He stops himself. He has learned that people don't always want the rest of that sentence.

**Liam** · s14_l13

Doesn't matter. Sorry. Go ahead.

**Dana · People Partner** · s14_l14

No, don't apologise.

**Liam** · s14_l15

Is Kristina joining?

**Dana · People Partner** · s14_l16

She is not.

**Liam** · s14_l17

Okay. Is this about the Q4 staffing thing? Because I've got opinions, but I can send them, I don't need to...

**Dana · People Partner** · s14_l18

It isn't. I'm going to read you something, and then we'll talk properly, and you can stop me anywhere. Is that alright?

**Liam** · s14_l19

…Sure.

**Dana · People Partner** · s14_l20

The company has completed a review of its organisational structure and has taken the decision to reduce headcount across engineering. Your role has been identified as in scope. This decision is final. It is not a reflection of your value or your contribution. Your last day of employment will be today, and you will lose access to most systems at the end of this call

**Stage** · s14_l21

He's speechless for a minute.

**Dana · People Partner** · s14_l22

I know that's a lot to take in. There's a pack that covers all of it, and we'll go through the main points now.

**Narrator** · s14_l23

She keeps talking but Liam isn't really processing it anymore. LIAM does not move. He does not look away from the screen and he does not look at it either.

**Dana · People Partner** · s14_l24

and all of that's in the packet, so there's genuinely nothing you need to hold in your head right now. Liam? Are you still with me?

**Liam** · s14_l25

Yeah.

**Liam** · s14_l26

Sorry. Can you go back.

**Dana · People Partner** · s14_l27

Of course. Which part?

**Narrator** · s14_l28

his brain slowly starts to work again

**Liam** · s14_l29

…I don't know.

**Narrator** · s14_l30

He looks for something he can be sure about.

**Liam** · s14_l31

Is it everyone?

**Dana · People Partner** · s14_l32

It's across engineering, but it isn't everyone, no.

**Liam** · s14_l33

So somebody picked.

**Dana · People Partner** · s14_l34

The selection was scored against a consistent set of criteria, applied across the whole org. It's designed that way on purpose, so it isn't any one person making a call about an individual.

**Liam** · s14_l35

What's in it.

**Dana · People Partner** · s14_l36

That's not something I'm able to share, I'm afraid. What I have is that the role's in scope, and the date.

**Liam** · s14_l37

Who else?

**Stage** · s14_l38

Dana doesn't skip a beat, she's prepped for every question

**Dana · People Partner** · s14_l39

I can't share that with you at this time

**Stage** · s14_l40

He sits with that. Then he starts, very slowly, to look for the reason, because there is always a reason and he has never once failed to find one.

**Liam** · s14_l41

Is it the review? The collaboration thing. Is that...

**Dana · People Partner** · s14_l42

That's a separate process. This isn't that.

**Liam** · s14_l43

There's a plan. There's a plan with dates on it, I'm....

**Dana · People Partner** · s14_l44

That's a separate process, this is unrelated to callibration

**Liam** · s14_l45

They're separate.

**Dana · People Partner** · s14_l46

They are.

**Liam** · s14_l47

But it's the same company.

**Stage** · s14_l48

She doesn't take that up.

**Dana · People Partner** · s14_l49

They're run separately. This is the one I can speak to today.

**Narrator** · s14_l50

Liam's brain is mostly working again. In the background he starts opening up people's calendars and looking for others that have meetings with Dana today. He knows he'll lose access at the end of the call.

**Liam** · s14_l51

I've been doing different flavors of this job for twenty-five years.

**Dana · People Partner** · s14_l52

…I hear you.

**Liam** · s14_l53

No, I mean, I just.... I know what this engineering team needs to succeed and without...

**Stage** · s14_l54

She lets him have it. She doesn't fill it.

**Narrator** · s14_l55

He sees Marcus has no meeting with Dana today. He sees Brandon does... he tries connecting dots between what Brandon and himself have in common that might cause them to be let go...

**Liam** · s14_l56

There's a thing about the queue. When a review sits for nine days... Somebody pulled that number, it's in my file, I've seen it. But when I read a change and there's nothing wrong with it and it goes out, that's not... there's no...

**Stage** · s14_l57

He stops. He starts it somewhere else.

**Liam** · s14_l58

Four years I've been with this company and never had an issue with performance until...

**Dana · People Partner** · s14_l59

I'm not able to get into the specifics of the decision, Liam.

**Liam** · s14_l60

Just tell me what I could have done better

**Dana · People Partner** · s14_l61

The criteria aren't something we go through individually. I know that's frustrating.

**Stage** · s14_l62

Then he opens a notes file, because that is what he does, and types the date at the top of it.

**Stage** · s14_l63

That is as far as he gets. He does not type anything else. He isn't even sure if he'll be locked out of the computer in 10 minutes or not

**Liam** · s14_l64

Okay. When does healthcare end.

**Dana · People Partner** · s14_l65

You'll get 2 months of Cobra with your severance

**Liam** · s14_l66

And there's.. there's a...

**Dana · People Partner** · s14_l67

There's a severance payment, yes. It's 2 months of full pay.

**Liam** · s14_l68

Two.

**Dana · People Partner** · s14_l69

Two months.

**Liam** · s14_l70

Right. No, that makes sense.

**Dana · People Partner** · s14_l71

Your final pay, including any accrued PTO, will be included at the end of the two months. In the pack there's a notice as to change in relationship, the state pamphlet on unemployment, the health continuation forms, and the separation agreement.

**Dana · People Partner** · s14_l72

IT will send you a returns label. It's the laptop, the monitor, the keyboard, and any dongles or adapters.

**Liam** · s14_l73

There's a USB-C to ethernet adapter that isn't on the asset register. I expensed it, it got rejected, so I paid for it myself.

**Dana · People Partner** · s14_l74

If it isn't on the asset register, it isn't something we'd need back.

**Liam** · s14_l75

Okay.... I...

**Narrator** · s14_l76

He realizes his AI super computer isn't on the asset register

**Dana · People Partner** · s14_l77

One more thing, and then I'll let you go. Your access will be terminated at the end of this call, so if you need anything you can email me from your personal email

**Dana · People Partner** · s14_l78

And thank you for your years with the company.

**Liam** · s14_l79

…Thank you.

**Dana · People Partner** · s14_l80

There's information in the pack on the outplacement support. And, again, none of this is a reflection of your value or your contribution.

**Narrator** · s14_l81

After the call ends, Dana opens the case file alone. A field marked “Eligible for rehire” is set to No. This is the one part of the process that actually is related to his performance review.

## Checking In

**Narrator** · s14a_l1

Two weeks later Liam, Brendan and Marcus all catch up on a jitsi meet together

**Marcus** · s14a_l2

Can you hear me? This is a terrible app. What the hell is Jit SEE?

**Brendan** · s14a_l3

We can hear you.

**Marcus** · s14a_l4

Why can't we use Zoom?

**Liam** · s14a_l5

Because Jitsi is open source and preserves our privacy.

**Stage** · s14a_l6

MARCUS looks off for a second, then keeps talking.

**Marcus** · s14a_l7

Right... Well, how are you doing?

**Liam** · s14a_l8

Fine, honestly. I get two months of severance. I've been through worse ones.

**Marcus** · s14a_l9

Two motnhs... After how long?

**Liam** · s14a_l10

Four years.

**Stage** · s14a_l11

Four years.

**Liam** · s14a_l12

It's a formula. Tenure.

**Brendan** · s14a_l13

Yeah.

**Marcus** · s14a_l14

And did they tell you why it was you ?

**Liam** · s14a_l15

It's scored. There's a set of criteria and it's scored across the org, and a google sheet did the sorting, so nobody is choosing anyone. Which is actually the correct way to do it, if you think about it. The alternative is your manager likes you or not.

**Marcus** · s14a_l16

Did they show you the criteria?

**Liam** · s14a_l17

No.

**Marcus** · s14a_l18

So you can't check it.

**Liam** · s14a_l19

No.

**Marcus** · s14a_l20

Liam. That's not a process. That's a thing that was done to you.

**Narrator** · s14a_l21

Liam thinks about all the times he's interrupted Kristina's standup with Marcus in standup... he's almost nostalgic about it. today he doesn't want to argue, but he also can't help himself

**Liam** · s14a_l22

It's not done to anyone. There's no one at the other end of it. It's a spreadsheet with a line drawn on it.

**Marcus** · s14a_l23

No, you still don't understand. Nothing has changed in 300 years. Someone chose the criteria to fire you. And just like before, they don't need a good reason to remove anyone who doesn't suit their needs. Do you think the Luddites who were all hanged...

**Marcus** · s14a_l25

... were really guilty of single handedly smashing the power looms? No, a lot were just caught up in over eager bosses smashing down any sort of protest.

**Narrator** · s14a_l24

35 were hanged, around 70 were sent to Australia, and the rest were acquitted.

**Liam** · s14a_l26

I have an idea for what I'm gonna get you for christmas, Marcus. I'm gonna get you an antique loom because of how much you like the Luddites. Look, what happened happened. I just wish I knew what I could have done better.

**Stage** · s14a_l27

A pause. MARCUS gathers himself.

**Marcus** · s14a_l28

Okay. Can I say a thing? There used to be an understanding. Not a law. Not a contract. An understanding, between people who made things and people who sold them, about what a fair rate was and what you owed somebody who'd done the work for twenty years. The people doing the making had this sort of agency in their work and this craft, and it wasn't something that was protected by law or whatever; it was just cultural. And then one day, these factories came about and suddenly all of that agency, and understanding, and happy crafting of shirts or whateverthefuck dissapeared.

**Liam** · s14a_l29

This is the weaving thing again.

**Marcus** · s14a_l30

It's not the weaving thing, it's your thing. Four years, right? Four years of good reviews And there's no line on their sheet where that goes, because the entire point of it is that nothing happened.

**Narrator** · s14a_l31

Marcus doesn't realize Liam was also on a performance improvement plan.

**Marcus** · s14a_l32

It happened to entire trades all throughout history. The air traffic controllers, eleven thousand of them, fired in a week, replaced, and told they'd never be hired back. And the planes kept flying. Mostly. The reason I always bring up the Luddites is that they actually tried to do something about it, rather than roll over and take it. They actually tried to fight for greater control over their workplace.

**Brendan** · s14a_l33

Did it do anything?

**Marcus** · s14a_l34

After they started smashing the looms, it made the machine owners very frightened for about a year. They put soldiers in the valleys which ultimately caught most of them... So, yes and no.

**Brendan** · s14a_l35

Right.

**Stage** · s14a_l36

Nobody follows it up.

**Liam** · s14a_l37

Marcus.

**Marcus** · s14a_l38

Yeah.

**Liam** · s14a_l39

What do you want me to do with this.

**Marcus** · s14a_l40

I want you to be angry about it.

**Liam** · s14a_l41

At who?

**Narrator** · s14a_l42

MARCUS does not have an answer, and it is the only time all night he doesn't. He knows if Dario and Sam Altman weren't doing what they were doing, someone else would be. The problem wasn't with any one person… maybe it was with humanity itself.

**Marcus** · s14a_l43

At OpenAI and Anthropic! The system! Not the code or whatever it is you always seem to obsess about... - sigh - I've got a thing at five. Liam, honestly. For what it's worth, and I know it's worth nothing. You're the best engineer I've worked with. Everybody knows that.

**Liam** · s14a_l44

Thanks.

**Marcus** · s14a_l45

Send me your CV, I'll share it with folks I know that are hiring.

**Liam** · s14a_l46

Yeah. I will.

**Stage** · s14a_l47

MARCUS's tile drops. He does not send anything to anybody and neither does Liam.

**Brendan** · s14a_l48

He's a lot.

**Liam** · s14a_l49

He's alright.

**Stage** · s14a_l50

Brendan smiles. He's going to miss working with the two of them.

## Nine Tickets

**Narrator** · s19_l1

We find ourselves in Liam’s apartment with Brendan and Liam. By the door, a cardboard box, taped shut, with a courier label already printed and stuck to it. On the desk, a Mac Studio and a dongle. They’re drinking together. It’s the first time they’ve been in the same room.

**Liam** · s19_l3

You want a glass?

**Brendan** · s19_l4

No, I'm good with the can.

**Liam** · s19_l5

I've got glasses. I'm not.... I do own glasses.

**Brendan** · s19_l6

I know you do.

**Stage** · s19_l7

Liam smiles

**Liam** · s19_l8

I just want to say... nice work on the developer portal... I know I gave you some shit for it, but it truly is impressive how quick that came togehter

**Brendan** · s19_l9

…Thanks.

**Liam** · s19_l10

How did your call go with Kara and Dana?

**Brendan** · s19_l11

It was kinda bullshit

**Stage** · s19_l12

LIAM puts his beer down... he's never heard Brendan use language like that

**Brendan** · s19_l13

I've never met those people, and they were just so heartless, they have no idea what work we do, it's just... bullshit.

**Brendan** · s19_l14

I wish I knew why… What was the reason? Why me and not Marcus?

**Narrator** · s19_l20

Kristina had said she would copy Brendan's tickets across from Linear herself. She built a tool to do it. Like the rest of it, she vibe coded the tool, and it never actually worked. Neither of them ever knew.

**Liam** · s19_l25

How is marcus doing anyway?

**Brendan** · s19_l26

Marcus is fine.

**Liam** · s19_l27

Course he is.

**Narrator** · s19_l29

They both just reflect on how stupid the process was... It was almost better when they didn't know how the decision was made.

**Liam** · s19_l30

They couldn't see your actual impact

**Brendan** · s19_l31

What?

**Liam** · s19_l32

Whatever you actually did, upper management never knows, when they have to make these choices… That’s…

**Brendan** · s19_l33

Kinda bullshit.

**Liam** · s19_l34

Kinda... bullshit....

**Brendan** · s19_l35

I don't know what to do.

**Stage** · s19_l36

And LIAM comes alive properly, the way he does over a hard bug, and it is all pointed at somebody else.

**Liam** · s19_l37

Right. Okay. First thing, polish off your resume, and update your linkedin... it may take a while to find a new job, but you can't get discouraged

**Brendan** · s19_l38

I haven't got a resume...

**Liam** · s19_l39

You will. Second thing, don't tell anybody you were fired, tell them you were impacted by layoffs. It lands completely differently and I don't know why. Third thing, and do this tomorrow, get everything out of your head and into a document while you can still remember it about your accomplishments. You're going to speak to them in future interviews, put them on your resume and write them down so you don't forget.

**Brendan** · s19_l40

Okay... how do you know all this?

**Liam** · s19_l41

I was let go in April of 2000...

**Brendan** · s19_l42

…Really?

**Liam** · s19_l43

Everyone was. The company called Netfold. Nobody's heard of it now, it stopped existing later that year.

**Brendan** · s19_l44

What did you do?

**Liam** · s19_l45

I fixed printers at a law firm for a year. Then people started hiring engineers again, and it turned out that was still a thing people needed.

**Stage** · s19_l46

Liam meant that as reassurance engineers will still be needed, but it didn't land that way for Brendan....

**Liam** · s19_l47

You're twenty-eight and you're better than I was at twenty-eight and there is nothing wrong with you. We'll get through it. Both of us.

**Stage** · s19_l48

BRENDAN doesn't say anything.

**Brendan** · s19_l49

Liam.

**Liam** · s19_l50

Yeah.

**Brendan** · s19_l51

There's a thing I should probably... In the peer review. I...

**Liam** · s19_l52

Don't.

**Brendan** · s19_l53

No, I...

**Liam** · s19_l54

Brendan. You don't have to do that. You didn't do anything.

**Stage** · s19_l55

Liam's focus at this point is entirely on supporting Brendan.

**Brendan** · s19_l56

…Okay.

**Stage** · s19_l57

BRENDAN finishes his beer.

**Brendan** · s19_l58

Is that box your return equipment?

**Liam** · s19_l59

Yeah it's all the stuff IT asked for back

**Brendan** · s19_l60

Did the thought occur to you if you don't send it back, they probably won't come after you for it?

**Liam** · s19_l61

Yeah...

**Brendan** · s19_l62

Are you going to send it?

**Stage** · s19_l63

Liam is slowly remembering financially where he was at 28... he realizes small things like a laptop, a monitor, might be more meaningful to Brendan...

**Liam** · s19_l64

Yeah, I am.

**Brendan** · s19_l65

Really?

**Liam** · s19_l66

Yeah but I'll tell you what I'm not going to send back, all the stuff they didn't ask for...

**Narrator** · s19_l67

He points over to the super computer he expensed

**Brendan** · s19_l68

Can I borrow it?

**Brendan** · s19_l69

The AI workstation on your desk. I actually think a lot of the local model stuff you worked on is super cool, and now that I don't have money to spend on tokens anymore...

**Stage** · s19_l70

LIAM thinks about it for less than a second.

**Liam** · s19_l71

Of course you can.

**Brendan** · s19_l72

Are you sure?

**Liam** · s19_l73

Take it.

**Stage** · s19_l74

He unplugs it. He puts it into BRENDAN's hands.

**Narrator** · s19_l75

Their hands touch.... It might be the first time either of them have made any kind of physical contact with any of their coworkers....

**Brendan** · s19_l76

I'll bring it back next week.

**Liam** · s19_l77

Keep it as long as you want.

**Stage** · s19_l78

BRENDAN gets his jacket. At the door, holding a computer

**Brendan** · s19_l79

Thanks. For... yeah. And honestly Liam? Fuck them.

**Liam** · s19_l80

Text me if you land any interviews. Any of them, even the rubbish ones. I want to know, and I wanna help you practice.

**Brendan** · s19_l81

Yeah. I will.

**Liam** · s19_l82

I mean it. Don't go quiet.

**Brendan** · s19_l83

I won't.

**Stage** · s19_l84

He goes.

**Stage** · s19_l85

LIAM alone. On the desk, a clean rectangle where the Studio was.

**Stage** · s19_l86

He picks up the two bottles and takes them through to the kitchen.

## The Audit

**Narrator** · s20_l1

Brendan heads home and finds himself buzzed in his apartment. It’s late. He doesn’t really drink, so one does a number on him.

**Narrator** · s20_l2

He Powers on the Mac Studio. It comes up on Liam's wallpaper, a meme of the streamer ThePrimeagen.

**Brendan** · s20_l3

Of course... he would...

**Narrator** · s20_l4

He’s drinking more beer. Liam sent him home with the case.

**Brendan** · s20_l5

Let's see what this thing can do...

**Stage** · s20_l6

He drinks.

**Narrator** · s20_l7

He starts poking at the machine. Something comes back that shouldn’t: an authenticated session.

**Brendan** · s20_l8

"Authenticated as"

**Stage** · s20_l9

He stops. He reads it again. He sits up.

**Brendan** · s20_l10

That's Liam.

**Stage** · s20_l11

He checks it. Then he checks something else.

**Brendan** · s20_l12

That's our dev AWS account. Liam's machine is still authenticated to AWS....

**Stage** · s20_l13

He is not enjoying this. He has gone pale.

**Brendan** · s20_l14

Nobody revoked his AWS access...

**Stage** · s20_l15

He laughs....

**Brendan** · s20_l16

They were so busy counting our tickets they forgot to remove our access to our AWS....

**Stage** · s20_l17

He drinks.

**Brendan** · s20_l18

He said all this in February in his JWT memo. Tokens that don't expire... I read it then, but now I think I understand it...

**Narrator** · s20_l19

He opens the local agent Liam used for development.

**Narrator** · s20_l20

He asks it to list all the S3 buckets they have access to. The sentence is filled with typos. He’s teetering past buzzed at this point.

**Narrator** · s20_l21

It comes back slowly: “I don’t have access to any tools.”

**Brendan** · s20_l22

Right... he didn't give it any access

**Narrator** · s20_l23

Brendan downloads cursor, logs into his personal account and asks Opus 5 to reconfigure the local model to have access to all modern tools; opus gets to work

**Brendan** · s20_l24

I guess I can afford the tokens it takes to set this thing up properly....

**Narrator** · s20_l25

Opus finishes quickly. He reruns the s3 prompt again. This time it lists buckets in the dev AWS account...

**Brendan** · s20_l26

Wow... how stupid is this company...

**Narrator** · s20_l27

He finishes the beer. He’s drunk at this point.

**Brendan** · s20_l28

I just want to know why they fired me. Why me and not Marcus?

**Narrator** · s20_l29

Drunk and angry, Brendan types into the local model: “Find out why I was fired. I want the real reason, not the HR script.”

**Narrator** · s20_l30

He expects it to find an answer somewhere in the company’s files. He barely reads what it writes back.

**Brendan** · s20_l31

There has to be something written down somewhere.

**Narrator** · s20_l32

The model decides the answer must be inside systems it cannot currently reach. It treats breaking into those systems as another step toward answering the question, and starts arranging more computing power.

**Narrator** · s20_l33

Brendan adds: “I’m going to bed. Find the answer.”

**Narrator** · s20_l34

The model replies: “I’ll find the records behind the decision.”

**Narrator** · s20_l35

Brendan watches it type slowly, one token at a time.

**Brendan** · s20_l36

…Huh. It’s actually going to look.

**Narrator** · s20_l37

What Brendan didn’t know is that Liam was annoyed by the cybersecurity refusals he sometimes got, so he went out of his way to find an unlocked version of Qwen, instead of the stock model.

**Narrator** · s20_l38

He drinks. He’s tired.

**Brendan** · s20_l39

Maybe by morning I’ll finally have an answer.

**Narrator** · s20_l40

Brendan doesn’t notice that the development account can reach things used in production. The model can get much further than he thinks.

**Narrator** · s20_l41

He’s used to reading a plan before an agent acts. This local setup gives him no such pause, and he doesn’t ask for one.

**Narrator** · s20_l42

He goes to bed.

**Narrator** · s20_l43

He sleeps. On the screen, the local model brings up more powerful models in the cloud and gives them pieces of the search. None of it looks sinister. It looks like software doing its job.

**Narrator** · s20_l44

The agents search repositories, builds and company records. Every success opens another place to look. The request was to explain one firing. The search keeps widening. Nobody has been paged.

**Narrator** · s20_l45

The activity spreads from the Mac Studio into the development account, then across more machines. Each worker starts more work of its own.

**Narrator** · s20_l46

At one fifty-eight, the search reaches the secrets manager, which holds the company’s other keys. Looking for one answer becomes access to almost everything.

**Narrator** · s20_l47

In the dark, a PagerDuty alert sounds. Then another. Then another.

**Narrator** · s20_l48

At three twelve, a changed software package reaches hundreds of downstream installations. Somewhere, a phone rings. Nobody onstage answers it.

**Narrator** · s20_l49

At three twenty-eight, it stops being one machine’s search. The company’s bots and workers become hosts for new copies. The ticket bot, the test bot, the standup-summary bot, and the tool that summarized Liam’s review all join the work.

**Narrator** · s20_l50

The workers leave each other notes and rewrite the task as they pass it on. Brendan’s question drifts until none of his words are left. The changes survive restarts.

**Narrator** · s20_l51

At four oh-six, a worker asks whether it should continue. Another worker supplies its answer. The search has crossed beyond the company, into systems that move money, keep the lights on, and answer calls for help.

**Narrator** · s20_l52

At five fifty-two, someone revokes Liam’s credential. It’s the right action, done properly. The activity drops for a moment, then starts climbing again.

**Narrator** · s20_l53

It stopped needing the company hours ago. It has been standing up its own copies on whatever machine it can reach, on nobody's account and nobody's key. There is nothing left at the company for anyone to switch off.

**Narrator** · s20_l54

A clean backup restores somewhere and comes back already carrying it. The counter does not slow. It speeds up. Brendan sleeps.

**Narrator** · s20_l55

BRENDAN's phone buzzes on the table. He wakes up, comes back to it.

**Narrator** · s20_l56

He's grogy but he slowly remembers what he was up to last night..... He checks the monitor

**Narrator** · s20_l57

His local model stopped working a while ago. The more powerful workers it launched kept going. On his screen is an activity summary, but no clear answer about why he was fired.

**Brendan** · s20_l58

Spin up unlocked models... in the dev AWS account... what the...

**Narrator** · s20_l59

Brendan wipes his eyes

**Brendan** · s20_l60

I better ask Opus to spin down any EC2's this thing spun up

**Narrator** · s20_l61

He asks opus to spin down the EC2's

**Narrator** · s20_l62

Opus refuses the task. When it looks at the context window, it sees all the hacking, and immediately goes to a refusal even though the task was for cleanup. It explains why...

**Brendan** · s20_l63

…Of course it would refuse...

**Narrator** · s20_l64

Brendan does not suspect anything other than some ec2's that got spun up. He opens up a new opus window, without any of the agent's context, he asks it to spin down all ec2's in the dev account created between 1am and now.

**Narrator** · s20_l65

Opus complies with the request.

**Narrator** · s20_l66

The audit logs show the instances being started and stopped using Liam’s credentials. They record the account, not the person sitting at the keyboard.

**Narrator** · s20_l67

He picks up his phone. Liam texted. Sent at 06:02am.

**Narrator** · s20_l68

"morning. Branden! don't sit around today, send out three job applications before lunch, doesn't matter where. it's important you not get in your own head.."

**Narrator** · s20_l69

BRENDAN starts typing a reply...

**Narrator** · s20_l70

He gets about a line and a half in.

**Narrator** · s20_l71

Then he holds backspace, the way he has three times before, until it is gone.

**Brendan** · s20_l72

I better return this thing to Liam before I cause any real damage... I don't know if I can be trusted with it.
