# @sylphx/silk-remix

Remix integration for Silk - zero-runtime CSS-in-TypeScript with **streaming SSR** and **critical CSS** support.

## Installation

```bash
npm install @sylphx/silk-remix
# or
bun add @sylphx/silk-remix
```

## Quick Start

### 1. Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { vitePlugin as remix } from '@remix-run/dev'
import { silkPlugin } from '@sylphx/silk-remix/vite'

export default defineConfig({
  plugins: [
    silkPlugin({
      outputFile: 'public/silk.css',
      babelOptions: {
        production: true,
      }
    }), // Add BEFORE Remix plugin
    remix(),
  ],
})
```

### 2. Add CSS Link to Root

```typescript
// app/root.tsx
import type { LinksFunction } from '@remix-run/node'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: '/silk.css' },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

### 3. Use in Routes

```typescript
// app/routes/index.tsx
import { css } from '@sylphx/silk'

const container = css({ px: 4, py: 6 })

export default function Index() {
  return (
    <div className={container}>
      <h1>Welcome to Silk + Remix!</h1>
    </div>
  )
}
```

## Features

### ✅ Zero-Runtime Compilation
- CSS extracted at build time via Babel plugin
- No runtime CSS-in-JS overhead
- Static atomic class names

### ✅ Remix v2+ (Vite-based)
- Full Vite integration
- Fast HMR with state preservation
- Streaming SSR compatible

### ✅ Performance
- **-6.5KB JS bundle** (runtime code eliminated)
- **Brotli compression** (389B for 1KB CSS, -61%)
- **Atomic CSS** (one class per property)
- **Fast builds** (Babel transformation)

### ✅ Developer Experience
- Full TypeScript support
- Zero configuration needed
- Hot module replacement (HMR)

## Advanced Usage

### Route-Specific CSS

```typescript
// app/routes/dashboard.tsx
import { extractCriticalCSS } from '@sylphx/silk-remix'
import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  // Extract CSS for this route only
  const { css } = extractCriticalCSS()

  return json({
    css,
    // ... other data
  })
}
```

### Streaming CSS

```typescript
import { getSilkConfig } from '@sylphx/silk-remix'

const config = getSilkConfig({
  streaming: true
})

// Stream CSS chunks for progressive rendering
for await (const chunk of config.remix.streamCSS()) {
  // Send chunk to client
}
```

## Configuration Options

```typescript
interface SilkRemixConfig {
  // Enable critical CSS extraction
  criticalCSS?: boolean      // default: true

  // Enable streaming SSR optimizations
  streaming?: boolean        // default: true

  // Output CSS file
  outputFile?: string        // default: 'silk.css'

  // Production optimizations
  production?: boolean       // default: true in production

  // Brotli pre-compression
  brotli?: boolean           // default: true
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
