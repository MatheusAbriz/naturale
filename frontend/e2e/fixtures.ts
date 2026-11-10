import { test as base, expect } from "@playwright/test";
import { MCR } from "monocart-coverage-reports";
import coverageOptions from "./coverage/coverage-options";

export const test = base.extend<{ collectCoverage: void }>({
  collectCoverage: [
    async ({ page }, use) => {
      await use();

      if (process.env.COVERAGE !== "true") return;

      const coverage = await page
        .evaluate(() => (window as unknown as { __coverage__?: unknown }).__coverage__)
        .catch(() => null);

      if (coverage) {
        const mcr = MCR(coverageOptions);
        await mcr.add(coverage);
      }
    },
    { auto: true },
  ],
});

export { expect };
