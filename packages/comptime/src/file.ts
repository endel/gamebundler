import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const enqueuedFiles: File[] = [];

export class File {
  constructor(
    private extension: string,
    private contents: string,
    private filename?: string
  ) {
    if (!filename) {
      const fingerprint = crypto.createHash('sha1').update(contents).digest('base64url');
      this.filename = `${fingerprint.toString()}.${this.extension}`;
    }
  }

  async write(outputDir: string) {
    await fs.writeFile(path.resolve(outputDir, this.filename), this.contents);
  }

  toJSON() {
    return `assets/${this.filename}`;
  }
}

export function outputFile(extension: string, contents: string, filename?: string) {
  const file = new File(extension, contents, filename);

  enqueuedFiles.push(file);

  return file;
}

export async function persistEnqueuedFiles(outputDir: string) {
  const files = enqueuedFiles.slice(0);

  enqueuedFiles.length = 0;

  await Promise.all(files.map(async (file) => await file.write(outputDir)));
}