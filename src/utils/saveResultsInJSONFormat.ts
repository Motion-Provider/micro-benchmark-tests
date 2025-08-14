import fs from "fs";
import path from "path";
import type { SaveResultsJSON } from "@/interfaces/index.ts";

const saveResultsInJSONFormat: SaveResultsJSON = (filePath, data) => {
  fs.writeFileSync(
    path.resolve(filePath),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
};

export default saveResultsInJSONFormat;
