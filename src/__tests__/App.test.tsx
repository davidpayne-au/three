import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('App routing', () => {
  it('renders the home hero by default', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText(/ThreeJS Explorer/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/Build immersive experiences with a minimal Three\.js starter/i),
    ).toBeInTheDocument()
  })

  it('navigates to the About page when requested', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: /about/i }))
    expect(
      await screen.findByRole('heading', { name: /about this demo/i }),
    ).toBeInTheDocument()
  })
})

describe('Accessibility affordances', () => {
  it('offers a skip link that moves focus to the main region', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.tab()
    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    expect(skipLink).toBeVisible()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('labels the hero Three.js scene with supporting description text', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const scene = await screen.findByRole('img', { name: /luminous/i })
    expect(scene).toHaveAttribute('aria-describedby', 'hero-scene-description')
    expect(screen.getByText(/holographic cyan cube/i)).toBeInTheDocument()
  })
})
