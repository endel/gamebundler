import path from "path";
import generateAudioSprite, { AudioSpriteOptions, AudioSpriteOutput } from "@gamestdio/audiosprite";

import { FilePath, evaluateFilePath, evaluateFilePaths, getFingerprint } from "./file";
import { getAssetsDirectory, getOutputDirectory, } from "./config";
import { manifest } from "./manifest";

export type AudioSpriteReturnType = AudioSpriteOutput['default'] & { type: "audiosprite" };
export type AudioReturnType = {
  type: "audio",
  formats: string[],
}

export async function audio(input: FilePath, options: any): Promise<AudioReturnType> {
  const file = evaluateFilePath(input) as string;
  return await manifest.cache([file], options, async () => {
    const { resources } = await generateAudioSprite([file], { format: "default" });

    return {
      type: "audio",
      formats: resources
    };
  });
}

export async function audiosprite(
  paths: FilePath[],
  options: AudioSpriteOptions<'default'> = {}
): Promise<AudioSpriteReturnType> {
  const files = evaluateFilePaths(paths);

  options.output = path.resolve(getAssetsDirectory(), getFingerprint(files.join(",")));
  options.path = getAssetsDirectory();

  return await manifest.cache(files, options, async () => {
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