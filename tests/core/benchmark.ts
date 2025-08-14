import { hrNowMs } from "@/utils/hrNow.ts";
import type { BenchmarkFn } from "@/interfaces/index.ts";

/**
 * Run `fn` `times` times and return total elapsed time in ms.
 * Supports both sync and async `fn`.
 */
const benchmark: BenchmarkFn = async (
  times: number,
  fn: () => void | Promise<void>
) => {
  const start = hrNowMs();

  for (let i = 0; i < times; i++) {
    const maybePromise = fn();
    if (maybePromise && typeof (maybePromise as any).then === "function") {
      await maybePromise;
    }
  }

  const end = hrNowMs();
  return end - start;
};

export default benchmark;
