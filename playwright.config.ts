import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ?? '6006';

export default defineConfig({
  testDir: './e2e',
  timeout: process.env.CI ? 60000 : 30000,
  workers: undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ['junit', { outputFile: 'e2e-results/junit.xml' }],
        ['html', { outputFolder: 'e2e-results/html-report', open: 'never' }],
        ['list'],
      ]
    : [['html', { open: 'on-failure' }], ['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
  },
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'full',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
