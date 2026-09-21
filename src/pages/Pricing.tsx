import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  cta: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "The full smart engine. No catch.",
    cta: "Download",
    features: [
      "OKLCH perceptual remap",
      "APCA contrast guard",
      "Per-site toggle",
      "Brightness, contrast, warmth",
      "Schedule (sunset/sunrise)",
      "Image-safe filtering",
    ],
  },
  {
    name: "Pro",
    price: "$6",
    cadence: "/ year",
    tagline: "Power tools for daily readers.",
    cta: "Start Pro",
    features: [
      "Everything in Free",
      "Custom palettes per site",
      "Per-element overrides",
    ],
  },
  {
    name: "Pro Plus",
    price: "$10",
    cadence: "/ year",
    badge: "Most popular",
    highlight: true,
    tagline: "Everything Pro, plus power features.",
    cta: "Go Pro Plus",
    features: [
      "Everything in Pro",
      "Cloud-synced settings",
      "Reading mode (typography reflow)",
      "Custom schedules per site",
      "Early access to new features",
    ],
  },
  {
    name: "Lifetime",
    price: "$25",
    cadence: "once",
    tagline: "Pay once. Read forever.",
    cta: "Buy lifetime",
    features: [
      "Everything in Pro",
      "All future Pro features",
      "All future major versions",
      "No subscription, ever",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">Pricing</div>
      <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95] text-balance">
        Free forever. <em className="text-amber not-italic">Pro</em> when you want more.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        The smart conversion engine is free for everyone — that's the part that
        matters. Pro adds power tools, sync, and reading mode for the people
        who live in the browser.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-7 flex flex-col transition-colors ${
              t.highlight
                ? "border-amber bg-card shadow-[0_0_60px_-20px_oklch(0.78_0.16_65/0.4)]"
                : "hairline hover:border-amber/50"
            }`}
          >
            {t.badge && (
              <div className="absolute -top-3 left-7 inline-flex items-center gap-1 bg-amber text-ink text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                <Sparkles className="h-3 w-3" /> {t.badge}
              </div>
            )}
            <div className="font-display text-xl">{t.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.cadence}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.tagline}</p>
            <ul className="mt-6 space-y-3 text-sm flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {t.name === "Free" ? (
              <a
                href="https://chromewebstore.google.com/detail/lumenshade-%E2%80%94-smart-dark-m/hkjpcdinaoicljnndoeoalaabdpododh"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium border hairline hover:bg-card transition-colors"
              >
                {t.cta}
              </a>
            ) : (
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Checkout will be wired up next. Enable cloud payments to accept real subscriptions."
                  )
                }
                className={`mt-7 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  t.highlight
                    ? "bg-amber text-ink hover:bg-amber-soft"
                    : "border hairline hover:bg-card"
                }`}
              >
                {t.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-6 text-sm">
        {[
          ["No tracking", "Even on Pro. Sync is opt-in and end-to-end encrypted."],
          ["Built by 2 people", "Independent. No VC. Your money funds the work."],
        ].map(([t, d]) => (
          <div key={t} className="border hairline rounded-xl p-5">
            <div className="font-display text-lg">{t}</div>
            <p className="mt-1 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        Questions about Pro? <Link to="/faq" className="text-amber hover:underline">Read the FAQ</Link>.
      </div>
    </div>
  );
}
