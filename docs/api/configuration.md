# Configuration

Complete API reference for configuring Silk across different frameworks and build tools.

## Next.js Configuration

### `withSilk(nextConfig, silkConfig)`

Wrap your Next.js configuration with Silk.

```ts
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Your Next.js config
  reactStrictMode: true,
}, {
  // Silk configuration
  srcDir: './app',
  debug: false
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDir` | `string` | `'./src'` | Source directory to scan for `css()` calls |
| `debug` | `boolean` | `false` | Enable debug logging during build |
| `virtualModuleId` | `string` | `'silk.css'` | Virtual module ID for Webpack mode |

### Examples

**App Router with debug mode:**

```ts
export default withSilk({
  reactStrictMode: true,
}, {
  srcDir: './app',
  debug: true  // See transformation logs
})
```

**Pages Router:**

```ts
export default withSilk({
  reactStrictMode: true,
}, {
  srcDir: './pages'
})
```

**Custom src directory:**

```ts
export default withSilk({
  reactStrictMode: true,
}, {
  srcDir: './src/components'
})
```

## Vite Configuration

### `silkVitePlugin(options)`

Vite plugin for Silk integration.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { silkVitePlugin } from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    silkVitePlugin({
      srcDir: './src',
      debug: false
    })
  ]
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDir` | `string` | `'./src'` | Source directory to scan for `css()` calls |
| `debug` | `boolean` | `false` | Enable debug logging |
| `outputPath` | `string` | `'./src/silk.generated.css'` | Output path for generated CSS |

### Examples

**With custom output path:**

```ts
silkVitePlugin({
  srcDir: './src',
  outputPath: './public/styles/silk.css'
})
```

**Multiple source directories:**

```ts
silkVitePlugin({
  srcDir: './src',
  includePaths: ['./components', './features']
})
```

## Nuxt Configuration

### Nuxt Module

Add Silk to your Nuxt modules:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sylphx/silk-nuxt'],

  silk: {
    // Silk configuration
    srcDir: './components',
    debug: false
  }
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDir` | `string` | `'./components'` | Source directory to scan |
| `debug` | `boolean` | `false` | Enable debug logging |
| `autoImport` | `boolean` | `true` | Auto-import generated CSS |

## Webpack Configuration

### `SilkWebpackPlugin(options)`

Webpack plugin for custom setups.

```js
// webpack.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin')

module.exports = {
  plugins: [
    new SilkWebpackPlugin({
      srcDir: './src',
      virtualModuleId: 'silk.css',
      debug: false
    })
  ]
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `srcDir` | `string` | `'./src'` | Source directory to scan |
| `virtualModuleId` | `string` | `'silk.css'` | Virtual module ID |
| `debug` | `boolean` | `false` | Enable debug logging |

## CLI Configuration

### `silk generate`

Generate CSS from `css()` calls in your source code.

```bash
silk generate [options]
```

### Options

| Flag | Alias | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--src` | `-s` | `string` | `'./src'` | Source directory |
| `--output` | `-o` | `string` | `'./src/silk.generated.css'` | Output file path |
| `--watch` | `-w` | `boolean` | `false` | Watch mode |
| `--minify` | `-m` | `boolean` | `false` | Minify output CSS |

### Examples

**Basic generation:**

```bash
silk generate --src ./src --output ./public/silk.css
```

**Watch mode:**

```bash
silk generate --src ./src --watch
```

**Minified production build:**

```bash
silk generate --src ./src --minify
```

**Custom config file:**

```bash
silk generate --config ./silk.config.js
```

## Configuration Files

### `silk.config.js`

Create a `silk.config.js` file in your project root:

```js
// silk.config.js
module.exports = {
  srcDir: './src',
  outputPath: './dist/silk.css',
  debug: process.env.NODE_ENV === 'development',

  // Custom breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // CSS optimization
  optimize: {
    minify: process.env.NODE_ENV === 'production',
    autoprefixer: true,
    browserslist: ['> 0.5%', 'last 2 versions']
  }
}
```

