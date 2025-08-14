# Micro-benchmarks Tests.

Covering A/B micro-benchmark tests across Motion Provider components to find the most suit usage in terms of bundling and performance.

**Main goal** is reducing the bundle size across **Motion Provider** components by replacing a huge `import { motion } from "motion/react"` package with `import * as m from "motion/react-m";` or other relevant _motion_ component.

## Phases

1. **A/B benchmark**: _initials_ (motion/react-m vs motion/react)
2. **A/B benchmark**: _animations from tree_ (motion/react-m vs motion/react)
3. **A/B benchmark**: _animations and transitions from tree_ (motion/react-m vs motion/react)
4. **A/B benchmark**: _extending/including number 3 & using `createElement` from React_ (motion/react-m vs motion/react)
5. **A/B benchmark**: _extending/including number 4 & using props_ (motion/react-m vs motion/react)\*\*
6. **A/B benchmark**: \_extending/including number 5 & using controllers (motion/react-m vs motion/react)\*\*

### Phase 1 — A/B benchmark: initials (motion/react-m vs motion/react)

**Purpose**

Phase 1 compares the server-side rendering (SSR) performance of the _initials_ codepaths implemented with `motion/react-m` ("mini") vs `motion/react` ("full"). The goal is an A/B style comparison that measures batch-level timings (each batch = N `renderToString` calls) and derives robust summary statistics.

---

## Quick summary (headline)

- **Test set:** `render-motion-initials` (full motion) vs `render-m-initials` (mini motion)
- **Inner batch size:** 1000 `renderToString` calls per measured batch
- **Outer iterations:** 100 measured batches per file
- **High-level result:** `render-m-initials` (mini) showed a lower _batch_ average than `render-motion-initials` (full). The batch-level mean difference is **\~15.755 ms** (mini is faster), which is **\~13.61%** relative to the full-motion batch average. Per-render this is ≈ **0.01576 ms** faster (mini). See tables below for full metrics.

---

## Data tables (batch-level and per-render)

### Batch-level summary (ms)

| Key                             | n (batches) | avg (ms) | stddev (ms) | median (ms) | p90 (ms) | min (ms) | max (ms) |    CV |
| ------------------------------- | ----------: | -------: | ----------: | ----------: | -------: | -------: | -------: | ----: |
| `render-motion-initials` (full) |         100 |  115.777 |      90.476 |      84.806 |  237.221 |   27.063 |  315.739 | 0.781 |
| `render-m-initials` (mini)      |         100 |  100.022 |      84.653 |      39.120 |  216.626 |   25.857 |  326.682 | 0.846 |

### Per-render summary (ms) — divide batch-level numbers by inner batch size (1000)

| Key                             | avg / render (ms) | median / render (ms) | p90 / render (ms) | min / render (ms) | max / render (ms) |
| ------------------------------- | ----------------: | -------------------: | ----------------: | ----------------: | ----------------: |
| `render-motion-initials` (full) |          0.115777 |             0.084806 |          0.237221 |          0.027063 |          0.315739 |
| `render-m-initials` (mini)      |          0.100022 |             0.039120 |          0.216626 |          0.025857 |          0.326682 |

**Relative improvement (mini vs full):** mini is \~**13.61%** faster at the batch-level (mean), equivalent to \~**0.01576 ms** saved per render on average.

---

## What the numbers mean (plain language)

- The **mini** implementation (`render-m-initials`) shows a lower mean batch time and therefore a better per-render average in this run: \~0.1000 ms/render vs \~0.1158 ms/render for the full version.
- However, **both** implementations show very large variability: coefficient of variation (CV) is **\~0.78** (full) and **\~0.85** (mini). That means standard deviation is \~78–85% of the mean — in practice the batch durations are highly noisy and contain outliers.
- The **median** (robust central value) is much lower for `render-m-initials` (39.12 ms) than for `render-motion-initials` (84.81 ms). This indicates the distributions are skewed and that a few long batches drive the mean upward.
- There are substantial high-end outliers (max > 300 ms in both cases), which suggests intermittent pauses or heavy work on some iterations (GC, JIT compilation, system activity, or other outliers).

---

## Executive summary (one paragraph)

