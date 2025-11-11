# @sylphx/silk-solid

Solid.js bindings for Silk - zero-runtime CSS-in-TypeScript with **fine-grained reactivity** and **optimal performance**.

## Installation

```bash
npm install @sylphx/silk-solid
# or
bun add @sylphx/silk-solid
```

## Quick Start

### 1. Create Silk Config

```typescript
// src/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkSolid } from '@sylphx/silk-solid'

export const { styled, Box, Flex, css } = createSilkSolid(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 2. Use Styled Components

```typescript
// src/components/Button.tsx
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

```typescript
// src/App.tsx
import { Button } from './components/Button'
import { Box } from './silk.config'

function App() {
  return (
    <Box px={4} py={6}>
      <h1>Welcome to Silk + Solid!</h1>
      <Button>Click me</Button>
    </Box>
  )
}

export default App
```

## Features

### ✅ Fine-Grained Reactivity
- Perfect integration with Solid's reactivity model
- Zero unnecessary re-renders
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

### Styled Components with Props

```typescript
import { styled } from './silk.config'
import type { Component } from 'solid-js'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
}

const StyledButton = styled('button', {
  px: 4,
  py: 2
})

export const Button: Component<ButtonProps> = (props) => {
  return (
    <StyledButton
      bg={props.variant === 'secondary' ? 'gray.200' : 'brand.500'}
      color={props.variant === 'secondary' ? 'gray.900' : 'white'}
    >
      {props.children}
    </StyledButton>
  )
}
```

### Dynamic Styles

```typescript
import { css } from './silk.config'
import { createSignal } from 'solid-js'

function Counter() {
  const [count, setCount] = createSignal(0)

  const containerStyle = css({
    display: 'flex',
    gap: 4,
    p: 4
  })

  return (
    <div class={containerStyle}>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span>{count()}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  )
}
```

### Container Queries

```typescript
const ResponsiveCard = styled('div', {
  containerType: 'inline-size',
  display: 'flex',
  flexDirection: 'column',

  '@container (min-width: 400px)': {
    flexDirection: 'row',
    gap: 4
  }
})
```

### Composition

```typescript
import { mergeStyles } from '@sylphx/silk-solid'

const baseButton = { px: 4, py: 2 }
const primaryButton = { bg: 'brand.500', color: 'white' }
const largeButton = { px: 6, py: 3 }

const Button = styled('button',
  mergeStyles(baseButton, primaryButton, largeButton)
)
```

## Vite Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    solid(),
    // Silk Vite plugin for CSS extraction
  ],
})
```

## SolidStart Integration

```typescript
// app.config.ts
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  // Your SolidStart config
  // Silk works out of the box!
})
```

## Performance Comparison

| Framework | Bundle Size | Re-renders | Reactivity |
|-----------|-------------|------------|------------|
| **Silk + Solid** | **500B** | ✅ Zero | ✅ Fine-grained |
| Styled Components | 15KB | ❌ Many | ⚠️ Component-level |
| Emotion | 12KB | ❌ Many | ⚠️ Component-level |

Solid's fine-grained reactivity + Silk's zero-runtime = **Fastest possible styling solution**.

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin

## Documentation

Full documentation: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
