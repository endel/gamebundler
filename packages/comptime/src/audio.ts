import path from "path";
import generateAudioSprite, { AudioSpriteOptions, AudioSpriteOutput } from "@gamestdio/audiosprite";

import { AllowedFilePaths, evaluateFilePaths, getFingerprint } from "./file";
import { getAssetsDirectory, getCacheDir, getOutputDirectory, getSourceDirectory } from "./config";

type AudioSpriteReturnType = AudioSpriteOutput['default'] & {type: "audiosprite"};

export async function audiosprite(
  paths: AllowedFilePaths,
  options: AudioSpriteOptions<'default'> = {}
): Promise<AudioSpriteReturnType> {
  const files = evaluateFilePaths(paths);

  options.output = path.resolve(getAssetsDirectory(), getFingerprint(files.join(",")));
  options.path = getAssetsDirectory();

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
}