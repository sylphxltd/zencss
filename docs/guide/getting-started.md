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

### Next.js (Recommended)

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
}, {
  // Silk config
  srcDir: './src',  // or './app' for App Router
  debug: false
})
```

3. **Configure Babel**

```json
// .babelrc
{
  "presets": ["next/babel"],
  "plugins": ["@sylphx/babel-plugin-silk"]
}
```

4. **Update package.json**

::: warning Next.js 16+ Users
Next.js 16 defaults to **Turbopack**, but Silk requires **Webpack** for `css()` transformation.

Add the `--webpack` flag:
:::

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build"
  }
}
```

5. **Start coding!**

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

## Next Steps

- Learn about [Next.js integration](/guide/nextjs)
- Explore [responsive design](/guide/responsive)
- Check out [theming](/guide/theming)
- See [all configuration options](/api/configuration)
