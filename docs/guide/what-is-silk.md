# What is Silk?

Silk is a **zero-runtime CSS-in-TypeScript** solution that extracts all styles at build time, resulting in optimal performance and bundle sizes.

## The Problem

Traditional CSS-in-JS libraries have significant runtime overhead:

- **Runtime style injection** - JavaScript parses and injects CSS at runtime
- **Larger bundles** - All styling logic ships to the browser
- **Performance cost** - CSSOM manipulation is expensive
- **Hydration issues** - SSR/SSG apps need to re-inject styles client-side

## The Silk Solution

Silk takes a radically different approach:

### ✅ Build-Time Extraction

All `css()` calls are transformed at **build time** into static class names:

```tsx
// Input (your code)
const button = css({ color: 'red', padding: '1rem' })

// Output (what ships to browser)
const button = 'silk-a7f3 silk-b2e1'

// Generated CSS (extracted to .css file)
.silk-a7f3 { color: red; }
.silk-b2e1 { padding: 1rem; }
```

### ✅ Zero Runtime JavaScript

**Zero bytes** of JavaScript for styling logic. Just static CSS + class names.

### ✅ Atomic CSS

Every unique style becomes a reusable atomic class:

```tsx
// Both buttons share the same 'color: red' class
const button1 = css({ color: 'red', padding: '1rem' })
const button2 = css({ color: 'red', margin: '2rem' })

// Only generates THREE classes:
// .silk-a7f3 { color: red; }
// .silk-b2e1 { padding: 1rem; }
// .silk-c3d4 { margin: 2rem; }
```

Result: **45-65% smaller CSS** compared to traditional CSS-in-JS.

### ✅ Type-Safe

Full TypeScript support with IntelliSense:

```tsx
const styles = css({
  display: 'flex',           // ✅ Valid
  backgroundColor: '#000',    // ✅ Valid
  paddingg: '1rem',          // ❌ TypeScript error
  color: 123,                 // ❌ TypeScript error
})
```

## How It Works

Silk uses **Babel transformation** at build time to extract CSS and generate atomic class names.

### Next.js Integration

For Next.js, Silk provides seamless integration with both Webpack and Turbopack:

**Webpack mode** (Next.js < 15 or custom webpack config):
- Virtual CSS module injection
- Zero-codegen approach
- Automatic regeneration on file changes

**Turbopack mode** (Next.js 15+ with Turbopack):
- Uses `turbopack.rules` + `babel-loader`
- Same zero-runtime benefits
- Faster builds than webpack

Both modes use the Babel plugin for transformation, just different bundler integration strategies.

### Vite Integration

For Vite projects:

1. Vite plugin scans source files for `css()` calls
2. Extracts styles and generates atomic CSS
3. Babel plugin transforms `css()` to class names
4. Generated CSS is imported into your app

### CLI Integration

For other build tools or standalone usage:

```bash
silk generate --src ./src --output ./dist/silk.css
```

The CLI:
1. Scans source files for `css()` calls
2. Generates atomic CSS file
3. You manually import the generated CSS

## Performance Benefits

| Metric | Traditional CSS-in-JS | Silk |
|--------|----------------------|------|
| Runtime JS | ~15-30KB | **0KB** ✅ |
| Style injection | Runtime (slow) | **None** ✅ |
| CSS size | 100% | **45-65%** ✅ |
| FCP impact | +50-100ms | **0ms** ✅ |
| Hydration | Required | **Not needed** ✅ |

## Comparison

### vs Styled Components / Emotion

```tsx
// ❌ Styled Components - 15KB+ runtime
import styled from 'styled-components'
const Button = styled.button`
  color: red;
  padding: 1rem;
`

// ✅ Silk - 0KB runtime
import { css } from '@sylphx/silk'
const button = css({ color: 'red', padding: '1rem' })
<button className={button} />
```

### vs Tailwind CSS

```tsx
// ⚠️ Tailwind - Limited by predefined utilities
<button className="text-red-500 px-4 py-2">
  {/* Can't use custom values easily */}
</button>

// ✅ Silk - Any value, type-safe
const button = css({
  color: 'oklch(0.7 0.2 350)',  // Modern colors
  padding: '1.2rem 2.4rem',      // Any value
  background: 'linear-gradient(135deg, #667eea, #764ba2)'
})
```

