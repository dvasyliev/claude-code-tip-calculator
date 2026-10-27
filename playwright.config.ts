import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Load PORT from .env.local if it exists.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

// The dev server port: PORT if set, else 3000.
const baseURL = `http://localhost:${process.env.PORT ?? 3000}`;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Reuse the dev server when one already listens on that port; never start a second.
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
  },
});
