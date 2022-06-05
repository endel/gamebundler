import fs from 'fs';
import esbuild from "@netlify/esbuild";

/**
 * File Loader Plugin
 * Allow to read image and audio files from the filesystem
 */
export const rawLoaderPlugin: esbuild.Plugin = {
  name: "raw-loader",

  setup(build) {
    build.onLoad({ filter: /\?raw$/ }, async (args) => {
      const contents = (await fs.promises.readFile(args.path, 'utf8')).toString();
      return { contents: `export default "${contents.replaceAll('"', '\\"')}"` };
    });
  }

}
