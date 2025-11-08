/**
 * LightningCSS WASM integration tests
 */

import { describe, it, expect } from 'vitest'
import { optimizeCSSWithLightning } from '../dist/production-node.js'

describe('lightningcss-wasm', () => {
  it('should optimize CSS with WASM', async () => {
    const css = `
      .test {
        background-color: #ffffff;
        color: rgb(0, 0, 0);
        padding: 0px;
        margin: 10px;
      }
    `

    const result = await optimizeCSSWithLightning(css, { minify: true })

    expect(result.optimized).toBeTruthy()
    expect(result.savings.originalSize).toBeGreaterThan(0)
    expect(result.savings.optimizedSize).toBeGreaterThan(0)
    expect(result.savings.percentage).toBeGreaterThan(0)
    expect(result.optimized).toContain('.test')
  })

  it('should handle minification', async () => {
    const css = `
      .button {
        color: #ff0000;
        background: #ffffff;
      }
    `

    const result = await optimizeCSSWithLightning(css, { minify: true })

    // Should be minified (no whitespace)
    expect(result.optimized).not.toMatch(/\n\s+/)
    expect(result.savings.percentage).toBeGreaterThan(20) // At least 20% reduction
  })

  it('should optimize colors', async () => {
    const css = '.test { color: #ffffff; }'
    const result = await optimizeCSSWithLightning(css, { minify: true })

    // #ffffff should become #fff
    expect(result.optimized).toContain('#fff')
  })

  it('should remove unnecessary units', async () => {
    const css = '.test { padding: 0px; margin: 0em; }'
    const result = await optimizeCSSWithLightning(css, { minify: true })

    // Should remove units from 0 values
    expect(result.optimized).not.toContain('0px')
    expect(result.optimized).not.toContain('0em')
  })

  it('should handle vendor prefixing if configured', async () => {
    const css = '.test { display: flex; }'
    const result = await optimizeCSSWithLightning(css, {
      minify: true,
      targets: { chrome: 90 << 16 }, // Chrome 90
    })

    expect(result.optimized).toBeTruthy()
  })

  it('should handle empty CSS', async () => {
    const result = await optimizeCSSWithLightning('', { minify: true })
    expect(result.optimized).toBe('')
    // Percentage could be NaN or 0 for empty input
    expect(result.savings.percentage === 0 || Number.isNaN(result.savings.percentage)).toBe(true)
  })

  it('should handle invalid CSS gracefully', async () => {
    const invalidCSS = '.test { color }'

    // Should not throw, but may return original or empty
    await expect(
      optimizeCSSWithLightning(invalidCSS, { minify: true })
    ).resolves.toBeDefined()
  })

  it('should preserve important declarations', async () => {
    const css = '.test { color: red !important; }'
    const result = await optimizeCSSWithLightning(css, { minify: true })

    expect(result.optimized).toContain('!important')
  })

  it('should handle nested CSS', async () => {
    const css = `
      .parent {
        color: blue;
        .child {
          color: red;
        }
      }
    `

    const result = await optimizeCSSWithLightning(css, { minify: true })
    expect(result.optimized).toBeTruthy()
  })

  it('should handle media queries', async () => {
    const css = `
      @media (min-width: 768px) {
        .test {
          color: blue;
        }
      }
    `

    const result = await optimizeCSSWithLightning(css, { minify: true })
    expect(result.optimized).toContain('@media')
  })
})
