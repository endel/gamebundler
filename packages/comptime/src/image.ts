import fs from "fs";
import path from "path";
import generateSpritesheet from "@gamebundler/spritesheet";

import { getCurrentManifest } from "./manifest";
import { getSourceDirectory } from "./config";
import { AllowedFilePaths, evaluateFilePath, evaluateFilePaths, outputFile } from "./file";

type ImageOptimization = "lossless" | "lossy-high" | "lossy-low" // PngQuant, Zopfli, BASIS

export type OutputFormat = "png" | "jpeg";

export async function image(
  path: string,
  options?: {
    format?: OutputFormat,
    optimization?: ImageOptimization,
  }
) {
  const filepath = evaluateFilePath(path) as string;
  return await getCurrentManifest().cache([filepath], options, async () => {
    return outputFile("png", await fs.promises.readFile(filepath));
  });
}

export async function spritesheet(
  paths: AllowedFilePaths,
  options: {
    outputFormat?: OutputFormat,
    optimize?: ImageOptimization,
    margin?: number;
    crop?: boolean;
    scale?: number;
  } = {}
) {
  // Force PNG for now
  options.outputFormat = "png";

  const files = evaluateFilePaths(paths);

  return await getCurrentManifest().cache(files, options, async () => {
    const result = await generateSpritesheet(files, {
      ...options,
      baseUrl: `${getSourceDirectory()}${path.sep}`,
    });

    return {
      type: "spritesheet",
      image: outputFile("png", result.image, `${result.hash}.${options.outputFormat}`),
      json: outputFile("json", JSON.stringify(result.json)) as unknown as string,
    };
  });
}
