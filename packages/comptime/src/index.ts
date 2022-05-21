import generateSpritesheet from "@gamebundler/spritesheet";

export async function spritesheet(
  paths: string[],
  options?: {
    optimize?: "lossless" | "lossy-high" | "lossy-low" // PngQuant, Zopfli, BASIS
    margin?: number;
    crop?: boolean;
  }
) {
  const result = await generateSpritesheet(paths, options);

  return {
    image: result.image.toString(),
    json: result.json
  };
}