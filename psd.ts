
import fs from "fs";
import CANVAS from "canvas";
import PSD from "psd";

import psdfile from "./assets/assets.psd";

const sources = {};
const psd = PSD.fromFile(psdfile);
psd.parse();
psd.tree().descendants().forEach(node => {
  if (node.type === "layer") {
    let name = node.name;
    let parent = node.parent;
    while (parent) {
      name = `${parent.name}-${name}`;
      parent = node.parent;

      // skip "unused" layers
      if (
        name.indexOf("unused") >= 0 ||
        parent.isGroup() ||
        parent.isRoot()
      ) {
        break;
      }
    }

    const image = node.toPng();

    if (image.width > 0 && image.height > 0) {
      sources[name] = image;
    }
  }
});

export const mazmorra = await bundle.spritesheet(sources);
