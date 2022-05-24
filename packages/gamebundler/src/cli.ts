import fs from 'fs';
import path from 'path';

import open from 'open';
import esbuild from '@netlify/esbuild';

import http from 'http';
import httpServer from 'http-server';

import { fileLoaderPlugin } from './plugins/file-loader.js';
import { bundleLoaderPlugin } from './plugins/bundle-loader.js';

import cli from './cli-parsed.js';
import { rebuild, isDevelopment } from './dev.js';

const server = isDevelopment && httpServer.createServer({
  root: cli.options.out,
  cors: true,
  autoIndex: true,
  showDir: true,

  before: [function(req: http.IncomingMessage, res: http.ServerResponse, next: any) {
    // intercept reload script.
    if (req.url === "/reload/reload.js") {
      res.setHeader("Content-Type", "text/javascript");
      res.write(fs.readFileSync(path.resolve("template", "reload.js")));
      res.end();
      return;

    } else if (req.url === "/__reload") {
      // wait for rebuild to complete the reload request..
      rebuild.on("rebuild", () => res.end());

    } else if (req.url === "/" || req.url === "/index.html") {
      // serve static HTML file
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-cache");
      res.write(fs.readFileSync(cli.options.html));
      res.end();
      return;

    } else {
      next();
    }
  }]
}) || undefined;

//
// TODO?
// - HTML Minifier https://htmlnano.netlify.app
//

// TODO: support importing CSS

esbuild
  .build({
    // format: "iife", // FIXME: only required for TLA (top-level await)
    entryPoints: cli.args,
    // tsconfig: parsed.options.tsconfig,
    platform: "browser",
    outfile: path.resolve(cli.options.out, "bundle.js"),
    absWorkingDir: process.cwd(),
    bundle: true,
    minify: !isDevelopment,
    sourcemap: true,
    banner: {
      js: "// built with gamebundler (https://github.com/endel/gamebundler)",
      css: "// built with gamebundler (https://github.com/endel/gamebundler)",
    },
    plugins: [ bundleLoaderPlugin, fileLoaderPlugin ],
    // treeShaking: true,
    // target: "es2020,chrome58,edge16,firefox57,ie11,ios10,node12,opera45,safari11",
    watch: (!isDevelopment) ? false : {
      onRebuild(err, result) {
        if (err) {
          console.error('watch build failed:', err);
          return;
        }
        console.log('watch build succeeded:', result);
        rebuild.emit("rebuild");
      },
    },
  })

  .then((r) => {
    const port = process.env.PORT || 8000;
    server?.listen(port, () => {
      console.log(`Serving at localhost:${port}`);
      open(`http://localhost:${port}`);
    });
    console.log(r);
  })

  .catch(() => process.exit(1));
