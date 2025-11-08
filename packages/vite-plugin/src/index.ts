/**
 * @sylphx/silk-vite-plugin
 * Universal plugin for zero-runtime Silk CSS-in-TypeScript
 *
 * Uses unplugin for cross-bundler compatibility
 */

import { createUnplugin } from 'unplugin'
import type { SilkMetadata } from '@sylphx/babel-plugin-silk'
import * as path from 'node:path'
import { gzipSync, brotliCompressSync, constants } from 'node:zlib'
import { createHash } from 'node:crypto'
// @ts-ignore - Babel preset types not needed
import presetReact from '@babel/preset-react'
// @ts-ignore - Babel preset types not needed
import presetTypeScript from '@babel/preset-typescript'

export interface CompressionOptions {
  /**
   * Enable Brotli compression (.css.br)
   * @default true
   */
  brotli?: boolean

  /**
   * Brotli quality (0-11)
   * @default 11
   */
  brotliQuality?: number

  /**
   * Enable gzip compression (.css.gz)
   * @default true
   */
  gzip?: boolean

  /**
   * Gzip level (0-9)
   * @default 9
   */
  gzipLevel?: number
}

export interface PostCssOptions {
  /**
   * Enable PostCSS processing
   * @default false
   */
  enable?: boolean

  /**
   * PostCSS plugins (e.g., autoprefixer, cssnano)
   * @example
   * ```typescript
   * import autoprefixer from 'autoprefixer'
   *
   * postCss: {
   *   enable: true,
   *   plugins: [
   *     autoprefixer({ overrideBrowserslist: ['> 1%', 'last 2 versions'] })
   *   ]
   * }
   * ```
   */
  plugins?: any[]

  /**
   * Generate source maps
   * @default false
   */
  sourceMaps?: boolean
}

export interface SilkPluginOptions {
  /**
   * Output CSS file path
   * @default 'silk.css'
   */
  outputFile?: string

  /**
   * Minify CSS output
   * @default true in production
   */
  minify?: boolean

  /**
   * Pre-compression options
   */
  compression?: CompressionOptions

  /**
   * PostCSS processing (optional)
   * Add autoprefixer for legacy browser support or custom PostCSS plugins
   *
   * @example
   * ```typescript
   * import autoprefixer from 'autoprefixer'
   *
   * {
   *   postCss: {
   *     enable: true,
   *     plugins: [autoprefixer()],
   *     sourceMaps: true
   *   }
   * }
   * ```
   */
  postCss?: PostCssOptions

  /**
   * Babel plugin options
   */
  babelOptions?: {
    production?: boolean
    classPrefix?: string
    importSources?: string[]
    tokens?: Record<string, any>
    breakpoints?: Record<string, string>
  }
}

// Global CSS registry
const cssRules = new Map<string, string>()

/**
 * Minify CSS
 */
