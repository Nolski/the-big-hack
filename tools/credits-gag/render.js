const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const FPS = 24, HOLD = 30, FADE = 2;
const OUT = process.env.OUT || process.argv[2];
if (!OUT) { console.error('usage: OUT=<dir> node render.js'); process.exit(1); }
(async () => {
  const frames = path.join(OUT, 'frames');
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 2 });
  const sched = JSON.parse(fs.readFileSync(path.join(OUT, 'keys.json'), 'utf8'));
  await pg.addInitScript(`window.KEY_T0=${sched.t0};window.KEY_SEND=${sched.send};window.KEYS=${JSON.stringify(sched.keys)};`);
  await pg.goto('file://' + path.join(__dirname, 'gag.html'));
  const end = await pg.evaluate('END'), caretOn = await pg.evaluate('CARET_ON'), blink = await pg.evaluate('BLINK');
  const n = Math.floor(end * FPS);
  const list = [];
  for (let i = 0; i < n; i++) {
    await pg.evaluate(`render(${i / FPS})`);
    const f = path.join(frames, `f${String(i).padStart(4, '0')}.png`);
    await pg.screenshot({ path: f });
    list.push(`file '${f}'\nduration ${(1 / FPS).toFixed(6)}`);
  }
  // two still frames for the held minute: caret visible, caret hidden
  const holdFrames = [];
  for (const [name, t] of [['caretA', caretOn], ['caretB', caretOn + blink]]) {
    await pg.evaluate(`render(${t})`);
    const f = path.join(frames, `${name}.png`);
    await pg.screenshot({ path: f });
    holdFrames.push(f);
  }
  await b.close();
  for (let k = 0; k * blink < HOLD + 1; k++) list.push(`file '${holdFrames[k % 2]}'\nduration ${blink.toFixed(6)}`);
  list.push(`file '${holdFrames[0]}'`);
  const listPath = path.join(frames, 'list.txt');
  fs.writeFileSync(listPath, list.join('\n') + '\n');
  const total = end + HOLD;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listPath,
    '-vf', `fps=${FPS},format=yuv420p,fade=t=out:st=${(total - FADE).toFixed(3)}:d=${FADE}`,
    '-t', String(total + 0.5), '-c:v', 'libx264', '-crf', '16', path.join(OUT, 'silent.mp4')]);
  console.log('animated', end.toFixed(2) + 's', '+ hold', HOLD + 's', '=', total.toFixed(2) + 's');
})();
