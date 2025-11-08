/**
 * @sylphx/silk-webpack-plugin
 * Zero-codegen Webpack plugin using virtual CSS modules
 *
 * Architecture:
 * 1. Scan source files for css() calls
 * 2. Generate CSS via scanAndGenerate()
 * 3. Create virtual 'node_modules/silk.css' module using webpack-virtual-modules
 * 4. CSS flows through Webpack's CSS pipeline (css-loader, MiniCssExtractPlugin, etc.)
 */

import VirtualModulesPlugin from 'webpack-virtual-modules';
import type { Compiler } from 'webpack';
import { scanAndGenerate, type GenerateOptions } from '@sylphx/silk/codegen';

export interface SilkWebpackPluginOptions extends GenerateOptions {
  /**
   * Source directory to scan for css() calls
   * @default './src'
   */
  srcDir?: string;

  /**
   * Virtual module path (what users import)
   * @default 'silk.css'
   */
  virtualModuleId?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Silk Webpack plugin - Zero-codegen with virtual CSS module
 *
 * @example
 * ```javascript
 * // webpack.config.js
 * const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');
 * const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 *
 * module.exports = {
 *   plugins: [
 *     new SilkWebpackPlugin(),
 *     new MiniCssExtractPlugin()
 *   ],
 *   module: {
 *     rules: [{
 *       test: /\.css$/,
 *       use: [MiniCssExtractPlugin.loader, 'css-loader']
 *     }]
 *   }
 * }
 * ```
 *
 * ```javascript
 * // src/index.js
 * import 'silk.css'  // Virtual module → webpack CSS pipeline
 * ```
 */
export default class SilkWebpackPlugin {
  private options: SilkWebpackPluginOptions;
  private virtualModules: VirtualModulesPlugin | null = null;
  private generatedCSS: string = '';

  constructor(options: SilkWebpackPluginOptions = {}) {
    this.options = {
      srcDir: './src',
      virtualModuleId: 'silk.css',
      debug: false,
      ...options
    };
    console.log('[Silk] Plugin constructed with options:', this.options);
  }

  apply(compiler: Compiler): void {
    console.log('[Silk] Plugin apply() called');
    const {
      srcDir,
      virtualModuleId,
      debug,
      ...generateOptions
    } = this.options;

    const virtualModulePath = `node_modules/${virtualModuleId}`;
    const isProduction = compiler.options.mode === 'production';

    console.log(`[Silk] virtualModulePath: ${virtualModulePath}`);
    if (debug) {
      console.log(`[Silk] Mode: ${isProduction ? 'production' : 'development'}`);
      console.log(`[Silk] Scanning: ${srcDir}`);
    }

    // Create virtual modules plugin and write initial placeholder
    this.virtualModules = new VirtualModulesPlugin({
      [virtualModulePath]: '/* Silk CSS - generating... */'
    });
    this.virtualModules.apply(compiler);

    // Generate CSS before compilation starts
    compiler.hooks.beforeCompile.tapPromise('SilkWebpackPlugin', async () => {
      try {
        if (debug) {
          console.log('[Silk] Generating CSS...');
        }

        this.generatedCSS = await scanAndGenerate(srcDir!, {
          ...generateOptions,
          minify: generateOptions.minify ?? isProduction,
          debug
        });

        // Write virtual module
        this.virtualModules!.writeModule(virtualModulePath, this.generatedCSS);

        if (debug) {
          console.log(`[Silk] Generated ${this.generatedCSS.length} bytes of CSS`);
          console.log(`[Silk] Virtual module: ${virtualModulePath}`);
        }
      } catch (error) {
        console.error('[Silk] CSS generation failed:', error);
        this.generatedCSS = '/* Silk CSS generation failed */';
        this.virtualModules!.writeModule(virtualModulePath, this.generatedCSS);
      }
    });

    // Watch mode: regenerate on file changes
    compiler.hooks.watchRun.tapPromise('SilkWebpackPlugin', async (compiler) => {
      const changedFiles = compiler.modifiedFiles;
      if (!changedFiles || changedFiles.size === 0) return;

      // Check if any changed files are in srcDir and match our patterns
      const relevantChanges = Array.from(changedFiles).some(file =>
        file.includes(srcDir!) && /\.[jt]sx?$/.test(file)
      );

      if (relevantChanges) {
        if (debug) {
          console.log('[Silk] Source files changed, regenerating CSS...');
        }

        try {
          this.generatedCSS = await scanAndGenerate(srcDir!, {
            ...generateOptions,
            minify: false, // Don't minify in watch mode
            debug
          });

          this.virtualModules!.writeModule(virtualModulePath, this.generatedCSS);

          if (debug) {
            console.log(`[Silk] Regenerated ${this.generatedCSS.length} bytes of CSS`);
          }
        } catch (error) {
          console.error('[Silk] CSS regeneration failed:', error);
        }
      }
    });

    // Production build summary
    if (isProduction) {
      compiler.hooks.done.tap('SilkWebpackPlugin', (stats) => {
        if (this.generatedCSS.length > 0 && !debug) {
          console.log(`\n📦 Silk CSS: ${this.generatedCSS.length} bytes generated\n`);
        }
      });
    }
  }
}

// Named export
export { SilkWebpackPlugin };
