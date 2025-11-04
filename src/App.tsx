import { Suspense, lazy } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home').then(({ Home }) => ({ default: Home })))
const About = lazy(() => import('./pages/About').then(({ About }) => ({ default: About })))

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
    isActive ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white',
  ].join(' ')

const App = () => {
  const handleSkipToContent = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (typeof document === 'undefined') return
    const mainRegion = document.getElementById('main-content')
    mainRegion?.focus()
    if (mainRegion && typeof mainRegion.scrollIntoView === 'function') {
      mainRegion.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a className="skip-link" href="#main-content" onClick={handleSkipToContent}>
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Three Demo
          </p>
          <h1 className="text-3xl font-bold">ThreeJS Explorer</h1>
          <p className="text-sm text-slate-400">
            React + Vite + Tailwind with a hash-based router for static hosting.
          </p>
        </div>
        <nav
          aria-label="Primary navigation"
          className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur"
        >
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            About
          </NavLink>
        </nav>
      </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4"
        >
          <Suspense
            fallback={
              <div
                role="status"
                aria-live="polite"
                className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-200"
              >
                Loading section…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="mt-12 text-center text-xs text-slate-500">
          Built with React 19, Vite, Tailwind, and Three.js.
        </footer>
      </div>
    </div>
  )
}

export { App }
