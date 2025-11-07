/**
 * CSS Selector optimization utilities
 * Includes :where() for zero specificity
 */

export interface SelectorConfig {
  /**
   * Wrap selectors in :where() for zero specificity
   * @default true
   */
  useWhere?: boolean

  /**
   * Prefix for generated class names
   * @default 'silk'
   */
  prefix?: string

  /**
   * Use shorter class names in production
   * @default false
   */
  minifyClassNames?: boolean
}

export const defaultSelectorConfig: Required<SelectorConfig> = {
  useWhere: true,
  prefix: 'silk',
  minifyClassNames: false,
}

/**
 * Wrap a selector in :where() for zero specificity
 */
export function wrapInWhere(selector: string, enabled = true): string {
  if (!enabled || !selector) {
    return selector
  }

  // Already wrapped
  if (selector.startsWith(':where(')) {
    return selector
  }

  // Don't wrap pseudo-selectors, @-rules, or keyframes
  if (
    selector.startsWith(':') ||
    selector.startsWith('@') ||
    selector.includes('@keyframes') ||
    selector.includes('@media') ||
    selector.includes('@container')
  ) {
    return selector
  }

  return `:where(${selector})`
}

/**
 * Generate optimized selector
 */
export function generateSelector(
  className: string,
  config: SelectorConfig = {},
  pseudo?: string
): string {
  const { useWhere } = { ...defaultSelectorConfig, ...config }

  let selector = `.${className}`

  // Add pseudo selector if provided
  if (pseudo) {
    selector = `${selector}${pseudo}`
  }

  // Wrap in :where() for zero specificity
  if (useWhere && !pseudo) {
    // Only wrap base selector, not with pseudo
    selector = wrapInWhere(selector, true)
  }

  return selector
}

/**
 * Calculate CSS specificity
 * Returns [inline, ids, classes, elements]
 */
export function calculateSpecificity(selector: string): [number, number, number, number] {
  // :where() has zero specificity
  if (selector.includes(':where(')) {
    return [0, 0, 0, 0]
  }

  let ids = 0
  let classes = 0
  let elements = 0

  // Count IDs
  ids = (selector.match(/#[\w-]+/g) || []).length

  // Count classes, attributes, pseudo-classes
  const classMatches =
    (selector.match(/\.[\w-]+/g) || []).length +
    (selector.match(/\[[\w-]+.*?\]/g) || []).length +
    (selector.match(/:(?!where|is|not|has)[a-z-]+/g) || []).length

  classes = classMatches

  // Count elements and pseudo-elements
  const elementMatches =
    (selector.match(/(?:^|[\s>+~])([a-z][\w-]*)/gi) || []).length +
    (selector.match(/::?[a-z-]+/g) || []).length

  elements = elementMatches

  return [0, ids, classes, elements]
}

/**
 * Compare specificity of two selectors
 * Returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareSpecificity(a: string, b: string): -1 | 0 | 1 {
  const specA = calculateSpecificity(a)
  const specB = calculateSpecificity(b)

  for (let i = 0; i < 4; i++) {
    const a = specA[i]
    const b = specB[i]
    if (a !== undefined && b !== undefined) {
      if (a > b) return 1
      if (a < b) return -1
    }
  }

  return 0
}

/**
 * Optimize selector for performance and maintainability
 */
export function optimizeSelector(selector: string, config: SelectorConfig = {}): string {
  const { useWhere } = { ...defaultSelectorConfig, ...config }

  // Remove redundant spaces
  let optimized = selector.replace(/\s+/g, ' ').trim()

  // Remove redundant universal selector
  optimized = optimized.replace(/\*\./, '.')

  // Simplify attribute selectors
  optimized = optimized.replace(/\[class~="([\w-]+)"\]/g, '.$1')

  // Apply :where() if enabled
  if (useWhere && !optimized.startsWith(':where(')) {
    optimized = wrapInWhere(optimized, true)
  }

  return optimized
}

/**
 * Extract class names from selector
 */
export function extractClassNames(selector: string): string[] {
  const matches = selector.match(/\.[\w-]+/g) || []
  return matches.map((m) => m.slice(1))
}

/**
 * Check if selector has pseudo-class or pseudo-element
 */
export function hasPseudo(selector: string): boolean {
  return /::?[\w-]+/.test(selector)
}

/**
 * Minify class name (for production builds)
 */
export function minifyClassName(className: string, index: number): string {
  // Convert index to base-36 for shorter names
  return `z${index.toString(36)}`
}

/**
 * Class name generator with optional minification
 */
export class ClassNameGenerator {
  private counter = 0
  private map = new Map<string, string>()
  private config: Required<SelectorConfig>

  constructor(config: SelectorConfig = {}) {
    this.config = { ...defaultSelectorConfig, ...config }
  }

  /**
   * Generate a unique class name
   */
  generate(key: string): string {
    // Return cached if exists
    if (this.map.has(key)) {
      return this.map.get(key)!
    }

    let className: string

    if (this.config.minifyClassNames) {
      // Minified: z0, z1, ..., zz, z10, z11
      className = minifyClassName(key, this.counter++)
    } else {
      // Human-readable: silk-abc123
      className = `${this.config.prefix}-${this.hash(key)}`
    }

    this.map.set(key, className)
    return className
  }

  /**
   * Simple hash function for class names
   */
  private hash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Reset generator
   */
  reset(): void {
    this.counter = 0
    this.map.clear()
  }

  /**
   * Get all generated class names
   */
  getAll(): Map<string, string> {
    return new Map(this.map)
  }
}
