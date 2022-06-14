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

    // write final file/asset
    await fs.writeFile(path.resolve(outputDir, this.filename), this.contents);

    // free file contents from memory
    delete this.contents;
  }

  toJSON() {
    return `assets/${this.filename}`;
  }
}

export async function outputFile(extension: string, contents: crypto.BinaryLike, filename?: string) {
  const file = new File(extension, contents, filename);

  await file.write(config.getAssetsDirectory());

  return file;
}