import { Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'cheerful' : 'light'

  const getIcon = () => {
    if (theme === 'light') return <Moon className="h-4 w-4" />
    if (theme === 'dark') return <Sparkles className="h-4 w-4" />
    return <Sun className="h-4 w-4" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-white dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus:ring-offset-slate-950 cheerful:border-purple-400/50 cheerful:bg-gradient-to-br cheerful:from-pink-300 cheerful:to-purple-300 cheerful:text-purple-900 cheerful:hover:from-pink-400 cheerful:hover:to-purple-400 cheerful:focus:ring-purple-500 cheerful:focus:ring-offset-yellow-100"
      aria-label={`Switch to ${nextTheme} theme`}
    >
      {getIcon()}
    </button>
  )
}