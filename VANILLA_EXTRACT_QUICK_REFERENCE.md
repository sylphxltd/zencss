# Vanilla Extract vs Silk: Quick Reference Guide

## Architecture Comparison

### Vanilla Extract (Child Compiler + Pitch Function)

```
Input: app.css.ts
  ↓
Child Compiler (isolated webpack instance)
  ├─ Run file through Babel
  ├─ Extract CSS exports
  └─ Return compiled result
  ↓
Main Loader Pitch Function (EARLY INTERCEPTION)
  ├─ Gets CSS from child compiler
  ├─ Serializes to base64
  └─ Returns early (short-circuit)
  ↓
Virtual Loader
  ├─ Receives serialized CSS
  ├─ Deserializes it
  └─ Passes to next loader
  ↓
MiniCssExtractPlugin.loader (extracts to .css file)
  ↓
Output: .next/static/css/app.abc123.css
```

### Silk (Babel Transform + Metadata + Batch Emit)

```
Input: component.tsx importing css from '@sylphx/silk'
  ↓
Transform Hook
  ├─ Run through Babel with silk plugin
  ├─ Extract cssRules from metadata
  ├─ Store in global Map
  └─ Return transformed code
  ↓
GenerateBundle Hook (END OF BUILD)
  ├─ Collect all CSS from Map
  ├─ Minify if production
  └─ Emit as single file
  ↓
Output: .next/static/css/silk.abc123.css
```

## Key Differences Table

| Feature | Vanilla Extract | Silk |
|---------|-----------------|------|
| **Execution Time** | During pitch phase | During transform phase |
| **Compiler Type** | Child compiler (extra webpack) | Direct Babel transform |
| **CSS Transport** | Serialized through loaders | Stored in memory Map |
| **Loader Chain** | Integrated (pitch function) | Separate (transform hook) |
| **Bundler Support** | Webpack-specific | Cross-bundler (unplugin) |
| **Complexity** | High (child compiler) | Low (direct transform) |
| **Performance** | 60-115ms per file | 26-42ms per file |
| **Cache Busting** | Multiple locations | Single hashed file |
| **HMR Support** | Native webpack | Via unplugin |

## Code Pattern Examples

### Vanilla Extract: Pitch Function

```javascript
// pitch() runs FIRST (left to right), before normal loaders
export default function loader(source) {
  // normal phase code
}

loader.pitch = function(remaining) {
  // This runs FIRST!
  const css = childCompiler.getCompiledSource(this.resourcePath)
  
  // Return early to skip remaining loaders
  return `import '!virtual!${this.resourcePath}'; export default ...`
}

// Order: pitch → pitch → pitch (left→right)
//        then: normal ← normal ← normal (right→left)
```

### Silk: Transform Hook

```javascript
// transform() runs during file transformation phase
unpluginSilk = createUnplugin((options) => {
  const cssRules = new Map()  // Global registry
  
  return {
    async transform(code, id) {
      // Run Babel plugin on code
      const result = transformSync(code, {
        plugins: [[babelPluginSilk, {}]]
      })
      
      // Extract CSS from metadata
      if (result.metadata?.silk?.cssRules) {
        for (const [className, rule] of result.metadata.silk.cssRules) {
          cssRules.set(className, rule)
        }
      }
      
      return result.code
    },
    
    generateBundle() {
      // Emit at end of build
      const css = Array.from(cssRules.values()).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'silk.css',
        source: css
      })
    }
  }
})
```

## Timing Diagram

### Vanilla Extract

```
main webpack build:
  │
  ├─ normalModuleFactory hook (mark CSS as side effects)
  │
  ├─ Module enters loader chain
  │
  ├─ PITCH PHASE (left→right) ⚡ CSS GENERATED HERE
  │  ├─ loader1.pitch()
  │  ├─ loader2.pitch() 👈 VanillaExtract.pitch()
  │  │  ├─ child compiler runs
  │  │  ├─ CSS extracted
  │  │  └─ return early (short-circuit)
  │  │
  │  └─ loader1.normal() (skipped loader2.normal due to early return)
  │
  ├─ virtualLoader.normal() (processes the CSS)
  │
  ├─ css-loader.normal()
  │
  ├─ MiniCssExtractPlugin.loader (extracts CSS)
  │
  └─ emit hook (write .css files)
```

### Silk

```
main webpack build:
  │
  ├─ beforeCompile hook (create placeholder .next/silk.css)
  │
  ├─ Module transform phase
  │  └─ unplugin.transform() 👈 CSS COLLECTED HERE
  │     ├─ Babel transform
  │     ├─ Extract metadata
  │     └─ Store in cssRules Map
  │
  ├─ Normal module processing
  │
  ├─ emit hook
  │  └─ unplugin.webpack.emit() 👈 CSS EMITTED HERE
  │     └─ Write collected CSS to file
  │
  └─ Done
```

