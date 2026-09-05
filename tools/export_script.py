#!/usr/bin/env python3
"""Export the play's scenes as a single readthrough PDF.

Reads the running order out of `00 - Production/Structure & Scene Map.md` (the
note says that table is the source of truth for ORDER, so this follows it rather
than the filenames) and pulls each scene's `## Setting / Staging` and `## Script`
sections out of `03 - Script/`.

Section boundaries use the same rule as storyboard/script_parser.py: a section
ends at the next `## ` heading OR a line that is exactly `---`. Anything the
parser cannot see is not in the show, so the PDF should not show it either.

Usage:
    python3 tools/export_script.py [-o OUT.pdf] [--notes] [--draft-only]
"""

import argparse
import html
import re
import subprocess
import datetime
from pathlib import Path

import markdown as md_lib
from weasyprint import HTML

VAULT = Path(__file__).resolve().parent.parent
SCRIPTS = VAULT / "03 - Script"
SCENE_MAP = VAULT / "00 - Production" / "Structure & Scene Map.md"

MOVEMENT_TITLES = {
    "I": "The cold open",
    "II": "The squeeze",
    "III": "Offboarding and the hack",
    "IV": "The press and the arrest",
    "V": "The trial and the plea",
}
STATUS_WORDS = {"⬜": "to draft", "✏️": "drafted", "🔁": "revised", "✅": "locked"}

_md = md_lib.Markdown(extensions=["sane_lists"])


def inline(text):
    """Markdown a fragment down to inline HTML, with wikilinks flattened."""
    text = re.sub(r"\[\[[^\]|]*\|([^\]]*)\]\]", r"\1", text)
    text = re.sub(r"\[\[([^\]]*)\]\]", r"\1", text)
    _md.reset()
    out = _md.convert(text)
    out = re.sub(r"^<p>|</p>$", "", out.strip())
    return out


# ---------------------------------------------------------------- source files

def read_section(path, heading):
    """Return the lines of one `## heading` section, minus the heading itself."""
    lines = path.read_text(encoding="utf-8").splitlines()
    out, inside = [], False
    for ln in lines:
        if ln.strip() == f"## {heading}":
            inside = True
            continue
        if inside and (ln.startswith("## ") or ln.strip() == "---"):
            break
        if inside:
            out.append(ln)
    return out


