import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ThemeToggle } from './ThemeToggle'

const renderWithTheme = (initialTheme: 'light' | 'dark' = 'light') => {
  // Mock localStorage to control initial theme
  const mockLocalStorage = {
    getItem: vi.fn(() => initialTheme),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  it('renders with proper accessibility attributes', () => {
    renderWithTheme('light')

    const button = screen.getByRole('button', { name: /switch to dark theme/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme')
  })

  it('shows moon icon in light mode and sun icon in dark mode', async () => {
    const user = userEvent.setup()
    renderWithTheme('light')

    // Light mode should show moon (for switching to dark)
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument()

    // Click to toggle to dark mode
    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }))

    // Dark mode should show sun (for switching to light)
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()
  })

  it('is keyboard accessible', async () => {
    const user = userEvent.setup()
    renderWithTheme('light')

    const button = screen.getByRole('button', { name: /switch to dark theme/i })

    // Tab to the button
    await user.tab()
    expect(button).toHaveFocus()

    // Press Enter to activate
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()
  })

  it('has sufficient color contrast in light mode', () => {
    renderWithTheme('light')

    const button = screen.getByRole('button', { name: /switch to dark theme/i })

    // Check that it has appropriate light mode classes
    expect(button).toHaveClass('border-slate-200', 'bg-slate-50', 'text-slate-600')
    expect(button).toHaveClass('hover:bg-slate-100', 'hover:text-slate-900')
    expect(button).toHaveClass('focus:ring-offset-white')
  })

  it('has sufficient color contrast in dark mode', async () => {
    const user = userEvent.setup()
    renderWithTheme('light')

    // Toggle to dark mode
    await user.click(screen.getByRole('button', { name: /switch to dark theme/i }))

    const button = screen.getByRole('button', { name: /switch to light theme/i })

    // Check that it has appropriate dark mode classes
    expect(button).toHaveClass('dark:border-white/10', 'dark:bg-white/5', 'dark:text-slate-400')
    expect(button).toHaveClass('dark:hover:bg-white/10', 'dark:hover:text-white')
    expect(button).toHaveClass('dark:focus:ring-offset-slate-950')
  })

  it('maintains focus ring visibility in both themes', () => {
    renderWithTheme('light')

    const button = screen.getByRole('button', { name: /switch to dark theme/i })

    // Check focus ring classes are present
    expect(button).toHaveClass('focus:ring-2', 'focus:ring-brand')
    expect(button).toHaveClass('focus:ring-offset-2')
  })

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup()
    renderWithTheme('light')

    const button = screen.getByRole('button', { name: /switch to dark theme/i })

    // Click to toggle to dark
    await user.click(button)
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument()

    // Click again to toggle back to light
    await user.click(screen.getByRole('button', { name: /switch to light theme/i }))
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument()
  })
})