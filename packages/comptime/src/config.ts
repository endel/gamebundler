import path from "path";

let sourceDirectory: string;
let outputDirectory: string;
let assetsDirectory: string;
let cacheDirectory: string;

export function setSourceDirectory(dir: string) { sourceDirectory = dir; }
export function getSourceDirectory() { return sourceDirectory; }

export function setOutputDirectory(dir: string) { outputDirectory = dir; }
export function getOutputDirectory() { return outputDirectory; }

export function setAssetsDirectory(dir: string) { assetsDirectory = dir; }
export function getAssetsDirectory() {
  return assetsDirectory || path.resolve(outputDirectory, "assets");
}

export function setCacheDir(dir: string) { cacheDirectory = dir; }
export function getCacheDir() { return cacheDirectory; }