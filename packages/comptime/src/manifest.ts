import fs from "fs";
import { getFingerprint } from "./file";

const manifests: { [key: string]: Manifest } = {};
export let manifest: Manifest;

export function initialize(path: string) {
  if (!manifests[path]) {
    manifests[path] = new Manifest();
  }

  manifest = manifests[path];
}

export function getCurrentManifest() {
  return manifest;
}

export class Manifest {
  caches: {[key: string]: any} = {};

  // TODO: invalidate cache

  async cache<T>(files: Array<string | Buffer>, callback: () => Promise<T>): Promise<T>
  async cache<T>(files: Array<string | Buffer>, options: any, callback: () => Promise<T>): Promise<T>
  async cache<T>(files: Array<string | Buffer>, optionsOrCallback: any, callback?: () => Promise<T>): Promise<T> {
    if (typeof optionsOrCallback === "function" && typeof(callback) === "undefined") {
      // only 2 arguments provided...
      callback = optionsOrCallback;
      optionsOrCallback = {};
    }

    const fingerprints = await Promise.all(files.map(async (file) => {
      if (typeof file === "string") {
        const stat = await fs.promises.stat(file);
        return `${file}${stat.mtimeMs}${stat.size}`;

      } else {
        return `${file.byteLength}`;
      }
    }));

    const fingerprint = getFingerprint(fingerprints.join(',') + JSON.stringify(optionsOrCallback));

    let result: Promise<T> | T;

    if (!this.caches[fingerprint]) {
      result = await callback();

      this.caches[fingerprint] = result;

    } else {
      result = this.caches[fingerprint];
    }

    return result;
  }
}