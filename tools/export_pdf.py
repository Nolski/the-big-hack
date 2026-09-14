#!/usr/bin/env python3
"""Export the current script (stage/show.json) as a dated read-through PDF in exports/.

Usage: python3 tools/export_pdf.py [output.pdf]
"""
import datetime, html, json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
show = json.loads((ROOT / 'stage' / 'show.json').read_text())
today = datetime.date.today().isoformat()
try:
    commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT, text=True).strip()
    branch = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=ROOT, text=True).strip()
except Exception:
    commit, branch = '?', '?'
out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'exports' / f'The Big Hack — Script ({today}).pdf'
out.parent.mkdir(parents=True, exist_ok=True)

e = html.escape
live = set(show.get('liveCast', []))
names = {}
for c in show['cues']:
    if c.get('speaker'):
        names.setdefault(c['speaker'], c.get('name') or c['speaker'].title())

def cue_html(c):
    if c['kind'] == 'stage':
        return f'<p class="dir">{e(c["text"])}</p>'
    who = e(c.get('name') or names[c['speaker']])
    cls = 'narr' if c['speaker'] == 'narrator' else ('live' if c['kind'] == 'live' else 'video')
    d = f' <span class="pd">({e(c["direction"])})</span>' if c.get('direction') else ''
    return f'<p class="cue {cls}"><span class="who">{who}</span>{d}<span class="t">{e(c["text"])}</span></p>'

movements = {'Prologue': 'Prologue', 'I': 'Movement I', 'II': 'Movement II', 'III': 'Movement III', 'IV': 'Movement IV', 'V': 'Movement V'}
body, last_mv, n = [], None, 0
for sc in show['scenes']:
    mv = sc.get('movement', '')
    if mv != last_mv:
        body.append(f'<h2 class="mv">{e(movements.get(mv, mv))}</h2>')
        last_mv = mv
    n += 1
    setting = sc.get('storyboard', {}).get('productionSetting', '')
    body.append(f'<section class="scene"><h3><span class="num">{n}.</span> {e(sc["title"])}</h3>')
    if setting:
        body.append(f'<p class="setting">{e(setting)}</p>')
    body.extend(cue_html(c) for c in show['cues'] if c['scene'] == sc['id'])
    body.append('</section>')

cast_rows = ''.join(
    f'<tr><td>{e(nm)}</td><td>{"Live" if sp in live else "AI video"}</td></tr>'
    for sp, nm in names.items() if sp != 'narrator')

doc = f'''<!doctype html><html><head><meta charset="utf-8"><title>{e(show["title"])}</title>
<style>
@page {{ size: A4; margin: 22mm 20mm 20mm 20mm;
  @top-left {{ content: "{e(show["title"])} — Script ({today})"; font: 8.5pt "Liberation Sans", sans-serif; color: #666; }}
  @bottom-center {{ content: counter(page); font: 9pt "Liberation Sans", sans-serif; color: #666; }} }}
@page :first {{ @top-left {{ content: none; }} @bottom-center {{ content: none; }} }}
body {{ font: 11pt/1.4 "Liberation Serif", "Noto Serif", serif; color: #111; }}
.title {{ page-break-after: always; text-align: center; padding-top: 70mm; }}
.title h1 {{ font-size: 30pt; letter-spacing: 3px; margin: 0 0 6mm; text-transform: uppercase; }}
.title .sub {{ font-size: 13pt; color: #444; margin-bottom: 18mm; }}
.title .meta {{ font: 9.5pt "Liberation Sans", sans-serif; color: #666; line-height: 1.7; }}
.cast {{ page-break-after: always; }}
.cast h2 {{ font-size: 14pt; letter-spacing: 2px; text-transform: uppercase; }}
.cast table {{ border-collapse: collapse; font-size: 11pt; }}
.cast td {{ padding: 2px 18px 2px 0; }}
.cast p {{ color: #555; font-size: 10pt; }}
h2.mv {{ page-break-before: always; font-size: 20pt; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8mm; }}
h2.mv:first-of-type {{ page-break-before: auto; }}
.scene {{ margin-bottom: 10mm; }}
h3 {{ font-size: 14pt; margin: 8mm 0 3mm; page-break-after: avoid; border-bottom: 1px solid #999; padding-bottom: 1.5mm; }}
h3 .num {{ color: #777; font-weight: normal; margin-right: 2mm; }}
.setting {{ font-style: italic; color: #444; margin: 0 0 4mm; page-break-after: avoid; }}
.dir {{ font-style: italic; color: #333; margin: 2.5mm 0 2.5mm 10mm; }}
.cue {{ margin: 0 0 2.2mm 10mm; text-indent: -10mm; page-break-inside: avoid; }}
.cue .who {{ font-weight: bold; text-transform: uppercase; font-size: 9.5pt; letter-spacing: .6px; }}
.cue .who::after {{ content: ":"; }}
.cue .pd {{ font-style: italic; color: #555; }}
.cue .t {{ margin-left: 1.5mm; }}
.cue.narr .who {{ color: #7a4a00; }}
.cue.narr .t {{ color: #5a3a00; }}
.cue.video .who::before {{ content: "▶ "; font-size: 7pt; color: #888; vertical-align: 1px; }}
</style></head><body>
<div class="title"><h1>{e(show["title"])}</h1><div class="sub">A Kiwicon talk, staged as a play</div>
<div class="meta">Script export {today}<br>Branch {e(branch)} · commit {e(commit)} · revision {e(show.get("scriptRevision", ""))}<br>{len(show["scenes"])} scenes · {len(show["cues"])} cues</div></div>
<div class="cast"><h2>Cast</h2><table>{cast_rows}</table>
<p>{e(", ".join(names[sp] for sp in names if sp in live))} are performed live on stage. Everyone else is a pre-rendered AI-video character, marked ▶ in the script; live and video characters never share a plane. Narrator lines are recorded voice-over. Italic lines are stage and screen directions.</p></div>
{"".join(body)}
</body></html>'''

from weasyprint import HTML
HTML(string=doc, base_url=str(ROOT)).write_pdf(str(out))
print(out)
