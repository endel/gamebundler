import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import * as config from "./config";

export type FilePath =
  string
  | { default: string } // require
  | Array<{ default: string }> // import + wildcard
  | { default: Array<{ default: string }> } // require + wildcard

export function evaluateFilePath(file: FilePath) {
  if (typeof (file) === "string") {
    return file;

  } else if (Array.isArray(file)) {
    return file.map((f) => f.default);

  } else if (Array.isArray(file.default)) {
    return file.default.map((f) => f.default);

  } else if (typeof (file.default) === "string") {
    return file.default;

  } else {
    // FIXME: buffer/streams are hitting here
    return file;
  }
}

export function evaluateFilePaths(paths: FilePath[] | FilePath) {
  if (!Array.isArray(paths)) {
    return evaluateFilePaths([paths])
  }

  // first pass, check for wildcard paths
  return paths.flatMap((file) => evaluateFilePath(file));
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
    if (config.isReleaseMode()) {
      // TODO: compress the file
    }
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