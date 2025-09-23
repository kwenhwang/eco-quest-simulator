import { defineConfig, devices } from '@playwright/test';

const useExternal = !!process.env.NO_WEBSERVER;
const disableVisionArtifacts = process.env.NO_AI_VISION === '1';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3101',
    headless: true,
    trace: 'on-first-retry',
    screenshot: disableVisionArtifacts ? 'off' : 'only-on-failure',
    video: disableVisionArtifacts ? 'off' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-1366x768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'chromium-1280x720',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: useExternal ? undefined : {
    command: 'npm run start:test:e2e',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
