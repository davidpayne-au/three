import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Weather } from './Weather'

// Mock fetch globally
global.fetch = vi.fn()

describe('Weather page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the weather form with input and button', () => {
    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: /check the weather/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/location name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get weather/i })).toBeInTheDocument()
  })

  it('disables submit button when input is empty', () => {
    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>,
    )

    const submitButton = screen.getByRole('button', { name: /get weather/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when input has text', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>,
    )

    const input = screen.getByLabelText(/location name/i)
    const submitButton = screen.getByRole('button', { name: /get weather/i })

    await user.type(input, 'London')
    expect(submitButton).not.toBeDisabled()
  })

  it('fetches and displays weather data successfully', async () => {
    const user = userEvent.setup()

    // Mock geocoding response
    const geoResponse = {
      results: [
        {
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
        },
      ],
    }

    // Mock weather response
    const weatherResponse = {
      current: {
        temperature_2m: 15.5,
        weather_code: 2,
      },
    }

    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => geoResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => weatherResponse,
      } as Response)

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>,
    )

    const input = screen.getByLabelText(/location name/i)
    const submitButton = screen.getByRole('button', { name: /get weather/i })

    await user.type(input, 'London')
    await user.click(submitButton)

    // Wait for weather data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/London, United Kingdom/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/16°C/i)).toBeInTheDocument()
    expect(screen.getByText(/partly cloudy/i)).toBeInTheDocument()
  })

  it('displays error when location is not found', async () => {
    const user = userEvent.setup()

    // Mock geocoding response with no results
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response)

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>,
    )

    const input = screen.getByLabelText(/location name/i)
    const submitButton = screen.getByRole('button', { name: /get weather/i })

    await user.type(input, 'InvalidCity123')
    await user.click(submitButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/location not found/i)).toBeInTheDocument()
  })

  it('displays error when API request fails', async () => {
    const user = userEvent.setup()

    // Mock failed fetch
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
    } as Response)

    render(
      <ThemeProvider>
        <Weather />
      </ThemeProvider>,
    )

    const input = screen.getByLabelText(/location name/i)
    const submitButton = screen.getByRole('button', { name: /get weather/i })

    await user.type(input, 'London')
    await user.click(submitButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/failed to fetch location data/i)).toBeInTheDocument()
  })
})
