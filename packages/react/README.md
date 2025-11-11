# @sylphx/silk-react

React bindings for Silk - type-safe styled components without codegen.

## Installation

```bash
npm install @sylphx/silk @sylphx/silk-react
# or
bun add @sylphx/silk @sylphx/silk-react
```

## Quick Start

```tsx
import { defineConfig } from '@sylphx/silk'
import { createSilkReact } from '@sylphx/silk-react'

const config = defineConfig({
  colors: { brand: { 500: '#3b82f6' } },
  spacing: { 4: '1rem', 6: '1.5rem' }
})

const { styled, Box } = createSilkReact(config)

// Styled components with full type safety
const Button = styled('button', {
  bg: 'brand.500',
  px: 6,
  py: 4,
  _hover: { opacity: 0.8 }
})

// Or use Box with inline styles
function App() {
  return (
    <Box px={4} py={6}>
      <Button>Click me</Button>
    </Box>
  )
}
```

## Features

- ✅ **Styled Components** - `styled()` API like styled-components
- ✅ **Box Component** - Flexible primitive with style props
- ✅ **Full Type Safety** - Only design tokens allowed
- ✅ **Zero Runtime** - Build-time CSS extraction with Babel plugin
- ✅ **React 18+** - Modern React support

## Zero-Runtime Compilation

As of v2.0, Silk uses **build-time transformation** for true zero-runtime overhead:

### Setup with Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    silk(), // Add BEFORE React plugin
    react(),
  ],
})
```

### Direct css() Import Pattern

For zero-runtime, import `css` directly instead of using `createStyleSystem()`:

```tsx
// ✅ Zero-Runtime (recommended)
import { css } from '@sylphx/silk'

const button = css({
  bg: 'blue',
  color: 'white',
  px: 4,
  py: 2,
  _hover: { opacity: 0.8 }
})

function Button({ children }) {
  return <button className={button}>{children}</button>
}
```

### How It Works

1. **Build Time**: Babel plugin transforms `css()` calls into static class names
   ```tsx
   // Your code
   const button = css({ bg: 'blue', p: 4 })

   // Transformed to
   const button = "silk_bg_blue_ey45 silk_p_4_dozm"
   ```

2. **CSS Extraction**: CSS rules extracted to separate `silk.css` file
   ```css
   .silk_bg_blue_ey45 { background-color: blue; }
   .silk_p_4_dozm { padding: 1rem; }
   ```

3. **Runtime**: Zero CSS-in-JS overhead, just static class names

### Performance Benefits

- **-6.5KB JS bundle** (runtime code tree-shaken)
- **1KB CSS file** (atomic classes)
- **389B Brotli** (-61% compression)
- **0ms runtime** (no CSS generation at runtime)

### Using with Styled Components

The `styled()` API works with zero-runtime automatically:

```tsx
import { createSilkReact } from '@sylphx/silk-react'

const { styled } = createSilkReact(config)

// Styles are extracted at build-time
const Button = styled('button', {
  bg: 'brand.500',
  px: 6,
  py: 4,
  _hover: { opacity: 0.8 }
})
```

**Note:** Ensure your bundler is configured with `@sylphx/silk-vite-plugin` or equivalent.

## Ecosystem

### Core
- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system

### Framework Integrations
- **[@sylphx/silk-vue](https://www.npmjs.com/package/@sylphx/silk-vue)** - Vue 3 Composition API
- **[@sylphx/silk-svelte](https://www.npmjs.com/package/@sylphx/silk-svelte)** - Svelte reactive stores
- **[@sylphx/silk-solid](https://www.npmjs.com/package/@sylphx/silk-solid)** - Solid.js fine-grained reactivity
- **[@sylphx/silk-qwik](https://www.npmjs.com/package/@sylphx/silk-qwik)** - Qwik resumability & zero hydration
- **[@sylphx/silk-preact](https://www.npmjs.com/package/@sylphx/silk-preact)** - Preact 3KB React alternative

### Meta-Framework Plugins
- **[@sylphx/silk-nextjs](https://www.npmjs.com/package/@sylphx/silk-nextjs)** - Next.js App Router & RSC
- **[@sylphx/silk-remix](https://www.npmjs.com/package/@sylphx/silk-remix)** - Remix streaming SSR
- **[@sylphx/silk-astro](https://www.npmjs.com/package/@sylphx/silk-astro)** - Astro islands architecture

### Build Tools
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin for build-time extraction

### Design System Presets
- **[@sylphx/silk-preset-material](https://www.npmjs.com/package/@sylphx/silk-preset-material)** - Material Design 3 preset (~2KB)
- **[@sylphx/silk-preset-minimal](https://www.npmjs.com/package/@sylphx/silk-preset-minimal)** - Minimal design system (~1KB)

## Documentation

Full documentation: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
