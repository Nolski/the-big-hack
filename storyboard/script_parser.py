#!/usr/bin/env python
"""Parse the play's scene scripts (Obsidian markdown) into the storyboard model.

The scripts in the vault's "03 - Script" folder are the single source of truth
for scene structure. Each scene is a markdown file with YAML frontmatter
(`type: scene`) and a `## Script` section written in the house format
(see "03 - Script/00 - Script Format Guide.md"):

    *(stage direction)*                          -> a non-voiced "direction" beat
    **NARRATOR** *(V.O.)*: line                  -> a "narration" beat (narrator voice)
    **LIAM** *(live, ...)*: line                 -> a "live" beat (matched actor voice)
    > [!screen] VIDEO — KRISTINA · `AIV-010` *(dir)*
    > spoken line                                -> a "video" beat (matched voice)
    > *purely italic description*                -> a non-voiced "direction" beat

Output scene shape (matches what the SPA + server expect):
    {id, number, title, movement, world, beat, status, setting, narration,
     sketch:{prompt}, music:{prompt}, lines:[{id,type,speaker,text,direction}],
     source_file}
"""
import difflib
import re
import unicodedata
from pathlib import Path

try:
    from ruamel.yaml import YAML
    _yaml = YAML(typ="safe")

    def _load_yaml(text):
        return _yaml.load(text) or {}
except Exception:  # pragma: no cover - fallback
    import yaml as _pyyaml

    def _load_yaml(text):
        return _pyyaml.safe_load(text) or {}


EMDASH = "\u2014"   # —
MIDDOT = "\u00b7"   # ·


# --------------------------------------------------------------------------- #
# Frontmatter + sections
# --------------------------------------------------------------------------- #
def split_frontmatter(text):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            fm = text[3:end].strip()
            body = text[end + 4:]
            try:
                return _load_yaml(fm), body
            except Exception:
                return {}, body
    return {}, text


def section(body, name):
    """Return the text of a `## <name>` section (up to the next `## ` / `---`)."""
    lines = body.splitlines()
    out, grabbing = [], False
    target = name.strip().lower()
    for ln in lines:
        if ln.startswith("## "):
            head = ln[3:].strip().lower()
            grabbing = head == target or head.startswith(target)
            continue
        if grabbing and (ln.startswith("## ") or ln.strip() == "---"):
            break
        if grabbing:
            out.append(ln)
    return "\n".join(out).strip()


def section_span(text, name):
    """Absolute 0-based `[start, end)` line span of a `## <name>` section body
    within the whole file, trimmed of leading/trailing blank lines exactly the
    way `section()` trims them.

    `section()` returns the section's *text*, which is all the parser needs, but
    writing an edit back needs to know which lines of the file that text came
    from. Keeping both in one module means they cannot drift apart. Returns
    None if the section isn't there.
    """
    _, body = split_frontmatter(text)
    offset = len(text.splitlines()) - len(body.splitlines())
    blines = body.splitlines()
    target = name.strip().lower()
    start = end = None
    for idx, ln in enumerate(blines):
        if ln.startswith("## "):
            head = ln[3:].strip().lower()
            if head == target or head.startswith(target):
                start, end = idx + 1, None
            elif start is not None and end is None:
                end = idx
                break
            continue
        if start is not None and end is None and ln.strip() == "---":
            end = idx
            break
    if start is None:
        return None
    if end is None:
        end = len(blines)
    while start < end and not blines[start].strip():
        start += 1
    while end > start and not blines[end - 1].strip():
        end -= 1
    return start + offset, end + offset


# --------------------------------------------------------------------------- #
# Text cleaning
# --------------------------------------------------------------------------- #
def strip_wikilinks(s):
    # [[target|display]] -> display ; [[target]] -> target
    s = re.sub(r"\[\[[^\]]*\|([^\]]+)\]\]", r"\1", s)
    s = re.sub(r"\[\[([^\]]+)\]\]", r"\1", s)
    return s


