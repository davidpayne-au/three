# Repository Guidelines

## Project Structure & Module Organization
Use a Vite-style layout: keep React + TypeScript code in `src/`, grouping by feature (`src/scene/SceneCanvas.tsx`, `src/hooks/useThreeScene.ts`). Shared constants live in `src/config/`, reusable math or shader helpers in `src/lib/`. Static assets (models, textures, HDRIs) belong in `public/assets/` so they can be referenced via `/assets/...`. Co-locate tests next to their subjects as `*.test.tsx` or keep smoke tests under `src/__tests__/` for integration coverage. Config files (`tsconfig.json`, `vite.config.ts`, `.eslintrc.cjs`) stay at the repo root for predictable tooling.

## Build, Test, and Development Commands
- `npm install` – install all workspace dependencies (rerun after package changes).
- `npm run dev` – start the Vite dev server at http://localhost:5173 with hot reload.
- `npm run build` – produce the production bundle in `dist/`; run before tagging releases.
- `npm run preview` – serve the build output for a release sanity check.
- `npm run test` – execute unit/integration tests via Vitest with jsdom.
- `npm run lint` / `npm run format` – enforce ESLint + Prettier rules; required before opening a PR.

## Coding Style & Naming Conventions
Target modern TypeScript (ES2022). Stick to functional React components, 2-space indentation, and named exports for shared modules. Components and classes use PascalCase, hooks use camelCase with a `use` prefix, Three.js helper modules use kebab-case filenames (e.g., `orbit-controls.ts`). Keep JSX lean: extract helpers when components exceed ~150 lines. Run `npm run lint` to auto-fix ESLint + Prettier issues and ensure `tsconfig.json` stays in strict mode.

## Testing Guidelines
Write Vitest suites with React Testing Library for UI and three-mesh interaction tests; suffix files with `.test.tsx`. When validating rendering logic, mock WebGL-specific APIs and snapshot serialized scene graphs instead of canvases. Maintain smoke tests for primary flows (`SceneCanvas`, `ControlsPanel`, `useThreeScene`). Aim for >80% statement coverage, and add regression tests whenever 3D math utilities change.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat: add orbit controls`, `fix: clamp camera zoom`). Keep commits focused and reference issue IDs in the body when applicable. PRs need a concise summary, testing checklist, before/after screenshots or GIFs for visual tweaks, and a note about performance impact if shaders or geometry processing changed. Request review from another agent before merging to main.

## Security & Configuration Tips
Never commit API keys or GLB files larger than necessary; load secrets via `.env.local` (ignored by Git). Validate user-provided model URLs before loading them, and gate experimental features behind feature flags in `src/config/features.ts`.
