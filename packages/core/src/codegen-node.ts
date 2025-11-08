/**
 * @sylphx/silk/codegen
 *
 * Node.js-only code generation tools
 * DO NOT import in browser environments
 *
 * This module provides:
 * - File scanning for css() calls
 * - CSS generation from scanned results
 * - Combined scan + generate utilities
 *
 * Used by:
 * - Webpack plugin (virtual modules)
 * - Vite plugin (virtual modules)
 * - CLI tool (silk generate)
 */

// Re-export scan functionality
export {
  scanSourceFiles,
  type ScanResult,
  type ScanOptions
} from './scan.js';

// Re-export codegen functionality
export {
  generateCSS,
  scanAndGenerate,
  type GenerateOptions
} from './codegen.js';
