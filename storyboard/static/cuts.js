"use strict";

// The Big Hack — where the runtime can come from.
//
// The server measures every scene off the real clip durations and ranks them
// (/api/cuts/analysis); the notes under storyboard/cuts-notes/ were written
// against the script by hand and come back merged into that payload. This
// page shows both, and keeps the author's decisions (/api/cuts) so the
// projected runtime updates as trims are planned. Nothing here writes the
// script: every cue id is a link into the proofreading page instead.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => (s == null ? "" : String(s)).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const S = {
  a: null,                 // the analysis payload
  texts: {},               // cue id -> {speaker, text} from /api/storyboard, for hover titles
  cuts: { scenes: {} },    // the author's decisions
  sid: null,
  byRank: true,
  revision: null,
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
    throw new Error(msg);
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

const mins = (s) => `${(s / 60).toFixed(1)} min`;
const secs = (s) => `${Math.round(s)} s`;
const pct = (x) => `${Math.round(x * 100)}%`;
const scene = () => (S.a && S.a.scenes[S.sid]) || null;
const decisionOf = (sid) => S.cuts.scenes[sid] || { decision: "undecided", target: null, note: "", planned: [] };

// --------------------------------------------------------------------------
// The projection: what the show runs at if the decisions so far all happen
// --------------------------------------------------------------------------
function projectedScene(sid) {
  const m = S.a.scenes[sid];
  const d = decisionOf(sid);
  if (d.decision === "cut") return 0;
  if (d.decision === "trim" && d.target) return d.target * 60;
  const planned = new Set(d.planned || []);
  const saving = (m.notes ? m.notes.suggestions : [])
    .filter((s) => planned.has(s.id))
    .reduce((n, s) => n + s.stagedSavingSeconds, 0);
  return Math.max(0, m.staged_s - saving);
}

function projection() {
  let total = 0, decided = 0;
  S.a.order.forEach((sid) => {
    total += projectedScene(sid);
    const d = decisionOf(sid);
    if (d.decision !== "undecided" || (d.planned || []).length) decided++;
  });
  return { total, decided };
}

// --------------------------------------------------------------------------
// The figures across the top
// --------------------------------------------------------------------------
function paintStats() {
  const t = S.a.totals, tg = S.a.target;
  const p = projection();
  const stat = (k, v, cls) => `<span class="stat ${cls || ""}"><span class="k">${k}</span><span class="v">${v}</span></span>`;
  const over = t.staged_s > tg.high_s;
  $("#stats").innerHTML =
    stat("in the player", mins(t.player_s)) +
    stat("staged estimate", mins(t.staged_s), over ? "over" : "ok") +
    stat("target", `${tg.low_s / 60} to ${tg.high_s / 60} min`) +
    stat("to cut", t.to_cut_s > 0 ? mins(t.to_cut_s) : "none", t.to_cut_s > 0 ? "over" : "ok") +
    stat("notes would save", mins(t.notes_saving_s)) +
    stat(`if planned (${p.decided} decided)`, mins(p.total), p.total > tg.high_s ? "proj" : "ok");
}

