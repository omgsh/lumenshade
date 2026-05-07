import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

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
  const handleDownload = () => {
    fetch("/lumenshade.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "lumenshade.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

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

      <button
        onClick={handleDownload}
        className="mt-10 inline-flex items-center gap-3 bg-amber text-ink px-7 py-4 rounded-full text-lg font-medium hover:bg-amber-soft transition-colors"
      >
        <Download className="h-5 w-5" /> Download lumenshade.zip
      </button>

      <div className="mt-16 border hairline rounded-2xl p-8 md:p-10">
        <div className="font-display text-2xl mb-6">Install in 4 steps</div>
        <ol className="space-y-6">
          {[
            ["Unzip the downloaded file", "Extract lumenshade.zip anywhere on your computer."],
            ["Open chrome://extensions", "In Chrome, Edge, Brave, Arc, or Opera. Just paste it into the address bar."],
            ["Enable Developer mode", "Toggle in the top-right corner of the extensions page."],
            ["Click Load unpacked", "Select the unzipped LumenShade folder. Done."],
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
