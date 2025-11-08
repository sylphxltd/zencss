/**
 * Node.js-only production optimizations
 * DO NOT import this in browser builds
 * Uses lightningcss (native Node.js addon)
 */

import type { ProductionConfig, CSSOptimizationResult } from './production.js'
import { optimizeCSS } from './production.js'

// Dynamic import to avoid bundling native dependencies
type LightningCSS = typeof import('lightningcss')
let lightningcss: LightningCSS | null = null

// Lazy load lightningcss only when needed (server environments: Node.js, Bun, Deno)
async function loadLightningCSS(): Promise<LightningCSS | null> {
  if (lightningcss) return lightningcss

  // Check if we're in a server environment (not browser)
  if (typeof window === 'undefined') {
    try {
      lightningcss = await import('lightningcss')
      return lightningcss
    } catch (error) {
      // LightningCSS not available - fall back to manual optimization
      return null
    }
  }

  // Browser environment - lightningcss cannot run
  return null
}

/**
 * Optimize CSS with LightningCSS (5-10x faster than manual optimization)
 * Automatically falls back to manual optimization if lightningcss unavailable
 */
export async function optimizeCSSWithLightning(
  css: string,
  config: ProductionConfig = {}
): Promise<CSSOptimizationResult> {
  const originalSize = new TextEncoder().encode(css).length

  try {
    const lightning = await loadLightningCSS()

    if (!lightning) {
      // LightningCSS not available - use fallback
      return optimizeCSS(css)
    }

    const { code } = lightning.transform({
      filename: 'silk.css',
      code: new TextEncoder().encode(css),
      minify: config.minify ?? true,
      ...(config.targets && { targets: config.targets }),
    })

    const optimized = new TextDecoder().decode(code)
    const optimizedSize = new TextEncoder().encode(optimized).length
    const percentage = ((originalSize - optimizedSize) / originalSize) * 100

    return {
      optimized,
      savings: {
        originalSize,
        optimizedSize,
        percentage,
      },
    }
  } catch (error) {
    // LightningCSS failed - fallback to manual optimization
    return optimizeCSS(css)
  }
}
