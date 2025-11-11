# @sylphx/silk-svelte

Svelte bindings for Silk - zero-runtime CSS-in-TypeScript with **reactive stores** and **minimal re-renders**.

## Installation

```bash
npm install @sylphx/silk-svelte
# or
bun add @sylphx/silk-svelte
```

## Quick Start

### 1. Create Silk Config

```typescript
// src/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkSvelte } from '@sylphx/silk-svelte'

export const { css, cx } = createSilkSvelte(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 2. Use in Svelte Components

```svelte
<script lang="ts">
  import { css } from '../silk.config'

  const button = css({
    bg: 'brand.500',
    px: 4,
    py: 2,
    color: 'white',
    _hover: { opacity: 0.8 }
  })
</script>

<button class={button}>
  Click me
</button>
```

### 3. Use in App

```svelte
<script lang="ts">
  import { css } from './silk.config'
  import Button from './components/Button.svelte'

  const container = css({
    p: 4,
    display: 'flex',
    gap: 4
  })
</script>

<div class={container}>
  <h1>Welcome to Silk + Svelte!</h1>
  <Button>Click me</Button>
</div>
```

## Features

### ✅ Reactive Stores Support
- Perfect integration with Svelte's reactivity
- Minimal re-renders
- Optimal performance

### ✅ Type Safety
- Full TypeScript support
- Only design tokens allowed
- Compile-time validation

### ✅ Zero Runtime
- CSS extracted at build time
- No runtime overhead
- Smallest possible bundles

### ✅ Modern CSS
- Container queries (93% support)
- @scope (85% support)
- @starting-style (88% support)
- OKLCH colors, color-mix

## Advanced Usage

### Dynamic Styles with Reactivity

```svelte
<script lang="ts">
  import { css } from './silk.config'

  let count = 0

  $: buttonStyle = css({
    bg: count > 5 ? 'red.500' : 'blue.500',
    color: 'white',
    px: 4,
    py: 2
  })
</script>

<button class={buttonStyle} on:click={() => count++}>
  Count: {count}
</button>
```

### Component Variants

```svelte
<script lang="ts">
  import { css, mergeStyles } from './silk.config'

  export let variant: 'primary' | 'secondary' = 'primary'

  const baseStyles = { px: 4, py: 2 }
  const primaryStyles = { bg: 'brand.500', color: 'white' }
  const secondaryStyles = { bg: 'gray.200', color: 'gray.900' }

  $: buttonStyle = css(
    mergeStyles(
      baseStyles,
      variant === 'primary' ? primaryStyles : secondaryStyles
    )
  )
</script>

<button class={buttonStyle}>
  <slot />
</button>
```

### Combining Classes

```svelte
<script lang="ts">
  import { css, cx } from './silk.config'

  const base = css({ p: 4 })
  const highlighted = css({ bg: 'yellow.200' })

  let isHighlighted = false
</script>

<div class={cx(base, isHighlighted && highlighted)}>
  Content
</div>
```

### Container Queries

```svelte
<script lang="ts">
  import { css } from './silk.config'

  const card = css({
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',

    '@container (min-width: 400px)': {
      flexDirection: 'row',
      gap: 4
    }
  })
</script>

<div class={card}>
  <div>Left</div>
  <div>Right</div>
</div>
```

### Props-based Styling

```svelte
<script lang="ts">
  import { css } from './silk.config'
  import type { TypedStyleProps } from '@sylphx/silk-svelte'

  type Config = typeof import('./silk.config')['config']
  type StyleProps = TypedStyleProps<Config>

  export let bg: StyleProps['bg'] = 'gray.100'
  export let px: StyleProps['px'] = 4
  export let py: StyleProps['py'] = 4

  $: boxStyle = css({ bg, px, py })
</script>

<div class={boxStyle}>
  <slot />
</div>

<!-- Usage: <Box bg="brand.500" px={8} py={6}>Content</Box> -->
```

## Vite / SvelteKit Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte(),
    // Silk Vite plugin for CSS extraction
  ],
})
```

```typescript
// svelte.config.js (SvelteKit)
import adapter from '@sveltejs/adapter-auto'

export default {
  kit: {
    adapter: adapter(),
    // Silk works out of the box with SvelteKit!
  }
}
```

## Performance Comparison

| Framework | Bundle Size | Re-renders | Reactivity |
|-----------|-------------|------------|------------|
| **Silk + Svelte** | **500B** | ✅ Minimal | ✅ Fine-grained |
| Styled Components | 15KB | ❌ Many | ⚠️ Component-level |
| Emotion | 12KB | ❌ Many | ⚠️ Component-level |

Svelte's compiler + Silk's zero-runtime = **Fastest possible styling solution**.

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin

## Documentation

Full documentation: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
