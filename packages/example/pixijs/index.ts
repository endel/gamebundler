import * as PIXI from "pixi.js";
import "@pixi/sound";

import { canvas } from "@gamebundler/runtime";
import { loadBundle } from "@gamebundler/runtime/lib/pixi";

import * as bundle from "./assets.bundle";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.ROUND_PIXELS = true;
// PIXI.settings.RESOLUTION = window.devicePixelRatio * 2;

const app = new PIXI.Application({
  view: canvas,
  backgroundColor: 0x000000,
});

app.start();

const container = new PIXI.Container();
container.scale.set(10);
app.stage.addChild(container);

console.log("Loading...");
loadBundle(bundle).then((resource) => {
  console.log('RES:', resource);
  const sheet = resource.spritesheet

  const sound = resource.audio.sound;

  console.log("sheet:", sheet);
  console.log("textures:", sheet.textures);
  console.log("num textures:", Object.keys(sheet.textures).length);

  const bottom = new PIXI.AnimatedSprite([
    sheet.textures['assets/ball/bottom-0.png'],
    sheet.textures['assets/ball/bottom-1.png'],
    sheet.textures['assets/ball/bottom-2.png'],
  ]);
  bottom.animationSpeed = 0.2;
  bottom.play();

  const border = new PIXI.Graphics();
  border.beginFill(0xFF0000);
  border.drawRect(bottom.x, bottom.y, bottom.width, bottom.height, );
  container.addChild(border);
  container.addChild(bottom);

  bottom.interactive = true;
  bottom.addListener("click", () => {
    // number from 1 to 3
    const soundNum = Math.floor(Math.random() * 3) + 1;
    console.log("CLICKED", { soundNum });
    sound.play(`switch${soundNum}`);
  });

  const left = new PIXI.AnimatedSprite([
    sheet.textures['assets/ball/left-0.png'],
    sheet.textures['assets/ball/left-1.png'],
    sheet.textures['assets/ball/left-2.png'],
  ]);
  left.x = 30;
  left.animationSpeed = 0.2;
  left.play();
  container.addChild(left);

  const image = PIXI.Sprite.from(resource.image.texture);
  image.x = 15;
  image.y = 15;
  container.addChild(image);

  console.log("COMPLETE!")

});

// listen for window resize events
window.addEventListener('resize', resize);

// resize function window
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();
