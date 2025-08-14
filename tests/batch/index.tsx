import path from "path";
import config from "./config.tsx";
import stampNow from "@/utils/stampNow.ts";
import benchmark from "#/core/benchmark.ts";
import { Iterate } from "#/core/iterate.ts";
import { renderToString } from "react-dom/server";
import ensureResultsDir from "@/utils/ensureResultsDir.ts";
import saveResultsInJSONFormat from "@/utils/saveResultsInJSONFormat.ts";
import type { BatchReportProps, BenchmarkStats } from "@/interfaces/index.ts";
import sanitizeFileName from "@/utils/sanitizeFileName.ts";

/**
 * @see tests.config.ts
 * @description One Time Batch Configuration
 * Warning: Make sure to add a key value to each JSX component that you want to benchmark!!!
 */

const batchReport: BatchReportProps = [];

(async function runBatcher() {
  const batchResultsPath = config.batchResultsPath;
  const resultsPath = config.benchmarkResultsPath;
  const innerTimes = config.times;
  const outerIterations = config.totalIterations;
  const intervalMs = config.intervalMs ?? 0;
  const warmupIterations =
    (config as any).warmupIterations ??
    Math.max(10, Math.floor(outerIterations * 0.1));
  const savePerFile = true;

  console.log(`METADATA
Test Name: ${config.testName}
Description: ${config.testDescription}
Inner batch size (times): ${innerTimes}
Outer iterations (totalIterations): ${outerIterations}
Interval between measured batches (ms): ${intervalMs}
Warmup (per-file) iterations: ${warmupIterations}
Results folder: ${resultsPath}
`);

  await ensureResultsDir(resultsPath);
  for (const [index, file] of config.files.entries()) {
    const label = String((file.key as string) ?? `file-${index}`);
    const filenameLabel = sanitizeFileName(label);
    const filesLeft = config.files.length - index - 1;

    console.log(`
✅ Now rendering: ${label.split("-").join(" ")}
Files left after this: ${filesLeft}
`);

    try {
      console.log(`Warming up (${warmupIterations} runs) for ${label}...`);
      for (let i = 0; i < warmupIterations; i++) {
        await Promise.resolve(renderToString(file));
      }

      try {
        if (typeof (globalThis as any).gc === "function") {
          (globalThis as any).gc();
        }
      } catch {
        /**** ignore ****/
      }

      console.log(`--------------------
Running measured batches for ${label}: \n
outerIterations=${outerIterations}, 
innerTimes=${innerTimes} 

✅ Be patient capitan...
--------------------
`);

      const stats = await Iterate({
        totalIterations: outerIterations,
        intervalMs,
        warmupIterations: 0,
        warmup: false,
        fn: async () => {
          const ms = await benchmark(innerTimes, () => renderToString(file));
          return ms;
        },
        onComplete: (s: BenchmarkStats | null) => {
          batchReport.push({
            key: label,
            stats: s,
            meta: {
              innerTimes,
              outerIterations,
              intervalMs,
              warmedUp: true,
              timestamp: new Date().toISOString(),
            },
          });

          if (savePerFile && s) {
            const perFilePath = path.join(
              resultsPath,
              `${filenameLabel}-${stampNow()}.json`
            );
            const writeProceedFile = {
              key: label,
              stats: s,
              meta: { innerTimes, outerIterations },
            };

            saveResultsInJSONFormat(perFilePath, writeProceedFile);
            console.log(`✅ Saved per-file results to ${perFilePath}`);
          }
        },
      });

      if (!stats) {
        console.warn(`No stats were produced for ${label}. Skipping save.`);
      } else {
        const perRenderAverage = stats.average / innerTimes;
        // use later
        // const perRenderMedian = stats.median / innerTimes;

        console.log(
          `--------------------
[${label}] \n 
batch-average: ${stats.average.toFixed(3)}ms 
per-inner render ≈ ${perRenderAverage.toFixed(3)}ms
median: ${stats.median.toFixed(3)}ms
--------------------
`
        );

        if (!savePerFile) {
          const perFilePath = path.join(
            resultsPath,
            `${filenameLabel}-${stampNow()}.json`
          );

          const writeProceedFile = {
            key: label,
            stats,
            meta: { innerTimes, outerIterations },
          };
          saveResultsInJSONFormat(perFilePath, writeProceedFile);
        }
      }
    } catch (err) {
      console.error(`❌ Error while benchmarking ${label}:`, err);
      batchReport.push({
        key: label,
        error: String(err),
        meta: {
          innerTimes,
          outerIterations,
          timestamp: new Date().toISOString(),
        },
      });
      continue;
    }
  }

  const finalStamp = stampNow();
  const finalPath = path.join(
    batchResultsPath,
    `batch-report-${finalStamp}.json`
  );

  const pureDate = new Date().toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const writeFinalFile = {
    testName: config.testName,
    testDescription: config.testDescription,
    totalTestedFiles: config.files.length,
    pureDate: pureDate,
    successCount: batchReport.filter((r) => !("error" in r)).length,
    testedFiles: config.files.map((file) => (file.key as string) ?? "unknown"),
    meta: {
      env: config.testEnvironment,
      testRegex: config.testRegex,
      innerTimes,
      outerIterations,
    },
    batchReport,
  };

  saveResultsInJSONFormat(finalPath, writeFinalFile);

  console.log(`✅ Batch complete — saved aggregated report to ${finalPath}`);
  console.log("Summary:");

  for (const r of batchReport) {
    const k = (r as any).key ?? "unknown";
    const s = (r as any).stats as BenchmarkStats | null | undefined;

    if (s) {
      console.log(
        `--------------------
${k}: avg=${(s.average / innerTimes).toFixed(3)}ms (per render)
batchAvg=${s.average.toFixed(3)}ms
std=${s.stddev.toFixed(3)}ms
--------------------`
      );
    } else console.log(`❌ ${k}: no stats (error or skipped)`);
  }

  try {
    await new Promise((r) => setTimeout(r, 50));
    process.exit(0);
  } catch {
    /* ignore */
  }
})();