def clean_spoken(s):
    """Turn a script line into plain spoken text for TTS."""
    s = strip_wikilinks(s)
    s = re.sub(r"\*\([^)]*\)\*", " ", s)   # inline stage directions *(...)*
    s = re.sub(r"`([^`]*)`", r"\1", s)      # inline code
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)  # bold
    s = re.sub(r"\*(.+?)\*", r"\1", s)      # italic
    s = re.sub(r"\s+", " ", s).strip()
    return s


def clean_direction(s):
    """Keep the words of a stage direction, drop only the markdown wrappers."""
    s = strip_wikilinks(s).strip()
    m = re.match(r"^\*\((.*)\)\*$", s, re.S)          # *(...)* wrapper
    if m:
        s = m.group(1)
    else:
        m = re.match(r"^\*(.*)\*$", s, re.S)           # *...* wrapper
        if m:
            s = m.group(1)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    s = re.sub(r"`([^`]*)`", r"\1", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def clean_prose(s):
    """Flatten a markdown paragraph for use in an image prompt / narration."""
    s = strip_wikilinks(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    s = re.sub(r"`([^`]*)`", r"\1", s)
    s = re.sub(r"\([^)]*\)", "", s)         # drop production parentheticals
    s = re.sub(r"\s+([.,;:!?])", r"\1", s)  # tidy space-before-punctuation
    s = re.sub(r"\s+", " ", s).strip()
    return s


# Sentences in Setting/Staging that are production/writer notes, not scene-setting
# the audience should hear. We drop any sentence mentioning these.
_META_HINTS = (
    "speaker a", "speaker b", "aiv", "lip-sync", "lip sync", "pre-render",
    "prerender", "pre-rendered", "recommended", "production", "easiest",
    "interstitial", "stage plane", "operator", "best lip", "grade", "render",
    "no live speaker", "the show's", "clip ", "see staging", "this scene",
)


def spoken_framing(staging, lines, limit=320):
    """A short, audience-facing set description for the narrator to read.

    Built from the Setting/Staging prose with writer/production sentences
    filtered out; falls back to the scene's opening stage direction.
    """
    text = clean_prose(staging or "")
    sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    good = [s for s in sents if not any(h in s.lower() for h in _META_HINTS)]
    framing = " ".join(good[:2]).strip()
    if len(framing) < 40:
        for l in lines:
            if l.get("type") == "direction" and len(l.get("text", "")) > 40:
                framing = l["text"]
                break
    if len(framing) > limit:
        framing = framing[:limit].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return framing


def first_sentences(s, n=2):
    parts = re.split(r"(?<=[.!?])\s+", s)
    return " ".join(parts[:n]).strip()


# --------------------------------------------------------------------------- #
# Speaker resolution
# --------------------------------------------------------------------------- #
def normalize_name(raw):
    s = unicodedata.normalize("NFKC", raw or "").strip()
    s = re.sub(r"\([^)]*\)", "", s)         # drop "(PM)", "(screen share)"
    s = s.strip().strip(".:").strip()
    return s.lower()


def build_name_index(characters, aliases=None):
    idx = {}
    for c in characters:
        cid = c.get("id", "")
        if cid:
            idx[cid.lower()] = cid
            idx[normalize_name(cid)] = cid
        nm = c.get("name", "")
        if nm:
            idx[normalize_name(nm)] = cid
            # also index without a leading article ("The CEO" -> "ceo")
            idx[re.sub(r"^the\s+", "", normalize_name(nm))] = cid
    for k, v in (aliases or {}).items():
        idx[normalize_name(k)] = v
    return idx


def resolve_speaker(raw, name_index):
    key = normalize_name(raw)
    if key in name_index:
        return name_index[key]
    noart = re.sub(r"^the\s+", "", key)
    if noart in name_index:
        return name_index[noart]
    # Unknown: return a slug so it's at least visible (won't be voiced).
    return re.sub(r"[^a-z0-9]+", "-", key).strip("-")


# --------------------------------------------------------------------------- #
# Script body -> lines
# --------------------------------------------------------------------------- #
VIDEO_HEAD = re.compile(
    r"\[!screen\][^\n]*?VIDEO\s*" + EMDASH + r"\s*(?P<name>.+?)\s*" + MIDDOT +
    r"\s*`?(?P<clip>AIV-\d+)?`?\s*(?:\*\((?P<dir>.+?)\)\*)?\s*$"
)
SPEAKER_LINE = re.compile(
    r"^\*\*(?P<name>[^*]+?)\*\*\s*(?:\*\((?P<dir>.+?)\)\*)?\s*:\s*(?P<text>.*)$"
)


def _leading_direction(body):
    """Pull a leading *(...)* or *italic* direction off a video body."""
    b = body.strip()
    m = re.match(r"^\*\((.+?)\)\*\s*(.*)$", b, re.S)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    # leading single-italic run with no nested markup
    m = re.match(r"^\*([^*]+)\*\s+(.+)$", b, re.S)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return "", b


def _is_pure_visual(body):
    b = body.strip()
    return len(b) >= 2 and b.startswith("*") and b.endswith("*")


# --------------------------------------------------------------------------- #
# Writing plain text back into a beat
# --------------------------------------------------------------------------- #
# Editing a beat as prose means the markdown around the words has to survive:
# a rewritten sentence must not cost the scene its wikilinks, its clip refs or
# its inline asides. So the clean text is built with a note of where each
# character came from, and only the characters that actually changed are
# spliced back into the raw.
_WIKILINK = re.compile(r"\[\[(?:([^\]|]*)\|)?([^\]]+)\]\]")
_ASIDE = re.compile(r"\*\([^)]*\)\*")
_MUSIC = re.compile(r"\[MUSIC:\s*[^\]]+\]", re.I)


def spoken_offsets(s):
    """`clean_spoken(s)`, plus the source index of each character it kept."""
    out, idx, i, n = [], [], 0, len(s)

    def space(at):
        # `clean_spoken` collapses runs, and a dropped aside leaves a gap that
        # merges with the spaces already around it.
        if out and out[-1] == " ":
            return
        out.append(" "); idx.append(at)

    while i < n:
        m = _ASIDE.match(s, i) or _MUSIC.match(s, i)
        if m:                                   # inline direction or music cue
            space(i)
            i = m.end()
            continue
        m = _WIKILINK.match(s, i)
        if m:                                   # keep only what's displayed
            at = m.start(2)
            for k, ch in enumerate(m.group(2)):
                out.append(ch); idx.append(at + k)
            i = m.end()
            continue
        c = s[i]
        if c in "*`":                           # emphasis and code fences
            i += 1
            continue
        if c.isspace():
            space(i)
            while i < n and s[i].isspace():
                i += 1
            continue
        out.append(c); idx.append(i)
        i += 1
    a, b = 0, len(out)
    while a < b and out[a] == " ":
        a += 1
    while b > a and out[b - 1] == " ":
        b -= 1
    return "".join(out[a:b]), idx[a:b]


def splice_spoken(body, new_text):
    """Put `new_text` into `body`, disturbing as little markdown as possible."""
    clean, idx = spoken_offsets(body)
    if clean == new_text:
        return body
    if not idx:                                 # nothing recognisable to keep
        return new_text
    out = body
    ops = difflib.SequenceMatcher(None, clean, new_text, autojunk=False)
    for tag, i1, i2, j1, j2 in reversed(ops.get_opcodes()):
        if tag == "equal":
            continue
        lo = idx[i1] if i1 < len(idx) else idx[-1] + 1
        hi = idx[i2 - 1] + 1 if i2 > i1 else lo
        out = out[:lo] + new_text[j1:j2] + out[hi:]
    return out


def beat_clip(raw):
    """The `AIV-000` reference on a video beat's header, if it has one."""
    m = re.search(r"`(AIV-\d+)`", raw.split("\n")[0])
    return m.group(1) if m else ""


def compose_beat(kind, name, direction, text, clip=""):
    """Markdown for one beat, in the house format `parse_script` reads back.

    Used when a beat changes shape — a stage direction becoming a spoken line,
    a live line becoming a screen video — and when a new one is added.
    """
    text = " ".join((text or "").split()) or "…"
    direction = " ".join((direction or "").split())
    name = (name or "").strip()

    if kind == "direction":
        return f"*({text})*"

    if kind == "video":
        head = f"> [!screen] VIDEO {EMDASH} {name.upper() or '?'} {MIDDOT}"
        if clip:
            head += f" `{clip}`"
        if direction:
            head += f" *({direction})*"
        return f"{head}\n> {text}"

    if kind == "narration":
        # The parser hears narration from the name or from a V.O. marker; say
        # both, so the beat keeps its kind however it's read.
        note = direction if "v.o." in direction.lower() else \
            ", ".join(d for d in ("V.O.", direction) if d)
        return f"**NARRATOR** *({note})*: {text}"

    aside = f" *({direction})*" if direction else ""
    return f"**{name.upper() or '?'}**{aside}: {text}"


def _split_direction_wrapper(s):
    """`*(text)*` or `*text*` -> the wrapper's two halves and the text between."""
    for pattern in (r"^(\*\()(.*)(\)\*)$", r"^(\*)(.*)(\*)$"):
        m = re.match(pattern, s, re.S)
        if m:
            return m.group(1), m.group(2), m.group(3)
    return "", s, ""


def rewrite_beat_text(raw, new_text, name_index):
    """One beat's markdown with its spoken words replaced by `new_text`.

    Tries to keep the markdown around the edit — wikilinks, clip refs, inline
    asides — and checks the result by reading it back through the parser. An
    edit that lands across a `code span` or an *emphasis* run can't always be
    stitched back together, so that falls back to replacing the whole body,
    which loses formatting inside the beat but never the words.

    Returns None if neither version reads back correctly; the caller is then
    expected to offer the markdown itself instead of quietly writing something
    the author didn't ask for.
    """
    def reads_back(candidate):
        if candidate is None:
            return False
        got = parse_script(candidate, name_index)
        was = parse_script(raw, name_index)
        return (len(got) == 1 and len(was) == 1 and got[0]["text"] == new_text
                and got[0]["type"] == was[0]["type"]
                and got[0]["speaker"] == was[0]["speaker"])

    for body_fn in (lambda body: splice_spoken(body, new_text), lambda _: new_text):
        candidate = _rebuild_beat(raw, body_fn)
        if reads_back(candidate):
            return candidate
    return None


def rewrite_beat_direction(raw, new_direction, name_index):
    """One beat's markdown with its parenthetical replaced by `new_direction`.

    The parenthetical is prose too — it gets read by the actors and it gets
    proofread — but it isn't part of the spoken words, so it can't go through
    `rewrite_beat_text`. An empty `new_direction` removes it.

    Returns None when the beat's parenthetical can't be located unambiguously
    (a video beat carrying one in both its header and its body), or when the
    result doesn't read back as the same beat.
    """
    want = " ".join((new_direction or "").split())
    lines = raw.split("\n")
    head = lines[0]
    s = head.strip()
    pad = head[:len(head) - len(head.lstrip())]

    def swap(text, lo, hi):
        """Replace `text[lo:hi]` (an existing `*(...)*`) with the new one."""
        if want:
            return text[:lo] + f"*({want})*" + text[hi:]
        while lo > 0 and text[lo - 1] == " ":
            lo -= 1
        return text[:lo] + text[hi:]

    if s.startswith(">") and "[!screen]" in s:
        # A leading *(...)* in the spoken body is folded into the same direction
        # string as the header's, and there is no telling which half an edit
        # meant. That beat keeps its markdown.
        body = " ".join(l.strip().lstrip(">").strip() for l in lines[1:])
        if _leading_direction(body)[0]:
            return None
        m = VIDEO_HEAD.search(head)
        if not m:
            return None
        if m.group("dir") is not None:
            new_head = swap(head, m.start("dir") - 2, m.end("dir") + 2)
        elif want:
            new_head = head.rstrip() + f" *({want})*"
        else:
            new_head = head
        candidate = "\n".join([new_head] + lines[1:])
    elif len(lines) == 1 and SPEAKER_LINE.match(s):
        m = SPEAKER_LINE.match(s)
        if m.group("dir") is not None:
            new_line = swap(s, m.start("dir") - 2, m.end("dir") + 2)
        elif want:
            at = m.end("name") + 2          # just past the name's closing **
            new_line = s[:at] + f" *({want})*" + s[at:]
        else:
            new_line = s
        candidate = pad + new_line
    else:
        # A stage-direction beat's words *are* its direction; there is no
        # separate parenthetical to move.
        return None

    got = parse_script(candidate, name_index)
    was = parse_script(raw, name_index)
    if len(got) != 1 or len(was) != 1:
        return None
    a, b = got[0], was[0]
    if (a["type"], a["speaker"], a["text"]) != (b["type"], b["speaker"], b["text"]):
        return None
    if " ".join(a.get("direction", "").split()) != want:
        return None
    return candidate


def _rebuild_beat(raw, body_fn):
    """One beat's markdown with `body_fn` applied to its spoken part."""
    lines = raw.split("\n")
    head, s = lines[0], lines[0].strip()
    pad = len(head) - len(head.lstrip())

    # > [!screen] VIDEO — NAME · `AIV-000` *(dir)*
    # > *(leading dir)* the spoken line
    if s.startswith(">") and "[!screen]" in s and len(lines) == 2:
        cont = lines[1]
        inner = cont.strip().lstrip(">").lstrip()
        keep = len(cont) - len(cont.lstrip(">").lstrip("> ").lstrip()) if inner else len(cont)
        _, rest = _leading_direction(inner)
        at = inner.rfind(rest) if rest else len(inner)
        if at < 0:
            return None
        return head + "\n" + cont[:keep] + inner[:at] + body_fn(inner[at:])

    if len(lines) != 1:
        return None

    # **NAME** *(dir)*: the spoken line
    m = SPEAKER_LINE.match(s)
    if m:
        a, b = m.span("text")
        return head[:pad + a] + body_fn(s[a:b]) + head[pad + b:]

    # a stage direction, wrapper and all
    if not s.startswith(">"):
        open_, body, close = _split_direction_wrapper(s)
        return head[:pad] + open_ + body_fn(body) + close

    return None


def parse_script(script_text, name_index):
    lines, counter = [], 0

    def add(kind, speaker, text, direction="", src=None):
        nonlocal counter
        # Optional inline music cue: [MUSIC: music/slackhuddle.mp3] (or "scene").
        music = None
        m = re.search(r"\[MUSIC:\s*([^\]]+)\]", text or "", re.I)
        if m:
            music = m.group(1).strip()
            text = re.sub(r"\s*\[MUSIC:\s*[^\]]+\]\s*", " ", text, flags=re.I).strip()
        counter += 1
        item = {
            "id": f"l{counter}",
            "type": kind,
            "speaker": speaker,
            "text": text,
            "direction": direction,
        }
        if music:
            item["music"] = music
        if src is not None:
            # Inclusive 0-based line range within the (trimmed) Script section
            # that this beat was parsed from, so an edit can be written back to
            # exactly those lines. Pair with `section_span` to get file offsets.
            item["src_start"], item["src_end"] = src
        lines.append(item)

    raw = script_text.splitlines()
    i, n = 0, len(raw)
    while i < n:
        ln = raw[i].rstrip()
        s = ln.strip()
        if not s:
            i += 1
            continue

        start = i

        # --- video callout block (one [!screen] header + following '>' lines) --
        if s.startswith(">") and "[!screen]" in s:
            head = s.lstrip("> ").strip()
            m = VIDEO_HEAD.search(head)
            name = m.group("name").strip() if m else "?"
            hdir = (m.group("dir") or "").strip() if m else ""
            body_parts = []
            i += 1
            while i < n:
                nxt = raw[i].strip()
                if nxt.startswith(">") and "[!screen]" not in nxt:
                    body_parts.append(nxt.lstrip("> ").strip())
                    i += 1
                else:
                    break
            body = " ".join(p for p in body_parts if p).strip()
            ldir, rest = _leading_direction(body)
            direction = ", ".join(d for d in (hdir, ldir) if d)
            if _is_pure_visual(body) or not rest:
                # purely a screen visual (e.g. the merged PR) — show, don't voice
                vis = clean_direction(body) or clean_direction(rest)
                add("direction", "", vis, direction, src=(start, i - 1))
            else:
                spk = resolve_speaker(name, name_index)
                add("video", spk, clean_spoken(rest), direction, src=(start, i - 1))
            continue

        # --- a stray '>' continuation we didn't consume -> treat as direction ---
        if s.startswith(">"):
            add("direction", "", clean_direction(s.lstrip("> ")), "", src=(start, start))
            i += 1
            continue

        # --- **NAME** ...: line  (live actor / narrator) -----------------------
        m = SPEAKER_LINE.match(s)
        if m:
            name = m.group("name").strip()
            direction = (m.group("dir") or "").strip()
            text = clean_spoken(m.group("text"))
            if normalize_name(name) == "narrator" or "v.o." in direction.lower():
                add("narration", "narrator", text, direction, src=(start, start))
            else:
                add("live", resolve_speaker(name, name_index), text, direction,
                    src=(start, start))
            i += 1
            continue

        # --- standalone stage direction *(...)* (may wrap one line) ------------
        if s.startswith("*"):
            add("direction", "", clean_direction(s), "", src=(start, start))
            i += 1
            continue

        # --- any other prose line: keep as a direction beat so nothing is lost -
        add("direction", "", clean_direction(s), "", src=(start, start))
        i += 1

    return lines


# --------------------------------------------------------------------------- #
# Scene assembly
# --------------------------------------------------------------------------- #
WORLD_MAP = {"convergence": "both", "both": "both", "modern": "modern",
             "historical": "historical", "frame": "frame"}


def beat_label(fm):
    raw = str(fm.get("beat", "") or "")
    m = re.search(r"#(B\d+)", raw)
    if m:
        return m.group(1)
    m = re.search(r"\bB\d+\b", raw)
    return m.group(0) if m else ""


def movement_label(fm):
    arc = str(fm.get("arc", "") or "")
    arc = arc.replace("-arc", "").replace("_", " ").strip()
    return arc.title()


def sketch_prompt_for(title, staging):
    base = first_sentences(clean_prose(staging), 3)
    return f"{title}. {base}".strip()


def parse_scene_file(path, name_index):
    text = Path(path).read_text(encoding="utf-8")
    fm, body = split_frontmatter(text)
    if str(fm.get("type", "")).lower() != "scene":
        return None
    # scene_number may carry a letter suffix (e.g. "1b" for the split cold-open
    # scenes). Keep the integer part for sorting (`number`) and preserve the
    # suffix in the scene id so 1/1b/1c/1d stay distinct and individually
    # playable — the on-disk artifacts are named with the suffixed id (s01b …).
    raw = fm.get("scene_number")
    if raw is None or str(raw).strip() == "":
        raw = Path(path).stem
    m = re.match(r"\s*(\d+)\s*([a-z]*)", str(raw), re.IGNORECASE)
    num = int(m.group(1)) if m else 0
    suffix = (m.group(2).lower() if m else "")
    sid = f"s{num:02d}{suffix}"
    staging = section(body, "Setting / Staging") or section(body, "Setting")
    script = section(body, "Script")
    title = str(fm.get("title") or Path(path).stem)
    lines = parse_script(script, name_index)
    return {
        "id": sid,
        "number": num,
        "title": title,
        "movement": movement_label(fm),
        "world": WORLD_MAP.get(str(fm.get("world", "modern")).lower(), "modern"),
        "beat": beat_label(fm),
        "status": str(fm.get("status", "stub")),
        # The narrator reads this short set framing aloud before the dialogue.
        "setting": spoken_framing(staging, lines),
        "narration": "",                     # scene narrator lines are inline beats
        "sketch": {"prompt": sketch_prompt_for(title, staging)},
        "music": {"prompt": ""},             # blank -> derived from world style
        "lines": lines,
        "source_file": str(path),
    }


def load_scenes(scripts_dir, characters, aliases=None):
    scripts_dir = Path(scripts_dir)
    name_index = build_name_index(characters, aliases)
    scenes = []
    if not scripts_dir.exists():
        return scenes
    for path in sorted(scripts_dir.glob("*.md")):
        try:
            scene = parse_scene_file(path, name_index)
        except Exception:
            scene = None
        if scene:
            scenes.append(scene)
    scenes.sort(key=lambda s: s["number"])
    for position, scene in enumerate(scenes, start=1):
        scene["display_number"] = position
    return scenes
