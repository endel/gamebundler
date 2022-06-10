import fs from 'fs';
import path from 'path';
import cac from 'cac';
import { config } from "@gamebundler/comptime";

import { templatePath } from './paths.js';

const cli = cac();

cli.option("--html <file>", "Use specified HTML file", { default: path.resolve(templatePath, "index.html") });
cli.option("--out <directory>", "Output directory", { default: path.resolve("public") });
cli.option("--cache-dir <directory>", "Local cache directory", { default: path.resolve(".cache") });
cli.option("--tsconfig <custom-tsconfig.json>", "tsconfig.json file path.", { default: path.resolve(templatePath, "tsconfig.json") });
cli.option("--package-json <path/to/package.json>", "package.json file path.", { default: path.resolve('package.json') });
cli.option("--release", "Build for release / production", { default: false });

cli.version('1.0.0');
cli.help();

// steam? cordova? electron? 👀
// cli.option("--target", "Build target (web) ", { default: "web" });

const parsed: any = cli.parse();

if (cli.options.help || cli.options.version) { process.exit(); }

// resolve and set paths
config.setOutputDirectory(path.resolve(parsed.options.out));
config.setCacheDir(path.resolve(parsed.options.cacheDir));
config.setPackageJSON(parsed.options.packageJson);
config.setReleaseMode(parsed.options.release);

// ensure "assets" directory exists
if (!fs.existsSync(config.getOutputDirectory())) { fs.mkdirSync(config.getOutputDirectory()); }
if (!fs.existsSync(config.getAssetsDirectory())) { fs.mkdirSync(config.getAssetsDirectory()); }
if (!fs.existsSync(config.getCacheDir())) { fs.mkdirSync(config.getCacheDir()); }

// build id
parsed.id = Math.floor(Math.random() * 1);

export default parsed;
