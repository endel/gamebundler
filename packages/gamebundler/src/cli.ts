import fs from 'fs';
import path from 'path';

import open from 'open';
import esbuild from '@netlify/esbuild';

import { fileLoaderPlugin } from './plugins/file-loader.js';
import { bundleLoaderPlugin } from './plugins/bundle-loader.js';
import { wildcardFileLoaderPlugin } from './plugins/wildcard-file-loader.js';
import { rawLoaderPlugin } from './plugins/raw-loader.js';

import cli from './cli-parsed.js';
import { devEvents, isDevelopment, devServer } from './dev.js';
import { config } from '@gamebundler/comptime';
import { injectHTML, minifyHTML } from './html/processing.js';

//
// TODO?
// - HTML Minifier https://htmlnano.netlify.app
//

// TODO: support importing CSS
const entrypoint = (cli.args.length > 0)
  ? cli.args
  : [config.getPackageJSON().main];

const onBuildSuccessful = () => console.log(`${String.fromCodePoint(0x2705)} Build successful!`);

esbuild
  .build({
    entryPoints: entrypoint,

    // tsconfig: parsed.options.tsconfig,
    platform: "browser",
    format: "esm",
    outfile: path.resolve(cli.options.out, "bundle.js"),
    // outdir: path.resolve(cli.options.out),
    absWorkingDir: process.cwd(),
    bundle: true,
    minify: !isDevelopment,
    sourcemap: isDevelopment,
    legalComments: (isDevelopment)
      ? "eof"
      : "external",
    banner: {
      js: "// built with gamebundler\n// https://github.com/endel/gamebundler",
      css: "/* built with gamebundler */\n/* https://github.com/endel/gamebundler */",
    },

    // loader: {
    //   '.svg': 'text',
    // },

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

  .then(async (r) => {
    const port = process.env.PORT || 8000;

    devServer?.listen(port, () => {
      console.log(`Serving at http://localhost:${port}`);
      open(`http://localhost:${port}`);
    });

    if (config.isReleaseMode()) {
      // copy html template to output directory
      const htmlTemplate = cli.options.html;
      if (fs.existsSync(htmlTemplate)) {
        const minifiedHTML = minifyHTML(await fs.promises.readFile(htmlTemplate, 'utf8')).toString();
        console.log("minifiedHTML:", minifiedHTML);
        const finalHTML = injectHTML(minifiedHTML, '<script src="bundle.js"></script>');
        await fs.promises.writeFile(path.resolve(cli.options.out, "index.html"), finalHTML);
      }
    }

    onBuildSuccessful();
  })

  .catch(() => process.exit(1));
