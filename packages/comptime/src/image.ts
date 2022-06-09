import fs from "fs";
import path from "path";
import generateSpritesheet from "@gamebundler/spritesheet";

import { manifest } from "./manifest";
import { getSourceDirectory } from "./config";
import { FilePath, evaluateFilePath, evaluateFilePaths, outputFile } from "./file";

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
  return await manifest.cache([filepath], options, async () => {
    return outputFile("png", await fs.promises.readFile(filepath));
  });
}

export async function spritesheet(
  images: FilePath[] | {[frameName: string]: FilePath},
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

  const isKeyValue = !Array.isArray(images);

  const paths = (isKeyValue)
    ? Object.values(images)
    : images;

  const files = evaluateFilePaths(paths);

  return await manifest.cache(files, options, async () => {
    const result = await generateSpritesheet(isKeyValue ? images : files, {
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
