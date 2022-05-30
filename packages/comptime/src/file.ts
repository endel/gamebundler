import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export type AllowedFilePaths = Array<string | { default: string }>;

export function evaluateFilePaths(paths: AllowedFilePaths) {
  return paths.map((file) => typeof (file) === "string" ? file : file.default);
}

export function getFingerprint(contents: crypto.BinaryLike) {
  return crypto.createHash("md5").update(contents).digest("base64url").toString();
}

export const enqueuedFiles: File[] = [];

export class File {
  constructor(
    private extension: string,
    private contents: crypto.BinaryLike,
    private filename?: string
  ) {
    if (!filename) {
      this.filename = `${getFingerprint(contents)}.${this.extension}`;
    }
  }

  async write(outputDir: string) {
    await fs.writeFile(path.resolve(outputDir, this.filename), this.contents);
  }

  toJSON() {
    return `assets/${this.filename}`;
  }
}

export function outputFile(extension: string, contents: crypto.BinaryLike, filename?: string) {
  const file = new File(extension, contents, filename);

  enqueuedFiles.push(file);

  return file;
}

export async function persistEnqueuedFiles(outputDir: string) {
  const files = enqueuedFiles.slice(0);

  enqueuedFiles.length = 0;

  await Promise.all(files.map(async (file) => await file.write(outputDir)));
}