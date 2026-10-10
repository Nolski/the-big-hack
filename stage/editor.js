"use strict";

// One always-editable script. Saves patch rows in place so typing never
// collapses a block or moves its caret. Writes are serialized and revision-checked.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => (s == null ? "" : String(s)).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const bust = (p) => (p ? `${p.startsWith("/") ? p : "/" + p}?t=${Date.now()}` : null);

const S = {
  scenes: [], chars: [], i: 0,
  revision: null,                 // the shared script's revision this page loaded
  stale: false,                   // a write was refused; nothing more is sent until a reload
  proof: { at: null, scenes: {} },
  rows: [],                       // one per beat of the scene on screen
  lastRow: null,                  // the beat the caret was in last
  runtime: null,                  // running time against the target, from /api/runtime
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
    if (r.status === 409) staleScript(msg);
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
// The shared script's revision
// --------------------------------------------------------------------------
// Every scene the store hands back carries the same document revision, and
// every write must send it. A refused write means somebody else saved first.
const revFrom = (sb) =>
  (sb.scenes && sb.scenes[0] && sb.scenes[0].revision) || sb.revision || null;

// The scene's lines as the store wants them back: every existing beat keeps
// its id (a beat sent without one is a *new* beat), nothing else is sent.
const plainLines = (s) => (s.lines || []).map((l) => ({
  id: l.id, type: l.type, speaker: l.speaker || "",
  text: l.text || "", direction: l.direction || "",
}));

// The nearest spoken, non-narrator speaker: up from `at`, then down. A new or
// re-typed spoken beat has to be somebody's, and the store says so.
function nearestSpeaker(lines, at) {
  const order = [];
  for (let i = at - 1; i >= 0; i--) order.push(i);
  for (let i = at; i < lines.length; i++) order.push(i);
  for (const i of order) {
    const l = lines[i];
    if ((l.type === "live" || l.type === "video") && l.speaker && l.speaker !== "narrator") return l.speaker;
  }
  return "";
}

// Somebody else wrote the script. Say so once, in a bar that stays until the
// reader reloads; never swap the page out from under their typing.
function staleScript(msg) {
  let b = $("#stale");
  if (!b) {
    b = document.createElement("div");
    b.id = "stale";
    b.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);" +
      "z-index:60;display:flex;gap:12px;align-items:center;padding:10px 14px;" +
      "border-radius:8px;background:#7a1f2b;color:#fff;font:inherit;box-shadow:0 6px 24px rgba(0,0,0,.35)";
    b.innerHTML = '<span></span><button type="button" class="btn">Reload script</button>';
    $("button", b).onclick = () =>
      reload({ say: "Reloaded the latest script. Anything you were typing is still here." });
    document.body.appendChild(b);
  }
  $("span", b).textContent = msg || "The script changed elsewhere. Reload before saving.";
  b.hidden = false;
  S.stale = true;
}
function hideStale() {
  const b = $("#stale");
  if (b) b.hidden = true;
  S.stale = false;
}

// Ask for the revision every few seconds and offer a reload when it moved.
// Quiet while anything is being typed or written, so an open box is never
// interrupted by someone else's edit.
async function pollRevision() {
  if (!S.revision || DIRTY.size || Q.busy) return;
  const ta = document.activeElement;
  if (ta && ta.tagName === "TEXTAREA") return;
  try {
    const r = await api("GET", "/api/revision");
    if (r.revision !== S.revision) { staleScript("Script updated elsewhere. Reload to see the latest."); paintHistory(); }
    // Cut suggestions can change outside this page (written or reworked from the
    // command line); pick them up without a reload.
    if (S.notesStamp && r.notes !== S.notesStamp) refreshRuntime();
    S.notesStamp = r.notes;
  } catch (e) { /* the next poll will try again */ }
}

// --------------------------------------------------------------------------
// Undo / redo of script edits
// --------------------------------------------------------------------------
// The store keeps one undo history for the shared script, whoever saved. Undo
// puts back only the lines that edit touched, so later edits elsewhere stay.
async function paintHistory() {
  try {
    const h = await api("GET", "/api/history");
    [["undo", "#undoBtn", "⌘Z"], ["redo", "#redoBtn", "⇧⌘Z"]].forEach(([k, sel, key]) => {
      const b = $(sel);
      b.disabled = !h[k];
      b.title = h[k] ? `${k === "undo" ? "Undo" : "Redo"}: ${h[k]} (${key})` : `Nothing to ${k}`;
    });
  } catch (e) { /* buttons keep their last state */ }
}

async function historyStep(dir) {
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  try {
    const r = await Q.add(() => api("POST", "/api/" + dir, { revision: S.revision }));
    await reload({ quiet: true });
    // The change may be in another scene: go and show it.
    const touched = r.touched || [];
    const at = S.scenes.findIndex((sc) => sc.lines.some((l) => touched.includes(l.id)));
    if (at >= 0) {
      const lid = S.scenes[at].lines.find((l) => touched.includes(l.id)).id;
      if (at === S.i) focusLine(lid); else await go(at, { line: lid });
    }
    toast(`${dir === "undo" ? "Undid" : "Redid"}: ${r.label}`);
  } catch (e) {
    if (e.status !== 409) toast(e.message, true);
  }
  paintHistory();
}

