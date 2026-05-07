import { useRef, useState } from "react";

/**
 * Realistic light website rendered twice:
 *   - Left clip: full CSS `invert(1) hue-rotate(180deg)` (what naive
 *     dark-mode tools and browser inversion actually do — destroys
 *     images, shifts brand colors into wrong hues, washed-out grays).
 *   - Right: LumenShade's perceptual remap (warm dark surfaces, brand
 *     colors preserved, photo untouched, text comfortable).
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
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border hairline shadow-2xl select-none cursor-ew-resize bg-black"
    >
      {/* RIGHT: LumenShade smart */}
      <div className="absolute inset-0">
        <FakePage variant="smart" />
      </div>
      {/* LEFT (clipped): the original white website, untouched */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <FakePage variant="light" />
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
      <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-mono px-2 py-1 rounded bg-white text-black border border-black/10">
        Original site
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

/**
 * "light"  = the original bright website. The CSS invert filter is applied
 *            on top of this in the parent — so we just render the source.
 * "smart"  = what LumenShade produces: warm dark, brand intact, photo intact.
 */
function FakePage({ variant }: { variant: "light" | "smart" }) {
  const isSmart = variant === "smart";

  // Theme tokens
  const bg = isSmart ? "#1a160e" : "#ffffff";
  const surface = isSmart ? "#241d12" : "#f6f4ef";
  const surface2 = isSmart ? "#2c2418" : "#ebe7df";
  const text = isSmart ? "#ece2cf" : "#1a1a1a";
  const muted = isSmart ? "#a89b85" : "#6b6b6b";
  const border = isSmart ? "#3a3020" : "#e3ddd0";

  // Brand identity — must SURVIVE through LumenShade, get destroyed by invert
  const brandRed = isSmart ? "#e64545" : "#d92828";   // strong red brand
  const brandOrange = isSmart ? "#f08a3c" : "#ee7a1f";
  const linkBlue = isSmart ? "#7ab8ff" : "#1a73e8";   // link blue
  const successGreen = isSmart ? "#5fcc8e" : "#1f9d55";

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: bg, color: text, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Browser-style top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: border, background: surface }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <div className="flex-1 mx-3 h-5 rounded text-[10px] flex items-center px-2"
          style={{ background: bg, color: muted, border: `1px solid ${border}` }}>
          chronicle.example.com/article
        </div>
      </div>

      {/* Site header */}
      <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: border }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ background: brandRed }} />
          <div className="font-bold text-sm" style={{ fontFamily: "Fraunces, serif" }}>
            The Chronicle
          </div>
        </div>
        <div className="hidden md:flex gap-4 text-[11px]" style={{ color: muted }}>
          <span>News</span><span>Culture</span><span>Tech</span><span>Opinion</span>
        </div>
        <button className="text-[11px] font-bold px-3 py-1.5 rounded" style={{ background: brandRed, color: "#fff" }}>
          Subscribe
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-5 overflow-hidden">
        {/* Sidebar */}
        <aside className="col-span-3 space-y-3">
          <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: brandRed }}>
            Trending
          </div>
          {[
            "Why OKLCH won the color wars",
            "Designers ditch Material",
            "The end of 60Hz",
          ].map((t, i) => (
            <div key={i} className="space-y-1 pb-2 border-b" style={{ borderColor: border }}>
              <div className="text-[11px] leading-snug" style={{ color: text }}>{t}</div>
              <div className="text-[9px]" style={{ color: muted }}>{(i + 2) * 4} min read</div>
            </div>
          ))}
        </aside>

        {/* Main article */}
        <article className="col-span-9 space-y-3">
          {/* Real photo (CSS gradient simulating a photo) — invert WILL ruin this */}
          <div
            className="w-full rounded-lg overflow-hidden relative"
            style={{
              height: "38%",
              background: isSmart
                // smart leaves photo basically alone (subtle dim)
                ? "linear-gradient(135deg, #c87850 0%, #8b4a2a 30%, #4a3520 60%, #1f2c44 100%)"
                : "linear-gradient(135deg, #e89968 0%, #a05a30 30%, #5a4028 60%, #243558 100%)",
              filter: isSmart ? "brightness(0.85)" : "none",
            }}
          >
            {/* Sun in photo */}
            <div className="absolute top-3 right-6 w-10 h-10 rounded-full"
              style={{ background: isSmart ? "#f5d488" : "#fff4c0", boxShadow: "0 0 24px rgba(255,220,140,0.6)" }} />
            <div className="absolute bottom-2 left-3 text-[9px] text-white/90 font-medium">
              Photo: Sunset over the desert
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: brandRed }}>
            Technology · Long read
          </div>
          <h1 className="text-xl leading-tight font-bold" style={{ fontFamily: "Fraunces, serif", color: text }}>
            The quiet revolution in how the web handles color.
          </h1>
          <div className="text-[10px]" style={{ color: muted }}>
            By Maria Chen · 6 min read · <span style={{ color: linkBlue }}>Share</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: text }}>
            For three decades, designers reached for HSL when they wanted to talk
            about color in code. It was easy and it was wrong — equal lightness
            values produced wildly unequal brightness. <span style={{ color: linkBlue, textDecoration: "underline" }}>Read more</span> about why
            OKLCH is finally fixing that, and what it means for accessibility.
          </p>

          {/* Callout card with brand color */}
          <div className="rounded-lg p-3 flex items-center gap-3"
            style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="w-9 h-9 rounded flex items-center justify-center font-bold text-sm"
              style={{ background: brandOrange, color: "#fff" }}>
              !
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold" style={{ color: text }}>
                Get the deep dive in your inbox
              </div>
              <div className="text-[10px]" style={{ color: muted }}>
                Weekly. Free. Unsubscribe anytime.
              </div>
            </div>
            <button className="text-[10px] font-bold px-3 py-1.5 rounded"
              style={{ background: successGreen, color: "#fff" }}>
              Subscribe
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
