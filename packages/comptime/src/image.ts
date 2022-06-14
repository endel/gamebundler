import fs from "fs";
import path from "path";
import generateSpritesheet from "@gamebundler/spritesheet";

import { manifest } from "./manifest";
import { getSourceDirectory } from "./config";
import { FilePath, evaluateFilePath, evaluateFilePaths, outputFile } from "./file";

export type SpriteSheetReturnType = {
  type: "spritesheet",
  image: string,
  json: string,
}
export type ImageReturnType = {
  type: "image",
  image: string,
}

type ImageOptimization = "lossless" | "lossy-high" | "lossy-low" // PngQuant, Zopfli, BASIS

export type OutputFormat = "png" | "jpeg";

export async function image(
  path: string,
  options?: {
    format?: OutputFormat,
    optimization?: ImageOptimization,
  }
): Promise<ImageReturnType> {
  const filepath = evaluateFilePath(path) as string;
  return await manifest.cache([filepath], options, async () => {
    return {
      type: "image",
      image: await outputFile("png", await fs.promises.readFile(filepath)) as unknown as string
    };
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
): Promise<SpriteSheetReturnType> {
  // Force PNG for now
  options.outputFormat = "png";

  const isKeyValue = (
    !Array.isArray(images) &&
    // wildcard import should not be considered a key-value
    (typeof (images.default) === "undefined" && typeof (images.filenames) === "undefined")
  );

  const paths = (isKeyValue)
    ? Object.values(images)
    : images;

  const files = evaluateFilePaths(paths as FilePath[]);

  return await manifest.cache(files, options, async () => {
    const result = await generateSpritesheet(isKeyValue ? images : files, {
      ...options,
      baseUrl: `${getSourceDirectory()}${path.sep}`,
    });

    return {
      type: "spritesheet",
      image: await outputFile("png", result.image, `${result.hash}.${options.outputFormat}`) as unknown as string,
      json: await outputFile("json", JSON.stringify(result.json)) as unknown as string,
    };
  });
}
