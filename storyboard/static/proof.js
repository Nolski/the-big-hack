"use strict";

// The Big Hack — the proofreading pass.
//
// This page exists because reading 1,500 beats end to end and fixing the words
// as they go past is a different job from building the show, and the storyboard
// drawer was built for the second one. Three rules follow from that, and every
// decision below is one of them:
//
//   1. The text is always live. There is no "open this beat" state, so there is
//      nothing that can close itself while you work.
//   2. Nothing re-renders under the caret. A save patches the page in place.
//      Only an explicit structural change (add / remove a beat) rebuilds the
//      scene, and it puts the caret back where it was.
//   3. A box being typed in is never assigned to. The file's tidied version of
//      a line waits until the caret leaves before it is shown.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => (s == null ? "" : String(s)).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const bust = (p) => (p ? `/artifacts/${p}?t=${Date.now()}` : null);

const S = {
  scenes: [], chars: [], i: 0,
  proof: { at: null, scenes: {} },
  rows: [],                       // one per beat of the scene on screen
  lastRow: null,                  // the beat the caret was in last
};

async function api(method, path, body) {
  const opt = { method, headers: {} };
  if (body !== undefined) {
    opt.headers["Content-Type"] = "application/json";
    opt.body = JSON.stringify(body);
  }
  const r = await fetch(path, opt);
  if (!r.ok) {
    let msg = r.statusText;
    try { msg = (await r.json()).detail || msg; } catch (e) { /* not json */ }
    const err = new Error(msg);
    err.status = r.status;
    throw err;
  }
  return r.status === 204 ? null : r.json();
}

function toast(msg, isErr) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show" + (isErr ? " err" : "");
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.className = "toast"), isErr ? 7000 : 2600);
}

// --------------------------------------------------------------------------
// One writer at a time
// --------------------------------------------------------------------------
// Every endpoint here reads a scene file, splices one beat and writes the file
// back. Two of those overlapping on one scene would have the second one working
// from a copy that no longer exists — and each save carries the `expect` it was
// loaded with, so they have to happen in a known order anyway.
const Q = {
  chain: Promise.resolve(),
  busy: 0,
  add(fn) {
    this.busy++;
    paintSaved();
    const run = this.chain.then(() => fn(), () => fn());
    this.chain = run.then(() => {}, () => {});
    this.chain.then(() => { this.busy--; paintSaved(); });
    return run;
  },
};

const DIRTY = new Set();          // fields holding typing that isn't written yet
let lastSaveAt = null;

function paintSaved() {
  const el = $("#saved");
  if (!el) return;
  if (Q.busy) { el.textContent = "saving…"; el.className = "saved busy"; return; }
  if (DIRTY.size) { el.textContent = `${DIRTY.size} unsaved`; el.className = "saved busy"; return; }
  el.textContent = lastSaveAt ? "saved " + lastSaveAt : "ready";
  el.className = "saved ok";
}

async function flushAll() {
  await Promise.all(Array.from(DIRTY).map((f) => f.flush()));
  await Q.chain;
  return DIRTY.size === 0;
}

// A closing tab won't wait for a normal fetch, so on the way out every field
// holding typing re-sends itself as a keepalive request.
window.addEventListener("pagehide", () => DIRTY.forEach((f) => f.beacon()));
window.addEventListener("beforeunload", (e) => {
  if (!DIRTY.size) return;
  e.preventDefault();
  e.returnValue = "";
});

