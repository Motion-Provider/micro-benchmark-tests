import testsConfig from "@/tests.config.ts";
import RenderMInitials from "#/phases/render-m-initials.tsx";
import RenderMFromTree from "#/phases/render-m-from-tree.tsx";
import RenderMotionInitials from "#/phases/render-motion-initials.tsx";
import RenderMotionFromTree from "#/phases/render-motion-from-tree.tsx";
import type { BatchConfig, TestConfigurations } from "@/interfaces/index.ts";

export default {
  ...(testsConfig as TestConfigurations),
  files: [
    <RenderMFromTree key="render-m-from-tree" />,
    <RenderMotionFromTree key="render-motion-from-tree" />,
    <RenderMotionInitials key="render-motion-initials" />,
    <RenderMInitials key="render-m-initials" />,
  ],
  testName: "Benchmarking server-side rendering speed",
  testDescription:
    "Repeatedly calling renderToString for two components (one using the lightweight motion/react-m API and one using motion/react) afterwards collecting timing statistics (average & standard deviation) across several iterations.",
} as const satisfies Readonly<BatchConfig>;
