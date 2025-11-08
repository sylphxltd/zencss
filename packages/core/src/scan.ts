/**
 * Scan source files for css() calls and extract CSS rules
 *
 * This module provides functionality to:
 * 1. Glob source files (*.ts, *.tsx, *.js, *.jsx)
 * 2. Parse AST to find css() function calls
 * 3. Extract CSS content from those calls
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Result of scanning a single file
 */
export interface ScanResult {
  /** File path */
  filePath: string;
  /** CSS rules found in this file */
  cssRules: Array<{
    /** CSS content (object form) */
    styles: Record<string, any>;
    /** Source location (for debugging) */
    loc?: { line: number; column: number };
  }>;
}

/**
 * Options for scanning
 */
export interface ScanOptions {
  /** Source directory to scan (default: './src') */
  srcDir?: string;
  /** File patterns to include (default: ['**\/*.{ts,tsx,js,jsx}']) */
  include?: string[];
  /** File patterns to exclude (default: ['**\/node_modules/**', '**\/.next/**', '**\/dist/**']) */
  exclude?: string[];
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Recursively find files matching patterns
 */
function findFiles(
  dir: string,
  include: string[] = ['**/*.{ts,tsx,js,jsx}'],
  exclude: string[] = ['**/node_modules/**', '**/.next/**', '**/dist/**']
): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);

      // Check exclude patterns
      const shouldExclude = exclude.some(pattern => {
        const regex = patternToRegex(pattern);
        return regex.test(relativePath) || regex.test(entry.name);
      });

      if (shouldExclude) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        // Check include patterns
        const shouldInclude = include.some(pattern => {
          const regex = patternToRegex(pattern);
          return regex.test(relativePath) || regex.test(entry.name);
        });

        if (shouldInclude) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Convert glob pattern to regex
 * Simple implementation - supports *, **, and {a,b}
 */
function patternToRegex(pattern: string): RegExp {
  // Handle special patterns with placeholders first
  let regex = pattern
    .replace(/\{([^}]+)\}/g, (_, p1) => `%%GROUP%%${p1.split(',').join('%%OR%%')}%%ENDGROUP%%`)
    // Handle **/ specially (zero or more directories)
    .replace(/\*\*\//g, '%%GLOBSTAR%%')
    .replace(/\*/g, '%%STAR%%')
    // Escape special regex characters (but not our placeholders)
    .replace(/[.+^${}()[\]\\]/g, '\\$&')
    // Restore patterns
    .replace(/%%GROUP%%/g, '(')
    .replace(/%%ENDGROUP%%/g, ')')
    .replace(/%%OR%%/g, '|')
    // **/ matches zero or more directories
    .replace(/%%GLOBSTAR%%/g, '(?:.*\\/)?')
    .replace(/%%STAR%%/g, '[^/]*');

  return new RegExp(`^${regex}$`);
}

/**
 * Simple regex-based CSS extraction
 *
 * This is a simplified approach that uses regex to find css() calls.
 * It's faster than full AST parsing but may miss complex cases.
 *
 * For production, consider using @babel/parser or @swc/core
 */
function extractCssFromFile(filePath: string): ScanResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const cssRules: ScanResult['cssRules'] = [];

  // Match css({ ... }) or css`...`
  // This regex is simplified - real implementation should use AST
  const cssCallRegex = /css\s*\(\s*({[\s\S]*?})\s*\)/g;

  let match;
  while ((match = cssCallRegex.exec(content)) !== null) {
    try {
      // Extract the object literal
      const stylesStr = match[1];

      // HACK: Use eval to parse object literal
      // In production, use proper AST parsing
      // This is unsafe and only works for simple cases
      const styles = new Function(`return ${stylesStr}`)();

      // Calculate line number for debugging
      const beforeMatch = content.slice(0, match.index);
      const line = beforeMatch.split('\n').length;

      cssRules.push({
        styles,
        loc: { line, column: match.index - beforeMatch.lastIndexOf('\n') }
      });
    } catch (err) {
      // Skip invalid CSS calls
      if (process.env.DEBUG) {
        console.warn(`Failed to parse css() call in ${filePath}:`, err);
      }
    }
  }

  return {
    filePath,
    cssRules
  };
}

/**
 * Scan source directory for css() calls
 *
 * @example
 * ```ts
 * const results = scanSourceFiles({ srcDir: './src' });
 * console.log(`Found ${results.length} files with CSS`);
 * ```
 */
export function scanSourceFiles(options: ScanOptions = {}): ScanResult[] {
  const {
    srcDir = './src',
    include = ['**/*.{ts,tsx,js,jsx}'],
    exclude = ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    debug = false
  } = options;

  if (debug) {
    console.log(`Scanning ${srcDir} for CSS...`);
  }

  // Find all matching files
  const files = findFiles(srcDir, include, exclude);

  if (debug) {
    console.log(`Found ${files.length} files to scan`);
  }

  // Extract CSS from each file
  const results = files
    .map(file => extractCssFromFile(file))
    .filter(result => result.cssRules.length > 0);

  if (debug) {
    const totalRules = results.reduce((sum, r) => sum + r.cssRules.length, 0);
    console.log(`Extracted ${totalRules} CSS rules from ${results.length} files`);
  }

  return results;
}

/**
 * TODO: Implement proper AST-based extraction
 *
 * For production quality, we should:
 * 1. Use @babel/parser or @swc/core to parse files
 * 2. Use @babel/traverse or SWC visitor pattern
 * 3. Handle edge cases:
 *    - Nested css() calls
 *    - Spread operators in style objects
 *    - Variable references
 *    - Imported styles
 *
 * Example with @babel/parser:
 *
 * ```ts
 * import { parse } from '@babel/parser';
 * import traverse from '@babel/traverse';
 *
 * const ast = parse(content, {
 *   sourceType: 'module',
 *   plugins: ['typescript', 'jsx']
 * });
 *
 * traverse(ast, {
 *   CallExpression(path) {
 *     if (path.node.callee.name === 'css') {
 *       // Extract styles from arguments
 *     }
 *   }
 * });
 * ```
 */
