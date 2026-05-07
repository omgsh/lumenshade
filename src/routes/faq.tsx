import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — LumenShade" },
      { name: "description", content: "Common questions about LumenShade smart dark mode." },
      { property: "og:title", content: "LumenShade FAQ" },
      { property: "og:description", content: "Answers to common questions." },
    ],
  }),
  component: Faq,
});

const qa = [
  { q: "Is LumenShade really free?", a: "Yes. No paywall, no trial. The extension is free now and forever." },
  { q: "Does LumenShade collect my browsing data?", a: "No. Everything runs locally in your browser. There's no telemetry, no analytics, and no account system." },
  { q: "Why not just use Chrome's built-in dark mode?", a: "Chrome's experimental dark mode flag is a global filter — it inverts colors crudely and breaks images. LumenShade rebuilds each page's palette intelligently." },
  { q: "Does it work on every site?", a: "It works on the vast majority of sites. Some heavily-styled web apps (Figma, Notion, etc.) already provide their own dark mode — for those, just disable LumenShade per-site with one click." },
  { q: "Will it slow down my browser?", a: "The content script is tiny (~18 KB) and runs once at page load plus debounced re-runs on DOM changes. You won't notice it." },
  { q: "Why OKLCH instead of HSL or LAB?", a: "OKLCH is perceptually uniform and was designed specifically for screen color manipulation. It produces results that look right to human eyes, not just mathematically correct." },
  { q: "Does it support Firefox?", a: "Not yet. Chromium first (Chrome, Edge, Brave, Arc, Opera). Firefox support is on the roadmap." },
];

function Faq() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">FAQ</div>
      <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95] text-balance">
        Questions, answered.
      </h1>

      <div className="mt-16 divide-y hairline border-y hairline">
        {qa.map((item) => (
          <details key={item.q} className="group py-6">
            <summary className="cursor-pointer font-display text-xl flex items-center justify-between gap-4 list-none">
              {item.q}
              <span className="text-amber text-2xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
