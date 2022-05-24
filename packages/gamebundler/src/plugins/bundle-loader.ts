import fs, { fstatSync } from 'fs';
import fsPromises from 'fs/promises';
import vm from 'vm';
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

      let exports = {};
      console.log("BUNDLE:", { extname, basename, destiny });

      // const tsSourceFile = ts.createSourceFile("bundle.ts", , ts.ScriptTarget.Latest);
      // const program = ts.createProgram();

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

          // // --experimental-vm-modules
          // // TODO: remove this when vm module get stable
          // declare module 'vm' {
          //   class SourceTextModule {
          //     constructor(code: string, options?: { context: Context });
          //     evaluate(): void;
          //     link(linker: Function): void;
          //   }
          // }
          // const SourceTextModule: typeof vm.SourceTextModule  = (vm as any).SourceTextModule;
          // if (!SourceTextModule) {
          //   throw new Error("--experimental-vm-modules is mandatory.\nbundle-loader.ts depends on experimental vm.Module https://nodejs.org/api/vm.html#class-vmmodule");
          // }

          // // const result = vm.runInContext(file.text, context);

          // const context = vm.createContext({});
          // const sourceTextModule = new SourceTextModule(file.text, { context });

          // async function linker(specifier: any, referencingModule: any) {
          //   console.log("linker:", { specifier, referencingModule });
          //   const imported = await import(specifier)
          //   console.log("IMPORTED:", imported);
          //   return imported;
          //   // if (specifier === 'foo') {
          //   //   return new vm.SourceTextModule(`
          //   //     // The "secret" variable refers to the global variable we added to
          //   //     // "contextifiedObject" when creating the context.
          //   //     export default secret;
          //   //   `, { context: referencingModule.context });

          //   //   // Using `contextifiedObject` instead of `referencingModule.context`
          //   //   // here would work as well.
          //   // }

          //   // throw new Error(`Unable to resolve dependency: ${specifier}`);
          // }
          // console.log(".link() ...");
          // await sourceTextModule.link(linker);

          // console.log(".evaluate() ...");
          // const result = await sourceTextModule.evaluate();
          // console.log({ result });
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

      console.log("Let's return...");

      return { contents: `export default "${destiny}"` };
    });
  }

}
