/**
 * Copyright (c) 2022 Endel Dreyer
 * Copyright (c) 2020 Pencil.js
 * https://github.com/pencil-js/spritesheet/
 */

import Canvas from "canvas";
import crypto from "crypto";
import { Stream } from "stream";
import pack from "./bin-pack/bin-pack";
import cropping from "./detect-edges";

const { loadImage, createCanvas, createImageData } = Canvas;

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

export default async (
  filepaths: Array<string | Stream> | { [frameName: string]: string | Stream },
  options?: Options
) => {
  const { baseUrl, outputFormat, margin, crop, scale } = {
    ...defaultOptions,
    ...options,
  };

  // support key-value objects
  let frameNames = undefined;
  if (!Array.isArray(filepaths)) {
    frameNames = Object.keys(filepaths);
    filepaths = Object.values(filepaths);
  }

  // Check input path
  if (!filepaths || !filepaths.length) {
    throw new Error("No file given.");
  }

  // Check outputFormat
  const supportedFormat = ["png", "jpeg"];
  if (!supportedFormat.includes(outputFormat)) {
    const supported = JSON.stringify(supportedFormat);
    throw new Error(`outputFormat should only be one of ${supported}, but "${outputFormat}" was given.`);
  }

  // Load all images
  const images = await Promise.all(filepaths.map(filepath => {
    if (typeof (filepath) === "string") {
      return loadImage(filepath)

    } else if (filepath instanceof Stream) {
      const pngjs: any = filepath; // (consuming a `.toPng()` instance from https://npmjs.com/package/pngjs)

      // @ts-ignore
      const canvas = createCanvas(pngjs.width, pngjs.height);
      const ctx = canvas.getContext("2d");

      // @ts-ignore
      const imageData = createImageData(Uint8ClampedArray.from(pngjs.data), pngjs.width, pngjs.height);
      ctx.putImageData(imageData, 0, 0);

      const image = new Canvas.Image();
      image.src = canvas.toDataURL('image/png');

      // @ts-ignore
      image.width = pngjs.width;
      // @ts-ignore
      image.height = pngjs.height;

      return image;
    }
  }));

  // const images = await Promise.all(paths.map(path => loadImage(path)));

  const playground = createCanvas(undefined, undefined);
  const playgroundContext = playground.getContext("2d");

  // Crop all images
  const data = await Promise.all(images.map(async (source) => {
    const { width, height } = source;

    const w = width * scale;
    const h = height * scale;

    playground.width = w;
    playground.height = h;
    playgroundContext.drawImage(source, 0, 0, w, h);

    const cropped = crop ? await cropping(playground) : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    return {
      width: (w - cropped.left - cropped.right) + margin,
      height: (h - cropped.top - cropped.bottom) + margin,

      source,
      cropped,
    };
  }));

  // map image references to frame names
  if (frameNames !== undefined) {
    const map = new Map();
    data.forEach((item, i) => map.set(item, frameNames[i]));
    frameNames = map;
  }

  // Pack images
  const { items, width, height } = pack(data);

  const canvas = createCanvas(width + margin, height + margin);
  const context = canvas.getContext("2d");

  // Draw all images on the destination canvas
  items.forEach(({ x, y, item }) => {
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
      // .sort((a, b) => (a.item.source.src as string).localeCompare(b.item.source.src as string))
      .reduce((acc, { x, y, width: w, height: h, item }, index) => {
        const imageSrc = item.source.src as string;

        const frameName = (frameNames !== undefined)
          ? frameNames.get(item) // get framename from path's index
          : imageSrc.replace(baseUrl, ""); // remove baseUrl to determine final frame name

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