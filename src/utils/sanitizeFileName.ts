import type { SanitizeFileName } from "@/interfaces/index.ts";

const sanitizeFileName: SanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();

export default sanitizeFileName;
