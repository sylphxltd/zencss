# @sylphx/silk-preset-material

Material Design 3 preset for Silk - Google's official design system with dynamic color and modern typography.

## Installation

```bash
npm install @sylphx/silk @sylphx/silk-preset-material
# or
bun add @sylphx/silk @sylphx/silk-preset-material
```

## Quick Start

### Use Material Preset Directly

```typescript
import { createStyleSystem } from '@sylphx/silk'
import { materialPreset } from '@sylphx/silk-preset-material'

const { css } = createStyleSystem(materialPreset)

const button = css({
  bg: 'primary.40',
  color: 'primary.100',
  fontSize: 'label-large',
  px: 6,
  py: 3,
  rounded: 'medium'
})
```

### Extend Material Preset

```typescript
import { defineConfig } from '@sylphx/silk'
import { materialPreset } from '@sylphx/silk-preset-material'

const customConfig = defineConfig({
  ...materialPreset,
  colors: {
    ...materialPreset.colors,
    // Add custom brand colors
    brand: {
      primary: '#your-primary-color',
      secondary: '#your-secondary-color'
    }
  }
})
```

### Use with React

```tsx
import { createSilkReact } from '@sylphx/silk-react'
import { materialPreset } from '@sylphx/silk-preset-material'

export const { styled, Box } = createSilkReact(materialPreset)

// Material Design components
export const MaterialButton = styled('button', {
  bg: 'primary.40',
  color: 'primary.100',
  fontSize: 'label-large',
  fontWeight: 'medium',
  px: 6,
  py: 3,
  rounded: 'medium',
  shadow: 'level1',
  _hover: {
    shadow: 'level2'
  }
})
```

## Features

### ✅ Material Design 3 Color System
- Full Material You dynamic color palette
- Primary, Secondary, Tertiary colors (13 tones each)
- Neutral and Neutral Variant colors
- Semantic colors (Error, Success, Warning)
- Surface colors for containers

### ✅ Material Typography Scale
- Display (Large, Medium, Small)
- Headline (Large, Medium, Small)
- Title (Large, Medium, Small)
- Body (Large, Medium, Small)
- Label (Large, Medium, Small)

### ✅ Material Elevation System
- 6 elevation levels (0-5)
- Consistent shadow system
- Depth perception

### ✅ Material Shape System
- Extra Small (4px)
- Small (8px)
- Medium (12px)
- Large (16px)
- Extra Large (28px)
- Full (circular)

### ✅ Responsive Breakpoints
- Compact: 0-600px (phones)
- Medium: 600-840px (tablets)
- Expanded: 840-1200px (laptops)
- Large: 1200-1600px (desktops)
- Extra Large: 1600px+ (wide screens)

## Color System

### Primary Palette

```typescript
const button = css({
  bg: 'primary.40',      // Primary brand color
  color: 'primary.100',  // On-primary text
  _hover: {
    bg: 'primary.50'     // Lighter shade on hover
  }
})
```

### Surface Colors

```typescript
const card = css({
  bg: 'surface.container',           // Container background
  borderRadius: 'medium',
  shadow: 'level1',
  color: 'neutral.10'
})
```

### Semantic Colors

```typescript
const errorBadge = css({
  bg: 'error.40',
  color: 'error.100',
  rounded: 'full',
  px: 3,
  py: 1
})

const successBadge = css({
  bg: 'success.40',
  color: 'success.100'
})
```

## Typography Scale

### Headlines

```typescript
const headline = css({
  fontSize: 'headline-large',     // 32px
  fontWeight: 'regular',           // 400
  lineHeight: 'headline-large',   // 1.25
  letterSpacing: 'headline-large' // 0
})
```

### Body Text

```typescript
const body = css({
  fontSize: 'body-large',         // 16px
  fontWeight: 'regular',          // 400
  lineHeight: 'body-large',       // 1.5
  letterSpacing: 'body-large'     // 0.5px
})
```

### Labels (Buttons)

```typescript
const buttonText = css({
  fontSize: 'label-large',        // 14px
  fontWeight: 'medium',           // 500
  lineHeight: 'label-large',      // 1.42
  letterSpacing: 'label-large'    // 0.1px
})
```

## Elevation System

```typescript
const elevatedCard = css({
  bg: 'surface.container',
  rounded: 'medium',
  shadow: 'level2',  // Medium elevation
  transition: 'shadow 200ms',
  _hover: {
    shadow: 'level3'  // Higher elevation on hover
  }
})
```

## Dark Theme

```typescript
import { materialDarkPreset } from '@sylphx/silk-preset-material'
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem(materialDarkPreset)
```

## Material Components Examples

### Material Button

```tsx
const MaterialButton = styled('button', {
  bg: 'primary.40',
  color: 'primary.100',
  fontSize: 'label-large',
  fontWeight: 'medium',
  px: 6,
  py: 3,
  rounded: 'full',
  shadow: 'level1',
  _hover: {
    shadow: 'level2',
    bg: 'primary.50'
  },
  _active: {
    shadow: 'level0'
  }
})
```

### Material Card

```tsx
const MaterialCard = styled('div', {
  bg: 'surface.container',
  rounded: 'medium',
  shadow: 'level1',
  p: 4
})
```

### Material FAB (Floating Action Button)

```tsx
const MaterialFAB = styled('button', {
  bg: 'primary.40',
  color: 'primary.100',
  w: 14,
  h: 14,
  rounded: 'large',
  shadow: 'level3',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  _hover: {
    shadow: 'level4'
  }
})
```

## Bundle Size

```typescript
// Core Silk
@sylphx/silk: 500B gzipped ✅

// Material preset (only when used)
@sylphx/silk-preset-material: ~2KB gzipped ✅

// Total: ~2.5KB for full Material Design 3 system
```

## Documentation

- **Material Design 3**: https://m3.material.io/
- **Silk Documentation**: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)

Material Design is a design system created by Google.
