// The Big Hack — storyboard SPA
let SB = null;
let TAB = "storyboard";

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

const bust = (p) => (p ? `${p.startsWith("/") ? p : "/artifacts/"+p}?t=${Date.now()}` : null);
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
      <h2>Storyboard</h2><span class="pill">${SB.scenes.length} scenes · shared with Stage</span>
      <span class="spacer"></span>
      <button class="btn" id="genAllAudio">🔊 Generate all audio</button>
      <button class="btn" id="genAllSketch">🎨 Generate missing sketches</button>
      <button class="btn" id="genAllMusic">🎵 Generate missing music</button>
      <a class="btn" href="/api/script/export">Export script</a>
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
    revision: SB.revision, title: "New Scene", world: "modern", status: "stub",
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
function closeDrawer() {
  if (drawerAudio) { drawerAudio.pause(); drawerAudio.onended = null; drawerAudio = null; }
  if (drawerMusic) { drawerMusic.pause(); drawerMusic = null; }
  document.querySelector(".drawer-backdrop")?.remove();
}

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
          <button class="btn ghost" id="x">✕</button>
        </div>
      </div>
      <label class="field">Title</label>
      <input class="in" id="f-title" value="${esc(edit.title)}">
      <div class="row2">
        <div><label class="field">Movement</label>
          <input class="in" id="f-movement" value="${esc(edit.movement || "")}"></div>
        <div><label class="field">Beat</label>
          <input class="in" id="f-beat" value="${esc(edit.beat || "")}"></div>
      </div>
      <div class="row2">
        <div><label class="field">World</label>
          <select class="in" id="f-world">
            ${["modern", "historical", "both", "frame"].map((w) =>
              `<option ${edit.world === w ? "selected" : ""}>${w}</option>`).join("")}
          </select></div>
        <div><label class="field">Status</label>
          <select class="in" id="f-status">
            ${["stub", "drafted", "revised", "locked"].map((w) =>
              `<option ${edit.status === w ? "selected" : ""}>${w}</option>`).join("")}
          </select></div>
      </div>
      <label class="field">Setting / staging</label>
      <textarea class="in" id="f-setting" rows="2">${esc(edit.productionSetting || "")}</textarea>

      <hr class="sep">
      <label class="field">Narrator framing (V.O.)</label>
      <textarea class="in" id="f-narration" rows="2">${esc(edit.narration || "")}</textarea>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn mini" id="genNarr">🔊 Generate narration</button>
      </div>
      ${scene.narration_audio ? `<audio controls src="${bust(scene.narration_audio)}"></audio>` : ""}

      <hr class="sep">
      <label class="field">Sketch prompt</label>
      <textarea class="in" id="f-sketch" rows="3">${esc(edit.sketch.prompt || "")}</textarea>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn mini" id="genSketch">🎨 Generate sketch</button>
      </div>
      ${scene.sketch && scene.sketch.image
        ? `<img class="sketch-preview" src="${bust(scene.sketch.image)}">` : ""}

      <hr class="sep">
      <label class="field">Background music prompt (period-accurate)</label>
      <textarea class="in" id="f-music" rows="2" placeholder="(blank = derive from this scene's world)">${esc(edit.music.prompt || "")}</textarea>
      <div class="btn-row" style="margin-top:6px">
        <button class="btn mini" id="genMusic">🎵 Generate music</button>
      </div>
      ${scene.music && scene.music.audio ? `<audio controls loop src="${bust(scene.music.audio)}"></audio>` : ""}

      <hr class="sep">
      <div class="btn-row" style="justify-content:space-between">
        <label class="field" style="margin:0">Lines</label>
        <button class="btn mini" id="addLine">+ line</button>
      </div>
      <div id="lines"></div>

      <hr class="sep">
      <div class="btn-row">
        <button class="btn primary" id="save">Save</button>
        <button class="btn" id="genAudio">🔊 Generate all scene audio</button>
        <span class="spacer" style="flex:1"></span>
        <button class="btn danger" id="del">Delete scene</button>
      </div>
      <p class="hint">Generation auto-saves the scene first, then renders on the GPU box / image API. This can take ~20–40s.</p>`;

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
    const dram = (drawerAudio = new Audio());
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
    $("#f-title", root).oninput = (e) => (edit.title = e.target.value);
    $("#f-movement", root).oninput = (e) => (edit.movement = e.target.value);
    $("#f-beat", root).oninput = (e) => (edit.beat = e.target.value);
    $("#f-world", root).onchange = (e) => (edit.world = e.target.value);
    $("#f-status", root).onchange = (e) => (edit.status = e.target.value);
    $("#f-setting", root).placeholder="Production notes only. Add spoken narration as a script line below.";
    $("#f-setting", root).oninput = (e) => (edit.productionSetting = e.target.value);
    $("#f-narration", root).disabled=true; $("#f-narration", root).placeholder="Add narrator lines in the script below.";
    $("#f-narration", root).oninput = (e) => (edit.narration = e.target.value);
    $("#f-sketch", root).oninput = (e) => (edit.sketch.prompt = e.target.value);
    $("#f-music", root).oninput = (e) => (edit.music.prompt = e.target.value);
    $("#genMusic", root).onclick = () => gen("#genMusic", `/api/generate/music/${scene.id}`);
    $("#addLine", root).onclick = () => {
      const n = edit.lines.length + 1;
      edit.lines.push({ id: "l" + n + "_" + Date.now().toString(36),
        type: "live", speaker: "", text: "", direction: "" });
      paintLines();
    };
    $("#save", root).onclick = saveScene;
    $("#del", root).onclick = delScene;
    $("#genNarr", root).onclick = () => gen("#genNarr", `/api/generate/narration/${scene.id}`);
    $("#genSketch", root).onclick = () => gen("#genSketch", `/api/generate/sketch/${scene.id}`);
    $("#genAudio", root).onclick = () => gen("#genAudio", `/api/generate/scene-audio/${scene.id}`, true);
  }

  function paintLines() {
    const wrap = $("#lines", root);
    wrap.innerHTML = "";
    const charOpts = (sel) => SB.characters.map((c) =>
      `<option value="${c.id}" ${sel === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("");
    edit.lines.forEach((ln, i) => {
      const saved = (scene.lines || []).find((l) => l.id === ln.id);
      const div = document.createElement("div");
      div.className = "line";
      div.innerHTML = `
        <div class="line-head">
          <select class="in mini type" style="width:auto">
            ${["live", "video", "narration", "direction"].map((t) =>
              `<option ${ln.type === t ? "selected" : ""}>${t}</option>`).join("")}
          </select>
          <select class="in mini spk" style="width:auto" ${ln.type === "direction" ? "disabled" : ""}>
            <option value="">— speaker —</option>${charOpts(ln.speaker)}
          </select>
          <span class="spacer" style="flex:1"></span><small>${esc(ln.id)} · ${esc(ln.audio_status||"")}</small>
          ${ln.type !== "direction" ? `<button class="btn mini regen">🔊</button>` : ""}
          <button class="btn mini danger rm">✕</button>
        </div>
        <textarea class="in txt" rows="2" placeholder="line text">${esc(ln.text)}</textarea>
        <input class="in dir mini" style="margin-top:6px" placeholder="(stage / video direction)" value="${esc(ln.direction || "")}">
        ${saved && saved.audio ? `<audio controls src="${bust(saved.audio)}"></audio>` : ""}`;
      $(".type", div).onchange = (e) => { ln.type = e.target.value; paintLines(); };
      $(".spk", div).onchange = (e) => (ln.speaker = e.target.value);
      $(".txt", div).oninput = (e) => (ln.text = e.target.value);
      $(".dir", div).oninput = (e) => (ln.direction = e.target.value);
      $(".rm", div).onclick = () => { edit.lines.splice(i, 1); paintLines(); };
      const rg = $(".regen", div);
      if (rg) rg.onclick = async () => {
        rg.disabled = true; rg.innerHTML = '<span class="spin"></span>';
        try {
          await persist();
          await api("POST", `/api/generate/line/${scene.id}/${ln.id}`);
          await refresh();
        } catch (e) { toast(e.message, true); rg.disabled = false; rg.textContent = "🔊"; }
      };
      if(ln.video){const film=document.createElement('video');film.controls=true;film.preload='metadata';film.src=bust(ln.video);film.style.width='100%';div.appendChild(film);}
      wrap.appendChild(div);
    });
  }

  async function persist() {
    const saved = await api("PUT", `/api/scene/${scene.id}`, edit);
    Object.assign(scene, saved);
    edit.revision=saved.revision; SB.revision=saved.revision;
    const idx = SB.scenes.findIndex((s) => s.id === scene.id);
    SB.scenes[idx] = scene;
  }
  async function refresh() {
    SB = await api("GET", "/api/storyboard");
    Object.assign(scene, SB.scenes.find((s) => s.id === scene.id));
    Object.assign(edit, JSON.parse(JSON.stringify(scene)));
    edit.sketch = edit.sketch || { prompt: "" };
    edit.lines = edit.lines || [];
    paint();
  }
  async function saveScene() {
    try { await persist(); renderStoryboard(); toast("Saved."); }
    catch (e) { toast(e.message, true); }
  }
  async function delScene() {
    if (!confirm("Delete this scene?")) return;
    await api("DELETE", `/api/scene/${scene.id}`, {revision:scene.revision});
    closeDrawer(); await load();
  }
  async function gen(btnSel, path, isBatch) {
    const btn = $(btnSel, root);
    btn.disabled = true; const orig = btn.innerHTML;
    btn.innerHTML = '<span class="spin"></span> working…';
    try {
      await persist();
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
            <option value="unconfigured" ${edit.voice.mode === "unconfigured" ? "selected" : ""}>existing recordings only (configure a voice)</option>
            <option value="approved_prompt" ${edit.voice.mode === "approved_prompt" ? "selected" : ""}>approved Mountain Man C</option>
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
    $("#f-name", root).oninput = (e) => (edit.name = e.target.value);
    $("#f-world", root).onchange = (e) => (edit.world = e.target.value);
    $("#f-role", root).oninput = (e) => (edit.role = e.target.value);
    $("#f-desc", root).oninput = (e) => (edit.description = e.target.value);
    $("#f-mode", root).onchange = (e) => { edit.voice.mode = e.target.value; paintMode(); };
    $("#f-seed", root).oninput = (e) => (edit.voice.seed = parseInt(e.target.value || "0"));
    $("#f-sample", root).oninput = (e) => (edit.voice.sample_text = e.target.value);
    $("#save", root).onclick = save;
    $("#del", root).onclick = del;
    $("#genVoice", root).onclick = () => gen("#genVoice", `/api/generate/voice/${c.id}`);
    $("#genPortrait", root).onclick = () => gen("#genPortrait", `/api/generate/portrait/${c.id}`);
  }
  function paintMode() {
    const m = $("#voiceMode", root);
    if(edit.voice.mode==='approved_prompt'){m.innerHTML='<p class="hint">Approved Mountain Man C acoustic reference and delivery settings. Existing and new narrator lines use this saved profile.</p>';return;}
    if(edit.voice.mode==='unconfigured'){m.innerHTML='<p class="hint">Existing recordings are ready to play. Select and configure a voice before generating new lines.</p>';return;}
    if (edit.voice.mode === "xvector") {
      m.innerHTML = `<p class="hint">Locked to saved x-vector: <code>${esc(edit.voice.vector || "(none — run Lock voices)")}</code>.
        New lines render in this exact voice. The description below is kept for provenance / re-deriving the vector.</p>
        <label class="field">Voice description (instruct, for reference)</label>
        <textarea class="in" id="f-inst" rows="3">${esc(edit.voice.instruct || "")}</textarea>`;
      $("#f-inst", root).oninput = (e) => (edit.voice.instruct = e.target.value);
    } else if (edit.voice.mode === "clone") {
      m.innerHTML = `<label class="field">Reference wav (path on GPU host)</label>
        <input class="in" id="f-ref" value="${esc(edit.voice.ref_audio || "")}">
        <p class="hint">e.g. /path/on/host/ref.wav</p>`;
      $("#f-ref", root).oninput = (e) => (edit.voice.ref_audio = e.target.value);
    } else {
      m.innerHTML = `<label class="field">Voice description (instruct)</label>
        <textarea class="in" id="f-inst" rows="4">${esc(edit.voice.instruct || "")}</textarea>`;
      $("#f-inst", root).oninput = (e) => (edit.voice.instruct = e.target.value);
    }
  }
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
  beats: [], idx: 0, playing: false, audio: new Audio(),
  music: Object.assign(new Audio(), { loop: true }), _musicSrc: null,
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

setInterval(async()=>{
 if(!SB || document.querySelector('.drawer') || document.querySelector('dialog[open]'))return;
 try {const next=await api('GET','/api/storyboard');if(next.revision!==SB.revision){
 if(document.querySelector('.drawer')){toast('The shared script changed. Reopen the scene before saving.');return;}
 SB=next; if(TAB==='storyboard')renderStoryboard();
 }}catch{}
},4000);
