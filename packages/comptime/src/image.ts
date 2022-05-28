import generateSpritesheet from "@gamebundler/spritesheet";

import { outputFile } from "./file";

export type OutputFormat = "png" | "jpeg";

export async function image(path: string, options?: any) {
  return path;
}

export async function spritesheet(
  paths: Array<string | { default: string }>,
  options: {
    outputFormat?: OutputFormat,
    optimize?: "lossless" | "lossy-high" | "lossy-low" // PngQuant, Zopfli, BASIS
    margin?: number;
    crop?: boolean;
  } = {}
) {
  // Force PNG for now
  options.outputFormat = "png";

  const files = paths.map((file) => typeof (file) === "string" ? file : file.default);
  const result = await generateSpritesheet(files, {
    ...options,
    baseUrl: get
  });

  return {
    image: outputFile("png", result.image.toString(), `${result.hash}.${options.outputFormat}`),
    json: outputFile("json", JSON.stringify(result.json)) as unknown as string,
  };
}
