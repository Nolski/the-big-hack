#!/usr/bin/env python3
"""Build review.html and review-reel.mp4 from the section JSON files.

Run from research/montage-candidates/:

    python3 build_review.py            # review.html only
    python3 build_review.py --reel     # also concatenate every clip into review-reel.mp4

review.html opens from the filesystem; frames and clips are referenced relatively.
Standard library plus ffmpeg only.
"""
import argparse
import glob
import html
import json
import os
import subprocess
import sys
import tempfile

SECTION_ORDER = [
    "aotearoa-new-zealand", "australia", "the-very-rich", "epstein",
    "who-breathes-it", "getting-by", "in-the-streets", "fire-storm-gun", "altman-sister",
]


def load_sections():
    files = {os.path.splitext(f)[0]: f for f in glob.glob("*.json")}
    order = [s for s in SECTION_ORDER if s in files] + sorted(set(files) - set(SECTION_ORDER))
    out = []
    for name in order:
        with open(files[name], encoding="utf-8") as fh:
            data = json.load(fh)
        if "subjects" in data:  # skips picks.json and picks-list.json
            out.append(data)
    return out


def build_html(sections):
    e = html.escape
    parts = []
    total = 0
    for sec in sections:
        n = sum(len(s["clips"]) for s in sec["subjects"])
        total += n
        parts.append(f'<section><h2 id="{e(sec["section"])}">{e(sec["section"])} <small>{n} clips</small></h2>')
        for subj in sec["subjects"]:
            parts.append(f'<h3>{e(subj["subject"])} <small>{len(subj["clips"])}</small></h3>')
            if not subj["clips"]:
                parts.append(f'<p class="empty">Nothing cut. Searched: {e(subj.get("searched", ""))}</p>')
            parts.append('<div class="grid">')
            for c in subj["clips"]:
                flags = []
                if not c.get("verified", True):
                    flags.append("unverified")
                if not c.get("actualEvent", True):
                    flags.append("file footage")
                if c.get("aspect") and c["aspect"] != "16:9":
                    flags.append(c["aspect"])
                if c.get("caveats"):
                    flags.append(c["caveats"])
                search = " ".join(str(v) for v in c.values()) + " " + subj["subject"] + " " + sec["section"]
                parts.append(
                    f'<div class="card" data-name="{e(c["name"])}" data-search="{e(search.lower())}">'
                    f'<div class="media" data-src="{e(c["file"])}"><img loading="lazy" src="{e(c["frame"])}" alt=""></div>'
                    f'<div class="meta">'
                    f'<span class="vote"><button data-v="up" title="keep">👍</button><button data-v="down" title="drop">👎</button></span>'
                    f'<b>{e(c["name"])}</b> <span class="len">{c["length"]:.1f}s</span><br>'
                    f'{e(c.get("publisher", ""))} · {e(c.get("date", ""))} · <a href="{e(c["url"])}" target="_blank">source</a> @ {c["start"]:.1f}s<br>'
                    f'<span class="shows">{e(c.get("shows", ""))}</span><br>'
                    + (f'<span class="text">“{e(c["onScreenText"])}”</span><br>' if c.get("onScreenText") else "")
                    + (f'<span class="flags">{e("; ".join(flags))}</span>' if flags else "")
                    + '</div></div>'
                )
            parts.append('</div>')
            if subj.get("unverified"):
                items = "".join(f'<li><a href="{e(u)}" target="_blank">{e(u)}</a></li>' for u in subj["unverified"])
                parts.append(f'<details><summary>{len(subj["unverified"])} unverified URLs</summary><ul>{items}</ul></details>')
        parts.append('</section>')
    nav = " · ".join(f'<a href="#{e(s["section"])}">{e(s["section"])}</a>' for s in sections)
    return f"""<!doctype html>
<meta charset="utf-8">
<title>Montage candidates</title>
<style>
body{{font:14px/1.4 system-ui,sans-serif;background:#111;color:#ddd;margin:0;padding:16px}}
h2{{margin:32px 0 8px;border-bottom:1px solid #333}} h3{{margin:20px 0 6px;color:#bbb}} small{{color:#777;font-weight:normal}}
nav{{position:sticky;top:0;background:#111;padding:8px 0;border-bottom:1px solid #333;z-index:2}}
nav input{{width:320px;padding:6px;background:#222;color:#eee;border:1px solid #444;margin-right:12px}}
nav a{{color:#9cf;text-decoration:none}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}}
.card{{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:4px;overflow:hidden}}
.card.hidden{{display:none}}
.card.up{{border-color:#4c4;box-shadow:0 0 0 1px #4c4}} .card.down{{opacity:.35}}
.media{{aspect-ratio:16/9;background:#000;cursor:pointer}} .media img,.media video{{width:100%;height:100%;object-fit:contain;display:block}}
.meta{{padding:8px}} .len{{color:#8c8}} .shows{{color:#aaa}} .text{{color:#fc6}} .flags{{color:#f88}} .empty{{color:#f88}}
.vote{{float:right}} .vote button{{background:#222;border:1px solid #444;border-radius:3px;color:#ddd;font-size:16px;padding:2px 8px;margin-left:4px;cursor:pointer}}
.card.up .vote button[data-v=up],.card.down .vote button[data-v=down]{{background:#4c4;border-color:#4c4;color:#000}}
.card.down .vote button[data-v=down]{{background:#c44;border-color:#c44}}
details{{margin:6px 0 0;color:#888}} details a{{color:#79b}}
a{{color:#9cf}}
nav .chip{{background:#222;border:1px solid #444;color:#ddd;padding:4px 8px;border-radius:3px;cursor:pointer;margin-right:4px}} nav .chip.on{{background:#444}}
#status{{color:#888;margin-left:12px}}
</style>
<nav><input id="q" placeholder="filter (chyron, subject, publisher, name)…" autofocus>
<button class="chip on" data-f="all">all</button><button class="chip" data-f="up">👍 <span id="nup">0</span></button><button class="chip" data-f="down">👎 <span id="ndown">0</span></button><button class="chip" data-f="none">unrated</button>
<span id="count">{total}</span> shown · <button class="chip" id="export">export picks.json</button><span id="status"></span><br>
<small>{nav}</small></nav>
{"".join(parts)}
<script>
document.querySelectorAll('.media').forEach(m=>m.addEventListener('click',()=>{{
  const v=m.querySelector('video');
  if(v){{v.paused?v.play():v.pause();return;}}
  const el=document.createElement('video');el.src=m.dataset.src;el.loop=true;el.muted=true;el.controls=true;el.autoplay=true;
  m.replaceChildren(el);
}}));
const q=document.getElementById('q'),cards=[...document.querySelectorAll('.card')],count=document.getElementById('count'),status=document.getElementById('status');
const KEY='montage-picks';let picks={{}},mode='all';
try{{picks=JSON.parse(localStorage.getItem(KEY)||'{{}}')}}catch(e){{}}
function filter(){{const t=q.value.toLowerCase().trim();let n=0;
  cards.forEach(c=>{{const v=picks[c.dataset.name]||'none';
    const show=(!t||c.dataset.search.includes(t))&&(mode==='all'||mode===v);
    c.classList.toggle('hidden',!show);if(show)n++;}});count.textContent=n;}}
function apply(){{let up=0,down=0;
  cards.forEach(c=>{{const v=picks[c.dataset.name];c.classList.toggle('up',v==='up');c.classList.toggle('down',v==='down');if(v==='up')up++;if(v==='down')down++;}});
  document.getElementById('nup').textContent=up;document.getElementById('ndown').textContent=down;filter();}}
function save(){{try{{localStorage.setItem(KEY,JSON.stringify(picks))}}catch(e){{}}
  fetch('picks.json',{{method:'POST',body:JSON.stringify({{updated:new Date().toISOString(),picks}},null,1)}})
    .then(r=>{{status.textContent=r.ok?'saved to picks.json':'not saved to disk (run serve_review.py), kept in this browser'}})
    .catch(()=>{{status.textContent='not saved to disk (run serve_review.py), kept in this browser'}});}}
fetch('picks.json',{{cache:'no-store'}}).then(r=>r.ok?r.json():null).then(j=>{{if(j&&j.picks){{picks=j.picks;apply();}}}}).catch(()=>{{}});
cards.forEach(c=>c.querySelectorAll('.vote button').forEach(b=>b.addEventListener('click',ev=>{{ev.stopPropagation();
  const n=c.dataset.name,v=b.dataset.v;if(picks[n]===v)delete picks[n];else picks[n]=v;apply();save();}})));
document.querySelectorAll('nav .chip[data-f]').forEach(b=>b.addEventListener('click',()=>{{mode=b.dataset.f;
  document.querySelectorAll('nav .chip[data-f]').forEach(x=>x.classList.toggle('on',x===b));filter();}}));
document.getElementById('export').addEventListener('click',()=>{{
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({{updated:new Date().toISOString(),picks}},null,1)],{{type:'application/json'}}));a.download='picks.json';a.click();}});
q.addEventListener('input',filter);apply();
</script>
"""


