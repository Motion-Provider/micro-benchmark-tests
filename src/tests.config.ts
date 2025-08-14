import type { TestConfigurations } from "./interfaces/index.ts";

export default {
  testEnvironment: "node v24.0.1",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["tsx", "jsx"],
  times: 1e3,
  intervalMs: 5,
  totalIterations: 1e2,
  batchResultsPath: "./__tests__",
  benchmarkResultsPath: "./__tests__/benchmarks",
} as const satisfies TestConfigurations;
