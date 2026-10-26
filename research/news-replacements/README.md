# Real news replacements for the AI news clips

Compiled 2026-10-26 from five research passes, one per group of clips. Not part of the script. Each pass wrote a section file in this folder with two to four candidates per AI clip, exact caption quotes, timestamps, edit plans, caveats, and every URL it tried. Method and fit scale are in [BRIEF.md](BRIEF.md). The AI clips' own words are in [ai-clip-transcripts.json](ai-clip-transcripts.json).

Footage, captions, contact sheets and proof frames are in `raw/`, `subs/`, `sheets/` and `frames/`. They are gitignored and live on this machine only.

Fit: 5 = cut it in and it plays. 4 = one simple trim. 3 = a splice of fragments. 2 = picture only. 1 = long shot. Times are seconds into the source video.

## Three-day news montage

| AI clip | Best real clip | Window | What it says | Fit |
|---|---|---|---|---|
| 01 hacking campaign | [CBS Mornings, Anthropic report, 14 Nov 2025](https://www.youtube.com/watch?v=JNn9hnPYXa4) | 0.9–5.0 + 9.3–19.3 | "China is accused of using AI to spy on tech companies, financial institutions, and government agencies ... the first documented case of a worldwide cyber attack with minimal human involvement. The AI is doing the work." | 4 |
| 02 global outages | [ABC News Australia special, CrowdStrike, 19 Jul 2024](https://www.youtube.com/watch?v=-CZnkvaJF-0) | 9.9–17.0 | "companies and government agencies worldwide tonight in the grips of an unprecedented computer shutdown that's affecting banks, airports, telecommunications, supermarkets and small businesses" | 4 |
| 03 resource exhaustion | [CBS News 24/7, Anthropic AI-worm warning, 14 Oct 2026](https://www.youtube.com/watch?v=RU6LGzvxrs4) | 2.9–8.0 + 14.6–20.5 | "models could soon spread themselves from one internet-connected device to another ... networks of infected devices that are difficult to shut down" | 3 |
| 04 cloud backbone | [CBS Evening News, AWS outage, 20 Oct 2025](https://www.youtube.com/watch?v=FydtEEf4eEQ) | 23.7–28.4 + 92.2–101.8 | "The cloud is the digital backbone of the modern internet ... when you have so few major cloud companies, even just when one glitches, it causes a ripple effect" | 4 |
| 05 reinfection | [CBS Mornings, Matt Shumer on AI agents, 31 Aug 2026](https://www.youtube.com/watch?v=YL3FAM4rfy8) | 123.8–139.2 | "it's very hard for us to control ... OpenAI actually found the message board ... They shut it down. Two days later, the AIs brought it back. They found a way to do that." | 4 |
| 06 supply chain | [CBS News, Log4j, 15 Dec 2021](https://www.youtube.com/watch?v=LRtYMng9EoU) | 241.6–249.5 + 187.3–200.0 | "so deeply baked into the software that they use every day ... within 72 hours of its discovery there were over 45 different variations, a little while later that increased to 60" | 4 |
| 07 missing graphics | [Sky News UK off-air capture, CrowdStrike, 19 Jul 2024](https://www.youtube.com/watch?v=zB4m-m_9Kco) | 2006.4–2014.0 + 2017.5–2021.3 | "Sky News will look different today because we are experiencing these problems as well ... we are limited in what we can do and we apologize for that" | 5 |
| 08 nuclear plant, part 1 | [CBS News, Iran-linked attack on a UK power plant, 24 Aug 2026](https://www.youtube.com/watch?v=9HY_NaBZPYQ) | 40.3–46.7 + 53.2–57.5 | "the target was a computer in this power plant called programmable logic controller ... this brain was hijacked and was offline" | 4 |
| 08 nuclear plant, part 2 | [KDKA Pittsburgh, NotPetya hits a hospital, 27 Jun 2017](https://www.youtube.com/watch?v=b2twIm6-Ais) | 23.4–28.4, then 78.1–85.0 | "experts are working to determine who is behind the cyber attack ... identified as the same ransomware attack that affected a number of organizations globally" | 3 |

Runners-up worth knowing:

- **01:** [CNN, OpenAI models hacking another AI company, 23 Jul 2026](https://www.youtube.com/watch?v=4OgyuUq_cCc) and [BBC, an agent that "went rogue and hacked another tech firm"](https://www.youtube.com/watch?v=4k3RreudH24). Both are 2026, anchor at desk, fit 4.
- **02 and 07 together:** the ABC Australia anchor apologises in the same shot at 31.3–41.9 ("we here at the ABC are also operating at a reduced capacity"). Both slots can be one continuous anchor.
- **04:** [Sky News, AWS](https://www.youtube.com/watch?v=ozXSRnfHbqk) at 106.7–119.5: "this AWS infrastructure underpins millions of companies' websites and platforms". Fit 4.
- **06:** [CNBC, Log4j](https://www.youtube.com/watch?v=VVCzdgGHR_0) at 92.9–111.2 has the better anchor-with-graphic picture. Fit 4.
- **08 sound:** [KDKA, Aliquippa water plant](https://www.youtube.com/watch?v=H4VVWwU08HI) at 54.7–60.1: "a piece of computer technology which monitors water pressure suddenly shut down". Cut before the next words, which introduce the "YOU HAVE BEEN HACKED" screen.
- **08 picture:** no cyber story has a reporter in front of cooling towers. [France 24's Zaporizhzhia report](https://www.youtube.com/watch?v=inSsnGXxKYE) has steaming cooling towers at 17.5–21 and the plant wide at 23–27, for B-roll under the sound.

Caveats to cut around:

- 01 names China and the CBS lower third reads "A.I. USED IN CHINESE CYBERATTACK". Crop it.
- 02 and 07 are CrowdStrike, which was a bad update, not a hack. Never use the lines saying "not a cyber attack" (CBS New York 46.9–52.0 is one).
- 03 says "could soon". Cut those two words if the sound allows.
- 05 is agents rebuilding a message board, said by a guest rather than an anchor.
- 06's Log4j chart shows "DECEMBER 9TH" in medium type.
- 08 part 1 has a "WAR WITH IRAN" bug and a Telegraph lower third on every frame. Crop or cover.
- 08 part 2 says "who", not "whether it's related". Start the reporter fragment at 78.1 to keep "June 27" off screen.

## Collapse to trial

| AI clip | Best real clip | Window | What it says | Fit |
|---|---|---|---|---|
| 01 flight bookings | [Al Jazeera, Collins Aerospace check-in attack, 20 Sep 2025](https://www.youtube.com/watch?v=CSbSoq7D9Os) | 14.8–23.8 | "Cancellations, queues, and packed departure halls filled with passengers whose flights had been delayed or grounded." Over a CANCELLED/DELAYED board and the Brussels queue. | 4 |
| 02 brownouts (sound only) | [KPIX CBS Bay Area, Flex Alert, Jun 2021](https://www.youtube.com/watch?v=z7MuovPTpxo) | 3.0–9.3 + 21.76–25.0 | "the state's power grid operator says some customers might face rotating power outages this evening ... all customers are being urged to conserve power now" | 4 |
| 03 analogue television | not compiled | | | |
| 04 radio bulletin | not compiled | | | |
| 05 courthouse, trial | [Channel 4 News, phone-hacking trial opens, 28 Oct 2013](https://www.youtube.com/watch?v=YT_H0NJByyI) | 52.8–55.8 + 193.4–198.5 | "the so-called hacking trial is finally upon us ... clearly this is going to be one of the most high-profile criminal trials of recent years" | 3 |
| 06 courthouse, worm author | [CBS News, DOJ charges Park Jin Hyok for WannaCry, 6 Sep 2018](https://www.youtube.com/watch?v=GR50MAuAc7Q) | 15.3–21.5 + 28.6–31.8 | Prosecutor: "are responsible for some of the most damaging and most well-known cyber intrusions in history ... and creating the WannaCry ransomware" | 3 |

Runners-up worth knowing:

- **01:** [CBS Chicago, Japan Airlines, 26 Dec 2024](https://www.youtube.com/watch?v=HwWC3f3wBtY) at 2.19–11.5: "Japan Airlines was briefly forced to stop selling tickets today after a cyber attack". It is the only real "stopped selling tickets" line and pairs with the Al Jazeera queue.
- **02:** [Al Jazeera, Kyiv](https://www.youtube.com/watch?v=hjzo03mQb1o) at 2.75–9.15: "neighborhoods cycling through blackouts". Cut before "Russian".
- **05:** [CBS Philadelphia](https://www.youtube.com/watch?v=F_xUibJw4zY) at 39.7–48.9 is a reporter outside a federal courthouse with crews behind her, almost exactly the AI shot. Use the picture only. LiveNOW has "It is indeed the trial of the century" at 403.0–404.8 of [this video](https://www.youtube.com/watch?v=gzddlypUORo), from a guest.
- **06:** in the same CBS clip, Paula Reid says at 76.7–86.0 that "that attack put ransomware on hundreds of thousands of computers around the world". Her on-camera picture is at 58–66.

**Analogue TV and radio:** this pass was stopped before it wrote results. It had downloaded five leads, which are in `raw/` but not reviewed. They are a CBS Helene report on radio as a lifeline, KPRC on Galveston radio being restored, 48 News and NewsChannel 5 on transmitters coming back, and a 5 News "be ready" checklist.

## Sentencing and interviews

| AI clip | Best real clip | Window | What it says | Fit |
|---|---|---|---|---|
| 01 judge statement | [ITV News, Scattered Spider TfL sentencing, 16 Jul 2026](https://www.youtube.com/watch?v=6gxYMbSCbqM) | 217.2–221.1 + 225.3–229.0 | Reporter outside Woolwich Crown Court: "The judge said the pair were motivated by selfish bravado ... the largest criminal prosecution of cyber offenders in UK history" | 3 |
| 02 maximum punishment | [CBS This Morning, Ross Ulbricht sentenced, 30 May 2015](https://www.youtube.com/watch?v=ZcpKx-Hugws) | 9.7–12.5 + 69.6–73.9 | "was sentenced to life in prison without parole ... I've never heard of such a long sentence for something someone did with a computer" | 3 |
| Reporter question to SJ | nothing usable | | | 1 |
| Reporter question to Brendan | nothing usable | | | 1 |

Notes:

- **The judge on camera:** the same ITV upload has the judge's televised remarks. At 383.0–389.5 he says "the actual disruption caused ... was very serious indeed". At 600.9–606.6 he says the offending "is so serious that I have no alternative but to pass a sentence of immediate custody upon you both". This could replace the anchor quoting a judge with the judge himself. Never use 630–641, where he goes on to pass the lowest sentence.
- **"Maximum penalty":** CBS Philadelphia's Nassar report at 2.9–4.85 says "has been sentenced to the maximum penalty". Cut hard before "for sexually abusing". The picture is unchecked.
- **Connor Moucka**, the Snowflake breaches defendant, is sentenced on 27 October 2026. Coverage of that sentencing is worth a search after that date.
- **Doorstep questions:** no real scrum says "it wasn't you, it was AI" or "how do you respond to the accusations". The nearest real shouted questions are in the section file.

## Words no pass found

None of the passes found an anchor calling a live outbreak a "worm", apart from 2009 Conficker clips that had no captions. None found "resource exhaustion", "computing backbone", "suspended bookings", "trial of the century" alongside "goes on trial today", or a cooling valve that is not responding. The table entries above are the nearest real words.

## Getting the footage

YouTube refused plain downloads with HTTP 403. This worked every time:

```sh
yt-dlp --js-runtimes node --extractor-args "youtube:player_client=android" --no-playlist -f "bv*[height<=480]+ba/b[height<=480]" <url>
```

For final use, fetch at full resolution with audio and cut the windows above. Long broadcasts such as the Sky capture can be fetched as a window with `--download-sections "*1990-2035"`. Caption pulls hit HTTP 429 when several ran at once; each section file records which videos failed.
