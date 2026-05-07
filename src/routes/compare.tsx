import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus, X } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "LumenShade vs Night Eye vs Dark Reader" },
      { name: "description", content: "An honest comparison of dark mode extensions for Chrome." },
      { property: "og:title", content: "Compare dark mode extensions" },
      { property: "og:description", content: "How LumenShade stacks up against Night Eye and Dark Reader." },
    ],
  }),
  component: Compare,
});

type Cell = boolean | "partial" | string;
const rows: { feature: string; lumen: Cell; nightEye: Cell; darkReader: Cell; invert: Cell }[] = [
  { feature: "Perceptual color (OKLCH)", lumen: true, nightEye: false, darkReader: false, invert: false },
  { feature: "Preserves brand colors", lumen: true, nightEye: "partial", darkReader: "partial", invert: false },
  { feature: "APCA contrast guard", lumen: true, nightEye: false, darkReader: false, invert: false },
  { feature: "Image-safe (no inversion)", lumen: true, nightEye: true, darkReader: true, invert: false },
  { feature: "Per-site control", lumen: true, nightEye: true, darkReader: true, invert: false },
  { feature: "Schedule (sunset/sunrise)", lumen: true, nightEye: true, darkReader: true, invert: false },
  { feature: "Brightness/contrast/warmth", lumen: true, nightEye: true, darkReader: true, invert: false },
  { feature: "Free", lumen: true, nightEye: "partial", darkReader: true, invert: true },
  { feature: "No account required", lumen: true, nightEye: false, darkReader: true, invert: true },
  { feature: "Open source", lumen: true, nightEye: false, darkReader: true, invert: true },
  { feature: "Bundle size", lumen: "≈18 KB", nightEye: "≈230 KB", darkReader: "≈480 KB", invert: "—" },
];

function CellIcon({ v }: { v: Cell }) {
  if (v === true) return <Check className="h-5 w-5 text-amber" />;
  if (v === false) return <X className="h-5 w-5 text-muted-foreground/40" />;
  if (v === "partial") return <Minus className="h-5 w-5 text-muted-foreground" />;
  return <span className="text-sm text-muted-foreground">{v}</span>;
}

function Compare() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">Compare</div>
      <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95] text-balance">
        We're not the only option. We're the best one.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Our honest take. We respect Night Eye and Dark Reader — they paved the road.
        We just think color science deserves a fresh attempt.
      </p>

      <div className="mt-16 border hairline rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr] bg-card text-xs uppercase tracking-widest text-muted-foreground">
          <div className="p-4">Feature</div>
          <div className="p-4 text-center text-amber">LumenShade</div>
          <div className="p-4 text-center">Night Eye</div>
          <div className="p-4 text-center">Dark Reader</div>
          <div className="p-4 text-center">Invert</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.feature}
            className={`grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr] border-t hairline ${i % 2 ? "bg-card/30" : ""}`}
          >
            <div className="p-4 text-sm">{r.feature}</div>
            <div className="p-4 flex justify-center"><CellIcon v={r.lumen} /></div>
            <div className="p-4 flex justify-center"><CellIcon v={r.nightEye} /></div>
            <div className="p-4 flex justify-center"><CellIcon v={r.darkReader} /></div>
            <div className="p-4 flex justify-center"><CellIcon v={r.invert} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
