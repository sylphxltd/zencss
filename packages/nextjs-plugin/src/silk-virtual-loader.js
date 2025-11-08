/**
 * Virtual CSS loader for Silk
 *
 * This loader creates a virtual CSS module that Next.js can properly process.
 * It reads the generated Silk CSS file and injects it into the webpack build.
 */

const fs = require('fs')
const path = require('path')

module.exports = function silkVirtualLoader(source) {
  const callback = this.async()

  // Get the path to the generated CSS file
  const cssPath = this.resourcePath

  // Mark the file as cacheable
  this.cacheable(true)

  // Watch the CSS file for changes
  this.addDependency(cssPath)

  try {
    // Read the actual CSS content
    const cssContent = fs.readFileSync(cssPath, 'utf-8')

    // Return the CSS content
    callback(null, cssContent)
  } catch (error) {
    // If file doesn't exist yet, return empty CSS
    callback(null, '/* Silk CSS - waiting for generation */')
  }
}