// --------------------------------------------------------------------------
// A text box that is always on, and always exactly as tall as its text
// --------------------------------------------------------------------------
function field(cls, value, opts) {
  const wrap = document.createElement("div");
  wrap.className = "grow " + cls;
  const ta = document.createElement("textarea");
  ta.rows = 1;
  ta.spellcheck = opts.spellcheck !== false;
  ta.value = value || "";
  if (opts.placeholder) ta.placeholder = opts.placeholder;
  wrap.dataset.value = ta.value;
  wrap.appendChild(ta);

  let base = ta.value;        // what the file holds
  let waiting = null;         // the file's tidied version, held back until blur
  let timer = null;

  const note = (t, kind) => opts.note && opts.note(t, kind);
  const show = (v) => {
    if (document.activeElement === ta) { waiting = v; return; }
    ta.value = v;
    wrap.dataset.value = v;
    waiting = null;
    paintEmpty();
  };
  const paintEmpty = () => wrap.classList.toggle("empty", !ta.value.trim());

  async function push() {
    clearTimeout(timer);
    timer = null;
    const sent = ta.value;
    if (sent === base) { DIRTY.delete(h); paintSaved(); return; }
    await Q.add(async () => {
      if (ta.value !== sent) return;             // newer typing will carry it
      try {
        const canon = await opts.save(sent);
        base = canon == null ? sent : canon;
        DIRTY.delete(h);
        note("", "");
        lastSaveAt = new Date().toLocaleTimeString();
        if (ta.value === sent) { if (base !== sent) show(base); }
        else schedule(0);                        // typed on while it was saving
      } catch (e) {
        note(e.status === 409
          ? e.message + " — your text is still here; reload the scene to compare"
          : e.message, "err");
      }
    });
    paintSaved();
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(push, ms == null ? 650 : ms);
  }

  ta.addEventListener("input", () => {
    wrap.dataset.value = ta.value;               // grows the box, no measuring
    waiting = null;
    paintEmpty();
    if (ta.value === base) { DIRTY.delete(h); paintSaved(); clearTimeout(timer); return; }
    DIRTY.add(h);
    paintSaved();
    schedule();
  });
  ta.addEventListener("blur", () => {
    if (waiting != null && ta.value === base) show(waiting);
    push();
  });

  const h = {
    ta, wrap, kind: cls,
    get dirty() { return ta.value !== base; },
    get value() { return ta.value; },
    flush: () => push(),
    // The file's word for this line, from someone else's save. Never over
    // typing that hasn't landed.
    settle(v) {
      const wasClean = ta.value === base;
      base = v;
      if (wasClean) show(v);
      else { DIRTY.add(h); paintSaved(); }
    },
    focus(caret) {
      ta.focus();
      const at = caret == null ? ta.value.length : Math.min(caret, ta.value.length);
      ta.setSelectionRange(at, at);
    },
    beacon() {
      if (ta.value === base || !opts.beacon) return;
      opts.beacon(ta.value);
    },
  };
  paintEmpty();
  return h;
}

// --------------------------------------------------------------------------
// Scene + beat state
// --------------------------------------------------------------------------
const scene = () => S.scenes[S.i];
const charName = (id) => (S.chars.find((c) => c.id === id) || {}).name || id || "";
const proofOf = (sid) => (S.proof.scenes[sid] = S.proof.scenes[sid] ||
  { done: false, at: null, flags: [] });

// Which beats can have their parenthetical edited as plain words. This mirrors
// `rewrite_beat_direction` on the server: a stage-direction beat's words *are*
// its direction, and a video beat carrying one in both its header and its body
// gives an edit nowhere unambiguous to land. Both keep the markdown route.
function dirEditable(ln) {
  const raw = ln._raw;
  if (raw == null) return false;
  const lines = raw.split("\n");
  if (/^\s*>/.test(lines[0]) && lines[0].includes("[!screen]")) {
    const body = lines.slice(1).map((l) => l.replace(/^\s*>\s?/, "")).join(" ").trim();
    return !/^\*\(.+?\)\*/.test(body) && !/^\*[^*]+\*\s+\S/.test(body);
  }
  return lines.length === 1 &&
    /^\s*\*\*[^*]+\*\*\s*(?:\*\(.+?\)\*)?\s*:/.test(lines[0]);
}

let proofTimer = null;
function saveProof() {
  clearTimeout(proofTimer);
  proofTimer = setTimeout(() => {
    api("PUT", "/api/proof", S.proof).catch(() => {});
  }, 500);
}

// A reload a second after moving must still come back to the beat you were in,
// so the place-keeping doesn't get to sit in a debounce while the page goes.
window.addEventListener("pagehide", () => {
  clearTimeout(proofTimer);
  fetch("/api/proof", {
    method: "PUT", keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(S.proof),
  }).catch(() => {});
});

