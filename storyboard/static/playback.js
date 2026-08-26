"use strict";

// Shared playback speed for every player in the app — the per-line buttons and
// scene queues on the Review page, the scene audition and the Play tab on the
// Storyboard page, and the bare <audio> controls scattered through both. One
// setting, remembered across pages and reloads: a read-through of the whole
// play is long, and nobody wants to set the speed once per scene.
//
// Drop `<button data-speed-toggle></button>` anywhere and it wires itself.
// Music beds opt out with `data-norate` — a score at double speed is a joke,
// and it plays under the dialogue rather than instead of it.
(function () {
  const KEY = "bh.playbackRate";
  const RATES = [1, 2];
  const detached = new Set();   // Audio() objects that never enter the DOM

  const stored = parseFloat(localStorage.getItem(KEY));
  let rate = RATES.includes(stored) ? stored : 1;

  const skip = (el) => !el || !el.dataset || el.dataset.norate !== undefined;
  const next = () => RATES[(RATES.indexOf(rate) + 1) % RATES.length];

  function applyAll() {
    detached.forEach((a) => { if (!skip(a)) a.playbackRate = rate; });
    document.querySelectorAll("audio").forEach((a) => {
      if (!skip(a)) a.playbackRate = rate;
    });
  }

  let painting = false;
  function paint() {
    if (painting) return;
    painting = true;
    requestAnimationFrame(() => {
      painting = false;
      document.querySelectorAll("[data-speed-toggle]").forEach((b) => {
        b.textContent = `${rate}×`;
        b.title = `Playback speed — click for ${next()}×`;
        b.classList.toggle("on", rate !== 1);
      });
    });
  }

  function set(r) {
    rate = r;
    try { localStorage.setItem(KEY, String(r)); } catch (e) { /* private mode */ }
    applyAll();
    paint();
  }

  // Whatever starts playing takes the current rate, however it was created —
  // including the <audio controls> tags built from HTML strings, which no
  // registry would ever hear about.
  document.addEventListener("play", (e) => {
    const a = e.target;
    if (a instanceof HTMLAudioElement && !skip(a)) a.playbackRate = rate;
  }, true);

  // Delegated, so a toggle rendered later still works. Stop the click here:
  // these buttons sit inside scene heads and playlist rows that treat a click
  // as "open me".
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-speed-toggle]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    set(next());
  });

  // Both pages re-render whole views, taking their toggles with them.
  new MutationObserver(paint).observe(document.documentElement, {
    childList: true, subtree: true,
  });

  window.Playback = {
    // Detached Audio() objects have to say hello; DOM ones are found by query.
    register(a) {
      detached.add(a);
      if (!skip(a)) a.playbackRate = rate;
      return a;
    },
    get rate() { return rate; },
  };

  paint();
})();
