const DEFAULTS = {
  enabled: true, brightness: 1, contrast: 1, warmth: 0.2, imageDim: 0.85,
  schedule: { mode: "always", from: "20:00", to: "07:00" }, sites: {},
};

const $ = (id) => document.getElementById(id);
let state = { ...DEFAULTS };
let host = "";

function fmt(v, p = 0) { return Math.round(v * 100) / 100 + ""; }
function pct(v) { return Math.round(v * 100) + "%"; }

function render() {
  $("enabled").checked = state.enabled;
  $("brightness").value = state.brightness; $("v-brightness").textContent = pct(state.brightness);
  $("contrast").value = state.contrast; $("v-contrast").textContent = pct(state.contrast);
  $("warmth").value = state.warmth; $("v-warmth").textContent = pct(state.warmth);
  $("imageDim").value = state.imageDim; $("v-imageDim").textContent = pct(state.imageDim);
  $("from").value = state.schedule.from;
  $("to").value = state.schedule.to;

  // schedule mode
  ["always", "schedule"].forEach((m) => $("m-" + m).classList.toggle("active", state.schedule.mode === m));
  $("time-row").classList.toggle("hidden", state.schedule.mode !== "schedule");

  // per-site
  const v = state.sites[host];
  $("site-default").classList.toggle("active", v === undefined);
  $("site-on").classList.toggle("active", v === true);
  $("site-off").classList.toggle("active", v === false);
  $("host").textContent = host || "(no site)";
}

function save(partial) {
  Object.assign(state, partial);
  chrome.storage.local.set(state);
}

async function init() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  try { host = new URL(tabs[0]?.url || "").hostname || ""; } catch { host = ""; }
  const data = await chrome.storage.local.get(null);
  state = Object.assign({}, DEFAULTS, data, { schedule: Object.assign({}, DEFAULTS.schedule, data.schedule || {}) });
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  $("enabled").addEventListener("change", (e) => { save({ enabled: e.target.checked }); });
  for (const id of ["brightness", "contrast", "warmth", "imageDim"]) {
    $(id).addEventListener("input", (e) => { state[id] = parseFloat(e.target.value); render(); });
    $(id).addEventListener("change", (e) => save({ [id]: parseFloat(e.target.value) }));
  }
  for (const m of ["always", "schedule"]) {
    $("m-" + m).addEventListener("click", () => { state.schedule.mode = m; save({ schedule: { ...state.schedule } }); render(); });
  }
  for (const k of ["from", "to"]) {
    $(k).addEventListener("change", (e) => { state.schedule[k] = e.target.value; save({ schedule: { ...state.schedule } }); });
  }
  for (const v of [["default", undefined], ["on", true], ["off", false]]) {
    $("site-" + v[0]).addEventListener("click", () => {
      if (!host) return;
      const sites = { ...state.sites };
      if (v[1] === undefined) delete sites[host];
      else sites[host] = v[1];
      save({ sites });
      render();
    });
  }
  $("reset").addEventListener("click", () => {
    chrome.storage.local.clear(() => chrome.storage.local.set(DEFAULTS, () => { state = { ...DEFAULTS }; render(); }));
  });
});
