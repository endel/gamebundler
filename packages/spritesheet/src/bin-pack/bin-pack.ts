/**
 * (Taken from: https://github.com/bryanburgers/bin-pack)
 *
 * A packing algorithm for 2D bin packing. Largely based on code and a blog post by Jake Gordon.
 * This library packs objects that have a width and a height into as small of a square as possible, using a binary tree bin packing algorithm. After packing, each object is given an (x, y) coordinate of where it would be optimally packed.
 * The algorithm may not find the optimal bin packing, but it should do pretty will for things like sprite maps.
 */

import GrowingPacker from "./packer.growing";

export type Item = {
  item?: any;
  width: number;
  height: number;

  // populated by packer
  x?: number;
  y?: number;
}

export type PackedItems = {
  width: number;
  height: number;
  items?: Item[];
}

export default function (
  items: Array<{ width: number, height: number }>,
  options: { inPlace?: boolean } = {},
): PackedItems {
  const packer = new GrowingPacker();
  const inPlace = options.inPlace || false;

  // Clone the items.
  let newItems: Item[] = items.map(function (item) {
    return (inPlace)
      ? item
      : { width: item.width, height: item.height, item: item };
  });

  newItems = newItems.sort(function (a, b) {
    // TODO: check that each actually HAS a width and a height.
    // Sort based on the size (area) of each block.
    return (b.width * b.height) - (a.width * a.height);
  });

  packer.fit(newItems);

  var w = newItems.reduce(function (curr, item) { return Math.max(curr, item.x + item.width); }, 0);
  var h = newItems.reduce(function (curr, item) { return Math.max(curr, item.y + item.height); }, 0);

  var ret: PackedItems = {
    width: w,
    height: h
  };

  if (!inPlace) {
    ret.items = newItems;
  }

  return ret;
};