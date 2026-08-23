"use strict";

// In-app Scene Review page. Talks to the storyboard server's /api/review/*
// endpoints (git-backed diff of two refs, or a ref vs the live working tree).

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) =>
  (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// --------------------------------------------------------------------------- //
// audio: one shared player, optional queue
// --------------------------------------------------------------------------- //
const player = new Audio();
let activeBtn = null;
let queue = [];
let queueIdx = 0;

function setPlaying(btn, label) {
  if (activeBtn) activeBtn.classList.remove("playing");
  activeBtn = btn || null;
  if (activeBtn) activeBtn.classList.add("playing");
  const np = $("#nowplaying");
  if (label) {
    $("#npLabel").textContent = label;
    np.classList.remove("hidden");
  } else {
    np.classList.add("hidden");
  }
}

function stopAudio() {
  queue = [];
  queueIdx = 0;
  player.pause();
  player.onended = null;
  setPlaying(null, null);
}

// `offset` is how many items of the original sequence were skipped, so a queue
// started midway through a scene still counts against the whole scene.
function playQueue(items, label, offset = 0) {
  stopAudio();
  queue = items.filter((x) => x && x.url);
  if (!queue.length) return;
  queueIdx = 0;
  const total = offset + queue.length;
  const step = () => {
    if (queueIdx >= queue.length) {
      setPlaying(null, null);
      return;
    }
    const it = queue[queueIdx];
    player.src = it.url;
    player.onended = () => {
      queueIdx++;
      step();
    };
    player.play().catch(() => {
      queueIdx++;
      step();
    });
    const who = it.label ? ` · ${it.label}` : "";
    setPlaying(it.btn || null, `${label}${who} — ${offset + queueIdx + 1}/${total}`);
  };
  step();
}

// Clicking one line's ▶ plays that line and keeps going to the end of the
// scene, so you can start a read-through partway in.
function playFrom(seq, idx, label) {
  playQueue(seq.slice(idx), label, idx);
}

$("#npStop").addEventListener("click", stopAudio);

// --------------------------------------------------------------------------- //
// url state
// --------------------------------------------------------------------------- //
// The comparison lives in the query string (`?before=…&after=…`) so a review is
// a link you can paste to somebody: they open it and see the same diff, without
// touching the dropdowns. The two view toggles ride along, omitted when off so
// the common URL stays short.
function readParams() {
  const q = new URLSearchParams(location.search);
  return {
    before: q.get("before") || "",
    after: q.get("after") || "",
    unchanged: q.get("unchanged") === "1",
    equalLines: q.get("equal") === "1",
  };
}

// `replaceState`, not `push` — toggling a checkbox shouldn't stack up history
// entries you then have to back out of one at a time.
function writeParams() {
  const q = new URLSearchParams();
  q.set("before", $("#before").value);
  q.set("after", $("#after").value);
  if ($("#showUnchanged").checked) q.set("unchanged", "1");
  if ($("#showEqualLines").checked) q.set("equal", "1");
  history.replaceState(null, "", `${location.pathname}?${q}`);
}

// A ref from the URL may not be in the dropdown — a sha, a branch that's since
// been deleted, or `working` on the before side. The API takes any rev git
// takes, so add it as an option rather than silently falling back to a default
// and showing a diff the link didn't ask for.
function ensureOption(sel, value, label) {
  if (!value) return;
  if ([...sel.options].some((o) => o.value === value)) return;
  const opt = el("option");
  opt.value = value;
  opt.textContent = label || value;
  sel.appendChild(opt);
}

// --------------------------------------------------------------------------- //
// data
// --------------------------------------------------------------------------- //
async function loadRefs() {
  const r = await fetch("/api/review/refs").then((x) => x.json());
  if (r.error || r.detail) {
    $("#status").textContent = `Review unavailable: ${r.error || r.detail}`;
    return false;
  }
  const before = $("#before");
  const after = $("#after");
  const opts = (sel, extra) => {
    sel.innerHTML = "";
    extra.forEach((o) => {
      const opt = el("option");
      opt.value = o.value;
      opt.textContent = o.label;
      sel.appendChild(opt);
    });
    r.refs.forEach((ref) => {
      const opt = el("option");
      opt.value = ref;
      opt.textContent = ref;
      sel.appendChild(opt);
    });
  };
  opts(before, []);
  opts(after, [{ value: r.working, label: "working tree (uncommitted)" }]);

  const p = readParams();
  const workingLabel = "working tree (uncommitted)";
  ensureOption(before, p.before, p.before === r.working ? workingLabel : null);
  ensureOption(after, p.after, p.after === r.working ? workingLabel : null);
  before.value = p.before || (r.refs.includes("main") ? "main" : r.current || r.refs[0]);
  after.value = p.after || r.working;
  $("#showUnchanged").checked = p.unchanged;
  $("#showEqualLines").checked = p.equalLines;
  return true;
}

async function compare() {
  const before = $("#before").value;
  const after = $("#after").value;
  if (!before || !after) return;
  writeParams();
  $("#status").textContent = `Comparing ${before} → ${after} … (reading git)`;
  $("#results").innerHTML = "";
  try {
    const res = await fetch(
      `/api/review/diff?before=${encodeURIComponent(before)}&after=${encodeURIComponent(after)}`
    );
    const data = await res.json();
    if (data.error || data.detail) throw new Error(data.error || data.detail);
    render(data);
  } catch (e) {
    $("#status").textContent = `Error: ${e.message}`;
  }
}

// --------------------------------------------------------------------------- //
// render
// --------------------------------------------------------------------------- //
function render(data) {
  const showUnchanged = $("#showUnchanged").checked;
  const scenes = data.scenes.filter(
    (s) => showUnchanged || s.status !== "unchanged"
  );
  const counts = data.scenes.reduce((a, s) => ((a[s.status] = (a[s.status] || 0) + 1), a), {});
  $("#status").textContent =
    `${data.before} → ${data.after}   ·   ` +
    ["added", "removed", "modified", "unchanged"]
      .map((k) => `${counts[k] || 0} ${k}`)
      .join("  ·  ");

  const root = $("#results");
  root.innerHTML = "";
  if (!scenes.length) {
    root.appendChild(el("div", "status", "No changed scenes."));
    return;
  }
  scenes.forEach((s) => root.appendChild(sceneCard(s)));
}

function sceneCard(s) {
  const card = el("div", `scene ${s.status}`);
  if (s.status !== "unchanged") card.classList.add("open");

  const title = esc(s.title_after || s.title_before || "");
  const body = el("div", "scene-body");

  // Per-side playback sequences, filled in row order as the cells are built.
  const seqs = {
    before: [], after: [], changedAfter: [],
    labelBefore: `${s.id} before`, labelAfter: `${s.id} after`,
  };

  if (s.title_before != null && s.title_after != null && s.title_before !== s.title_after) {
    body.appendChild(
      el("div", "meta-diff", `<h4>title</h4><div class="setting-cols">` +
        `<div class="col">${esc(s.title_before)}</div>` +
        `<div class="col">${esc(s.title_after)}</div></div>`)
    );
  }

  if (s.sketch && (s.sketch.before || s.sketch.after)) {
    const wrap = el("div", "meta-diff");
    wrap.appendChild(el("h4", null, "sketch" + (s.sketch.changed ? " (changed)" : "")));
    const figs = el("div", "sketches");
    if (s.sketch.before)
      figs.appendChild(el("figure", null, `<img src="${s.sketch.before}"><figcaption>before</figcaption>`));
    if (s.sketch.after)
      figs.appendChild(el("figure", null, `<img src="${s.sketch.after}"><figcaption>after</figcaption>`));
    wrap.appendChild(figs);
    body.appendChild(wrap);
  }

  if (s.setting && s.setting.changed && (s.setting.before || s.setting.after)) {
    body.appendChild(
      el("div", "meta-diff", `<h4>setting narration</h4><div class="setting-cols">` +
        `<div class="col">${esc(s.setting.before) || "<em>—</em>"}</div>` +
        `<div class="col">${esc(s.setting.after) || "<em>—</em>"}</div></div>`)
    );
  }

  const rowsWrap = el("div", "rows");
  rowsWrap.appendChild(
    el("div", "colhead", `<div>before · ${esc(s.title_before || "—")}</div><div>after · ${esc(s.title_after || "—")}</div>`)
  );
  s.rows.forEach((r) => rowsWrap.appendChild(rowEl(r, seqs)));
  body.appendChild(rowsWrap);

  // Head is built last so its buttons can share the sequences the rows filled.
  const head = el("div", "scene-head");
  head.innerHTML =
    `<span class="badge ${s.status}">${s.status}</span>` +
    `<span class="sid">${s.id}</span>` +
    `<span class="stitle">${title}</span>` +
    (s.n_changed ? `<span class="nchg">${s.n_changed} line${s.n_changed > 1 ? "s" : ""} changed</span>` : "") +
    `<span class="spacer"></span>`;

  const actions = el("div", "scene-actions");
  if (seqs.changedAfter.length) {
    const b = el("button", null, `▶ changed (${seqs.changedAfter.length})`);
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      playQueue(seqs.changedAfter, `${s.id} changed`);
    });
    actions.appendChild(b);
  }
  const side = s.status === "removed" ? "before" : "after";
  const allSide = seqs[side];
  if (allSide.length) {
    const b = el("button", null, `▶ all ${side} (${allSide.length})`);
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      playQueue(allSide, `${s.id} ${side}`);
    });
    actions.appendChild(b);
  }
  head.appendChild(actions);
  head.appendChild(el("span", "caret", "▶"));
  head.addEventListener("click", () => card.classList.toggle("open"));

  card.appendChild(head);
  card.appendChild(body);
  return card;
}

