# 🕹📦 Web Game Compiler and Asset Bundler

**💨 Vaporware alert**

_This was just a naive experimentation of mine. It is not being actively worked on, but I decided to open-source in case somebody finds it useful. Perhaps this would work better as a set of vite plugins._

- [See "compile-time" asset bundle here](https://github.com/endel/gamebundler/blob/master/packages/example/pixijs/assets.bundle.ts)
- [See loading the bundle](https://github.com/endel/gamebundler/blob/master/packages/example/pixijs/index.ts#L5)

---

A modern build tool for crafting HTML5 games. Features compile-time asset building ~and industry standards asset optimization~ (it doesn't...). Built on top of [`esbuild`](https://esbuild.github.io/).

> **Warning**
> This is an experimental tool.  **Use at your own risk.**

# TODO:

- [x] Live-reload when `.bundle.ts` changed (must re-generate assets)
- [ ] Generate manifest of each `.bundle`
  - [ ] Remove unused assets when a new one is generated.
  - [x] Cache mechanism to avoid re-generating assets without changes [devmode, optimization]
- [ ] Integrate framework's loader system to allow end user to consume the asset [runtime, feature]
  - [x] PIXI
  - [ ] Phaser
  - [ ] PlayCanvas
  - [ ] Babylon.js
  - [ ] THREE
- [ ] Production mode (exclude .js/.css from dev)
  - [ ] Minify assets
  - [ ] Output file size stats
- [ ] Image optimizations
  - [ ] BASIS texture compression
  - [ ] lossless compression
  - [ ] lossy (many levels)
- [ ] Support multiple image scale ratios (e.g. 0.5x, 2x, 3x, etc.)
- [ ] Dynamically importing, loading, and using a `.bundle.ts`
- [ ] Dynamically importing and executing code as "game levels"
- [ ] Component-driven / Storybook / "Playground" (Single-component "Playground")

**Import types**

- WebGL Shaders (GLSL: glsl|wgsl|vert|frag|vs|fs)
- Web GPU Shaders (WGSL)

**Nice to have**

- Built-in Dear ImGui integration

## Usage

```typescript
// assets.bundle.ts
import bundle from "@gamebundler/comptime";

export const spritesheet = await bundle.spritesheet([
  require('./assets/ball/*.png'),
]);

export const audio = await bundle.audiosprite([
  require('./assets/sound/*.ogg')
]);
```

## Features

- Compresses images and textures
- Generates spritesheets
- Generates audio sprites

**Tiny runtime loader helper for:**

- PixiJS
- TODO: PlayCanvas
- TODO: Phaser
- TODO: Babylon.js
- TODO: React

## Backlog / Research:

- remote imgui https://github.com/ocornut/imgui
- esbuild, use `assetNames`: https://esbuild.github.io/api/#asset-names
- https://github.com/WICG/webpackage

## License

MIT © Endel Dreyer


