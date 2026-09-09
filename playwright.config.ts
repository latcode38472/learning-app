import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// In some environments a Chromium build is pre-installed at a fixed path.
// Use it when present so the tests never need to download a browser.
const preinstalledChromium = process.env.PW_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';
const executablePath = existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    // Override to test a sub-path deployment (GitHub Pages project site), e.g.
    // E2E_BASE_URL=http://127.0.0.1:4173/learning-app/
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4173/',
    trace: 'retain-on-failure',
  },
  // When E2E_BASE_URL points at a server that is already running (a sub-path
  // build, or a production artifact being checked), don't start another one.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: executablePath ? { executablePath } : {} } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'iphone', use: { ...devices['iPhone 13'] } },
    { name: 'android', use: { ...devices['Pixel 5'], launchOptions: executablePath ? { executablePath } : {} } },
  ],
});