def frontmatter(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return {}
    fm = {}
    for ln in lines[1:]:
        if ln.strip() == "---":
            break
        m = re.match(r"^(\w+):\s*(.*)$", ln)
        if m:
            fm[m.group(1)] = m.group(2).strip().strip('"')
    return fm


def running_order():
    """Parse the scene-map table. Rows without a wikilink are unwritten slots."""
    rows, inside = [], False
    for ln in SCENE_MAP.read_text(encoding="utf-8").splitlines():
        if ln.strip() == "## Scene running order":
            inside = True
            continue
        if inside and ln.startswith("## "):
            break
        if not inside or not ln.startswith("|"):
            continue
        cells = [c.strip() for c in ln.replace(r"\|", "\x00").strip("|").split("|")]
        if len(cells) < 4 or cells[0] in ("Order", "") or set(cells[0]) <= {"-", ":"}:
            continue
        slot, scene, movement, status = cells[0], cells[1], cells[2], cells[3]
        link = re.search(r"\[\[([^\x00\]]+)(?:\x00([^\]]+))?\]\]", scene)
        if link:
            target, label = link.group(1), link.group(2) or link.group(1)
            path = SCRIPTS / f"{target}.md"
            rows.append({"slot": slot, "title": label, "path": path if path.exists() else None,
                         "movement": movement, "status": status,
                         "note": "" if path.exists() else "file not found"})
        else:
            rows.append({"slot": slot, "title": re.sub(r"\*|\[|\]", "", scene).strip(),
                         "path": None, "movement": movement, "status": status,
                         "note": "not yet written"})
    return rows


# -------------------------------------------------------------- script → html

CALLOUT_RE = re.compile(r"^>\s*\[!(\w+)\]\s*(.*)$")
DIRECTION_RE = re.compile(r"^\*\((.*)\)\*$")
# **NAME** *(parenthetical)*: line   /   **NAME**: line
CUE_RE = re.compile(r"^\*\*([^*]+)\*\*\s*(\*\([^)]*\)\*)?\s*:\s*(.*)$", re.S)


def blocks(lines):
    """Group raw markdown lines into blocks, keeping multi-line callouts whole."""
    out, buf = [], []
    for ln in lines:
        if not ln.strip():
            if buf:
                out.append(buf)
                buf = []
            continue
        if buf and (ln.startswith(">") != buf[0].startswith(">")):
            out.append(buf)
            buf = []
        buf.append(ln)
    if buf:
        out.append(buf)
    return out


def render_callout(block):
    kind, title = "note", ""
    body = []
    for ln in block:
        stripped = re.sub(r"^>\s?", "", ln)
        m = CALLOUT_RE.match(ln.strip())
        if m and not body and not title:
            kind, title = m.group(1), m.group(2)
        else:
            body.append(stripped)
    text = " ".join(b for b in body if b.strip())
    cls = "screen" if kind == "screen" else "callout"
    head = f'<div class="cue-head">{inline(title)}</div>' if title else ""
    line = f'<div class="cue-body">{inline(text)}</div>' if text.strip() else ""
    return f'<div class="{cls}">{head}{line}</div>'


def render_script(lines):
    parts = []
    for block in blocks(lines):
        if block[0].lstrip().startswith(">"):
            parts.append(render_callout(block))
            continue
        text = " ".join(b.strip() for b in block)
        m = DIRECTION_RE.match(text)
        if m:
            parts.append(f'<p class="dir">({inline(m.group(1))})</p>')
            continue
        m = CUE_RE.match(text)
        if m:
            name, paren, said = m.group(1), m.group(2) or "", m.group(3)
            paren_html = (f'<span class="paren">{inline(paren.strip("*"))}</span> '
                          if paren else "")
            parts.append(f'<p class="line"><span class="who">{html.escape(name)}</span> '
                         f'{paren_html}{inline(said)}</p>')
            continue
        parts.append(f'<p class="line">{inline(text)}</p>')
    return "\n".join(parts)


def render_setting(lines):
    parts = []
    for block in blocks(lines):
        if block[0].lstrip().startswith(">"):
            parts.append(render_callout(block))
        else:
            parts.append(f'<p>{inline(" ".join(b.strip() for b in block))}</p>')
    return "\n".join(parts)


# ------------------------------------------------------------------- document

CSS = """
@page {
  size: A4; margin: 20mm 18mm 18mm 18mm;
  @bottom-center { content: counter(page); font: 9pt Georgia, serif; color: #777; }
  @top-center { content: string(scenetitle); font: 8.5pt Georgia, serif;
                color: #999; letter-spacing: .06em; }
}
@page :first { @top-center { content: ""; } @bottom-center { content: ""; } }
body { font: 10.5pt/1.55 Georgia, "Liberation Serif", serif; color: #16181d; }

.cover { height: 245mm; display: flex; flex-direction: column;
         justify-content: center; text-align: center; page-break-after: always; }
.cover h1 { font-size: 34pt; letter-spacing: .16em; margin: 0 0 6mm; font-weight: normal; }
.cover .rule { width: 40mm; border-top: 1px solid #16181d; margin: 0 auto 8mm; }
.cover .sub { font-size: 12pt; font-style: italic; color: #444; margin-bottom: 22mm; }
.cover .meta { font-size: 9pt; color: #777; line-height: 1.8; }

h2.toc { font-size: 13pt; letter-spacing: .1em; font-weight: normal;
         text-transform: uppercase; margin: 0 0 6mm; }
table.toc { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
table.toc td { padding: 2.2mm 2mm; border-bottom: .3pt solid #e6e6e6;
               vertical-align: baseline; }
table.toc td.slot { width: 12mm; color: #999; }
table.toc td.stat { text-align: right; color: #999; font-size: 8.5pt;
                    font-style: italic; white-space: nowrap; }
table.toc td.pg { width: 10mm; text-align: right; color: #999; }
tr.mv td { border-bottom: none; padding-top: 6mm; font-size: 8.5pt;
           letter-spacing: .12em; text-transform: uppercase; color: #b03a2e; }
tr.unwritten td { color: #b0b0b0; }

.scene { page-break-before: always; }
.scene .mv { font-size: 8pt; letter-spacing: .14em; text-transform: uppercase;
             color: #b03a2e; margin-bottom: 2mm; }
.scene h1 { string-set: scenetitle content(); font-size: 16pt; font-weight: normal;
            margin: 0 0 1.5mm; }
.scene .stat { font-size: 8.5pt; font-style: italic; color: #999;
               margin: 0 0 5mm; padding-bottom: 4mm; border-bottom: .5pt solid #d8d8d8; }

.setting { font-size: 9.5pt; color: #3d4148; background: #f6f6f4;
           border-left: 2pt solid #d8d8d4; padding: 3.5mm 4mm; margin: 0 0 7mm; }
.setting h3 { font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase;
              color: #999; margin: 0 0 2mm; font-weight: normal; }
.setting p { margin: 0 0 2.5mm; }
.setting p:last-child { margin-bottom: 0; }

p.line { margin: 0 0 3.2mm; padding-left: 6mm; text-indent: -6mm; }
.who { font-variant: small-caps; font-weight: bold; letter-spacing: .04em; }
.who::after { content: ":"; font-variant: normal; }
.paren { font-style: italic; color: #666; }
p.dir { margin: 0 0 3.2mm; padding-left: 6mm; font-style: italic; color: #5a5f68; }

.screen, .callout { margin: 0 0 3.5mm; padding: 2.5mm 3.5mm; page-break-inside: avoid;
                    border-left: 2pt solid #7a8ba6; background: #f2f5f9; }
.callout { border-left-color: #d8d8d4; background: #f6f6f4; }
.cue-head { font-size: 8pt; letter-spacing: .1em; text-transform: uppercase;
            color: #4a5a72; margin-bottom: 1.5mm; }
.callout .cue-head { color: #888; }
.cue-body { font-size: 10pt; }
.screen code, .cue-head code { font-family: Georgia, serif; font-size: 8pt; }
code { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; }

.unwritten-page { page-break-before: always; color: #b0b0b0; font-style: italic; }
.unwritten-page h1 { font-size: 16pt; font-weight: normal; color: #999;
                     font-style: normal; string-set: scenetitle content(); }
"""


def build(rows, out_path, include_notes=False):
    today = datetime.date.today().isoformat()
    try:
        commit = subprocess.run(["git", "-C", str(VAULT), "rev-parse", "--short", "HEAD"],
                                capture_output=True, text=True).stdout.strip()
        branch = subprocess.run(["git", "-C", str(VAULT), "rev-parse", "--abbrev-ref", "HEAD"],
                                capture_output=True, text=True).stdout.strip()
    except Exception:
        commit = branch = "?"

    written = [r for r in rows if r["path"]]
    parts = []

    # --- scenes (built first so the contents page can count them)
    body = []
    for r in rows:
        movement = f"Movement {r['movement']} · {MOVEMENT_TITLES.get(r['movement'], '')}"
        if not r["path"]:
            body.append(f'<section class="unwritten-page"><div class="mv">{movement}</div>'
                        f'<h1>{html.escape(r["title"])}</h1>'
                        f'<p>Slot {html.escape(r["slot"])} — {html.escape(r["note"])}.</p></section>')
            continue
        fm = frontmatter(r["path"])
        setting = render_setting(read_section(r["path"], "Setting / Staging"))
        script = render_script(read_section(r["path"], "Script"))
        status = STATUS_WORDS.get(r["status"], fm.get("status", ""))
        extra = ""
        if include_notes:
            purpose = render_setting(read_section(r["path"], "Purpose"))
            if purpose:
                extra = (f'<div class="setting"><h3>Purpose</h3>{purpose}</div>')
        body.append(
            f'<section class="scene"><div class="mv">{movement}</div>'
            f'<h1>{html.escape(r["slot"])}. {html.escape(r["title"])}</h1>'
            f'<p class="stat">{html.escape(status)}'
            + (f' · file {html.escape(r["path"].stem)}' if r["path"] else "") +
            f'</p>{extra}'
            + (f'<div class="setting"><h3>Setting / Staging</h3>{setting}</div>' if setting else "")
            + f'{script}</section>')

    # --- cover
    parts.append(
        '<section class="cover"><h1>THE BIG HACK</h1><div class="rule"></div>'
        '<div class="sub">A talk staged as a play</div>'
        f'<div class="meta">Readthrough draft — {html.escape(today)}<br>'
        f'{len(written)} scenes of {len(rows)} in the running order<br>'
        f'{html.escape(branch)} @ {html.escape(commit)}</div></section>')

    # --- contents
    toc = ['<section><h2 class="toc">Running order</h2><table class="toc">']
    seen_mv = None
    for r in rows:
        if r["movement"] != seen_mv:
            seen_mv = r["movement"]
            toc.append(f'<tr class="mv"><td colspan="3">Movement {seen_mv} · '
                       f'{MOVEMENT_TITLES.get(seen_mv, "")}</td></tr>')
        cls = "" if r["path"] else ' class="unwritten"'
        status = STATUS_WORDS.get(r["status"], "")
        if not r["path"]:
            status = r["note"]
        toc.append(f'<tr{cls}><td class="slot">{html.escape(r["slot"])}</td>'
                   f'<td>{html.escape(r["title"])}</td>'
                   f'<td class="stat">{html.escape(status)}</td></tr>')
    toc.append("</table></section>")
    parts.append("\n".join(toc))
    parts.extend(body)

    doc = (f"<!doctype html><html><head><meta charset='utf-8'>"
           f"<title>The Big Hack — Script</title><style>{CSS}</style></head>"
           f"<body>{''.join(parts)}</body></html>")
    HTML(string=doc, base_url=str(VAULT)).write_pdf(out_path)
    return len(written), len(rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--out", default=str(VAULT / "The Big Hack — Script.pdf"))
    ap.add_argument("--notes", action="store_true",
                    help="also include each scene's Purpose block")
    args = ap.parse_args()
    rows = running_order()
    n, total = build(rows, args.out, include_notes=args.notes)
    print(f"wrote {args.out} — {n} scenes ({total} running-order slots)")


if __name__ == "__main__":
    main()
