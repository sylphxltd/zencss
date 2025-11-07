/**
 * Silk v0.2.0 Features Benchmark
 * Tests performance of new production optimizations and modern CSS features
 *
 * Run with: bun test --run benchmark-v0.2.0.bench.ts
 */

import { bench, describe } from 'vitest'
import { createStyleSystem } from './runtime'
import { defineConfig } from './config'
import {
  optimizeCSS,
  generateShortClassName,
  generateClassName,
  resetShortNameCounter,
} from './production'
import {
  mergeStyles,
  createVariant,
  createCompoundVariant,
} from './merge-styles'
import {
  generateNestedCSS,
  convertToNestedCSS,
} from './nesting'
import {
  oklch,
  colorMix,
  lighten,
  darken,
  generatePalette,
  createColorScale,
} from './colors'

// ============================================================================
// Test Config
// ============================================================================

const config = defineConfig({
  colors: {
    brand: { 500: '#3b82f6', 600: '#2563eb' },
    gray: { 100: '#f3f4f6', 500: '#6b7280', 900: '#111827' },
  },
  spacing: { 4: '1rem', 8: '2rem' },
  fontSizes: { base: '1rem', lg: '1.125rem' },
})

// ============================================================================
// 1. Short Hashed Class Names Performance
// ============================================================================

describe('v0.2.0: Short Hashed Class Names', () => {
  bench('Generate 100 short class names (a0-z9)', () => {
    resetShortNameCounter()
    for (let i = 0; i < 100; i++) {
      generateShortClassName(`style-${i}`)
    }
  })

  bench('Generate 1000 short class names', () => {
    resetShortNameCounter()
    for (let i = 0; i < 1000; i++) {
      generateShortClassName(`style-${i}`)
    }
  })

  bench('Development class names (readable)', () => {
    for (let i = 0; i < 100; i++) {
      generateClassName(`style-${i}`, { production: false })
    }
  })

  bench('Production class names (short)', () => {
    resetShortNameCounter()
    for (let i = 0; i < 100; i++) {
      generateClassName(`style-${i}`, { production: true, shortClassNames: true })
    }
  })
})

// ============================================================================
// 2. CSS Optimization Pipeline Performance
// ============================================================================

describe('v0.2.0: CSS Optimization Pipeline', () => {
  const smallCSS = '.a{color:#ffffff;margin:0px;padding:0px}'
  const mediumCSS = Array.from({ length: 50 }, (_, i) =>
    `.class-${i}{color:#ffffff;margin:0px;padding:0px;font-size:16px}`
  ).join('')
  const largeCSS = Array.from({ length: 500 }, (_, i) =>
    `.class-${i}{color:#ffffff;margin:0px;padding:0px;font-size:16px;background:rgb(0,0,0)}`
  ).join('')

  bench('Optimize small CSS (1 rule)', () => {
    optimizeCSS(smallCSS)
  })

  bench('Optimize medium CSS (50 rules)', () => {
    optimizeCSS(mediumCSS)
  })

  bench('Optimize large CSS (500 rules)', () => {
    optimizeCSS(largeCSS)
  })
})

// ============================================================================
// 3. mergeStyles API Performance
// ============================================================================

describe('v0.2.0: mergeStyles API', () => {
  const style1 = { px: 4, py: 2, bg: 'brand.500' }
  const style2 = { px: 6, color: 'gray.900' }
  const style3 = { _hover: { bg: 'brand.600' } }

  bench('mergeStyles - 2 objects', () => {
    mergeStyles(style1, style2)
  })

  bench('mergeStyles - 3 objects with nesting', () => {
    mergeStyles(style1, style2, style3)
  })

  bench('mergeStyles - 10 objects', () => {
    mergeStyles(
      style1, style2, style3,
      { m: 4 }, { p: 8 }, { fontSize: 'lg' },
      { color: 'brand.500' }, { bg: 'gray.100' },
      { _focus: { outline: '2px' } }, { _active: { opacity: 0.8 } }
    )
  })

  const variant = createVariant({
    primary: { bg: 'brand.500', color: 'white' },
    secondary: { bg: 'gray.100', color: 'gray.900' },
  })

  bench('createVariant - select variant', () => {
    variant('primary')
  })

  const compoundVariant = createCompoundVariant({
    variants: {
      color: {
        primary: { bg: 'brand.500' },
        secondary: { bg: 'gray.100' },
      },
      size: {
        sm: { px: 4, py: 2 },
        lg: { px: 8, py: 4 },
      },
    },
    compoundVariants: [
      {
        when: { color: 'primary', size: 'lg' },
        style: { shadow: 'lg' },
      },
    ],
    defaultVariants: {
      color: 'primary',
      size: 'sm',
    },
  })

  bench('createCompoundVariant - match compound', () => {
    compoundVariant({ color: 'primary', size: 'lg' })
  })

  bench('createCompoundVariant - no compound match', () => {
    compoundVariant({ color: 'secondary', size: 'sm' })
  })
})

// ============================================================================
// 4. Native CSS Nesting Performance
// ============================================================================

