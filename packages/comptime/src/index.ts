import fs from "fs/promises";
import generateSpritesheet from "@gamebundler/spritesheet";

class File {
  constructor(
    private extension: string,
    private contents: string,
  ) {}

  async write(filename) {
    await fs.writeFile(`${filename}.${this.extension}`, this.contents);
  }

  toJSON() {
    return `filename.${this.extension}`;
  }
}

export const enqueuedFiles: File[] = [];

function outputFile(extension: string, contents: string) {
  const file = new File(extension, contents);

  enqueuedFiles.push(file);

  return file;
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