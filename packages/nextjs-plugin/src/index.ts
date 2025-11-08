/**
 * @sylphx/silk-nextjs
 * Next.js integration for Silk with App Router and RSC support
 * Uses unplugin for zero-runtime CSS compilation with automatic CSS injection
 */

import type { NextConfig } from 'next'
import type { DesignConfig } from '@sylphx/silk'
import { unpluginSilk, type SilkPluginOptions } from '@sylphx/silk-vite-plugin'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface SilkNextConfig extends SilkPluginOptions {
  /**
   * Enable App Router optimizations
   * @default true
   */
  appRouter?: boolean

  /**
   * Enable React Server Components optimizations
   * @default true
   */
  rsc?: boolean

  /**
   * Generate critical CSS for initial page load
   * @default true
   */
  criticalCSS?: boolean

  /**
   * Automatically inject CSS into HTML
   *
   * ⚠️ DEPRECATED: Auto-injection has fundamental limitations:
   * - Bypasses Next.js CSS optimization pipeline (no merging/tree-shaking)
   * - Extra network request (impacts FCP)
   * - Flash of Unstyled Content (FOUC)
   * - CDN compatibility issues
   *
   * RECOMMENDED: Use manual import instead (see README)
   *
   * @default false
   * @deprecated Use manual CSS import for reliable production builds
   */
  inject?: boolean
}

/**
 * Silk Next.js plugin
 *
 * @example
 * ```typescript
 * // next.config.js
 * import { withSilk } from '@sylphx/silk-nextjs'
 *
 * export default withSilk({
 *   // Next.js config
 * }, {
 *   // Silk config
 *   outputFile: 'styles/silk.css',  // Output path
 * })
 *
 * // app/layout.tsx - Import the generated CSS
 * import '../.next/styles/silk.css'
 * ```
 */
export function withSilk(
  nextConfig: NextConfig = {},
  silkConfig: SilkNextConfig = {}
): NextConfig {
  const {
    outputFile = 'silk.css',
    inject = false,  // Deprecated - CSS is now auto-emitted to static/css
    babelOptions = {},
    compression = {},
    minify,
  } = silkConfig

  // Configure Silk plugin with Next.js specific settings
  const silkPluginOptions: SilkPluginOptions = {
    outputFile,
    minify,
    compression,
    babelOptions: {
      ...babelOptions,
      production: babelOptions.production ?? process.env.NODE_ENV === 'production',
    },
  }

  // Detect Turbopack mode
  const useTurbopack = nextConfig.turbo !== undefined || process.env.TURBOPACK === '1'

  // SWC plugin configuration for Turbopack
  const swcPluginConfig = useTurbopack ? {
    experimental: {
      ...nextConfig.experimental,
      swcPlugins: [
        ['@sylphx/swc-plugin-silk', babelOptions as Record<string, unknown>] as [string, Record<string, unknown>],
        ...(nextConfig.experimental?.swcPlugins || []),
      ],
      // Turbopack configuration
      turbo: {
        ...nextConfig.turbo,
        resolveAlias: {
          ...nextConfig.turbo?.resolveAlias,
          // Prevent lightningcss from being bundled in client builds
          'lightningcss': false,
        },
      },
    },
  } : {}

  return {
    ...nextConfig,
    ...swcPluginConfig,
    webpack(config, options) {
      const { isServer, dev, dir } = options

      // Call user's webpack config if exists
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options)
      }

      const cssPath = path.join(dir, '.next', outputFile)
      const cssDir = path.dirname(cssPath)

      // Create placeholder CSS file before compilation starts
      // This ensures .next/silk.css exists when Next.js processes CSS imports
      config.plugins = config.plugins || []
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.beforeCompile.tapAsync('SilkPlaceholder', (_params: any, callback: () => void) => {
            if (!fs.existsSync(cssDir)) {
              fs.mkdirSync(cssDir, { recursive: true })
            }

            // Create empty placeholder if doesn't exist
            // Silk plugin will overwrite this with real CSS during compilation
            if (!fs.existsSync(cssPath)) {
              fs.writeFileSync(cssPath, '/* Silk CSS - will be generated during build */')
            }

            callback()
          })
        }
      })

      // Add Silk unplugin (generates CSS to static/css/silk.css)
      config.plugins.push(unpluginSilk.webpack(silkPluginOptions))

      // Mark lightningcss as external to prevent bundling in client builds
      // It's only used server-side for CSS optimization via dynamic import
      config.externals = config.externals || []
      if (!isServer) {
        if (Array.isArray(config.externals)) {
          config.externals.push('lightningcss')
        } else if (typeof config.externals === 'object') {
          config.externals = { ...config.externals, lightningcss: 'lightningcss' }
        }
      }

      return config
    },
  }
}

/**
 * Get Silk configuration for Next.js
 */
export function getSilkConfig<C extends DesignConfig>(config: C) {
  return {
    config,
    // App Router helpers
    appRouter: {
      /**
       * Generate CSS for server components
       */
      generateServerCSS: () => {
        // Extract CSS during SSR
        return ''
      },

      /**
       * Get critical CSS for route
       */
      getCriticalCSS: (route: string) => {
        // Extract critical CSS for specific route
        return ''
      },
    },

    // React Server Components helpers
    rsc: {
      /**
       * Mark styles as RSC-safe
       */
      serverOnly: <T>(styles: T): T => styles,

      /**
       * Client-only styles
       */
      clientOnly: <T>(styles: T): T => styles,
    },
  }
}

// Re-export Silk React bindings
export { createSilkReact } from '@sylphx/silk-react'
export type { SilkReactSystem } from '@sylphx/silk-react'

// Re-export core
export * from '@sylphx/silk'

// Export Silk styles component
export { SilkStyles, getSilkCssLink } from './SilkStyles.js'
