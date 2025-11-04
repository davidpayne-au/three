import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ThreeScene from './ThreeScene'

describe('ThreeScene accessibility', () => {
  it('announces a fallback message when WebGL cannot initialize', () => {
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => null)

    render(<ThreeScene />)

    const statusMessage = screen.getByRole('status')
    expect(statusMessage).toHaveTextContent(/webgl preview unavailable/i)
    getContextSpy.mockRestore()
  })
})
