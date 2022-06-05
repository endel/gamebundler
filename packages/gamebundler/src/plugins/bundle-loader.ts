import fsPromises from 'fs/promises';
import path from 'path';
import esbuild from '@netlify/esbuild';
import { config, persistEnqueuedFiles } from "@gamebundler/comptime";

import { isDevelopment } from "../dev.js";

import { fileLoaderPlugin } from './file-loader.js';
import { wildcardFileLoaderPlugin } from './wildcard-file-loader.js';

//
// possibly relevant: `build.onResolve()`
// => https://github.com/evanw/esbuild/pull/1881
//

function buildAssetBundle(entrypoint: string) {
  config.setSourceDirectory(path.dirname(entrypoint));

  return esbuild.build({
    entryPoints: [entrypoint],
    format: "esm",
    platform: "browser",
    sourcemap: false,
    write: false,
    bundle: true,
    external: ["@gamebundler/comptime"],
    // assetNames:
    plugins: [wildcardFileLoaderPlugin, fileLoaderPlugin], // ,
    minify: !isDevelopment,
    outdir: config.getCacheDir(),
  });
}

export const bundleLoaderPlugin: esbuild.Plugin = {
  name: "bundle-loader",

  setup(build) {
    build.onLoad({ filter: /\.bundle\.ts$/ }, async (args) => {
      let exports: any = {};

      try {
        const bundle = await buildAssetBundle(args.path);
        await Promise.all(bundle.outputFiles.map(async (file) => {
          file.path = file.path.replace(".js", ".mjs");

          // write compiled file
          await fsPromises.writeFile(file.path, file.text);

          try {
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

        console.log(`export ${key} =>`, exports[key]);

        contents += JSON.stringify(exports[key]) + ";\n";
      }

      console.log(args.path, "\n", contents);

      return { contents };
    });
  }

}
