/**
 * ZenCSS vs Tailwind vs Panda CSS - Vitest Benchmarks
 * Run with: bun test --run benchmark.bench.ts
 */

import { bench, describe } from 'vitest'
import { createStyleSystem } from './runtime'
import { defineConfig } from './config'
import { CSSMinifier, CSSDeduplicator, ProductionOptimizer } from './tree-shaking'
import { CriticalCSSExtractor } from './critical-css'
import { PerformanceMonitor } from './performance'

// ============================================================================
// Test Data Setup
// ============================================================================

const config = defineConfig({
  colors: {
    primary: { 500: '#3b82f6' },
    gray: { 100: '#f3f4f6', 500: '#6b7280', 900: '#111827' },
  },
  spacing: { 1: '0.25rem', 2: '0.5rem', 4: '1rem', 8: '2rem' },
  fontSizes: { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' },
})

const { css: zenCSS, getCSSRules, resetCSSRules } = createStyleSystem(config)

// Small scenario: 80 classes
const smallComponents = Array.from({ length: 10 }, (_, i) => ({
  color: 'primary.500' as const,
  padding: 4,
  margin: 2,
  fontSize: 'base' as const,
  component: i,
}))

// Medium scenario: 600 classes
const mediumComponents = Array.from({ length: 50 }, (_, i) => ({
  color: (i % 2 === 0 ? 'primary.500' : 'gray.500') as 'primary.500' | 'gray.500',
  padding: [1, 2, 4, 8][i % 4],
  margin: [1, 2][i % 2],
  fontSize: (['sm', 'base', 'lg', 'xl'] as const)[i % 4],
  component: i,
}))

// Large scenario: 3000 classes
const largeComponents = Array.from({ length: 200 }, (_, i) => ({
  color: (['primary.500', 'gray.100', 'gray.500', 'gray.900'] as const)[i % 4],
  padding: [1, 2, 4, 8][i % 4],
  margin: [1, 2, 4][i % 3],
  fontSize: (['sm', 'base', 'lg', 'xl'] as const)[i % 4],
  backgroundColor: (i % 3 === 0 ? 'gray.100' : undefined) as 'gray.100' | undefined,
  component: i,
}))

// Mock CSS for optimization tests
const mockCSS = `
/* Reset */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Utilities */
.zen-color-primary { color: #3b82f6; }
.zen-color-gray { color: #6b7280; }
.zen-p-1 { padding: 0.25rem; }
.zen-p-2 { padding: 0.5rem; }
.zen-p-4 { padding: 1rem; }
.zen-p-8 { padding: 2rem; }
.zen-m-1 { margin: 0.25rem; }
.zen-m-2 { margin: 0.5rem; }
.zen-m-4 { margin: 1rem; }
.zen-text-sm { font-size: 0.875rem; }
.zen-text-base { font-size: 1rem; }
.zen-text-lg { font-size: 1.125rem; }
.zen-text-xl { font-size: 1.25rem; }
.zen-bg-gray { background-color: #f3f4f6; }
.zen-flex { display: flex; }
.zen-grid { display: grid; }
.zen-hidden { display: none; }

/* Duplicates for deduplication test */
.duplicate-1 { color: red; }
.duplicate-2 { color: red; }
.duplicate-3 { color: red; }
.duplicate-4 { color: blue; }
.duplicate-5 { color: blue; }

/* Non-critical */
.footer { background: #333; color: white; padding: 2rem; }
.modal { position: fixed; top: 50%; left: 50%; }
.tooltip { position: absolute; background: black; }
`.repeat(10) // Make it larger for realistic benchmarks

// ============================================================================
// Style Generation Benchmarks
// ============================================================================

describe('Style Generation', () => {
  bench('ZenCSS - Small (80 classes)', () => {
    for (const props of smallComponents) {
      zenCSS(props)
    }
  })

  bench('ZenCSS - Medium (600 classes)', () => {
    for (const props of mediumComponents) {
      zenCSS(props)
    }
  })

  bench('ZenCSS - Large (3000 classes)', () => {
    for (const props of largeComponents) {
      zenCSS(props)
    }
  })

  // Tailwind comparison (mock - represents className string concatenation)
  bench('Tailwind (mock) - Small', () => {
    for (const props of smallComponents) {
      const className = `text-${props.color} p-${props.padding} m-${props.margin} text-${props.fontSize}`
      // String operations to simulate Tailwind usage
      className.split(' ').filter(Boolean).join(' ')
    }
  })

  bench('Tailwind (mock) - Medium', () => {
    for (const props of mediumComponents) {
      const className = `text-${props.color} p-${props.padding} m-${props.margin} text-${props.fontSize}`
      className.split(' ').filter(Boolean).join(' ')
    }
  })

  bench('Tailwind (mock) - Large', () => {
    for (const props of largeComponents) {
      const parts = [
        `text-${props.color}`,
        `p-${props.padding}`,
        `m-${props.margin}`,
        `text-${props.fontSize}`,
      ]
      if (props.backgroundColor) parts.push(`bg-${props.backgroundColor}`)
      parts.filter(Boolean).join(' ')
    }
  })
})

// ============================================================================
// CSS Minification Benchmarks
// ============================================================================

describe('CSS Minification', () => {
  bench('ZenCSS - Minify', () => {
    CSSMinifier.minify(mockCSS)
  })

  bench('ZenCSS - Calculate Savings', () => {
    const minified = CSSMinifier.minify(mockCSS)
    CSSMinifier.calculateSavings(mockCSS, minified)
  })
})

// ============================================================================
// CSS Deduplication Benchmarks
// ============================================================================

describe('CSS Deduplication', () => {
  bench('ZenCSS - Deduplicate', () => {
    CSSDeduplicator.deduplicate(mockCSS)
  })

  bench('ZenCSS - Calculate Dedup Savings', () => {
    const deduplicated = CSSDeduplicator.deduplicate(mockCSS)
    CSSDeduplicator.calculateSavings(mockCSS, deduplicated)
  })
})

// ============================================================================
// Production Optimization Benchmarks
// ============================================================================

describe('Production Optimization', () => {
  const optimizer = new ProductionOptimizer({ enabled: true })

  bench('ZenCSS - Full Optimization', async () => {
    await optimizer.optimize(mockCSS)
  })
})

// ============================================================================
// Critical CSS Extraction Benchmarks
// ============================================================================

describe('Critical CSS Extraction', () => {
  const extractor = new CriticalCSSExtractor({ enabled: true })

  bench('ZenCSS - Auto-detect Critical', () => {
    extractor.autoDetect(mockCSS)
  })

  bench('ZenCSS - Extract Critical', () => {
    extractor.autoDetect(mockCSS)
    extractor.extract(mockCSS)
  })

  bench('ZenCSS - Generate Inline HTML', () => {
    const { critical } = extractor.extract(mockCSS)
    extractor.generateInlineHTML(critical)
  })
})

// ============================================================================
// Performance Monitoring Benchmarks
// ============================================================================

describe('Performance Monitoring', () => {
  bench('ZenCSS - Record Metrics', () => {
    const monitor = new PerformanceMonitor()
    monitor.recordMetrics({
      buildTime: 100,
      cssSize: { original: 10000, optimized: 5000 },
      classStats: { total: 100, used: 80, unused: 20 },
      optimization: { merged: 10, deduplicated: 5, treeShaken: 15 },
    })
  })

  bench('ZenCSS - Generate Report', () => {
    const monitor = new PerformanceMonitor()
    monitor.recordMetrics({
      buildTime: 100,
      cssSize: { original: 10000, optimized: 5000 },
      classStats: { total: 100, used: 80, unused: 20 },
      optimization: { merged: 10, deduplicated: 5, treeShaken: 15 },
    })
    monitor.generateReport()
  })
})

// ============================================================================
// Complex Scenarios
// ============================================================================

describe('Complex Real-world Scenarios', () => {
  bench('ZenCSS - Dashboard with 50 components', () => {
    resetCSSRules()
    mediumComponents.forEach((props) => zenCSS(props))
    const allCSS = getCSSRules()
    const minified = CSSMinifier.minify(allCSS)
    CSSDeduplicator.deduplicate(minified)
  })

  bench('ZenCSS - E-commerce with 200 components', () => {
    resetCSSRules()
    largeComponents.forEach((props) => zenCSS(props))
    const allCSS = getCSSRules()
    const minified = CSSMinifier.minify(allCSS)
    CSSDeduplicator.deduplicate(minified)
  })

  bench('ZenCSS - Full production pipeline', async () => {
    // 1. Generate CSS
    resetCSSRules()
    mediumComponents.forEach((props) => zenCSS(props))
    const allCSS = getCSSRules()

    // 2. Optimize
    const optimizer = new ProductionOptimizer({ enabled: true })
    const optimized = await optimizer.optimize(allCSS)

    // 3. Extract critical
    const extractor = new CriticalCSSExtractor({ enabled: true })
    extractor.autoDetect(optimized.css)
    const { critical, nonCritical } = extractor.extract(optimized.css)

    // 4. Monitor
    const monitor = new PerformanceMonitor()
    monitor.recordMetrics({
      buildTime: 100,
      cssSize: {
        original: Buffer.byteLength(allCSS, 'utf-8'),
        optimized: Buffer.byteLength(optimized.css, 'utf-8'),
      },
      classStats: { total: 100, used: 80, unused: 20 },
      optimization: { merged: 10, deduplicated: 5, treeShaken: 15 },
    })
  })
})

// ============================================================================
// Type Inference Performance (Compile-time, but we can measure inference)
// ============================================================================

describe('Type Inference', () => {
  bench('ZenCSS - Type-safe property access', () => {
    // This measures the runtime cost of type-safe access (should be zero)
    zenCSS({
      color: 'primary.500',
      padding: 4,
      margin: 2,
      fontSize: 'base',
    })
  })

  bench('Plain object property access', () => {
    // Baseline comparison
    const obj = {
      color: 'primary.500',
      padding: '4',
      margin: '2',
      fontSize: 'base',
    }
    Object.keys(obj).forEach((key) => obj[key as keyof typeof obj])
  })
})