// --------------------------------------------------------------------------
// The rail
// --------------------------------------------------------------------------
function paintRail() {
  const rail = $("#rail");
  rail.innerHTML = `
    <div class="rail-head">
      <span>${S.byRank ? "Best to cut first" : "The play"}</span>
      <span class="rank-toggle">
        <button class="${S.byRank ? "on" : ""}" data-rank="1">Ranked</button>
        <button class="${S.byRank ? "" : "on"}" data-rank="0">Script</button>
      </span>
    </div>`;
  $$(".rank-toggle button", rail).forEach((b) => (b.onclick = () => { S.byRank = b.dataset.rank === "1"; paintRail(); }));
  if (S.a.summary) {
    const el = document.createElement("div");
    el.className = "rail-item summary" + (S.sid === SUMMARY ? " here" : "");
    el.innerHTML = `<span class="n">Σ</span><span><span class="t">The whole show</span><span class="sub">plans, conflicts, loose ends</span></span><span class="min"></span>`;
    el.onclick = () => go(SUMMARY);
    rail.appendChild(el);
  }
  const list = S.byRank ? S.a.ranking : S.a.order;
  list.forEach((sid, i) => {
    const m = S.a.scenes[sid];
    const d = decisionOf(sid);
    const el = document.createElement("div");
    el.className = "rail-item" + (sid === S.sid ? " here" : "") + " d-" + d.decision;
    const badges = [];
    if (m.protected) badges.push(`<span class="badge protected">${m.protected.level}</span>`);
    if (m.author_cut) badges.push('<span class="badge cut">author cut</span>');
    if (m.notes && m.notes.stale) badges.push('<span class="badge stale">stale</span>');
    if (m.notes && !m.notes.stale) badges.push(`<span class="badge grade">${esc(m.notes.grade)}</span>`);
    if (d.decision !== "undecided") badges.push(`<span class="badge decision">${d.decision}</span>`);
    el.innerHTML = `
      <span class="n">${S.byRank ? i + 1 : esc(sid.replace(/^s0?/, ""))}</span>
      <span>
        <span class="t">${esc(m.title)}</span>
        <span class="sub">${badges.join("")}</span>
      </span>
      <span class="min"><b>${mins(m.staged_s)}</b>${m.rank_score ? "score " + m.rank_score : "held"}</span>`;
    el.onclick = () => go(sid);
    rail.appendChild(el);
  });
  const here = $(".rail-item.here");
  if (here) here.scrollIntoView({ block: "nearest" });
}

const SUMMARY = "_summary";

function go(sid) {
  if (sid !== SUMMARY && !S.a.scenes[sid]) return;
  S.sid = sid;
  history.replaceState(null, "", `?scene=${encodeURIComponent(sid)}`);
  render();
  $("#page").scrollTop = 0;
}

// --------------------------------------------------------------------------
// One scene
// --------------------------------------------------------------------------
function cueLink(sid, cid, gone) {
  const t = S.texts[cid];
  const title = t ? `${t.speaker ? t.speaker + ": " : ""}${t.text}`.slice(0, 220) : (gone ? "no longer in the script" : cid);
  if (gone) return `<span class="cue gone" title="${esc(title)}">${esc(cid)}</span>`;
  return `<a class="cue" href="/proof.html?scene=${encodeURIComponent(sid)}&line=${encodeURIComponent(cid)}" target="proof" title="${esc(title)}">${esc(cid)}</a>`;
}

function tile(k, v, s, cls) {
  return `<div class="tile ${cls || ""}"><div class="k">${k}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ""}</div>`;
}

