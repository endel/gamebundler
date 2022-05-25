import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import esbuild from '@netlify/esbuild';

import parsed from '../cli-parsed.js';
import { isDevelopment } from "../dev.js";
import { fileLoaderPlugin } from './file-loader.js';

//
// possibly relevant: `build.onResolve()`
// => https://github.com/evanw/esbuild/pull/1881
//

function buildAssetBundle(path: string) {
  return esbuild.build({
    entryPoints: [path],
    format: "esm",
    platform: "browser",
    sourcemap: false,
    write: false,
    bundle: true,
    external: ["@gamebundler/comptime"],
    plugins: [fileLoaderPlugin], // ,
    minify: !isDevelopment,
    outdir: 'tmp',
  });
}

export const bundleLoaderPlugin: esbuild.Plugin = {
  name: "bundle-loader",

  setup(build) {
    build.onLoad({ filter: /\.bundle\.ts$/ }, async (args) => {
      const extname = path.extname(args.path);
      const basename = path.basename(args.path, extname);
      const destiny = `assets${path.sep}${parsed.id}-${basename}${extname}`;

      let exports: any = {};
      console.log("BUNDLE:", { extname, basename, destiny });

      try {
        const bundle = await buildAssetBundle(args.path);
        await Promise.all(bundle.outputFiles.map(async (file) => {
          file.path = file.path.replace(".js", ".mjs");

          // make sure `tmp/` directory exists.
          const tmpDirectory = path.dirname(file.path);
          if (!fs.existsSync(tmpDirectory)) { await fsPromises.mkdir(tmpDirectory); }

          // write compiled file
          await fsPromises.writeFile(file.path, file.text);

          try {
            exports = await import(file.path);


            console.log("Evaluated:", { exports });
          } catch (e) {
            console.log("Error...");
            console.error(e);
          }
        }));

      } catch (e) {
        console.error("OOPS!", e);
      }

      // // ensure "assets" directory exists
      // if (!fs.existsSync(path.resolve(parsed.options.out, "assets"))) {
      //   fs.mkdirSync(path.resolve(parsed.options.out, "assets"));
      // }

      // // copy original file into built directory
      // await fs.promises.copyFile(args.path, `${parsed.options.out}/${destiny}`);

      let contents: string = "";

      for (const key in exports) {
        if (key === "default") {
          contents += "export default ";

        } else {
          contents += `export const ${key} = `;
        }

        contents += JSON.stringify(exports[key]) + ";\n";
      }

      console.log(args.path, "\n", contents);

      return { contents };
    });
  }

}
