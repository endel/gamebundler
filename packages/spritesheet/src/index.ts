import Canvas from "canvas";
import cropping from "detect-edges";
import pack from "bin-pack";

// FIXME: can read JSON module when supported
import { readFile } from "fs/promises";
// import pkg from "../package.json";
//
// const { homepage, version } = pkg;

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

  /**
   * Name of the image file (for reference in the JSON file)
   */
  outputName?: string,

  /**
   * Scale of the output image
   */
  scale?: number,
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
  outputName: "spritesheet.png",
  scale: 1,
};

export default async (paths: string[], options?: Options) => {
  const { outputFormat, margin, crop, outputName, scale } = {
    ...defaultOptions,
    ...options,
  };

  //
  // TODO: effectively use "scale"
  // (currently not in use)
  //

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

  // FIXME: can read JSON module when supported
  const pkgJSON = await readFile(new URL("../package.json", import.meta.url));
  const { homepage, version } = JSON.parse(pkgJSON.toString());

  // Load all images
  const loads = paths.map(path => loadImage(path));
  const images = await Promise.all(loads);

  const playground = createCanvas(undefined, undefined); // TODO: is it required to provide size here?
  const playgroundContext = playground.getContext("2d");

  // Crop all image
  const data = await Promise.all(images.map(async (source) => {
    const { width, height } = source;
    playground.width = width;
    playground.height = height;
    playgroundContext.drawImage(source, 0, 0);

    const cropped = crop ? await cropping(playground) : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    return {
      width: (width - cropped.left - cropped.right) + margin,
      height: (height - cropped.top - cropped.bottom) + margin,
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
    context.drawImage(item.source, x - item.cropped.left + margin, y - item.cropped.top + margin);
  });

  // Write JSON
  const json: JSONOutput = {
    // Global data about the generated file
    meta: {
      app: homepage,
      version,
      image: outputName,
      size: {
        w: width,
        h: height,
      },
      scale,
    },
    frames: items
      .sort((a, b) => a.item.source.src.localeCompare(b.item.source.src))
      .reduce((acc, { x, y, width: w, height: h, item }) => {
        acc[item.source.src] = {
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

  // Write image
  const image = canvas.toBuffer(`image/${outputFormat}` as "image/png");

  return { json, image, };
};