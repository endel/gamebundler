// // https://esbuild.github.io/api/#transform-api
// const plugin = {
//   setup(build) {
//     build.onLoad({ filter: /\.svelte$/ }, async (args) => {
//       const source = await fs.promises.readFile(args.path, 'utf8');
//       const { code, map } = this.build.esbuild.transformSync(source, {
//         loader: "ts",
//       });
//      const contents = code; // manipulated code
//      return { contents }
//     })
//  }
// }
