# Getting Started

Get up and running with Silk in less than 5 minutes.

## Installation

::: code-group

```bash [Next.js]
bun add @sylphx/silk @sylphx/silk-nextjs @sylphx/babel-plugin-silk
```

```bash [Vite + React]
bun add @sylphx/silk @sylphx/silk-vite-plugin
```

```bash [Nuxt 3]
bun add @sylphx/silk @sylphx/silk-nuxt
```

:::

## Quick Setup

### Next.js (App Router)

1. **Install dependencies**

```bash
bun add @sylphx/silk @sylphx/silk-nextjs @sylphx/babel-plugin-silk
```

2. **Configure Next.js**

```ts
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Your Next.js config
  reactStrictMode: true,
})
```

3. **Start coding!**

```tsx
// app/page.tsx
import { css } from '@sylphx/silk'

const container = css({
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  background: 'linear-gradient(135deg, #667eea, #764ba2)'
})

const title = css({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: 'white'
})

export default function Home() {
  return (
    <div className={container}>
      <h1 className={title}>Hello Silk!</h1>
    </div>
  )
}
```

::: tip Turbopack Support
Silk fully supports Next.js 15+ with Turbopack enabled. No special configuration needed!
:::

### Vite + React

1. **Install**

```bash
bun add @sylphx/silk @sylphx/silk-vite-plugin
```

2. **Configure Vite**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { silkVitePlugin } from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    silkVitePlugin({
      srcDir: './src'
    })
  ]
})
```

3. **Start coding!**

```tsx
// src/App.tsx
import { css } from '@sylphx/silk'

const app = css({
  textAlign: 'center',
  padding: '2rem'
})

export function App() {
  return (
    <div className={app}>
      <h1>Hello Silk!</h1>
    </div>
  )
}
```

### Nuxt 3

1. **Install**

```bash
bun add @sylphx/silk @sylphx/silk-nuxt
```

2. **Configure Nuxt**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sylphx/silk-nuxt']
})
```

3. **Start coding!**

```vue
<script setup>
import { css } from '@sylphx/silk'

const container = css({
  padding: '2rem',
  textAlign: 'center'
})
</script>

<template>
  <div :class="container">
    <h1>Hello Silk!</h1>
  </div>
</template>
```

## Basic Usage

### Simple Styles

```tsx
import { css } from '@sylphx/silk'

const button = css({
  background: '#667eea',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer'
})

<button className={button}>Click me</button>
```

### Pseudo-classes

Use `_hover`, `_focus`, `_active`, etc:

```tsx
const button = css({
  background: '#667eea',
  color: 'white',

  _hover: {
    background: '#764ba2',
    transform: 'translateY(-2px)'
  },

  _active: {
    transform: 'translateY(0)'
  }
})
```

### Responsive Design

Use breakpoint objects:

```tsx
const container = css({
  padding: {
    base: '1rem',      // Mobile
    md: '2rem',        // Tablet
    lg: '4rem'         // Desktop
  },

  fontSize: {
    base: '16px',
    md: '18px',
    lg: '20px'
  }
})
```

Learn more about [responsive design](/guide/responsive).

### Combining Styles

```tsx
const base = css({
  padding: '1rem',
  borderRadius: '8px'
})

const primary = css({
  background: '#667eea',
  color: 'white'
})

<button className={`${base} ${primary}`}>
  Primary Button
</button>
```

## How It Works

Silk uses **build-time transformation** to extract CSS from your TypeScript code:

```tsx
// Your code (input)
const button = css({ color: 'red', padding: '1rem' })

// After build (output)
const button = 'silk-a7f3 silk-b2e1'

// Generated CSS (extracted to .css file)
.silk-a7f3 { color: red; }
.silk-b2e1 { padding: 1rem; }
```

**Key benefits:**
- ✅ **Zero runtime** - No JavaScript for styling in the browser
- ✅ **Atomic CSS** - Automatic deduplication, 45-65% smaller bundles
- ✅ **Type-safe** - Full TypeScript support with IntelliSense
- ✅ **Framework agnostic** - Works with React, Vue, Svelte, and more

## Next Steps

- Learn about [Next.js integration](/guide/nextjs)
- Explore [responsive design](/guide/responsive)
- Check out [theming](/guide/theming)
- See [configuration options](/api/configuration)
