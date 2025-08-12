import type { TestConfigurations } from "./interfaces/index.ts";

export default {
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  times: 1e3,
  intervalMs: 50,
  totalIterations: 1e2,
} as const satisfies TestConfigurations;
