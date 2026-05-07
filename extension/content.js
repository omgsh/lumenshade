// LumenShade content script — runs at document_start
(function () {
  "use strict";
  if (window.__lumenshade_loaded) return;
  window.__lumenshade_loaded = true;

  const STYLE_ID = "lumenshade-styles";
  const PRE_ID = "lumenshade-prepaint";
  const DEFAULTS = {
    enabled: true,
    brightness: 1,
    contrast: 1,
    warmth: 0.2,
    imageDim: 0.85,
    schedule: { mode: "always", from: "20:00", to: "07:00" },
    sites: {}, // { hostname: true(force-on) | false(force-off) }
  };

  function isScheduledOn(s) {
    if (!s.schedule || s.schedule.mode === "always") return true;
    if (s.schedule.mode === "never") return false;
    const [fh, fm] = s.schedule.from.split(":").map(Number);
    const [th, tm] = s.schedule.to.split(":").map(Number);
    const d = new Date();
    const cur = d.getHours() * 60 + d.getMinutes();
    const a = fh * 60 + fm, b = th * 60 + tm;
    return a < b ? cur >= a && cur < b : cur >= a || cur < b;
  }

  function shouldRun(settings) {
    const host = location.hostname;
    if (host in settings.sites) return settings.sites[host];
    if (!settings.enabled) return false;
    return isScheduledOn(settings);
  }

  // FOUC prevention — inject before anything paints
  function preventFlash() {
    if (document.getElementById(PRE_ID)) return;
    const s = document.createElement("style");
    s.id = PRE_ID;
    s.textContent = `html{background-color:#1a160e !important;}html,body,*:not(img):not(video):not(canvas):not(iframe):not(picture):not(svg *){color-scheme:dark}`;
    (document.head || document.documentElement).appendChild(s);
  }

  function buildStyles(settings) {
    const dim = settings.imageDim;
    // Base overrides — we use !important carefully.
    // Per-element overrides come from inline style attribute injection below.
    return `
html, body { background-color: #1a160e !important; color: #efe7d8 !important; }
body, body * {
  background-color: var(--ls-bg, inherit);
  color: var(--ls-fg, inherit);
  border-color: var(--ls-bd, inherit);
}
input, textarea, select {
  background-color: #221c12 !important;
  color: #efe7d8 !important;
  border-color: #3a3020 !important;
}
img, video, canvas, picture, iframe, embed, object, [style*="background-image"] {
  filter: brightness(${dim}) contrast(0.96) !important;
}
::selection { background: #e0a662 !important; color: #1a160e !important; }
[data-ls-skip], [data-ls-skip] * { all: revert !important; }
`;
  }

  function classifyAndRemap(settings) {
    const C = window.LumenColor;
    if (!C) return;
    const all = document.querySelectorAll("body *:not(script):not(style):not(noscript)");
    // Process in chunks to avoid jank
    const elements = [document.body, ...all];
    for (const el of elements) {
      if (!el || el.nodeType !== 1) continue;
      const cs = window.getComputedStyle(el);
      const bg = C.parseColor(cs.backgroundColor);
      const fg = C.parseColor(cs.color);
      const bd = C.parseColor(cs.borderColor || cs.borderTopColor);

      let changed = false;
      if (bg && bg.a > 0) {
        const n = C.remap(bg, settings);
        if (n) { el.style.setProperty("background-color", C.rgbaToString(n), "important"); changed = true; }
      }
      if (fg && fg.a > 0) {
        const n = C.remap(fg, settings);
        if (n) { el.style.setProperty("color", C.rgbaToString(n), "important"); changed = true; }
      }
      if (bd && bd.a > 0) {
        const n = C.remap(bd, settings);
        if (n) { el.style.setProperty("border-color", C.rgbaToString(n), "important"); changed = true; }
      }
      if (changed) el.setAttribute("data-ls", "1");
    }
  }

  function ensureStyle(css) {
    let s = document.getElementById(STYLE_ID);
    if (!s) {
      s = document.createElement("style");
      s.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(s);
    }
    s.textContent = css;
  }

  function removeStyles() {
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(PRE_ID)?.remove();
    document.querySelectorAll("[data-ls]").forEach((el) => {
      el.style.removeProperty("background-color");
      el.style.removeProperty("color");
      el.style.removeProperty("border-color");
      el.removeAttribute("data-ls");
    });
  }

  let observer = null;
  let debounceTimer = null;
  let currentSettings = null;

  function activate(settings) {
    currentSettings = settings;
    preventFlash();
    ensureStyle(buildStyles(settings));
    const run = () => {
      if (!document.body) return;
      classifyAndRemap(settings);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
    } else { run(); }

    if (!observer) {
      observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => classifyAndRemap(currentSettings), 200);
      });
      const start = () => {
        if (document.body) observer.observe(document.body, { childList: true, subtree: true });
        else setTimeout(start, 50);
      };
      start();
    }
  }

  function deactivate() {
    if (observer) { observer.disconnect(); observer = null; }
    removeStyles();
  }

  function apply(settings) {
    const merged = Object.assign({}, DEFAULTS, settings || {});
    if (shouldRun(merged)) activate(merged);
    else deactivate();
  }

  // Initial load: read settings & start
  chrome.storage.local.get(null, (data) => apply(data));

  // Listen for setting changes
  chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(null, (data) => {
      // Need a full reset before re-apply
      deactivate();
      apply(data);
    });
  });

  // Re-check schedule every minute
  setInterval(() => {
    chrome.storage.local.get(null, (data) => {
      const merged = Object.assign({}, DEFAULTS, data || {});
      const should = shouldRun(merged);
      const isOn = !!document.getElementById(STYLE_ID);
      if (should && !isOn) activate(merged);
      else if (!should && isOn) deactivate();
    });
  }, 60000);
})();
