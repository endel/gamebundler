import fs from "fs";
import path from "path";

import { manifest } from "./manifest";
import { FilePath, evaluateFilePath, outputFile } from "./file";

export type RawReturnType = {
  type: "raw",
  path: string,
}

export async function raw(filename: FilePath): Promise<RawReturnType> {
  const filepath = evaluateFilePath(filename) as string;
  return await manifest.cache([filepath], async () => {
    const extension = path.extname(filepath).substring(1);
    return {
      type: "raw",
      path: await outputFile(extension, await fs.promises.readFile(filepath)) as unknown as string
    };
  });
}