function wordHtml(words, sideKey) {
  if (!words) return null;
  return words
    .map((w) => {
      if (w.op === "equal") return esc(w.a);
      if (sideKey === "a") {
        if (w.op === "delete" || w.op === "replace") return `<span class="w-del">${esc(w.a)}</span>`;
        return "";
      } else {
        if (w.op === "insert" || w.op === "replace") return `<span class="w-ins">${esc(w.b)}</span>`;
        return "";
      }
    })
    .join("");
}

// `seq` is the running list of playable clips for this side of this scene, in
// row order. Each play button records its own index in it so a click can queue
// itself plus everything after it.
function cellEl(line, sideClass, words, sideKey, seq, seqLabel) {
  const cell = el("div", `cell ${sideClass}`);
  if (!line) {
    cell.classList.add("empty");
    return cell;
  }
  const isDir = line.type === "direction" || !line.label;
  const who = el("div", "who" + (isDir ? " dir" : ""));
  who.textContent = isDir ? (line.type === "direction" ? "STAGE" : "") : (line.label || "").toUpperCase();
  if (who.textContent) cell.appendChild(who);
  if (line.direction) cell.appendChild(el("div", "dir", esc(line.direction)));
  const txtHtml = words ? wordHtml(words, sideKey) : esc(line.text);
  if (line.text || txtHtml) cell.appendChild(el("div", "txt", txtHtml || esc(line.text)));
  if (line.music) cell.appendChild(el("div", "cue", `♪ ${esc(line.music)}`));
  if (line.audio) {
    const btn = el("button", "play", "▶");
    const idx = seq.length;
    seq.push({ url: line.audio, btn, label: (line.label || "line").toUpperCase() });
    btn.addEventListener("click", () => playFrom(seq, idx, seqLabel));
    cell.appendChild(btn);
  } else if (line.text) {
    cell.appendChild(el("div", "noaudio", "no audio"));
  }
  return cell;
}