// --------------------------------------------------------------------------
// Rendering a scene
// --------------------------------------------------------------------------
function render() {
  const s = scene();
  const page = $("#page");
  S.rows = [];
  page.innerHTML = "";
  if (!s) { page.innerHTML = '<p class="empty">No scenes found.</p>'; return; }

  const head = document.createElement("div");
  head.className = "scene-head";
  const words = (s.lines || []).reduce(
    (n, l) => n + (l.text || "").split(/\s+/).filter(Boolean).length, 0);
  head.innerHTML = `
    <div class="scene-kicker">
      Scene ${esc(s.display_number || s.number)}
      · <span class="w-${esc(s.world)}">${esc(s.world)}</span>
      ${s.movement ? "· " + esc(s.movement) : ""}
      ${s.beat ? "· " + esc(s.beat) : ""}
      · ${esc(s.status || "stub")}
    </div>
    <h1 class="scene-title">${esc(s.title)}</h1>
    <div class="scene-sub">
      ${(s.lines || []).length} beats · ${words} words ·
      <code>${esc((s.source_file || "").split("/").pop())}</code>
    </div>
    ${s.setting ? `<details class="context"><summary>Setting the narrator reads</summary>
       <p>${esc(s.setting)}</p></details>` : ""}`;
  page.appendChild(head);

  const beats = document.createElement("div");
  beats.className = "beats";
  page.appendChild(beats);

  (s.lines || []).forEach((ln, i) => {
    beats.appendChild(adder(i === 0 ? "" : s.lines[i - 1].id));
    const row = beatRow(ln);
    S.rows.push(row);
    beats.appendChild(row.el);
  });
  const last = (s.lines || [])[(s.lines || []).length - 1];
  if (last) beats.appendChild(adder(last.id));

  const foot = document.createElement("div");
  foot.className = "scene-foot";
  const done = proofOf(s.id).done;
  foot.innerHTML = `
    <button class="btn ${done ? "" : "primary"}" id="markDone">
      ${done ? "✓ Proofed — mark unread" : "✓ Mark proofed → next scene"}</button>
    <span class="hint">${done ? "This scene is marked proofed." : "⌘Enter"}</span>`;
  $("#markDone", foot).onclick = () => (done ? unmarkScene() : markSceneDone());
  page.appendChild(foot);

  paintChrome();
}

function adder(afterId) {
  const row = document.createElement("div");
  row.className = "adder";
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "+";
  b.title = "Add a beat here";
  b.onclick = () => insertAfter(afterId);
  row.appendChild(b);
  return row;
}