### `silk.config.ts` (TypeScript)

```ts
// silk.config.ts
import { defineConfig } from '@sylphx/silk'

export default defineConfig({
  srcDir: './src',
  outputPath: './dist/silk.css',
  debug: process.env.NODE_ENV === 'development',

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },

  optimize: {
    minify: true,
    autoprefixer: true
  }
})
```

## Environment Variables

Control Silk behavior via environment variables:

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SILK_DEBUG` | `boolean` | `false` | Enable debug mode |
| `SILK_SRC_DIR` | `string` | `'./src'` | Source directory |
| `SILK_OUTPUT` | `string` | Auto | Output file path |

### Usage

```bash
SILK_DEBUG=true npm run dev
```

```bash
SILK_SRC_DIR=./app npm run build
```

## Advanced Configuration

### Custom CSS Processing

```ts
// silk.config.ts
export default defineConfig({
  srcDir: './src',

  // Custom CSS transformations
  transform: {
    // Add custom CSS prefixes
    prefix: 'my-app',

    // Custom class name generation
    generateClassName: (hash) => `silk-${hash}`,

    // PostCSS plugins
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')
      ]
    }
  }
})
```

### Conditional Configuration

```ts
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs'

const isDev = process.env.NODE_ENV === 'development'

export default withSilk({
  reactStrictMode: true,
}, {
  srcDir: './app',
  debug: isDev,

  // Development-only options
  ...(isDev && {
    sourceMaps: true,
    hot: true
  }),

  // Production-only options
  ...(!isDev && {
    minify: true,
    optimize: true
  })
})
```

### Framework-Specific Presets

```ts
// vite.config.ts
import { silkVitePlugin, presets } from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    silkVitePlugin({
      ...presets.react,  // React preset
      srcDir: './src'
    })
  ]
})
```

## TypeScript Configuration

### Type Definitions

Silk provides full TypeScript support. Add types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@sylphx/silk"]
  }
}
```

### Custom Type Extensions

```ts
// silk.d.ts
import '@sylphx/silk'

declare module '@sylphx/silk' {
  interface CustomProperties {
    // Add custom CSS properties
    customShadow?: string
    customGradient?: string
  }
}
```

## Troubleshooting

### Debug Mode

Enable debug logging to troubleshoot issues:

```ts
export default withSilk(nextConfig, {
  debug: true
})
```

Debug output shows:
- CSS extraction process
- Generated class names
- File transformation logs
- Performance metrics

### Common Issues

**Issue: Styles not generating**
```bash
# Check if source directory is correct
SILK_DEBUG=true npm run build
```

**Issue: Import errors**
```ts
// Make sure you're importing from the correct package
import { css } from '@sylphx/silk'  // ✅
import { css } from 'silk'          // ❌
```

**Issue: TypeScript errors**
```bash
# Reinstall types
bun add -D @sylphx/silk @types/node
```

## Performance Tuning

### Build Performance

```ts
// silk.config.ts
export default defineConfig({
  // Limit file scanning
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['node_modules', 'dist'],

  // Parallel processing
  parallel: true,

  // Cache compilation
  cache: {
    enabled: true,
    directory: './.silk-cache'
  }
})
```

### Runtime Performance

Silk has **zero runtime overhead** - all CSS is extracted at build time. No configuration needed for runtime performance.

## Migration Guides

### From styled-components

```ts
// Before (styled-components)
const Button = styled.button`
  color: red;
  padding: 1rem;
`

// After (Silk)
const button = css({
  color: 'red',
  padding: '1rem'
})

<button className={button}>Click me</button>
```

### From Tailwind

```tsx
// Before (Tailwind)
<div className="flex flex-col items-center p-4 bg-gray-100">

// After (Silk)
const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#f3f4f6'
})

<div className={container}>
```

## Next Steps

- [Getting Started](/guide/getting-started) - Installation guide
- [Next.js Integration](/guide/nextjs) - Next.js specific setup
- [Troubleshooting](/guide/troubleshooting) - Common issues and solutions