function minifyCSS(css: string): string {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

/**
 * Format bytes
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

/**
 * Process CSS with PostCSS (optional)
 */
async function processWithPostCss(
  css: string,
  postCssOptions?: PostCssOptions
): Promise<{ css: string; map?: string }> {
  if (!postCssOptions?.enable || !postCssOptions?.plugins?.length) {
    return { css }
  }

  try {
    // Dynamic import to avoid forcing PostCSS as a dependency
    const postcss = await import('postcss').then(m => m.default || m)

    const result = await postcss(postCssOptions.plugins).process(css, {
      from: undefined,
      map: postCssOptions.sourceMaps ? { inline: false } : false
    })

    return {
      css: result.css,
      map: result.map?.toString()
    }
  } catch (error) {
    if ((error as any)?.code === 'ERR_MODULE_NOT_FOUND') {
      console.warn('[Silk] PostCSS enabled but not installed. Run: npm install postcss')
      return { css }
    }
    throw error
  }
}

/**
 * Silk unplugin instance
 */
export const unpluginSilk = createUnplugin<SilkPluginOptions>((options = {}) => {
  const {
    outputFile = 'silk.css',
    minify: shouldMinify,
    compression = {},
    babelOptions = {},
    postCss,
  } = options

  const compressionConfig = {
    brotli: compression.brotli ?? true,
    brotliQuality: compression.brotliQuality ?? 11,
    gzip: compression.gzip ?? true,
    gzipLevel: compression.gzipLevel ?? 9,
  }

  let isProduction = false

  return {
    name: 'unplugin-silk',

    enforce: 'pre', // Run before other plugins

    // Only transform TypeScript/JSX files
    transformInclude(id) {
      // Skip node_modules and virtual modules
      if (id.includes('node_modules') || id.includes('\0')) {
        return false
      }
      return /\.[jt]sx?$/.test(id)
    },

    // Transform code with Babel
    async transform(code, id) {
      // Skip if no silk imports
      if (!code.includes('@sylphx/silk')) {
        return null
      }

      try {
        // Dynamic import to avoid bundling
        const { transformSync } = await import('@babel/core')
        const babelPluginSilk = (await import('@sylphx/babel-plugin-silk')).default

        // Set production mode if not explicitly set
        const babelOpts = {
          ...babelOptions,
          production: babelOptions.production ?? isProduction,
        }

        // Transform with Babel plugin
        const result = transformSync(code, {
          filename: id,
          presets: [
            [presetReact, { runtime: 'automatic' }],
            [presetTypeScript, { isTSX: true, allExtensions: true }],
          ],
          plugins: [[babelPluginSilk, babelOpts]],
          sourceMaps: true,
          configFile: false,
          babelrc: false,
        })

        if (!result || !result.code) {
          return null
        }

        // Extract CSS from metadata
        const metadata = result.metadata as { silk?: SilkMetadata } | undefined
        if (metadata?.silk?.cssRules) {
          for (const [className, rule] of metadata.silk.cssRules) {
            cssRules.set(className, rule)
          }

          // Log in dev mode
          if (!isProduction && metadata.silk.cssRules.length > 0) {
            console.log(
              `[Silk] Compiled ${metadata.silk.cssRules.length} CSS rules from ${path.basename(id)}`
            )
          }
        }

        return {
          code: result.code,
          map: result.map || undefined,
        }
      } catch (error) {
        console.error(`[Silk] Transform error in ${id}:`, error)
        return null
      }
    },

    // Universal hook - works for all bundlers
    async generateBundle(this: any) {
      if (cssRules.size === 0) return

      // Generate CSS
      let css = Array.from(cssRules.values()).join('\n')

      if (shouldMinify ?? isProduction) {
        css = minifyCSS(css)
      }

      // Emit main CSS file
      this.emitFile({
        type: 'asset',
        fileName: outputFile,
        source: css,
      })

      // Generate compressed versions
      if (isProduction) {
        const cssBuffer = Buffer.from(css, 'utf-8')
        const originalSize = cssBuffer.length

        // Brotli compression
        if (compressionConfig.brotli) {
          try {
            const compressed = brotliCompressSync(cssBuffer, {
              params: {
                [constants.BROTLI_PARAM_QUALITY]: compressionConfig.brotliQuality,
              },
            })
            this.emitFile({
              type: 'asset',
              fileName: `${outputFile}.br`,
              source: compressed,
            })

            const savings = ((1 - compressed.length / originalSize) * 100).toFixed(1)
            console.log(`[Silk] Brotli: ${formatBytes(compressed.length)} (-${savings}%)`)
          } catch (error) {
            console.warn('[Silk] Brotli compression failed:', error)
          }
        }

        // Gzip compression
        if (compressionConfig.gzip) {
          try {
            const compressed = gzipSync(cssBuffer, {
              level: compressionConfig.gzipLevel,
            })
            this.emitFile({
              type: 'asset',
              fileName: `${outputFile}.gz`,
              source: compressed,
            })

            const savings = ((1 - compressed.length / originalSize) * 100).toFixed(1)
            console.log(`[Silk] Gzip: ${formatBytes(compressed.length)} (-${savings}%)`)
          } catch (error) {
            console.warn('[Silk] Gzip compression failed:', error)
          }
        }

        // Summary
        console.log(`\n📦 Silk CSS Bundle:`)
        console.log(`  Original: ${formatBytes(originalSize)} (${outputFile})`)
        console.log(`  Rules: ${cssRules.size} atomic classes\n`)
      }
    },

    // Vite-specific hooks
    vite: {
      configResolved(config) {
        isProduction = config.command === 'build' && config.mode === 'production'
      },
    },

    // Webpack-specific hooks
    webpack(compiler: any) {
      compiler.hooks.emit.tapPromise('SilkPlugin', async (compilation: any) => {
        if (cssRules.size === 0) return

        let css = Array.from(cssRules.values()).join('\n')
        let sourceMap: string | undefined

        // Minify CSS
        if (shouldMinify ?? true) {
          css = minifyCSS(css)
        }

        // PostCSS processing (optional)
        if (postCss?.enable) {
          const result = await processWithPostCss(css, postCss)
          css = result.css
          sourceMap = result.map
        }

        // Generate content hash for cache busting
        const hash = createHash('md5').update(css).digest('hex').slice(0, 8)
        const baseName = outputFile.replace('.css', '')
        const hashedFileName = `${baseName}.${hash}.css`

        // Emit to both locations for Next.js compatibility
        compilation.assets[outputFile] = {
          source: () => css,
          size: () => css.length,
        }

        // Emit with content hash to static/css directory (production)
        const staticCssPath = `static/css/${hashedFileName}`
        compilation.assets[staticCssPath] = {
          source: () => css,
          size: () => css.length,
        }

        // Also emit non-hashed version for backwards compatibility
        const staticCssPathLegacy = `static/css/${outputFile}`
        compilation.assets[staticCssPathLegacy] = {
          source: () => css,
          size: () => css.length,
        }

        // Emit source map if PostCSS generated one
        if (sourceMap) {
          compilation.assets[`${staticCssPath}.map`] = {
            source: () => sourceMap,
            size: () => sourceMap.length,
          }
          compilation.assets[`${outputFile}.map`] = {
            source: () => sourceMap,
            size: () => sourceMap.length,
          }
        }

        console.log(`[Silk] Emitted CSS:`)
        console.log(`  • ${outputFile} (${css.length} bytes)`)
        console.log(`  • ${staticCssPath} (content-hashed, cacheable)`)
        console.log(`  • ${staticCssPathLegacy} (legacy, no hash)`)
        if (postCss?.enable) {
          console.log(`  • PostCSS: ${postCss.plugins?.length || 0} plugins applied`)
        }
        if (sourceMap) {
          console.log(`  • Source map generated`)
        }

        // Store the hashed filename for potential use in HTML injection
        ;(compilation as any).__silkCssFileName = hashedFileName
      })
    },
  }
})

// Export for different bundlers
export const vite = unpluginSilk.vite
export const webpack = unpluginSilk.webpack
export const rollup = unpluginSilk.rollup
export const esbuild = unpluginSilk.esbuild

// Default export for Vite
export default vite
