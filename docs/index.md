---
layout: home

hero:
  name: Silk
  text: Zero-runtime CSS-in-TypeScript
  tagline: Type-safe, zero-runtime CSS with build-time extraction. 45-65% smaller CSS in production.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/sylphxltd/silk

features:
  - icon: ⚡
    title: Zero Runtime Overhead
    details: CSS extracted at build time. Zero JavaScript in the browser for styles.

  - icon: 🎯
    title: Type-Safe
    details: Full TypeScript support with autocomplete for CSS properties.

  - icon: 📦
    title: Atomic CSS
    details: Automatic deduplication. 45-65% smaller CSS output compared to traditional CSS-in-JS.

  - icon: 🚀
    title: Framework Agnostic
    details: Works with Next.js, Vite, Nuxt, and more. Webpack and Turbopack support.

  - icon: 🎨
    title: Modern CSS
    details: Native CSS nesting, modern color functions (oklch, lch), container queries.

  - icon: ⚙️
    title: Zero Config
    details: Works out of the box. No configuration needed for most use cases.
---

## Quick Start

::: code-group

```bash [npm]
npm install @sylphx/silk @sylphx/silk-nextjs
```

```bash [bun]
bun add @sylphx/silk @sylphx/silk-nextjs
```

:::

```tsx
import { css } from '@sylphx/silk'

const button = css({
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  padding: '12px 24px',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 600,

  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
  }
})

export function Button() {
  return <button className={button}>Click me</button>
}
```

## Why Silk?

### 🎯 **Zero Runtime**
Unlike traditional CSS-in-JS solutions, Silk extracts all CSS at build time. Your users download **zero JavaScript** for styling.

### 📦 **Smaller Bundles**
Atomic CSS with automatic deduplication means **45-65% smaller** CSS output compared to traditional approaches.

### ⚡ **Better Performance**
No runtime style injection. No CSSOM manipulation. Just static CSS that loads instantly.

### 🔧 **Type-Safe**
Full TypeScript support with IntelliSense for all CSS properties. Catch errors at compile time, not runtime.

## Browser Support

Silk generates modern CSS that works in all evergreen browsers:

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

For older browsers, Silk includes automatic fallbacks and polyfills.
