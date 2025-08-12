import MDom from "@/motion/dom/m.tsx";
import testsConfig from "@/tests.config.ts";
import benchmark from "#/core/benchmark.ts";
import MotionDom from "@/motion/dom/motion.tsx";
import { renderToString } from "react-dom/server";
import { Iterate } from "#/core/iterate.ts";

const { times, intervalMs, totalIterations } = testsConfig;

/* dom render */

// benchmark("(motion/react-m) DOM rendering", times, () =>
//   renderToString(<MDom />)
// );
// benchmark("(motion/react) DOM rendering", times, () =>
//   renderToString(<MotionDom />)
// );

/* Iterated dom renders */

Iterate({
  totalIterations,
  intervalMs,
  fn: () =>
    benchmark(false, "(motion/m) DOM rendering", times, () =>
      renderToString(<MDom />)
    ),
  onComplete: ({ average, stddev }) => {
    console.log(`Average execution time: ${average.toFixed(3)} ms`);
    console.log(`Standard deviation: ${stddev.toFixed(3)} ms`);
  },
});

Iterate({
  totalIterations,
  intervalMs,
  fn: () =>
    benchmark(false, "(motion/react) DOM rendering", times, () =>
      renderToString(<MotionDom />)
    ),
  onComplete: ({ average, stddev }) => {
    console.log(`Average execution time: ${average.toFixed(3)} ms`);
    console.log(`Standard deviation: ${stddev.toFixed(3)} ms`);
  },
});
