# The Big Hack — Stage Console Brand Guide

Version 1 · September 12, 2026

## Purpose

The console serves the person running a live performance. Its first job is to keep the current speaker, spoken text, acting directions, and next action legible under pressure in a dark room. Visual character comes from typography, spacing, and precise use of color.

This guide defines the target design for the operator console. Audience projections follow the script’s art direction and are a separate surface. The operator console uses this palette and hierarchy. Treat these rules as the baseline for future changes.

## Character

Quiet, theatrical, precise. Use neutral dark surfaces, warm white text, and a single lime action accent. Keep the title as a restrained typographic wordmark: “THE BIG HACK,” with “Stage console” as secondary identification. Do not invent a logo or add decorative hacker imagery, terminal effects, neon glows, gradients, or animated ornament.

## Color system

Use semantic CSS variables. New components must use these tokens rather than introduce near-duplicate colors.

- `--canvas: #141414` — main background.
- `--surface: #1C1C1C` — transport, dialogs, and monitoring regions.
- `--surface-hover: #292929` — hovered neutral controls.
- `--border: #3A3A3A` — decorative dividers and panel edges.
- `--control-border: #777777` — boundaries needed to identify inputs or controls.
- `--text: #F2F0EA` — dialogue and primary labels; warm white.
- `--text-secondary: #B8B8B3` — acting directions, upcoming dialogue, and secondary labels.
- `--text-muted: #999995` — cue identifiers, timestamps, and supplementary metadata. Never reduce opacity further on essential text.
- `--accent: #C7F28B` — GO and the active cue marker.
- `--accent-hover: #D6FAA7` — GO hover.
- `--on-accent: #182010` — text on lime.
- `--focus: #F2F0EA` — visible keyboard focus ring.
- `--danger-text: #F0B8AE` — inactive blackout control and error text.
- `--danger-fill: #922F27` — engaged blackout background, with primary text and an explicit state label.

Neutral buttons, speaker names, the wordmark, links, and speed controls do not receive lime. Identify speakers through names, weight, and placement rather than character colors. Mark the current navigation item with a lime rule and neutral elevated background; keep its text warm white. Screen instructions use a neutral rule and a written label.

Reserve red for blackout and failures that need attention. State must always be readable from words or shape as well as color. Check actual foreground/background combinations: at least 4.5:1 for normal text, 3:1 for large text and essential control boundaries. Decorative dividers may be quieter.

## Typography

Use the installed system sans-serif stack. No downloaded fonts are required. Use monospace only for cue identifiers and clocks; use tabular numerals for changing counts and speed values.

- Dialogue: 32px default, regular weight, 1.5 line height. Retain the operator’s text-size preference. Never shrink automatically to fit a long cue.
- Acting directions: 18–20px, secondary text, 1.5–1.6 line height. Italics may distinguish delivery, but directions must remain easy to read.
- Speaker: 14px, semibold, modest letter spacing, primary text. Place immediately above the speech it identifies.
- Scene heading: 22–24px, medium weight.
- Buttons and settings: 14–16px. GO: 23–24px, bold.
- Essential metadata: 12px minimum. Small uppercase labels are supplementary only.

Use sentence case for interface labels. Reserve uppercase for the wordmark, GO, and brief speaker labels. Avoid long text with wide tracking. Aim for roughly 45–65 characters per dialogue line where screen space allows.

## Screen hierarchy

The eye should find the current speaker and notes first, GO second, and the next cue third. Navigation and configuration remain easy to reach without occupying the reading area.

The default screen contains a compact header, a broad notes column, a narrow monitoring column, and a fixed transport bar. Speaker notes are visible immediately. Settings and Scenes are closed on load. Audience previews stay small and visually subordinate. On narrow screens, hide previews before sacrificing notes space.

Use an 8px spacing rhythm, with 4px for small adjustments. Use 24–40px main padding and 24–32px separation between major regions. Prefer whitespace and subtle rules to repeated boxes. Keep corners restrained: 6–8px on controls and up to 12px on dialogs. Avoid decorative shadows.

Long notes scroll inside their reading area while the speaker context and transport remain accessible. Do not truncate the current speech or acting directions. A shortened upcoming cue is acceptable when clearly labeled “Coming next.” Source/adaptation details may be collapsed; performance directions may not be hidden with them.

## Controls and behavior

GO is the only filled lime control on the default screen and stays in a stable bottom-right position. Keep Back, Replay, and Start/Pause neutral and distinct. Never move GO when a status message changes. Main performance controls should have a target at least 44px high.

Blackout stays in a consistent header position, separated from GO. Engaged blackout must show a filled red state and explicit wording, not merely a color change.

Scenes opens searchable running order and cues. Choosing a cue closes navigation and leaves playback paused. Settings contains display setup, Live/Generated selection per character, playback speed, volume, and advanced clip options. Show the current speed in the transport; activating it opens its setting. Keep “Live” and “Generated” labels consistent everywhere.

Use explicit status text such as “Ready,” “Playing,” “Paused,” and “Live · ready for performer.” Describe an audio failure with an available next action. Avoid unexplained abbreviations and implementation vocabulary.

Retain keyboard shortcuts and display them as secondary hints. Dialogs trap focus, close with Escape, and suppress performance shortcuts while open. Return focus to the opening control. Use a 2px warm-white focus ring with a 3px offset. Respect reduced-motion preferences; no flashing or pulsing states.

## Review before shipping

Inspect the actual app at 1440×900, 1280×800, and a narrow 700px viewport. Verify the following:

- The speaker and notes are immediately visible with dialogs closed.
- Long dialogue and multiple acting directions remain readable and reachable.
- GO is visible without page scrolling and clearly outweighs other controls.
- Opening Scenes or Settings does not accidentally start playback.
- Live and Generated states, changed speed, pause, missing audio, and engaged blackout are unambiguous.
- Keyboard focus, text contrast, and control boundaries remain visible throughout.
- No horizontal overflow, overlapping labels, unexpected font reduction, or new decorative colors appear.

Judge polish at performance reading distance, not only in a close-up screenshot. Use existing local tooling or containers for any additional software. Update this guide when a deliberate design decision changes; do not accumulate exceptions in individual components.
