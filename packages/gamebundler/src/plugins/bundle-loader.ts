import vm from 'vm';
import fs from 'fs';
import path from 'path';
import parsed from '../cli-parsed';

export default {
  name: "bundle-loader",

  setup(build: any) {
    build.onLoad({ filter: /\.bundle\.ts$/ }, async (args: any) => {
      const extname = path.extname(args.path);
      const basename = path.basename(args.path, extname);
      const destiny = `assets${path.sep}${parsed.id}-${basename}${extname}`;
      const contents = fs.readFileSync(args.path).toString();

      console.log("BUNDLE:", { extname, basename, contents });

      // const tsSourceFile = ts.createSourceFile("bundle.ts", , ts.ScriptTarget.Latest);
      // const program = ts.createProgram();

      try {
        // const bundleCode = service.compile(contents, path.basename(args.path));

        // const context = vm.createContext({
        //   require,
        //   exports: {},
        // });
        // const bundleOutput = vm.runInNewContext(`require('tslib');${bundleCode}`, context);

        // console.log({ bundleCode, bundleOutput });
      } catch (e) {
        console.error("OOPS!", e);
      }


      // // ensure "assets" directory exists
      // if (!fs.existsSync(path.resolve(parsed.options.out, "assets"))) {
      //   fs.mkdirSync(path.resolve(parsed.options.out, "assets"));
      // }

      // // copy original file into built directory
      // await fs.promises.copyFile(args.path, `${parsed.options.out}/${destiny}`);

      return { contents: `export default "${destiny}"` };
    });
  }

}
