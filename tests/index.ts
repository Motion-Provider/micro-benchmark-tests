import m from "@/motion/static/m.ts";
import MDom from "@/motion/dom/m.tsx";
import benchmark from "./core/benchmark.ts";
import testsConfig from "@/tests.config.ts";
import motion from "@/motion/static/motion.ts";
import MotionDom from "@/motion/dom/motion.tsx";

const { times } = testsConfig;

/* core benchmarks */
benchmark(true, "(motion/react-m) creating div execution", times, m);
benchmark(true, "(motion/react) creating div execution", times, motion);

/* dom benchmark */
benchmark(true, "(motion/react-m) DOM creating div execution", times, MDom);
benchmark(true, "(motion/react) DOM creating div execution", times, MotionDom);
