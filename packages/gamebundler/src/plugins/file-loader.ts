import fs from 'fs';
import path from 'path';
import esbuild from "@netlify/esbuild";
import parsed from '../cli-parsed.js';

function isPartOfBundle(build: esbuild.PluginBuild) {
  return (
    build.initialOptions.write === false &&
    build.initialOptions.outdir === "tmp"
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

        // ensure "assets" directory exists
        if (!fs.existsSync(path.resolve(parsed.options.out, "assets"))) {
          fs.mkdirSync(path.resolve(parsed.options.out, "assets"));
        }

        // copy original file into built directory
        await fs.promises.copyFile(args.path, `${parsed.options.out}/${destiny}`);

      } else {
        destiny = args.path;
      }

      return { contents: `export default "${destiny}"` };
    });
  }

}
