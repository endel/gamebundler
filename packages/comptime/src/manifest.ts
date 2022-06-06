import fs from "fs";
import { getFingerprint } from "./file";

const manifests: { [key: string]: Manifest } = {};
let currentManifest: Manifest;

export function initialize(path: string) {
  if (!manifests[path]) {
    manifests[path] = new Manifest();
  }

  currentManifest = manifests[path];
}

export function getCurrentManifest() {
  return currentManifest;
}

export class Manifest {
  caches: {[key: string]: any} = {};

  // TODO: invalidate cache

  async cache<T>(files: string[], options: any, callback: () => Promise<T>): Promise<T> {
    const fingerprints = await Promise.all(files.map(async (filepath) => {
      const stat = await fs.promises.stat(filepath);
      return `${filepath}${stat.mtimeMs}${stat.size}`;
    }));

    const fingerprint = getFingerprint(fingerprints.join(',') + JSON.stringify(options));

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