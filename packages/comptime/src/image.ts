import path from "path";
import generateSpritesheet from "@gamebundler/spritesheet";

import { getSourceDirectory } from "./config";
import { AllowedFilePaths, evaluateFilePaths, outputFile } from "./file";

export type OutputFormat = "png" | "jpeg";

export async function image(path: string, options?: any) {
  return path;
}

export async function spritesheet(
  paths: AllowedFilePaths,
  options: {
    outputFormat?: OutputFormat,
    optimize?: "lossless" | "lossy-high" | "lossy-low" // PngQuant, Zopfli, BASIS
    margin?: number;
    crop?: boolean;
    scale?: number;
  } = {}
) {
  // Force PNG for now
  options.outputFormat = "png";

  const files = evaluateFilePaths(paths);
  const result = await generateSpritesheet(files, {
    ...options,
    baseUrl: `${getSourceDirectory()}${path.sep}`,
  });

  return {
    type: "spritesheet",
    image: outputFile("png", result.image, `${result.hash}.${options.outputFormat}`),
    json: outputFile("json", JSON.stringify(result.json)) as unknown as string,
  };
}
