import "@pixi/sound"; // register sound loader
import { Loader, LoaderResource } from "@pixi/loaders";
import type { ImageReturnType, SpriteSheetReturnType, AudioReturnType, AudioSpriteReturnType } from "@gamebundler/comptime";

type AssetType = SpriteSheetReturnType | ImageReturnType | AudioReturnType | AudioSpriteReturnType;

export async function loadBundle<T extends { [key in keyof T]: AssetType }>(bundle: T): Promise<{ [key in keyof T]: LoaderResource }> {
  const result: { [key in keyof T]?: LoaderResource } = {};

  const loader = new Loader();
  for (const name in bundle) {
    const asset = bundle[name];
    switch (asset.type) {
      case "spritesheet":
        loader.add(name, asset.json);
        break;

      case "image":
        loader.add(name, asset.image);
        break;

      case "audiosprite":
        loader.add(name, combineAudioUrl(asset.resources));
        break;

      case "audio":
        loader.add(name, combineAudioUrl(asset.formats));
        break;
    }
  }

  return new Promise((resolve, reject) => {
    loader.onError.add((err) => reject(err));
    loader.load(() => {
      for (const name in bundle) {
        const asset = bundle[name];
        switch (asset.type) {
          // case "spritesheet":
          //   break;

          // case "image":
          //   break;

          case "audiosprite":
            loader.resources[name].sound.addSprites(asset.spritemap);
            console.log(asset.spritemap);
            result[name] = loader.resources[name];
            break;

          // case "audio":
          //   break;
        }

        result[name] = loader.resources[name];
      }

      // @ts-ignore
      resolve(result);
    });
  });
}

function combineAudioUrl(urls: string[]) {
  // @pixi/sound accepts this format: "filename.{ogg,mp3}"
  const lastIndexOf = urls[0].lastIndexOf(".");
  const extensions = urls.map((url) => url.substring(lastIndexOf+1));
  return `${urls[0].substring(0, lastIndexOf)}.{${extensions.join(",")}}`;
}