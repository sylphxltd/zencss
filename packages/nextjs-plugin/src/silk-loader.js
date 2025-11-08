/**
 * Webpack loader for Silk CSS
 * Dynamically loads generated CSS from .next/silk.css
 * MUST use CommonJS format for webpack loaders
 */

const path = require('path')
const fs = require('fs')

module.exports = function silkLoader(source: string): string {
  const silkCSSPath = path.join(this.rootContext, '.next', 'silk.css')

  console.log('[Silk Loader] Processing:', this.resourcePath)
  console.log('[Silk Loader] Looking for CSS at:', silkCSSPath)

  // Watch the generated CSS file for changes (triggers HMR)
  if (fs.existsSync(silkCSSPath)) {
    this.addDependency(silkCSSPath)
    const css = fs.readFileSync(silkCSSPath, 'utf-8')
    console.log('[Silk Loader] Loaded CSS:', css.length, 'bytes')
    return css
  }

  console.log('[Silk Loader] CSS file not found, using placeholder')
  // Return placeholder CSS if not generated yet (first build)
  return '/* Silk CSS - will be generated during build */'
}

module.exports.raw = false
