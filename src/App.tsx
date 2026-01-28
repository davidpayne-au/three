import { Suspense, lazy } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'

const Home = lazy(() => import('./pages/Home').then(({ Home }) => ({ default: Home })))
const About = lazy(() => import('./pages/About').then(({ About }) => ({ default: About })))
const Weather = lazy(() => import('./pages/Weather').then(({ Weather }) => ({ default: Weather })))

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 cheerful:bg-gradient-to-r cheerful:from-pink-500 cheerful:to-purple-600 cheerful:text-white'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cheerful:text-purple-700 cheerful:hover:text-purple-900',
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
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 cheerful:bg-amber-50 cheerful:text-purple-900">
      <a className="skip-link" href="#main-content" onClick={handleSkipToContent}>
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 dark:border-white/5 cheerful:border-purple-300">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500 cheerful:text-purple-600">
            Three Demo
          </p>
          <h1 className="text-3xl font-bold">ThreeJS Explorer</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 cheerful:text-purple-700">
            React + Vite + Tailwind with a hash-based router for static hosting.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <nav
            aria-label="Primary navigation"
            className="flex gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 backdrop-blur dark:border-white/10 dark:bg-white/5 cheerful:border-purple-300 cheerful:bg-gradient-to-r cheerful:from-pink-100 cheerful:to-purple-100"
          >
            <NavLink to="/" end className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>
            <NavLink to="/weather" className={navLinkClasses}>
              Weather
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
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
                className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 cheerful:border-purple-300 cheerful:bg-gradient-to-br cheerful:from-pink-50 cheerful:to-purple-50 cheerful:text-purple-800"
              >
                Loading section…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/weather" element={<Weather />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="mt-12 text-center text-xs text-slate-500 dark:text-slate-500 cheerful:text-purple-600">
          Built with React 19, Vite, Tailwind, and Three.js.
        </footer>
      </div>
    </div>
  )
}

export { App }
