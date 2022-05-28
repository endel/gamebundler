import * as PIXI from "pixi.js";
import { canvas } from "@gamebundler/runtime";

import { spritesheet } from "./assets.bundle";

(window as any).PIXI = PIXI;

console.log("RAW SPRITESHEET:", spritesheet);

const app = new PIXI.Application({
  view: canvas,
  backgroundColor: 0x000000,
});

app.start();

const loader = PIXI.Loader.shared;
loader.add("spritesheet", spritesheet.json);
loader.load(() => {
  const sheet = loader.resources['spritesheet'];
  console.log("sheet:", sheet);
  console.log("textures:", sheet.textures);
  const sprite = new PIXI.Sprite(sheet.textures['/Users/endel/Projects/gamebundler/packages/example/pixijs/assets/ball/bottom-0.png']);
  console.log({ sprite });
  console.log("COMPLETE!")
});

// listen for window resize events
window.addEventListener('resize', resize);

// resize function window
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();
