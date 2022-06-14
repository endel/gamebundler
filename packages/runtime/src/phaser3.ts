import "phaser";
import type { ImageReturnType, SpriteSheetReturnType, AudioReturnType, AudioSpriteReturnType, RawReturnType } from "@gamebundler/comptime";

type AssetType = SpriteSheetReturnType | ImageReturnType | AudioReturnType | AudioSpriteReturnType | RawReturnType;

type MapAssetType<T> = any

// type MapAssetType<T> = T extends SpriteSheetReturnType
//   ? LoaderResource
//   : T extends ImageReturnType
//     ? LoaderResource
//     : T extends AudioReturnType
//       ? Sound.Sound
//       : T extends AudioSpriteReturnType
//         ? Sound.Sound
//         : LoaderResource;

export async function loadBundle<V extends AssetType, T extends { [key in keyof T]: V }>(scene: Phaser.Scene, bundle: T): Promise< { [key in keyof T]: MapAssetType<T[key]> } > {
  const loader = scene.load;

  const result: { [key in keyof T]?: MapAssetType<T[key]> } = {};

  for (const name in bundle) {
    const asset = bundle[name];
    switch (asset.type) {
      case "spritesheet":
        // @ts-ignore
        loader.addFile(name, asset.json);
        break;

      case "image":
        // @ts-ignore
        loader.add(name, asset.image);
        break;

      case "audiosprite":
        // @ts-ignore
        loader.add(name, asset.resources);
        break;

      case "audio":
        // @ts-ignore
        loader.add(name, asset.formats);
        break;
    }
  }

  return new Promise((resolve, reject) => {
    loader.on("error", (err) => reject(err));
    loader.on("complete", () => {
      for (const name in bundle) {
        const asset = bundle[name];
        switch (asset.type) {
          case "image":
          // scene['display ']
            // scene.add.image()
            break;

          case "audiosprite":
            // const sound = loader.resources[name].sound;
            // sound.addSprites(asset.spritemap);
            // result[name] = sound;
            break;

          case "audio":
            // result[name] = loader.resources[name].sound;
            break;

          default:
            // result[name] = loader.resources[name];
            break;
        }
      }

      // @ts-ignore
      resolve(result);
    });
  });
}