Phase 1 (initials) shows the `motion/react-m` (mini) implementation provides a modest mean-speed advantage (\~13.6% faster per batch; \~0.0158 ms per render) vs `motion/react` in this run. However, both implementations exhibit high variance with heavy tails and outliers, so the mean alone is not a reliable single-number verdict. Investigate outliers, visualize the `runs[]` distributions, and apply bootstrap tests or medians/IQR to reach a robust conclusion.

---

# Phase 2 — A/B benchmark: animations from tree (motion/react-m vs motion/react)

**Purpose**

Phase 2 compares server-side rendering (SSR) performance of the _animations from tree_ codepaths implemented with `motion/react-m` ("mini") and `motion/react` ("full"). This document describes results, interpretation, and recommended next steps for the two tested files: `render-m-from-tree` (mini) and `render-motion-from-tree` (full).

---

## Quick summary (headline)

- **Test set:** `render-m-from-tree` (mini) vs `render-motion-from-tree` (full)
- **Inner batch size:** 1000 `renderToString` calls per measured batch
- **Outer iterations:** 100 measured batches per file
- **High-level result:** In this run the **full** implementation (`render-motion-from-tree`) is _faster_ on average than the mini implementation by **11.15248 ms per batch** (\~**8.59%** relative improvement). That's about **0.01115 ms** saved _per render_ on average.

---

## Data tables (batch-level and per-render)

### Batch-level summary (ms)

| Key                              | n (batches) | avg (ms) | stddev (ms) | median (ms) | p90 (ms) | min (ms) | max (ms) |     CV |
| -------------------------------- | ----------: | -------: | ----------: | ----------: | -------: | -------: | -------: | -----: |
| `render-m-from-tree` (mini)      |         100 | 129.8465 |     99.0550 |     99.9573 | 266.3945 |  26.8568 | 347.5220 | 0.7629 |
| `render-motion-from-tree` (full) |         100 | 118.6940 |     90.4230 |     90.2371 | 230.1112 |  29.6585 | 379.0284 | 0.7618 |

> **Batch-level difference (mini − full):** **+11.15248 ms** (mini slower). Relative: **8.59%**.

### Per-render summary (ms) — divide batch-level numbers by inner batch size (1000)

| Key                              | avg / render (ms) | median / render (ms) | p90 / render (ms) | min / render (ms) | max / render (ms) |
| -------------------------------- | ----------------: | -------------------: | ----------------: | ----------------: | ----------------: |
| `render-m-from-tree` (mini)      |         0.1298465 |            0.0999573 |         0.2663945 |         0.0268568 |         0.3475220 |
| `render-motion-from-tree` (full) |         0.1186940 |            0.0902371 |         0.2301112 |         0.0296585 |         0.3790284 |

**Interpretation:** The full implementation performs better on average (batch-level mean), saving **\~0.01115 ms** per render. However, these per-render numbers are extremely small in absolute terms; focus on relative and distributional differences rather than single-digit per-render values.

---

## What the numbers say (plain language)

- The **full** `motion/react` variant produced a lower _mean batch time_ in this run. The observed mean difference is modest (\~8.6%) but consistent with the batch-level numbers.
- Both implementations show **large variance**: CV ≈ 0.76 for each. High CVs indicate noisy runs and heavy-tailed distributions; the mean alone is not a robust summary.
- **Median** values are much closer than means (mini median ≈ 99.96 ms vs full median ≈ 90.24 ms), showing distribution skew and that some long batches push the mean upward.
- **High-end outliers** exist (max up to \~379 ms). Outliers likely caused by GC, JIT compilation, system scheduling, or transient system load.
- The inner batch size (1000) is large enough to amortize short-timer jitter, but large outliers persist, indicating root causes beyond timer resolution.

---

## Executive summary

In Phase 2 (animations from tree) the `motion/react` (full) implementation was faster on average than `motion/react-m` (mini) by **\~11.15 ms per batch** (\~**8.6%** relative), which is approximately **0.011 ms** per render when batches contain 1000 renders. Both variants display substantial variance and heavy tails (CV ≈ 0.76), so rely on median/percentiles and bootstrap CIs in addition to mean to draw robust conclusions. Instrument outliers and consider process isolation if you need deterministic comparisons.

---