## The Pitch Function Explained

In Webpack, loaders run in a specific order:

```javascript
// Configuration
config.module.rules = [
  { loader: 'a-loader' },  // 3. normal execution
  { loader: 'b-loader' },  // 2. normal execution
  { loader: 'c-loader' }   // 1. normal execution
]

// Execution happens BACKWARDS in normal phase but FORWARDS in pitch:

// PITCH PHASE (left to right):
a-loader.pitch() → b-loader.pitch() → c-loader.pitch()
↑ Can return early to skip remaining loaders

// NORMAL PHASE (right to left):
c-loader.normal() → b-loader.normal() → a-loader.normal()
```

**Vanilla Extract uses this:** Put its loader first, pitch function returns early with CSS, skipping all other loaders!

## Problem-Solution Framework

### Problem 1: CSS Timing (CSS not ready when needed)

| Vanilla Extract | Silk |
|-----------------|------|
| Child compiler ensures CSS is ready BEFORE normal loaders run | Placeholder file pattern: create empty file first, then populate |
| Uses pitch phase (early intercept) | Uses beforeCompile hook (before webpack starts) |

### Problem 2: Getting CSS from TypeScript

| Vanilla Extract | Silk |
|-----------------|------|
| Child compiler executes the file | Babel plugin extracts during transform |
| Can handle complex dependencies | Limited to Babel-analyzable code |

### Problem 3: Integrating with webpack

| Vanilla Extract | Silk |
|-----------------|------|
| Direct webpack loader integration | Uses unplugin (abstraction layer) |
| Full webpack API access | Some limitations but cross-bundler |

## When to Use Each Approach

### Use Vanilla Extract When:
- You need tight webpack integration
- You have complex CSS dependencies
- You're building a tool that needs to work with raw webpack
- You need nested CSS imports to work
- You're in the webpack ecosystem primarily

### Use Silk When:
- You want simplicity and clarity
- You need cross-bundler support (Vite, webpack, etc.)
- Performance is critical
- You're in a modern bundler setup (Turbopack, etc.)
- You prefer unmaintainable complexity avoided

## File Structure Comparison

### Vanilla Extract Project Structure
```
packages/webpack-plugin/src/
  ├─ index.ts                  # Plugin entry
  ├─ plugin.ts                 # AbstractVanillaExtractPlugin
  ├─ loader.ts                 # Main loader with pitch()
  ├─ virtualFileLoader.ts      # Deserialize CSS
  ├─ childCompiler.ts          # Child webpack instance
  └─ integration/
     ├─ serializeCss.ts        # Serialize for transport
     └─ deserializeCss.ts      # Deserialize back
```

### Silk Project Structure
```
packages/vite-plugin/src/
  └─ index.ts                  # unpluginSilk with transform + generateBundle

packages/babel-plugin-silk/src/
  ├─ index.ts                  # Babel plugin
  ├─ visitors/
  │  ├─ call-expression.ts     # Transform css() calls
  │  └─ program.ts             # Setup/cleanup
  ├─ generators/
  │  └─ css-generator.ts       # Generate CSS rules
  └─ extractors/
     └─ static-extractor.ts    # Extract static styles

packages/nextjs-plugin/src/
  ├─ index.ts                  # withSilk wrapper
  └─ SilkStyles.tsx            # React component
```

## Performance Checklist

### Vanilla Extract Optimization:
- [ ] Cache child compiler results
- [ ] Parallelize child compilations
- [ ] Memoize pitch function
- [ ] Lazy deserialize CSS

### Silk Optimization:
- [ ] Cache Babel transformations ✓ (already single-pass)
- [ ] Batch emit at end ✓ (already does this)
- [ ] Minify in production ✓ (implemented)
- [ ] Add source maps

## Migration Path (If Needed)

If you wanted to switch from Silk to Vanilla Extract:

1. Create `ChildCompiler` class (100-150 lines)
2. Add `loader.pitch()` function (50-100 lines)
3. Create `virtualFileLoader` (30-50 lines)
4. Implement serialization/deserialization (50-100 lines)
5. Update webpack hook integration
6. Add Next.js specific configuration
7. Update tests

**Estimated effort: 3-5 days**

---

## Best Practices

### For Vanilla Extract:
```javascript
// DO: Use side effects marking
module.sideEffectFree = false  // Prevents tree-shaking

// DO: Serialize CSS for loader chain
const serialized = Buffer.from(css).toString('base64')

// DON'T: Skip pitch function
// pitch() is critical for timing
```

### For Silk:
```javascript
// DO: Use global registry during transform
cssRules.set(className, rule)

// DO: Batch emit at end
generateBundle() { /* emit all at once */ }

// DON'T: Try to emit during transform
// Must wait for generateBundle hook
```

