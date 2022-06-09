import bundle from "@gamebundler/comptime";

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
], {
  export: ['mp3','ac3','ogg','wav']
});