function render() {
  if (S.sid === SUMMARY) return renderSummary();
  const m = scene();
  const page = $("#page");
  page.innerHTML = "";
  if (!m) { page.innerHTML = '<p class="empty">No scene selected.</p>'; return; }
  const rank = S.a.ranking.indexOf(S.sid) + 1;
  const d = decisionOf(S.sid);
  const n = m.notes;

  // head
  const head = document.createElement("div");
  head.className = "scene-head";
  const badges = [];
  if (m.protected) badges.push(`<span class="badge protected">protected · ${m.protected.level}</span>`);
  if (m.author_cut) badges.push('<span class="badge cut">cut in the author pass</span>');
  if (n) badges.push(`<span class="badge grade">${esc(n.grade)}</span>`);
  head.innerHTML = `
    <div class="scene-kicker">
      <span>Movement ${esc(m.movement || "?")}</span>
      <span>· rank ${rank} of ${S.a.ranking.length}</span>
      <span>· score ${m.rank_score}${m.rank_score !== m.score ? ` (${m.score} before protection)` : ""}</span>
      ${badges.join("")}
    </div>
    <h1 class="scene-title">${esc(m.title)}</h1>
    <div class="scene-sub">${m.cue_count} cues · ${m.spoken_count} spoken · ${m.stage_count} stage directions · <code>${esc(m.id)}</code></div>
    ${m.protected ? `<div class="callout protected">${esc(m.protected.text)}</div>` : ""}
    ${m.author_cut ? `<div class="callout cut">Listed as cut in the Author-Pass Reconciliation.${m.protected ? " It also carries a guardrail, so this needs a decision, not a ranking." : ""}</div>` : ""}
    ${n && n.stale ? `<div class="callout stale">These notes were written against an earlier text of this scene. Cue ids that no longer exist are struck through; the rest still apply until the notes are rewritten.</div>` : ""}`;
  page.appendChild(head);

  // metrics
  const sec = (title, html) => {
    const el = document.createElement("section");
    el.className = "section";
    el.innerHTML = `<h2>${title}</h2>${html}`;
    page.appendChild(el);
    return el;
  };
  const lg = m.longest;
  const stageLine = m.narrator_s > 0
    ? `player ${mins(m.player_s)}; ${mins(m.narrator_s)} of that is the narrator reading directions`
    : `player ${mins(m.player_s)}`;
  sec("How long it is", `<div class="metrics">
    ${tile("staged estimate", mins(m.staged_s), stageLine, "main")}
    ${tile("dialogue", mins(m.dialogue_s), `${m.words} words at ${m.wpm} wpm rendered`)}
    ${tile("live vs video", `${mins(m.planes.live.seconds)} / ${mins(m.planes.video.seconds)}`, `${m.planes.live.words} / ${m.planes.video.words} words`)}
    ${tile("longest speech", lg ? secs(lg.seconds) : "none", lg ? `${esc(nameOf(lg.speaker))}, ${lg.words} words ${cueLink(m.id, lg.cue)}` : "")}
    ${tile("top speaker", m.speakers.length ? pct(m.top_share) : "none", m.speakers.length ? esc(m.speakers[0].name) : "")}
    ${tile("short beats", m.short_beats, `${m.spoken_count ? pct(m.short_beats / m.spoken_count) : "0%"} of spoken beats, 3 words or fewer`)}
    ${tile("pauses written in", m.pauses + m.silent, `${secs(m.pause_s)} allowed`)}
    ${tile("wordless screen", secs(m.screen_s), m.screen_actions.length ? `${m.screen_actions.length} screen action${m.screen_actions.length > 1 ? "s" : ""}, ${secs(m.screen_actions.reduce((a, x) => a + x.seconds, 0))} in all` : "no screen actions")}
    ${tile("stage business", secs(m.business_s + m.allowance_s), `${m.stage_count} directions${m.allowance_s ? `, plus ${secs(m.allowance_s)} named wordless sequence` : ""}`)}
  </div>`);

  // speakers
  if (m.speakers.length) {
    const max = m.speakers[0].seconds || 1;
    sec("Who carries it", `<div class="speakers">${m.speakers.map((s) => `
      <div class="speaker p-${s.plane}">
        <span class="name">${esc(s.name)}<span class="pl">${s.plane}</span></span>
        <span class="bar-track"><span class="bar-fill" style="width:${(100 * s.seconds / max).toFixed(1)}%;display:block"></span></span>
        <span class="fig">${mins(s.seconds)} · ${s.words} words · ${pct(s.share)}</span>
      </div>`).join("")}</div>`);
  }

  // the beat strip
  const total = m.cues.reduce((a, c) => a + Math.max(c.seconds, c.counted === "stage" ? 1.5 : 0.5), 0) || 1;
  sec("The scene as time", `<div class="beatbar">${m.cues.map((c) => {
    const w = Math.max(c.seconds, c.counted === "stage" ? 1.5 : 0.5) / total * 100;
    const t = S.texts[c.id];
    const title = `${c.id} · ${c.counted}${c.speaker ? " · " + nameOf(c.speaker) : ""} · ${c.seconds}s${t ? "\n" + t.text.slice(0, 160) : ""}`;
    return `<div class="c-${c.counted}${c.kind === "live" ? " live" : ""}${c.long ? " long" : ""}" style="width:${w.toFixed(2)}%" title="${esc(title)}"></div>`;
  }).join("")}</div>
  <div class="legend">
    <span><i style="background:var(--accent)"></i>live dialogue</span>
    <span><i style="background:var(--accent-2)"></i>video dialogue</span>
    <span><i style="background:#3b4150"></i>narrator</span>
    <span><i style="background:var(--line)"></i>stage direction</span>
    <span><i style="outline:1px solid var(--danger);outline-offset:-1px"></i>long speech</span>
  </div>`);

  // reasons
  sec("Why it ranks here", m.reasons.length
    ? `<ul class="reasons">${m.reasons.map((r) => `
        <li class="k-${r.kind}"><span class="pts">${r.points ? "+" + r.points : ""}</span>
          <span>${esc(r.text)} ${(r.cueIds || []).map((c) => cueLink(m.id, c)).join("")}</span></li>`).join("")}</ul>`
    : '<p class="none">Nothing pushes this scene up the list.</p>');

  // the notes
  if (!n) {
    sec("Notes", '<p class="none">No notes written for this scene yet.</p>');
  } else {
    const f = n.function || {};
    sec("What the scene does", `<dl class="ledger">
      ${["plot", "liam", "others", "comedy", "spectacle"].map((k) => f[k] ? `<dt>${k}</dt><dd>${esc(f[k])}</dd>` : "").join("")}
      ${(f.setupPayoff || []).length ? `<dt>sets up / pays</dt><dd>${f.setupPayoff.map(esc).join(" · ")}</dd>` : ""}
      ${n.turnsAt ? `<dt>turns at</dt><dd>${cueLink(m.id, n.turnsAt)}</dd>` : ""}
      ${n.ifRemoved ? `<dt>if removed</dt><dd class="serif">${esc(n.ifRemoved)}</dd>` : ""}
      ${n.mergeInto ? `<dt>merge into</dt><dd>${esc(sceneTitle(n.mergeInto.sceneId))}${n.mergeInto.note ? ": " + esc(n.mergeInto.note) : ""} ${n.mergeInto.carry.map((c) => cueLink(m.id, c)).join("")}</dd>` : ""}
      ${n.protected && n.protected.yes && n.protected.why ? `<dt>protected</dt><dd>${esc(n.protected.why)}</dd>` : ""}
    </dl>`);

    const planned = new Set(d.planned || []);
    const el = sec(`Worth considering · ${n.suggestions.length} note${n.suggestions.length === 1 ? "" : "s"} · ${secs(n.recommendedSavingSeconds)} recommended together${n.allSavingSeconds > n.recommendedSavingSeconds ? `, ${secs(n.allSavingSeconds)} if every one is taken` : ""}`,
      n.suggestions.length ? `<div class="notes">${n.suggestions.map((s) => `
        <div class="note ${planned.has(s.id) ? "planned" : ""}" data-id="${esc(s.id)}">
          <input type="checkbox" title="Plan this trim" ${planned.has(s.id) ? "checked" : ""} />
          <div>
            <div class="head">
              <span class="kind k-${esc(s.kind)}">${esc(s.kind.replace("-", " "))}</span>
              ${s.cueIds.map((c) => cueLink(m.id, c)).join("")}
              ${s.missingCueIds.map((c) => cueLink(m.id, c, true)).join("")}
              ${s.stale ? '<span class="stale-mark">some cues have changed</span>' : ""}
            </div>
            <div class="text">${esc(s.note)}</div>
          </div>
          <div class="saving">${savingLabel(s)}</div>
        </div>`).join("")}</div>` : '<p class="none">No suggestions.</p>');
    $$(".note input", el).forEach((cb) => (cb.onclick = () => {
      const id = cb.closest(".note").dataset.id;
      const cur = new Set(decisionOf(S.sid).planned || []);
      cb.checked ? cur.add(id) : cur.delete(id);
      setDecision({ planned: Array.from(cur).sort() });
      cb.closest(".note").classList.toggle("planned", cb.checked);
      paintStats();
      paintDecisionLine();
    }));
  }

  // the decision
  const dec = sec("Decision", `<div class="decide">
    <label>what to do
      <select id="decision">
        ${["undecided", "keep", "trim", "cut"].map((k) => `<option value="${k}" ${d.decision === k ? "selected" : ""}>${k}</option>`).join("")}
      </select></label>
    <label>trim to (min)
      <input id="target" type="number" step="0.1" min="0" value="${d.target != null ? d.target : ""}" placeholder="${(m.staged_s / 60).toFixed(1)}" /></label>
    <label>note to self
      <textarea id="dnote" placeholder="what you decided and why">${esc(d.note || "")}</textarea></label>
    <div class="proj" id="projLine"></div>
  </div>`);
  $("#decision", dec).onchange = (e) => { setDecision({ decision: e.target.value }); afterDecision(); };
  $("#target", dec).oninput = (e) => { setDecision({ target: e.target.value === "" ? null : Number(e.target.value) }); afterDecision(); };
  $("#dnote", dec).oninput = (e) => setDecision({ note: e.target.value });
  paintDecisionLine();

  paintRail();
}

