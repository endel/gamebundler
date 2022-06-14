import Sound from "@pixi/sound"; // register sound loader
import { Loader, LoaderResource } from "@pixi/loaders";
import type { ImageReturnType, SpriteSheetReturnType, AudioReturnType, AudioSpriteReturnType, RawReturnType } from "@gamebundler/comptime";

type AssetType = SpriteSheetReturnType | ImageReturnType | AudioReturnType | AudioSpriteReturnType | RawReturnType;

type MapAssetType<T> = T extends SpriteSheetReturnType
  ? LoaderResource
  : T extends ImageReturnType
    ? LoaderResource
    : T extends AudioReturnType
      ? Sound.Sound
      : T extends AudioSpriteReturnType
        ? Sound.Sound
        : LoaderResource;

export async function loadBundle<V extends AssetType, T extends { [key in keyof T]: V }>(bundle: T): Promise< { [key in keyof T]: MapAssetType<T[key]> } > {
  const result: { [key in keyof T]?: MapAssetType<T[key]> } = {};

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
          case "audiosprite":
            const sound = loader.resources[name].sound;
            sound.addSprites(asset.spritemap);
            // @ts-ignore
            result[name] = sound;
            break;

          case "audio":
            // @ts-ignore
            result[name] = loader.resources[name].sound;
            break;

          default:
            // @ts-ignore
            result[name] = loader.resources[name];
            break;
        }
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