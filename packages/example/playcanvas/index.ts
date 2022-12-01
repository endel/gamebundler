import * as pc from "playcanvas";

import { canvas } from "@gamebundler/runtime";
import { loadBundle } from "@gamebundler/runtime/playcanvas";

import * as bundle from "./assets/assets.bundle";

console.log("BUNDLE:", bundle);

// create a PlayCanvas application

const app = new pc.Application(canvas);

// fill the available space at full resolution
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// create box entity
const box = new pc.Entity('cube');
box.addComponent('model', { type: 'box' });

// app.assets.add()


    // new pc.Asset(skybox_cloud.bottom, "texture", { url: skybox_cloud.bottom }),
    // new pc.Asset(skybox_cloud.east, "texture", { url: skybox_cloud.east }),
    // new pc.Asset(skybox_cloud.north, "texture", { url: skybox_cloud.north }),
    // new pc.Asset(skybox_cloud.south, "texture", { url: skybox_cloud.south }),
    // new pc.Asset(skybox_cloud.top, "texture", { url: skybox_cloud.top }),
    // new pc.Asset(skybox_cloud.west, "texture", { url: skybox_cloud.west })


// let assetsLoaded = 0;
// assetsToLoad.forEach((url) => {
//   // app.assets.load()
//
//   app.loader.load(url, "texture", (err, texture) => {
//     textures[url] = texture;
//     (window as any).texture = texture;
//
//     assetsLoaded++;
//
//     if (assetsLoaded === assetsToLoad.length) {
//       console.log("ALL LOADED!");
//
//       // const textureAssets = [
//       //   textures[ block_textures.grass_path_top ],
//       //   textures[ block_textures.grass_path_side ],
//       //   textures[ block_textures.grass_path_side ],
//       //   textures[ block_textures.grass_path_side ],
//       //   textures[ block_textures.grass_path_side ],
//       //   textures[ block_textures.grass_path_top ],
//       // ];
//
//       // const skyboxCubemap = new pc.Asset("skybox", "cubemap", null, {
//       //   anisotropy: 1,
//       //   magFilter: 1,
//       //   minFilter: 5,
//       //   // rgbm: true,
//       //   textures: [
//       //     textures[ skybox_cloud.bottom ],
//       //     textures[ skybox_cloud.east ],
//       //     textures[ skybox_cloud.north ],
//       //     textures[ skybox_cloud.south ],
//       //     textures[ skybox_cloud.top ],
//       //     textures[ skybox_cloud.west ],
//       //   ]
//       // });
//       // skyboxCubemap.loadFaces = false;
//
//
//
//       // const options = {
//       //   device: app.graphicsDevice,
//       //   sourceCubemap: skyboxCubemap,
//       //   method: 1,
//       //   samples: 4096,
//       //   cpuSync: true,
//       //   filteredFixed: [],
//       //   filteredFixedRgbm: [],
//       //   singleFilteredFixedRgbm: true
//       // };
//       // const cubemapTexture = pc.prefilterCubemap(options); // add return at pc.prefilterCubemap
//       //
//       // cubemap._dds = cubemapTexture;
//       // cubemap._levelsEvents = textureAssets;
//
//       app.setSkybox(skyboxCubemap);
//
//       // app.assets.load(cubemap);
//
//     }
//   });
// });

// create camera entity
const camera = new pc.Entity('camera');
camera.addComponent('camera', {
  clearColor: new pc.Color(0.1, 0.1, 0.1)
});
camera.setPosition(0, 0, 3);

// create directional light entity
const light = new pc.Entity('light');
light.addComponent('light');
light.setEulerAngles(45, 0, 0);

const floor = new pc.Plane(new pc.Vec3(5, 5, 5), new pc.Vec3(0, 1, 0));

app.root.addChild(camera);
app.root.addChild(box);
app.root.addChild(light);
// app.root.addChild(floor);

loadBundle(app, bundle).then((res) => {
  console.log(res);
});

// rotate the box according to the delta time since the last frame
app.on('update', dt => box.rotate(10 * dt, 20 * dt, 30 * dt));

// ensure canvas is resized when window changes size
window.addEventListener('resize', () => app.resizeCanvas());

app.start();