### vs Panda CSS

Similar approach to Silk, but Silk is:
- **Simpler** - No config file needed
- **Faster** - Babel plugin is optimized
- **Smaller** - Better atomic deduplication
- **Framework agnostic** - Works with any framework

### vs Vanilla Extract

```tsx
// ⚠️ Vanilla Extract - Separate .css.ts files required
// button.css.ts
import { style } from '@vanilla-extract/css'
export const button = style({ color: 'red' })

// ✅ Silk - Inline with components
import { css } from '@sylphx/silk'
const button = css({ color: 'red' })
```

## Features

### Modern CSS Support

Silk supports all modern CSS features:

```tsx
const styles = css({
  // CSS Nesting
  '& .child': {
    color: 'blue'
  },

  // Modern color functions
  color: 'oklch(0.7 0.2 350)',

  // Container queries
  '@container (min-width: 400px)': {
    fontSize: '2rem'
  },

  // Cascade layers
  '@layer utilities': {
    padding: '1rem'
  }
})
```

### Responsive Design

```tsx
const responsive = css({
  padding: {
    base: '1rem',    // Mobile
    md: '2rem',      // Tablet
    lg: '4rem'       // Desktop
  }
})
```

### Pseudo-classes

```tsx
const interactive = css({
  color: 'blue',

  _hover: {
    color: 'darkblue'
  },

  _focus: {
    outline: '2px solid blue'
  },

  _active: {
    transform: 'scale(0.98)'
  }
})
```

### Dark Mode

```tsx
const themed = css({
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',

  // Automatic dark mode via CSS variables
  '@media (prefers-color-scheme: dark)': {
    '--bg-primary': '#1a202c',
    '--text-primary': '#f7fafc'
  }
})
```

## When to Use Silk

### ✅ Perfect for:

- **Production apps** - Where performance matters
- **Component libraries** - Zero runtime overhead
- **SSR/SSG apps** - No hydration issues
- **Type-safe projects** - Full TypeScript support
- **Modern frameworks** - Next.js, Vite, Nuxt, etc.

### ⚠️ Consider alternatives if:

- **Legacy browsers** - Need IE11? Use traditional CSS
- **Rapid prototyping** - Tailwind might be faster initially
- **Learning CSS** - Plain CSS might be more educational

## Architecture

Silk's architecture is simple:

```
Source Code (TypeScript/JSX)
           ↓
    Babel Plugin
           ↓
    CSS Extraction
           ↓
   Atomic CSS Generation
           ↓
  Class Name Replacement
           ↓
   Optimized Output
```

**Build time:**
- Source files are parsed by Babel
- `css()` calls are extracted
- Atomic CSS is generated
- Function calls are replaced with class names

**Runtime:**
- Zero JavaScript execution
- Static CSS loaded by browser
- Class names already in HTML

## Browser Support

Silk generates modern CSS that works in all evergreen browsers:

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

For older browsers, configure LightningCSS autoprefixer:

```ts
// silk.config.ts
export default defineConfig({
  optimize: {
    browserslist: ['> 0.5%', 'last 2 versions', 'not dead']
  }
})
```

## Framework Support

Silk works with all major frameworks:

- ✅ Next.js (App Router + Pages Router)
- ✅ Vite (React, Vue, Svelte, Preact)
- ✅ Nuxt 3
- ✅ SvelteKit
- ✅ Remix
- ✅ Astro
- ✅ Qwik

## Getting Started

Ready to try Silk?

```bash
bun add @sylphx/silk @sylphx/silk-nextjs
```

```tsx
import { css } from '@sylphx/silk'

const button = css({
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',

  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  }
})

<button className={button}>Get Started</button>
```

## Next Steps

- [Getting Started](/guide/getting-started) - Installation and setup
- [Next.js Integration](/guide/nextjs) - Framework-specific guide
- [Responsive Design](/guide/responsive) - Build responsive layouts
- [Configuration](/api/configuration) - Advanced configuration options
