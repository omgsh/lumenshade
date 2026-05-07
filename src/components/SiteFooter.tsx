import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t hairline mt-32">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">LumenShade</div>
          <p className="text-muted-foreground mt-2 text-sm max-w-sm">
            Dark mode that respects color science. Built for designers, developers,
            and anyone who reads the web at night.
          </p>
        </div>
        <div className="text-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Product</div>
          <ul className="space-y-2">
            <li><Link to="/how-it-works" className="hover:text-amber">How it works</Link></li>
            <li><Link to="/features" className="hover:text-amber">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-amber">Pricing</Link></li>
            <li><Link to="/compare" className="hover:text-amber">vs Night Eye</Link></li>
            <li><Link to="/download" className="hover:text-amber">Download</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Resources</div>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-amber">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} LumenShade</span>
          <span>Crafted in OKLCH.</span>
        </div>
      </div>
    </footer>
  );
}