// "31 s" for dialogue; narrator seconds are shown but marked as player time,
// since the stage clock does not run on them.
function savingLabel(s) {
  const est = s.kind === "compress-speech" ? "estimated" : "measured";
  if (s.kind === "cut-scene") return `${secs(s.stagedSavingSeconds)}<small>whole scene, staged</small>`;
  if (!s.dialogueSeconds && s.narratorSeconds) return `${secs(s.narratorSeconds)}<small>narrator, player only</small>`;
  if (s.narratorSeconds) return `${secs(s.dialogueSeconds)}<small>${est}, plus ${secs(s.narratorSeconds)} narrator</small>`;
  return `${secs(s.dialogueSeconds)}<small>${est}</small>`;
}

// --------------------------------------------------------------------------
// The whole show: the reconciliation across scenes, with live totals
// --------------------------------------------------------------------------
function suggestionById(id) {
  for (const sid of S.a.order) {
    const n = S.a.scenes[sid].notes;
    const s = n && n.suggestions.find((x) => x.id === id);
    if (s) return { sid, s };
  }
  return null;
}

function planTotal(ids) {
  return ids.reduce((n, id) => { const f = suggestionById(id); return n + (f ? f.s.stagedSavingSeconds : 0); }, 0);
}

function planAll(ids) {
  ids.forEach((id) => {
    const f = suggestionById(id);
    if (!f) return;
    const cur = decisionOf(f.sid);
    const planned = new Set(cur.planned || []);
    planned.add(id);
    S.cuts.scenes[f.sid] = { ...cur, planned: Array.from(planned).sort() };
  });
  paintSaved("busy");
  clearTimeout(saveT);
  saveT = setTimeout(saveCuts, 500);
  paintStats();
  renderSummary();
}

