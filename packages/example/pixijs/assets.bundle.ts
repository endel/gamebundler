import fs from "fs";

import bundle from "@gamebundler/comptime";
import CANVAS from "canvas";
import PSD from "psd";

// import psdfile from "./assets/assets.psd";

// const sources = {};
// const psd = PSD.fromFile(psdfile);
// psd.parse();
// psd.tree().descendants().forEach(node => {
//   if (node.type === "layer") {
//     let name = node.name;
//     let parent = node.parent;
//     while (parent) {
//       name = `${parent.name}-${name}`;
//       parent = node.parent;

//       // skip "unused" layers
//       if (
//         name.indexOf("unused") >= 0 ||
//         parent.isGroup() ||
//         parent.isRoot()
//       ) {
//         break;
//       }
//     }

//     const image = node.toPng();

//     if (image.width > 0 && image.height > 0) {
//       sources[name] = image;
//     }
//   }
// });

// export const mazmorra = await bundle.spritesheet(sources);

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
