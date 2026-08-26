# AGENTS.md — Writing rules for this vault

Read [[CLAUDE.md]] first for formatting and vault conventions (no hard wraps, frontmatter, wikilinks, scene status). This file covers one thing: keeping the tells of AI-generated writing out of the scripts and notes. It condenses the Humanizer guide ([github.com/blader/humanizer](https://github.com/blader/humanizer), built on Wikipedia's "Signs of AI writing"), adapted to this repo.

## Never discard the author's working tree

The script files under `03 - Script/` are a live editing surface: the storyboard server writes the author's saves straight into them, and those saves are not committed. Anything that resets the working tree throws that work away with no warning and no undo.

- **Never run `git checkout -- <path>`, `git restore`, `git reset --hard`, `git clean`, or `git stash` against `03 - Script/`.** Not as test setup, not as cleanup, not "just to be safe".
- **Tests that write to script files must undo their own writes** by putting the original bytes back through the same API, and must verify the file is byte-identical afterwards.
- **Before any operation that could touch those files, check whether the server is running** (`lsof -nP -iTCP:8020 -sTCP:LISTEN`). If it is, the author may be typing into it right now.
- Every write through the server keeps the previous version in `storyboard/.edits/`. That is the recovery path — see `Undo an edit.command`. It does not cover damage done outside the server.

## Content taboos

- **No inflated significance.** Nothing "marks a pivotal moment," "underscores," "serves as a testament," "reflects broader trends," or "sets the stage." State the fact and stop.
- **No tacked-on -ing analysis.** Don't end a sentence with "…highlighting the tension" or "…reflecting her fear." If the beat matters, stage it; the audience does the analysis.
- **No promotional register.** Vibrant, groundbreaking, renowned, stunning, rich (figurative), nestled — cut on sight.
- **No AI vocabulary pile-ups.** Delve, crucial, pivotal, showcase, tapestry, landscape (abstract), interplay, foster, garner, underscore. One is a word; a cluster is a confession.
- **No rule-of-three padding** and **no false ranges** ("from the loom to the algorithm"). Two specifics beat three vague ones.
- **No negative parallelisms** ("it's not just a tool, it's a philosophy") and no clipped tailing negations ("No drama. No speeches.") used as fake punch.
- **No manufactured punchlines or staccato drama.** A run of short fragments engineered to land reads as engineered. One short sentence for emphasis is fine.
- **No aphorism formulas.** "X is the language of Y," "X becomes a trap." Say the concrete thing the formula gestures at.
- **No throat-clearing authority moves** ("at its core," "the real question is") and **no signposting** ("let's dive in").
- **No generic upbeat conclusions.** End on the last concrete image or fact, not a send-off.
- **No copula avoidance.** "Serves as the exhibition space" → "is the exhibition space." Also cut filler ("in order to," "it is important to note that").
- **No chat artifacts or sycophancy** anywhere in committed text.

## House-specific notes

- **Em dashes are house style here.** The Humanizer bans them in general prose; this vault's scripts and stage directions use them deliberately to cue delivery, and the existing corpus is the writing sample that outranks the ban. Match the existing frequency; don't spray them into production notes and references where a comma or period does the job.
- **Dialogue rules** (see CLAUDE.md, they overlap): show, don't narrate; nobody announces their feelings or delivers thematic exposition; arguments stay multi-sided and unresolved; if a line is trying to "land," cut it back. Interiority lives in stage directions, sparingly and focalized, never in a character's mouth.
- **Keep the human tells.** Specific mundane detail (the protective film on the corner of the Mac Studio), mixed feelings, unresolved tension, uneven sentence length. Over-sanitized prose is as much a tell as slop.

## The pre-commit check

Read the draft aloud. Look for clusters of the patterns above, not isolated hits. Ask the two questions from the Humanizer loop: "what makes this read as AI-generated?" and "does it state anything not established in the story?" Fix both before committing.
