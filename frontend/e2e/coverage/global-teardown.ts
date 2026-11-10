import { MCR } from "monocart-coverage-reports";
import coverageOptions from "./coverage-options";

export default async function globalTeardown() {
  if (process.env.COVERAGE !== "true") return;

  const mcr = MCR(coverageOptions);
  await mcr.generate();
}
