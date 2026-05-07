import { Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";

const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/compare", label: "Compare" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b hairline">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative h-7 w-7 rounded-full bg-gradient-to-br from-amber to-amber-soft flex items-center justify-center">
            <Moon className="h-4 w-4 text-ink" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl tracking-tight">LumenShade</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/download"
          className="inline-flex items-center gap-2 bg-amber text-ink px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-soft transition-colors"
        >
          Get the extension
        </Link>
      </div>
    </header>
  );
}
