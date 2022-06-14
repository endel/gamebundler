import * as pc from "playcanvas";
import type { ImageReturnType, SpriteSheetReturnType, AudioReturnType, AudioSpriteReturnType, RawReturnType } from "@gamebundler/comptime";

type AssetType = SpriteSheetReturnType | ImageReturnType | AudioReturnType | AudioSpriteReturnType | RawReturnType;

type MapAssetType<T> = pc.Asset;

// type MapAssetType<T> = T extends SpriteSheetReturnType
//   ? LoaderResource
//   : T extends ImageReturnType
//     ? LoaderResource
//     : T extends AudioReturnType
//       ? Sound.Sound
//       : T extends AudioSpriteReturnType
//         ? Sound.Sound
//         : LoaderResource;

let numBundles: number = 0;

export async function loadBundle<V extends AssetType, T extends { [key in keyof T]: V }>(app: pc.Application, bundle: T, tag?: string): Promise< { [key in keyof T]: MapAssetType<T[key]> } > {
  if (typeof(tag) === "undefined") {
    numBundles++;
    tag = `bundle-${numBundles}`;
  }

  // @ts-ignore
  const result: { [key in keyof T]: MapAssetType<T[key]> } = {};

  // https://developer.playcanvas.com/en/user-manual/assets/preloading-and-streaming/

  const assetsByTag = app.assets.findByTag(tag);
  const numAssetsInBundle = Object.keys(bundle).length;

  return new Promise<typeof result>((resolve, reject) => {
    for (const name in bundle) {
      let asset: pc.Asset;

      const srcAsset = bundle[name];
      switch (srcAsset.type) {
        case "spritesheet":
          asset = new pc.Asset(name, "sprite");
          break;

        case "image":
          asset = new pc.Asset(name, "texture");
          break;

        case "audiosprite":
          // https://developer.playcanvas.com/en/api/pc.SoundComponent.html#addSlot
          asset = new pc.Asset(name, "audio");
          break;

        case "audio":
          asset = new pc.Asset(name, "audio");
          break;

        default:
          // asset = new pc.Asset(name, )
          break;
      }
      asset.tags.add(tag);

      asset.once("error", () => reject())
      asset.once("load", () => {
        if (assetsByTag.length === numAssetsInBundle) {
          resolve(result);
        }
      });
      app.assets.load(asset);
    }

  });
}