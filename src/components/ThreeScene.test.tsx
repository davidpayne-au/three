import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ThreeScene } from './ThreeScene'

describe('ThreeScene accessibility', () => {
  it('announces a fallback message when WebGL cannot initialize', () => {
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => null)

    render(
      <ThemeProvider>
        <ThreeScene />
      </ThemeProvider>
    )

    const statusMessage = screen.getByRole('status')
    expect(statusMessage).toHaveTextContent(/webgl preview unavailable/i)
    getContextSpy.mockRestore()
  })
})
