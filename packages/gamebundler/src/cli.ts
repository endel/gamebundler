import path from 'path';

import open from 'open';
import esbuild from '@netlify/esbuild';

import { fileLoaderPlugin } from './plugins/file-loader.js';
import { bundleLoaderPlugin } from './plugins/bundle-loader.js';
import { wildcardFileLoaderPlugin } from './plugins/wildcard-file-loader.js';
import { rawLoaderPlugin } from './plugins/raw-loader.js';

import cli from './cli-parsed.js';
import { devEvents, isDevelopment, devServer } from './dev.js';

//
// TODO?
// - HTML Minifier https://htmlnano.netlify.app
//

// TODO: support importing CSS

const onBuildSuccessful = () => console.log(`${String.fromCodePoint(0x2705)} Build successful!`);

esbuild
  .build({
    // format: "iife", // FIXME: only required for TLA (top-level await)
    entryPoints: cli.args,
    // tsconfig: parsed.options.tsconfig,
    platform: "browser",
    outfile: path.resolve(cli.options.out, "bundle.js"),
    // outdir: path.resolve(cli.options.out),
    absWorkingDir: process.cwd(),
    bundle: true,
    minify: !isDevelopment,
    sourcemap: true,
    banner: {
      js: "// built with gamebundler\n// https://github.com/endel/gamebundler",
      css: "/* built with gamebundler */\n/* https://github.com/endel/gamebundler */",
    },
    plugins: [
      bundleLoaderPlugin,
      wildcardFileLoaderPlugin,
      fileLoaderPlugin,
      rawLoaderPlugin,
    ],
    // treeShaking: true,
    // target: "es2020,chrome58,edge16,firefox57,ie11,ios10,node12,opera45,safari11",

    watch: (!isDevelopment) ? false : {
      onRebuild(err, result) {
        if (err) {
          console.error(`${String.fromCodePoint(0x274C)} Watch build failed:`, err);
          devEvents.emit('error', err);
          return;
        }

        onBuildSuccessful();
        devEvents.emit('reload');
      },
    },
  })

  .then((r) => {
    const port = process.env.PORT || 8000;

    devServer?.listen(port, () => {
      console.log(`Serving at http://localhost:${port}`);
      open(`http://localhost:${port}`);
    });

    onBuildSuccessful();
  })

  .catch(() => process.exit(1));
