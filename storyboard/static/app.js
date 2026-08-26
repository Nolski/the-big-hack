// The Big Hack — storyboard SPA
let SB = null;
let TAB = "storyboard";

// Scenes are parsed from the script markdown, so the script is the only place
// a beat can be edited and have it mean anything. The Review page writes each
// beat back to its own .md; this page reads. The trailing "#" takes a scene id.
const REVIEW_LINK =
  "/review.html?before=working&after=working&unchanged=1&equal=1#";

const $ = (sel, root = document) => root.querySelector(sel);
const view = () => document.getElementById("view");

async function api(method, path, body) {
  const opt = { method, headers: {} };
  if (body !== undefined) {
    opt.headers["Content-Type"] = "application/json";
    opt.body = JSON.stringify(body);
  }
  const r = await fetch(path, opt);
  if (!r.ok) {
    let msg = r.statusText;
    try { msg = (await r.json()).detail || msg; } catch (e) {}
    throw new Error(msg);
  }
  return r.status === 204 ? null : r.json();
}

function toast(msg, isErr = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (isErr ? " err" : "");
  clearTimeout(t._t);
  t._t = setTimeout(() => (t.className = "toast"), isErr ? 6000 : 3000);
}

const bust = (p) => (p ? `/artifacts/${p}?t=${Date.now()}` : null);
const charById = (id) => (SB.characters || []).find((c) => c.id === id);
const esc = (s) => (s == null ? "" : String(s)).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function load() {
  SB = await api("GET", "/api/storyboard");
  render();
}

function render() {
  document.querySelectorAll(".tab").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === TAB));
  if (TAB === "storyboard") renderStoryboard();
  else if (TAB === "cast") renderCast();
  else renderPlayer();
}

// --------------------------------------------------------------------------
// STORYBOARD
// --------------------------------------------------------------------------
function renderStoryboard() {
  const v = view();
  v.innerHTML = `
    <div class="section-head">
      <h2>Storyboard</h2><span class="pill">${SB.scenes.length} scenes</span>
      <span class="spacer"></span>
      <button class="btn" id="genAllAudio">🔊 Generate all audio</button>
      <button class="btn" id="genAllSketch">🎨 Generate missing sketches</button>
      <button class="btn" id="genAllMusic">🎵 Generate missing music</button>
      <button class="btn primary" id="addScene">+ Scene</button>
    </div>
    <div class="grid" id="sceneGrid"></div>`;
  const grid = $("#sceneGrid");
  SB.scenes.forEach((s) => grid.appendChild(sceneCard(s)));
  $("#addScene").onclick = addScene;
  $("#genAllSketch").onclick = genAllSketches;
  $("#genAllAudio").onclick = async (e) => {
    const b = e.target; b.disabled = true; const o = b.innerHTML;
    b.innerHTML = '<span class="spin"></span> rendering whole show…';
    try {
      const r = await api("POST", "/api/generate/audio-all", { only_missing: true });
      await load(); toast(`Generated ${r.generated}/${r.total} clips.`);
    } catch (e) { toast(e.message, true); b.disabled = false; b.innerHTML = o; }
  };
  $("#genAllMusic").onclick = async (e) => {
    const b = e.target; b.disabled = true; const o = b.innerHTML;
    b.innerHTML = '<span class="spin"></span> scoring scenes…';
    try {
      const r = await api("POST", "/api/generate/music-all", { only_missing: true });
      await load(); toast(`Scored ${r.generated}/${r.total} scenes.`);
    } catch (e) { toast(e.message, true); b.disabled = false; b.innerHTML = o; }
  };
}

function sceneCard(s) {
  const d = document.createElement("div");
  d.className = "scene-card";
  const img = s.sketch && s.sketch.image;
  const hasAudio = (s.lines || []).some((l) => l.audio) || s.narration_audio;
  d.innerHTML = `
    <div class="thumb" ${img ? `style="background-image:url('${bust(img)}')"` : ""}>
      ${img ? "" : "no sketch"}</div>
    <div class="scene-meta">
      <div class="scene-num">SCENE ${esc(s.display_number || s.number)} · ${esc(s.movement || "")}</div>
      <div class="scene-title">${esc(s.title)}</div>
      <div class="pills">
        <span class="pill ${s.world}">${esc(s.world)}</span>
        ${s.beat ? `<span class="pill">${esc(s.beat)}</span>` : ""}
        <span class="pill">${esc(s.status || "stub")}</span>
        ${hasAudio ? `<span class="pill has">audio</span>` : ""}
      </div>
    </div>`;
  d.onclick = () => openScene(s.id);
  return d;
}

async function addScene() {
  const s = await api("POST", "/api/scene", {
    title: "New Scene", world: "modern", status: "stub",
    setting: "", narration: "", sketch: { prompt: "" }, lines: [],
  });
  await load();
  openScene(s.id);
}

async function genAllSketches() {
  const todo = SB.scenes.filter((s) => !(s.sketch && s.sketch.image));
  if (!todo.length) return toast("All scenes already have sketches.");
  toast(`Generating ${todo.length} sketches…`);
  for (const s of todo) {
    try { await api("POST", `/api/generate/sketch/${s.id}`); }
    catch (e) { toast(`Sketch ${s.id} failed: ${e.message}`, true); }
  }
  await load();
  toast("Sketch generation done.");
}

