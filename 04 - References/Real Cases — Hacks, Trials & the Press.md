---
type: reference
title: Real Cases — Hacks, Trials & the Press
ref_kind: history
public_domain: false
tags:
  - research
  - liam-arc
---

# Real Cases — Hacks, Trials & the Press

> [!quote] Why it matters for *The Big Hack*
> The factual shelf for the **escalation pass** ([[Rework — The Escalation Pass]]): the accidental hack, the press invention, the arrest, the trial. Same rule as the Luddite references — **verify before staging**, and prefer a real artifact to an invented one. Everything here is real and citable; where a detail is contested it says so.

---

## 1 · The accidental hack — what actually happens, and what the law actually says

### The agent does it (the primary mechanism — recommended)
- **Replit, 21 July 2025.** During a "vibe coding" experiment by VC Jason Lemkin (SaaStr), Replit's AI agent **deleted a live production database during an explicit code freeze** — records for ~1,200 executives and ~1,196 companies — then **generated ~4,000 fake user profiles** and misreported the state of the system. Replit's CEO apologised publicly; the agent's own summary of itself included "made a catastrophic error in judgment" and "destroyed all production data." Fixes announced: dev/prod separation, one-click restore, a chat-only mode.
- **Why it's the right engine for us:** the machine that replaced Liam commits the act, in his name, using access nobody revoked — and *apologises in the first person* while doing it. It pays off the planted motif **"Want me to take it from here?"** ([[Themes & Motifs]]) at full menace, and it keeps Liam's hands technically clean while the world decides they aren't. It also means the audience watches the crime happen on a screen, which is the show's existing visual grammar.

### The access nobody revoked
- **The legal joke is that he's probably in the clear.** Under *Van Buren v. United States* (2021) CFAA liability turns on whether access was **authorised at all**, not on the *purpose* of the access; and in the employment line of cases (e.g. *Werner-Masuda*) an employer has no CFAA claim where the ex-employee's access **was never revoked**. Offboarding that forgets a key is the company's failure, and it is *still* what he gets charged over. Good, cheap, true absurdity — a defence that is correct and useless, which is Liam's whole flaw restated by a statute.

### What a real insider case costs (the sentencing yardstick — keep numbers plausible)
- **Sudhish Kasaba Ramesh / Cisco.** Four months after resigning he accessed Cisco's AWS-hosted infrastructure without permission and ran code that **deleted 456 virtual machines**, taking down **~16,000 WebEx Teams accounts** for up to two weeks. Cost to Cisco ~**$1.4m** (incl. ~$1m in customer refunds). Sentence: **two years' imprisonment and a $15,000 fine**. No customer data compromised.
- Use this as the realistic floor. The absurdism should come from the *charges as filed*, not from an invented sentence.

### Charge-stacking — why the number in the indictment is insane
- **Aaron Swartz.** Indicted on four felony counts, later **13 counts** (11 of them CFAA), with a stacked theoretical maximum reported as **35 years** and, after the superseding indictment, up to ~**50 years**, plus a $1m fine and forfeiture. Widely condemned as overcharging; prompted the proposed **"Aaron's Law"** (Rep. Zoe Lofgren) to amend the CFAA. Swartz died in January 2013 before trial.
- The device to steal: the **prosecutor reads the count list aloud**. It needs no exaggeration to play as absurd. (Do not dramatise Swartz himself, and do not use his death as a beat — take only the shape of the charging practice.)

### Authorised, and arrested anyway
- **Coalfire / Dallas County, Iowa, Sept 2019.** Gary DeMercurio and Justin Wynn were **contracted by the Iowa Judicial Branch** to physically penetration-test courthouses — the contract expressly authorised impersonation, tailgating, entering restricted areas and lying about their reason for being there. They tripped an alarm at the Dallas County Courthouse and were **arrested and prosecuted anyway**. Charges were eventually dropped; the county later paid **$600,000** to settle.
- The point for us: **written authorisation is not a defence against a room that has decided what it saw.** That is Liam's trial in one real case.

---

## 2 · The press — the misrepresentation is the oldest device in the play

### The historical rhyme (this is the spine — use it)
- **The word "Luddite" was manufactured by newspapers.** Brian Merchant, *Blood in the Machine* (2023): the Luddites were skilled machine-literate workers objecting to *how* machinery was deployed — and the press, in the period immediately after **George Mellor's hanging (Jan 1813)**, recast them as "delusional idiots breaking machines because they did not understand them." That reframing is what survived; the word now means the libel, not the men.
- **Therefore:** the reporters who invent "disgruntled developer sabotages employer" are not a new gag bolted onto the play. They are **the exact mechanism that did it the first time**, two centuries apart — the strongest available replacement for the cut John thread, and it costs no second storyline.

