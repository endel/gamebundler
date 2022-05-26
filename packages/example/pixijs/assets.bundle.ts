console.log("I'm on assets.bundle!");

import * as bundler from "@gamebundler/comptime";

import bottom0 from './assets/ball/bottom-0.png';

// import balls from './assets/ball/*.png';


console.log("I'm gonna run bundler.spritesheet...");
const result = bundler.spritesheet([
  bottom0,
  require('./assets/ball/bottom-1.png'),
  require('./assets/ball/bottom-2.png'),

  require('./assets/ball/left-0.png'),
  require('./assets/ball/left-1.png'),
  require('./assets/ball/left-2.png'),

  require('./assets/ball/bottom-left-0.png'),
  require('./assets/ball/bottom-left-1.png'),
  require('./assets/ball/bottom-left-2.png'),

  require('./assets/ball/top-left-0.png'),
  require('./assets/ball/top-left-1.png'),
  require('./assets/ball/top-left-2.png'),

  require('./assets/ball/top-0.png'),
  require('./assets/ball/top-1.png'),
  require('./assets/ball/top-2.png'),
]);

console.log("Now let's await for the result...", result);
export const spritesheet = await result;