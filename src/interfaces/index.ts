type Times = number;

export type BenchmarkFn = (label: string, times: Times, fn: () => void) => void;

export interface TestConfigurations {
  testEnvironment: string;
  testRegex: string;
  moduleFileExtensions: string[];
  times: Times;
}
