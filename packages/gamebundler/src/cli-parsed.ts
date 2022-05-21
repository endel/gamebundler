import path from 'path';
import fs from 'fs';

const cli = require('cac')();

cli.option("--html <file>", "Use specified HTML file", { default: path.resolve("template", "index.html") });
cli.option("--out <directory>", "Output directory", { default: path.resolve("public") });
cli.option("--tsconfig <custom-tsconfig.json>", "tsconfig.json file path.", { default: path.resolve("template", "tsconfig.json") });

cli.version('1.0.0');
cli.help();

// steam? cordova? electron? 👀
// cli.option("--target", "Build target (web) ", { default: "web" });

const parsed = cli.parse();

if (cli.options.help || cli.options.version) {
  process.exit();
}

// resolve output path
parsed.options.out = path.resolve(parsed.options.out);

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

export default parsed;