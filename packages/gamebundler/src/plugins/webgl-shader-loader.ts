import fs from 'fs';
import path from 'path';
import esbuild from "@netlify/esbuild";
import { config } from "@gamebundler/comptime";
import parsed from '../cli-parsed.js';
import { isPartOfBundle } from './file-loader.js';

/**
 * TODO: use/adapt code from either
 * - https://github.com/evanw/glslx
 * - https://github.com/grieve/webpack-glsl-loader
 * - https://github.com/UstymUkhman/vite-plugin-glsl

export const webglShaderLoaderPlugin: esbuild.Plugin = {
  name: "webgl-shader-loader",

  setup(build) {
    const isBundle = isPartOfBundle(build);

    build.onLoad({ filter: /\.(glsl|wgsl|vert|frag|vs|fs)$/ }, async (args) => {
      this.parse(this, source, this.context, function (err, bld) {
        if (err) {
          return cb(err);
        }
        cb(null, 'module.exports = ' + JSON.stringify(bld));
      });

      args.path
      const extname = path.extname(args.path);
      const basename = path.basename(args.path, extname);

      // copy original file into built directory
      await fs.promises.copyFile(args.path, `${parsed.options.out}/${destiny}`);

      const contents = "";
      return { contents: `export default "${contents}"` };
    });
  }

  parse(loader, source, context, cb) {
    var imports = [];
    var importPattern = /#include "([.\/\w_-]+)"/gi;
    var match = importPattern.exec(source);

    while (match != null) {
      imports.push({
        key: match[1],
        target: match[0],
        content: ''
      });
      match = importPattern.exec(source);
    }

    this.processImports(loader, source, context, imports, cb);
  }

  processImports(loader, source, context, imports, cb) {
    if (imports.length === 0) {
      return cb(null, source);
    }

    var imp = imports.pop();

    loader.resolve(context, './' + imp.key, function (err, resolved) {
      if (err) {
        return cb(err);
      }

      loader.addDependency(resolved);
      fs.readFile(resolved, 'utf-8', function (err, src) {
        if (err) {
          return cb(err);
        }

        parse(loader, src, path.dirname(resolved), function (err, bld) {
          if (err) {
            return cb(err);
          }

          source = source.replace(imp.target, bld);
          processImports(loader, source, context, imports, cb);
        });
      });
    });
  }

}

 */