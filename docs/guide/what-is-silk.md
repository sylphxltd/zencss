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
const button = 'silk_color_red_a7f3 silk_padding_1rem_b2e1'

// Generated CSS (extracted to .css file)
.silk_color_red_a7f3 { color: red; }
.silk_padding_1rem_b2e1 { padding: 1rem; }
```

### ✅ Zero Runtime JavaScript

**Zero bytes** of JavaScript for styling logic. Just static CSS + class names.

### ✅ Atomic CSS

Every unique style becomes a reusable atomic class:

```tsx
// Both buttons share the same 'color: red' class
const button1 = css({ color: 'red', padding: '1rem' })
const button2 = css({ color: 'red', margin: '2rem' })

// Only generates TWO classes:
// .silk_color_red_a7f3 { color: red; }
// .silk_padding_1rem_b2e1 { padding: 1rem; }
// .silk_margin_2rem_c3d4 { margin: 2rem; }
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

Silk uses **two complementary approaches**:

### 1. Babel Plugin (Webpack)

For Webpack-based builds (Next.js with `--webpack` flag):

```tsx
// Before compilation
const button = css({ color: 'red' })

// After Babel transformation
const button = 'silk_color_red_a7f3'
```

The Babel plugin:
1. Finds all `css()` calls
2. Extracts styles to CSS file
3. Replaces `css()` with class name string

### 2. CLI + Virtual Module (Turbopack/Vite)

For bundlers that don't support Babel (Turbopack, Vite with SWC):

```bash
# Pre-build step
silk generate --src ./src --output ./src/silk.css
```

Then import the generated CSS:

```tsx
import './silk.css'  // All extracted styles
```

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
- **Faster** - Babel plugin is faster than Panda's AST parsing
- **Smaller** - Better atomic deduplication
- **Framework agnostic** - Works with any framework

## When to Use Silk

### ✅ Perfect for:

- **Production apps** - Where performance matters
- **Component libraries** - Zero runtime overhead
- **SSR/SSG apps** - No hydration issues
- **Type-safe projects** - Full TypeScript support

### ⚠️ Consider alternatives if:

- **Rapid prototyping** - Inline styles might be faster
- **Legacy browser support** - Need IE11? Use traditional CSS
- **Learning CSS** - Tailwind might be more approachable

## Next Steps

- [Get started](/guide/getting-started) with Silk
- [Next.js integration](/guide/nextjs) guide
- [API reference](/api/configuration)
