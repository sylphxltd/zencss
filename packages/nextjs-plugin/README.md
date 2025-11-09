# @sylphx/silk-nextjs

Next.js integration for Silk - zero-runtime CSS-in-TypeScript with App Router support.

## Installation

```bash
npm install @sylphx/silk @sylphx/silk-nextjs
```

## Quick Start

### 1. Configure Next.js

```javascript
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs';

export default withSilk({
  // Your Next.js config
});
// Auto-detects Turbopack mode (recommended)
```

### 2. Import Silk CSS in your root layout

```typescript
// app/layout.tsx (or src/app/layout.tsx)
import 'silk.css';  // Virtual CSS module

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Use Silk in your components

```typescript
// app/page.tsx
import { css } from '@sylphx/silk';

const styles = {
  container: css({
    display: 'flex',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }),
  title: css({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white'
  })
};

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello Silk!</h1>
    </div>
  );
}
```

## Configuration

### Root-level `app/` Directory

If your project uses a root-level `app/` directory (not `src/app/`), configure `srcDir`:

```javascript
// next.config.mjs
export default withSilk({}, {
  srcDir: './app',  // Scan root-level app/ directory
  debug: true       // Optional: enable debug logging
});
```

### Custom Source Directory

```javascript
export default withSilk({}, {
  srcDir: './src',           // Default: './src'
  virtualModuleId: 'silk.css', // Default: 'silk.css'
  minify: true,               // Minify CSS (default: production only)
  debug: false                // Debug logging
});
```

## Supported Directory Structures

✅ **Root-level `app/` directory:**
```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
└── next.config.mjs  ← srcDir: './app'
```

✅ **`src/app/` directory (default):**
```
my-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
└── next.config.mjs  ← srcDir: './src' (or omit)
```

## Build Modes

Silk supports both Webpack and Turbopack with different approaches:

### Webpack Mode (Recommended for Dev)

**Zero-codegen** approach with virtual CSS modules:

```javascript
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs';

export default withSilk({
  // Your Next.js config
});
```

```typescript
// app/layout.tsx
import 'silk.css';  // ✅ Virtual CSS module (auto-generated)
```

```bash
next dev          # Webpack mode
next build        # Production build
```

**Pros:**
- ✅ Zero-codegen (no CLI needed)
- ✅ Automatic CSS regeneration on file changes
- ✅ Zero setup

### Turbopack Mode (Faster Builds)

**CLI-based** approach with generated CSS file:

```bash
bun add -D @sylphx/silk-cli
```

```json
// package.json
{
  "scripts": {
    "predev": "silk generate --src ./app",
    "prebuild": "silk generate --src ./app",
    "dev": "next dev --turbo",
    "build": "next build --turbo"
  }
}
```

```javascript
// next.config.mjs
import { withSilk } from '@sylphx/silk-nextjs';

export default withSilk({}, {
  turbopack: true  // Enable Turbopack mode
});
```

```typescript
// app/layout.tsx
import './silk.generated.css';  // ✅ CLI-generated file
```

**Pros:**
- ✅ **10x faster builds** (Turbopack vs Webpack)
- ✅ Future of Next.js (Vercel's focus)
- ✅ Works with Next.js 15+

**Note:** Requires `@sylphx/silk-cli` and package.json scripts for CSS generation

## Compatibility

- **Next.js:** 13.x, 14.x, 15.x, 16.x
- **React:** 18.x, 19.x
- **Build Tools:**
  - Turbopack: ✅ **Recommended** (10x faster)
  - Webpack: ✅ Supported (zero-codegen)
