import fs from 'fs';
import path from 'path';
import esbuild from "@netlify/esbuild";
import { config } from "@gamebundler/comptime";
import parsed from '../cli-parsed.js';

function isPartOfBundle(build: esbuild.PluginBuild) {
  return (
    build.initialOptions.write === false &&
    build.initialOptions.outdir === config.getCacheDir()
  );
}


/**
 * File Loader Plugin
 * Allow to read image and audio files from the filesystem
 */
export const fileLoaderPlugin: esbuild.Plugin = {
  name: "file-loader",

  setup(build) {
    const isBundle = isPartOfBundle(build);

    build.onLoad({ filter: /\.(png|jpg|jpeg|svg|xml|webp|aiff|wav|ac3|mp3|mp4|m4a|ogg|opus|webm)$/ }, async (args) => {
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
