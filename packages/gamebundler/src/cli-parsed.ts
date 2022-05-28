import path from 'path';
import fs from 'fs';
import cac from 'cac';

import { templatePath } from './paths.js';

const cli = cac();

cli.option("--html <file>", "Use specified HTML file", { default: path.resolve(templatePath, "index.html") });
cli.option("--out <directory>", "Output directory", { default: path.resolve("public") });
cli.option("--cache-dir <directory>", "Local cache directory", { default: path.resolve(".cache") });
cli.option("--tsconfig <custom-tsconfig.json>", "tsconfig.json file path.", { default: path.resolve(templatePath, "tsconfig.json") });

cli.version('1.0.0');
cli.help();

// steam? cordova? electron? 👀
// cli.option("--target", "Build target (web) ", { default: "web" });

const parsed: any = cli.parse();

if (cli.options.help || cli.options.version) {
  process.exit();
}

// resolve paths
parsed.options.out = path.resolve(parsed.options.out);
parsed.options.cacheDir = path.resolve(parsed.options.cacheDir);

// ensure "assets" directory exists
if (!fs.existsSync(getOutputDirectory())) { fs.mkdirSync(getOutputDirectory()); }
if (!fs.existsSync(getAssetsDirectory())) { fs.mkdirSync(getAssetsDirectory()); }
if (!fs.existsSync(getCacheDir())) { fs.mkdirSync(getCacheDir()); }

// build id
parsed.id = Math.floor(Math.random() * 1);

// create output directory
let needCreateDir = false;
try {
  const outStat = fs.lstatSync(parsed.options.out);
  if (!outStat.isDirectory()) {
    needCreateDir = true;
  }
} catch (e: any) {
  if (e.code === "ENOENT") {
    needCreateDir = true;
  } else {
    throw e;
  }
}
if (needCreateDir) {
  console.warn("Creating output directory:", parsed.options.out);
  fs.mkdirSync(parsed.options.out);
}

/* extract this all to @comptime  */
export function getOutputDirectory(): string {
  return parsed.options.out;
}

export function getAssetsDirectory(): string {
  return path.resolve(parsed.options.out, "assets");
}

export function getCacheDir(): string {
  return parsed.options.cacheDir;
}

export default parsed;
