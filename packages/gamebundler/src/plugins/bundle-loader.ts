import fsPromises from 'fs/promises';
import path from 'path';
import esbuild from '@netlify/esbuild';

import { config, persistEnqueuedFiles } from "@gamebundler/comptime";
import * as manifest from "@gamebundler/comptime/lib/manifest.js";

import { isDevelopment } from "../dev.js";

import { fileLoaderPlugin } from './file-loader.js';
import { wildcardFileLoaderPlugin } from './wildcard-file-loader.js';
import { rawLoaderPlugin } from './raw-loader.js';
import { nativeNodeModulesPlugin } from './native-node-module-loader.js';

//
// possibly relevant: `build.onResolve()`
// => https://github.com/evanw/esbuild/pull/1881
//

function buildBundleSources(entrypoint: string) {
  config.setSourceDirectory(path.dirname(entrypoint));

  return esbuild.build({
    entryPoints: [entrypoint],
    format: "esm",
    // platform: "browser",
    platform: "node",
    sourcemap: false,
    write: false,
    bundle: true,
    // TODO: list modules from package.json as "external"
    external: ["@gamebundler/comptime", "canvas", "psd"],
    // assetNames:
    plugins: [
      nativeNodeModulesPlugin,
      wildcardFileLoaderPlugin, fileLoaderPlugin, rawLoaderPlugin,
    ],
    minify: false,
    outdir: config.getCacheDir(),
  });
}

export const bundleLoaderPlugin: esbuild.Plugin = {
  name: "bundle-loader",

  setup(build) {
    build.onLoad({ filter: /\.bundle\.ts$/ }, async (args) => {
      let exports: any = {};

      try {
        const bundleSources = await buildBundleSources(args.path);

        manifest.initialize(args.path);

        await Promise.all(bundleSources.outputFiles.map(async (file) => {
          file.path = file.path.replace(".js", ".mjs");

          // write compiled file
          await fsPromises.writeFile(file.path, file.text);

          try {
            /**
             * FIXME:
             *
             * TODO: use worker_threads (`node-canvas` does not support worker_threads: https://github.com/Automattic/node-canvas/issues/1394)
             *
             * Need to un-import the module to be able to import (and execute) it again
             * We're currently relying on --experimental-loader (see `utils/node-loader.ts`) to support this.
             *
             * (More info https://github.com/nodejs/modules/issues/307)
             */
            exports = await import(file.path);

          } catch (e) {
            console.error(e);
          }
        }));

      } catch (e) {
        console.error("ERROR - bundle-loader:", e);
      }

      await persistEnqueuedFiles(config.getAssetsDirectory());

      let contents: string = "";

      for (const key in exports) {
        if (key === "default") {
          contents += "export default ";

        } else {
          contents += `export const ${key} = `;
        }

        // console.log(`export ${key} =>`, exports[key]);

        contents += JSON.stringify(exports[key]) + ";\n";
      }

      console.log(args.path, "\n", contents);

      return { contents };
    });
  }

}
