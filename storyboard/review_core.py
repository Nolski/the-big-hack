"""Shared, source-agnostic diff logic for the Scene Review feature.

Both the in-app review (server.py, git-backed) and the standalone host tool
(review_tool.py, worktree-backed) feed *already-parsed* scene lists in here and
get back a structured before/after diff. Lines are aligned by text (difflib),
not by id, so a rewrite or a scene split still lines up.

Each scene dict is expected to look like what script_parser emits, plus two
resolved fields set by the caller:
    line["_audio"]  -> artifact-relative path (e.g. "lines/s01_l3.wav") or None
    scene["_sketch"] -> "sketches/s01.png" or None
`media_base` is the URL prefix that serves an artifact for a side, called as
    f"{media_base}?ref={ref}&path={rel}"
`sketch_hash(ref, rel)` returns a content hash (or None) so we can flag whether
a scene's sketch actually changed between the two sides.
"""
import re
import difflib


def norm(t):
    return re.sub(r"\s+", " ", (t or "").strip())


# Bare plane markers the script uses to say WHICH plane a line is on — the live
# actor (`**LIAM** *(live)*:`) versus the AI-video plane (`[!screen] VIDEO — …`).
# The parser folds them into `direction`, so moving a character between planes
# reads as a change on every one of their lines. Reviewers care about what the
# line says, not which plane delivers it, so these are stripped before aligning
# and before display. Everything else in the parenthetical — the actual
# performance direction, including "voice-over" — is kept.
_PLANE_MARKERS = {"live", "video"}


def strip_plane(direction):
    parts = [p.strip() for p in (direction or "").split(",")]
    return ", ".join(p for p in parts if p and p.lower() not in _PLANE_MARKERS)


def _key(ln):
    return (
        f"{ln.get('speaker') or ln.get('type', '')}"
        f"\u0001{norm(ln.get('text', ''))}"
        f"\u0001{norm(strip_plane(ln.get('direction', '')))}"
    ).lower()


def word_diff(a, b):
    """Token-level diff of two strings -> [{op, a, b}] with op in equal/replace/
    delete/insert, so the UI can highlight *what* changed inside a line."""
    at = re.findall(r"\S+|\s+", a or "")
    bt = re.findall(r"\S+|\s+", b or "")
    sm = difflib.SequenceMatcher(a=at, b=bt, autojunk=False)
    out = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        out.append({"op": tag, "a": "".join(at[i1:i2]), "b": "".join(bt[j1:j2])})
    return out


def _line_view(ln, ref, media_base):
    if ln is None:
        return None
    return {
        "type": ln.get("type"),
        "speaker": ln.get("speaker"),
        "label": ln.get("speaker") or ln.get("type", ""),
        "text": ln.get("text") or "",
        "direction": strip_plane(ln.get("direction")),
        "music": ln.get("music"),
        "audio": (f"{media_base}?ref={ref}&path={ln['_audio']}" if ln.get("_audio") else None),
    }


def diff_lines(a_lines, b_lines, a_ref, b_ref, media_base):
    ak = [_key(x) for x in a_lines]
    bk = [_key(x) for x in b_lines]
    sm = difflib.SequenceMatcher(a=ak, b=bk, autojunk=False)
    rows, changed = [], 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for i, j in zip(range(i1, i2), range(j1, j2)):
                rows.append({"type": "equal",
                             "before": _line_view(a_lines[i], a_ref, media_base),
                             "after": _line_view(b_lines[j], b_ref, media_base)})
        elif tag == "replace":
            ai, bj = list(range(i1, i2)), list(range(j1, j2))
            for k in range(max(len(ai), len(bj))):
                a = a_lines[ai[k]] if k < len(ai) else None
                b = b_lines[bj[k]] if k < len(bj) else None
                row = {"type": "modified" if (a and b) else ("removed" if a else "added"),
                       "before": _line_view(a, a_ref, media_base),
                       "after": _line_view(b, b_ref, media_base)}
                if a and b:
                    row["words"] = word_diff(a.get("text", ""), b.get("text", ""))
                rows.append(row)
                changed += 1
        elif tag == "delete":
            for i in range(i1, i2):
                rows.append({"type": "removed",
                             "before": _line_view(a_lines[i], a_ref, media_base), "after": None})
                changed += 1
        elif tag == "insert":
            for j in range(j1, j2):
                rows.append({"type": "added", "before": None,
                             "after": _line_view(b_lines[j], b_ref, media_base)})
                changed += 1
    return rows, changed


def _sketch_url(rel, ref, media_base):
    return f"{media_base}?ref={ref}&path={rel}" if rel else None


def build_diff(a_scenes, b_scenes, before_ref, after_ref, media_base, sketch_hash):
    a_by = {s["id"]: s for s in a_scenes}
    b_by = {s["id"]: s for s in b_scenes}
    out = []

    for s in b_scenes:
        sid = s["id"]
        a = a_by.get(sid)
        if a is None:
            rows, changed = diff_lines([], s.get("lines", []), before_ref, after_ref, media_base)
            status = "added"
        else:
            rows, changed = diff_lines(a.get("lines", []), s.get("lines", []),
                                       before_ref, after_ref, media_base)
            title_changed = norm(a.get("title", "")) != norm(s.get("title", ""))
            setting_changed = norm(a.get("setting", "")) != norm(s.get("setting", ""))
            status = "modified" if (changed or title_changed or setting_changed) else "unchanged"
        a_sk = a.get("_sketch") if a else None
        b_sk = s.get("_sketch")
        try:
            sketch_changed = sketch_hash(before_ref, a_sk) != sketch_hash(after_ref, b_sk)
        except Exception:
            sketch_changed = bool(a_sk) != bool(b_sk)
        set_a = (a.get("setting") if a else None)
        set_changed = (norm(set_a) != norm(s.get("setting", "")))
        out.append({
            "id": sid, "number": s.get("number"),
            "title_before": (a.get("title") if a else None),
            "title_after": s.get("title"),
            "status": status, "n_changed": changed,
            "setting": {"before": set_a, "after": s.get("setting"), "changed": set_changed},
            "sketch": {"before": _sketch_url(a_sk, before_ref, media_base),
                       "after": _sketch_url(b_sk, after_ref, media_base),
                       "changed": sketch_changed},
            "rows": rows,
        })

    for s in a_scenes:
        if s["id"] not in b_by:
            rows, changed = diff_lines(s.get("lines", []), [], before_ref, after_ref, media_base)
            a_sk = s.get("_sketch")
            out.append({
                "id": s["id"], "number": s.get("number"),
                "title_before": s.get("title"), "title_after": None,
                "status": "removed", "n_changed": changed,
                "setting": {"before": s.get("setting"), "after": None, "changed": True},
                "sketch": {"before": _sketch_url(a_sk, before_ref, media_base),
                           "after": None, "changed": bool(a_sk)},
                "rows": rows,
            })

    out.sort(key=lambda x: (x.get("number") if x.get("number") is not None else 999, x["id"]))
    return {"before": before_ref, "after": after_ref, "scenes": out}
