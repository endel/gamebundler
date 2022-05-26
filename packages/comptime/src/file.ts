import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const enqueuedFiles: File[] = [];

export class File {
  private filename: string;

  constructor(
    private extension: string,
    private contents: string,
  ) {
    const fingerprint = crypto.createHash('sha1').update(contents).digest('base64url');
    this.filename = `${fingerprint.toString()}.${this.extension}`;
  }

  async write(outputDir: string) {
    console.log("WRITE: outputDir:", outputDir);
    console.log("writeFile:", path.resolve(outputDir, this.filename));
    await fs.writeFile(path.resolve(outputDir, this.filename), this.contents);
  }

  toJSON() {
    return `assets/${this.filename}`;
  }
}

export function outputFile(extension: string, contents: string) {
  const file = new File(extension, contents);

  enqueuedFiles.push(file);

  return file;
}

export async function persistEnqueuedFiles(outputDir: string) {
  const files = enqueuedFiles.slice(0);

  enqueuedFiles.length = 0;

  await Promise.all(files.map(async (file) => await file.write(outputDir)));
}