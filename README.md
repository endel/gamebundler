# 🕹📦 Web Game Compiler and Asset Bundler

A modern build tool for crafting HTML5 games. Features compile-time asset building and industry standards asset optimization. Built on top of [`esbuild`](https://esbuild.github.io/).

> **Warning**
> This is an experimental.  **Use at your own risk.**

# TODO:

- [x] Live-reload when `.bundle.ts` changed (must re-generate assets)
- [-] Generate manifest of each `.bundle`
  - [ ] Remove unused assets when a new one is generated.
  - [x] Cache mechanism to avoid re-generating assets without changes [devmode, optimization]
- [-] Integrate framework's loader system to allow end user to consume the asset [runtime, feature]
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

# Why?

Game developers often have specific needs not always met by modern web tooling. Yet this tool bridges the gap to bring a modern web development environment made for game developers.

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

**Integrates nicely with:**

- PixiJS
- Phaser
- PlayCanvas
- Babylon.js
- TODO: React

## Backlog / Research:

- remote imgui https://github.com/ocornut/imgui
- esbuild, use `assetNames`: https://esbuild.github.io/api/#asset-names
- https://github.com/WICG/webpackage

## License

MIT © Endel Dreyer


