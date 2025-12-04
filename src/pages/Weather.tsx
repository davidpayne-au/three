import { useState, type FormEvent } from 'react'
import { Suspense, lazy } from 'react'

const WeatherAnimation = lazy(() =>
  import('../components/WeatherAnimation').then(({ WeatherAnimation }) => ({
    default: WeatherAnimation,
  })),
)

interface WeatherData {
  location: string
  temperature: number
  weatherCode: number
  latitude: number
  longitude: number
}

const weatherCodeDescriptions: Record<number, string> = {
  0: '☀️ Clear sky',
  1: '🌤️ Mainly clear',
  2: '⛅ Partly cloudy',
  3: '☁️ Overcast',
  45: '🌫️ Foggy',
  48: '🌫️ Depositing rime fog',
  51: '🌦️ Light drizzle',
  53: '🌦️ Moderate drizzle',
  55: '🌦️ Dense drizzle',
  61: '🌧️ Slight rain',
  63: '🌧️ Moderate rain',
  65: '🌧️ Heavy rain',
  71: '🌨️ Slight snow',
  73: '🌨️ Moderate snow',
  75: '🌨️ Heavy snow',
  77: '❄️ Snow grains',
  80: '🌦️ Slight rain showers',
  81: '🌧️ Moderate rain showers',
  82: '🌧️ Violent rain showers',
  85: '🌨️ Slight snow showers',
  86: '🌨️ Heavy snow showers',
  95: '⛈️ Thunderstorm',
  96: '⛈️ Thunderstorm with slight hail',
  99: '⛈️ Thunderstorm with heavy hail',
}

const getWeatherDescription = (code: number): string => {
  return weatherCodeDescriptions[code] || '🌡️ Weather data available'
}

const Weather = () => {
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (e: FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return

    setIsLoading(true)
    setError(null)
    setWeatherData(null)

    try {
      // Step 1: Geocoding - Get coordinates for the location
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
      )

      if (!geoResponse.ok) {
        throw new Error('Failed to fetch location data')
      }

      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Location not found. Please try a different name.')
      }

      const { latitude, longitude, name, country } = geoData.results[0]

      // Step 2: Get weather data for the coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`,
      )

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const weatherJson = await weatherResponse.json()

      setWeatherData({
        location: `${name}, ${country}`,
        temperature: weatherJson.current.temperature_2m,
        weatherCode: weatherJson.current.weather_code,
        latitude,
        longitude,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const inputId = 'weather-location-input'
  const headingId = 'weather-heading'

  return (
    <div className="space-y-8">
      <section aria-labelledby={headingId} className="space-y-6">
        <div>
          <p className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">
            Weather • Live Data
          </p>
          <h2
            id={headingId}
            className="mt-3 text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Check the Weather
          </h2>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
            Enter any city name to get current weather conditions powered by Open-Meteo API.
          </p>
        </div>

        <form onSubmit={fetchWeather} className="space-y-4">
          <div>
            <label
              htmlFor={inputId}
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Location Name
            </label>
            <div className="mt-2 flex gap-3">
              <input
                id={inputId}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., London, Tokyo, New York"
                className="flex-1 rounded-full border border-slate-300 bg-white px-5 py-3 text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:border-white/20 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                disabled={isLoading}
                aria-describedby={error ? 'weather-error' : undefined}
              />
              <button
                type="submit"
                disabled={isLoading || !location.trim()}
                className="rounded-full bg-sky-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Get Weather'}
              </button>
            </div>
          </div>

          {error && (
            <div
              id="weather-error"
              role="alert"
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-700 dark:text-red-400"
            >
              <p className="text-sm font-semibold">⚠️ {error}</p>
            </div>
          )}
        </form>
      </section>

      {isLoading && (
        <section
          aria-live="polite"
          aria-busy="true"
          className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/5"
        >
          <Suspense
            fallback={
              <div className="text-slate-600 dark:text-slate-400">Loading animation...</div>
            }
          >
            <WeatherAnimation />
          </Suspense>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            Fetching weather data...
          </p>
        </section>
      )}

      {weatherData && !isLoading && (
        <section
          aria-live="polite"
          className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 p-8 shadow-lg dark:border-white/10 dark:from-slate-900 dark:to-slate-800"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {weatherData.location}
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-sky-600 dark:text-sky-400">
                {Math.round(weatherData.temperature)}°C
              </span>
            </div>
            <p className="text-2xl text-slate-700 dark:text-slate-300">
              {getWeatherDescription(weatherData.weatherCode)}
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-400 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/60">
                <p className="font-semibold text-slate-900 dark:text-white">Coordinates</p>
                <p>
                  {weatherData.latitude.toFixed(4)}°N, {weatherData.longitude.toFixed(4)}°E
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/60">
                <p className="font-semibold text-slate-900 dark:text-white">Data Source</p>
                <p>Open-Meteo API</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export { Weather }