function beatRow(ln) {
  const el = document.createElement("div");
  el.className = "beat";
  const who = document.createElement("div");
  who.className = "who";
  const body = document.createElement("div");
  const tools = document.createElement("div");
  tools.className = "tools";
  el.append(who, body, tools);

  const noteEl = document.createElement("div");
  noteEl.className = "note";
  const note = (t, kind) => {
    noteEl.textContent = t || "";
    noteEl.className = "note " + (kind || "");
    if (t && !noteEl.parentNode) el.insertBefore(noteEl, tools);
    if (!t && noteEl.parentNode) noteEl.remove();
  };

  // ---- who is speaking, and what kind of beat this is
  const spk = document.createElement("select");
  const kind = document.createElement("select");
  kind.className = "kind";
  who.append(spk, kind);
  ["live", "video", "narration", "direction"].forEach((k) => {
    const o = document.createElement("option");
    o.value = o.textContent = k;
    kind.appendChild(o);
  });
  const bid = document.createElement("span");
  bid.className = "bid";
  who.appendChild(bid);

  function paintWho() {
    // Nobody speaks a stage direction, so the gutter says what kind of beat it
    // is and leaves it at that rather than stacking "STAGE" over "DIRECTION".
    spk.hidden = ln.type === "direction";
    spk.innerHTML = '<option value="">— speaker —</option>' +
      S.chars.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("");
    spk.value = ln.speaker || "";
    spk.disabled = ln._raw == null || ln.type === "direction";
    kind.value = ln.type;
    kind.disabled = ln._raw == null;
    bid.textContent = ln.id;
    el.className = "beat t-" + ln.type +
      (proofOf(scene().id).flags.includes(ln.id) ? " flagged" : "");
    dirRO.textContent = ln.direction || "";
    dirRO.hidden = !ln.direction;
  }

  const reshape = (patch) => Q.add(async () => {
    try {
      const r = await api("PUT", "/api/review/line/shape",
        Object.assign({ scene: scene().id, line: ln.id, expect: ln._raw }, patch));
      ln._raw = r.raw;
      remap(r.beats);
      lastSaveAt = new Date().toLocaleTimeString();
      paintSaved();
    } catch (e) {
      note(e.message, "err");
      paintWho();
    }
  });
  spk.onchange = () => reshape({ speaker: spk.value });
  kind.onchange = () => reshape({ type: kind.value });

  // ---- the parenthetical, then the words
  const canDir = dirEditable(ln);
  const dirF = canDir ? field("dir", ln.direction || "", {
    placeholder: "(delivery note)",
    note,
    save: async (text) => {
      const r = await api("PUT", "/api/review/line/direction",
        { scene: scene().id, line: ln.id, direction: text, expect: ln._raw });
      ln._raw = r.raw;
      remap(r.beats);
      return r.direction || "";
    },
    beacon: (text) => keepalive("/api/review/line/direction",
      { scene: scene().id, line: ln.id, direction: text, expect: ln._raw }),
  }) : null;

  const wordsF = field("words", ln.text || "", {
    placeholder: ln.type === "direction" ? "stage direction…" : "the line…",
    note,
    save: async (text) => {
      const r = await api("PUT", "/api/review/line/text",
        { scene: scene().id, line: ln.id, text, expect: ln._raw });
      ln._raw = r.raw;
      remap(r.beats);
      return r.text;
    },
    beacon: (text) => keepalive("/api/review/line/text",
      { scene: scene().id, line: ln.id, text, expect: ln._raw }),
  });

  // A parenthetical this page can't write on its own still has to be *read* —
  // it's part of the scene, and a proofreading pass that hides prose isn't one.
  const dirRO = document.createElement("div");
  dirRO.className = "dir ro";
  dirRO.title = "This beat keeps its parenthetical in its markdown — open </> to change it.";

  let mdF = null;                                  // only while markdown is open
  if (dirF) body.appendChild(dirF.wrap);
  else body.appendChild(dirRO);
  body.appendChild(wordsF.wrap);
  if (ln._raw == null) note("no source span for this beat — edit it in the .md", "warn");

  // ---- tools
  const tool = (label, title, fn) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.title = title;
    b.onclick = fn;
    tools.appendChild(b);
    return b;
  };
  const flagBtn = tool("⚑", "Flag this beat to come back to (⌥F)", () => row.toggleFlag());
  if (ln._raw != null) tool("</>", "Edit this beat's markdown", () => row.toggleMd());
  if (ln.audio) {
    tool("▶", "Listen to this line", (e) => {
      const b = e.target;
      if (b._a) { b._a.remove(); b._a = null; b.textContent = "▶"; return; }
      const a = document.createElement("audio");
      a.controls = true;
      a.autoplay = true;
      a.src = bust(ln.audio);
      el.insertBefore(a, tools);
      b._a = a;
      b.textContent = "⏹";
    });
  }
  // Opening the empty delivery-note box is an explicit act, not something that
  // happens because the pointer passed over the beat. See .dir.empty in the css.
  if (dirF) tool("( )", "Delivery note", () => {
    dirF.wrap.classList.add("open");
    dirF.focus();
  });
  if (ln._raw != null) tool("🗑", "Remove this beat (⌘⌫)", () => row.remove());

  // Opened, left empty, walked away from: put it back rather than leaving a
  // blank box sitting in the scene for the rest of the read.
  if (dirF) dirF.ta.addEventListener("blur", () => {
    if (!dirF.ta.value.trim()) dirF.wrap.classList.remove("open");
  });

  const row = {
    ln, el, note,
    get fields() { return mdF ? [mdF] : dirF ? [dirF, wordsF] : [wordsF]; },
    focus(caret) { this.fields[this.fields.length - 1].focus(caret); },

    // The file's word for this beat after somebody's save.
    sync(b) {
      const wasType = ln.type;
      ln.id = b.id;
      ln._raw = b.raw;
      ln.type = b.type;
      ln.speaker = b.speaker;
      ln.text = b.text;
      ln.direction = b.direction;
      paintWho();
      if (mdF) mdF.settle(b.raw || "");
      else {
        wordsF.settle(b.text || "");
        if (dirF) dirF.settle(b.direction || "");
      }
      if (wasType !== b.type) {
        wordsF.wrap.classList.toggle("words", true);
        wordsF.ta.placeholder = b.type === "direction" ? "stage direction…" : "the line…";
      }
    },

    toggleFlag() {
      const p = proofOf(scene().id);
      const at = p.flags.indexOf(ln.id);
      if (at >= 0) p.flags.splice(at, 1); else p.flags.push(ln.id);
      flagBtn.classList.toggle("on", at < 0);
      paintWho();
      paintChrome();
      saveProof();
    },

    // The markdown underneath, for the things prose can't say: splitting a beat
    // in two, a wikilink, a clip reference, a music cue.
    async toggleMd() {
      if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
      if (mdF) {
        mdF.wrap.remove();
        mdF = null;
        if (dirF) body.appendChild(dirF.wrap);
        else body.appendChild(dirRO);
        body.appendChild(wordsF.wrap);
        wordsF.settle(ln.text || "");
        if (dirF) dirF.settle(ln.direction || "");
        wordsF.focus();
        return;
      }
      if (dirF) dirF.wrap.remove(); else dirRO.remove();
      wordsF.wrap.remove();
      mdF = field("md", ln._raw || "", {
        spellcheck: false,
        note,
        save: async (text) => {
          const r = await api("PUT", "/api/review/line", {
            scene: scene().id, line: ln.id, text, expect: ln._raw,
          });
          ln._raw = r.raw;
          remap(r.beats);
          return r.raw;
        },
        beacon: (text) => keepalive("/api/review/line",
          { scene: scene().id, line: ln.id, text, expect: ln._raw }),
      });
      body.appendChild(mdF.wrap);
      mdF.focus(0);
    },

    async remove() {
      const gist = (ln.text || ln._raw || "").replace(/\s+/g, " ").slice(0, 80);
      if (!confirm(`Remove this beat?\n\n${gist}`)) return;
      if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
      const at = S.rows.indexOf(row);
      try {
        await api("POST", "/api/review/line/delete",
          { scene: scene().id, line: ln.id, expect: ln._raw });
        await reload({ focus: Math.max(0, at - 1) });
        toast("Beat removed. Undo an edit.command has the previous version.");
      } catch (e) { note(e.message, "err"); }
    },
  };

  paintWho();
  flagBtn.classList.toggle("on", proofOf(scene().id).flags.includes(ln.id));

  // Which beat the caret is in, for the keys that act on "this one" and for
  // picking the read back up in the right place next time.
  el.addEventListener("focusin", () => {
    S.lastRow = row;
    const p = proofOf(scene().id);
    p.at = ln.id;
    S.proof.at = { scene: scene().id, line: ln.id };
    saveProof();
  });

  return row;
}

