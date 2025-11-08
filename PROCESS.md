# Silk CSS Generation Process - Unified Architecture

## Core Principles

### Priority Order

1. **CSS must go through framework build process** (most important)
   - Never bypass framework CSS pipeline
   - Ensure compatibility with PostCSS, optimization, bundling
   - Proper cache busting, CDN integration

2. **Minimal CSS** (secondary, scanning extra files is acceptable)
   - Scanning all src/ may include unused code
   - Acceptable trade-off for simplicity and correctness

3. **No-codegen > Semi-codegen** (but only if #1 is satisfied)
   - Prefer zero-codegen when possible
   - Accept semi-codegen when required for build process integration

### Golden Rule

> Generated CSS MUST flow through the official build process, NOT bypass it.

---

## Unified Architecture

### All Frameworks Follow Same Concept

**User Experience:**
```typescript
// Import generated CSS
import 'silk.css'  // or import './silk.generated.css'

// Framework handles:
// → CSS loading
// → PostCSS transforms
// → Optimization/minification
// → Bundling with hash
// → HTML injection
```

### Implementation Strategy

**Has Hooks (Vite, Rollup, Webpack)** → Virtual Module (no-codegen)
- Plugin creates virtual module via `resolveId` + `load` hooks
- Returns generated CSS content
- CSS flows through framework pipeline

**No Hooks (Next.js, others)** → Physical File (semi-codegen)
- User runs: `silk generate`
- Generates: `src/silk.generated.css`
- User imports as regular CSS file
- CSS flows through framework pipeline

---

## CSS Collection Method

### Unified Scanning Approach (All Frameworks)

```typescript
function scanAndGenerate(srcDir: string): string {
  // 1. Glob all source files
  const files = glob.sync(`${srcDir}/**/*.{ts,tsx,js,jsx}`)

  // 2. Parse each file for css() calls
  const cssRules = []
  for (const file of files) {
    const ast = parse(file)
    const rules = extractCssFromAST(ast)
    cssRules.push(...rules)
  }

  // 3. Generate CSS
  const css = generateCSS(cssRules)

  // 4. Optimize with lightningcss-wasm
  const optimized = await optimizeCSSWithLightning(css, {
    minify: true,
    targets: browserslist
  })

  return optimized.code
}
```

**Characteristics:**
- ✅ Simple and consistent across frameworks
- ✅ No dependency graph analysis needed
- ✅ Works in any environment
- ⚠️ May include unused CSS (acceptable)
- ⚠️ No tree-shaking (CSS size impact minimal)

**Why not use builder's dependency graph?**
- Would require deep integration with each bundler
- SWC plugin can't write files (WASM sandbox)
- Complexity not worth the minimal CSS savings
- Scanning is fast and predictable

---

## Framework-Specific Implementation

### 1. Vite Plugin (No-codegen ✅)

**Implementation:**
```typescript
// packages/vite-plugin/src/index.ts
import { Plugin } from 'vite'

export default function silkPlugin(): Plugin {
  return {
    name: 'vite-plugin-silk',

    resolveId(id) {
      if (id === 'silk.css') {
        return '\0virtual:silk.css'  // Virtual module prefix
      }
    },

    async load(id) {
      if (id === '\0virtual:silk.css') {
        const css = await scanAndGenerate('./src')
        return css
      }
    }
  }
}
```

**User Setup:**
```typescript
// vite.config.ts
import silk from '@sylphx/vite-plugin-silk'

export default {
  plugins: [silk()]
}

// app.tsx
import 'silk.css'  // Virtual module → Vite CSS pipeline
```

**Flow:**
```
import 'silk.css'
  → Vite resolveId hook → '\0virtual:silk.css'
  → Vite load hook → scan src/ → return CSS
  → Vite CSS transform
  → PostCSS
  → Minification
  → Bundle with hash
  → HTML injection
```

### 2. Webpack Plugin (No-codegen ✅ if virtual module works)

**Research Needed:** Webpack virtual module support

**Option A: Virtual Module (preferred)**
```typescript
// packages/webpack-plugin/src/index.ts
import webpack from 'webpack'

class SilkPlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.normalModuleFactory.tap('SilkPlugin', (nmf) => {
      nmf.hooks.beforeResolve.tapAsync('SilkPlugin', (resolveData, callback) => {
        if (resolveData.request === 'silk.css') {
          // Create virtual module
          // Return generated CSS
        }
        callback()
      })
    })
  }
}
```

**Option B: Codegen (fallback)**
```bash
silk generate → src/silk.generated.css
```

### 3. Next.js Plugin

**Depends on Webpack virtual module support**

**If supported:** Same as Webpack Option A
```typescript
// next.config.js
import silk from '@sylphx/silk-nextjs'

export default silk()

// app/layout.tsx
import 'silk.css'
```

**If NOT supported:** Semi-codegen
```bash
# Terminal
silk generate

# Or package.json
{
  "scripts": {
    "predev": "silk generate",
    "prebuild": "silk generate",
    "dev": "next dev",
    "build": "next build"
  }
}
```

```typescript
// app/layout.tsx
import '../src/silk.generated.css'
```

**Flow:**
```
import '../src/silk.generated.css'
  → Next.js CSS loader
  → webpack css-loader
  → PostCSS (next.config.js)
  → Optimization
  → Bundle to .next/static/css/[hash].css
  → HTML injection
```

### 4. Rollup Plugin (No-codegen ✅)

```typescript
// packages/rollup-plugin/src/index.ts
import { Plugin } from 'rollup'

export default function silkPlugin(): Plugin {
  return {
    name: 'rollup-plugin-silk',

    resolveId(id) {
      if (id === 'silk.css') return '\0virtual:silk.css'
    },

    async load(id) {
      if (id === '\0virtual:silk.css') {
        return await scanAndGenerate('./src')
      }
    }
  }
}
```

---

## CLI Tool (Fallback for Semi-codegen)

### Package: `@sylphx/silk-cli`

```bash
# Generate CSS
silk generate

# Watch mode (dev)
silk generate --watch

# Custom output
silk generate --output src/styles/silk.css

# Custom source dir
silk generate --src app
```

### Implementation

```typescript
// packages/cli/src/generate.ts
import { scanAndGenerate } from '@sylphx/silk-core'

export async function generate(options: {
  src?: string
  output?: string
  watch?: boolean
}) {
  const srcDir = options.src || './src'
  const outputFile = options.output || './src/silk.generated.css'

  const css = await scanAndGenerate(srcDir)
  await fs.writeFile(outputFile, css)

  console.log(`✅ Generated ${outputFile}`)

  if (options.watch) {
    watchFiles(srcDir, async () => {
      const css = await scanAndGenerate(srcDir)
      await fs.writeFile(outputFile, css)
      console.log(`♻️  Regenerated ${outputFile}`)
    })
  }
}
```

---

## Directory Structure

```
packages/
├── core/                    # Core CSS generation logic
│   ├── src/
│   │   ├── scan.ts         # Scan src/ for css() calls
│   │   ├── generate.ts     # Generate CSS from calls
│   │   └── optimize.ts     # lightningcss-wasm optimization
│   └── package.json
│
├── vite-plugin/            # Vite plugin (virtual module)
│   ├── src/index.ts
│   └── package.json
│
├── webpack-plugin/         # Webpack plugin (virtual module or codegen)
│   ├── src/index.ts
│   └── package.json
│
├── rollup-plugin/          # Rollup plugin (virtual module)
│   ├── src/index.ts
│   └── package.json
│
├── nextjs-plugin/          # Next.js plugin (wrapper)
│   ├── src/index.ts
│   └── package.json
│
└── cli/                    # CLI tool (fallback)
    ├── src/
    │   ├── index.ts
    │   └── generate.ts
    └── package.json
```

---

## Migration from Current Implementation

### Current State

- ❌ Using webpack unplugin that writes CSS directly
- ❌ Bypasses framework build process
- ❌ SWC plugin for Turbopack (can't write files)
- ✅ lightningcss-wasm working

### Migration Steps

1. **Extract scanning logic to core package**
   - Move CSS collection to `@sylphx/silk-core`
   - Implement `scanAndGenerate(srcDir)`
   - Keep lightningcss-wasm optimization

2. **Implement Vite plugin with virtual module**
   - Create `packages/vite-plugin`
   - Test with Vite project
   - Verify CSS flows through Vite pipeline

3. **Research Webpack virtual module**
   - Test if Webpack supports virtual CSS modules
   - If yes: implement like Vite
   - If no: prepare for semi-codegen approach

4. **Update Next.js plugin**
   - Remove unplugin webpack plugin
   - If Webpack virtual module works: use it
   - If not: document semi-codegen approach
   - Keep SWC plugin for Turbopack dev mode (transform only)

5. **Create CLI tool**
   - Implement `silk generate` command
   - Add watch mode for dev
   - Document usage for semi-codegen frameworks

6. **Update documentation**
   - List no-codegen frameworks
   - List semi-codegen frameworks
   - Provide setup guides for each

---

## Testing Strategy

### Unit Tests
- `scanAndGenerate()` with various src structures
- CSS generation correctness
- lightningcss-wasm optimization

### Integration Tests

**Vite:**
```bash
cd test-integration/vite-app
npm install
npm run build
# Verify: CSS in dist/assets/[hash].css
```

**Webpack:**
```bash
cd test-integration/webpack-app
npm install
npm run build
# Verify: CSS in dist/[hash].css
```

**Next.js:**
```bash
cd test-integration/nextjs-app
npm run build
# Verify: CSS in .next/static/css/[hash].css
```

### Verification Points

- ✅ CSS flows through framework pipeline
- ✅ PostCSS transforms applied
- ✅ Minification working
- ✅ Cache busting (hash in filename)
- ✅ Source maps generated
- ✅ No duplicate CSS
- ✅ Import 'silk.css' works

---

## Documentation Updates

### Framework Support Matrix

| Framework | Method | Setup |
|-----------|--------|-------|
| Vite | ✅ No-codegen | `import 'silk.css'` |
| Rollup | ✅ No-codegen | `import 'silk.css'` |
| Webpack 5 | ✅ No-codegen* | `import 'silk.css'` |
| Next.js | ⚠️ Semi-codegen* | `silk generate` + import |
| Create React App | ⚠️ Semi-codegen | `silk generate` + import |
| Other | ⚠️ Semi-codegen | `silk generate` + import |

*Pending research

### User Guides

**Vite Setup:**
```typescript
// vite.config.ts
import silk from '@sylphx/vite-plugin-silk'

export default {
  plugins: [silk()]
}

// main.tsx
import 'silk.css'
```

**Next.js Setup (if semi-codegen):**
```json
{
  "scripts": {
    "predev": "silk generate",
    "prebuild": "silk generate"
  }
}
```

```typescript
// app/layout.tsx
import '../src/silk.generated.css'
```

---

## Open Questions

1. **Webpack virtual module support?**
   - Does Webpack 5 support virtual CSS modules?
   - Can we use NormalModuleReplacementPlugin?
   - Performance implications?

2. **Git workflow for semi-codegen**
   - Commit `silk.generated.css` or `.gitignore` it?
   - If ignored, CI needs to run `silk generate`
   - If committed, need to remember to regenerate

3. **Cache invalidation**
   - Dev mode: how to invalidate when css() changes?
   - Watch mode performance with large codebases?

4. **SWC plugin role**
   - Keep for Turbopack dev mode transforms?
   - Or remove entirely?

---

## Success Criteria

- ✅ CSS flows through framework build pipeline (all frameworks)
- ✅ No bypass of PostCSS, optimization, bundling
- ✅ Cache busting works automatically
- ✅ Source maps generated
- ✅ lightningcss-wasm optimization maintained (48%+ reduction)
- ✅ Simple user experience: `import 'silk.css'`
- ✅ Clear documentation for each framework
- ✅ Semi-codegen acceptable for frameworks without hooks
