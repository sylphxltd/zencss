/**
 * @sylphx/silk-nuxt
 * Nuxt 3 module for Silk - Zero-codegen CSS-in-TypeScript
 *
 * Architecture:
 * - Wraps @sylphx/silk-vite-plugin for Nuxt's Vite builds
 * - Auto-imports silk.css in app.vue
 * - Handles client, server, and nitro builds
 */

import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import silkVitePlugin from '@sylphx/silk-vite-plugin'

export interface ModuleOptions {
  /**
   * Source directory to scan for css() calls
   * @default './src' or Nuxt's srcDir
   */
  srcDir?: string

  /**
   * Virtual module ID
   * @default 'silk.css'
   */
  virtualModuleId?: string

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean

  /**
   * Enable CSS minification
   * @default true in production
   */
  minify?: boolean

  /**
   * Auto-import silk.css globally
   * @default true
   */
  autoImport?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@sylphx/silk-nuxt',
    configKey: 'silk',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    srcDir: undefined, // Will use Nuxt's srcDir
    virtualModuleId: 'silk.css',
    debug: false,
    minify: undefined, // Will use production mode detection
    autoImport: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Use Nuxt's srcDir if not specified
    const srcDir = options.srcDir || nuxt.options.srcDir

    if (options.debug) {
      console.log('[Silk Nuxt] Module loaded')
      console.log('[Silk Nuxt] Source directory:', srcDir)
    }

    // Add Silk Vite plugin to Nuxt's Vite config
    nuxt.hook('vite:extend', ({ config }) => {
      config.plugins = config.plugins || []
      config.plugins.push(
        silkVitePlugin({
          srcDir,
          virtualModuleId: options.virtualModuleId,
          debug: options.debug,
          minify: options.minify ?? nuxt.options.dev === false
        })
      )

      if (options.debug) {
        console.log('[Silk Nuxt] Vite plugin added')
      }
    })

    // Auto-import silk.css if enabled
    if (options.autoImport) {
      // Add plugin to inject CSS
      addPlugin({
        src: resolver.resolve('./runtime/plugin'),
        mode: 'client' // Only inject on client side
      })

      if (options.debug) {
        console.log('[Silk Nuxt] Auto-import enabled')
      }
    }

    // Log success in dev mode
    if (options.debug) {
      nuxt.hook('ready', () => {
        console.log('[Silk Nuxt] ✅ Module ready')
      })
    }
  }
})