function keepalive(path, body) {
  fetch(path, {
    method: "PUT", keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

// Every write hands back the scene's beats as they now sit on disk. Same count
// means the numbering held and the page only has to take the new text; a
// different count means a beat was split or merged and the ids after it have
// all moved, which is the one case that has to rebuild.
function remap(beats) {
  if (!beats) return;
  if (beats.length !== S.rows.length) {
    const at = S.rows.indexOf(S.lastRow);
    reload({ focus: at < 0 ? 0 : at, quiet: true });
    return;
  }
  beats.forEach((b, i) => S.rows[i].sync(b));
}

// --------------------------------------------------------------------------
// Reloading a scene without losing the reader's place
// --------------------------------------------------------------------------
async function reload(opts) {
  const o = opts || {};
  const page = $("#page");
  const scrollTop = page.scrollTop;
  const caret = (() => {
    const ta = document.activeElement;
    return ta && ta.tagName === "TEXTAREA" ? ta.selectionStart : null;
  })();
  const sb = await api("GET", "/api/storyboard");
  S.scenes = sb.scenes;
  S.chars = sb.characters || [];
  render();
  page.scrollTop = scrollTop;
  if (o.focus != null && S.rows[o.focus]) {
    S.rows[o.focus].focus(o.caret == null ? caret : o.caret);
  }
  if (!o.quiet && o.say) toast(o.say);
}

async function insertAfter(afterId) {
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  const prev = (scene().lines || []).find((l) => l.id === afterId);
  try {
    const r = await api("POST", "/api/review/line/insert", {
      scene: scene().id,
      after: afterId,
      expect: prev ? prev._raw : null,
      type: prev && prev.type !== "direction" ? prev.type : "live",
      speaker: prev ? prev.speaker : "",
    });
    await reload({ focus: r.index, caret: 0 });
    const row = S.rows[r.index];
    if (row) row.fields[row.fields.length - 1].ta.select();
  } catch (e) { toast(e.message, true); }
}

// --------------------------------------------------------------------------
// Chrome: the rail, the counter, the progress bar
// --------------------------------------------------------------------------
function paintChrome() {
  const s = scene();
  const done = S.scenes.filter((x) => (S.proof.scenes[x.id] || {}).done).length;
  $("#where").innerHTML = s
    ? `<b>Scene ${esc(s.display_number || s.number)}</b> <span class="of">of ${S.scenes.length}</span>`
    : "—";
  $("#progFill").style.width = (100 * done / Math.max(1, S.scenes.length)) + "%";
  $("#progNum").textContent = `${done}/${S.scenes.length} proofed`;
  $("#prev").disabled = S.i <= 0;
  $("#next").disabled = S.i >= S.scenes.length - 1;

  const rail = $("#rail");
  rail.innerHTML = '<div class="rail-head">The play</div>';
  S.scenes.forEach((x, i) => {
    const p = S.proof.scenes[x.id] || {};
    const d = document.createElement("div");
    d.className = "rail-item" + (i === S.i ? " here" : "") + (p.done ? " done" : "");
    d.innerHTML = `
      <span class="tick">${p.done ? "✓" : ""}</span>
      <span>
        <span class="t">${esc(x.title)}</span>
        <span class="sub">${(x.lines || []).length} beats</span>
      </span>
      <span class="${(p.flags || []).length ? "flagged" : "n"}">${
        (p.flags || []).length ? "⚑" + p.flags.length : x.display_number || x.number}</span>`;
    d.onclick = () => go(i);
    rail.appendChild(d);
  });
  const here = $(".rail-item.here");
  if (here) here.scrollIntoView({ block: "nearest" });
}

async function go(i, opts) {
  if (i < 0 || i >= S.scenes.length || i === S.i) {
    if (i === S.i && opts && opts.line) focusLine(opts.line);
    return;
  }
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  S.i = i;
  render();
  $("#page").scrollTop = 0;
  if (opts && opts.line) focusLine(opts.line, opts.match);
  else if (opts && opts.focusFirst && S.rows[0]) S.rows[0].focus(0);
}

function focusLine(lid, match) {
  const row = S.rows.find((r) => r.ln.id === lid);
  if (!row) return;
  row.el.scrollIntoView({ block: "center" });
  const f = row.fields[row.fields.length - 1];
  f.focus(0);
  if (match) {
    const at = f.ta.value.toLowerCase().indexOf(String(match).toLowerCase());
    if (at >= 0) f.ta.setSelectionRange(at, at + match.length);
  }
}

async function markSceneDone() {
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  proofOf(scene().id).done = true;
  saveProof();
  const next = S.scenes.findIndex((x, i) => i > S.i && !(S.proof.scenes[x.id] || {}).done);
  paintChrome();
  if (next >= 0) { await go(next, { focusFirst: true }); toast("Scene marked proofed."); }
  else if (S.i < S.scenes.length - 1) await go(S.i + 1, { focusFirst: true });
  else toast("That was the last scene. The whole play is marked proofed.");
}

function unmarkScene() {
  proofOf(scene().id).done = false;
  saveProof();
  render();
}

// --------------------------------------------------------------------------
// Keyboard: the whole point of a long read-through
// --------------------------------------------------------------------------
// The boxes you can actually move into. A beat with no delivery note keeps its
// parenthetical box hidden until you reach the beat, and focusing a box that
// isn't displayed does nothing at all — which would strand Tab and Enter on the
// line before it.
function boxes() {
  return $$(".grow > textarea", $("#page")).filter((t) => t.offsetParent !== null);
}

function step(dir, caret) {
  const all = boxes();
  const at = all.indexOf(document.activeElement);
  const to = all[at + dir];
  if (!to) return false;
  to.focus();
  const c = caret === "end" ? to.value.length : 0;
  to.setSelectionRange(c, c);
  to.closest(".beat").scrollIntoView({ block: "nearest" });
  return true;
}

document.addEventListener("keydown", (e) => {
  const ta = e.target.closest && e.target.closest("textarea");
  const meta = e.metaKey || e.ctrlKey;

  if (e.key === "Escape") {
    if (!$("#finder").hidden) { closeFinder(); return; }
    if (!$("#help").hidden) { $("#help").hidden = true; return; }
    if (ta) { ta.blur(); e.preventDefault(); }
    return;
  }
  if (meta && e.key.toLowerCase() === "f") {
    e.preventDefault();
    openFinder();
    return;
  }
  if (meta && e.key.toLowerCase() === "s") {
    e.preventDefault();
    flushAll().then((ok) => toast(ok ? "Everything is written." : "Something didn't save.", !ok));
    return;
  }
  if (meta && e.key === "Enter") { e.preventDefault(); markSceneDone(); return; }
  // Deleting is global, not just inside a box. The help sheet promises ⌘⌫
  // deletes this beat, and it used to sit below the `!ta` return — so reading
  // a beat, hovering it, or clicking its gutter and pressing ⌘⌫ did nothing at
  // all. `remove()` confirms before it touches anything, so there is no reason
  // to require the caret be in a textarea first.
  if (meta && (e.key === "Backspace" || e.key === "Delete")) {
    e.preventDefault();
    if (S.lastRow) S.lastRow.remove();
    else toast("Click a beat first, then ⌘⌫.", true);
    return;
  }

  if (!ta) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.key === "/") { e.preventDefault(); openFinder(); return; }
    if (e.key === "?") { e.preventDefault(); $("#help").hidden = false; return; }
    const k = e.key.toLowerCase();
    if (k === "n") { e.preventDefault(); go(S.i + 1); return; }
    if (k === "p") { e.preventDefault(); go(S.i - 1); return; }
    return;
  }

  // ---- inside a box
  if (e.altKey && e.key === "Enter") {
    e.preventDefault();
    const row = S.lastRow;
    insertAfter(row ? row.ln.id : "");
    return;
  }
  if (e.altKey && e.key.toLowerCase() === "f") {
    e.preventDefault();
    if (S.lastRow) S.lastRow.toggleFlag();
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    step(e.shiftKey ? -1 : 1, e.shiftKey ? "end" : 0);
    return;
  }
  // A beat's words are one paragraph — the file keeps them on one line — so
  // Enter has nothing to do inside them and everything to do with moving on.
  if (e.key === "Enter" && !e.shiftKey && !ta.closest(".md")) {
    e.preventDefault();
    step(1, 0);
    return;
  }
  if (e.key === "ArrowDown" && ta.selectionStart === ta.value.length &&
      ta.selectionStart === ta.selectionEnd) {
    if (step(1, 0)) e.preventDefault();
    return;
  }
  if (e.key === "ArrowUp" && ta.selectionStart === 0 &&
      ta.selectionStart === ta.selectionEnd) {
    if (step(-1, "end")) e.preventDefault();
  }
});

// --------------------------------------------------------------------------
// Find and replace, across every scene
// --------------------------------------------------------------------------
const F = { hits: [], q: "" };

function openFinder() {
  $("#finder").hidden = false;
  document.body.classList.add("finding");
  $("#findQ").focus();
  $("#findQ").select();
}
function closeFinder() {
  $("#finder").hidden = true;
  document.body.classList.remove("finding");
  if (S.lastRow) S.lastRow.focus();
}

function scan() {
  const q = $("#findQ").value;
  const cased = $("#findCase").checked;
  F.q = q;
  F.hits = [];
  if (q) {
    const needle = cased ? q : q.toLowerCase();
    S.scenes.forEach((s, si) => {
      (s.lines || []).forEach((ln) => {
        ["text", "direction"].forEach((part) => {
          const hay = cased ? (ln[part] || "") : (ln[part] || "").toLowerCase();
          let from = 0, at;
          while ((at = hay.indexOf(needle, from)) >= 0) {
            F.hits.push({ si, sid: s.id, lid: ln.id, part, at, raw: ln[part] || "" });
            from = at + needle.length;
          }
        });
      });
    });
  }
  paintHits();
}

function paintHits() {
  const box = $("#findResults");
  $("#findCount").textContent = F.q
    ? `${F.hits.length} match${F.hits.length === 1 ? "" : "es"}`
    : "";
  $("#replaceAll").disabled = !F.hits.length || !$("#findR").value;
  box.innerHTML = "";
  F.hits.slice(0, 250).forEach((h) => {
    const s = S.scenes[h.si];
    const a = Math.max(0, h.at - 42), b = h.at + F.q.length + 42;
    const d = document.createElement("div");
    d.className = "hit";
    d.innerHTML = `<span class="loc">Scene ${esc(s.display_number || s.number)} ·
        ${esc(h.lid)}${h.part === "direction" ? " · parenthetical" : ""}</span>
      ${a ? "…" : ""}${esc(h.raw.slice(a, h.at))}<mark>${esc(
        h.raw.substr(h.at, F.q.length))}</mark>${esc(h.raw.slice(h.at + F.q.length, b))}${
        b < h.raw.length ? "…" : ""}`;
    d.onclick = () => go(h.si, { line: h.lid, match: F.q });
    box.appendChild(d);
  });
  if (F.hits.length > 250) {
    const more = document.createElement("div");
    more.className = "finder-more";
    more.textContent = `…and ${F.hits.length - 250} more. Narrow the search.`;
    box.appendChild(more);
  }
}

async function replaceAll() {
  const q = $("#findQ").value, r = $("#findR").value;
  if (!q || !F.hits.length) return;
  const cased = $("#findCase").checked;
  const beats = new Map();                    // one save per beat, not per hit
  F.hits.forEach((h) => beats.set(h.sid + "/" + h.lid + "/" + h.part, h));
  if (!confirm(`Replace "${q}" with "${r}" in ${F.hits.length} place${
      F.hits.length === 1 ? "" : "s"}, across ${beats.size} field${
      beats.size === 1 ? "" : "s"}?\n\nEvery scene keeps its previous version in storyboard/.edits/.`)) return;
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);

  const swap = (s) => {
    if (cased) return s.split(q).join(r);
    let out = "", i = 0;
    const low = s.toLowerCase(), needle = q.toLowerCase();
    for (let at; (at = low.indexOf(needle, i)) >= 0; i = at + q.length) out += s.slice(i, at) + r;
    return out + s.slice(i);
  };

  let ok = 0;
  const failed = [];
  for (const h of beats.values()) {
    const s = S.scenes.find((x) => x.id === h.sid);
    const ln = (s.lines || []).find((l) => l.id === h.lid);
    if (!ln) { failed.push(`${h.sid}/${h.lid} (moved)`); continue; }
    const next = swap(ln[h.part] || "");
    if (next === (ln[h.part] || "")) continue;
    try {
      const res = h.part === "direction"
        ? await api("PUT", "/api/review/line/direction",
            { scene: h.sid, line: h.lid, direction: next, expect: ln._raw })
        : await api("PUT", "/api/review/line/text",
            { scene: h.sid, line: h.lid, text: next, expect: ln._raw });
      // Keep the local copy in step so the next beat's `expect` is right.
      (res.beats || []).forEach((b, i) => {
        const target = s.lines[i];
        if (!target) return;
        Object.assign(target, { id: b.id, type: b.type, speaker: b.speaker,
          text: b.text, direction: b.direction, _raw: b.raw });
      });
      ok++;
    } catch (e) {
      failed.push(`${h.sid}/${h.lid}: ${e.message}`);
    }
  }
  lastSaveAt = new Date().toLocaleTimeString();
  render();
  scan();
  toast(failed.length
    ? `Replaced in ${ok}. ${failed.length} refused — see the list.`
    : `Replaced in ${ok} field${ok === 1 ? "" : "s"}.`, failed.length > 0);
  if (failed.length) console.warn("replace-all refusals:\n" + failed.join("\n"));
}

