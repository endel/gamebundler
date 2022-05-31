import path from "path";
import generateAudioSprite, { AudioSpriteOptions, AudioSpriteOutput } from "@gamestdio/audiosprite";

import { AllowedFilePaths, evaluateFilePaths, getFingerprint } from "./file";
import { getAssetsDirectory, getCacheDir, getOutputDirectory, getSourceDirectory } from "./config";

export async function audiosprite(
  paths: AllowedFilePaths,
  options: AudioSpriteOptions<'default'> = {}
): Promise<AudioSpriteOutput['default']> {
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

  console.log("generateAudioSprite, result =>", result);

  return result;
}