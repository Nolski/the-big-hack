// Deterministic human-ish typing rhythm. Emits keys.js (for the page) and
// keys.json (for the audio), so picture and sound use one schedule.
const fs = require('fs'), path = require('path');
const OUT = process.env.OUT || process.argv[2];
if (!OUT) { console.error('usage: OUT=<dir> node keystrokes.js'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const P = "review the play's script for technical accuracy, in particular the mechanism by which the AI virus gets loose";
const T0 = 5.0;        // beat on the empty prompt before the hands start
const TOTAL = 4.25;    // seconds of typing; raise this to slow the whole run
const AFTER = 0.45;    // beat between the last character and Enter
const SEED = 20261027;

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(SEED);
const weights = [];
for (let i = 0; i < P.length; i++) {
  const c = P[i], prev = P[i - 1];
  let w = 1;
  if (c === ' ') w *= 1.25;                        // reaching for the space bar
  if (prev === ' ') w *= 1.2;                      // first letter of a word
  if (c === "'" || c === ',') w *= 1.9;            // punctuation costs a beat
  if (prev === "'" || prev === ',') w *= 1.5;      // and so does recovering
  if (c >= 'A' && c <= 'Z') w *= 1.6;              // shift
  w *= Math.exp((rnd() * 2 - 1) * 0.5);            // ordinary unevenness
  if (rnd() < 0.055) w *= 2.5 + rnd() * 3.5;       // a thinking pause
  weights.push(w);
}
const scale = TOTAL / weights.reduce((a, b) => a + b, 0);
let t = 0;
const keys = weights.map(w => +((t += w * scale)).toFixed(5));
const send = +(T0 + keys[keys.length - 1] + AFTER).toFixed(5);

fs.writeFileSync(path.join(OUT, 'keys.json'),
  JSON.stringify({ text: P, t0: T0, send, keys }, null, 1));

const gaps = keys.map((x, i) => x - (i ? keys[i - 1] : 0));
const sorted = [...gaps].sort((a, b) => a - b);
console.log(`${keys.length} keys over ${TOTAL}s · gap min ${sorted[0].toFixed(3)}s ` +
  `median ${sorted[sorted.length >> 1].toFixed(3)}s max ${sorted[sorted.length - 1].toFixed(3)}s · enter at ${send}s`);
