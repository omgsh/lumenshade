import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How LumenShade works — OKLCH perceptual remapping" },
      { name: "description", content: "A step-by-step look at the smart color conversion algorithm behind LumenShade." },
      { property: "og:title", content: "How LumenShade works" },
      { property: "og:description", content: "Color science, not inversion. Here's the algorithm." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  { n: "01", t: "Walk the DOM", d: "On document_start, LumenShade scans every element and reads its computed color, background, border, fill, stroke, and shadows — including pseudo-elements." },
  { n: "02", t: "Parse to OKLCH", d: "Every color is converted from sRGB into OKLab, then OKLCH — a perceptually uniform color space designed to match how human vision actually perceives light." },
  { n: "03", t: "Classify by role", d: "Each color is tagged: page background, surface, primary text, muted text, border, brand accent, link, or media. Role determines treatment." },
  { n: "04", t: "Remap, don't invert", d: "Backgrounds get a deep warm dark (L≈0.16, low chroma). Text moves to soft paper (L≈0.94). Brand colors keep hue and chroma — only lightness shifts to land on the right side of legible." },
  { n: "05", t: "APCA contrast guard", d: "After remap, each text-on-background pair is scored using APCA (the algorithm replacing WCAG). If a pair fails, lightness is bumped until it passes." },
  { n: "06", t: "Dim, don't destroy media", d: "Images, videos, canvas, and iframes are excluded from color remapping. Instead, a soft brightness/contrast filter takes the harsh edge off — your photos still look like your photos." },
  { n: "07", t: "Pre-paint anti-flash", d: "A minimal background-color rule injects synchronously so the page never flashes white before remap finishes." },
  { n: "08", t: "Observe and adapt", d: "A debounced MutationObserver re-runs classification on dynamically added nodes — single-page apps stay consistent." },
];

function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">The Algorithm</div>
      <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95] text-balance">
        Eight steps from <em className="text-amber not-italic">white&nbsp;page</em> to night&nbsp;reading.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        No black box, no AI hand-waving. Just deterministic color math executed
        in milliseconds on every page you visit.
      </p>

      <div className="mt-20 grid gap-px bg-border rounded-2xl overflow-hidden border hairline">
        {steps.map((s) => (
          <div key={s.n} className="bg-background p-8 md:p-10 grid md:grid-cols-[120px_1fr] gap-6 hover:bg-card/50 transition-colors">
            <div className="font-mono text-amber text-sm">{s.n}</div>
            <div>
              <div className="font-display text-2xl">{s.t}</div>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 border hairline rounded-2xl p-8 md:p-10">
        <div className="font-display text-2xl mb-4">Why OKLCH and not HSL?</div>
        <p className="text-muted-foreground">
          HSL is mathematically convenient but perceptually broken — equal
          changes in lightness don't look equal to your eyes. A pure yellow at
          HSL lightness 50% looks far brighter than a pure blue at the same
          value. OKLCH was designed in 2020 by Björn Ottosson to fix this:
          equal L means equal perceived brightness, regardless of hue. That's
          why the same algorithm produces uniformly comfortable results across
          every color on every site.
        </p>
      </div>
    </div>
  );
}
