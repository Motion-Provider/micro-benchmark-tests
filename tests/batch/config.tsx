import testsConfig from "@/tests.config.ts";
import RenderMFromTree from "#/phases/render-m-from-tree.tsx";
import RenderMotionFromTree from "#/phases/render-motion-from-tree.tsx";
import type { BatchConfig, TestConfigurations } from "@/interfaces/index.ts";

/**
 * @type BatchConfig
 * @description Batch configuration for benchmarking server-side rendering speed
 * @see tests.config.ts
 * Warning: Always add key value to each JSX component that you want to benchmark!!!
 */
export default {
  ...(testsConfig as TestConfigurations),
  files: [
    <RenderMFromTree key="render-m-from-tree" />,
    <RenderMotionFromTree key="render-motion-from-tree" />,
  ],
  testName: "Benchmarking server-side rendering speed",
  testDescription:
    "Repeatedly calling renderToString for two components (one using the lightweight motion/react-m API and one using motion/react) afterwards collecting timing statistics (average & standard deviation) across several iterations.",
} as const satisfies Readonly<BatchConfig>;
