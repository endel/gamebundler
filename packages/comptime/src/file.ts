import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

type FilePath =
  string
  | { default: string } // require
  | Array<{ default: string }> // import + wildcard
  | { default: Array<{ default: string }> } // require + wildcard

export type AllowedFilePaths = Array<FilePath>;

export function evaluateFilePaths(paths: AllowedFilePaths | FilePath) {
  if (!Array.isArray(paths)) {
    return evaluateFilePaths([paths])
  }

  // first pass, check for wildcard paths
  return paths.flatMap((file) => {
    if (typeof (file) === "string") {
      return file;

    } else if (Array.isArray(file)) {
      return file.map((f) => f.default);

    } else if (Array.isArray(file.default)) {
      return file.default.map((f) => f.default);

    } else if (typeof (file.default) === "string") {
      return file.default;
    }
  });
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