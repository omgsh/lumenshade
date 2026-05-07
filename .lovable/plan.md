
# LumenShade — Smart Dark Mode Chrome Extension + Marketing Site

A Chrome extension that doesn't just invert colors — it perceptually remaps webpage colors using OKLCH so dark surfaces feel natural, text stays readable, and brand colors keep their identity. Paired with a bold marketing site to position it against Night Eye.

## 1. Chrome Extension (`/extension`, packaged to `public/lumenshade.zip`)

**Manifest V3** with `activeTab`, `storage`, `scripting`, `tabs` permissions and a content script that runs at `document_start` on all URLs.

### Smart Conversion Algorithm (the differentiator)

A content script that runs on every page load and on DOM mutations:

1. **Walk computed styles** of every element (and `::before`/`::after`) and extract `color`, `background-color`, `border-color`, `fill`, `stroke`, `box-shadow`.
2. **Parse each color → OKLCH** using a tiny built-in color converter (no external deps; CSS `color()` + manual sRGB↔OKLab math).
3. **Remap by role, not by inversion:**
   - **Backgrounds** (L > 0.85): map to dark surface `L = 0.12–0.18`, preserve hue, dampen chroma to 30%.
   - **Text** (L < 0.35): map to soft off-white `L = 0.92`, preserve hue at low chroma so colored text (links, code) keeps identity.
   - **Mid-tone UI** (cards, borders): compress lightness toward `L = 0.22–0.30`, keep chroma.
   - **Brand/accent colors** (high chroma): keep hue + chroma, only adjust lightness for AA contrast against new background.
   - **Contrast guard**: after remap, compute APCA contrast vs new background; if below threshold, bump text L until it passes.
4. **Images, video, canvas, iframes**: don't touch pixels — apply a CSS filter `brightness(0.85) contrast(0.95)` so photos stay natural and recognizable. User-controlled image dimming slider.
5. **Inject computed overrides** as a single `<style>` tag with high-specificity selectors using element-scoped CSS variables, plus a global `html` background fallback so first-paint isn't white (FOUC prevention).
6. **Mutation observer** re-runs the remap on dynamically added nodes (debounced).

### User Features (all in v1)

- **Popup UI** (React + Tailwind, built with Vite into `/extension/popup`):
  - Master on/off toggle
  - Per-site enable/disable + whitelist management
  - Sliders: brightness, contrast, warmth (shifts hue toward amber), image dimming
  - Schedule: sunset-to-sunrise (uses geolocation or manual times)
  - Reset to defaults
- **Storage**: `chrome.storage.local` for global prefs + per-domain overrides.
- **Background service worker**: handles schedule timer (`chrome.alarms`), badge state, and broadcasts setting changes to all tabs.

### Build & Package

A `bun run build:ext` script that bundles popup React app, copies static manifest + content script + icon, then zips to `public/lumenshade.zip` via nix `zip`.

## 2. Marketing Site (TanStack Start routes)

Distinct, bold visual identity — NOT generic SaaS. Editorial dark theme with a single warm amber accent (the "warmth" theme of the product), large serif display headings paired with a clean grotesque body, subtle film-grain texture and asymmetric layouts.

### Routes

```text
src/routes/
  __root.tsx        — shared header/footer, dark theme shell
  index.tsx         — Home (hero, before/after demo, value props, CTA)
  how-it-works.tsx  — Algorithm explainer with OKLCH visual
  features.tsx      — Per-site control, schedule, sliders, image handling
  compare.tsx       — Honest comparison vs Night Eye / Dark Reader
  download.tsx      — Install instructions + download button (fetch+blob)
  faq.tsx           — Common questions
```

Each route has its own `head()` with unique title, description, og tags.

### Hero

- Big editorial headline: "Dark mode that actually looks designed."
- Subhead positioning against pure inversion.
- Interactive **before/after slider** showing a real webpage screenshot converted naively (inverted, ugly) vs LumenShade (perceptual remap).
- Primary CTA: "Add to Chrome — Free"
- Secondary: "See how it works"

### How-it-works section

- Visual showing a color wheel in OKLCH space with arrows demonstrating the remap (lightness flip while preserving hue/chroma).
- Side-by-side code/visual blocks explaining each step.

### Compare table

- Honest feature matrix vs Night Eye (paid), Dark Reader (open source), generic invert.
- Highlight: perceptual color science, contrast guard, image preservation, free.

### Download flow

- One-click download triggers `fetch('/lumenshade.zip').then(blob)` pattern.
- 4-step install instructions (unzip, chrome://extensions, dev mode, load unpacked).

## 3. Tech Notes (technical section)

- Color math lives in `extension/src/color.ts` — pure TS, ~200 lines, sRGB ↔ Linear ↔ OKLab ↔ OKLCH. No npm dep.
- APCA contrast in `extension/src/contrast.ts`.
- Content script written in vanilla TS (no React) to keep injection fast and bundle small.
- Popup is a separate Vite build inside `/extension/popup` so it can use React + Tailwind without bloating the content script.
- Marketing site uses existing TanStack Start setup; no backend needed for v1 (no Lovable Cloud).
- Site theme tokens defined in `src/styles.css` using OKLCH (on-brand: the product is about OKLCH).

## 4. Out of Scope for v1

- Firefox/Safari builds (Chromium-only first)
- Cloud-synced settings (local storage only)
- Chrome Web Store submission (download-as-zip only; we'll add later)
- Analytics / telemetry

## 5. Build Order

1. Marketing site shell + theme tokens + routes scaffolding
2. Home page with hero + before/after slider
3. How-it-works, Features, Compare, FAQ, Download pages
4. Extension: manifest, color math, content script with smart remap
5. Extension popup UI with all controls
6. Background worker (schedule + badge)
7. Build script + zip packaging into `public/`
8. Wire download page to served zip

After build, I'll QA by loading the zip into Chrome mentally via the install steps in the UI and verifying each route renders.
