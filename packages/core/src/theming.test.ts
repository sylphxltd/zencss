/**
 * Tests for theming system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  resolveSemanticToken,
  flattenSemanticTokens,
  generateCSSVariables,
  generateCSSVariableStylesheet,
  ThemeController,
  createTheme,
} from './theming'
import { extendedDefaultConfig } from './config-extended'
import type { SemanticTokenValue, SemanticTokens } from './types-extended'

describe('Theming - Semantic Tokens', () => {
  describe('resolveSemanticToken', () => {
    it('should return string value as-is', () => {
      const result = resolveSemanticToken('#ffffff', 'light')
      expect(result).toBe('#ffffff')
    })

    it('should resolve light mode value', () => {
      const token: SemanticTokenValue = {
        light: '#ffffff',
        dark: '#000000',
      }
      const result = resolveSemanticToken(token, 'light')
      expect(result).toBe('#ffffff')
    })

    it('should resolve dark mode value', () => {
      const token: SemanticTokenValue = {
        light: '#ffffff',
        dark: '#000000',
      }
      const result = resolveSemanticToken(token, 'dark')
      expect(result).toBe('#000000')
    })

    it('should fallback to DEFAULT when mode not found', () => {
      const token: SemanticTokenValue = {
        DEFAULT: '#cccccc',
      }
      const result = resolveSemanticToken(token, 'light')
      expect(result).toBe('#cccccc')
    })

    it('should return empty string when no value found', () => {
      const token: SemanticTokenValue = {}
      const result = resolveSemanticToken(token, 'light')
      expect(result).toBe('')
    })

    it('should prioritize mode-specific value over DEFAULT', () => {
      const token: SemanticTokenValue = {
        light: '#ffffff',
        DEFAULT: '#cccccc',
      }
      const result = resolveSemanticToken(token, 'light')
      expect(result).toBe('#ffffff')
    })
  })

  describe('flattenSemanticTokens', () => {
    it('should flatten simple tokens', () => {
      const tokens: SemanticTokens = {
        colors: {
          primary: {
            light: '#0066cc',
            dark: '#66aaff',
          },
        },
      }

      const result = flattenSemanticTokens(tokens, 'light')

      expect(result).toEqual({
        'colors-primary': '#0066cc',
      })
    })

    it('should flatten nested tokens', () => {
      const tokens: SemanticTokens = {
        colors: {
          bg: {
            primary: {
              light: '#ffffff',
              dark: '#000000',
            },
            secondary: {
              light: '#f5f5f5',
              dark: '#1a1a1a',
            },
          },
        },
      }

      const result = flattenSemanticTokens(tokens, 'light')

      expect(result).toEqual({
        'colors-bg-primary': '#ffffff',
        'colors-bg-secondary': '#f5f5f5',
      })
    })

    it('should handle dark mode', () => {
      const tokens: SemanticTokens = {
        colors: {
          text: {
            light: '#000000',
            dark: '#ffffff',
          },
        },
      }

      const lightResult = flattenSemanticTokens(tokens, 'light')
      const darkResult = flattenSemanticTokens(tokens, 'dark')

      expect(lightResult['colors-text']).toBe('#000000')
      expect(darkResult['colors-text']).toBe('#ffffff')
    })

    it('should add prefix when provided', () => {
      const tokens: SemanticTokens = {
        colors: {
          primary: {
            light: '#0066cc',
            dark: '#66aaff',
          },
        },
      }

      const result = flattenSemanticTokens(tokens, 'light', 'semantic')

      expect(result).toEqual({
        'semantic-colors-primary': '#0066cc',
      })
    })

    it('should handle DEFAULT values', () => {
      const tokens: SemanticTokens = {
        spacing: {
          base: {
            DEFAULT: '16px',
          },
        },
      }

      const result = flattenSemanticTokens(tokens, 'light')

      expect(result['spacing-base']).toBe('16px')
    })
  })

  describe('generateCSSVariables', () => {
    it('should generate CSS variables from config', () => {
      const config = {
        colors: {
          red: {
            500: '#ef4444',
          },
        },
        spacing: {
          4: '1rem',
        },
      }

      const variables = generateCSSVariables(config, { includeSemanticTokens: false })

      expect(variables['--silk-colors-red-500']).toBe('#ef4444')
      expect(variables['--silk-spacing-4']).toBe('1rem')
    })

    it('should use custom prefix', () => {
      const config = {
        colors: {
          blue: {
            500: '#3b82f6',
          },
        },
      }

      const variables = generateCSSVariables(config, {
        prefix: 'custom',
        includeSemanticTokens: false,
      })

      expect(variables['--custom-colors-blue-500']).toBe('#3b82f6')
    })

    it('should include semantic tokens', () => {
      const config = {
        colors: {
          red: {
            500: '#ef4444',
          },
        },
        semanticTokens: {
          colors: {
            primary: {
              light: '#0066cc',
              dark: '#66aaff',
            },
          },
        },
      }

      const variables = generateCSSVariables(config, {
        mode: 'light',
        includeSemanticTokens: true,
      })

      expect(variables['--silk-colors-red-500']).toBe('#ef4444')
      expect(variables['--silk-semantic-colors-primary']).toBe('#0066cc')
    })

    it('should handle flat tokens', () => {
      const config = {
        fontWeights: {
          normal: '400',
          bold: '700',
        },
      }

      const variables = generateCSSVariables(config, { includeSemanticTokens: false })

      expect(variables['--silk-fontWeights-normal']).toBe('400')
      expect(variables['--silk-fontWeights-bold']).toBe('700')
    })

    it('should resolve semantic tokens based on mode', () => {
      const config = {
        semanticTokens: {
          colors: {
            bg: {
              light: '#ffffff',
              dark: '#000000',
            },
          },
        },
      }

      const lightVars = generateCSSVariables(config, { mode: 'light' })
      const darkVars = generateCSSVariables(config, { mode: 'dark' })

      expect(lightVars['--silk-semantic-colors-bg']).toBe('#ffffff')
      expect(darkVars['--silk-semantic-colors-bg']).toBe('#000000')
    })
  })

  describe('generateCSSVariableStylesheet', () => {
    it('should generate stylesheet for light and dark modes', () => {
      const config = {
        colors: {
          primary: {
            500: '#0066cc',
          },
        },
        semanticTokens: {
          colors: {
            bg: {
              light: '#ffffff',
              dark: '#000000',
            },
          },
        },
      }

      const stylesheet = generateCSSVariableStylesheet(config)

      expect(stylesheet).toContain(':root {')
      expect(stylesheet).toContain('--silk-colors-primary-500: #0066cc;')
      expect(stylesheet).toContain('--silk-semantic-colors-bg: #ffffff;')
      expect(stylesheet).toContain(':root[data-theme="dark"]')
      expect(stylesheet).toContain('--silk-semantic-colors-bg: #000000;')
    })

    it('should use custom selector', () => {
      const config = {
        colors: {
          blue: {
            500: '#3b82f6',
          },
        },
      }

      const stylesheet = generateCSSVariableStylesheet(config, {
        selector: '.app',
      })

      expect(stylesheet).toContain('.app {')
      expect(stylesheet).toContain('.app[data-theme="dark"]')
    })

    it('should use custom prefix', () => {
      const config = {
        colors: {
          red: {
            500: '#ef4444',
          },
        },
      }

      const stylesheet = generateCSSVariableStylesheet(config, {
        prefix: 'my',
      })

      expect(stylesheet).toContain('--my-colors-red-500: #ef4444;')
    })

    it('should generate for specific modes only', () => {
      const config = {
        colors: {
          blue: {
            500: '#3b82f6',
          },
        },
      }

      const stylesheet = generateCSSVariableStylesheet(config, {
        modes: ['light'],
      })

      expect(stylesheet).toContain(':root {')
      expect(stylesheet).not.toContain('[data-theme="dark"]')
    })
  })
})

describe('ThemeController', () => {
  // Mock document in tests
  beforeEach(() => {
    // Create mock document if it doesn't exist
    if (typeof document === 'undefined') {
      global.document = {
        documentElement: {
          setAttribute: vi.fn(),
          classList: {
            remove: vi.fn(),
            add: vi.fn(),
          },
        },
      } as any
    }
  })

  describe('constructor', () => {
    it('should initialize with light mode by default', () => {
      const controller = new ThemeController()
      expect(controller.getMode()).toBe('light')
    })

    it('should initialize with custom mode', () => {
      const controller = new ThemeController('dark')
      expect(controller.getMode()).toBe('dark')
    })

    it('should apply theme on initialization in browser', () => {
      const controller = new ThemeController('dark')
      expect(controller.getMode()).toBe('dark')
    })
  })

  describe('getMode', () => {
    it('should return current mode', () => {
      const controller = new ThemeController('light')
      expect(controller.getMode()).toBe('light')
    })
  })

  describe('setMode', () => {
    it('should change mode', () => {
      const controller = new ThemeController('light')
      controller.setMode('dark')
      expect(controller.getMode()).toBe('dark')
    })

    it('should notify listeners', () => {
      const controller = new ThemeController('light')
      const listener = vi.fn()
      controller.subscribe(listener)

      controller.setMode('dark')

      expect(listener).toHaveBeenCalledWith('dark')
    })
  })

  describe('toggle', () => {
    it('should toggle from light to dark', () => {
      const controller = new ThemeController('light')
      controller.toggle()
      expect(controller.getMode()).toBe('dark')
    })

    it('should toggle from dark to light', () => {
      const controller = new ThemeController('dark')
      controller.toggle()
      expect(controller.getMode()).toBe('light')
    })

    it('should notify listeners', () => {
      const controller = new ThemeController('light')
      const listener = vi.fn()
      controller.subscribe(listener)

      controller.toggle()

      expect(listener).toHaveBeenCalledWith('dark')
    })
  })

  describe('subscribe', () => {
    it('should add listener', () => {
      const controller = new ThemeController('light')
      const listener = vi.fn()

      controller.subscribe(listener)
      controller.setMode('dark')

      expect(listener).toHaveBeenCalled()
    })

    it('should return unsubscribe function', () => {
      const controller = new ThemeController('light')
      const listener = vi.fn()

      const unsubscribe = controller.subscribe(listener)
      unsubscribe()

      controller.setMode('dark')

      expect(listener).not.toHaveBeenCalled()
    })

    it('should notify multiple listeners', () => {
      const controller = new ThemeController('light')
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      controller.subscribe(listener1)
      controller.subscribe(listener2)
      controller.setMode('dark')

      expect(listener1).toHaveBeenCalledWith('dark')
      expect(listener2).toHaveBeenCalledWith('dark')
    })
  })

  describe('createTheme', () => {
    it('should create theme controller', () => {
      const theme = createTheme()
      expect(theme).toBeInstanceOf(ThemeController)
      expect(theme.getMode()).toBe('light')
    })

    it('should create with initial mode', () => {
      const theme = createTheme('dark')
      expect(theme.getMode()).toBe('dark')
    })
  })
})

describe('Integration - Theming with Config', () => {
  it('should work with extended default config', () => {
    const variables = generateCSSVariables(extendedDefaultConfig, {
      mode: 'light',
    })

    // Should have regular tokens
    expect(variables['--silk-colors-red-500']).toBeDefined()

    // Should have semantic tokens (nested structure creates path like bg-DEFAULT)
    const semanticKeys = Object.keys(variables).filter((k) => k.includes('semantic'))
    expect(semanticKeys.length).toBeGreaterThan(0)
  })

  it('should generate different values for light and dark modes', () => {
    const lightVars = generateCSSVariables(extendedDefaultConfig, {
      mode: 'light',
    })
    const darkVars = generateCSSVariables(extendedDefaultConfig, {
      mode: 'dark',
    })

    // Semantic tokens should differ between modes
    const lightSemanticKeys = Object.keys(lightVars).filter((k) => k.includes('semantic'))
    const darkSemanticKeys = Object.keys(darkVars).filter((k) => k.includes('semantic'))

    expect(lightSemanticKeys.length).toBeGreaterThan(0)
    expect(darkSemanticKeys.length).toBeGreaterThan(0)

    // At least one semantic token should have different values
    let hasDifference = false
    for (const key of lightSemanticKeys) {
      if (lightVars[key] !== darkVars[key]) {
        hasDifference = true
        break
      }
    }
    expect(hasDifference).toBe(true)
  })

  it('should generate complete stylesheet', () => {
    const stylesheet = generateCSSVariableStylesheet(extendedDefaultConfig)

    expect(stylesheet).toContain(':root {')
    expect(stylesheet).toContain('[data-theme="dark"]')
    expect(stylesheet).toContain('--silk-colors-')
    expect(stylesheet).toContain('--silk-semantic-')
  })
})
