import * as PIXI from "pixi.js";
import * as Sound from "@pixi/sound";
import { canvas } from "@gamebundler/runtime";

// import { spritesheet, audio } from "./assets.bundle";
import { spritesheet, audio } from "./assets.bundle";

(window as any).PIXI = PIXI;

console.log("RAW AUDIOSPRITE:", audio);
// console.log("RAW SPRITESHEET:", spritesheet);

// console.log("WHERE'S MY SOUND??");
const sounds = Sound.Sound.from({
  url: audio.resources[0],
  sprites: audio.spritemap
});

// console.log("SOUNDS", sounds);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.RESOLUTION = window.devicePixelRatio * 2;

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

  const animation = new PIXI.AnimatedSprite([
    sheet.textures['assets/ball/bottom-0.png'],
    sheet.textures['assets/ball/bottom-1.png'],
    sheet.textures['assets/ball/bottom-2.png'],
  ]);
  animation.animationSpeed = 0.2;
  animation.play();

  animation.interactive = true;
  animation.addListener("click", () => {
    // number from 1 to 3
    const soundNum = Math.floor(Math.random() * 3) + 1;
    console.log("CLICKED", { soundNum });
    sounds.play(`switch${soundNum}`);
  });


  // const sprite = new PIXI.Sprite(sheet.textures['assets/ball/bottom-0.png']);
  // app.stage.addChild(sprite);

  app.stage.addChild(animation);
  console.log("COMPLETE!")
});

// listen for window resize events
window.addEventListener('resize', resize);

// resize function window
function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();
