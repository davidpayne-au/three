import { defineConfig, devices } from '@playwright/test';

// Ensure baseURL doesn't have a trailing slash to avoid double slashes in tests
const rawBaseURL = process.env.BASE_URL || 'http://localhost:5173';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: (baseURL.includes('localhost') || baseURL.includes('127.0.0.1')) ? {
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  } : undefined,
});
