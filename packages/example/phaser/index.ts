///<reference types="gamebundler" />

import Phaser from "phaser";
import { loadBundle } from "@gamebundler/runtime/phaser3";

import * as bundle from "./assets/assets.bundle";

// import titleImage from "./assets/catastrophi.png";
// import buttonImage from "./assets/flixel-button.png";

// import nokiaFontImage from "./assets/fonts/nokia16black.png";
// import nokiaFontXML from './assets/fonts/nokia16black.xml';

// import sfxJSON from "./assets/audio/fx_mixdown.json";
// import fx_mixdownogg from "./assets/audio/fx_mixdown.ogg";
// import fx_mixdownmp3 from "./assets/audio/fx_mixdown.mp3";

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  },
  pixelArt: true
};

var game = new Phaser.Game(config);


async function preload (this: Phaser.Scene)
{
  const loaded = await loadBundle(this, bundle);
  // this.load.image('title', titleImage);
  // this.load.spritesheet('button', buttonImage, { frameWidth: 80, frameHeight: 20 });
  // this.load.bitmapFont('nokia', nokiaFontImage, nokiaFontXML);

  // this.load.audioSprite('sfx', 'assets/audio/fx_mixdown.json', [fx_mixdownogg, fx_mixdownmp3,]);
}

function create ()
{
  this.add.image(400, 300, 'title');

  var spritemap = this.cache.json.get('sfx').spritemap;

  var i = 0;
  for (var spriteName in spritemap) {
    if (!spritemap.hasOwnProperty(spriteName)) {
      continue;
    }

    makeButton.call(this, spriteName, 680, 115 + i * 40);

    i++;
  }

  this.input.on('gameobjectover', function (pointer, button) {
    setButtonFrame(button, 0);
  });

  this.input.on('gameobjectout', function (pointer, button) {
    setButtonFrame(button, 1);
  });

  this.input.on('gameobjectdown', function (pointer, button) {
    this.sound.playAudioSprite('sfx', button.name);

    setButtonFrame(button, 2);

  }, this);

  this.input.on('gameobjectup', function (pointer, button) {
    setButtonFrame(button, 0);
  });
}

function makeButton(name, x, y) {
  var button = this.add.image(x, y, 'button', 1).setInteractive();
  button.name = name;
  button.setScale(2, 1.5);

  var text = this.add.bitmapText(x - 40, y - 8, 'nokia', name, 16);
  text.x += (button.width - text.width) / 2;
}

function setButtonFrame(button, frame) {
  button.frame = button.scene.textures.getFrame('button', frame);
}
