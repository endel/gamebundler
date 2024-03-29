/**
 * Copyright (c) 2020 Guillaume Martigny
 * https://github.com/GMartigny/detect-edges/
 */

import Canvas from "canvas";

const checkOpacityLevel = tolerance => (pixels) => {
  let transparent = true;
  for (let i = 3, l = pixels.length; i < l && transparent; i += 4) {
    transparent = transparent && pixels[i] === 255 * tolerance;
  }
  return transparent;
};

const defaultOptions = { tolerance: 0, };

export default (
  canvas: Canvas.Canvas,
  options?: {
    top: number,
    left: number,
    bottom: number,
    right: number
  }
) => {
  const { tolerance } = {
    ...defaultOptions,
    ...options,
  };

  const isTransparent = checkOpacityLevel(tolerance);

  const context = canvas.getContext("2d");
  const { width, height } = canvas;

  let pixels;

  let top = -1;
  do {
    ++top;
    pixels = context.getImageData(0, top, width, 1).data;
  } while (isTransparent(pixels) && top < height);

  if (top === height) {
    console.error(`\n\n❌ Can't detect spritesheet edges.\nPlease make sure you aren't trying to fit too many sprites into the spritesheet.\n\n`)
    return { top: 0, left: 0, bottom: 0, right: 0 };
  }

  // Left
  let left = -1;
  do {
    ++left;
    pixels = context.getImageData(left, top, 1, height - top).data;
  } while (isTransparent(pixels) && left < width);

  // Bottom
  let bottom = -1;
  do {
    ++bottom;
    pixels = context.getImageData(left, height - bottom - 1, width - left, 1).data;
  } while (isTransparent(pixels) && bottom < height);

  // Right
  let right = -1;
  do {
    ++right;
    pixels = context.getImageData(width - right - 1, top, 1, height - (top + bottom)).data;
  } while (isTransparent(pixels) && right < width);

  return {
    top,
    right,
    bottom,
    left,
  };
};