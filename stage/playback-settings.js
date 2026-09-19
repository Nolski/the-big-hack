// Pure playback helpers. The authored show stays intact; cast choices only
// determine which cues need their own recording and operator GO button.
export function playbackRate(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(2, Math.max(0.5, n)) : 1;
}
export function castFor(show) {
  const cast = new Map();
  for (const cue of show.cues) {
    if (!cue.speaker || cue.kind === 'stage') continue;
    if (!cast.has(cue.speaker)) cast.set(cue.speaker, {
      id: cue.speaker, name: cue.name || cue.speaker,
      defaultMode: show.liveCast?.includes(cue.speaker) ? 'live' : 'generated',
    });
  }
  return [...cast.values()];
}
export function readSettings(show, saved = {}) {
  return {rate: playbackRate(saved?.rate ?? 1), modes: Object.fromEntries(
    castFor(show).map(c => [c.id, ['live', 'generated'].includes(saved?.modes?.[c.id])
      ? saved.modes[c.id] : c.defaultMode]))};
}
export function playbackShow(source, settings, recordings = {}) {
  const cues = source.cues.map(c => {
    const recording = recordings[c.id];
    const matched = recording?.text === c.text && recording?.speaker === c.speaker && (recording?.voiceProfile ?? null) === (c.voiceProfile ?? null);
    const spoken = !!c.speaker && c.kind !== 'stage';
    return {...c, kind: spoken ? (settings.modes[c.speaker] === 'live' ? 'live' : 'voice') : c.kind,
      audio: matched ? recording.audio : ((source.audioManifestRequired || recording) ? null : c.audio),
      audioDuration: matched ? recording.duration : ((source.audioManifestRequired || recording) ? 0 : c.audioDuration)};
  });
  const starts = [];
  function group(start, end) {
    starts.push(start);
    cues[start].groupEnd = end;
    cues[start].notes = cues.slice(start, end + 1).map(c => ({
      id: c.id, kind: c.kind, name: c.name, text: c.text, direction: c.direction}));
  }
  const originalStarts = source.performanceStarts || source.cues.map((_, i) => i);
  originalStarts.forEach((start, j) => {
    const end = (originalStarts[j + 1] ?? cues.length) - 1;
    let pending = start;
    for (let i = start; i <= end; i++) {
      if (cues[i].kind !== 'voice') continue;
      if (pending < i) group(pending, i - 1);
      group(i, i);
      pending = i + 1;
    }
    if (pending <= end) group(pending, end);
  });
  return {...source, cues, performanceStarts: starts};
}
export function cueAudio(cue, override = {}) {
  if (override.audioSource === 'none') return null;
  if (cue.kind === 'live') return null;
  if (['left', 'right'].includes(override.audioSource)) return override[override.audioSource]?.src || null;
  return cue.montage || cue.audio || null;
}