function renderSummary() {
  const sm = S.a.summary;
  const page = $("#page");
  page.innerHTML = "";
  const t = S.a.totals, tg = S.a.target;
  const head = document.createElement("div");
  head.className = "scene-head";
  head.innerHTML = `
    <div class="scene-kicker"><span>The whole show</span><span>· written ${esc(sm.writtenAt || "")}</span></div>
    <h1 class="scene-title">Where the twenty minutes come from</h1>
    <div class="scene-sub">staged ${mins(t.staged_s)} now · target ${tg.low_s / 60} to ${tg.high_s / 60} · notes would save ${mins(t.notes_saving_s)} if every recommended trim were taken</div>
    ${sm.overview ? `<div class="callout">${esc(sm.overview)}</div>` : ""}`;
  page.appendChild(head);
  const sec = (title, html) => {
    const el = document.createElement("section");
    el.className = "section";
    el.innerHTML = `<h2>${title}</h2>${html}`;
    page.appendChild(el);
    return el;
  };
  Object.entries(sm.plans || {}).forEach(([key, p]) => {
    const ids = p.suggestionIds || [];
    const saving = planTotal(ids);
    const after = t.staged_s - saving;
    const byScene = {};
    ids.forEach((id) => { const f = suggestionById(id); if (f) (byScene[f.sid] = byScene[f.sid] || []).push(f.s); });
    const el = sec(`${esc(p.title)} · ${ids.length} notes · saves ${mins(saving)} · lands at ${mins(after)}`, `
      <div class="callout ${after <= tg.high_s ? "" : "cut"}">${esc(p.note || "")}</div>
      <div class="plan-scenes">${S.a.order.filter((sid) => byScene[sid]).map((sid) => `
        <div class="plan-scene"><b>${esc(S.a.scenes[sid].title)}</b> <span class="fig">${mins(byScene[sid].reduce((n, s) => n + s.stagedSavingSeconds, 0))}</span>
          <div>${byScene[sid].map((s) => `<a class="pill" href="?scene=${sid}" title="${esc(s.note)}">${esc(s.id)} <span class="kind">${esc(s.kind.replace("-", " "))}</span></a>`).join("")}</div></div>`).join("")}</div>
      <p><button class="btn" data-plan="${esc(key)}">Plan all of these</button> <span class="hint">ticks every note in this plan on its scene; the figure across the top follows</span></p>`);
    $("[data-plan]", el).onclick = () => planAll(ids);
    $$(".pill", el).forEach((a) => (a.onclick = (e) => { e.preventDefault(); go(a.getAttribute("href").split("=")[1]); }));
  });
  const list = (title, items) => items && items.length && sec(title, `<ul class="plain">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`);
  list("Conflicts the author has to settle", sm.conflicts);
  list("Continuity to fix while cutting", sm.continuity);
  list("Setups with nowhere to land", sm.orphans);
  if (sm.playerOnly) sec("Player time, not stage time", `<p class="plain-p">${esc(sm.playerOnly)}</p>`);
  if (S.a.notes_problems.length) sec("Problems in the notes files", `<div class="problems">${S.a.notes_problems.map((p) => `${esc(p.file)}: ${esc(p.message)}`).join("<br>")}</div>`);
  paintRail();
}

