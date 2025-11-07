/**
 * @sylphx/silk-preset-minimal
 * Minimal preset for Silk
 * Clean, simple, and elegant design system for modern applications
 */

import { defineConfig } from '@sylphx/silk'

/**
 * Minimal design system preset
 *
 * Focus: Simplicity, readability, and clean aesthetics
 * Perfect for: Startups, portfolios, documentation sites, minimal UIs
 */
export const minimalPreset = defineConfig({
  colors: {
    // Grayscale palette (pure black to pure white)
    gray: {
      0: '#000000',
      5: '#0d0d0d',
      10: '#1a1a1a',
      20: '#333333',
      30: '#4d4d4d',
      40: '#666666',
      50: '#808080',
      60: '#999999',
      70: '#b3b3b3',
      80: '#cccccc',
      90: '#e6e6e6',
      95: '#f2f2f2',
      98: '#fafafa',
      100: '#ffffff',
    },
    // Minimal accent color (single tone for simplicity)
    accent: {
      default: '#0066ff',
      light: '#3385ff',
      lighter: '#66a3ff',
      dark: '#0052cc',
      darker: '#003d99',
    },
    // Semantic colors (minimal, single tone)
    success: '#00cc66',
    error: '#ff3333',
    warning: '#ffaa00',
    info: '#0099ff',
    // Special
    transparent: 'transparent',
    current: 'currentColor',
  },
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  sizes: {
    0: '0',
    full: '100%',
    screen: '100vh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    // Simple size scale
    xs: '20rem',
    sm: '24rem',
    md: '32rem',
    lg: '40rem',
    xl: '48rem',
  },
  fontSizes: {
    // Minimal type scale (fewer options, clear hierarchy)
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
    '5xl': '3rem',    // 48px
  },
  fontWeights: {
    // Only 3 weights for simplicity
    light: 300,
    normal: 400,
    bold: 700,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacings: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
  radii: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    full: '9999px',
  },
  shadows: {
    // Minimal shadow system (subtle, only 3 levels)
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const)

export type MinimalPreset = typeof minimalPreset

/**
 * Minimal dark theme variant
 * Clean dark mode with high contrast
 */
export const minimalDarkPreset = defineConfig({
  ...minimalPreset,
  colors: {
    ...minimalPreset.colors,
    // Inverted grayscale for dark mode
    gray: {
      0: '#ffffff',
      5: '#f2f2f2',
      10: '#e6e6e6',
      20: '#cccccc',
      30: '#b3b3b3',
      40: '#999999',
      50: '#808080',
      60: '#666666',
      70: '#4d4d4d',
      80: '#333333',
      90: '#1a1a1a',
      95: '#0d0d0d',
      98: '#050505',
      100: '#000000',
    },
  },
} as const)

export type MinimalDarkPreset = typeof minimalDarkPreset

/**
 * Monochrome variant
 * Pure black and white only
 */
export const monochromePreset = defineConfig({
  ...minimalPreset,
  colors: {
    black: '#000000',
    white: '#ffffff',
    gray: {
      10: '#1a1a1a',
      20: '#333333',
      30: '#4d4d4d',
      40: '#666666',
      50: '#808080',
      60: '#999999',
      70: '#b3b3b3',
      80: '#cccccc',
      90: '#e6e6e6',
    },
    transparent: 'transparent',
    current: 'currentColor',
  },
} as const)

export type MonochromePreset = typeof monochromePreset