function rowEl(r, seqs) {
  const row = el("div", `row ${r.type}`);
  if (r.type === "equal" && !$("#showEqualLines").checked) row.classList.add("hide");
  row.appendChild(cellEl(r.before, "before", r.words, "a", seqs.before, seqs.labelBefore));
  const nAfter = seqs.after.length;
  row.appendChild(cellEl(r.after, "after", r.words, "b", seqs.after, seqs.labelAfter));
  if ((r.type === "added" || r.type === "modified") && seqs.after.length > nAfter) {
    seqs.changedAfter.push(seqs.after[seqs.after.length - 1]);
  }
  return row;
}

// --------------------------------------------------------------------------- //
// collapsible options (mobile only — the CSS rule is inside a media query, so
// leaving the class on at desktop width is harmless)
// --------------------------------------------------------------------------- //
const MENU_KEY = "review.menuCollapsed";
const isNarrow = () => window.matchMedia("(max-width: 760px)").matches;

function setMenu(collapsed) {
  $("#topbar").classList.toggle("collapsed", collapsed);
  const btn = $("#menuToggle");
  btn.setAttribute("aria-expanded", String(!collapsed));
  btn.textContent = collapsed ? "☰ Options" : "✕ Options";
  try {
    localStorage.setItem(MENU_KEY, collapsed ? "1" : "0");
  } catch (e) {
    /* private mode — the toggle still works, it just won't persist */
  }
}

$("#menuToggle").addEventListener("click", () =>
  setMenu(!$("#topbar").classList.contains("collapsed"))
);

// Default to collapsed: the common case is the default comparison, and the
// status line already says which one it is.
let startCollapsed = true;
try {
  startCollapsed = localStorage.getItem(MENU_KEY) !== "0";
} catch (e) { /* ignore */ }
setMenu(startCollapsed);

// --------------------------------------------------------------------------- //
// wiring
// --------------------------------------------------------------------------- //
$("#compare").addEventListener("click", async () => {
  await compare();
  if (isNarrow()) setMenu(true);   // get out of the way once you've asked for it
});
$("#showUnchanged").addEventListener("change", () => compare());
$("#showEqualLines").addEventListener("change", () => {
  document.querySelectorAll(".row.equal").forEach((r) =>
    r.classList.toggle("hide", !$("#showEqualLines").checked)
  );
  writeParams();
});

loadRefs().then((ok) => { if (ok) compare(); });
