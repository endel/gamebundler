import { canvas } from "@gamebundler/runtime";
import BABYLON, { Engine, Scene } from "babylonjs";

canvas.style.width = '100vw';
canvas.style.height = '100vh';

const engine = new Engine(canvas, true);
const scene = new Scene(engine);

// Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

// Target the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// Attach the camera to the canvas
camera.attachControl(canvas, false);

// Create a basic light, aiming 0, 1, 0 - meaning, to the sky
const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

// Create a built-in "sphere" shape using the SphereBuilder
const sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene);

// Move the sphere upward 1/2 of its height
sphere.position.y = 1;

// Create a built-in "ground" shape;
var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2, updatable: false }, scene);

window.addEventListener("resize", () => engine.resize());
engine.runRenderLoop(() => scene.render());