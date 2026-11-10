import { MCR } from "monocart-coverage-reports";
import coverageOptions from "./coverage-options";

export default async function globalSetup() {
  if (process.env.COVERAGE !== "true") return;

  const mcr = MCR(coverageOptions);
  await mcr.cleanCache();
}
