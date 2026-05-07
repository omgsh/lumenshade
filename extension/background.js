// LumenShade background service worker
const DEFAULTS = {
  enabled: true,
  brightness: 1,
  contrast: 1,
  warmth: 0.2,
  imageDim: 0.85,
  schedule: { mode: "always", from: "20:00", to: "07:00" },
  sites: {},
};

chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.local.get(null);
  const merged = Object.assign({}, DEFAULTS, cur);
  await chrome.storage.local.set(merged);
  chrome.alarms.create("ls-tick", { periodInMinutes: 1 });
  updateBadge(merged.enabled);
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("ls-tick", { periodInMinutes: 1 });
});

chrome.storage.onChanged.addListener(async () => {
  const s = await chrome.storage.local.get(["enabled"]);
  updateBadge(s.enabled !== false);
});

function updateBadge(on) {
  chrome.action.setBadgeText({ text: on ? "ON" : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#e0a662" });
}

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name !== "ls-tick") return;
  // schedule check is handled inside content scripts
});
