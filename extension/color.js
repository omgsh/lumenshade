// LumenShade color science — sRGB <-> linear <-> OKLab <-> OKLCH
// Plus a smart remap that preserves hue/chroma and remaps lightness.
(function (global) {
  "use strict";

  function srgbToLinear(c) {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function linearToSrgb(c) {
    const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(v * 255)));
  }

  function rgbToOklab(r, g, b) {
    const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
    const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
    return {
      L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
      a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
      b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    };
  }
  function oklabToRgb(L, a, b) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const lr = l_ * l_ * l_, mr = m_ * m_ * m_, sr = s_ * s_ * s_;
    const r = +4.0767416621 * lr - 3.3077115913 * mr + 0.2309699292 * sr;
    const g = -1.2684380046 * lr + 2.6097574011 * mr - 0.3413193965 * sr;
    const bl = -0.0041960863 * lr - 0.7034186147 * mr + 1.7076147010 * sr;
    return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(bl)];
  }

  function rgbToOklch(r, g, b) {
    const lab = rgbToOklab(r, g, b);
    const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
    if (h < 0) h += 360;
    return { L: lab.L, C, h };
  }
  function oklchToRgb(L, C, h) {
    const rad = (h * Math.PI) / 180;
    return oklabToRgb(L, Math.cos(rad) * C, Math.sin(rad) * C);
  }

  // Parse common CSS color formats. Returns {r,g,b,a} or null.
  // Uses a hidden canvas as a fallback parser for named/keyword colors.
  let _ctx = null;
  function getCtx() {
    if (_ctx) return _ctx;
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      _ctx = c.getContext("2d", { willReadFrequently: true });
    } catch (e) { _ctx = null; }
    return _ctx;
  }
  function parseColor(str) {
    if (!str || typeof str !== "string") return null;
    str = str.trim();
    if (str === "transparent" || str === "none") return null;
    // rgb/rgba
    let m = str.match(/^rgba?\(\s*([0-9.]+)[ ,]+([0-9.]+)[ ,]+([0-9.]+)(?:[ ,/]+([0-9.]+%?))?\s*\)$/i);
    if (m) {
      const a = m[4] == null ? 1 : (m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
      return { r: +m[1], g: +m[2], b: +m[3], a };
    }
    // hex
    if (str[0] === "#") {
      let h = str.slice(1);
      if (h.length === 3) h = h.split("").map(c => c + c).join("");
      if (h.length === 6 || h.length === 8) {
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
        return { r, g, b, a };
      }
    }
    // Fallback via canvas (handles hsl, named, oklch, etc)
    const ctx = getCtx();
    if (!ctx) return null;
    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = str;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    } catch (e) { return null; }
  }

  // APCA-lite: simplified perceptual contrast estimate (0..1, higher = more contrast)
  // Not full APCA but close enough for guard-rail decisions.
  function lightnessContrast(L1, L2) {
    return Math.abs(L1 - L2);
  }

  // Smart remap a single color for dark mode.
  // settings: { brightness, contrast, warmth, enabled }
  // role: "bg" | "text" | "border" | "auto"
  function remap(rgba, settings) {
    if (!rgba) return null;
    if (rgba.a === 0) return rgba;
    const { L, C, h } = rgbToOklch(rgba.r, rgba.g, rgba.b);
    const brightness = settings.brightness ?? 1;
    const contrast = settings.contrast ?? 1;
    const warmth = settings.warmth ?? 0; // 0..1, shifts hue toward 70 (amber)

    // Lightness flip with curve
    // map original L (0..1) -> new L using a soft mirror around 0.5
    let newL = 1 - L;
    // compress range: dark side becomes a warm dark, light side becomes paper
    if (newL < 0.5) {
      // was light -> goes to dark surface
      newL = 0.10 + newL * 0.30; // 0.10..0.25
    } else {
      // was dark -> goes to light text
      newL = 0.78 + (newL - 0.5) * 0.36; // 0.78..0.96
    }
    newL *= brightness;
    // Apply contrast around mid 0.5
    newL = 0.5 + (newL - 0.5) * contrast;
    newL = Math.max(0.03, Math.min(0.99, newL));

    // Chroma: dampen on backgrounds (low original C), keep on accents (high C)
    let newC = C;
    if (C < 0.04) newC = C * 0.5; // near-greys dampen
    else newC = C * 0.85;          // accents slightly softened

    // Warmth: shift hue toward 70 (warm amber)
    let newH = h;
    if (warmth > 0) {
      const target = 70;
      let diff = ((target - h + 540) % 360) - 180;
      newH = (h + diff * warmth * 0.4 + 360) % 360;
    }

    const [r, g, b] = oklchToRgb(newL, newC, newH);
    return { r, g, b, a: rgba.a };
  }

  function rgbaToString(c) {
    if (!c) return "";
    return c.a < 1
      ? `rgba(${c.r}, ${c.g}, ${c.b}, ${+c.a.toFixed(3)})`
      : `rgb(${c.r}, ${c.g}, ${c.b})`;
  }

  global.LumenColor = {
    parseColor, rgbToOklch, oklchToRgb, remap, rgbaToString, lightnessContrast,
  };
})(typeof window !== "undefined" ? window : globalThis);