// drawer ----------------------------------------------------------------
function drawer(html) {
  closeDrawer();
  const back = document.createElement("div");
  back.className = "drawer-backdrop";
  back.innerHTML = `<div class="drawer">${html}</div>`;
  back.onclick = (e) => { if (e.target === back) closeDrawer(); };
  document.body.appendChild(back);
  return back;
}
let drawerAudio = null, drawerMusic = null;
// A drawer that holds unwritten edits registers a flush here. Closing one is a
// click on the backdrop away, so it must never be the thing that loses typing.
let drawerFlush = null;
function closeDrawer() {
  if (drawerAudio) { drawerAudio.pause(); drawerAudio.onended = null; drawerAudio = null; }
  if (drawerMusic) { drawerMusic.pause(); drawerMusic = null; }
  const flush = drawerFlush;
  drawerFlush = null;
  if (flush) flush();
  document.querySelector(".drawer-backdrop")?.remove();
}
window.addEventListener("beforeunload", () => { if (drawerFlush) drawerFlush(); });
// Beats holding unwritten typing. A closing tab won't wait on a normal fetch,
// so on the way out each one re-sends itself as a keepalive request.
const DIRTY_BEATS = new Set();
window.addEventListener("pagehide", () => DIRTY_BEATS.forEach((f) => f.beacon()));

