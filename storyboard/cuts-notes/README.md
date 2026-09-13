# Cut notes

One JSON file per scene, read by the Cuts page (`/cuts.html` on the storyboard app) through `GET /api/cuts/analysis`. The page measures every scene live from `stage/show.json` and merges these notes in. Nothing here is executed: the notes are things worth considering, with cue ids the author can click through to the proofreading page.

The notes were written on 2026-09-13 by one Claude subagent per scene, each reading the whole script, the Liam Arc, the Curdle Ledger, the Scene Map rules of thumb and the author's guardrails, against a staged estimate of 95 min and a target of 60 to 75. `_summary.json` is the reconciliation across scenes: which suggestions together reach 75 and which reach 60, and the contradictions between files that the author has to settle.

## How a scene was judged

Nine tests, in order: function ledger (plot, Liam's arc, others, comedy, spectacle, setup and payoff); turn test (where the scene changes state; beats before the first setup and after the turn are enter-late / leave-early candidates); redundancy (which other scene does the same job, and which is stronger); consolidation (which beats a neighbour could carry); dependency (which later scenes point back here); the guardrails; the rest test (Brendan is the audience's rest from Liam and Marcus); density (long speeches, narrator runs, written pauses, runs of very short beats); cost per function.

Grades: `protected` (a guardrail scene), `costly` (cutting it breaks a dependency, trim inside only), `trimmable` (keep, tighten), `mergeable` (its functions move into a named neighbour), `liftable` (can go with small carry-over). A `cut-scene` suggestion is only allowed on liftable or mergeable scenes.

The guardrails, which override any ranking: s01c stays (Brendan showing Liam agentic coding, four aborted attempts); Kristina's buy-in by use stays on stage (the s01b Cursor demo, the s11c solo build); the talked-over-Kristina comedy in s01, s06 and s11b is the strongest comedy in the play, and s11b stays intact. Separately, the Author-Pass Reconciliation lists s01d, s08 and s11c as cut; s11c is both cut and protected, and the page shows both facts.

## The file

```json
{
  "sceneId": "s12",
  "writtenAt": "2026-09-13",
  "writtenAgainst": "949b928ffa390b3d",
  "grade": "trimmable",
  "protected": { "yes": false, "why": null },
  "function": { "plot": "", "liam": "", "others": "", "comedy": "", "spectacle": "", "setupPayoff": [] },
  "turnsAt": "s12_l40",
  "ifRemoved": "",
  "mergeInto": null,
  "suggestions": [
    { "id": "s12-1", "kind": "cut-beat", "cueIds": ["s12_l22"], "savingSeconds": 9.4, "priority": 1, "note": "" }
  ],
  "recommendedSavingSeconds": 60
}
```

`writtenAgainst` is the scene's text hash from `python3 storyboard/cuts_core.py hashes`. When the scene's words change the page marks the notes stale and strikes through cue ids that no longer exist; the rest still shows until the file is rewritten. `kind` is one of `trim`, `cut-beat`, `compress-speech`, `redundant`, `merge`, `cut-scene`. For every kind but `compress-speech` the server recomputes `savingSeconds` from the named cues' real clip durations; for `compress-speech` it keeps the written estimate, capped at the cues' length.

`python3 storyboard/cuts_core.py check` validates every file (schema, kinds, cue ids, hash) and exits nonzero on a problem; the page lists the same problems.

## Rewriting the notes

This is a Claude task, not a feature of the app. Build the evaluation pack (the whole script with cue ids and seconds, the metrics table from `cuts_core.py table`, the Liam Arc, the Curdle Ledger, the rules of thumb, the style rules), then run one agent per scene with the brief above and let each write only its own file. Reconcile afterwards: scenes that each propose absorbing the other, protected scenes carrying a cut-scene note, contradictions between files. Keep `_summary.json` current.
