# @sylphx/silk-preact

Preact bindings for Silk - zero-runtime CSS-in-TypeScript with **3KB runtime** and React compatibility.

## Installation

```bash
npm install @sylphx/silk-preact
# or
bun add @sylphx/silk-preact
```

## Quick Start

### 1. Create Silk Config

```typescript
// src/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkPreact } from '@sylphx/silk-preact'

export const { styled, Box, Flex, Grid, css } = createSilkPreact(
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

```tsx
// src/app.tsx
import { Box } from './silk.config'
import { Button } from './components/Button'

export function App() {
  return (
    <Box px={4} py={6}>
      <h1>Welcome to Silk + Preact!</h1>
      <Button>Click me</Button>
    </Box>
  )
}
```

## Features

### ✅ Lightweight Runtime
- Only 3KB Preact runtime
- Smallest React-compatible framework
- Perfect for performance-critical apps

### ✅ React Compatibility
- Drop-in React replacement
- Use React ecosystem libraries
- Easy migration from React

### ✅ Type Safety
- Full TypeScript support
- Only design tokens allowed
- Compile-time validation

### ✅ Zero Runtime (Styling)
- CSS extracted at build time
- No runtime styling overhead
- Smallest possible bundles

## Advanced Usage

### Dynamic Styles with Hooks

```tsx
import { useState } from 'preact/hooks'
import { css } from './silk.config'

export function Counter() {
  const [count, setCount] = useState(0)

  const buttonStyle = css({
    bg: count > 5 ? 'red.500' : 'blue.500',
    color: 'white',
    px: 4,
    py: 2
  })

  return (
    <div>
      <button class={buttonStyle} onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
```

### Component Variants

```tsx
import { styled } from './silk.config'
import type { FunctionComponent } from 'preact'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: any
}

const StyledButton = styled('button', {
  px: 4,
  py: 2
})

export const Button: FunctionComponent<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  return (
    <StyledButton
      bg={variant === 'secondary' ? 'gray.200' : 'brand.500'}
      color={variant === 'secondary' ? 'gray.900' : 'white'}
      {...props}
    >
      {children}
    </StyledButton>
  )
}
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
import { Box, Flex, Grid } from './silk.config'

export function Layout() {
  return (
    <>
      {/* Box - Basic container */}
      <Box p={4} bg="gray.100">
        <h1>Hello</h1>
      </Box>

      {/* Flex - Flexbox layout */}
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <div>Left</div>
        <div>Right</div>
      </Flex>

      {/* Grid - Grid layout */}
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Grid>
    </>
  )
}
```

## Vite Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [
    preact(),
    // Silk Vite plugin for CSS extraction
  ],
})
```

## Preact CLI Integration

```javascript
// preact.config.js
export default {
  webpack(config, env, helpers) {
    // Silk works out of the box with Preact CLI!
    return config
  }
}
```

## Performance Comparison

| Framework | Runtime Size | Bundle Size (Styling) | Compatibility |
|-----------|-------------|------------------------|---------------|
| **Silk + Preact** | **3KB** | **500B** | ✅ React-compatible |
| React + Styled Components | 45KB | 15KB | ✅ React only |
| React + Emotion | 42KB | 12KB | ✅ React only |

Preact's 3KB runtime + Silk's 500B styling = **3.5KB total** vs **57KB for React alternatives**.

## Why Preact + Silk?

### 🚀 Ultra Lightweight
- 3KB Preact runtime
- 500B Silk styling
- **92% smaller than React alternatives**

### ⚡ Fast Performance
- Smaller bundles = faster loading
- Efficient virtual DOM
- Minimal re-renders

### 🔄 React Compatible
- Use React libraries
- Easy migration from React
- Familiar API

### 📦 Perfect for Production
- Performance-critical apps
- Mobile-first websites
- Progressive web apps

## Migration from React

Silk's Preact bindings work exactly like React bindings:

```tsx
// React (before)
import { createSilkReact } from '@sylphx/silk-react'
export const { styled, Box } = createSilkReact(config)

// Preact (after)
import { createSilkPreact } from '@sylphx/silk-preact'
export const { styled, Box } = createSilkPreact(config)
```

**That's it!** The API is identical.

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vue](https://www.npmjs.com/package/@sylphx/silk-vue)** - Vue 3 Composition API
- **[@sylphx/silk-svelte](https://www.npmjs.com/package/@sylphx/silk-svelte)** - Svelte reactive stores
- **[@sylphx/silk-solid](https://www.npmjs.com/package/@sylphx/silk-solid)** - Solid.js fine-grained reactivity
- **[@sylphx/silk-qwik](https://www.npmjs.com/package/@sylphx/silk-qwik)** - Qwik resumability

## Documentation

Full documentation: [GitHub Repository](https://github.com/sylphxltd/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
