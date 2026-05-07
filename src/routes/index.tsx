import { createFileRoute, Link } from "@tanstack/react-router";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ArrowRight, Eye, Layers, Palette, Shield, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumenShade — Smart dark mode for Chrome" },
      { name: "description", content: "Not inversion. Perceptual color remapping in OKLCH that preserves brand identity, image fidelity, and reading comfort." },
      { property: "og:title", content: "LumenShade — Smart dark mode for Chrome" },
      { property: "og:description", content: "The dark mode extension built on color science. Free." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative grain overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 relative">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber border hairline rounded-full px-3 py-1 mb-8">
            <Sparkles className="h-3 w-3" /> A new approach to dark mode
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
            Dark mode that <em className="italic text-amber not-italic" style={{fontStyle:"italic"}}>actually</em> looks designed.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            Most dark mode tools just invert your screen. LumenShade analyzes every color
            on the page and remaps it through perceptual color space — so your eyes get
            comfort and the web keeps its character.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/download"
              className="inline-flex items-center gap-2 bg-amber text-ink px-6 py-3 rounded-full font-medium hover:bg-amber-soft transition-colors"
            >
              Add to Chrome — Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 border hairline px-6 py-3 rounded-full font-medium hover:bg-card transition-colors"
            >
              See the algorithm
            </Link>
          </div>
          <div className="mt-6 text-xs text-muted-foreground font-mono">
            v1.0 · Manifest V3 · No tracking · No account
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Drag to compare</div>
            <h2 className="font-display text-3xl md:text-4xl mt-2">Inversion vs intelligence.</h2>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground max-w-xs text-right">
            Same page. Left: naive color inversion. Right: LumenShade's OKLCH remap.
          </div>
        </div>
        <BeforeAfter />
      </section>

      {/* VALUE GRID */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Palette, t: "Perceptual color science", d: "OKLCH remapping preserves hue and chroma so brand reds stay red, link blues stay blue." },
            { icon: Shield, t: "Contrast guard (APCA)", d: "Every text/background pair is verified for legibility. No washed-out gray-on-gray." },
            { icon: Eye, t: "Image-safe", d: "Photos and videos are softly dimmed — never inverted into alien colors." },
            { icon: Zap, t: "Zero flash", d: "Runs at document_start with a background pre-paint. No white flash before dark loads." },
            { icon: Layers, t: "Per-site control", d: "One click whitelist. LumenShade remembers your preference for every domain." },
            { icon: Sparkles, t: "Schedule", d: "Auto-enable from sunset to sunrise, or set your own hours." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="border hairline rounded-2xl p-6 hover:border-amber transition-colors">
              <Icon className="h-5 w-5 text-amber" />
              <div className="mt-4 font-display text-xl">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE / POSITION */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <p className="font-display text-3xl md:text-5xl leading-tight text-balance">
          "Pure inversion is a parlor trick.
          <span className="text-amber"> Color science is a craft.</span>"
        </p>
        <div className="mt-6 text-sm text-muted-foreground">— The case for LumenShade</div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
        <div className="border hairline rounded-3xl p-12 md:p-16 text-center grain">
          <h2 className="font-display text-4xl md:text-5xl text-balance">
            Start reading the web at night, properly.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Free, open, and small. About 18 KB after gzip.
          </p>
          <Link
            to="/download"
            className="mt-8 inline-flex items-center gap-2 bg-amber text-ink px-6 py-3 rounded-full font-medium hover:bg-amber-soft transition-colors"
          >
            Download LumenShade <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
