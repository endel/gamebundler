import generateSpritesheet from "@gamebundler/spritesheet";
import { outputFile } from "./file";

export async function image(path: string, options?: any) {
  return path;
}

export async function spritesheet(
  paths: Array<string | { default: string }>,
  options?: {
    optimize?: "lossless" | "lossy-high" | "lossy-low" // PngQuant, Zopfli, BASIS
    margin?: number;
    crop?: boolean;
  }
) {
  const files = paths.map((file) => typeof (file) === "string" ? file : file.default);
  const result = await generateSpritesheet(files, options);

  return {
    image: outputFile("png", result.image.toString()),
    json: outputFile("json", JSON.stringify(result.json))
  };
}