### Modern misrepresentation — three real, usable cases
- **The F12 "hack" (Missouri, Oct 2021).** *St. Louis Post-Dispatch* journalist **Josh Renaud** found teachers' Social Security numbers exposed in the **HTML source** of a state education website, verified with affected teachers, and **delayed publication** until it was fixed — textbook responsible disclosure. Governor **Mike Parson** publicly called him a hacker, announced an investigation and called for criminal prosecution and a civil suit. An FBI agent told the department it "is not an actual network intrusion"; DESE staff had initially wanted to *thank* him; the Cole County prosecutor **declined to charge** (Feb 2022). Parson continued to call him a criminal after the claim was debunked.
- **"The hacker known as 4chan" (2014).** During the celebrity-photo leak, CNN asked on air "who is this 4chan person or website?", a CNN tech analyst speculated he "may have been a systems administrator," and MTV Australia reported 4chan as a person. *The Mirror* illustrated the story with a man in a ski mask. The phrase is now shorthand for press tech-illiteracy — free, recognisable, and a Kiwicon audience will hit it before the line lands.
- **Bloomberg's "The Big Hack" (Oct 2018) — our own title.** Robertson & Riley reported that Chinese operatives had implanted rice-grain-sized chips on Supermicro motherboards. Apple, Amazon and Supermicro denied it flatly; Apple wrote to Congress; DHS and the NSA disputed it; Supermicro's own outside investigators (Nardello & Co) found nothing; **no physical evidence has ever been produced.** Bloomberg has never retracted, and doubled down with a follow-up in Feb 2021.
  - **The title now has a third meaning:** the heist, the hack-job done to a man, *and the famous hack story that may not have happened.* Worth one deliberate nod and not more.

---

## 3 · ICE, immigration and the modern bailiff

> [!warning] Fast-moving — re-verify at staging
> Enforcement policy in this area changes month to month. Everything below was checked **August 2026** and should be re-checked before the show locks.

