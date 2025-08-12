import type { IterateProps } from "@/interfaces/index.ts";

/**
 * Run fn repeatedly with intervalMs delay between calls,
 * totalIterations times.
 * Measures execution time of each invocation and at the end,
 * calls onComplete with stats: average and stddev of run times.
 * @param {IterateProps} props - The props.
 * @param {number} props.totalIterations - The total number of iterations.
 * @param {number} props.intervalMs - The interval between calls in ms.
 * @param {() => Promise<void>} props.fn - The function to run.
 * @param {(stats: BenchmarkStats) => void} [props.onComplete] - The function to call with stats.
 * @returns {Promise<void>} - A promise that resolves when all iterations are done.
 */
export async function Iterate({
  totalIterations,
  intervalMs,
  fn,
  onComplete,
}: IterateProps): Promise<void> {
  const runs: number[] = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const start = performance.now();

      try {
        await Promise.resolve(fn());
      } catch (e) {
        clearInterval(interval);
        reject(e);
        return;
      }

      const end = performance.now();
      runs.push(end - start);

      count++;
      if (count >= totalIterations) {
        clearInterval(interval);
        const average = runs.reduce((a, b) => a + b, 0) / runs.length;
        const stddev = Math.sqrt(
          runs.map((x) => (x - average) ** 2).reduce((a, b) => a + b, 0) /
            runs.length
        );
        if (onComplete) onComplete({ runs, average, stddev });
        resolve();
      }
    }, intervalMs);
  });
}
