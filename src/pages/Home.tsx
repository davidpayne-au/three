import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'

const ThreeScene = lazy(() => import('../components/ThreeScene').then(({ ThreeScene }) => ({ default: ThreeScene })))

const features = [
  {
    title: 'Live Three.js Canvas',
    copy: 'A lightweight renderer spins a reflective cube with animated wireframe accents.',
  },
  {
    title: 'HashRouter Ready',
    copy: 'Works on any static host since routes resolve via the URL hash segment.',
  },
  {
    title: 'Tailwind Styling',
    copy: 'Utility-first classes keep the UI consistent, responsive, and easy to extend.',
  },
]

const heroHeadingId = 'hero-heading'
const sceneDescriptionId = 'hero-scene-description'
const ctaDescriptionId = 'hero-cta-description'

const Home = () => (
  <div className="space-y-16">
    <section aria-labelledby={heroHeadingId} className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <p className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
          3D • React • Tailwind
        </p>
        <h2 id={heroHeadingId} className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
          Build immersive experiences with a minimal Three.js starter.
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-200">
          This demo wires together Vite, React Router, Tailwind, and a handcrafted Three.js scene.
          Use it as a foundation for data visualizations, product try-ons, or any GL-backed UI.
        </p>
        <p id={ctaDescriptionId} className="text-sm text-slate-600 dark:text-slate-300">
          Primary actions use a 4.5:1 contrast ratio and retain visible outlines for keyboard users.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/about"
            className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:bg-brand/90"
            aria-describedby={ctaDescriptionId}
          >
            Learn More
          </Link>
          <a
            href="https://threejs.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white hover:border-white/40"
          >
            Three.js Docs
          </a>
        </div>
      </div>
      <figure className="space-y-3">
        <Suspense
          fallback={
            <div
              role="status"
              aria-live="polite"
              className="flex h-72 w-full items-center justify-center rounded-3xl border border-dashed border-white/20 bg-slate-900/40 text-sm text-slate-300 md:h-96"
            >
              Loading 3D preview…
            </div>
          }
        >
          <ThreeScene
            aria-describedby={sceneDescriptionId}
            aria-label="Luminous Three.js cube rendered with high contrast lighting."
          />
        </Suspense>
        <figcaption id={sceneDescriptionId} className="text-sm text-slate-300">
          A holographic cyan cube with magenta rim lighting rotates over a deep navy gradient so it
          remains distinguishable even for users with low contrast sensitivity.
        </figcaption>
      </figure>
    </section>

    <section aria-label="Feature highlights" className="grid gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-lg shadow-slate-900/10 dark:border-white/10 dark:bg-white/10 dark:text-slate-50 dark:shadow-slate-900/40"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {feature.title}
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{feature.copy}</p>
        </div>
      ))}
    </section>
  </div>
)

export { Home }
