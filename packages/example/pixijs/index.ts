import * as PIXI from "pixi.js";
import { canvas } from "@gamebundler/runtime";

import { spritesheet } from "./assets.bundle";

console.log({ spritesheet });

const app = new PIXI.Application({
  view: canvas,
  backgroundColor: 0x000000,
});

app.start();

// listen for window resize events
window.addEventListener('resize', resize);

// resize function window
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();