describe('v0.2.0: Native CSS Nesting', () => {
  const baseProps = { color: 'blue', padding: '10px' }
  const nestedRules = {
    '&:hover': { color: 'red' },
    '&:focus': { outline: '2px solid blue' },
    '&:active': { opacity: 0.8 },
  }

  bench('Generate nested CSS (3 rules)', () => {
    generateNestedCSS('.btn', baseProps, nestedRules)
  })

  bench('Generate nested CSS (10 rules)', () => {
    const manyNested = Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [`&:nth-child(${i})`, { color: `rgb(${i * 10}, 0, 0)` }])
    )
    generateNestedCSS('.element', baseProps, manyNested)
  })

  const expandedCSS = Array.from({ length: 50 }, (_, i) =>
    `.btn-${i} { color: blue; }\n.btn-${i}:hover { color: red; }`
  ).join('\n')

  bench('Convert expanded CSS to nested (50 rules)', () => {
    convertToNestedCSS(expandedCSS)
  })
})

// ============================================================================
// 5. Modern Color Functions Performance
// ============================================================================

describe('v0.2.0: Modern Color Functions', () => {
  bench('oklch() color generation', () => {
    for (let i = 0; i < 100; i++) {
      oklch(0.7, 0.2, i * 3.6)
    }
  })

  bench('colorMix() native mixing', () => {
    for (let i = 0; i < 100; i++) {
      colorMix('blue', 'red', i)
    }
  })

  bench('lighten() utility', () => {
    for (let i = 0; i < 100; i++) {
      lighten('blue', i / 2)
    }
  })

  bench('darken() utility', () => {
    for (let i = 0; i < 100; i++) {
      darken('blue', i / 2)
    }
  })

  bench('generatePalette() - 11 shades', () => {
    generatePalette({ hue: 250, chroma: 0.2 })
  })

  bench('createColorScale() - 9 shades', () => {
    createColorScale('oklch(0.7 0.2 250)', { steps: 9 })
  })
})

// ============================================================================
// 6. @layer Integration Performance
// ============================================================================

describe('v0.2.0: @layer Integration', () => {
  const { css: silkCSSWithLayers, getCSSRules: getLayeredCSS, resetCSSRules } = createStyleSystem(config, {
    enabled: true,
    order: ['reset', 'base', 'tokens', 'recipes', 'utilities'],
  })

  bench('Generate CSS with layers', () => {
    resetCSSRules()
    for (let i = 0; i < 50; i++) {
      silkCSSWithLayers({ color: 'brand.500', px: 4, py: 2 })
    }
    getLayeredCSS({ useLayers: true })
  })

  bench('Generate CSS without layers', () => {
    resetCSSRules()
    for (let i = 0; i < 50; i++) {
      silkCSSWithLayers({ color: 'brand.500', px: 4, py: 2 })
    }
    getLayeredCSS({ useLayers: false })
  })
})

// ============================================================================
// 7. Production Mode End-to-End Performance
// ============================================================================

describe('v0.2.0: Production Mode End-to-End', () => {
  const devSystem = createStyleSystem(config, {
    production: false,
  })

  const prodSystem = createStyleSystem(config, {
    production: true,
    shortClassNames: true,
    minify: true,
    optimizeCSS: true,
  })

  const testStyles = Array.from({ length: 100 }, (_, i) => ({
    color: 'brand.500' as const,
    px: 4,
    py: 2,
    fontSize: 'base' as const,
  }))

  bench('Development mode (readable names)', () => {
    devSystem.resetCSSRules()
    for (const style of testStyles) {
      devSystem.css(style)
    }
    devSystem.getCSSRules()
  })

  bench('Production mode (optimized)', () => {
    prodSystem.resetCSSRules()
    for (const style of testStyles) {
      prodSystem.css(style)
    }
    prodSystem.getCSSRules({ optimize: true })
  })
})

// ============================================================================
// 8. Overall v0.2.0 Performance Summary
// ============================================================================

describe('v0.2.0: Complete Feature Stack', () => {
  const fullSystem = createStyleSystem(config, {
    production: true,
    shortClassNames: true,
    minify: true,
    optimizeCSS: true,
    enabled: true, // @layer
    order: ['reset', 'base', 'tokens', 'recipes', 'utilities'],
  })

  bench('Full v0.2.0 stack - 100 components', () => {
    fullSystem.resetCSSRules()

    // Use all v0.2.0 features
    const buttonStyle = createCompoundVariant({
      variants: {
        color: {
          primary: { bg: oklch(0.7, 0.2, 250) },
          secondary: { bg: oklch(0.5, 0.1, 0) },
        },
        size: {
          sm: { px: 4, py: 2 },
          lg: { px: 8, py: 4 },
        },
      },
      compoundVariants: [
        {
          when: { color: 'primary', size: 'lg' },
          style: { shadow: 'lg' },
        },
      ],
      defaultVariants: {
        color: 'primary',
        size: 'sm',
      },
    })

    for (let i = 0; i < 100; i++) {
      const styles = mergeStyles(
        buttonStyle({
          color: i % 2 === 0 ? 'primary' : 'secondary',
          size: i % 3 === 0 ? 'lg' : 'sm',
        }),
        { _hover: { bg: lighten(oklch(0.7, 0.2, 250), 10) } }
      )
      fullSystem.css(styles)
    }

    fullSystem.getCSSRules({ optimize: true, useLayers: true })
  })
})
