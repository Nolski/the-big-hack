# Venue staging

There are two video outputs:

- Upper screen: **1920×1080**.
- Lower LED wall: **4608×896**, split into left **2048×896**, centre **512×896**, right **2048×896**. The centre begins at x=2048; the right wing begins at x=2560.

The venue photo shows the lower panels wrapping the stage. Treat them as separate scenic wings with a narrow centre, not a flat panoramic picture. Faces, readable apps and exhibits stay inside a wide panel or on the upper screen. The centre is scenery only. No essential visual depends on a horizontal line matching across the joins.

## Run and review

Start the normal presenter. In **Settings → Displays**, open **Upper screen** and **LED wall**. Move each window onto its output and enter fullscreen. The LED processor handles the three lower sections; do not open three independent browser windows for them. Keep output resolution at the native dimensions and disable overscan or stretch in the venue processor.

**View whole set** is a silent, linked rehearsal view. Use Scenes, GO, Back, Replay and Pause in the presenter; all outputs follow it. Its front view is schematic: the relative physical size and angles of the upper screen and wings still need checking at the venue. It does not pretend to simulate audience sightlines.

Open previews through the running server, not by opening `venue.html` as a local file. A direct-file view cannot load the show and now displays instructions instead of an empty screen. A disconnected whole-set view also explains how to reconnect.

For a paused individual cue, open `venue.html?surface=overview&cue=CUE_ID&t=SECONDS`. Add `&guides=1` to show panel boundaries. Guides and layout labels never appear in the normal audience outputs. `surface=upper` and `surface=wall` show the actual output canvases.

Audio still comes from the presenter alone. Every audience window is silent. Police, courtroom and news footage retain their existing performances and audio; no recordings were regenerated for this layout.

## Scene treatments

- **1 · Opening montage — slide 1:** the film fills the upper screen; the LED wall stays dark. Dates remain readable at their original aspect ratio.
- **2 · Cold Open — slides 2–47:** the call sits above SJ’s browser. During the shared PR, the PR fills the upper screen, the call moves to the right wing, and private ChatGPT activity remains on the left wing. The YouTube hunt, pause, Reddit return and music resume retain their clocks.
- **3 · The PR Review — slides 48–67:** the huddle is above; SJ’s PR and Brendan’s plan remain visible together on the lower wings. Ending the huddle does not clear the work.
- **4 · The Cursor Demo — slides 68–114:** the featured app fills the upper screen. Kristina’s quieter desktop and the huddle remain below. The ticket visibly closes above, with the existing narration and musical timing. The time-jump film takes over the upper screen and darkens the wall.
- **5 · Good Instinct — slides 115–156:** standup gives way to the two-person huddle. SJ’s code stays on the left wing; Brendan’s simultaneous Claude and ChatGPT activity is featured above and remains on his wing. The investigation clocks continue across dialogue and narration.
- **6 · Best Practices — slides 157–210:** the huddle stays above while SJ’s local work and Brendan’s cloud work occupy opposite wings. The speed difference and the hidden patch remain visible together.
- **7 · The Latest Model — slides 211–235:** the one-on-one is above. Afterwards the upper view shows both of Kristina’s agents running and completing in parallel, including the single connector test ticket; Brendan’s board remains below. No layoff cut line is exposed.
- **8 · The Offboarding — slides 236–272:** SJ archives the email on the left wing and upper screen before the call. Dana then occupies the upper screen. The calendar search and Brendan reveal remain on SJ’s left wing at their authored cues, with no ranking spreadsheet. The final Workday view replaces the call.
- **9 · Nine Tickets — slides 273–373:** the lower wings frame one apartment from its two existing angles, with a quiet centre treatment. Marcus occupies the upper screen only while connected. The computer’s presence, removal and cans follow the scene. The upper screen goes dark when the call ends.
- **10 · The Audit — slides 374–434:** the borrowed Mac’s wallpaper and terminal are featured above. During worm narration, the main explanation stays above and the distinct system view occupies the right wing; Brendan’s dim studio remains on the left. Responder films run once above, with dim scenery below. The message draft returns above at the end. The score continues under Brendan, narration and responder films.
- **11 · Next Week — slides 435–465:** SJ’s apartment and returned Mac remain below. The wallpaper appears above on the narration that says it wakes. The following news montage runs above, with dim apartment scenery below.
- **12 · Current Employer — slides 466–499:** Marcus’s call is above the apartment. Police films replace that upper view once, never as laptop participants. Each clip clears when it ends; the apartment remains below. The hallway-to-interior knock cue is retained.
- **13 · The Trial — slides 500–529:** courtroom scenery occupies the lower wings. The prosecutor and judge appear once above. Exhibits use the left wing while a recorded official speaks, then can fill the upper screen during other evidence cues. The audit exhibit’s termination time matches the prosecutor’s spoken **09:14**.
- **14 · Continuity — slides 530–563:** candlelit apartment scenery and the radio occupy the lower wings; the upper screen is dark during the private conversation. The city and stars remain visible below after the radio ends. Swarm explanation, news and reporters use the upper screen; off-camera answers stay black. The old supplemental action-count badge is not projected over rooms, exhibits or people.
- **15 · Great News — slides 564–583:** a dark transition leads to a spare workshop/window treatment below, leaving the live loom and actors to carry the scene. No computer interface is projected into the technology ban. The last title and existing outro film appear above.

## Make changes

The script remains **show.json**. `screen-actions.json` still holds the two authored computer-action tracks. Do not rename or renumber cues to move an image between outputs.

- `venue-plan.js` assigns each scene/cue to the upper screen and LED wings. It contains no dialogue.
- `venue.js` sends those assignments to the existing visual renderer and manages the scenic loops.
- `venue.css` defines the exact output geometry. Complete 16:9 computer canvases fit inside each 2048×896 wing with space at both sides; no text is cropped to fill a panel.
- `venue-graphics.js` draws the two-agent view already described by the script.
- `display.*` remains the internal 1920×1080 content renderer, including its original `side` links used by exports. The presenter opens `venue.html` for physical outputs.

The upper reading view makes featured applications larger and opaque; desktop ownership remains visible at the edges. The LED desktop views retain their translucent windows and owner wallpapers.

Before merging, review the whole-set view at the theatre with the actual upper screen size, panel angles, actor positions and back-row sightlines. In particular, check simultaneous desktop jokes, the calendar reveal, audit diagrams and court exhibits. Pixel-correct previews cannot establish those physical viewing conditions.
