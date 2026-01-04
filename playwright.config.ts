import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Kong Portal
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run for
  timeout: process.env.CI ? 90 * 1000 : 60 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Output directory for test artifacts
  outputDir: 'test-artifacts',

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: process.env.BASE_URL || 'https://dev.abm.dev',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure and for visual testing
    screenshot: 'on',

    // Video on first retry
    video: 'retain-on-failure',

    // Navigation timeout
    navigationTimeout: 30 * 1000,

    // Action timeout
    actionTimeout: 15 * 1000,
  },

  // Configure projects for different browsers
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
    // Mobile viewport for responsive testing
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        actionTimeout: 20 * 1000,
        navigationTimeout: 40 * 1000,
      },
    },
  ],

  // Expect settings for visual comparisons
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
});
