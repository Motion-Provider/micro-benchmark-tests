# Micro-benchmarks Tests.

Covering A/B micro-benchmark tests across Motion Provider components to find the most suit usage in terms of bundling and performance.

**Main goal** is reducing the bundle size across **Motion Provider** components by replacing a huge `import { motion } from "motion/react"` package with `import * as m from "motion/react-m";` or other relevant _motion_ component.
