# @sylphx/silk-nuxt

Nuxt 3 module for [Silk](https://github.com/SylphxAI/silk) - Zero-codegen, zero-runtime CSS-in-TypeScript.

## Features

- ✅ **Zero-codegen**: No manual `generate` commands
- ✅ **Zero-runtime**: CSS generated at build time
- ✅ **Auto-import**: Automatic CSS injection
- ✅ **HMR**: Hot Module Replacement support
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Framework integration**: Works with Nuxt's Vite pipeline

## Installation

```bash
npm install @sylphx/silk @sylphx/silk-nuxt
```

## Usage

### 1. Add module to `nuxt.config.ts`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sylphx/silk-nuxt']
})
```

### 2. Use in your components

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem({})

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f5f5f5'
  } as any),
  title: css({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00DC82'
  } as any)
}
</script>

<template>
  <div :class="styles.container.className">
    <h1 :class="styles.title.className">
      Nuxt + Silk ✅
    </h1>
  </div>
</template>
```

That's it! No need to manually import `silk.css` - the module handles it automatically.

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sylphx/silk-nuxt'],

  silk: {
    // Source directory to scan for css() calls
    // Default: Nuxt's srcDir
    srcDir: './app',

    // Virtual module ID
    // Default: 'silk.css'
    virtualModuleId: 'silk.css',

    // Enable debug logging
    // Default: false
    debug: true,

    // Enable CSS minification
    // Default: true in production, false in dev
    minify: true,

    // Auto-import silk.css globally
    // Default: true
    autoImport: true
  }
})
```

## Manual Import (if autoImport: false)

```vue
<!-- app.vue -->
<script setup>
import 'silk.css'
</script>

<template>
  <NuxtPage />
</template>
```

## How it works

1. The module wraps `@sylphx/silk-vite-plugin`
2. Scans your source files for `css()` calls at build time
3. Generates optimized CSS with lightningcss-wasm
4. Creates a virtual module that Nuxt's Vite pipeline processes
5. Auto-imports the CSS (if `autoImport: true`)
6. CSS flows through Nuxt's PostCSS, minification, and bundling

## Benefits over manual Vite plugin

**With `@sylphx/silk-nuxt`:**
```typescript
export default defineNuxtConfig({
  modules: ['@sylphx/silk-nuxt']
})
```

**Without (manual Vite plugin):**
```typescript
import silk from '@sylphx/silk-vite-plugin'

export default defineNuxtConfig({
  vite: {
    plugins: [silk()]
  }
})
```

The Nuxt module provides:
- ✅ Simpler configuration
- ✅ Auto-import support
- ✅ Nuxt-specific optimizations
- ✅ Better integration with Nuxt's build system

## License

MIT © SylphX Ltd