def all_clips(sections):
    """Every clip in page order, each tagged with its section name."""
    for sec in sections:
        for subj in sec["subjects"]:
            for c in subj["clips"]:
                yield sec["section"], c


def build_reel(clips, out, captions=True):
    """Normalise clips to 854x480 25fps, optionally caption them, then concatenate."""
    if captions and subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout.find("drawtext") < 0:
        sys.exit("ffmpeg lacks drawtext; cannot caption the reel")
    tmp = tempfile.mkdtemp(prefix="reel-")
    parts = []
    for section, c in clips:
        dst = os.path.join(tmp, f"{len(parts):04d}.mp4")
        vf = "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2,fps=25"
        if captions:
            label = f'{section} | {c["name"]} | {c["length"]:.1f}s'.replace(":", r"\:").replace("'", "")
            vf += f",drawtext=text='{label}':x=8:y=h-28:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=4"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", c["file"], "-vf", vf, "-an",
                        "-c:v", "libx264", "-crf", "22", "-pix_fmt", "yuv420p", dst], check=True)
        parts.append(dst)
    if not parts:
        os.rmdir(tmp)
        sys.exit("no clips to cut")
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as fh:
        fh.writelines(f"file '{p}'\n" for p in parts)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", "-movflags", "+faststart", out], check=True)
    for p in parts:
        os.remove(p)
    os.remove(lst)
    os.rmdir(tmp)
    return out, len(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reel", action="store_true", help="also build review-reel.mp4 (every clip, captioned)")
    ap.add_argument("--picks", nargs="?", const="picks.json", metavar="PICKS_JSON",
                    help="cut only the thumbs-up clips into picks-reel.mp4 and write picks-list.json")
    args = ap.parse_args()
    sections = load_sections()
    with open("review.html", "w", encoding="utf-8") as fh:
        fh.write(build_html(sections))
    n = sum(len(s["clips"]) for sec in sections for s in sec["subjects"])
    print(f"review.html: {len(sections)} sections, {n} clips")
    if args.reel:
        out, k = build_reel(list(all_clips(sections)), "review-reel.mp4")
        print(f"{out}: {k} clips")
    if args.picks:
        with open(args.picks, encoding="utf-8") as fh:
            picks = json.load(fh).get("picks", {})
        chosen = [(sec, c) for sec, c in all_clips(sections) if picks.get(c["name"]) == "up"]
        with open("picks-list.json", "w", encoding="utf-8") as fh:
            json.dump([dict(c, section=sec) for sec, c in chosen], fh, indent=1, ensure_ascii=False)
        total = sum(c["length"] for _, c in chosen)
        print(f"picks-list.json: {len(chosen)} clips, {total:.1f} s")
        out, k = build_reel(chosen, "picks-reel.mp4", captions=False)
        print(f"{out}: {k} clips")


if __name__ == "__main__":
    main()
