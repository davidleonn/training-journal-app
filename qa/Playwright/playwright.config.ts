import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", // Pointing to your QA folder
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",
    trace: "off",
    testIdAttribute: "data-testid",
    video: "off",
    screenshot: "off"
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev --prefix src/frontend",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } }
  ]
});
