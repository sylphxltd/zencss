# Troubleshooting

Common issues and solutions for Silk.

## Build Errors

### ❌ "css() should be transformed at build-time"

**Error:**
```
Error: @sylphx/silk: css() should be transformed at build-time by @sylphx/babel-plugin-silk.
Make sure you have the Vite/Webpack plugin configured correctly.
```

**Cause:** The `css()` function wasn't transformed at build time.

**Solutions:**

#### For Next.js:

1. **Check .babelrc exists:**

```json
// .babelrc
{
  "presets": ["next/babel"],
  "plugins": ["@sylphx/babel-plugin-silk"]
}
```

2. **Check package.json scripts:**

```json
{
  "scripts": {
    "dev": "next dev --webpack",  // ✅ Must use --webpack
    "build": "next build"
  }
}
```

::: danger Next.js 16+
Next.js 16 defaults to Turbopack, which doesn't support Babel plugins.

**You must use the `--webpack` flag.**
:::

3. **Verify plugin is installed:**

```bash
bun add @sylphx/babel-plugin-silk
```

#### For Vite:

1. **Check vite.config.ts:**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { silkVitePlugin } from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    silkVitePlugin()  // ✅ Must be included
  ]
})
```

### ❌ Module not found: Can't resolve 'lightningcss'

**Error:**
```
Module not found: Can't resolve '../lightningcss.<dynamic>.node'
```

**Cause:** Using an old version of `@sylphx/silk` that depends on native `lightningcss`.

**Solution:**

Update to latest version (2.1.0+) which uses `lightningcss-wasm`:

```bash
bun add @sylphx/silk@latest @sylphx/silk-nextjs@latest @sylphx/babel-plugin-silk@latest
```

### ❌ No "exports" main defined in package.json

**Error:**
```
Error: No "exports" main defined in /node_modules/@sylphx/babel-plugin-silk/package.json
```

**Cause:** Using old version of babel plugin (2.0.1 or 2.0.2).

**Solution:**

Update to version 2.0.3+:

```bash
bun add @sylphx/babel-plugin-silk@latest
```

### ❌ Next.js 16 Turbopack Warning

**Warning:**
```
⨯ ERROR: This build is using Turbopack, with a `webpack` config and no `turbopack` config.
```

**Cause:** Next.js 16 defaults to Turbopack, but Silk requires Webpack.

**Solution:**

Add `--webpack` flag to your dev script:

```json
{
  "scripts": {
    "dev": "next dev --webpack"
  }
}
```

## Runtime Errors

### ❌ Styles not applying

**Symptoms:**
- Page renders but styles are missing
- Class names appear but no CSS

**Solutions:**

1. **Check CSS is imported (Turbopack/CLI mode):**

```tsx
// app/layout.tsx
import '../silk.generated.css'  // ✅ Must import generated CSS
```

2. **Verify build is running:**

For Turbopack mode, make sure CLI runs before dev:

```json
{
  "scripts": {
    "predev": "silk generate --src ./app",
    "dev": "next dev --turbo"
  }
}
```

3. **Clear build cache:**

```bash
rm -rf .next
bun run dev
```

### ❌ TypeScript errors

**Error:**
```
Property 'paddingg' does not exist on type 'CSSProperties'
```

**This is correct behavior!** Silk provides type-safe CSS.

**Solution:**

Fix the typo:

```tsx
const styles = css({
  padding: '1rem'  // ✅ Correct
  // paddingg: '1rem'  // ❌ Will error
})
```

## Development Issues

### Styles not updating in dev mode

**Symptoms:**
- Change styles but they don't update
- Old styles persist

**Solutions:**

1. **Restart dev server:**

```bash
# Stop server (Ctrl+C)
bun run dev
```

2. **Clear build cache:**

```bash
rm -rf .next
bun run dev
```

3. **Check file watching:**

For Webpack mode, make sure your `srcDir` is correct:

```ts
// next.config.mjs
export default withSilk(nextConfig, {
  srcDir: './app'  // ✅ Must match your actual src location
})
```

### Debug mode not showing logs

**Enable debug logging:**

```ts
// next.config.mjs
export default withSilk(nextConfig, {
  debug: true  // ✅ Enable debug logs
})
```

You should see:

```
[Silk] Webpack mode: Injecting SilkWebpackPlugin
[Silk] isServer: true
[Silk] srcDir: ./app
[Silk] Generating CSS...
```

## Build Issues

### Production build fails

**Error:**
```
Error: Cannot find module '@sylphx/babel-plugin-silk'
```

**Solution:**

Make sure plugin is in `dependencies` (not `devDependencies`):

```json
{
  "dependencies": {
    "@sylphx/babel-plugin-silk": "^2.0.3",
    "@sylphx/silk": "^2.1.0",
    "@sylphx/silk-nextjs": "^3.1.0"
  }
}
```

### Build is slow

**Symptoms:**
- `next build` takes very long
- Webpack compilation is slow

**Solutions:**

1. **Reduce srcDir scope:**

```ts
export default withSilk(nextConfig, {
  srcDir: './app'  // ✅ Only scan app folder
  // srcDir: '.'   // ❌ Scans entire project
})
```

2. **Disable source maps in production:**

```ts
export default withSilk({
  productionBrowserSourceMaps: false
})
```

## Version Compatibility

### Recommended Versions

```json
{
  "dependencies": {
    "@sylphx/silk": "^2.1.0",
    "@sylphx/silk-nextjs": "^3.1.0",
    "@sylphx/babel-plugin-silk": "^2.0.3",
    "next": "^16.0.0",
    "react": "^19.0.0"
  }
}
```

### Update All Packages

```bash
bun add @sylphx/silk@latest @sylphx/silk-nextjs@latest @sylphx/babel-plugin-silk@latest
```

## Getting Help

If you're still stuck:

1. **Check GitHub Issues:** [github.com/SylphxAI/silk/issues](https://github.com/SylphxAI/silk/issues)
2. **File a Bug Report:** Include:
   - Silk version (`package.json`)
   - Next.js version
   - Full error message
   - Minimal reproduction
3. **Join Discord:** [discord.gg/sylphx](https://discord.gg/sylphx) (coming soon)

## Common Mistakes

### ❌ Creating styles in render

```tsx
// ❌ BAD - styles won't be extracted
function Button() {
  const button = css({ color: 'red' })
  return <button className={button} />
}

// ✅ GOOD - extract to const
const button = css({ color: 'red' })
function Button() {
  return <button className={button} />
}
```

### ❌ Using wrong import

```tsx
// ❌ BAD
import css from '@sylphx/silk'

// ✅ GOOD
import { css } from '@sylphx/silk'
```

### ❌ Forgetting Babel config

```json
// ❌ BAD - missing plugin
{
  "presets": ["next/babel"]
}

// ✅ GOOD
{
  "presets": ["next/babel"],
  "plugins": ["@sylphx/babel-plugin-silk"]
}
```

## Performance Tips

1. **Use Server Components** (Next.js App Router)
2. **Extract shared styles** to separate files
3. **Limit srcDir scope** to only necessary folders
4. **Use production builds** for accurate bundle analysis

```bash
next build
next start
```
