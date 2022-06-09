import * as PIXI from "pixi.js";
import * as Sound from "@pixi/sound";
import { canvas } from "@gamebundler/runtime";

// import { spritesheet, audio } from "./assets.bundle";
import * as bundle from "./assets.bundle";

(window as any).PIXI = PIXI;

const sounds = Sound.Sound.from({
  url: bundle.audio.resources[0],
  sprites: bundle.audio.spritemap
});

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

const loader = PIXI.Loader.shared;

console.log("IMAGE", bundle.image);

loader.add("spritesheet", bundle.spritesheet.json);
// loader.add("mazmorra", bundle.mazmorra.json);
loader.add("image", bundle.image);

loader.load(() => {
  // const mazmorrasheet = loader.resources['mazmorra'];
  // console.log("mazmorra num textures:", mazmorrasheet, Object.keys(mazmorrasheet.textures).length);

  const sheet = loader.resources['spritesheet'];
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
    sounds.play(`switch${soundNum}`);
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

  const image = PIXI.Sprite.from("image");
  image.x = 15;
  image.y = 15;
  container.addChild(image);

  // // ['bow-1', 'bow-2', 'bow-3', 'bow-4'].forEach((name, i) => {
  // ['hp-potion-1', 'hp-potion-2', 'hp-potion-3', 'hp-potion-4'].forEach((name, i) => {
  //   const potion = new PIXI.Sprite(mazmorrasheet.textures[name]);
  //   potion.x = 5 + (20 * i);
  //   potion.y = 30;
  //   container.addChild(potion);
  // });

  console.log("COMPLETE!")
});

// listen for window resize events
window.addEventListener('resize', resize);

// resize function window
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();
