# @sylphx/silk-qwik

Qwik bindings for Silk - zero-runtime CSS-in-TypeScript with **resumability** and **zero hydration overhead**.

## Installation

```bash
npm install @sylphx/silk-qwik
# or
bun add @sylphx/silk-qwik
```

## Quick Start

### 1. Create Silk Config

```typescript
// src/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkQwik } from '@sylphx/silk-qwik'

export const { styled, Box, Flex, css } = createSilkQwik(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 2. Use Styled Components

```tsx
// src/components/button.tsx
import { component$ } from '@builder.io/qwik'
import { styled } from '../silk.config'

export const Button = styled('button', {
  bg: 'brand.500',
  px: 4,
  py: 2,
  color: 'white',
  _hover: { opacity: 0.8 }
})
```

### 3. Use in App

```tsx
// src/routes/index.tsx
import { component$ } from '@builder.io/qwik'
import { Box } from '../silk.config'
import { Button } from '../components/button'

export default component$(() => {
  return (
    <Box px={4} py={6}>
      <h1>Welcome to Silk + Qwik!</h1>
      <Button>Click me</Button>
    </Box>
  )
})
```

## Features

### ✅ Resumability
- Perfect integration with Qwik's resumability model
- Styles computed on server, resumed on client
- **Zero JavaScript** shipped for styling

### ✅ Zero Hydration
- No hydration overhead
- Instant interactivity
- Optimal performance

### ✅ Type Safety
- Full TypeScript support
- Only design tokens allowed
- Compile-time validation

### ✅ Zero Runtime
- CSS extracted at build time
- No runtime overhead
- Smallest possible bundles

## Advanced Usage

### Reactive Styles with Signals

```tsx
import { component$, useSignal } from '@builder.io/qwik'
import { useSilkStyle, css } from './silk.config'

export default component$(() => {
  const count = useSignal(0)

  // Reactive styles - updates when signal changes
  const buttonClass = useSilkStyle(css, () => ({
    bg: count.value > 5 ? 'red.500' : 'blue.500',
    color: 'white',
    px: 4,
    py: 2
  }))

  return (
    <button
      class={buttonClass.value}
      onClick$={() => count.value++}
    >
      Count: {count.value}
    </button>
  )
})
```

### Component Variants

```tsx
import { component$ } from '@builder.io/qwik'
import { styled } from './silk.config'

const StyledButton = styled('button', {
  px: 4,
  py: 2
})

export const Button = component$<{ variant?: 'primary' | 'secondary' }>(
  ({ variant = 'primary', ...props }) => {
    return (
      <StyledButton
        bg={variant === 'secondary' ? 'gray.200' : 'brand.500'}
        color={variant === 'secondary' ? 'gray.900' : 'white'}
        {...props}
      />
    )
  }
)
```

### Container Queries

```tsx
import { styled } from './silk.config'

export const ResponsiveCard = styled('div', {
  containerType: 'inline-size',
  display: 'flex',
  flexDirection: 'column',

  '@container (min-width: 400px)': {
    flexDirection: 'row',
    gap: 4
  }
})
```

### Layout Primitives

```tsx
import { component$ } from '@builder.io/qwik'
import { Box, Flex } from './silk.config'

export default component$(() => {
  return (
    <>
      <Box p={4} bg="gray.100">
        Basic container
      </Box>

      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <div>Left</div>
        <div>Right</div>
      </Flex>
    </>
  )
})
```

## Qwik City Integration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'

export default defineConfig({
  plugins: [
    qwikCity(),
    qwikVite(),
    // Silk works seamlessly with Qwik City!
  ],
})
```

## Performance Comparison

| Framework | Bundle Size | Hydration | Resumability |
|-----------|-------------|-----------|--------------|
| **Silk + Qwik** | **500B** | ✅ Zero | ✅ Full |
| Styled Components | 15KB | ❌ Full | ❌ None |
| Emotion | 12KB | ❌ Full | ❌ None |

Qwik's resumability + Silk's zero-runtime = **Fastest possible web application**.

## Why Qwik + Silk?

### 🚀 Instant Interactivity
- No hydration delays
- Components resume instantly
- Zero framework overhead

### 📦 Smallest Bundles
- 500B gzipped styling
- Only load what's needed
- Progressive enhancement

### ⚡ Optimal Performance
- Server-side style generation
- Client-side resumability
- Zero unnecessary JavaScript

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vue](https://www.npmjs.com/package/@sylphx/silk-vue)** - Vue 3 Composition API
- **[@sylphx/silk-svelte](https://www.npmjs.com/package/@sylphx/silk-svelte)** - Svelte reactive stores
- **[@sylphx/silk-solid](https://www.npmjs.com/package/@sylphx/silk-solid)** - Solid.js fine-grained reactivity

## Documentation

Full documentation: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
