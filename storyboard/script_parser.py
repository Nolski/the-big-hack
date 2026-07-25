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


def parse_script(script_text, name_index):
    lines, counter = [], 0

    def add(kind, speaker, text, direction=""):
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
        lines.append(item)

    raw = script_text.splitlines()
    i, n = 0, len(raw)
    while i < n:
        ln = raw[i].rstrip()
        s = ln.strip()
        if not s:
            i += 1
            continue

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
                add("direction", "", vis, direction)
            else:
                spk = resolve_speaker(name, name_index)
                add("video", spk, clean_spoken(rest), direction)
            continue

        # --- a stray '>' continuation we didn't consume -> treat as direction ---
        if s.startswith(">"):
            add("direction", "", clean_direction(s.lstrip("> ")), "")
            i += 1
            continue

        # --- **NAME** ...: line  (live actor / narrator) -----------------------
        m = SPEAKER_LINE.match(s)
        if m:
            name = m.group("name").strip()
            direction = (m.group("dir") or "").strip()
            text = clean_spoken(m.group("text"))
            if normalize_name(name) == "narrator" or "v.o." in direction.lower():
                add("narration", "narrator", text, direction)
            else:
                add("live", resolve_speaker(name, name_index), text, direction)
            i += 1
            continue

        # --- standalone stage direction *(...)* (may wrap one line) ------------
        if s.startswith("*"):
            add("direction", "", clean_direction(s), "")
            i += 1
            continue

        # --- any other prose line: keep as a direction beat so nothing is lost -
        add("direction", "", clean_direction(s), "")
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
        "display_number": f"{num}{suffix}",
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
    return scenes