function afterDecision() { paintStats(); paintRail(); paintDecisionLine(); }

function paintDecisionLine() {
  const el = $("#projLine");
  if (!el) return;
  const m = scene();
  const p = projectedScene(S.sid);
  el.textContent = p === m.staged_s
    ? `Projected as measured: ${mins(m.staged_s)}.`
    : `Projected ${mins(p)} for this scene, ${mins(m.staged_s - p)} less than measured.`;
}

const nameOf = (id) => {
  for (const sid of S.a.order) {
    const s = (S.a.scenes[sid].speakers || []).find((x) => x.id === id);
    if (s) return s.name;
  }
  return id;
};
const sceneTitle = (sid) => (S.a.scenes[sid] ? `${S.a.scenes[sid].title} (${sid})` : sid);

// --------------------------------------------------------------------------
// Saving the decisions: the whole file, a moment after the last change
// --------------------------------------------------------------------------
let saveT = null;
function setDecision(patch) {
  const cur = decisionOf(S.sid);
  S.cuts.scenes[S.sid] = { ...cur, ...patch };
  paintSaved("busy");
  clearTimeout(saveT);
  saveT = setTimeout(saveCuts, 500);
}

async function saveCuts() {
  try {
    const r = await api("PUT", "/api/cuts", { scenes: S.cuts.scenes });
    S.cuts = r;
    paintSaved("ok");
  } catch (e) {
    paintSaved("err");
    toast("Couldn't save the decision: " + e.message, true);
  }
}

function paintSaved(state) {
  const el = $("#saved");
  el.className = "saved " + (state || "");
  el.textContent = state === "busy" ? "saving…" : state === "err" ? "not saved" : state === "ok" ? "saved" : "ready";
}

window.addEventListener("beforeunload", () => {
  if (!saveT) return;
  clearTimeout(saveT);
  navigator.sendBeacon && navigator.sendBeacon("/api/cuts", new Blob([JSON.stringify({ scenes: S.cuts.scenes })], { type: "application/json" }));
});

// --------------------------------------------------------------------------
// Loading, and re-measuring when the script moves
// --------------------------------------------------------------------------
async function load() {
  const [a, sb] = await Promise.all([api("GET", "/api/cuts/analysis"), api("GET", "/api/storyboard")]);
  S.a = a;
  S.revision = a.revision;
  S.texts = {};
  (sb.scenes || []).forEach((s) => (s.lines || []).forEach((l) => (S.texts[l.id] = { speaker: l.speaker, text: l.text || "" })));
}

async function pollRevision() {
  const ta = document.activeElement;
  if (ta && (ta.tagName === "TEXTAREA" || ta.tagName === "INPUT")) return;
  try {
    const r = await api("GET", "/api/revision");
    if (r.revision !== S.revision) {
      await load();
      render();
      toast("The script changed; re-measured.");
    }
  } catch (e) { /* the next poll will try again */ }
}

$("#refresh").onclick = async () => {
  try { await load(); render(); toast("Re-measured."); }
  catch (e) { toast(e.message, true); }
};

(async function boot() {
  try {
    const [, cuts] = await Promise.all([load(), api("GET", "/api/cuts").catch(() => ({ scenes: {} }))]);
    S.cuts = { scenes: cuts.scenes || {} };
    const want = new URLSearchParams(location.search).get("scene");
    S.sid = want === SUMMARY && S.a.summary ? SUMMARY : want && S.a.scenes[want] ? want : (S.a.summary ? SUMMARY : S.a.ranking[0]);
    paintStats();
    render();
    setInterval(pollRevision, 4000);
  } catch (e) {
    $("#page").innerHTML = `<p class="empty">Couldn't load the analysis: ${esc(e.message)}</p>`;
  }
})();
