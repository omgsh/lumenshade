import { createFileRoute } from "@tanstack/react-router";
import { Download, AlertTriangle, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download LumenShade" },
      { name: "description", content: "Install LumenShade as an unpacked Chrome extension in 4 quick steps." },
      { property: "og:title", content: "Download LumenShade" },
      { property: "og:description", content: "Free dark mode extension for Chromium browsers." },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.2em] text-amber">Download</div>
      <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95] text-balance">
        Get LumenShade.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
        Until we publish to the Chrome Web Store, install as an unpacked extension.
        It takes about 30 seconds.
      </p>

      <a
        href="https://chromewebstore.google.com/detail/lumenshade-%E2%80%94-smart-dark-m/hkjpcdinaoicljnndoeoalaabdpododh"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-3 bg-amber text-ink px-7 py-4 rounded-full text-lg font-medium hover:bg-amber-soft transition-colors"
      >
        <Download className="h-5 w-5" /> Add to Chrome
      </a>

      <div className="mt-8 flex items-start gap-3 border border-amber/40 bg-amber/5 rounded-xl p-5">
        <AlertTriangle className="h-5 w-5 text-amber shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="font-display text-base text-foreground">Restart Chrome after installing</div>
          <div className="text-muted-foreground mt-1">
            LumenShade runs at page-load time. Quit Chrome completely and reopen
            it after Load unpacked, otherwise tabs you already have open won't
            be styled.
          </div>
        </div>
      </div>

      <Link
        to="/pricing"
        className="mt-6 flex items-center justify-between gap-4 border hairline rounded-xl p-5 hover:border-amber/60 transition-colors group"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-amber shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-display text-base">Want more? LumenShade Pro from $6/yr</div>
            <div className="text-muted-foreground mt-1">
              Custom palettes, per-element overrides, cloud sync, reading mode. Lifetime $25.
            </div>
          </div>
        </div>
        <span className="text-amber text-sm group-hover:translate-x-0.5 transition-transform">See plans →</span>
      </Link>

      <div className="mt-16 border hairline rounded-2xl p-8 md:p-10">
        <div className="font-display text-2xl mb-6">Install in 5 steps</div>
        <ol className="space-y-6">
          {[
            ["Unzip the downloaded file", "Extract lumenshade.zip anywhere on your computer."],
            ["Open chrome://extensions", "In Chrome, Edge, Brave, Arc, or Opera. Just paste it into the address bar."],
            ["Enable Developer mode", "Toggle in the top-right corner of the extensions page."],
            ["Click Load unpacked", "Select the unzipped LumenShade folder."],
            ["Restart Chrome", "Quit completely and reopen so existing tabs pick up dark mode."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-5">
              <div className="font-mono text-amber text-sm pt-1">0{i + 1}</div>
              <div>
                <div className="font-display text-lg">{t}</div>
                <div className="text-muted-foreground text-sm mt-1">{d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        Works in any Chromium browser. Firefox/Safari coming later.
      </div>
    </div>
  );
}
