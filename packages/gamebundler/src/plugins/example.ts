// https://esbuild.github.io/api/#transform-api
import fs from "fs";
import esbuild from "@netlify/esbuild";

const plugin: esbuild.Plugin = {
  name: "Example plugin",

  setup(build) {
    build.onLoad({ filter: /\.svelte$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');
      const { code, map } = build.esbuild.transformSync(source, {
        loader: "ts",
      });
     const contents = code; // manipulated code
     return { contents };
    })
 }

}
