# @sylphx/swc-plugin-silk

SWC plugin for Silk - zero-runtime CSS-in-TypeScript compilation.

## Why SWC Plugin?

- ✅ **Native Turbopack support** - Works with Next.js 16+ out of the box
- ✅ **20-70x faster** than Babel plugin
- ✅ **Perfect Next.js integration** - No webpack mode needed
- ✅ **Future-proof** - SWC is the future of JS/TS compilation

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

## Development Status

🚧 **Work in Progress**

This plugin is currently under development. Follow our progress:
- [GitHub Issues](https://github.com/sylphxltd/silk/issues)
- [Roadmap](https://github.com/sylphxltd/silk/blob/main/ROADMAP.md)

## License

MIT © SylphX Ltd
