import * as bundle from "@gamebundler/comptime";

export const cloudbox = await bundle.spritesheet(require("./skybox/cloudbox_*.png"), { crop: false });
export const nightbox = await bundle.spritesheet(require("./skybox/nightbox_*.png"), { crop: false });
export const nightbox2 = await bundle.spritesheet(require("./skybox/nightbox2_*.png"), { crop: false });

export const blocks = require("./minecraft/textures/block/*.png");

export const cubemap = require("./skybox/cloudbox_*.png");
export const carModel = require("./models/sedan.glb");