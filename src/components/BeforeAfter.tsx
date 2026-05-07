import { useRef, useState } from "react";

/**
 * Visual demo: simulated webpage, with a slider revealing
 * naive-invert (left, ugly) vs LumenShade smart remap (right).
 * Pure CSS — no real screenshots needed.
 */
export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border hairline shadow-2xl select-none cursor-ew-resize"
    >
      {/* RIGHT (full): smart remap */}
      <FakePage variant="smart" />
      {/* LEFT (clipped): naive invert */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <FakePage variant="invert" />
      </div>
      {/* divider */}
      <div
        className="absolute top-0 bottom-0 w-px bg-amber pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-amber text-ink flex items-center justify-center text-xs font-bold shadow-xl">
          ⇄
        </div>
      </div>
      {/* labels */}
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-mono px-2 py-1 rounded bg-black/60 text-white">
        Naive invert
      </div>
      <div className="absolute top-3 right-3 text-[10px] uppercase tracking-widest font-mono px-2 py-1 rounded bg-amber text-ink">
        LumenShade
      </div>
      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Reveal slider"
      />
    </div>
  );
}

function FakePage({ variant }: { variant: "invert" | "smart" }) {
  // "invert" = hue-rotated, washed out, brand colors broken
  // "smart"  = warm dark, brand colors preserved
  const isSmart = variant === "smart";
  const bg = isSmart ? "oklch(0.16 0.012 60)" : "oklch(0.18 0.05 240)";
  const surface = isSmart ? "oklch(0.22 0.014 60)" : "oklch(0.25 0.07 220)";
  const text = isSmart ? "oklch(0.94 0.015 80)" : "oklch(0.85 0.04 150)";
  const muted = isSmart ? "oklch(0.68 0.02 70)" : "oklch(0.6 0.05 130)";
  const accent = isSmart ? "oklch(0.78 0.16 65)" : "oklch(0.6 0.18 320)"; // brand red→cyan-ish on invert
  const link = isSmart ? "oklch(0.75 0.13 230)" : "oklch(0.7 0.15 50)";
  return (
    <div className="absolute inset-0 p-6 grid grid-cols-12 gap-4" style={{ background: bg, color: text, fontFamily: "Inter, sans-serif" }}>
      <div className="col-span-3 rounded-lg p-4 space-y-3" style={{ background: surface }}>
        <div className="h-3 w-20 rounded" style={{ background: accent }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-2 rounded" style={{ background: muted, width: `${50 + ((i*13)%50)}%`, opacity: 0.4 }} />
        ))}
      </div>
      <div className="col-span-9 space-y-4">
        <div className="font-display text-2xl" style={{ fontFamily: "Fraunces, serif" }}>
          The future of reading is comfortable.
        </div>
        <div className="text-xs" style={{ color: muted }}>
          By Maria Chen · 6 min read
        </div>
        <div className="space-y-2">
          {[92, 78, 88, 65, 84].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ background: text, opacity: 0.55, width: `${w}%` }} />
          ))}
        </div>
        <div className="rounded-lg p-3 flex gap-3" style={{ background: surface }}>
          <div className="h-12 w-12 rounded" style={{ background: `linear-gradient(135deg, ${accent}, ${link})` }} />
          <div className="flex-1 space-y-2">
            <div className="h-2 rounded" style={{ background: text, opacity: 0.6, width: "70%" }} />
            <div className="h-2 rounded" style={{ background: muted, width: "40%" }} />
          </div>
          <button className="text-xs px-3 py-1 rounded-full self-center" style={{ background: accent, color: "#1a1206" }}>
            Read
          </button>
        </div>
        <div className="space-y-2">
          {[95, 82, 70].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ background: text, opacity: 0.55, width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
