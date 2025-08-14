import { sleep } from "@/utils/sleep.ts";
import computeStats from "@/utils/computeStats.ts";
import { hrNowMs } from "@/utils/hrNow.ts";
import type { BenchmarkStats, IterateProps } from "@/interfaces/index.ts";

/**
 * Runs a given function `totalIterations` amount of times, waits for `intervalMs` milliseconds between each iteration,
 * and logs the duration of each iteration. If `warmup` is true (default), it will run the function
 * `warmupIterations` amount of times before starting the benchmark. If `warmupIterations` is not provided,
 * it will run the function 10% of the `totalIterations` amount of times.
 *
 * @param {object} props                      The props to pass to the function.
 * @param {number} props.totalIterations      The amount of times to run the function.
 * @param {number} [props.intervalMs=0]       The amount of milliseconds to wait between each iteration.
 * @param {function} props.fn                 The function to run.
 * @param {function} [props.onComplete]       A function to call when the benchmark is complete.
 * @param {number} [props.warmupIterations]   The amount of times to run the function before starting the benchmark.
 * @param {boolean} [props.warmup=true]       Whether to run the function before starting the benchmark.
 * @returns {Promise<BenchmarkStats | null>}  The benchmark stats or null if the function throws an error.
 */
export async function Iterate({
  totalIterations,
  intervalMs = 0,
  fn,
  onComplete,
  warmupIterations,
  warmup = true,
}: IterateProps & {
  warmupIterations?: number;
  warmup?: boolean;
}): Promise<BenchmarkStats | null> {
  const runs: number[] = [];

  if (warmup) {
    const warmups =
      typeof warmupIterations === "number"
        ? Math.max(0, Math.floor(warmupIterations))
        : Math.max(10, Math.floor(totalIterations * 0.1));

    for (let i = 0; i < warmups; i++) {
      const maybePromise = fn();
      if (maybePromise && typeof (maybePromise as any).then === "function")
        await maybePromise;
    }

    /**
     * todo: add --expose-gc to node scripts
     */
    try {
      if (typeof (globalThis as any).gc === "function")
        (globalThis as any).gc();
    } catch {
      /**** ignore ****/
    }
  }

  for (let i = 0; i < totalIterations; i++) {
    const start = hrNowMs();
    const maybePromise = fn();
    if (maybePromise && typeof (maybePromise as any).then === "function") {
      await maybePromise;
    }
    const end = hrNowMs();
    runs.push(end - start);

    if (i < totalIterations - 1 && intervalMs > 0) {
      await sleep(intervalMs);
    }
  }

  const stats = computeStats(runs);

  if (onComplete) onComplete(stats!);

  return stats;
}