// --------------------------------------------------------------------------
// Boot
// --------------------------------------------------------------------------
let scanTimer = null;
$("#findQ").addEventListener("input", () => {
  clearTimeout(scanTimer);
  scanTimer = setTimeout(scan, 180);
});
$("#findR").addEventListener("input", paintHits);
$("#findCase").addEventListener("change", scan);
$("#replaceAll").onclick = replaceAll;
$("#findClose").onclick = closeFinder;
$("#findBtn").onclick = openFinder;
$("#helpBtn").onclick = () => ($("#help").hidden = false);
$("#helpClose").onclick = () => ($("#help").hidden = true);
$("#prev").onclick = () => go(S.i - 1);
$("#next").onclick = () => go(S.i + 1);

(async function boot() {
  try {
    const [sb, proof] = await Promise.all([
      api("GET", "/api/storyboard"),
      api("GET", "/api/proof").catch(() => ({ scenes: {}, at: null })),
    ]);
    S.scenes = sb.scenes || [];
    S.chars = sb.characters || [];
    S.proof = { at: proof.at || null, scenes: proof.scenes || {} };

    // Pick the read back up where it stopped.
    const at = S.proof.at;
    const i = at ? S.scenes.findIndex((s) => s.id === at.scene) : -1;
    S.i = i >= 0 ? i : 0;
    render();
    if (at && i >= 0 && at.line) {
      focusLine(at.line);
      toast(`Picked up where you left off — scene ${
        S.scenes[i].display_number || S.scenes[i].number}.`);
    }
    paintSaved();
  } catch (e) {
    $("#page").innerHTML = `<p class="empty">Couldn't load the script: ${esc(e.message)}</p>`;
  }
})();
