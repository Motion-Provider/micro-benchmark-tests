import type { BenchmarkStats } from "@/interfaces/index.ts";

/**
 * Compute descriptive benchmark stats from an array of run durations (ms).
 * Returns null when runs is empty.
 */
export default function computeStats(runs: number[]): BenchmarkStats | null {
  const n = runs.length;
  if (n === 0) return null;

  const sorted = runs.slice().sort((a, b) => a - b);
  const sum = runs.reduce((s, x) => s + x, 0);
  const average = sum / n;

  const variance = runs.reduce((s, x) => s + (x - average) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);

  const median = (
    n % 2 === 1
      ? sorted[Math.floor((n - 1) / 2)]
      : (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2
  )!;

  const percentile = (p: number) => {
    if (p <= 0) return sorted[0];
    if (p >= 100) return sorted[n - 1];
    const rank = (p / 100) * (n - 1);
    const lower = Math.floor(rank);
    const upper = Math.ceil(rank);
    if (lower === upper) return sorted[lower];
    const weight = rank - lower;
    return sorted[lower]! * (1 - weight) + sorted[upper]! * weight;
  };

  const p50 = percentile(50)!;
  const p75 = percentile(75)!;
  const p90 = percentile(90)!;
  const p95 = percentile(95)!;
  const iqr = p75! - percentile(25)!;

  const min = sorted[0]!;
  const max = sorted[n - 1]!;
  const cv = average === 0 ? 0 : stddev / average;

  const stats: BenchmarkStats = {
    runs,
    n,
    average,
    stddev,
    median,
    iqr,
    p50,
    p75,
    p90,
    p95,
    min,
    max,
    cv,
  };

  return stats;
}
