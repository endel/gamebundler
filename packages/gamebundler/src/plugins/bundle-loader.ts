import fs from 'fs';
import vm from 'vm';
import path from 'path';
import esbuild from '@netlify/esbuild';
import parsed from '../cli-parsed';
import { isDevelopment } from "../dev";
import { fileLoaderPlugin } from './file-loader';

function buildAssetBundle(path: string) {
  console.log("ENTRY POINT:", path);
  return esbuild.build({
    entryPoints: [path],
    platform: "browser",
    sourcemap: false,
    write: false,
    bundle: true,
    external: ["@gamebundler/comptime"],
    plugins: [fileLoaderPlugin], // ,
    minify: !isDevelopment,
    outdir: 'out',
  })
}

export const bundleLoaderPlugin = {
  name: "bundle-loader",

  setup(build: any) {
    build.onLoad({ filter: /\.bundle\.ts$/ }, async (args: any) => {
      const extname = path.extname(args.path);
      const basename = path.basename(args.path, extname);
      const destiny = `assets${path.sep}${parsed.id}-${basename}${extname}`;
      const contents = fs.readFileSync(args.path).toString();

      console.log("args:", args);
      console.log("BUNDLE:", { extname, basename, contents });

      // const tsSourceFile = ts.createSourceFile("bundle.ts", , ts.ScriptTarget.Latest);
      // const program = ts.createProgram();

      try {
        const bundle = await buildAssetBundle(args.path);
        bundle.outputFiles.forEach((file) => {
          console.log(file.path, file.text);
          const context = vm.createContext({ require, exports: {} });

          const result = vm.runInContext(file.text, context);
          console.log({result})
        });

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
