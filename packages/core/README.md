# @sylphx/silk

Type-safe CSS-in-TypeScript without codegen. **88.5% smaller CSS** than Panda CSS with modern color functions (OKLCH, color-mix) and native CSS nesting.

## Installation

```bash
npm install @sylphx/silk
# or
bun add @sylphx/silk
```

## Quick Start

```typescript
import { defineConfig, createStyleSystem } from '@sylphx/silk'

const config = defineConfig({
  colors: {
    brand: { 500: '#3b82f6' }
  },
  spacing: { 4: '1rem' }
})

const { css } = createStyleSystem(config)

const button = css({
  bg: 'brand.500',      // ✨ Fully typed
  px: 4,
  _hover: { opacity: 0.8 }
})
```

## Features

- ✅ **Zero Codegen** - No build step required (unlike Panda CSS)
- ✅ **88.5% Smaller** - 682B vs 5,936B (Panda CSS)
- ✅ **Full Type Safety** - Only design tokens allowed
- ✅ **Modern CSS** - OKLCH colors, color-mix(), native nesting, @layer
- ✅ **Critical CSS** - Built-in extraction (unique feature)
- ✅ **Performance Monitoring** - Built-in analytics

## Ecosystem

- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings with styled components
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin for build-time extraction

## Documentation

Full documentation: [GitHub Repository](https://github.com/sylphxltd/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