function openScene(id) {
  const scene = SB.scenes.find((s) => s.id === id);
  const edit = JSON.parse(JSON.stringify(scene));
  edit.sketch = edit.sketch || { prompt: "" };
  edit.music = edit.music || {};
  edit.lines = edit.lines || [];

  const back = drawer(`<div id="sceneEdit"></div>`);
  const root = $("#sceneEdit", back);

  function paint() {
    root.innerHTML = `
      <div class="btn-row" style="justify-content:space-between">
        <h3>Scene ${esc(scene.display_number || scene.number)} — Edit</h3>
        <div class="btn-row">
          <button class="btn mini" id="playScene">▶ Play scene</button>
          <button class="btn mini speed" data-speed-toggle type="button"></button>
          <button class="btn ghost" id="x">✕</button>
        </div>
      </div>
      <div class="readonly-note">
        <strong>Reading the play through?</strong>
        <a href="/proof.html">The proofreading page</a> is built for it — every
        line is already a box, nothing opens or closes, and it keeps your place
        across the whole script. This drawer is for one-off fixes next to the
        audio and the sketch.
        <br><br>
        <strong>Click a line to rewrite it.</strong>
        You type the words, not the markdown — the speaker, the parenthetical and
        the clip reference stay where they are, and
        <code>${esc(scene.source_file ? scene.source_file.split("/").pop() : "03 - Script/")}</code>
        is written a moment after you stop typing.
        <code>&lt;/&gt;</code> on a line opens its markdown if you need it. The
        fields above the lines are read-only here — change them in the
        <code>.md</code> or on the
        <a href="${REVIEW_LINK}${esc(scene.id)}">Review page</a>.
      </div>

      <label class="field">Title</label>
      <input class="in" id="f-title" value="${esc(edit.title)}" readonly>
      <div class="row2">
        <div><label class="field">Movement</label>
          <input class="in" id="f-movement" value="${esc(edit.movement || "")}" readonly></div>
        <div><label class="field">Beat</label>
          <input class="in" id="f-beat" value="${esc(edit.beat || "")}" readonly></div>
      </div>
      <div class="row2">
        <div><label class="field">World</label>
          <select class="in" id="f-world" disabled>
            ${["modern", "historical", "both", "frame"].map((w) =>
              `<option ${edit.world === w ? "selected" : ""}>${w}</option>`).join("")}
          </select></div>
        <div><label class="field">Status</label>
          <select class="in" id="f-status" disabled>
            ${["stub", "drafted", "revised", "locked"].map((w) =>
              `<option ${edit.status === w ? "selected" : ""}>${w}</option>`).join("")}
          </select></div>
      </div>
      <label class="field">Setting / staging</label>
      <textarea class="in" id="f-setting" rows="2" readonly>${esc(edit.setting || "")}</textarea>

      <hr class="sep">
      <label class="field">Narrator framing (V.O.)</label>
      <textarea class="in" id="f-narration" rows="2" readonly>${esc(edit.narration || "")}</textarea>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn mini" id="genNarr">🔊 Generate narration</button>
      </div>
      ${scene.narration_audio ? `<audio controls src="${bust(scene.narration_audio)}"></audio>` : ""}

      <hr class="sep">
      <label class="field">Sketch prompt</label>
      <textarea class="in" id="f-sketch" rows="3" readonly>${esc(edit.sketch.prompt || "")}</textarea>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn mini" id="genSketch">🎨 Generate sketch</button>
      </div>
      ${scene.sketch && scene.sketch.image
        ? `<img class="sketch-preview" src="${bust(scene.sketch.image)}">` : ""}

      <hr class="sep">
      <label class="field">Background music prompt (period-accurate)</label>
      <textarea class="in" id="f-music" rows="2" readonly placeholder="(blank = derive from this scene's world)">${esc(edit.music.prompt || "")}</textarea>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn mini" id="genMusic">🎵 Generate music</button>
      </div>
      ${scene.music && scene.music.audio ? `<audio controls loop src="${bust(scene.music.audio)}"></audio>` : ""}

      <hr class="sep">
      <div class="btn-row" style="justify-content:space-between">
        <label class="field" style="margin:0">Lines</label>
      </div>
      <div id="lines"></div>

      <hr class="sep">
      <div class="btn-row">
        <a class="btn" id="editReview" href="${REVIEW_LINK}${esc(scene.id)}">↗ Open in Review</a>
        <button class="btn" id="genAudio">🔊 Generate all scene audio</button>
      </div>
      <p class="hint">Generation reads the scene straight from the script and renders on the GPU box / image API. This can take ~20–40s.</p>`;

    $("#x", root).onclick = closeDrawer;
    $("#playScene", root).onclick = playScene;
    bindScene();
    paintLines();
  }

  function playScene() {
    if (drawerAudio) { drawerAudio.pause(); drawerAudio.onended = null; }
    if (drawerMusic) { drawerMusic.pause(); drawerMusic = null; }
    const btn = $("#playScene", root);
    const seq = [];
    let music = (scene.music && scene.music.audio) || null;
    if (scene.setting_audio) seq.push({ src: scene.setting_audio, line: -1, music });
    if (scene.narration_audio) seq.push({ src: scene.narration_audio, line: -1, music });
    edit.lines.forEach((ln, i) => {
      const saved = (scene.lines || []).find((l) => l.id === ln.id);
      const cue = saved && saved.music;
      if (cue) music = cue === "scene" ? (scene.music && scene.music.audio) || null : cue;
      if (saved && saved.audio) seq.push({ src: saved.audio, line: i, music });
    });
    if (!seq.length) return toast("No audio yet — generate scene audio first.");
    let curMusic = null;
    const setDrawerMusic = (src) => {
      if (src === curMusic) return;
      curMusic = src;
      if (drawerMusic) { drawerMusic.pause(); drawerMusic = null; }
      if (src) {
        drawerMusic = new Audio(bust(src));
        drawerMusic.dataset.norate = "";   // the bed keeps its own tempo
        drawerMusic.loop = true; drawerMusic.volume = 0.18;
        drawerMusic.play().catch(() => {});
      }
    };
    const lineEls = () => root.querySelectorAll("#lines .line");
    const hl = (idx) => lineEls().forEach((el, i) =>
      (el.style.outline = i === idx ? "2px solid var(--accent)" : ""));
    const reset = () => {
      btn.textContent = "▶ Play scene"; btn.onclick = playScene; hl(-1);
      if (drawerMusic) { drawerMusic.pause(); drawerMusic = null; }
    };
    const dram = (drawerAudio = Playback.register(new Audio()));
    let k = 0;
    const step = () => {
      if (k >= seq.length) return reset();
      const b = seq[k];
      setDrawerMusic(b.music);
      hl(b.line);
      const el = b.line >= 0 ? lineEls()[b.line] : null;
      if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      dram.src = bust(b.src);
      dram.onended = () => { k++; step(); };
      dram.play().catch(() => { k++; step(); });
    };
    btn.textContent = "⏹ Stop";
    btn.onclick = () => { dram.pause(); dram.onended = null; reset(); };
    step();
  }

  function bindScene() {
    $("#genMusic", root).onclick = () => gen("#genMusic", `/api/generate/music/${scene.id}`);
    $("#genNarr", root).onclick = () => gen("#genNarr", `/api/generate/narration/${scene.id}`);
    $("#genSketch", root).onclick = () => gen("#genSketch", `/api/generate/sketch/${scene.id}`);
    $("#genAudio", root).onclick = () => gen("#genAudio", `/api/generate/scene-audio/${scene.id}`, true);
  }

  // Beats with unwritten typing in them. The drawer closes on a stray backdrop
  // click, so closing (and leaving the page) has to push these first.
  const dirty = DIRTY_BEATS;
  drawerFlush = () => Promise.all([...dirty].map((f) => f()));
  let wired = [];    // one handle per editable beat, in the order they're shown
  let openBeat = null;   // the one beat currently showing its markdown

  function paintLines() {
    const wrap = $("#lines", root);
    wrap.innerHTML = "";
    wired = [];
    openBeat = null;
    const charOpts = (sel) => SB.characters.map((c) =>
      `<option value="${c.id}" ${sel === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
    edit.lines.forEach((ln, i) => {
      const saved = (scene.lines || []).find((l) => l.id === ln.id);
      const raw = ln._raw;
      const div = document.createElement("div");
      div.className = "line";
      div.innerHTML = `
        <div class="line-head">
          <select class="in mini type" style="width:auto" ${raw == null ? "disabled" : ""}>
            ${["live", "video", "narration", "direction"].map((t) =>
              `<option ${ln.type === t ? "selected" : ""}>${t}</option>`).join("")}
          </select>
          <select class="in mini spk" style="width:auto"
                  ${raw == null || ln.type === "direction" ? "disabled" : ""}>
            <option value="">— speaker —</option>${charOpts(ln.speaker)}
          </select>
          <span class="spacer" style="flex:1"></span>
          <span class="save-state"></span>
          ${raw == null ? "" : `<button class="btn mini md" title="Edit this beat's markdown">&lt;/&gt;</button>`}
          ${ln.type !== "direction" ? `<button class="btn mini regen">🔊</button>` : ""}
          ${raw == null ? "" : `<button class="btn mini drop" title="Remove this beat">🗑</button>`}
        </div>
        <div class="beat"></div>
        ${raw == null ? `<p class="hint">No source span for this beat — edit it in the <code>.md</code>.</p>` : ""}
        ${saved && saved.audio ? `<audio controls src="${bust(saved.audio)}"></audio>` : ""}`;
      const rg = $(".regen", div);
      if (rg) rg.onclick = async () => {
        rg.disabled = true; rg.innerHTML = '<span class="spin"></span>';
        try {
          await drawerFlush();
          await api("POST", `/api/generate/line/${scene.id}/${ln.id}`);
          await refresh();
        } catch (e) { toast(e.message, true); rg.disabled = false; rg.textContent = "🔊"; }
      };
      const drop = $(".drop", div);
      if (drop) drop.onclick = async () => {
        const gist = (ln.text || ln._raw || "").replace(/\s+/g, " ").slice(0, 70);
        if (!confirm(`Remove this beat?\n\n${gist}…`)) return;
        // Drop any queued save first: once the beat is gone its id belongs to
        // the beat that follows, and a late write would land in that one.
        if (ln._cancel) ln._cancel();
        try {
          const r = await api("POST", "/api/review/line/delete",
                              { scene: scene.id, line: ln.id, expect: ln._raw });
          await resync(r.beats);
        } catch (e) { toast(e.message, true); }
      };
      wireShape(div, ln);
      wrap.appendChild(adder(i === 0 ? "" : edit.lines[i - 1].id));
      wrap.appendChild(div);
      if (raw == null) $(".beat", div).textContent = ln.text || "";
      else wireBeat(div, ln);
    });
    const last = edit.lines[edit.lines.length - 1];
    if (last) wrap.appendChild(adder(last.id));
  }

  // The gap between two beats, with a + in it. New beats inherit the speaker
  // above them, because the next thing written is usually the reply.
  function adder(afterId) {
    const prev = edit.lines.find((l) => l.id === afterId);
    const row = document.createElement("div");
    row.className = "adder";
    row.innerHTML = `<button class="btn mini plus" title="Add a line here">+</button>`;
    $(".plus", row).onclick = async () => {
      await drawerFlush();
      try {
        const r = await api("POST", "/api/review/line/insert", {
          scene: scene.id, after: afterId, expect: prev ? prev._raw : null,
          type: prev && prev.type !== "direction" ? prev.type : "live",
          speaker: prev ? prev.speaker : "",
        });
        await refresh();
        // Open it straight away with the placeholder selected, so the first
        // thing typed replaces it.
        const beat = wired[r.index];
        if (!beat) return;
        beat.write();
        beat.ta.select();
      } catch (e) { toast(e.message, true); }
    };
    return row;
  }

  function wireShape(div, ln) {
    const send = async (patch) => {
      if (ln._cancel) ln._cancel();
      try {
        const r = await api("PUT", "/api/review/line/shape",
                            Object.assign({ scene: scene.id, line: ln.id, expect: ln._raw }, patch));
        ln._raw = r.raw; ln.text = r.text;
        await refresh();
      } catch (e) { toast(e.message, true); await refresh(); }
    };
    const type = $(".type", div), spk = $(".spk", div);
    if (type && !type.disabled) type.onchange = () => send({ type: type.value });
    if (spk && !spk.disabled) spk.onchange = () => send({ speaker: spk.value });
  }

  // A beat is read here as much as edited, so the box shows all of it rather
  // than making a long stage direction into a two-line porthole.
  function grow(ta) {
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }

  // Every write hands back the scene's new beat numbering. Usually it matches
  // what's on screen and there is nothing to do; when a beat was split or
  // merged, everything after it has been renumbered and the drawer has to
  // re-read the scene rather than keep writing against ids that have moved.
  async function resync(beats) {
    const at = wired.findIndex((w) => w.ta === document.activeElement);
    if (beats.map((b) => b.id).join() === edit.lines.map((l) => l.id).join()) {
      beats.forEach(({ raw, ...rest }, i) => Object.assign(edit.lines[i], rest, { _raw: raw }));
      wired.forEach((w) => w.rebase());
      return;
    }
    const caret = at >= 0 ? wired[at].ta.selectionStart : 0;
    const note = at >= 0 ? wired[at].ta.closest(".line").querySelector(".save-state").textContent : "";
    await refresh();
    if (at < 0 || !wired[at]) return;
    wired[at].write(caret);
    // The repaint threw away the confirmation along with the old box. Put it
    // back, or the save looks like it never happened.
    wired[at].mark(note, "ok");
  }

  // A beat has three faces: the scene as it reads, the words on their own to
  // rewrite, and — only if asked for — the markdown underneath. Editing is the
  // middle one, so changing a line never means editing syntax.
  function wireBeat(div, ln) {
    const host = $(".beat", div);
    const state = $(".save-state", div);
    let ta = null, md = false, timer = null, chain = Promise.resolve();
    let onRaw = ln._raw;                       // what the file holds, for `expect`
    const shown = () => (md ? onRaw : ln.text || "");
    const mark = (t, cls) => { state.textContent = t; state.className = "save-state " + (cls || ""); };

    const read = () => {
      ta = null;
      host.innerHTML = "";
      const p = document.createElement("div");
      p.className = "read" + (ln.type === "direction" ? " dir" : "");
      p.title = "click to edit this line";
      if (ln.direction && ln.type !== "direction") {
        const d = document.createElement("span");
        d.className = "beat-dir";
        d.textContent = `(${ln.direction}) `;
        p.appendChild(d);
      }
      p.appendChild(document.createTextNode(ln.text || ""));
      p.onclick = () => write();
      host.appendChild(p);
    };

    const write = (caret) => {
      // Close the last one only now, inside this click. Collapsing it on its
      // own blur would reflow the drawer between mousedown and click, and the
      // beat you aimed at would have moved out from under the cursor.
      if (openBeat && openBeat !== self) openBeat.close();
      openBeat = self;
      host.innerHTML = "";
      // In plain-words mode the parenthetical isn't part of what you're
      // rewriting, but you still need to see what you're writing under.
      if (!md && ln.direction && ln.type !== "direction") {
        const d = document.createElement("div");
        d.className = "beat-dir aside";
        d.textContent = `(${ln.direction})`;
        host.appendChild(d);
      }
      ta = document.createElement("textarea");
      ta.className = "in txt" + (md ? " mono" : "");
      ta.spellcheck = true;
      ta.value = shown();
      host.appendChild(ta);
      grow(ta);
      ta.focus();
      const c = caret == null ? ta.value.length : Math.min(caret, ta.value.length);
      ta.setSelectionRange(c, c);
      ta.scrollIntoView({ block: "nearest" });
      ta.addEventListener("input", () => {
        grow(ta);
        dirty.add(flush); mark("editing…");
        clearTimeout(timer); timer = setTimeout(flush, 700);
      });
      ta.addEventListener("blur", flush);
    };

    // Put the readable face back, unless there's typing that hasn't landed —
    // a failed write keeps its text on screen rather than hiding it.
    const close = async () => {
      await flush();
      if (!ta || ta.value !== shown()) return;
      if (openBeat === self) openBeat = null;
      md = false;
      read();
    };

    const toggleMd = async () => {
      await flush();
      if (ta && ta.value !== shown()) return;   // unsaved: don't swap under it
      md = !md;
      write();
    };

    // Take the file's word for this beat, but never over live typing, and
    // never into the box the caret is sitting in.
    const rebase = () => {
      if (!ta) return read();
      if (ta.value === shown()) {
        onRaw = ln._raw;
        if (document.activeElement !== ta) { ta.value = shown(); grow(ta); }
      }
    };

    const flush = () => {
      if (!ta) return chain;
      clearTimeout(timer);
      // Typed and then typed back: nothing to write. Only clear the note if it
      // was mid-edit, so a "saved" confirmation survives clicking away.
      if (ta.value === shown()) { if (dirty.delete(flush)) mark(""); return chain; }
      mark("saving…");
      chain = chain.then(async () => {
        if (ta.value === shown()) return;
        const sent = ta.value, asMd = md;
        try {
          const r = await api("PUT", asMd ? "/api/review/line" : "/api/review/line/text",
                              { scene: scene.id, line: ln.id, text: sent, expect: onRaw });
          onRaw = ln._raw = r.raw;
          ln.text = r.text;
          const line = (scene.lines || []).find((l) => l.id === ln.id);
          if (line) { line._raw = r.raw; line.text = r.text; }
          if (ta.value !== sent) {
            flush();   // typing landed mid-save; that write carries the resync
            return;
          }
          // The file may hold a tidied version of what was typed — show that,
          // so the box and the script never quietly disagree. Not while the
          // caret is in the box: assigning to a textarea's value drops the
          // selection to the end, which reads as the cursor jumping mid-sentence.
          if (ta.value !== shown() && document.activeElement !== ta) {
            ta.value = shown(); grow(ta);
          }
          dirty.delete(flush);
          mark("saved " + new Date().toLocaleTimeString(), "ok");
          if (r.beats) await resync(r.beats);
        } catch (e) { mark(e.message, "err"); }
      });
      return chain;
    };
    const self = { rebase, write, close, mark, get ta() { return ta; } };
    wired.push(self);
    wireButton(div, ".md", toggleMd);
    ln._cancel = () => { clearTimeout(timer); dirty.delete(flush); flush.beacon = () => {}; };

    flush.beacon = () => {
      if (!ta || ta.value === shown()) return;
      fetch(md ? "/api/review/line" : "/api/review/line/text", {
        method: "PUT", keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: scene.id, line: ln.id, text: ta.value, expect: onRaw }),
      }).catch(() => {});
    };

    read();
  }

  function wireButton(div, sel, fn) {
    const b = $(sel, div);
    if (b) b.onclick = fn;
  }

  async function refresh() {
    SB = await api("GET", "/api/storyboard");
    Object.assign(scene, SB.scenes.find((s) => s.id === scene.id));
    Object.assign(edit, JSON.parse(JSON.stringify(scene)));
    edit.sketch = edit.sketch || { prompt: "" };
    edit.lines = edit.lines || [];
    paint();
  }
  async function gen(btnSel, path, isBatch) {
    const btn = $(btnSel, root);
    btn.disabled = true; const orig = btn.innerHTML;
    btn.innerHTML = '<span class="spin"></span> working…';
    try {
      const r = await api("POST", path);
      await refresh();
      toast(isBatch ? `Generated ${r.generated}/${r.total} clips.` : "Done.");
    } catch (e) {
      toast(e.message, true); btn.disabled = false; btn.innerHTML = orig;
    }
  }

  paint();
}

// --------------------------------------------------------------------------
// CAST
// --------------------------------------------------------------------------
function renderCast() {
  const v = view();
  v.innerHTML = `
    <div class="section-head">
      <h2>Cast &amp; Voices</h2><span class="pill">${SB.characters.length}</span>
      <span class="spacer"></span>
      <button class="btn" id="genAllVoice">Generate missing voices</button>
      <button class="btn" id="extractVecs">🔒 Lock voices → vectors</button>
      <button class="btn primary" id="addChar">+ Character</button>
    </div>
    <p class="hint">"Lock voices → vectors" extracts a reusable 2048-d speaker x-vector from each sample and switches the character to vector mode, so every new line renders in the exact same voice.</p>
    <div class="cast-grid" id="castGrid"></div>`;
  const grid = $("#castGrid");
  SB.characters.forEach((c) => grid.appendChild(castCard(c)));
  $("#addChar").onclick = addChar;
  $("#genAllVoice").onclick = genAllVoices;
  $("#extractVecs").onclick = async (e) => {
    const b = e.target; b.disabled = true; const o = b.innerHTML;
    b.innerHTML = '<span class="spin"></span> extracting vectors…';
    try {
      const r = await api("POST", "/api/vectors/extract-all", { only_missing: false });
      await load(); toast(`Saved ${r.extracted}/${r.total} voice vectors.`);
    } catch (e) { toast(e.message, true); b.disabled = false; b.innerHTML = o; }
  };
}

function castCard(c) {
  const d = document.createElement("div");
  d.className = "cast-card";
  const initials = (c.name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  d.innerHTML = `
    <div class="cast-portrait" ${c.portrait ? `style="background-image:url('${bust(c.portrait)}')"` : ""}>
      ${c.portrait ? "" : initials}</div>
    <div class="name">${esc(c.name)} ${c.live ? '<span class="pill">live</span>' : ""}
      ${c.voice && c.voice.vector ? '<span class="pill has">vector</span>' : ""}</div>
    <div class="role">${esc(c.role || "")} · ${esc(c.world || "")}</div>
    ${c.voice && c.voice.sample ? `<audio controls src="${bust(c.voice.sample)}"></audio>` : `<div class="pill">no voice yet</div>`}`;
  d.querySelector("audio")?.addEventListener("click", (e) => e.stopPropagation());
  d.onclick = () => openChar(c.id);
  return d;
}

async function addChar() {
  const id = prompt("New character id (lowercase, no spaces):");
  if (!id) return;
  try {
    await api("POST", "/api/character", {
      id, name: id, world: "modern", role: "supporting", medium: "ai-video",
      live: false, description: "",
      voice: { mode: "design", seed: 42, instruct: "", sample_text: "" },
    });
    await load(); openChar(id);
  } catch (e) { toast(e.message, true); }
}

async function genAllVoices() {
  const btn = $("#genAllVoice");
  btn.disabled = true; const o = btn.innerHTML;
  btn.innerHTML = '<span class="spin"></span> rendering voices…';
  try {
    const r = await api("POST", "/api/generate/voices-all", { only_missing: true });
    await load(); toast(`Generated ${r.generated}/${r.total} voices.`);
  } catch (e) { toast(e.message, true); btn.disabled = false; btn.innerHTML = o; }
}

function openChar(id) {
  const c = SB.characters.find((x) => x.id === id);
  const edit = JSON.parse(JSON.stringify(c));
  edit.voice = edit.voice || { mode: "design", seed: 42 };
  const back = drawer(`<div id="charEdit"></div>`);
  const root = $("#charEdit", back);

  function paint() {
    root.innerHTML = `
      <div class="btn-row" style="justify-content:space-between">
        <h3>${esc(c.name)}</h3><button class="btn ghost" id="x">✕</button>
      </div>
      <label class="field">Name</label>
      <input class="in" id="f-name" value="${esc(edit.name)}">
      <div class="row2">
        <div><label class="field">World</label>
          <select class="in" id="f-world">
            ${["modern", "historical", "both", "frame"].map((w) =>
              `<option ${edit.world === w ? "selected" : ""}>${w}</option>`).join("")}</select></div>
        <div><label class="field">Role</label>
          <input class="in" id="f-role" value="${esc(edit.role || "")}"></div>
      </div>
      <label class="field">Description</label>
      <textarea class="in" id="f-desc" rows="2">${esc(edit.description || "")}</textarea>

      <hr class="sep">
      <div class="row2">
        <div><label class="field">Voice mode</label>
          <select class="in" id="f-mode">
            <option value="design" ${edit.voice.mode === "design" ? "selected" : ""}>design (describe)</option>
            <option value="xvector" ${edit.voice.mode === "xvector" ? "selected" : ""}>vector (locked x-vector)</option>
            <option value="clone" ${edit.voice.mode === "clone" ? "selected" : ""}>clone (ref wav)</option>
          </select></div>
        <div><label class="field">Seed (changes the take)</label>
          <input class="in" id="f-seed" type="number" value="${esc(edit.voice.seed ?? 42)}"></div>
      </div>
      <div id="voiceMode"></div>
      <label class="field">Sample line</label>
      <textarea class="in" id="f-sample" rows="2">${esc(edit.voice.sample_text || "")}</textarea>
      <div class="btn-row" style="margin-top:8px">
        <button class="btn primary" id="save">Save</button>
        <button class="btn" id="genVoice">🔊 Generate voice</button>
        <button class="btn" id="genPortrait">🎨 Generate portrait</button>
        <span class="spacer" style="flex:1"></span>
        <button class="btn danger" id="del">Delete</button>
      </div>
      ${c.voice && c.voice.sample ? `<audio controls src="${bust(c.voice.sample)}"></audio>` : ""}
      ${c.portrait ? `<img class="sketch-preview" src="${bust(c.portrait)}">` : ""}`;
    $("#x", root).onclick = closeDrawer;
    paintMode();
    $("#f-name", root).oninput = (e) => { edit.name = e.target.value; queueSave(); };
    $("#f-world", root).onchange = (e) => { edit.world = e.target.value; queueSave(); };
    $("#f-role", root).oninput = (e) => { edit.role = e.target.value; queueSave(); };
    $("#f-desc", root).oninput = (e) => { edit.description = e.target.value; queueSave(); };
    $("#f-mode", root).onchange = (e) => { edit.voice.mode = e.target.value; queueSave(); paintMode(); };
    $("#f-seed", root).oninput = (e) => { edit.voice.seed = parseInt(e.target.value || "0"); queueSave(); };
    $("#f-sample", root).oninput = (e) => { edit.voice.sample_text = e.target.value; queueSave(); };
    $("#save", root).onclick = save;
    $("#del", root).onclick = del;
    $("#genVoice", root).onclick = () => gen("#genVoice", `/api/generate/voice/${c.id}`);
    $("#genPortrait", root).onclick = () => gen("#genPortrait", `/api/generate/portrait/${c.id}`);
  }
  function paintMode() {
    const m = $("#voiceMode", root);
    if (edit.voice.mode === "xvector") {
      m.innerHTML = `<p class="hint">Locked to saved x-vector: <code>${esc(edit.voice.vector || "(none — run Lock voices)")}</code>.
        New lines render in this exact voice. The description below is kept for provenance / re-deriving the vector.</p>
        <label class="field">Voice description (instruct, for reference)</label>
        <textarea class="in" id="f-inst" rows="3">${esc(edit.voice.instruct || "")}</textarea>`;
      $("#f-inst", root).oninput = (e) => { edit.voice.instruct = e.target.value; queueSave(); };
    } else if (edit.voice.mode === "clone") {
      m.innerHTML = `<label class="field">Reference wav (path on GPU host)</label>
        <input class="in" id="f-ref" value="${esc(edit.voice.ref_audio || "")}">
        <p class="hint">e.g. /path/on/host/ref.wav</p>`;
      $("#f-ref", root).oninput = (e) => { edit.voice.ref_audio = e.target.value; queueSave(); };
    } else {
      m.innerHTML = `<label class="field">Voice description (instruct)</label>
        <textarea class="in" id="f-inst" rows="4">${esc(edit.voice.instruct || "")}</textarea>`;
      $("#f-inst", root).oninput = (e) => { edit.voice.instruct = e.target.value; queueSave(); };
    }
  }

  // Autosave: a pause in typing, or closing the drawer, writes to
  // storyboard.yaml. The Save button stays, but nothing depends on it.
  let saveTimer = null;
  let dirty = false;
  const queueSave = () => {
    dirty = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(autosave, 700);
  };
  async function autosave() {
    clearTimeout(saveTimer);
    if (!dirty) return;
    dirty = false;
    try { await persist(); renderCast(); }
    catch (e) { dirty = true; toast(e.message, true); }
  }
  drawerFlush = autosave;

  async function persist() {
    const saved = await api("PUT", `/api/character/${c.id}`, edit);
    Object.assign(c, saved);
  }
  async function refresh() {
    SB = await api("GET", "/api/storyboard");
    Object.assign(c, SB.characters.find((x) => x.id === c.id));
    Object.assign(edit, JSON.parse(JSON.stringify(c)));
    edit.voice = edit.voice || {};
    paint();
  }
  async function save() {
    try { await persist(); renderCast(); toast("Saved."); }
    catch (e) { toast(e.message, true); }
  }
  async function del() {
    if (!confirm("Delete character?")) return;
    await api("DELETE", `/api/character/${c.id}`);
    closeDrawer(); await load();
  }
  async function gen(sel, path) {
    const btn = $(sel, root); btn.disabled = true; const orig = btn.innerHTML;
    btn.innerHTML = '<span class="spin"></span> working…';
    try { await persist(); await api("POST", path); await refresh(); toast("Done."); }
    catch (e) { toast(e.message, true); btn.disabled = false; btn.innerHTML = orig; }
  }
  paint();
}

// --------------------------------------------------------------------------
// PLAYER
// --------------------------------------------------------------------------
const Player = {
  beats: [], idx: 0, playing: false,
  audio: Playback.register(new Audio()),
  // The bed plays under the dialogue, not instead of it, so it keeps its own
  // tempo however fast the lines are running.
  music: (() => {
    const a = new Audio();
    a.loop = true;
    a.dataset.norate = "";
    return a;
  })(),
  _musicSrc: null,
  setMusic(b) {
    // Each beat carries its effective music src (scene bed, or a [MUSIC:] cue).
    const want = (b && b.music) || null;
    if (want === this._musicSrc) return;              // unchanged, keep playing
    this._musicSrc = want;
    this.music.pause();
    if (want && this.playing) {
      this.music.src = bust(want);
      this.music.volume = 0.16;
      this.music.play().catch(() => {});
    }
  },
  build(sceneIds) {
    const beats = [];
    sceneIds.forEach((sid) => {
      const s = SB.scenes.find((x) => x.id === sid);
      if (!s) return;
      // Effective music: the scene's bed until an inline [MUSIC:] cue changes it.
      let music = (s.music && s.music.audio) || null;
      const push = (o) => beats.push(Object.assign(
        { sid, sketch: s.sketch && s.sketch.image, music,
          title: `Scene ${s.display_number || s.number} — ${s.title}` }, o));
      if ((s.setting || "").trim()) {
        push({ speaker: "Narrator", text: s.setting, direction: "",
          audio: s.setting_audio, isDir: true });
      }
      if ((s.narration || "").trim()) {
        push({ speaker: "Narrator", text: s.narration, direction: "",
          audio: s.narration_audio });
      }
      (s.lines || []).forEach((l) => {
        if (l.music) music = l.music === "scene" ? (s.music && s.music.audio) || null : l.music;
        const spk = l.type === "direction" ? "" :
          (charById(l.speaker)?.name || l.speaker || "");
        push({ speaker: l.type === "direction" ? "STAGE" : spk,
          text: l.text, direction: l.direction || "", audio: l.audio,
          isDir: l.type === "direction", music });
      });
    });
    this.beats = beats; this.idx = 0;
  },
  start(sceneIds) {
    this.stop(); this.build(sceneIds); this.playing = true; this.play();
  },
  play() {
    if (this.idx >= this.beats.length) { this.playing = false; this.music.pause(); this.paint(); return; }
    const b = this.beats[this.idx];
    this.setMusic(b);
    this.paint();
    this.audio.pause();
    if (b.audio) {
      this.audio.src = bust(b.audio);
      this.audio.onended = () => { if (this.playing) { this.idx++; this.play(); } };
      this.audio.play().catch(() => this.hold(b));
    } else {
      this.hold(b);
    }
  },
  hold(b) {
    // No audio: hold the caption on screen for a readable beat.
    const ms = Math.max(1600, Math.min(7000, (b.text || "").length * 55));
    clearTimeout(this._t);
    if (this.playing) this._t = setTimeout(() => { this.idx++; this.play(); }, ms);
  },
  next() { clearTimeout(this._t); this.audio.pause(); if (this.idx < this.beats.length - 1) this.idx++; this.play(); },
  prev() { clearTimeout(this._t); this.audio.pause(); if (this.idx > 0) this.idx--; this.play(); },
  toggle() {
    this.playing = !this.playing;
    if (this.playing) { this._musicSrc = null; this.play(); }
    else { this.audio.pause(); this.music.pause(); clearTimeout(this._t); this.paint(); }
  },
  stop() { this.playing = false; this.audio.pause(); this.music.pause(); this._musicSrc = null; clearTimeout(this._t); },
  paint() {
    const b = this.beats[this.idx];
    const stage = $("#stage"); if (!stage) return;
    const img = $("#stageImg");
    img.style.backgroundImage = b && b.sketch ? `url('${bust(b.sketch)}')` : "none";
    $("#capSpeaker").textContent = b ? b.speaker : "";
    $("#capText").textContent = b ? (b.text || "") : "— end —";
    $("#capText").style.fontStyle = b && b.isDir ? "italic" : "normal";
    $("#capDir").textContent = b ? b.direction || "" : "";
    $("#playBtn").textContent = this.playing ? "⏸" : "▶";
    $("#sceneLabel").textContent = b ? b.title : "";
    document.querySelectorAll(".pl-item").forEach((el) =>
      el.classList.toggle("active", b && el.dataset.sid === b.sid));
  },
};

function renderPlayer() {
  const v = view();
  v.innerHTML = `
    <div class="player">
      <div class="playlist" id="playlist">
        <div class="pl-item" id="playAll"><b>▶ Play whole show</b><div class="n">all ${SB.scenes.length} scenes in order</div></div>
        <div class="pl-item" id="playModern"><b>▶ Play all Modern</b><div class="n">Liam's thread (modern + convergence)</div></div>
        <div class="pl-item" id="playHist"><b>▶ Play all Historical</b><div class="n">John's thread (historical + convergence)</div></div>
        ${SB.scenes.map((s) => `
          <div class="pl-item" data-sid="${s.id}">
            <div>${esc(s.title)}</div>
            <div class="n">SCENE ${esc(s.display_number || s.number)} · ${esc(s.world)}${(s.lines||[]).some(l=>l.audio)||s.narration_audio?" · ♪":""}</div>
          </div>`).join("")}
      </div>
      <div class="stage" id="stage">
        <div class="stage-img" id="stageImg"></div>
        <div class="caption-bar">
          <div class="caption-speaker" id="capSpeaker"></div>
          <div class="caption-text" id="capText">Pick a scene, or play the whole show.</div>
          <div class="caption-dir" id="capDir"></div>
        </div>
        <div class="transport">
          <button class="btn" id="prevBtn">⏮</button>
          <button class="btn primary big" id="playBtn">▶</button>
          <button class="btn" id="nextBtn">⏭</button>
          <button class="btn speed" data-speed-toggle type="button"></button>
          <span class="spacer" style="flex:1"></span>
          <span class="status" id="sceneLabel"></span>
        </div>
      </div>
    </div>`;
  const idsFor = (worlds) => SB.scenes.filter((s) => worlds.includes(s.world)).map((s) => s.id);
  $("#playAll").onclick = () => Player.start(SB.scenes.map((s) => s.id));
  $("#playModern").onclick = () => Player.start(idsFor(["modern", "both"]));
  $("#playHist").onclick = () => Player.start(idsFor(["historical", "both"]));
  document.querySelectorAll(".pl-item[data-sid]").forEach((el) =>
    (el.onclick = () => Player.start([el.dataset.sid])));
  $("#playBtn").onclick = () => { if (!Player.beats.length) Player.start(SB.scenes.map(s=>s.id)); else Player.toggle(); };
  $("#prevBtn").onclick = () => Player.prev();
  $("#nextBtn").onclick = () => Player.next();
}

// --------------------------------------------------------------------------
document.querySelectorAll(".tab").forEach((b) =>
  (b.onclick = () => { if (TAB === "player") Player.stop(); TAB = b.dataset.tab; render(); }));
load().catch((e) => toast("Load failed: " + e.message, true));
