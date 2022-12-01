import * as bundle from "@gamebundler/comptime";

export const audio = await bundle.audiosprite([
  require("./audio/*.ogg")
]);

export const catastrophi = await bundle.image(require('./catastrophi.png'));
export const flixelButton = await bundle.image(require('./flixel-button.png'));

export const nokia16blackImage = await bundle.image(require('./fonts/nokia16black.png'));
export const nokia16blackXML = await bundle.raw(require('./fonts/nokia16black.xml'));