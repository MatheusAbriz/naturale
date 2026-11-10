import { CoverageReportOptions } from "monocart-coverage-reports";

const coverageOptions: CoverageReportOptions = {
  name: "Naturale E2E Coverage",
  outputDir: "./coverage/e2e",
  reports: ["html", "console-summary", "text-summary"],
  entryFilter: {
    "**/node_modules/**": false,
    "**/*": true,
  },
  sourceFilter: {
    "**/node_modules/**": false,
    "src/**": true,
  },
};

export default coverageOptions;
