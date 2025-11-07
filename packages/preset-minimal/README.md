# @sylphx/silk-preset-minimal

Minimal preset for Silk - clean, simple, and elegant design system for modern applications.

## Installation

```bash
npm install @sylphx/silk @sylphx/silk-preset-minimal
# or
bun add @sylphx/silk @sylphx/silk-preset-minimal
```

## Quick Start

### Use Minimal Preset Directly

```typescript
import { createStyleSystem } from '@sylphx/silk'
import { minimalPreset } from '@sylphx/silk-preset-minimal'

const { css } = createStyleSystem(minimalPreset)

const button = css({
  bg: 'gray.10',
  color: 'gray.100',
  fontSize: 'base',
  px: 6,
  py: 3,
  rounded: 'md'
})
```

### Extend Minimal Preset

```typescript
import { defineConfig } from '@sylphx/silk'
import { minimalPreset } from '@sylphx/silk-preset-minimal'

const customConfig = defineConfig({
  ...minimalPreset,
  colors: {
    ...minimalPreset.colors,
    // Add your brand color
    brand: '#your-color'
  }
})
```

### Use with React

```tsx
import { createSilkReact } from '@sylphx/silk-react'
import { minimalPreset } from '@sylphx/silk-preset-minimal'

export const { styled, Box } = createSilkReact(minimalPreset)

// Minimal button
export const MinimalButton = styled('button', {
  bg: 'gray.10',
  color: 'gray.100',
  fontSize: 'base',
  fontWeight: 'normal',
  px: 6,
  py: 3,
  rounded: 'md',
  _hover: {
    bg: 'gray.20'
  }
})
```

## Philosophy

**Less is More**

Minimal preset focuses on:
- ✅ **Simplicity** - Fewer options, clearer choices
- ✅ **Readability** - Clean typography, generous spacing
- ✅ **Elegance** - Subtle effects, no clutter
- ✅ **Performance** - Smallest possible configuration

Perfect for:
- 📝 Documentation sites
- 💼 Portfolio websites
- 🚀 Startup landing pages
- 📱 Minimal mobile apps
- 🎨 Clean admin dashboards

## Features

### ✅ Minimal Color Palette
- **Grayscale**: 14 shades from pure black to pure white
- **Single accent color**: One accent, five tones
- **Semantic colors**: Success, Error, Warning, Info (single tone each)
- **No complexity**: Just what you need, nothing more

### ✅ Simple Typography
- **8 font sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
- **3 font weights**: light (300), normal (400), bold (700)
- **3 line heights**: tight, normal, relaxed
- **Clear hierarchy**: Easy to understand, easy to use

### ✅ Minimal Shadows
- **3 levels only**: sm, md, lg
- **Subtle effects**: Just enough depth
- **No distractions**: Clean and professional

### ✅ Clean Spacing
- **Simple scale**: 0-24 (powers of 4)
- **Consistent rhythm**: Predictable spacing
- **Easy to remember**: 4px base unit

## Color System

### Grayscale

```typescript
const darkBackground = css({ bg: 'gray.10' })
const mediumGray = css({ bg: 'gray.50' })
const lightBackground = css({ bg: 'gray.95' })
```

### Accent Color

```typescript
const primaryButton = css({
  bg: 'accent.default',   // #0066ff
  color: 'gray.100',
  _hover: {
    bg: 'accent.light'    // Lighter on hover
  }
})
```

### Semantic Colors

```typescript
const successBadge = css({
  bg: 'success',          // #00cc66
  color: 'gray.100',
  rounded: 'full',
  px: 3,
  py: 1
})

const errorMessage = css({
  color: 'error',         // #ff3333
  fontSize: 'sm'
})
```

## Typography

```typescript
const heading = css({
  fontSize: '3xl',        // 32px
  fontWeight: 'bold',     // 700
  lineHeight: 'tight',    // 1.25
  color: 'gray.10'
})

const body = css({
  fontSize: 'base',       // 16px
  fontWeight: 'normal',   // 400
  lineHeight: 'normal',   // 1.5
  color: 'gray.30'
})
```

## Spacing & Layout

```typescript
const card = css({
  p: 6,                   // 24px padding
  gap: 4,                 // 16px gap
  rounded: 'md',          // 8px border radius
  shadow: 'md'            // Medium shadow
})
```

## Dark Theme

```typescript
import { minimalDarkPreset } from '@sylphx/silk-preset-minimal'
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem(minimalDarkPreset)

// Colors are inverted for dark mode
const darkCard = css({
  bg: 'gray.95',          // Almost black in dark mode
  color: 'gray.10',       // Almost white in dark mode
  rounded: 'md',
  shadow: 'sm'
})
```

## Monochrome Variant

Pure black and white only:

```typescript
import { monochromePreset } from '@sylphx/silk-preset-minimal'
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem(monochromePreset)

const pureMinimal = css({
  bg: 'black',
  color: 'white',
  fontSize: 'base'
})
```

## Component Examples

### Minimal Button

```tsx
const MinimalButton = styled('button', {
  bg: 'gray.10',
  color: 'gray.100',
  fontSize: 'base',
  fontWeight: 'normal',
  px: 6,
  py: 3,
  rounded: 'md',
  transition: 'all 150ms',
  _hover: {
    bg: 'gray.20'
  }
})
```

### Minimal Card

```tsx
const MinimalCard = styled('div', {
  bg: 'gray.100',
  rounded: 'lg',
  shadow: 'sm',
  p: 6,
  transition: 'shadow 200ms',
  _hover: {
    shadow: 'md'
  }
})
```

### Minimal Input

```tsx
const MinimalInput = styled('input', {
  bg: 'gray.98',
  color: 'gray.10',
  fontSize: 'base',
  px: 4,
  py: 3,
  rounded: 'md',
  borderWidth: '1px',
  borderColor: 'gray.90',
  _focus: {
    borderColor: 'accent.default'
  }
})
```

## Bundle Size

```typescript
// Core Silk
@sylphx/silk: 500B gzipped ✅

// Minimal preset (only when used)
@sylphx/silk-preset-minimal: ~1KB gzipped ✅

// Total: ~1.5KB for complete minimal design system
```

**Smallest preset available!**

## Comparison

| Preset | Colors | Typography | Shadows | Bundle Size |
|--------|--------|------------|---------|-------------|
| **Minimal** | **30** | **8 sizes** | **3 levels** | **~1KB** |
| Material | 150+ | 15 sizes | 6 levels | ~2KB |
| Tailwind | 250+ | 12 sizes | 9 levels | ~3KB |

**Minimal preset is the lightest configuration possible.**

## Documentation

- **Silk Documentation**: [GitHub Repository](https://github.com/sylphxltd/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
