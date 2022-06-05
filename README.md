# 🕹📦 Web Game Compiler and Asset Bundler

A modern build tool for crafting HTML5 games. Features compile-time asset building and asset optimization. Built on top of [`esbuild`](https://esbuild.github.io/).

> **Warning**
> This is an experimental piece of software that may change its API's at any point. **Use at your own risk.**


# TODO:

- Live-reload when `.bundle.ts` changed (must re-generate assets)
- Cache mechanism to avoid re-generating assets without changes
- Integrate framework's loader system to allow end user to consume the asset
- Generate manifest of each `.bundle` - remove unused assets when a new one is generated.
- Single-component "Playground"
- Component-driven / Storybook / "Playground"
- Dynamically importing, loading, and using a `.bundle.ts`
- Dynamically importing and executing code for "game levels"

**Nice to have**

- Built-in Dear ImGui integration

# Why?

Game developers often have specific needs not always met by modern web tooling. Yet this tool bridges the gap to bring a modern web development environment made for game developers.

## Usage

```typescript
// assets.bundle.ts
import comptime from "@gamebundler/comptime";

export const spritesheet = await comptime.spritesheet([
  require('./assets/ball/*.png'),
]);

export const audio = await comptime.audiosprite([
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


