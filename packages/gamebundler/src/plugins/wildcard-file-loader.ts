import fastGlob from 'fast-glob';
import esbuild from "@netlify/esbuild";
import { FILE_EXTENSIONS, isPartOfBundle } from './file-loader.js';

const WILDCARD_NAMESPACE = 'wildcard-import';

/**
 * Wildcard File Loader Plugin
 * Allow to read image and audio files from the filesystem
 */
export const wildcardFileLoaderPlugin: esbuild.Plugin = {
  name: "wildcard-file-loader",

  setup(build) {
    // const isBundle = isPartOfBundle(build);

    // https://github.com/thomaschaaf/esbuild-plugin-import-glob
    build.onResolve({ filter: new RegExp(String.raw`\*\.(${FILE_EXTENSIONS.join('|')})$`) }, async (args) => {
      return {
        path: args.path,
        namespace: WILDCARD_NAMESPACE,
        pluginData: {
          resolveDir: args.resolveDir,
        },
      };
    });

    build.onLoad({
      filter: new RegExp(String.raw`\.(${FILE_EXTENSIONS.join('|')})$`),
      namespace: WILDCARD_NAMESPACE
    }, async (args) => {
      const files = (
        await fastGlob(args.path, {
          cwd: args.pluginData.resolveDir,
        })
      ).sort();

      let importerCode = `
        ${files
          .map((module, index) => `import * as module${index} from '${module}'`)
          .join(';')}
        const modules = [${files
          .map((module, index) => `module${index}`)
          .join(',')}];
        export default modules;
        export const filenames = [${files
          .map((module, index) => `'${module}'`)
          .join(',')}]
      `;

      return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
    });
  }

}
