import fs from 'fs';
import path from 'path';
import parsed from '../cli-parsed';

export const fileLoaderPlugin = {
  name: "file-loader",

  setup(build: any) {
    build.onLoad({ filter: /\.(png|jpg|jpeg|svg|xml|webp)$/ }, async (args: any) => {
      const extname = path.extname(args.path);
      const basename = path.basename(args.path, extname);
      const destiny = `assets${path.sep}${parsed.id}-${basename}${extname}`;

      // ensure "assets" directory exists
      if (!fs.existsSync(path.resolve(parsed.options.out, "assets"))) {
        fs.mkdirSync(path.resolve(parsed.options.out, "assets"));
      }

      // copy original file into built directory
      await fs.promises.copyFile(args.path, `${parsed.options.out}/${destiny}`);

      return { contents: `export default "${destiny}"` };
    });
  }

}
