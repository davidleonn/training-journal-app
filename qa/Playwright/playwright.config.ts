import { defineConfig, devices } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "dot" : "list",

  use: {
    baseURL: "http://localhost:5173",
    trace: "off",
    testIdAttribute: "data-testid",
    video: "off",
    screenshot: "off"
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npm run dev --prefix ${path.resolve(__dirname, "../../src/frontend")}`,
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
