import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const BRAVE_PATH = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let executablePath: string | undefined;
if (fs.existsSync(BRAVE_PATH)) {
  executablePath = BRAVE_PATH;
} else if (fs.existsSync(CHROME_PATH)) {
  executablePath = CHROME_PATH;
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./e2e/coverage/global-setup.ts",
  globalTeardown: "./e2e/coverage/global-teardown.ts",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "yarn dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI && process.env.COVERAGE !== "true",
    timeout: 120 * 1000,
    env: {
      VITE_COVERAGE: process.env.COVERAGE === "true" ? "true" : "false",
    },
  },
});
