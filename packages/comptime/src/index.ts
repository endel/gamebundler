import generateSpritesheet from "@gamebundler/spritesheet";

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
    type: "spritesheet",
    image: result.image.toString(),
    json: result.json
  };
}