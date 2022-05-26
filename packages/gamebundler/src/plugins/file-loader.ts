import fs from 'fs';
import path from 'path';
import esbuild from "@netlify/esbuild";
import parsed, { getCacheDir } from '../cli-parsed.js';

function isPartOfBundle(build: esbuild.PluginBuild) {
  return (
    build.initialOptions.write === false &&
    build.initialOptions.outdir === getCacheDir()
  );
}

export const fileLoaderPlugin: esbuild.Plugin = {
  name: "file-loader",

  setup(build) {
    const isBundle = isPartOfBundle(build);

    build.onLoad({ filter: /\.(png|jpg|jpeg|svg|xml|webp)$/ }, async (args) => {
      let destiny: string;

      if (!isBundle) {
        const extname = path.extname(args.path);
        const basename = path.basename(args.path, extname);

        destiny = `assets${path.sep}${parsed.id}-${basename}${extname}`;

        // copy original file into built directory
        await fs.promises.copyFile(args.path, `${parsed.options.out}/${destiny}`);

      } else {
        destiny = args.path;
      }

      return { contents: `export default "${destiny}"` };
    });
  }

}
