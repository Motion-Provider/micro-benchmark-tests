import benchmark from "./core/benchmark.ts";
import testsConfig from "@/tests.config.ts";

const { times } = testsConfig;

benchmark("init test", times, () => {
  console.log("init test");
});
