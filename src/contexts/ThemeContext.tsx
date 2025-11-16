import { createContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export { ThemeContext }

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme
      if (saved) return saved

      // Check if matchMedia is available
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
    }
    return 'dark'
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
      const root = window.document.documentElement

      // Remove previous theme classes
      root.classList.remove('light', 'dark')

      // Add current theme class
      root.classList.add(theme)

      // Save to localStorage
      try {
        localStorage.setItem('theme', theme)
      } catch (error) {
        // localStorage might not be available in some environments
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}