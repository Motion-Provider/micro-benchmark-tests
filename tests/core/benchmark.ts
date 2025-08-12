import type { BenchmarkFn } from "@/interfaces/index.ts";
import { performance } from "perf_hooks";

/**
 * Runs a given function `times` amount of times and logs the duration.
 * @param {number} times - The amount of times to run the function.
 * @param {function} fn - The function to run.
 * @param {string} label - A label to display in the log.
 */
const benchmark: BenchmarkFn = (label, times, fn) => {
  const start = performance.now();
  for (let i = 0; i < times; i++) fn();

  const end = performance.now();
  const duration = (end - start).toFixed(3);
  console.log(`${label}: ${duration}ms`);
};

export default benchmark;
