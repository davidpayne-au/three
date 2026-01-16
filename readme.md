# ThreeJS Explorer

[![CI/CD](https://github.com/davidpayne-au/three/actions/workflows/cicd.yml/badge.svg)](https://github.com/davidpayne-au/three/actions/workflows/cicd.yml)

[Pages Site](https://davidpayne-au.github.io/three/)

A minimal React + TypeScript + Vite app that demonstrates a custom Three.js scene, Tailwind CSS styling, Vitest-powered tests, and a hash-based router so navigation works on any static host.

## Getting Started

```bash
npm install
npm run dev        # start Vite on http://localhost:5173
npm run build      # compile to dist/
npm run preview    # serve the production bundle
npm run test       # run Vitest + Testing Library suites
npm run test:e2e   # run Playwright E2E tests
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
- **Playwright + Axe** for end-to-end and accessibility testing.

## Testing & Quality

This project maintains high quality through a comprehensive testing strategy:

- **Unit & Integration Tests**: `npm run test` runs Vitest suites.
- **End-to-End Tests**: `npm run test:e2e` runs Playwright scenarios.
- **Accessibility**: Automated a11y checks using `@axe-core/playwright` ensure pages are accessible (WCAG compliance).
- **Linting**: ESLint enforces code quality standards.

## Deployment

Deployment is fully automated via GitHub Actions:

1. **Build & Test**: On every push, the CI pipeline runs linting, unit tests, and E2E tests against a local build.
2. **Deploy**: On merges to `main`, the app is deployed to **GitHub Pages**.
3. **Post-Verification**: After deployment, Playwright tests run against the live URL to verify the release.

Tweak `ThreeScene.tsx` to load GLTF assets, experiment with shaders, or integrate controls to evolve this into a richer 3D experience.
