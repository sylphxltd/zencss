/**
 * @sylphx/silk/optimizer
 * Build-time optimization utilities (Node.js only)
 *
 * This module contains build-time tools that should NOT be bundled in browser code:
 * - LightningCSS optimization
 * - CSS production optimization
 * - Atomic CSS registry
 * - Critical CSS extraction
 *
 * Import from: @sylphx/silk/optimizer
 */

// Production optimizations (browser-safe)
export {
  generateClassName,
  generateShortClassName,
  hashStyleId,
  optimizeCSS,
  smartOptimizeCSS,
  resetShortNameCounter,
  getShortNameCount,
} from './production.js'
export type { ProductionConfig, CSSOptimizationResult } from './production.js'

// LightningCSS optimization (Node.js only - 5-10x faster)
export { optimizeCSSWithLightning } from './production-node.js'

// Atomic CSS Deduplication (10-20% smaller for large apps)
export {
  AtomicCSSRegistry,
  getAtomicRegistry,
  resetAtomicRegistry,
  generateAtomicReport,
} from './atomic.js'
export type { AtomicCSSOptions } from './atomic.js'

// Critical CSS Extraction (30-50% faster first paint)
export {
  CriticalCSSExtractor,
  CriticalCSSMeasurement,
} from './critical-css.js'
export type {
  CriticalCSSConfig,
} from './critical-css.js'
