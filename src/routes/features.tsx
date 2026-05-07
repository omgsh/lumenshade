import { createFileRoute } from "@tanstack/react-router";
import { Clock, Globe, Image, Sliders, Sun, ToggleLeft } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — LumenShade" },
      { name: "description", content: "Per-site control, schedule, sliders for brightness/contrast/warmth, and image dimming." },
      { property: "og:title", content: "LumenShade features" },
      { property: "og:description", content: "Everything you need to make the web comfortable to read at night." },
    ],
  }),
  component: Features,
});

const features = [
  { icon: ToggleLeft, t: "Per-site toggle", d: "One click to disable LumenShade on the current domain. Your preference is remembered forever." },
  { icon: Globe, t: "Smart whitelist", d: "Manage your enabled and disabled sites in one tidy list. Wildcard subdomains supported." },
  { icon: Sliders, t: "Brightness, contrast, warmth", d: "Three sliders for fine-tuning. Warmth shifts the palette toward amber for late-night sessions." },
  { icon: Image, t: "Image dimming slider", d: "Photos stay photos. A soft brightness filter you can crank down to 50% on harsh hero images." },
  { icon: Clock, t: "Schedule", d: "Auto-enable from sunset to sunrise (using your location) or set fixed hours." },
  { icon: Sun, t: "Quick toggle", d: "Keyboard shortcut (Alt+Shift+D) to flip dark mode on or off instantly." },
];

function Features() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">Features</div>
      <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95] text-balance">
        Power without the bloat.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Every control was added because we needed it. Nothing is here to pad a feature list.
      </p>

      <div className="mt-16 grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border hairline">
        {features.map(({ icon: Icon, t, d }) => (
          <div key={t} className="bg-background p-8 hover:bg-card/50 transition-colors">
            <Icon className="h-6 w-6 text-amber" />
            <div className="font-display text-2xl mt-4">{t}</div>
            <p className="text-muted-foreground mt-2">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