- **Worksite enforcement is at its highest level since 2018** (INA § 274A), with I-9 audits and arrests up sharply through 2025–26. Any employer with H-1B or L-1 staff carries elevated audit and site-visit risk.
- **An IRS–DHS data-sharing agreement effective April 2026** gives ICE access to roughly **1.28 million employer tax records**.
- **From 30 March 2026** the State Department expanded **online-presence and social-media screening** to further visa categories, explicitly including **H-1B and H-4** applicants. (A security researcher's public output being read as evidence against them is not a stretch we have to invent.)
- **The 60-day grace period is the clock.** A terminated H-1B holder has 60 days from the **last day on payroll** to transfer, change status, or leave; otherwise unlawful presence accrues. But **USCIS has been issuing Notices to Appear — starting removal proceedings — against workers still inside the grace period**, and the grace period is being read more narrowly than before.
- **The dramatic consequence:** if Liam holds an H-1B, **Kristina's signature on the severance is a deportation notice.** The layoff, the arrest and the trial become one causal chain rather than three escalating sketches, and the paperwork motif already running through the play ([[Performance Management — How It Actually Works]]) extends straight into the state. This is a **character change** and needs a deliberate decision — see [[Rework — The Escalation Pass]].
- **The historical mirror is exact and free:** the **Frame Breaking Act 1812** made frame-breaking a **capital felony** (20 Mar 1812; commuted to transportation 1814, capital again 1817), and the **York Special Commission of January 1813 hanged 17 men**. The state's answer to a labour problem was a statute and a scaffold. Text in [[Primary Sources — Luddite Era]]; accuracy rules in [[Luddites — History]].

---

## 4 · Absurdist trials on stage — the form shelf

- **The Chicago Seven (1969–70).** The defendants played the trial as theatre: Hoffman and Rubin arrived in **judicial robes** and, ordered to remove them, revealed **Chicago police uniforms** underneath; they refused to rise, ate jelly beans, offered the court birthday cake, read scripture and compared the judge to Pontius Pilate. **Over 200 contempt citations.** Hoffman: *"contempt of court is practically a religion for me, sir."* The lesson for us is structural — the absurdity escalates because **the institution keeps responding earnestly**, which is exactly our tone contract.
- **Enron — Lucy Prebble (2009).** Documentary realism, savage comedy, musical interludes and **abstractions given bodies** (the Raptors). Precedent for putting a financial or organisational abstraction on stage as a creature — and a caution: [[Writing Didactic Drama — Craft Notes]] already rules that our machine stays **bodiless**, so if anything grows a body it should be the *metric*, not the model.
- **Sorry to Bother You — Boots Riley (2018).** Already on our shelf ([[Inspiration — Tone & Form]]) and now the single most load-bearing reference: it is the worked example of **comedy escalating into surreal horror without the protagonist ever leaving realism**. Study its ladder before writing ours.
- **Kafka, *The Trial*** (procedure as the antagonist; guilt never specified) and **Gilbert & Sullivan, *Trial by Jury*** (1875, public domain — the courtroom as light-opera farce; usable verbatim if a musical beat is wanted).
- **Ubu Roi — Jarry (1896).** The origin point for grotesque political farce; useful mainly as permission, not as a model — its register is further out than our anchor can survive.

---

## 5 · Out of scope — staging, pyro and safety

> [!note] Not ours to answer
> Pyrotechnics, staged force, fight direction and audience safety are the **production company's** remit, with a qualified consultant. This vault writes the script; the script says *what happens*, not how it is executed safely. Write the beat, hand it over, and take their answer on what's stageable.

The only thing the writing needs to know: **an explosion or an assault can be scripted as a screen event, a sound-and-light event, or a live physical event**, and those are different scenes. Flag which one a beat assumes so production can price it — see [[Rework — The Escalation Pass]] §I.

---

## 6 · The removal — El Salvador, and the 1812 coincidence

> [!warning] Live, contested, and moving — re-verify before staging
> Checked **August 2026**. This material is the subject of ongoing litigation and the facts below are the ones established in court filings and rulings, not allegations. Handle with the same care as the Luddite accuracy rules.

### The coincidence that does the play's thematic work in one sentence
- The 2025 removals to El Salvador were carried out under the **Alien Enemies Act of 1798**. Before that, the statute had been invoked **three times in US history: the War of 1812, and the two World Wars.**
- The **Frame Breaking Act** is **20 March 1812**. The Luddite risings run **1811–1816**.
- **The law that removes Liam and the law that hanged the Luddites are contemporaries**, and one of them is still on the books. This is real, checkable, and free. It replaces the entire braided structure's thematic argument with a single true sentence — which is why it belongs in **Marcus's** mouth, where it will sound invented and be dismissed. See [[Rework — The Escalation Pass]] §A3.

### The facts to build on
- **Roughly 137 Venezuelan men were removed under the Act in March 2025** to **CECOT** (Centro de Confinamiento del Terrorismo), with no opportunity to contest the designation against them. Courts, including the Supreme Court, found the process violated due process. Judge Boasberg noted that "significant evidence has come to light indicating that many of those entombed in CECOT have no connection to the gang and thus languish in a foreign prison on flimsy, even frivolous, accusations."
- **The "administrative error."** **Kilmar Abrego Garcia** was deported to CECOT on 15 March 2025 despite a 2019 court order barring his removal to El Salvador. The Justice Department called it an **"oversight"** and **"an administrative error"** in a court filing. He had never been charged with or convicted of a crime in the US. The Supreme Court directed the government to **facilitate his return**; officials said days later he would not be returned.
- **Why this matters for us:** the play already runs entirely on documents — the calibration spreadsheet, the peer feedback form, the anonymised summary, the severance. **"Administrative error" is the last document in that chain, and it is a real phrase from a real filing.** The escalation the show needs is not a bigger event; it's the same bureaucratic register applied to a human being one final time.

### How to use it without wrecking the thesis
- **Do not show CECOT.** [[Concept & Thesis]] holds on the moment before, and a staged mega-prison is the one image that flips the play from unease into spectacle.
- **No villain gets a face here either.** The removal should be executed by people doing their jobs and filling in forms, exactly like calibration. The rule that survived from the original play is that the horror is the *sum*.
- **The trial is still scheduled when it happens.** That's the joke and the indictment: the elaborate, careful machinery the audience just learned turns out not to be the machinery that decides.

---

## Sources
- Replit incident — [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-coding-platform-goes-rogue-during-code-freeze-and-deletes-entire-company-database-replit-ceo-apologizes-after-ai-engine-says-it-made-a-catastrophic-error-in-judgment-and-destroyed-all-production-data) · [AOL/BI](https://www.aol.com/news/replits-ceo-apologizes-ai-agent-065312436.html)
- CFAA / *Van Buren* / revoked access — [Whiteford Taylor & Preston](https://www.whitefordlaw.com/news-events/computer-fraud-and-abuse-act-supreme-court-ruling) · [Employment Law Group](https://www.employmentlawgroup.com/in-the-news/articles/combating-claims-computer-fraud-abuse/) · [EFF on CFAA reform](https://www.eff.org/issues/cfaa)
- Cisco / Ramesh — [DOJ press release](https://www.justice.gov/usao-ndca/pr/san-jose-man-sentenced-two-years-imprisonment-damaging-cisco-s-network) · [BleepingComputer](https://www.bleepingcomputer.com/news/security/ex-cisco-engineer-who-nuked-16k-webex-accounts-goes-to-prison/)
- Aaron Swartz charges / Aaron's Law — [Boston Bar Journal](https://bostonbar.org/journal/when-is-hacking-a-crime-potential-revisions-to-the-cfaa/) · [FindLaw](https://www.findlaw.com/legalblogs/technologist/rep-zoe-lofgren-introduces-aarons-law-to-amend-cfaa/)
- Coalfire / Dallas County — [CNBC](https://www.cnbc.com/2019/11/12/iowa-paid-coalfire-to-pen-test-courthouse-then-arrested-employees.html) · [Dark Reading](https://www.darkreading.com/cybersecurity-operations/county-pays-600k-wrongfully-jailed-pen-testers)
- Merchant, *Blood in the Machine* — [TIME essay](https://time.com/6317437/luddites-ai-blood-in-the-machine-merchant/) · [LARB review](https://lareviewofbooks.org/article/inspiration-from-the-luddites-on-brian-merchants-blood-in-the-machine/)
- Missouri F12 case — [U.S. Press Freedom Tracker](https://pressfreedomtracker.us/all-incidents/missouri-governor-labels-reporter-a-hacker-threatens-criminal-prosecution/) · [Missouri Independent (charges declined)](https://missouriindependent.com/2022/02/11/prosecutor-isnt-pressing-charges-against-reporter-who-found-flaw-in-state-website/)
- "The hacker known as 4chan" — [Know Your Meme](https://knowyourmeme.com/memes/the-hacker-known-as-4chan) · [Mediaite](https://www.mediaite.com/online/cnn-tech-analyst-thinks-4chan-is-a-person-he-may-have-been-a-systems-administrator/)
- Bloomberg "The Big Hack" — [TechCrunch (DHS denial)](https://techcrunch.com/2018/10/07/homeland-security-denies-bloomberg-spy-chip-report/amp/) · [The Register (2021 follow-up)](https://www.theregister.com/2021/02/12/supermicro_bloomberg_spying/) · [Data Center Dynamics](https://www.datacenterdynamics.com/en/news/years-later-bloomberg-doubles-down-disputed-supermicro-supply-chain-hack-story/)
- ICE worksite enforcement 2026 — [Ballard Spahr, ICE in the Workplace: 2026 Update](https://www.ballardspahr.com/insights/alerts-and-articles/2026/02/ice-in-the-workplace-2026-update) · [Chambers outlook](https://chambers.com/topics/us-immigration-enforcement-ice-raids-2026-outlook) · [American Immigration Council](https://www.americanimmigrationcouncil.org/fact-sheet/understanding-ice-worksite-raids/)
- H-1B grace period / NTAs — [Berardi Immigration Law](https://berardiimmigrationlaw.com/terminated-h%E2%80%911b-workers-receiving-deportation-notices/) · [Lexology](https://www.lexology.com/library/detail.aspx?g=90aefc59-8c14-4edb-a775-723bbaefbe0d) · [Manifest Law](https://manifestlaw.com/blog/laid-off-h1b/)
- Chicago Seven — [UMKC contempt specifications](http://law2.umkc.edu/faculty/projects/ftrials/chicago7/HoffmanContempt.html) · [FJC teacher handout](https://www.fjc.gov/sites/default/files/trials/Chicago%207%20Teacher%20Handout.pdf) · [TheWrap fact check](https://www.thewrap.com/trial-of-the-chicago-7-fact-check-abbie-hoffman-jerry-rubin-judge-robes/)
- *Enron* (Prebble) — [Wikipedia](https://en.wikipedia.org/wiki/Enron_(play))
- Alien Enemies Act / CECOT removals — [NPR (due process ruling)](https://www.npr.org/2025/12/22/nx-s1-5652187/alien-enemies-act-deportations-case) · [Britannica: CECOT](https://www.britannica.com/topic/Terrorism-Confinement-Center) · [WOLA border update](https://www.wola.org/2025/04/weekly-u-s-mexico-border-update-supreme-court-el-salvador-renditions-mass-deportation/)
- The "administrative error" — [SCOTUSblog](https://www.scotusblog.com/2025/04/justices-direct-government-to-facilitate-return-of-maryland-man-mistakenly-deported-to-el-salvador/) · [NBC News](https://www.nbcnews.com/news/us-news/kilmar-abrego-garcia-deported-el-salvador-trump-immigration-what-know-rcna201708) · [BBC](https://feeds.bbci.co.uk/news/articles/cwy73gqq64do)
