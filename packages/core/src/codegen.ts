/**
 * Code generation - Convert scanned css() calls to optimized CSS output
 *
 * This module:
 * 1. Takes scan results (style objects)
 * 2. Uses Silk runtime to generate CSS rules
 * 3. Optimizes with lightningcss-wasm
 * 4. Returns final CSS string
 */

import { createStyleSystem } from './runtime.js';
import type { DesignConfig } from './types.js';
import { optimizeCSSWithLightning } from './production-node.js';
import type { ProductionConfig } from './production.js';
import type { ScanResult } from './scan.js';

/**
 * Options for CSS generation
 */
export interface GenerateOptions {
  /** Design config (defaults to empty config) */
  config?: DesignConfig;
  /** Enable CSS optimization with lightningcss-wasm */
  optimize?: boolean;
  /** Minify CSS output */
  minify?: boolean;
  /** Targets for vendor prefixing (browserslist format) */
  targets?: ProductionConfig['targets'];
  /** Enable debug output */
  debug?: boolean;
}

/**
 * Generate CSS from scan results
 *
 * @param scanResults - Results from scanSourceFiles()
 * @param options - Generation options
 * @returns Generated CSS string
 *
 * @example
 * ```ts
 * const scanResults = scanSourceFiles({ srcDir: './src' });
 * const css = await generateCSS(scanResults, { minify: true });
 * console.log(css);
 * ```
 */
export async function generateCSS(
  scanResults: ScanResult[],
  options: GenerateOptions = {}
): Promise<string> {
  const {
    config = {},
    optimize = true,
    minify = true,
    targets,
    debug = false
  } = options;

  if (debug) {
    const totalRules = scanResults.reduce((sum, r) => sum + r.cssRules.length, 0);
    console.log(`Generating CSS from ${totalRules} rules...`);
  }

  // Create style system with production mode enabled
  // Use hash-based class names (not counter-based) for deterministic output
  // This ensures CLI and Babel plugin generate the same class names
  const styleSystem = createStyleSystem(config, {
    production: true,
    shortClassNames: false,  // Disable counter-based, use hash-based
    optimize: true
  });

  // Process all CSS rules through the style system
  for (const fileResult of scanResults) {
    for (const cssRule of fileResult.cssRules) {
      try {
        // Run css() to generate atomic classes and CSS rules
        styleSystem.css(cssRule.styles as any);
      } catch (err) {
        if (debug) {
          console.warn(`Failed to generate CSS for ${fileResult.filePath}:`, err);
        }
      }
    }
  }

  // Collect all generated CSS rules
  let css = styleSystem.getCSSRules();

  if (debug) {
    console.log(`Generated ${css.length} bytes of CSS`);
  }

  // Optimize with lightningcss-wasm
  if (optimize && css.length > 0) {
    try {
      const result = await optimizeCSSWithLightning(css, {
        minify,
        targets
      });

      css = result.optimized;

      if (debug) {
        console.log(`Optimized to ${css.length} bytes (${result.savings.percentage.toFixed(1)}% reduction)`);
      }
    } catch (err) {
      if (debug) {
        console.warn('CSS optimization failed:', err);
      }
      // Continue with unoptimized CSS
    }
  }

  return css;
}

/**
 * Scan source files and generate CSS in one step
 *
 * This is a convenience function that combines scanning and generation.
 *
 * @param srcDir - Source directory to scan
 * @param options - Generation options
 * @returns Generated CSS string
 *
 * @example
 * ```ts
 * const css = await scanAndGenerate('./src', { minify: true });
 * await fs.writeFile('silk.css', css);
 * ```
 */
export async function scanAndGenerate(
  srcDir: string = './src',
  options: GenerateOptions & { exclude?: string[] } = {}
): Promise<string> {
  const { exclude, ...generateOptions } = options;

  // Import scanSourceFiles here to avoid circular dependency
  const { scanSourceFiles } = await import('./scan.js');

  // Scan source files
  const scanResults = scanSourceFiles({
    srcDir,
    exclude,
    debug: generateOptions.debug
  });

  // Generate CSS
  return generateCSS(scanResults, generateOptions);
}
