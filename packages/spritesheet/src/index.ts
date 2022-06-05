/**
 * Copyright (c) 2022 Endel Dreyer
 * Copyright (c) 2020 Pencil.js
 * https://github.com/pencil-js/spritesheet/
 */

import Canvas from "canvas";
import pack from "bin-pack";
import crypto from "crypto";
import cropping from "./detect-edges";

const { loadImage, createCanvas } = Canvas;

export interface Options {
  /**
   * Format of the output image ("png" or "jpeg")
   */
  outputFormat?: "png" | "jpeg",

  /**
   * Added pixels between sprites (can prevent pixels leaking to adjacent sprite)
   */
  margin?: number,

  /**
   * Cut transparent pixels around sprites
   */
  crop?: boolean,

  // /**
  //  * Name of the image file (for reference in the JSON file)
  //  */
  // outputName?: string,

  /**
   * Scale of the output image
   */
  scale?: number,

  /**
   * Base URL (used for stripping `frameName`)
   */
  baseUrl?: string,
}

export interface JSONOutput {
  meta: {
    app: string,
    version: string,
    image: string,
    size: { w: number, h: number },
    scale: number,
  },
  frames: {[filename: string]: {
    frame: { x: number, y: number, w: number, h: number, },
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: { x: number, y: number, w: number, h: number, },
    sourceSize: { w: number, h: number, }
  }}
};

export interface Result {
  json: JSONOutput
  buffer: Buffer,
}

const defaultOptions: Options = {
  outputFormat: "png",
  margin: 1,
  crop: true,
  // outputName: "spritesheet.png",
  scale: 1,
};

export default async (paths: string[], options?: Options) => {
  const { baseUrl, outputFormat, margin, crop, scale } = {
    ...defaultOptions,
    ...options,
  };

  // Check input path
  if (!paths || !paths.length) {
    throw new Error("No file given.");
  }

  // Check outputFormat
  const supportedFormat = ["png", "jpeg"];
  if (!supportedFormat.includes(outputFormat)) {
    const supported = JSON.stringify(supportedFormat);
    throw new Error(`outputFormat should only be one of ${supported}, but "${outputFormat}" was given.`);
  }

  // Load all images
  const images = await Promise.all(paths.map(path => loadImage(path)));

  const playground = createCanvas(undefined, undefined); // TODO: is it required to provide size here?
  const playgroundContext = playground.getContext("2d");

  // Crop all images, applying scale
  const data = await Promise.all(images.map(async (source) => {
    const { width, height } = source;
    playground.width = width * scale;
    playground.height = height * scale;
    playgroundContext.drawImage(source, 0, 0, playground.width, playground.height);

    const cropped = crop ? await cropping(playground) : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    return {
      width: (playground.width - cropped.left - cropped.right) + margin,
      height: (playground.height - cropped.top - cropped.bottom) + margin,
      source,
      cropped,
    };
  }));

  // Pack images
  const { items, width, height } = pack(data);

  const canvas = createCanvas(width + margin, height + margin);
  const context = canvas.getContext("2d");

  // Draw all images on the destination canvas
  items.forEach(({ x, y, item }) => {
    // context.drawImage(item.source, x - item.cropped.left + margin, y - item.cropped.top + margin);
    context.drawImage(item.source, x - item.cropped.left + margin, y - item.cropped.top + margin, item.source.width * scale, item.source.height * scale);
  });

  // Write image
  const image = canvas.toBuffer(`image/${outputFormat}` as "image/png");

  // Determine unique hash
  const hash = crypto.createHash('sha1').update(image).digest('base64url');

  // Write JSON
  const json: JSONOutput = {
    // Global data about the generated file
    meta: {
      app: "https://endel.dev",
      version: "1.0.0",
      image: `${hash}.${outputFormat}`,
      size: {
        w: width,
        h: height,
      },
      scale,
    },
    frames: items
      .sort((a, b) => (a.item.source.src as string).localeCompare(b.item.source.src as string))
      .reduce((acc, { x, y, width: w, height: h, item }) => {
        const imageSrc = item.source.src as string;

        // remove baseUrl to determine final frame name
        const frameName = imageSrc.replace(baseUrl, "");

        acc[frameName] = {
          // Position and size in the spritesheet
          frame: {
            x: x + margin,
            y: y + margin,
            w: w - margin,
            h: h - margin,
          },
          rotated: false,
          trimmed: Object.values(item.cropped).some(value => value > 0),
          // Relative position and size of the content
          spriteSourceSize: {
            x: item.cropped.left,
            y: item.cropped.top,
            w: w - margin,
            h: h - margin,
          },
          // File image sizes
          sourceSize: {
            w: item.source.width,
            h: item.source.height,
          },
        };
        return acc;
      }, {}),
  };

  return { json, image, hash };
};