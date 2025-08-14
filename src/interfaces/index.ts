type Times = number;

export type BenchmarkFn = (times: Times, fn: () => void) => void;

export type BenchmarkStats = {
  /** Raw measured durations (ms) in the order they were recorded */
  runs: number[];

  /** Number of measured runs (runs.length) */
  n: number;

  /** Mean (average) in ms */
  average: number;

  /** Standard deviation in ms (population stddev) */
  stddev: number;

  /** Median (50th percentile) in ms */
  median: number;

  /** Inter-quartile range (75th - 25th) in ms */
  iqr: number;

  /** 50th percentile (same as median) */
  p50: number;

  /** 75th percentile */
  p75: number;

  /** 90th percentile */
  p90: number;

  /** 95th percentile */
  p95: number;

  /** Minimum observed value in ms */
  min: number;

  /** Maximum observed value in ms */
  max: number;

  /** Coefficient of variation: stddev / average (unitless) */
  cv: number;
};
export type IterateProps = {
  totalIterations: number;
  intervalMs: number;
  fn: () => void | Promise<void>;
  onComplete?: (stats: BenchmarkStats) => void;
  isWarmup?: boolean;
  warmupIterations?: number;
};
export interface TestConfigurations
  extends Omit<IterateProps, "fn" | "onComplete"> {
  testEnvironment: string;
  testRegex: string;
  moduleFileExtensions: string[];
  times: Times;
  benchmarkResultsPath: string;
  batchResultsPath: string;
}

/** Motion Provider Interfaces */

export interface AnimationLibraryProps {
  [key: string]: {
    initial: AnimationObjProps;
    animate: AnimationObjProps;
  };
}

export interface AnimationObjProps {
  [key: string]: any;
}

/** Utils Props */

export type SaveResultsJSON = (filePath: string, data: any) => void;
export type EnsureResultsDir = (dir: string) => Promise<void>;
export type SanitizeFileName = (fileName: string) => string;

/** Batch Test Props */

export interface BatchConfig extends TestConfigurations {
  testName: string;
  testDescription: string;
  files: React.ReactNode[];
}

export type BatchReportProps = Array<Record<string, unknown>>;
