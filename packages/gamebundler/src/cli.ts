import fs from 'fs';
import path from 'path';
import events from 'events';

import open from 'open';
import esbuild from '@netlify/esbuild';

import http from 'http';
import httpServer from 'http-server';

const isProduction = (process.env.NODE_ENV === "production");
const rebuild = new events.EventEmitter();

import fileLoaderPlugin from './plugins/file-loader';
import bundleLoaderPlugin from './plugins/bundle-loader';
import cli from './cli-parsed';

console.log(cli);

const server = !isProduction && httpServer.createServer({
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
    minify: isProduction,
    sourcemap: true,
    plugins: [ bundleLoaderPlugin, fileLoaderPlugin ],
    // treeShaking: true,
    // target: "es2020,chrome58,edge16,firefox57,ie11,ios10,node12,opera45,safari11",
    watch: (isProduction) ? false : {
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
