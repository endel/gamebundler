const fs = require('fs');
const path = require('path');
const events = require('events');
const open = require('open');

const esbuild = require('esbuild');
const httpServer = require('http-server');

const isProduction = (process.env.NODE_ENV === "production");
const rebuild = new events.EventEmitter();

// TODO?
// - HTML Minifier https://htmlnano.netlify.app

const server = !isProduction && httpServer.createServer({
  root: path.resolve("public"),
  cors: true,
  autoIndex: true,
  showDir: true,
  before: [function(req, res, next) {
    // intercept reload script.
    if (req.url === "/reload/reload.js") {
      res.setHeader("Content-Type", "text/javascript");
      res.write(fs.readFileSync(path.resolve("reload.js")));
      res.end();
      return;

    } else if (req.url === "/__reload") {
      // wait for rebuild to complete the reload request..
      rebuild.on("rebuild", () => res.end());

    } else {
      next();
    }
  }]
});

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: path.resolve("public", "bundle.js"),
    bundle: true,
    minify: isProduction,
    sourcemap: true,
    platform: "browser",
    // treeShaking: true,
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
      console.log(`Serving at localhost:${port}`)
      open(`http://localhost:${port}`);
    });
    console.log(r);
  })
  .catch(() => process.exit(1));
