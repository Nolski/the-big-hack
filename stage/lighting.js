// Desk spotlights, stage right to left. A scene's `lighting` is its opening
// state; a cue's `lighting` is the full lit set from that cue until the next
// change in the same scene. No lighting anywhere in the scene means not set.
export const DESKS = [
  {id: 'kristina', key: 'K', name: 'Kristina'},
  {id: 'brendan', key: 'B', name: 'Brendan'},
  {id: 'liam', key: 'S', name: 'SJ'},
  {id: 'marcus', key: 'M', name: 'Marcus'},
];
export function lightingAt(show, index) {
  const cue = show.cues[index];
  if (!cue) return null;
  for (let i = index; i >= 0 && show.cues[i].scene === cue.scene; i--)
    if (Array.isArray(show.cues[i].lighting)) return show.cues[i].lighting;
  const scene = show.scenes.find(s => s.id === cue.scene);
  return Array.isArray(scene?.lighting) ? scene.lighting : null;
}
