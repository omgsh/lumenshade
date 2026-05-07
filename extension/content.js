// LumenShade content script — CSS-filter dark mode (no DOM walking, no flicker)
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
    sites: {},
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

  function preventFlash() {
    if (document.getElementById(PRE_ID)) return;
    const s = document.createElement("style");
    s.id = PRE_ID;
    // Paint a warm-dark backdrop immediately so users never see a white flash.
    s.textContent = `html{background:#1a160e !important;}`;
    (document.head || document.documentElement).appendChild(s);
  }

  // Filter-inversion engine.
  //   - invert(1) flips lightness on the whole page
  //   - hue-rotate(180) restores original hues (since invert also rotates them)
  //   - contrast/brightness tune readability
  //   - sepia + a small hue-rotate adds warmth
  //   - we re-invert media so photos/videos stay normal
  function buildStyles(settings) {
    const brightness = Math.max(0.4, Math.min(1.6, settings.brightness ?? 1));
    const contrast = Math.max(0.7, Math.min(1.4, settings.contrast ?? 1));
    const warmth = Math.max(0, Math.min(1, settings.warmth ?? 0.2));
    const dim = Math.max(0.4, Math.min(1, settings.imageDim ?? 0.85));

    // Sepia adds warmth; magnitude controlled by warmth slider.
    const sepia = (warmth * 0.35).toFixed(3);

    // Page-wide inversion. We target html so position:fixed elements invert too.
    // Re-invert media (img/video/picture/canvas/svg/iframe) so they look normal.
    return `
html {
  background: #1a160e !important;
  filter: invert(1) hue-rotate(180deg) brightness(${brightness}) contrast(${contrast}) sepia(${sepia}) !important;
}
/* Re-invert media so it isn't ghostly */
img, video, picture, canvas, svg, iframe, embed, object,
[style*="background-image"], [style*="background:url"], [style*="background: url"] {
  filter: invert(1) hue-rotate(180deg) brightness(${dim}) !important;
}
/* Don't double-invert media inside opted-out subtrees */
[data-ls-skip] img, [data-ls-skip] video, [data-ls-skip] picture,
[data-ls-skip] canvas, [data-ls-skip] svg, [data-ls-skip] iframe {
  filter: none !important;
}
[data-ls-skip] { filter: invert(1) hue-rotate(180deg) !important; }
::selection { background: #e0a662 !important; color: #1a160e !important; }
`;
  }

  function ensureStyle(css) {
    let s = document.getElementById(STYLE_ID);
    if (!s) {
      s = document.createElement("style");
      s.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(s);
    }
    if (s.textContent !== css) s.textContent = css;
  }

  function removeStyles() {
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(PRE_ID)?.remove();
  }

  function activate(settings) {
    preventFlash();
    ensureStyle(buildStyles(settings));
  }

  function deactivate() {
    removeStyles();
  }

  function apply(settings) {
    const merged = Object.assign({}, DEFAULTS, settings || {});
    if (shouldRun(merged)) activate(merged);
    else deactivate();
  }

  chrome.storage.local.get(null, (data) => apply(data));

  chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(null, (data) => apply(data));
  });

  // Re-evaluate schedule once a minute.
  setInterval(() => {
    chrome.storage.local.get(null, (data) => apply(data));
  }, 60000);
})();
