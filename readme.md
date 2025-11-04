# ThreeJS Explorer

A minimal React + TypeScript + Vite app that demonstrates a custom Three.js scene, Tailwind CSS styling, Vitest-powered tests, and a hash-based router so navigation works on any static host.

## Getting Started

```bash
npm install
npm run dev        # start Vite on http://localhost:5173
npm run build      # compile to dist/
npm run preview    # serve the production bundle
npm run test       # run Vitest + Testing Library suites
```

## Project Structure

- `src/components/ThreeScene.tsx` – raw Three.js canvas with a reflective cube + wireframe halo.
- `src/pages/Home.tsx` / `About.tsx` – routed screens rendered via `HashRouter`.
- `src/__tests__/App.test.tsx` – UI smoke tests using Vitest and React Testing Library.
- `tailwind.config.js` & `src/index.css` – Tailwind setup plus global theme primitives.

## Stack Highlights

- **Three.js** for WebGL rendering without additional abstractions.
- **Tailwind CSS** for quick layout and theming tweaks.
- **React Router HashRouter** so deep links work when served from static storage/CDN.
- **Vitest + RTL** for component confidence with jsdom.

Tweak `ThreeScene.tsx` to load GLTF assets, experiment with shaders, or integrate controls to evolve this into a richer 3D experience.
