/**
 * Returns the current time in milliseconds.
 * It uses the most accurate method available, which is:
 * - `process.hrtime.bigint()` in Node.js
 * - `performance.now()` in browsers
 * - `Date.now()` as a fallback
 * @returns {number} The current time in milliseconds.
 */
export const hrNowMs = (() => {
  if (typeof process !== "undefined" && (process as any).hrtime) {
    return () => Number((process as any).hrtime.bigint()) / 1e6;
  }
  if (typeof performance !== "undefined" && performance.now) {
    return () => performance.now();
  }
  return () => Date.now();
})();
