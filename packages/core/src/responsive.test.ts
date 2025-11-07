/**
 * Tests for responsive breakpoints and container queries
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateMediaQuery,
  generateContainerQuery,
  processResponsiveStyles,
  generateResponsiveCSS,
  processContainerQueries,
  generateContainerQueryCSS,
} from './responsive'
import type { DesignConfig } from './types'

describe('Responsive Breakpoints', () => {
  const config: DesignConfig = {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  }

  describe('generateMediaQuery', () => {
    it('should generate min-width media query by default', () => {
      const query = generateMediaQuery('768px')
      expect(query).toBe('@media (min-width: 768px)')
    })

    it('should generate max-width media query', () => {
      const query = generateMediaQuery('768px', 'max')
      expect(query).toBe('@media (max-width: 768px)')
    })

    it('should handle different units', () => {
      expect(generateMediaQuery('48rem')).toBe('@media (min-width: 48rem)')
      expect(generateMediaQuery('1024px')).toBe('@media (min-width: 1024px)')
    })
  })

  describe('processResponsiveStyles', () => {
    it('should separate base and responsive styles', () => {
      const styles = {
        fontSize: '16px',
        color: 'red',
        sm: { fontSize: '18px' },
        md: { fontSize: '20px' },
      }

      const result = processResponsiveStyles(styles, config.breakpoints)

      expect(result.base).toEqual({
        fontSize: '16px',
        color: 'red',
      })

      expect(result.responsive).toEqual({
        sm: { fontSize: '18px' },
        md: { fontSize: '20px' },
      })
    })

    it('should handle styles without responsive props', () => {
      const styles = {
        fontSize: '16px',
        color: 'red',
      }

      const result = processResponsiveStyles(styles, config.breakpoints)

      expect(result.base).toEqual(styles)
      expect(result.responsive).toEqual({})
    })

    it('should ignore undefined breakpoints', () => {
      const styles = {
        fontSize: '16px',
        sm: { fontSize: '18px' },
        unknownBreakpoint: { fontSize: '24px' },
      }

      const result = processResponsiveStyles(styles, config.breakpoints)

      expect(result.responsive).toEqual({
        sm: { fontSize: '18px' },
      })
      expect(result.base.unknownBreakpoint).toEqual({ fontSize: '24px' })
    })

    it('should handle nested pseudo selectors in responsive styles', () => {
      const styles = {
        color: 'blue',
        sm: {
          color: 'red',
          _hover: { color: 'green' },
        },
      }

      const result = processResponsiveStyles(styles, config.breakpoints)

      expect(result.responsive.sm).toEqual({
        color: 'red',
        _hover: { color: 'green' },
      })
    })
  })

  describe('generateResponsiveCSS', () => {
    const getCSSValue = (prop: string, value: string | number) => {
      if (typeof value === 'number') return `${value}px`
      return value
    }

    it('should generate media query rules', () => {
      const responsive = {
        sm: { fontSize: '18px' },
        md: { fontSize: '20px' },
      }

      const rules = generateResponsiveCSS('.test', responsive, config.breakpoints!, getCSSValue)

      expect(rules).toHaveLength(2)
      expect(rules[0]).toContain('@media (min-width: 640px)')
      expect(rules[0]).toContain('font-size: 18px')
      expect(rules[1]).toContain('@media (min-width: 768px)')
      expect(rules[1]).toContain('font-size: 20px')
    })

    it('should handle multiple properties per breakpoint', () => {
      const responsive = {
        sm: {
          fontSize: '18px',
          color: 'red',
          padding: '16px',
        },
      }

      const rules = generateResponsiveCSS('.test', responsive, config.breakpoints!, getCSSValue)

      expect(rules).toHaveLength(1)
      expect(rules[0]).toContain('font-size: 18px')
      expect(rules[0]).toContain('color: red')
      expect(rules[0]).toContain('padding: 16px')
    })

    it('should convert camelCase to kebab-case', () => {
      const responsive = {
        sm: { backgroundColor: 'blue' },
      }

      const rules = generateResponsiveCSS('.test', responsive, config.breakpoints!, getCSSValue)

      expect(rules[0]).toContain('background-color: blue')
    })

    it('should return empty array when no responsive styles', () => {
      const rules = generateResponsiveCSS('.test', {}, config.breakpoints!, getCSSValue)

      expect(rules).toEqual([])
    })
  })
})

describe('Container Queries', () => {
  const config = {
    containers: {
      sm: '384px',
      md: '448px',
      lg: '512px',
    },
  }

  describe('generateContainerQuery', () => {
    it('should generate container query', () => {
      const query = generateContainerQuery('384px')
      expect(query).toBe('@container (min-width: 384px)')
    })

    it('should handle different units', () => {
      expect(generateContainerQuery('24rem')).toBe('@container (min-width: 24rem)')
      expect(generateContainerQuery('512px')).toBe('@container (min-width: 512px)')
    })
  })

  describe('processContainerQueries', () => {
    it('should separate container query styles from base', () => {
      const styles = {
        padding: '8px',
        containerType: 'inline-size',
        '@sm': { padding: '16px' },
        '@md': { padding: '24px' },
      }

      const result = processContainerQueries(styles, config.containers)

      expect(result.base).toEqual({
        padding: '8px',
      })
      expect(result.containerType).toBe('inline-size')
      expect(result.container).toEqual({
        sm: { padding: '16px' },
        md: { padding: '24px' },
      })
    })

    it('should handle containerName', () => {
      const styles = {
        containerType: 'inline-size',
        containerName: 'sidebar',
        '@sm': { width: '300px' },
      }

      const result = processContainerQueries(styles, config.containers)

      expect(result.containerName).toBe('sidebar')
      expect(result.containerType).toBe('inline-size')
    })

    it('should ignore unknown container sizes', () => {
      const styles = {
        '@sm': { padding: '16px' },
        '@unknown': { padding: '32px' },
      }

      const result = processContainerQueries(styles, config.containers)

      expect(result.container).toEqual({
        sm: { padding: '16px' },
      })
      expect(result.base['@unknown']).toEqual({ padding: '32px' })
    })

    it('should handle styles without container queries', () => {
      const styles = {
        padding: '8px',
        color: 'red',
      }

      const result = processContainerQueries(styles, config.containers)

      expect(result.base).toEqual(styles)
      expect(result.container).toEqual({})
      expect(result.containerType).toBeUndefined()
      expect(result.containerName).toBeUndefined()
    })
  })

  describe('generateContainerQueryCSS', () => {
    const getCSSValue = (prop: string, value: string | number) => {
      if (typeof value === 'number') return `${value}px`
      return value
    }

    it('should generate container query rules', () => {
      const container = {
        sm: { padding: '16px' },
        md: { padding: '24px' },
      }

      const rules = generateContainerQueryCSS('.test', container, config.containers, getCSSValue)

      expect(rules).toHaveLength(2)
      expect(rules[0]).toContain('@container (min-width: 384px)')
      expect(rules[0]).toContain('padding: 16px')
      expect(rules[1]).toContain('@container (min-width: 448px)')
      expect(rules[1]).toContain('padding: 24px')
    })

    it('should handle multiple properties per container size', () => {
      const container = {
        sm: {
          padding: '16px',
          fontSize: '14px',
          color: 'blue',
        },
      }

      const rules = generateContainerQueryCSS('.test', container, config.containers, getCSSValue)

      expect(rules).toHaveLength(1)
      expect(rules[0]).toContain('padding: 16px')
      expect(rules[0]).toContain('font-size: 14px')
      expect(rules[0]).toContain('color: blue')
    })

    it('should convert camelCase to kebab-case', () => {
      const container = {
        sm: { backgroundColor: 'red' },
      }

      const rules = generateContainerQueryCSS('.test', container, config.containers, getCSSValue)

      expect(rules[0]).toContain('background-color: red')
    })

    it('should return empty array when no container queries', () => {
      const rules = generateContainerQueryCSS('.test', {}, config.containers, getCSSValue)

      expect(rules).toEqual([])
    })
  })
})

describe('Integration Tests', () => {
  it('should handle both responsive and container queries together', () => {
    const config = {
      breakpoints: {
        sm: '640px',
        md: '768px',
      },
      containers: {
        sm: '384px',
        md: '448px',
      },
    }

    const styles = {
      padding: '8px',
      sm: { padding: '12px' },
      md: { padding: '16px' },
      containerType: 'inline-size',
      '@sm': { padding: '20px' },
      '@md': { padding: '24px' },
    }

    const { base, responsive } = processResponsiveStyles(styles, config.breakpoints)
    const { base: finalBase, container } = processContainerQueries(base, config.containers)

    expect(finalBase).toEqual({ padding: '8px' })
    expect(responsive).toEqual({
      sm: { padding: '12px' },
      md: { padding: '16px' },
    })
    expect(container).toEqual({
      sm: { padding: '20px' },
      md: { padding: '24px' },
    })
  })
})
