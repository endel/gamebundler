import fs from 'fs';
import path from 'path';
import esbuild from '@netlify/esbuild';
import parsed from '../cli-parsed';
import { isDevelopment } from "../dev";
import { fileLoaderPlugin } from './file-loader';

function buildBundle(path: string) {
  return esbuild.build({
    entryPoints: [path],
    sourcemap: false,
    write: false,
    plugins: [fileLoaderPlugin], // , bundleLoaderPlugin
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

      console.log("BUNDLE:", { extname, basename, contents });

      // const tsSourceFile = ts.createSourceFile("bundle.ts", , ts.ScriptTarget.Latest);
      // const program = ts.createProgram();

      try {
        const result = await buildBundle(args.path);

        for (let out of result.outputFiles) {
          console.log(out.path, out.text)
        }

        console.log("RESULT:", result);

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
