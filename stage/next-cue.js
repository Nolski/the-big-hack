// What kind of cue comes next, for the "Coming next" label actors read from.
// INTERRUPTION and CONTINUED LINE are alerts: the reader must not leave a gap.
export function nextCueType(current, next) {
  if (!next) return null;
  if (next.interrupts) return {label: 'INTERRUPTION', alert: true};
  if (current && next.scene !== current.scene) return {label: 'New scene', alert: false};
  if (next.montage || next.performanceVideo) return {label: 'Video', alert: false};
  if (next.speaker === 'narrator') return {label: 'Narration', alert: false};
  if (next.kind === 'stage') return {label: 'Stage direction', alert: false};
  if (current && next.speaker && next.speaker === current.speaker) return {label: 'CONTINUED LINE', alert: true};
  if (next.kind === 'voice') return {label: 'Recorded voice', alert: false};
  return {label: 'Next line', alert: false};
}
