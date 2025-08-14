import fs from "fs";
import type { EnsureResultsDir } from "@/interfaces/index.ts";

const ensureResultsDir: EnsureResultsDir = async (dir) => {
  await fs.promises.mkdir(dir, { recursive: true });
};

export default ensureResultsDir;
