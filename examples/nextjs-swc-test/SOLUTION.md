# Next.js 16 CSS Bundling Solution

## Problem Summary

Next.js 16 was not correctly bundling CSS files imported from the `.next/` directory, resulting in 0-byte CSS files in the build output.

### Root Cause Analysis

1. **Next.js Multi-Compilation Architecture**: Next.js 16 uses separate webpack compilations for server and client builds
2. **`.next/` Directory Restrictions**: CSS cannot be directly imported from `.next/` in App Router (treated as build output, not source)
3. **Asset Timing Issues**: Silk's webpack plugin emits CSS during the `emit` hook, but this happens in a different compilation context than where CSS loaders run

### Previous Failed Approaches

1. ❌ Direct import: `import '../.next/silk.css'` → CSS import not allowed from `.next/`
2. ❌ CSS @import: `@import url('../.next/silk.css')` → Same issue
3. ❌ Custom webpack loader → Timing/context issues
4. ❌ webpack plugin injection hooks → CSS not in correct compilation
5. ❌ Reading from filesystem in processAssets → File written too late

## Final Solution

### Key Insight from Vanilla Extract

Vanilla Extract solves this by:
1. Generating CSS in the correct webpack compilation context
2. Emitting CSS directly to the `static/css/` directory
3. Not relying on filesystem imports

### Implementation

**Modified `@sylphx/silk-vite-plugin` webpack hook:**

```typescript
// packages/vite-plugin/src/index.ts
webpack(compiler: any) {
  compiler.hooks.emit.tapPromise('SilkPlugin', async (compilation: any) => {
    if (cssRules.size === 0) return

    let css = Array.from(cssRules.values()).join('\n')

    if (shouldMinify ?? true) {
      css = minifyCSS(css)
    }

    // Emit to both locations for Next.js compatibility
    compilation.assets[outputFile] = {
      source: () => css,
      size: () => css.length,
    }

    // Also emit to static/css directory for production builds
    const staticCssPath = `static/css/${outputFile}`
    compilation.assets[staticCssPath] = {
      source: () => css,
      size: () => css.length,
    }

    console.log(`[Silk] Emitted CSS to ${outputFile} and ${staticCssPath} (${css.length} bytes)`)
  })
}
```

**Manual CSS link in layout:**

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/_next/static/css/silk.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## Verification

### Build Output

```bash
$ bun run build --webpack
[Silk] Emitted CSS to silk.css and static/css/silk.css (944 bytes)
✓ Compiled successfully
```

### File Verification

```bash
$ ls -lh .next/static/css/silk.css
-rw-r--r--  1 kyle  staff   944B  silk.css
```

### Runtime Verification

```bash
$ curl http://localhost:3000/_next/static/css/silk.css
.test_p_8_1gv0{padding:2rem}.test_bg_f0f0f0_1fj5{background-color:#f0f0f0}...
```

## Technical Details

### Why This Works

1. **Webpack Assets API**: Using `compilation.assets` ensures CSS is properly tracked
2. **Correct Path**: Emitting to `static/css/` puts files where Next.js expects them
3. **Dual Emission**: Emitting to both paths ensures compatibility with different build modes
4. **No Filesystem Dependency**: CSS is generated in-memory during compilation

### Comparison with Other Solutions

**Vanilla Extract**:
- Uses virtual CSS files with `.vanilla.css` suffix
- Modifies Next.js CSS loader chain
- More complex but supports dynamic imports

**Panda CSS**:
- Uses PostCSS plugin
- Generates CSS at build time from static analysis
- No runtime CSS generation

**Silk** (our solution):
- Direct webpack asset emission
- Simpler implementation
- Works with Next.js 16's multi-compilation architecture

## Lessons Learned

1. **Next.js Build Architecture**: Understanding webpack compilation contexts is crucial
2. **Asset Timing**: File generation timing matters in multi-stage builds
3. **Static Assets Path**: Next.js expects CSS in `static/css/` directory
4. **Research Similar Libraries**: Studying Vanilla Extract's approach was key to the solution

## Future Improvements

1. Auto-inject `<link>` tag via webpack plugin (avoiding manual addition)
2. Support for CSS modules and code splitting
3. Development mode HMR for CSS updates
4. Better integration with Next.js's CSS optimization pipeline
