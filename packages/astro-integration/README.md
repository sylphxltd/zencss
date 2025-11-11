# @sylphx/silk-astro

Astro integration for Silk - zero-runtime CSS-in-TypeScript with **islands architecture** and **partial hydration** support.

## Installation

```bash
npm install @sylphx/silk-astro
# or
bun add @sylphx/silk-astro
```

## Quick Start

### 1. Configure Astro

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react' // or other framework
import silk from '@sylphx/silk-astro'

export default defineConfig({
  integrations: [
    react(),
    silk({
      criticalCSS: true,    // Per-page critical CSS
      islands: true,        // Island-specific optimizations
      brotli: true         // Pre-compress CSS
    })
  ]
})
```

### 2. Create Silk Config

```typescript
// src/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkReact } from '@sylphx/silk-astro'

export const { styled, Box, css } = createSilkReact(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 3. Use in Astro Pages

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro'
import Button from '../components/Button'
---

<Layout title="Silk + Astro">
  <main>
    <h1>Welcome to Silk + Astro!</h1>
    <Button client:load>Click me</Button>
  </main>
</Layout>
```

### 4. Create Interactive Islands

```typescript
// src/components/Button.tsx
import { styled } from '../silk.config'

export const Button = styled('button', {
  bg: 'brand.500',
  px: 4,
  py: 2,
  _hover: { opacity: 0.8 }
})
```

## Features

### ✅ Islands Architecture
- Per-island CSS extraction
- Partial hydration support
- Zero CSS for non-interactive components

### ✅ Critical CSS
- Automatic per-page critical CSS
- Inlined in HTML for faster first paint
- Route-based CSS splitting

### ✅ Performance
- Brotli pre-compression (15-25% smaller)
- LightningCSS optimization (5-10x faster)
- Atomic CSS deduplication (10-20% smaller)
- Perfect for Astro's performance-first approach

### ✅ Multi-Framework Support
- Works with React, Preact, Solid, Vue, Svelte islands
- Framework-agnostic core
- Shared design tokens across frameworks

## Advanced Usage

### Per-Page CSS

```astro
---
// src/pages/dashboard.astro
import { extractPageCSS } from '@sylphx/silk-astro'

const pageCSS = extractPageCSS('/dashboard')
---

<style set:html={pageCSS}></style>
```

### Island-Specific CSS

```typescript
// src/components/Counter.tsx
import { css } from '../silk.config'

// CSS only loaded when island hydrates
const counterStyle = css({
  display: 'flex',
  gap: 4,
  p: 4
})

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className={counterStyle}>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  )
}
```

## Configuration Options

```typescript
interface SilkAstroConfig {
  // Output CSS file
  outputFile?: string        // default: 'silk.css'

  // Enable critical CSS per-page
  criticalCSS?: boolean      // default: true

  // Production optimizations
  production?: boolean       // default: true in production

  // Brotli pre-compression
  brotli?: boolean           // default: true

  // Enable islands optimizations
  islands?: boolean          // default: true
}
```

## Best Practices

### 1. Use Astro Components for Static Content

```astro
---
// src/components/StaticCard.astro (no CSS overhead!)
---
<div class="card">
  <slot />
</div>

<style>
  .card {
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
```

### 2. Use Silk for Interactive Islands

```typescript
// src/components/InteractiveCard.tsx (CSS extracted!)
import { Box } from '../silk.config'

export default function InteractiveCard({ children }) {
  return (
    <Box p={4} rounded="lg" _hover={{ shadow: 'lg' }}>
      {children}
    </Box>
  )
}
```

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin

## Documentation

Full documentation: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
