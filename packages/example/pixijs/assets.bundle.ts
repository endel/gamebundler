import fs from "fs";

import bundle from "@gamebundler/comptime";
import CANVAS from "canvas";
import PSD from "psd";

import psdfile from "./assets/assets.psd";

const psd = PSD.fromFile(psdfile);
psd.parse();

const files: any = {};
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
      files[name] = image;
    }
  }
});

export const mazmorra = await bundle.spritesheet(files);

// const canvas = CANVAS.createCanvas(100, 100);

// const context = canvas.getContext("2d")
// context.fillStyle = "red";
// context.fillRect(5, 5, 90, 90);
// context.fillStyle = "green";
// context.fillRect(10, 10, 70, 70);

// const filename = `${bundle.config.getCacheDir()}/generated.png`;
// fs.writeFileSync(filename, canvas.toBuffer());

export const image = await bundle.image(require("./assets/emotes/heart.png"));

export const spritesheet = await bundle.spritesheet([
  // require('./assets/ball/*.png'),

  require('./assets/ball/bottom-0.png'),
  require('./assets/ball/bottom-1.png'),
  require('./assets/ball/bottom-2.png'),

  require('./assets/ball/left-0.png'),
  require('./assets/ball/left-1.png'),
  require('./assets/ball/left-2.png'),

  require('./assets/ball/bottom-left-0.png'),
  require('./assets/ball/bottom-left-1.png'),
  require('./assets/ball/bottom-left-2.png'),

  // require('./assets/ball/top-left-0.png'),
  // require('./assets/ball/top-left-1.png'),
  // require('./assets/ball/top-left-2.png'),

  // require('./assets/ball/top-0.png'),
  // require('./assets/ball/top-1.png'),
  // require('./assets/ball/top-2.png'),
]);

export const audio = await bundle.audiosprite([
  require('./assets/sound/*.ogg'),

  // require('./assets/sound/switch2.ogg'),
  // require('./assets/sound/switch3.ogg'),
]);
