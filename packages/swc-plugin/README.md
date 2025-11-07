# @sylphx/swc-plugin-silk

SWC plugin for Silk - zero-runtime CSS-in-TypeScript compilation.

## Why SWC Plugin?

- ✅ **Native Turbopack support** - Works with Next.js 16+ out of the box
- ✅ **20-70x faster** than Babel plugin
- ✅ **Perfect Next.js integration** - No webpack mode needed
- ✅ **Future-proof** - SWC is the future of JS/TS compilation

## Architecture: Rust + AssemblyScript Hybrid

This plugin uses a hybrid approach for the best of both worlds:

```
┌─────────────────────────────────┐
│   SWC Plugin (Rust)             │
│   - AST traversal               │
│   - css() call detection        │
│   - Node replacement            │
└───────────┬─────────────────────┘
            │ calls
            ▼
┌─────────────────────────────────┐
│   Transform Logic (WASM)        │
│   - Written in AssemblyScript   │
│   - Class name generation       │
│   - CSS rule generation         │
│   - Hash calculation            │
└─────────────────────────────────┘
```

**Benefits:**
- 🦀 Minimal Rust code (easier to maintain)
- 📝 Core logic in TypeScript-like syntax (AssemblyScript)
- 🚀 WASM performance
- 🔧 Easy to port existing Babel plugin logic

## Installation

```bash
npm install -D @sylphx/swc-plugin-silk
```

## Usage

### Next.js 13+

```javascript
// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      ['@sylphx/swc-plugin-silk', {
        production: true,
        classPrefix: 'silk',
      }]
    ]
  }
}
```

### Standalone SWC

```json
// .swcrc
{
  "jsc": {
    "experimental": {
      "plugins": [
        ["@sylphx/swc-plugin-silk", {
          "production": true
        }]
      ]
    }
  }
}
```

## Options

- `production` (boolean): Enable production mode optimizations
- `classPrefix` (string): Prefix for generated class names
- `tokens` (object): Design tokens for value resolution

## How It Works

This plugin transforms Silk's `css()` calls at compile-time:

```typescript
// Input
const button = css({ bg: 'red', p: 4 })

// Output
const button = 'silk_bg_red_a7f3 silk_p_4_b2e1'

// Generated CSS
.silk_bg_red_a7f3 { background-color: red; }
.silk_p_4_b2e1 { padding: 1rem; }
```

## Current Status

✅ **Phase 1 Complete: AST Transformation**

The SWC plugin successfully transforms `css()` calls to class name strings:

```typescript
// Input
const button = css({ bg: 'red', p: 4 })

// Output (after SWC transformation)
const button = 'silk_bg_red_a7f3 silk_p_4_b2e1'
```

🚧 **Phase 2 In Progress: CSS Collection**

CSS rule extraction is currently handled by `@sylphx/unplugin-silk`. For full functionality, use both plugins together:

```javascript
// next.config.js
const { silk } = require('@sylphx/nextjs-plugin')

module.exports = silk({
  experimental: {
    swcPlugins: [
      ['@sylphx/swc-plugin-silk', { production: true }]
    ]
  }
})
```

This hybrid approach ensures:
- ✅ Fast transformation via SWC (20-70x faster than Babel)
- ✅ CSS collection via unplugin (until native SWC solution available)
- ✅ Full Turbopack compatibility in Next.js 16+

Follow our progress:
- [GitHub Issues](https://github.com/sylphxltd/silk/issues)
- [Roadmap](https://github.com/sylphxltd/silk/blob/main/ROADMAP.md)

## Testing

### Running Tests

```bash
# Run all tests (Rust + Vitest)
npm test

# Rust unit tests only
npm run test:rust

# Vitest integration tests only
npm run test:vitest

# Watch mode for development
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Coverage

- ✅ **Property Shorthands** - All margin, padding, size, background expansions
- ✅ **Value Normalization** - Spacing (0.25rem), unitless, px units
- ✅ **CamelCase Conversion** - fontSize → font-size, backgroundColor → background-color
- ✅ **Hash Generation** - Consistent, deterministic hashing
- ✅ **Edge Cases** - Empty objects, special characters, zero values
- ✅ **Multiple Calls** - Multiple css() in same file
- ✅ **Custom Config** - Custom class prefix

See [TESTING.md](./TESTING.md) for detailed testing guide.

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development roadmap and progress
- **[BUILD.md](./BUILD.md)** - Comprehensive build guide
- **[TESTING.md](./TESTING.md)** - Testing guide and strategies
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)** - Pre-release checklist

## Community

- **GitHub:** [sylphxltd/silk](https://github.com/sylphxltd/silk)
- **Issues:** [Report bugs](https://github.com/sylphxltd/silk/issues)
- **Discussions:** [Ask questions](https://github.com/sylphxltd/silk/discussions)

## License

MIT © SylphX Ltd
