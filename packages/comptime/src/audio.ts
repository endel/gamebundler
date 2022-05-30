import path from "path";
import generateAudioSprite, { AudioSpriteOptions } from "@gamestdio/audiosprite";

import { AllowedFilePaths, evaluateFilePaths, getFingerprint } from "./file";
import { getAssetsDirectory, getCacheDir, getOutputDirectory, getSourceDirectory } from "./config";

export async function audiosprite(
  paths: AllowedFilePaths,
  options: AudioSpriteOptions = {}
): Promise<{
  resources: string[],
  spritemap: { [soundName: string]: { start: number, end: number, loop: boolean } }
}> {
  const files = evaluateFilePaths(paths);
  options.output = path.resolve(getAssetsDirectory(), getFingerprint(files.join(",")));
  options.path = getAssetsDirectory();

  const result = await generateAudioSprite(files, options);

  // remove filesystem path, use only relative path
  const baseUrl = `${getOutputDirectory()}${path.sep}`;
  result.resources = result.resources.map((resource) =>
    resource.replace(baseUrl, ""));

  console.log("generateAudioSprite, result =>", result);

  return result;
}