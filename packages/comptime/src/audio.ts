import path from "path";
import generateAudioSprite, { AudioSpriteOptions, AudioSpriteOutput } from "@gamestdio/audiosprite";

import { FilePath, evaluateFilePaths, getFingerprint } from "./file";
import { getAssetsDirectory, getOutputDirectory, } from "./config";
import { getCurrentManifest } from "./manifest";

type AudioSpriteReturnType = AudioSpriteOutput['default'] & {type: "audiosprite"};

export async function audiosprite(
  paths: FilePath[],
  options: AudioSpriteOptions<'default'> = {}
): Promise<AudioSpriteReturnType> {
  const files = evaluateFilePaths(paths);

  options.output = path.resolve(getAssetsDirectory(), getFingerprint(files.join(",")));
  options.path = getAssetsDirectory();

  return await getCurrentManifest().cache(files, options, async () => {
    const result = await generateAudioSprite(files, {
      ...options,
      format: "default"
    });

    // remove filesystem path, use only relative path
    const baseUrl = `${getOutputDirectory()}${path.sep}`;
    result.resources = result.resources.map((resource) =>
      resource.replace(baseUrl, ""));

    return {
      type: "audiosprite",
      ...result
    };
  });

}