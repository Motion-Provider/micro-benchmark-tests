type Times = number;

export type BenchmarkFn = (
  logger: boolean,
  label: string,
  times: Times,
  fn: () => void
) => void;

export type BenchmarkStats = {
  runs: number[];
  average: number;
  stddev: number;
};
export type IterateProps = {
  totalIterations: number;
  intervalMs: number;
  fn: () => void | Promise<void>;
  onComplete?: (stats: BenchmarkStats) => void;
};
export interface TestConfigurations
  extends Omit<IterateProps, "fn" | "onComplete"> {
  testEnvironment: string;
  testRegex: string;
  moduleFileExtensions: string[];
  times: Times;
}