// --------------------------------------------------------------------------
// One writer at a time
// --------------------------------------------------------------------------
// Every write carries the script revision it was made against, and every
// response hands back the new one. Two writes in flight at once would race for
// that revision and the second would be refused, so they go one at a time, in
// the order they were made, each picking up the revision the last one returned.
const Q = {
  chain: Promise.resolve(),
  busy: 0,
  add(fn) {
    this.busy++;
    paintSaved();
    // Once a write has been refused, the ones queued behind it would be too;
    // they are dropped here so each box can say so without a wasted request.
    const guarded = () => (S.stale
      ? Promise.reject(Object.assign(
          new Error("The script changed elsewhere. Reload before saving."), { status: 409 }))
      : fn());
    const run = this.chain.then(guarded, guarded);
    this.chain = run.then(() => {}, () => {});
    this.chain.then(() => { this.busy--; paintSaved(); if (!this.busy) paintHistory(); });
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
  if (lastSaveAt) scheduleRuntime();
}

async function flushAll() {
  await Promise.all(Array.from(DIRTY).map((f) => f.flush()));
  await Q.chain;
  return DIRTY.size === 0;
}

// A closing tab won't wait for a normal fetch, so on the way out everything
// still being typed goes as one keepalive write of the whole scene.
window.addEventListener("pagehide", () => beaconScene());
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
    ta.dataset.typed = "1";                      // ⌘Z here now means this box's typing
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
    ta, wrap, kind: cls, cueId: opts.cueId,
    get dirty() { return ta.value !== base; },
    get value() { return ta.value; },
    flush: () => push(),
    // The store's word for this line, from someone else's save. Never over
    // typing that hasn't landed.
    settle(v) {
      const wasClean = ta.value === base;
      base = v;
      if (wasClean) show(v);
      else { DIRTY.add(h); paintSaved(); }
    },
    // Typing carried across a reload: put it back and let the usual save run
    // under the revision the page now holds.
    restore(v) {
      ta.value = v;
      wrap.dataset.value = v;
      waiting = null;
      paintEmpty();
      if (v === base) return;
      DIRTY.add(h);
      paintSaved();
      schedule();
    },
    focus(caret, opts) {
      ta.focus(opts);
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

// A stage direction's words *are* its direction, so only spoken beats get a
// separate delivery-note box. The store keeps `direction` as its own field on
// every cue, so nothing here has to read markdown any more.
function dirEditable(ln) {
  return ln.type !== "direction";
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
  head.innerHTML = `
    <div class="scene-kicker">
      Scene ${esc(s.display_number || s.number)}
      · <span class="w-${esc(s.world)}">${esc(s.world)}</span>
      ${s.movement ? "· " + esc(s.movement) : ""}
      ${s.beat ? "· " + esc(s.beat) : ""}
      · ${esc(s.status || "stub")}
    </div>
    <h1 class="scene-title">${esc(s.title)}</h1>
    <div class="scene-sub">${subline(s)}</div>
    ${s.setting ? `<details class="context"><summary>Setting the narrator reads</summary>
       <p>${esc(s.setting)}</p></details>` : ""}`;
  page.appendChild(head);

  const beats = document.createElement("div");
  beats.className = "beats";
  page.appendChild(beats);

  (s.lines || []).forEach((ln, i) => {
    beats.appendChild(adder(i === 0 ? null : s.lines[i - 1]));
    const row = beatRow(ln);
    S.rows.push(row);
    beats.appendChild(row.el);
  });
  const last = (s.lines || [])[(s.lines || []).length - 1];
  if (last) beats.appendChild(adder(last));

  const foot = document.createElement("div");
  foot.className = "scene-foot";
  const done = proofOf(s.id).done;
  foot.innerHTML = `
    <button class="btn ${done ? "" : "primary"}" id="markDone">
      ${done ? "✓ Proofed — mark unread" : "✓ Mark proofed → next scene"}</button>
    <span class="hint">${done ? "This scene is marked proofed." : "⌘Enter"}</span>
    <button class="btn ghost danger" id="dropScene" title="Remove this scene from the script">
      Delete this scene</button>`;
  $("#markDone", foot).onclick = () => (done ? unmarkScene() : markSceneDone());
  armed($("#dropScene", foot), "Delete this scene", "Click again to delete", deleteScene);
  page.appendChild(foot);

  paintChrome();
  paintCutPlan();
}

// "N beats · N words · file", kept current when a beat goes without a redraw.
function subline(s) {
  const words = (s.lines || []).reduce(
    (n, l) => n + (l.text || "").split(/\s+/).filter(Boolean).length, 0);
  return `${(s.lines || []).length} beats · ${words} words ·
      ${runtimeOf(s.id, "on stage")}<code>${esc(s.id)}</code>`;
}

// The "+" between beats. It holds the beat it sits after, not that beat's id:
// removing a beat renumbers everything below it in place, and an id captured
// here would then point at the wrong line.
function adder(after) {
  const row = document.createElement("div");
  row.className = "adder";
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "+";
  b.title = "Add a beat here";
  b.onclick = () => insertAfter(after ? after.id : "");
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
    spk.disabled = ln.type === "direction";
    kind.value = ln.type;
    kind.disabled = false;
    bid.textContent = ln.id;
    el.className = "beat t-" + ln.type +
      (proofOf(scene().id).flags.includes(ln.id) ? " flagged" : "");
    dirRO.textContent = ln.direction || "";
    dirRO.hidden = !ln.direction;
  }

  const reshape = (patch) => Q.add(async () => {
    const wasDirection = ln.type === "direction";
    try {
      const r = await api("PUT", `/api/cue/${encodeURIComponent(ln.id)}`,
        Object.assign({ revision: S.revision }, patch));
      S.revision = r.revision;
      row.sync(r.line);
      lastSaveAt = new Date().toLocaleTimeString();
      paintSaved();
      // The row's boxes were built for the kind it had; crossing between a
      // stage direction and a spoken beat needs the other set.
      if (wasDirection !== (ln.type === "direction")) {
        const at = S.rows.indexOf(row);
        reload({ focus: at < 0 ? 0 : at, quiet: true });
      }
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
    cueId: ln.id,
    save: async (text) => {
      const r = await api("PUT", `/api/cue/${encodeURIComponent(ln.id)}`,
        { revision: S.revision, direction: text });
      S.revision = r.revision;
      row.sync(r.line);
      return r.line.direction || "";
    },
  }) : null;

  const wordsF = field("words", ln.text || "", {
    placeholder: ln.type === "direction" ? "stage direction…" : "the line…",
    note,
    cueId: ln.id,
    save: async (text) => {
      const r = await api("PUT", `/api/cue/${encodeURIComponent(ln.id)}`,
        { revision: S.revision, text });
      S.revision = r.revision;
      row.sync(r.line);
      return r.line.text;
    },
  });

  // A stage direction has no separate delivery note; its words are the note.
  // Anything the store still holds in `direction` for one is shown read-only.
  const dirRO = document.createElement("div");
  dirRO.className = "dir ro";
  dirRO.title = "A stage direction's words are its delivery note.";

  if (dirF) body.appendChild(dirF.wrap);
  else body.appendChild(dirRO);
  body.appendChild(wordsF.wrap);

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
  tool("🗑", "Remove this beat (⌘⌫)", () => row.remove());

  // Opened, left empty, walked away from: put it back rather than leaving a
  // blank box sitting in the scene for the rest of the read.
  if (dirF) dirF.ta.addEventListener("blur", () => {
    if (!dirF.ta.value.trim()) dirF.wrap.classList.remove("open");
  });

  const row = {
    ln, el, note,
    get fields() { return dirF ? [dirF, wordsF] : [wordsF]; },
    focus(caret, opts) { this.fields[this.fields.length - 1].focus(caret, opts); },

    fieldOf(kind) { return kind === "dir" ? dirF : wordsF; },

    // Typing that hasn't been written yet, for the one write on the way out.
    dirtyValues() {
      const o = {};
      if (wordsF.dirty) o.text = wordsF.value;
      if (dirF && dirF.dirty) o.direction = dirF.value;
      return Object.keys(o).length ? o : null;
    },

    // The store's word for this beat after somebody's save.
    sync(b) {
      const wasType = ln.type;
      ln.id = b.id;
      ln.type = b.type;
      ln.speaker = b.speaker;
      ln.text = b.text;
      ln.direction = b.direction;
      if ("audio" in b) ln.audio = b.audio; else delete ln.audio;
      paintWho();
      wordsF.settle(b.text || "");
      if (dirF) dirF.settle(b.direction || "");
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

    // No "are you sure": the store keeps the previous script in
    // stage/script-history/, and the toast says so.
    async remove() {
      if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
      const s = scene();
      const at = S.rows.indexOf(row);
      if ((s.lines || []).length <= 1) {
        return note("This is the scene's only beat; delete the scene instead.", "err");
      }
      if (ln.video) {
        return note("This block controls a montage. Edit its cue in stage/show.json to remove it.", "err");
      }
      const lines = plainLines(s).filter((l) => l.id !== ln.id);
      try {
        const saved = await api("PUT", `/api/scene/${encodeURIComponent(s.id)}`,
          { revision: S.revision, lines });
        S.revision = saved.revision;
        lastSaveAt = new Date().toLocaleTimeString();
        // Take the row out where it stands rather than redrawing the scene.
        // A redraw throws away the scroll position and every box on the page,
        // and putting both back is exactly the kind of thing that ends up at
        // the top of the page. Nothing here moves except the beats below.
        if (at < 0 || saved.lines.length !== S.rows.length - 1) {
          await reload({ focus: Math.max(0, at - 1) });
        } else {
          const next = el.nextElementSibling;
          if (next && next.classList.contains("adder")) next.remove();
          el.remove();
          S.rows.splice(at, 1);
          s.lines.splice(s.lines.indexOf(ln), 1);
          saved.lines.forEach((b, i) => S.rows[i].sync(b));
          const sub = $(".scene-sub", $("#page"));
          if (sub) sub.innerHTML = subline(s);
          const near = S.rows[Math.max(0, at - 1)];
          S.lastRow = near || null;
          if (near) near.focus(null, { preventScroll: true });
          paintSaved();
          paintChrome();
        }
        toast("Beat removed. ⌘Z or Undo brings it back.");
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

// One keepalive write of the whole scene, carrying the revision, with every
// box that still holds typing folded in. Per-field requests fired together
// would refuse each other, because the first to land moves the revision.
function beaconScene() {
  if (!DIRTY.size) return;
  const s = scene();
  if (!s || !S.revision) return;
  const lines = plainLines(s);
  S.rows.forEach((row, i) => {
    const v = row.dirtyValues && row.dirtyValues();
    if (v && lines[i]) Object.assign(lines[i], v);
  });
  fetch(`/api/scene/${encodeURIComponent(s.id)}`, {
    method: "PUT", keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ revision: S.revision, lines }),
  }).catch(() => {});
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
  // Typing that hasn't been written yet survives the reload: it is put back
  // into the same cue's box afterwards and saved under the new revision.
  const kept = Array.from(DIRTY).map((f) => [f.cueId, f.kind, f.value]);
  const sid = scene() ? scene().id : null;
  const lastId = S.lastRow ? S.lastRow.ln.id : null;
  const sb = await api("GET", "/api/editor");
  S.scenes = sb.scenes;
  S.chars = sb.characters || [];
  S.revision = revFrom(sb);
  hideStale();
  const i = sid ? S.scenes.findIndex((s) => s.id === sid) : -1;
  S.i = i >= 0 ? i : Math.min(S.i, Math.max(0, S.scenes.length - 1));
  DIRTY.clear();                                   // those boxes are gone now
  render();
  refreshRuntime();
  S.lastRow = S.rows.find((r) => r.ln.id === lastId) || null;
  kept.forEach(([cid, kind, v]) => {
    const row = S.rows.find((r) => r.ln.id === cid);
    const f = row && row.fieldOf(kind);
    if (f) f.restore(v);
  });
  page.scrollTop = scrollTop;
  if (o.focus != null && S.rows[o.focus]) {
    S.rows[o.focus].focus(o.caret == null ? caret : o.caret);
  }
  if (!o.quiet && o.say) toast(o.say);
}

async function insertAfter(afterId) {
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  const s = scene();
  const lines = s.lines || [];
  const prevAt = afterId ? lines.findIndex((l) => l.id === afterId) : -1;
  const prev = prevAt >= 0 ? lines[prevAt] : null;
  const at = prevAt + 1;
  // A new beat takes its kind and speaker from the one above it. Below a stage
  // direction it becomes a spoken line for the nearest speaker; in a scene
  // with nobody speaking yet it starts as narration, to be retyped afterwards.
  let type = prev && prev.type !== "direction" ? prev.type : "live";
  let speaker = prev && prev.type !== "direction" ? (prev.speaker || "") : "";
  if (type === "narration") speaker = "narrator";
  if ((type === "live" || type === "video") && (!speaker || speaker === "narrator")) {
    speaker = nearestSpeaker(lines, at);
    if (!speaker) { type = "narration"; speaker = "narrator"; }
  }
  const payload = plainLines(s);
  payload.splice(at, 0, { type, speaker, text: "…", direction: "" });
  try {
    const saved = await api("PUT", `/api/scene/${encodeURIComponent(s.id)}`,
      { revision: S.revision, lines: payload });
    S.revision = saved.revision;
    lastSaveAt = new Date().toLocaleTimeString();
    // Slot the new beat in where it goes rather than redrawing the scene, for
    // the same reason `remove()` doesn't: a redraw loses the reader's place.
    const b = saved.lines[at];
    if (!b || saved.lines.length !== S.rows.length + 1) {
      await reload({ focus: at, caret: 0 });
      const row = S.rows[at];
      if (row) row.fields[row.fields.length - 1].ta.select();
      return;
    }
    const ln = { id: b.id, type: b.type, speaker: b.speaker,
                 text: b.text, direction: b.direction };
    lines.splice(at, 0, ln);
    const row = beatRow(ln);
    S.rows.splice(at, 0, row);
    // The page reads: adder(before row 0), row 0, adder(after row 0), row 1 ...
    // so the new row and its own adder go right after the adder that follows
    // the beat it was added under.
    const beatsEl = $(".beats", $("#page"));
    if (!beatsEl.firstElementChild) beatsEl.appendChild(adder(null));
    const prevRow = S.rows[at - 1];
    const anchor = prevRow ? prevRow.el.nextElementSibling : beatsEl.firstElementChild;
    anchor.after(row.el, adder(ln));
    saved.lines.forEach((x, i) => S.rows[i].sync(x));
    const sub = $(".scene-sub", $("#page"));
    if (sub) sub.innerHTML = subline(s);
    paintSaved();
    paintChrome();
    row.focus(0, { preventScroll: true });
    row.el.scrollIntoView({ block: "nearest" });
    row.fields[row.fields.length - 1].ta.select();
  } catch (e) { toast(e.message, true); }
}

// --------------------------------------------------------------------------
// Chrome: the rail, the counter, the progress bar
// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// Running time against the cut target
// --------------------------------------------------------------------------
// Measured on the server from each line's recording (see stage/runtime.py);
// fetched again a moment after every save, so a cut shows up as you make it.
const mins = (m) => `${m.toFixed(1)} min`;
const rtScene = (sid) => S.runtime && S.runtime.scenes.find((x) => x.id === sid);

function runtimeOf(sid, label) {
  const r = rtScene(sid);
  if (!r) return "";
  const over = r.budget == null ? 0 : Math.round((r.now - r.budget) * 10) / 10;
  const budget = r.budget == null ? ""
    : over > 0 ? ` <span class="over-min">/ ${r.budget.toFixed(1)}${label ? `, ${over.toFixed(1)} over budget` : ""}</span>`
    : ` <span class="saved-min">✓${label ? " within budget" : ""}</span>`;
  return `${mins(r.now)}${label ? " " + label : ""}${budget}${label ? " · " : ""}`;
}

// The scene's cut suggestions, written per scene and checked against the
// script on every refresh: done once the cut is in, "changed" if its lines
// were edited some other way. Its lines are marked in the page below.
const cutOpen = {};
// What deleting this whole scene would need, and what it would save.
const delOpen = {};
function paintIfDeleted() {
  const box = $("#ifdeleted"), s = scene(), r = s && rtScene(s.id);
  if (!box) return;
  const d = r && r.ifDeleted;
  if (!d) { box.innerHTML = ""; return; }
  const kindTag = (k) => `<span class="loss loss-${esc((k || "").toLowerCase())}">${esc(k)}</span>`;
  const verdictClass = d.verdict === "cuttable" ? "risk-low" : d.verdict === "not cuttable" ? "risk-high" : "risk-medium";
  box.innerHTML = `<details ${delOpen[s.id] ? "open" : ""}>
    <summary>If this whole scene were deleted · saves ${d.savesMinutes.toFixed(1)} min
      <span class="chip ${verdictClass}">${esc(d.verdict)}</span> <span class="chip risk-${esc(d.risk)}">${esc(d.risk)} risk</span></summary>
    <div class="del-body">
      <p class="sug-approach">${esc(d.summary)}</p>
      <p class="del-time">${r.now.toFixed(1)} min now${d.montageMinutes && !d.removesMontage ? `, less ${d.montageMinutes.toFixed(1)} min of montage that moves to a neighbouring scene` : ""}${d.movedMinutes ? `, less ${d.movedMinutes.toFixed(1)} min of lines that move elsewhere` : ""}${d.bridgeMinutes ? `, less ${d.bridgeMinutes.toFixed(1)} min of new bridge lines` : ""} = <b>${d.savesMinutes.toFixed(1)} min saved</b>.</p>
      ${d.riskWhy ? `<p class="sug-risk"><span class="who">${esc(d.risk)} risk</span> ${esc(d.riskWhy)}</p>` : ""}
      ${(d.lost || []).length ? `<div class="sug-loses"><span class="who">What the play loses</span><ul>${d.lost.map((l) =>
        `<li>${kindTag(l.kind)} ${esc(l.what)} <span class="faint">${l.elsewhere ? "· still carried: " + esc(l.elsewhere) : "· lost entirely"}</span></li>`).join("")}</ul></div>` : ""}
      ${(d.orphans || []).length ? `<div class="sug-loses"><span class="who">Lines elsewhere that would stop making sense</span><ul>${d.orphans.map((o) =>
        `<li><button class="cue-ref" data-cue="${esc(o.cue)}">${esc(o.cue)}</button> ${esc(o.problem)}${o.fix ? ` <span class="faint">Fix: ${esc(o.fix)}</span>` : ""}</li>`).join("")}</ul></div>` : ""}
      ${(d.changes || []).length ? `<div class="sug-loses"><span class="who">What would have to change</span><ol class="del-changes">${d.changes.map((c) =>
        `<li><span class="chip">${esc(c.action)}</span> <span class="faint">${esc(c.where || "")}</span> ${esc(c.detail || "")}${c.text ? `<div class="sug-new">${esc(c.text)}</div>` : ""}</li>`).join("")}</ol></div>` : ""}
      ${(d.affects || []).length ? `<p class="sug-warn">⚠ Suggestions in other scenes lean on lines here: ${d.affects.map((n) => "#" + n).join(", ")}. Deleting this scene makes them unsafe.</p>` : ""}
      <p class="hint">Analysis only. Nothing here changes the script.</p>
    </div></details>`;
  $("details", box).ontoggle = (e) => (delOpen[s.id] = e.target.open);
  $$(".cue-ref", box).forEach((b) => (b.onclick = () => {
    const i = S.scenes.findIndex((x) => (x.lines || []).some((l) => l.id === b.dataset.cue));
    if (i >= 0) go(i, { line: b.dataset.cue });
  }));
}

function paintCutPlan() {
  paintIfDeleted();
  const box = $("#cutplan"), s = scene(), r = s && rtScene(s.id);
  S.rows.forEach((row) => { row.el.classList.remove("sug-cut", "sug-trim"); const t = $(".sug-edge", row.el); if (t) t.remove(); });
  if (!box) return;
  const plan = r && r.suggestions;
  const open = plan ? plan.items.filter((x) => x.status !== "done" && x.status !== "dismissed") : [];
  $("#cutsCount").textContent = open.length ? open.length : "";
  $("#cutDrawerTitle").textContent = s ? `Cuts · ${s.title}` : "Cuts";
  if (!plan || !plan.items.length) { box.innerHTML = '<p class="faint">No cut suggestions for this scene.</p>'; return; }
  const offer = open.reduce((n, x) => n + x.savesMinutes, 0);
  const over = r.budget == null ? 0 : Math.max(0, r.now - r.budget);
  const byCue = {};
  open.forEach((x) => x.cues.forEach((cid) => (byCue[cid] = byCue[cid] || []).push(x)));
  Object.entries(byCue).forEach(([cid, xs]) => {
    const row = S.rows.find((w) => w.ln.id === cid);
    if (!row) return;
    const cut = xs.some((x) => (x.cutCues || []).includes(cid));
    row.el.classList.add(cut ? "sug-cut" : "sug-trim");
    const edge = document.createElement("div");
    edge.className = "sug-edge " + (cut ? "is-cut" : "is-trim");
    edge.innerHTML = `<span>${xs.map((x) => "#" + x.number).join(" ")}</span>`;
    edge.onmouseenter = () => showSugPop(edge, cid, xs);
    edge.onmouseleave = () => hideSugPop();
    edge.onclick = () => { openCuts(); scrollToSug(xs[0].number); };
    row.el.appendChild(edge);
  });
  if (cutOpen[s.id] == null) cutOpen[s.id] = true;
  const item = (x) => `
    <li class="sug ${x.status}">
      <div class="sug-head">
        <span class="sug-num">#${x.number}</span>
        <b>${esc(x.title)}</b>
        <span class="chip">${x.kind}</span>
        <span class="chip risk-${esc(x.risk)}">${esc(x.risk)} risk</span>
        ${x.status === "done" ? '<span class="chip done">done</span>'
          : x.status === "stale" ? '<span class="chip stale" title="You edited these lines. Edit the suggestion to match, or dismiss it.">lines changed since</span>' : ""}
        ${x.editedByAuthor ? '<span class="chip">your version</span>' : ""}
        <span class="sug-saves">${x.status === "done" ? "" : "−" + x.savesMinutes.toFixed(1) + " min"}</span>
        ${x.status === "done" || editing(x) ? "" : `
          <button class="btn tiny" data-act="accept" data-n="${x.n}" ${x.status === "stale" ? 'disabled title="Its lines changed since it was written. Edit the suggestion first."' : 'title="Make this change in the script. Undo takes it back out."'}>Accept</button>
          <button class="btn tiny ghost" data-act="edit" data-n="${x.n}" title="Change which lines this cuts or rewrites">Edit</button>
          <button class="btn tiny ghost" data-act="dismiss" data-n="${x.n}" title="Set this suggestion aside. You can restore it from the Dismissed list.">Dismiss</button>`}
      </div>
      ${editing(x) ? sugForm(x) : `<div class="sug-lines">${x.lines.map((l) => {
        const edit = (x.edits || []).find((e) => e.cue === l.id);
        if (edit && x.status !== "done") {
          const d = wordDiff(l.text, edit.text);
          return `<button class="cue-link trim-link" data-cue="${esc(l.id)}" title="Go to this line">
            <span class="who">${esc(l.speaker)}</span> <span class="diff-old">${d.old}</span></button>
            <div class="sug-new diff-new"><span class="who">becomes</span> ${d.neu}</div>`;
        }
        return `<button class="cue-link" data-cue="${esc(l.id)}" title="Go to this line">
          <span class="who">${esc(l.speaker)}</span> ${esc(l.text)}</button>`;
      }).join("")}</div>`}
      ${x.riskWhy ? `<p class="sug-risk"><span class="who">${esc(x.risk)} risk</span> ${esc(x.riskWhy)}${x.riskWas ? ` <span class="faint">(was rated ${esc(x.riskWas)})</span>` : ""}</p>` : ""}
      ${(x.loses || []).length ? `<div class="sug-loses"><span class="who">Deletes</span><ul>${x.loses.map((l) => {
        const m = /^(Plot|Setup|Character|Joke|Colour|Staging|Nothing substantive):\s*(.*)$/.exec(l);
        return m ? `<li><span class="loss loss-${m[1].split(" ")[0].toLowerCase()}">${esc(m[1])}</span> ${esc(m[2])}</li>` : `<li>${esc(l)}</li>`;
      }).join("")}</ul></div>` : ""}
      <p class="sug-why"><span class="who">Why it can go</span> ${esc(x.why)}</p>
      ${x.keeps ? `<p class="sug-keeps"><span class="who">Keeps</span> ${esc(x.keeps)}</p>` : ""}
      ${x.directionsKept ? `<p class="faint">Stage directions in this stretch stay as they are.</p>` : ""}
      ${x.status !== "done" ? conflictHtml(x) : ""}
    </li>`;
  box.innerHTML = `<details ${cutOpen[s.id] ? "open" : ""}>
      <summary>Where to cut · ${open.length} suggestion${open.length === 1 ? "" : "s"} offering ${offer.toFixed(1)} min
        ${over > 0 ? `· this scene needs ${over.toFixed(1)}` : "· scene is within budget"}</summary>
      ${plan.approach ? `<p class="sug-approach">${esc(plan.approach)}</p>` : ""}
      <ol class="sug-list">${plan.items.filter((x) => x.status !== "dismissed").map(item).join("")}</ol>
      ${(() => { const gone = plan.items.filter((x) => x.status === "dismissed"); return gone.length ? `
      <details class="dismissed-list"><summary>Dismissed (${gone.length})</summary><ul>${gone.map((x) => `
        <li><span class="sug-num">#${x.number}</span> ${esc(x.title)} <span class="faint">−${x.savesMinutes.toFixed(1)} min</span>
          <button class="btn tiny ghost" data-act="restore" data-n="${x.n}">Restore</button></li>`).join("")}</ul></details>` : ""; })()}
    </details>`;
  $("details", box).ontoggle = (e) => (cutOpen[s.id] = e.target.open);
  $$(".cue-link[data-cue]", box).forEach((b) => (b.onclick = () => focusLine(b.dataset.cue)));
  wireConflicts(box);
  const byN = (b) => plan.items.find((x) => x.n === +b.dataset.n);
  $$('[data-act="accept"]', box).forEach((b) => {
    const x = byN(b);
    if ((x.warnings || []).length) armed(b, "Accept", "Conflicts: click again", () => acceptSuggestion(x));
    else b.onclick = () => acceptSuggestion(x);
  });
  $$('[data-act="edit"]', box).forEach((b) => (b.onclick = () => startSugEdit(byN(b))));
  $$('[data-act="dismiss"]', box).forEach((b) => (b.onclick = () => dismissSuggestion(byN(b), true)));
  $$('[data-act="restore"]', box).forEach((b) => (b.onclick = () => dismissSuggestion(byN(b), false)));
  if (S.sugEdit) wireSugForm(box);
}

// ---- Conflicts: this suggestion leans on a line another suggestion would cut.
// Each warning opens to show the sentence that leans on it, the line itself,
// and the suggestion that would cut it, with a way to go to either.
function conflictHtml(x) {
  return (x.conflicts || []).map((c, i) => `
    <details class="conflict">
      <summary>⚠ ${c.gone ? `Relies on ${esc(c.cue)}, which has already been cut.`
        : `Conflicts with <b>#${c.otherNumber}</b> in ${esc(c.sceneTitle)}: take one, not both.`} <span class="faint">Show the conflict</span></summary>
      <div class="conflict-body">
        ${c.because ? `<p><span class="who">#${x.number} assumes</span> ${esc(c.because)}</p>` : ""}
        ${c.gone ? "" : `
        <button class="cue-link conflict-line" data-jump-cue="${esc(c.cue)}" title="Go to this line in ${esc(c.sceneTitle)}">
          <span class="who">${esc(c.speaker)} · ${esc(c.sceneTitle)}</span> ${esc(c.text)}</button>
        <p><span class="who">but #${c.otherNumber} cuts it</span> “${esc(c.otherTitle)}” · ${esc(c.otherRisk)} risk · −${c.otherSaves.toFixed(1)} min
          <button class="btn tiny ghost" data-jump-sug="${esc(c.scene)}|${c.otherNumber}">Open #${c.otherNumber}</button></p>
        <p class="faint">Accept one of the two and dismiss the other, or edit one so it no longer depends on this line.</p>`}
      </div>
    </details>`).join("");
}
function wireConflicts(root) {
  $$("[data-jump-cue]", root).forEach((b) => (b.onclick = (e) => {
    e.preventDefault();
    const cue = b.dataset.jumpCue, i = S.scenes.findIndex((sc) => (sc.lines || []).some((l) => l.id === cue));
    const pop = $("#sugPop"); if (pop) pop.hidden = true;
    if (i >= 0) go(i, { line: cue });
  }));
  $$("[data-jump-sug]", root).forEach((b) => (b.onclick = async (e) => {
    e.preventDefault();
    const [sid, num] = b.dataset.jumpSug.split("|"), i = S.scenes.findIndex((sc) => sc.id === sid);
    const pop = $("#sugPop"); if (pop) pop.hidden = true;
    if (i < 0) return;
    await go(i);
    openCuts();
    setTimeout(() => scrollToSug(+num), 60);
  }));
}

// ---- Word diff of a line against its suggested text, like git's --word-diff.
// Longest common subsequence over words; whitespace rides along with each word.
function wordDiff(was, now) {
  const a = was.match(/\S+\s*/g) || [], b = now.match(/\S+\s*/g) || [];
  const key = (w) => w.trim();
  const n = a.length, m = b.length, L = Array.from({ length: n + 1 }, () => new Int16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    L[i][j] = key(a[i]) === key(b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const old = [], neu = [];
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && key(a[i]) === key(b[j])) { old.push(esc(a[i])); neu.push(esc(b[j])); i++; j++; }
    else if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) neu.push(`<ins>${esc(b[j++])}</ins>`);
    else old.push(`<del>${esc(a[i++])}</del>`);
  }
  return { old: old.join("").replace(/<\/del><del>/g, ""), neu: neu.join("").replace(/<\/ins><ins>/g, "") };
}
function diffBlock(was, now) {
  if (now == null) return `<div class="diff diff-old"><span class="who">− cut</span> <del>${esc(was)}</del></div>`;
  const d = wordDiff(was, now);
  return `<div class="diff diff-old"><span class="who">− was</span> ${d.old}</div>
          <div class="diff diff-new"><span class="who">+ now</span> ${d.neu}</div>`;
}

// ---- Hovering the margin tab beside a suggested line shows that suggestion.
let popTimer = null;
function sugPop() {
  let el = $("#sugPop");
  if (!el) {
    el = document.createElement("div");
    el.id = "sugPop";
    el.className = "sug-pop";
    el.onmouseenter = () => clearTimeout(popTimer);
    el.onmouseleave = () => hideSugPop();
    document.body.appendChild(el);
  }
  return el;
}
function hideSugPop() {
  clearTimeout(popTimer);
  popTimer = setTimeout(() => { const el = $("#sugPop"); if (el) el.hidden = true; }, 450);
}
function showSugPop(edge, cid, xs) {
  clearTimeout(popTimer);
  const el = sugPop();
  el.innerHTML = xs.map((x) => {
    const edit = (x.edits || []).find((e) => e.cue === cid);
    const others = x.cues.length - 1;
    return `<div class="pop-sug">
      <div class="sug-head"><span class="sug-num">#${x.number}</span><b>${esc(x.title)}</b>
        <span class="chip risk-${esc(x.risk)}">${esc(x.risk)} risk</span>
        <span class="sug-saves">−${x.savesMinutes.toFixed(1)} min</span></div>
      ${diffBlock((x.lines.find((l) => l.id === cid) || {}).text || "", edit ? edit.text : null)}
      ${others ? `<p class="faint">…along with ${others} other line${others === 1 ? "" : "s"} in this suggestion.</p>` : ""}
      ${x.riskWhy ? `<p class="sug-why">${esc(x.riskWhy)}</p>` : ""}
      ${conflictHtml(x)}
      <div class="sug-actions">
        ${x.status === "stale" ? `<span class="faint">You changed these lines; edit or dismiss it.</span>` : `<button class="btn tiny" data-pop="accept" data-n="${x.n}">Accept</button>`}
        <button class="btn tiny ghost" data-pop="edit" data-n="${x.n}">Edit</button>
        <button class="btn tiny ghost" data-pop="dismiss" data-n="${x.n}">Dismiss</button>
        <button class="btn tiny ghost" data-pop="show" data-n="${x.n}">Show in panel</button>
      </div></div>`;
  }).join("");
  const find = (b) => xs.find((x) => x.n === +b.dataset.n);
  const toPanel = (x) => {
    const s = scene(); cutOpen[s.id] = true;
    openCuts();
    const d = $("#cutplan details"); if (d) d.open = true;
    const li = $$("#cutplan .sug").find((n) => n.querySelector(".sug-num")?.textContent === "#" + x.number);
    if (li) li.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  $$('[data-pop="accept"]', el).forEach((b) => {
    const x = find(b);
    if ((x.warnings || []).length) armed(b, "Accept", "Conflicts: click again", () => { el.hidden = true; acceptSuggestion(x); });
    else b.onclick = () => { el.hidden = true; acceptSuggestion(x); };
  });
  $$('[data-pop="edit"]', el).forEach((b) => (b.onclick = () => { el.hidden = true; startSugEdit(find(b)); toPanel(find(b)); }));
  $$('[data-pop="show"]', el).forEach((b) => (b.onclick = () => { el.hidden = true; toPanel(find(b)); }));
  $$('[data-pop="dismiss"]', el).forEach((b) => (b.onclick = () => { el.hidden = true; dismissSuggestion(find(b), true); }));
  wireConflicts(el);
  el.hidden = false;
  // Anchored to the tab itself, overlapping it by a few pixels, so the pointer
  // can slide straight from the tab onto the card without crossing a gap.
  const r = $("span", edge).getBoundingClientRect();
  const w = Math.min(460, window.innerWidth - 24);
  el.style.width = w + "px";
  el.style.left = Math.max(12, Math.min(r.right - 4, window.innerWidth - w - 12)) + "px";
  const h = el.offsetHeight;
  el.style.top = Math.max(60, Math.min(r.top - 10, window.innerHeight - h - 12)) + "px";
}

// ---- The cuts drawer: slides out on the right like Find; the page narrows.
function openCuts() {
  if (!$("#finder").hidden) closeFinder();
  $("#cutDrawer").hidden = false;
  document.body.classList.add("cutting");
  try { localStorage.setItem("bighack-cuts-open", "1"); } catch (e) { /* fine */ }
  paintCutPlan();
}
function closeCuts() {
  $("#cutDrawer").hidden = true;
  document.body.classList.remove("cutting");
  try { localStorage.removeItem("bighack-cuts-open"); } catch (e) { /* fine */ }
}
function scrollToSug(number) {
  const d = $("#cutplan details"); if (d) d.open = true;
  const li = $$("#cutplan .sug").find((n) => n.querySelector(".sug-num")?.textContent === "#" + number);
  if (li) { li.scrollIntoView({ block: "start", behavior: "smooth" }); li.classList.add("pulse"); setTimeout(() => li.classList.remove("pulse"), 1200); }
}

// ---- Dismissing: the suggestion stays on file but leaves the counts, tabs and conflicts.
async function dismissSuggestion(x, dismissed) {
  try {
    await api("PUT", `/api/suggestion/${encodeURIComponent(scene().id)}/${x.n}/dismiss`, { dismissed });
    await refreshRuntime();
    toast(dismissed ? `Dismissed #${x.number}. Restore it from the Dismissed list at the bottom.` : `Restored #${x.number}.`);
  } catch (e) { toast(e.message, true); }
}

// ---- Accepting a suggestion: one scene save, so one undo reverses it.
async function acceptSuggestion(x) {
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  const s = scene();
  try {
    await api("POST", `/api/suggestion/${encodeURIComponent(s.id)}/${x.n}/accept`, { revision: S.revision });
    lastSaveAt = new Date().toLocaleTimeString();
    await reload({ say: `Accepted: ${x.title}. Undo puts it back.` });
    paintHistory();
  } catch (e) { toast(e.message, true); }
}

// ---- Editing a suggestion: each line is cut, rewritten, or dropped from it;
// other lines of the scene can be added. Saved to the suggestion, not the script.
const editing = (x) => S.sugEdit && S.sugEdit.sid === scene().id && S.sugEdit.n === x.n;
function startSugEdit(x) {
  const edits = Object.fromEntries((x.edits || []).map((e) => [e.cue, e.text]));
  S.sugEdit = { sid: scene().id, n: x.n, title: x.title,
    rows: x.lines.map((l) => ({ id: l.id, mode: l.id in edits ? "rewrite" : "cut", text: edits[l.id] || l.text })) };
  paintCutPlan();
}
function sugForm(x) {
  const d = S.sugEdit, lines = scene().lines || [];
  const lineOf = (id) => lines.find((l) => l.id === id) || {};
  const who = (l) => l.type === "direction" ? "Direction" : charName(l.speaker) || l.speaker;
  const taken = new Set(d.rows.map((r) => r.id));
  const order = (id) => lines.findIndex((l) => l.id === id);
  d.rows.sort((a, b) => order(a.id) - order(b.id));
  return `<div class="sug-form">
    <input class="in sug-title" value="${esc(d.title)}" placeholder="Title" />
    ${d.rows.map((r, i) => { const l = lineOf(r.id); return `
      <div class="sug-row">
        <div class="sug-orig"><span class="who">${esc(who(l))}</span> ${esc(l.text)}</div>
        <div class="sug-modes">
          ${["cut", "rewrite", "keep"].map((m) => `<label><input type="radio" name="m${i}" data-i="${i}" value="${m}" ${r.mode === m ? "checked" : ""}/> ${m === "keep" ? "leave out of this suggestion" : m}</label>`).join("")}
        </div>
        ${r.mode === "rewrite" ? `<textarea class="in sug-text" data-i="${i}" rows="3">${esc(r.text)}</textarea>` : ""}
      </div>`; }).join("")}
    <select class="in sug-add"><option value="">+ Add another line from this scene…</option>
      ${lines.filter((l) => !taken.has(l.id) && !l.video).map((l) => `<option value="${esc(l.id)}">${esc(who(l))}: ${esc((l.text || "").slice(0, 90))}</option>`).join("")}
    </select>
    <div class="sug-actions">
      <button class="btn tiny primary" data-act="save-sug">Save suggestion</button>
      <button class="btn tiny ghost" data-act="cancel-sug">Cancel</button>
      <span class="hint">Saved to the suggestion only. Accept it afterwards to change the script.</span>
    </div>
  </div>`;
}
function wireSugForm(box) {
  const d = S.sugEdit, form = $(".sug-form", box);
  if (!form) return;
  $(".sug-title", form).oninput = (e) => (d.title = e.target.value);
  $$('input[type="radio"]', form).forEach((r) => (r.onchange = () => { d.rows[+r.dataset.i].mode = r.value; paintCutPlan(); }));
  $$(".sug-text", form).forEach((t) => (t.oninput = () => (d.rows[+t.dataset.i].text = t.value)));
  $(".sug-add", form).onchange = (e) => {
    const l = (scene().lines || []).find((x) => x.id === e.target.value);
    if (l) { d.rows.push({ id: l.id, mode: "cut", text: l.text }); paintCutPlan(); }
  };
  $('[data-act="cancel-sug"]', form).onclick = () => { S.sugEdit = null; paintCutPlan(); };
  $('[data-act="save-sug"]', form).onclick = async () => {
    const rows = d.rows.filter((r) => r.mode !== "keep");
    try {
      await api("PUT", `/api/suggestion/${encodeURIComponent(d.sid)}/${d.n}`, {
        title: d.title, cues: rows.map((r) => r.id),
        edits: rows.filter((r) => r.mode === "rewrite").map((r) => ({ cue: r.id, text: r.text })),
      });
      S.sugEdit = null;
      await refreshRuntime();
      toast("Suggestion updated.");
    } catch (e) { toast(e.message, true); }
  };
}

let runtimeTimer = null;
function scheduleRuntime() {
  clearTimeout(runtimeTimer);
  runtimeTimer = setTimeout(refreshRuntime, 1200);
}

async function refreshRuntime() {
  try { S.runtime = await api("GET", "/api/runtime"); } catch (e) { return; }
  paintRuntime();
}

function paintRuntime() {
  const r = S.runtime;
  if (!r) return;
  const share = Math.max(0, Math.min(1, r.cutMinutes / r.needMinutes));
  $("#rtFill").style.width = 100 * share + "%";
  $("#rtNum").textContent = `${r.nowMinutes.toFixed(1)} / ${r.targetMinutes.toFixed(0)} min`;
  $("#runtimeBtn").classList.toggle("met", r.remainingMinutes <= 0);
  $("#runtimeBtn").title = `Running time ${mins(r.nowMinutes)} against a ${mins(r.targetMinutes)} target. `
    + `Cut so far ${mins(r.cutMinutes)} of ${mins(r.needMinutes)} (${Math.round(100 * share)}%).`;
  const sub = $(".scene-sub");
  if (sub && scene()) sub.innerHTML = subline(scene());
  paintChrome();
  paintCutPlan();

  $("#rtSummary").innerHTML = `<b>${mins(r.nowMinutes)}</b> on stage, target <b>${mins(r.targetMinutes)}</b>.
    Cut so far ${mins(r.cutMinutes)} of ${mins(r.needMinutes)} (${Math.round(100 * share)}%);
    ${r.remainingMinutes > 0 ? `<b>${mins(r.remainingMinutes)}</b> still to cut.` : "target reached."}`;
  const top = Math.max(...r.scenes.map((x) => Math.max(x.was, x.now)), 1);
  const row = (x) => {
    const left = x.budget == null ? 0 : Math.round((x.now - x.budget) * 10) / 10;
    const sugs = x.suggestions ? x.suggestions.items.filter((y) => y.status !== "done" && y.status !== "dismissed").length : 0;
    return `
      <span class="name${x.cut ? " cut" : ""}" data-sid="${esc(x.id)}">${esc(x.title)}
        <small>${esc(x.id)}${x.cut ? " · cut" : ""}${x.fixed ? ` · ${x.fixed.toFixed(1)} min montage` : ""}${sugs ? ` · ${sugs} suggestions` : ""}</small></span>
      <span class="num">${x.was.toFixed(1)}</span>
      <span class="num">${x.cut ? "—" : x.now.toFixed(1)}</span>
      <span class="num">${x.budget == null ? "" : x.budget.toFixed(1)}</span>
      <span class="num ${left > 0 ? "over-min" : "saved-min"}">${x.budget == null || x.cut ? "" : left > 0 ? left.toFixed(1) : "✓"}</span>
      <span class="num del-col ${x.ifDeleted ? (x.ifDeleted.verdict === "cuttable" ? "saved-min" : x.ifDeleted.verdict === "not cuttable" ? "faint" : "") : ""}" title="${x.ifDeleted ? esc(x.ifDeleted.verdict) : ""}">${x.ifDeleted ? x.ifDeleted.savesMinutes.toFixed(1) + (x.ifDeleted.verdict === "not cuttable" ? "✕" : x.ifDeleted.verdict === "cuttable" ? "" : "*") : ""}</span>
      <div class="bars"><span class="was" style="width:${100 * x.was / top}%"></span><span class="now" style="width:${100 * x.now / top}%"></span>${x.budget == null || x.cut ? "" : `<i class="budget" style="left:${100 * x.budget / top}%"></i>`}</div>`;
  };
  const budgetTotal = r.scenes.reduce((n, x) => n + (x.cut ? 0 : x.budget || 0), 0);
  $("#rtTable").innerHTML = `<span class="h">Scene</span><span class="h num">Was</span><span class="h num">Now</span><span class="h num">Budget</span><span class="h num">To cut</span><span class="h num" title="Minutes saved by deleting the whole scene. * needs rewrites, ✕ not cuttable">If deleted</span>`
    + r.scenes.map(row).join("")
    + `<span class="total">Whole play</span><span class="num total">${r.startMinutes.toFixed(1)}</span>
       <span class="num total">${r.nowMinutes.toFixed(1)}</span><span class="num total">${budgetTotal.toFixed(1)}</span>
       <span class="num total ${r.remainingMinutes > 0 ? "over-min" : "saved-min"}">${r.remainingMinutes > 0 ? r.remainingMinutes.toFixed(1) : "✓"}</span><span></span>`;
  $$("#rtTable .name").forEach((el) => {
    const i = S.scenes.findIndex((x) => x.id === el.dataset.sid);
    if (i >= 0) el.onclick = () => { $("#runtime").hidden = true; go(i); };
  });
}

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
        <span class="sub">${(x.lines || []).length} beats · ${runtimeOf(x.id)}</span>
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

// A button that wants a second click, not a dialog. Dialogs steal the focus
// and the scroll; this one just changes its label for a few seconds.
function armed(btn, label, ask, fn) {
  let t = null;
  const disarm = () => { clearTimeout(t); t = null; btn.textContent = label; btn.classList.remove("armed"); };
  btn.onclick = () => {
    if (t) { disarm(); fn(); return; }
    btn.textContent = ask;
    btn.classList.add("armed");
    t = setTimeout(disarm, 4000);
  };
}

// The scene leaves the shared script. The store keeps the previous script in
// stage/script-history/ first, and the toast says so.
async function deleteScene() {
  if (!(await flushAll())) return toast("Something hasn't saved yet.", true);
  const s = scene();
  try {
    await api("DELETE", `/api/scene/${encodeURIComponent(s.id)}`, { revision: S.revision });
    delete S.proof.scenes[s.id];
    if (S.proof.at && S.proof.at.scene === s.id) S.proof.at = null;
    saveProof();
    const sb = await api("GET", "/api/editor");
    S.scenes = sb.scenes || [];
    S.chars = sb.characters || [];
    S.revision = revFrom(sb);
    hideStale();
    S.i = Math.min(S.i, Math.max(0, S.scenes.length - 1));
    S.lastRow = null;
    render();
    $("#page").scrollTop = 0;
    toast(`Scene removed: ${s.title}. ⌘Z or Undo brings it back.`);
  } catch (e) { toast(e.message, true); }
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
    if (!$("#cutDrawer").hidden && !(document.activeElement && document.activeElement.closest && document.activeElement.closest("#cutDrawer textarea, #cutDrawer input"))) { closeCuts(); return; }
    if (!$("#runtime").hidden) { $("#runtime").hidden = true; return; }
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
  // ⌘Z undoes the last script edit, unless the caret is in a box you've typed
  // in, where it undoes your typing the way it always has.
  const z = e.key.toLowerCase();
  if (meta && (z === "z" || z === "y") && !(ta && ta.dataset.typed) &&
      e.target.tagName !== "INPUT") {
    e.preventDefault();
    historyStep(z === "y" || e.shiftKey ? "redo" : "undo");
    return;
  }
  // Deleting is global, not just inside a box. The help sheet promises ⌘⌫
  // deletes this beat, and it used to sit below the `!ta` return — so reading
  // a beat, hovering it, or clicking its gutter and pressing ⌘⌫ did nothing at
  // all. There is no reason to require the caret be in a textarea first.
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
  if (!$("#cutDrawer").hidden) closeCuts();
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
      beats.size === 1 ? "" : "s"}?\n\nThe previous script is kept in stage/script-history/.`)) return;
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
      const patch = { revision: S.revision };
      patch[h.part] = next;
      const res = await api("PUT", `/api/cue/${encodeURIComponent(h.lid)}`, patch);
      // Each write moves the revision; the next one has to carry the new one.
      S.revision = res.revision;
      Object.assign(ln, { type: res.line.type, speaker: res.line.speaker,
        text: res.line.text, direction: res.line.direction });
      ok++;
    } catch (e) {
      failed.push(`${h.sid}/${h.lid}: ${e.message}`);
      // The script moved under us; the rest would be refused the same way.
      if (e.status === 409) break;
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
$("#undoBtn").onclick = () => historyStep("undo");
$("#redoBtn").onclick = () => historyStep("redo");
$("#helpClose").onclick = () => ($("#help").hidden = true);
$("#runtimeBtn").onclick = () => { $("#runtime").hidden = false; refreshRuntime(); };
$("#cutsBtn").onclick = () => ($("#cutDrawer").hidden ? openCuts() : closeCuts());
$("#cutDrawerClose").onclick = () => closeCuts();
try { if (localStorage.getItem("bighack-cuts-open")) openCuts(); } catch (e) { /* fine */ }
$("#runtimeClose").onclick = () => ($("#runtime").hidden = true);
$("#prev").onclick = () => go(S.i - 1);
$("#next").onclick = () => go(S.i + 1);

(async function boot() {
  try {
    const [sb, proof] = await Promise.all([
      api("GET", "/api/editor"),
      api("GET", "/api/proof").catch(() => ({ scenes: {}, at: null })),
    ]);
    S.scenes = sb.scenes || [];
    S.chars = sb.characters || [];
    S.revision = revFrom(sb);
    S.proof = { at: proof.at || null, scenes: proof.scenes || {} };

    // A link from the Cuts page lands on a named scene and beat; the query is
    // dropped afterwards so a later reload picks the read up as usual.
    const q = new URLSearchParams(location.search);
    const wantScene = q.get("scene");
    const j = wantScene ? S.scenes.findIndex((s) => s.id === wantScene) : -1;
    if (j >= 0) {
      S.i = j;
      render();
      if (q.get("line")) focusLine(q.get("line"));
      history.replaceState(null, "", location.pathname);
    } else {
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
    }
    paintSaved();
    refreshRuntime();
    setInterval(pollRevision, 4000);
    paintHistory();
  } catch (e) {
    $("#page").innerHTML = `<p class="empty">Couldn't load the script: ${esc(e.message)}</p>`;
  }
})();
