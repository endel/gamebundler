
type SpriteSheetAsset = { type: "spritesheet", path: string, json: string };
type ImageAsset = { type: "image", path: string, image: string };
type AudioAsset = { type: "audio", formats: string[], resources: string[] };
type AudioSpriteAsset = { type: "audiosprite", resources: string[], spritemap: string[] };

type AssetType = "spritesheet" | "image" | "audio" | "audiosprite";

const bundle = {
  asset1: { type: "spritesheet", path: "assets/spritesheet.png", json: "assets/spritesheet.json" } as SpriteSheetAsset,
  asset2: { type: "image", path: "assets/image/image.png" } as ImageAsset,
  asset3: { type: "audio", resources: ["assets/audio.mp3", "assets/audio.ogg"] } as AudioAsset ,
  asset4: { type: "audiosprite", resources: ["assets/audio.mp3", "assets/audio.ogg"], spritemap: [] } as AudioSpriteAsset,
}

class SpriteSheet {}
class MyImage {}
class AudioSprite {}
class MyAudio {}


type ValueOf<T> = T[keyof T];

interface MappedType {
  spritesheet: SpriteSheet;
  image: MyImage;
  audiosprite: AudioSprite;
  audio: MyAudio;
}

type MapType<T> = T extends SpriteSheetAsset
  ? SpriteSheet
  : T extends ImageAsset
    ? MyImage
    : T extends AudioAsset
      ? MyAudio
      : T extends AudioSpriteAsset
        ? AudioSprite
        : never;

// type MapAssetType<T> = { [key in keyof T]: MapType<T[key]> };
type MapAssetType<T> = { [key in keyof T]: T[key] };

const result = loadAll(bundle);

function loadAll<T>(bundle: T): MapAssetType<T> {
  const result: any = {};
  for (let name in bundle) {
    if (!Object.prototype.hasOwnProperty.apply(bundle, name)) {
      continue;
    }

    const asset: any = bundle[name];

    switch (asset.type) {
      case "spritesheet":
        result[name] = new SpriteSheet();
        break;
      case "image":
        result[name] = new MyImage();
        break;
      case "audio":
        result[name] = new MyAudio();
        break;
      case "audiosprite":
        result[name] = new AudioSprite();
        break;
    }
  }
  return result;

}