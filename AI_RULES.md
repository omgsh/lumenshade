# Tech Stack & Development Rules

- **Framework & Runtime:** Pure React 18 (`react@18.3.1`, `react-dom@18.3.1`) with TypeScript.
- **Build Tool:** Vite (`vite@7.x`) using `@vitejs/plugin-react` and `@tailwindcss/vite`.
- **Routing:** React Router DOM v6 (`react-router-dom`). Keep routes configured in `src/App.tsx`.
- **Styling:** Tailwind CSS v4 with custom OKLCH color system and `tw-animate-css`.
- **UI Components:** Pre-installed shadcn/ui components in `src/components/ui/` built on Radix UI primitives.
- **Icons:** `lucide-react` exclusively for UI icons.
- **Data & State:** `@tanstack/react-query` for asynchronous server state management.

## Codebase Architecture
- Always put application source code in the `src/` folder.
- Pages go into `src/pages/` (e.g. `src/pages/Index.tsx`, `src/pages/HowItWorks.tsx`).
- Components go into `src/components/`.
- UI primitives live in `src/components/ui/`.
- The main landing page is `src/pages/Index.tsx`.
- All routes and page definitions are managed in `src/App.tsx`.
- Static assets and extensions are located in `public/` and `extension/`.
