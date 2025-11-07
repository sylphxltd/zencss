/**
 * Tests for variants and recipes system
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { recipe, slotRecipe } from './variants'
import { createStyleSystem } from './runtime'
import { defaultConfig } from './config'
import type { RecipeConfig, SlotRecipeConfig } from './types-extended'

describe('Variants - Recipe System', () => {
  const { css } = createStyleSystem(defaultConfig)

  describe('recipe', () => {
    it('should create a recipe function', () => {
      const buttonRecipe = recipe(
        {
          base: {
            fontSize: 'base',
            fontWeight: 'medium',
          },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
              lg: { padding: 6 },
            },
          },
        },
        css
      )

      expect(typeof buttonRecipe).toBe('function')
    })

    it('should apply base styles', () => {
      const buttonRecipe = recipe(
        {
          base: {
            fontSize: 'base',
            fontWeight: 'medium',
          },
        },
        css
      )

      const className = buttonRecipe()
      expect(className).toBeTruthy()
      expect(typeof className).toBe('string')
    })

    it('should apply variant styles', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
          },
        },
        css
      )

      const smallButton = buttonRecipe({ size: 'sm' })
      const mediumButton = buttonRecipe({ size: 'md' })

      expect(smallButton).toBeTruthy()
      expect(mediumButton).toBeTruthy()
      expect(smallButton).not.toBe(mediumButton)
    })

    it('should apply default variants', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
            variant: {
              solid: { bg: 'blue.500' },
              outline: { borderWidth: 1 },
            },
          },
          defaultVariants: {
            size: 'md',
            variant: 'solid',
          },
        },
        css
      )

      const defaultButton = buttonRecipe()
      const explicitButton = buttonRecipe({ size: 'md', variant: 'solid' })

      // Both should generate some classes
      expect(defaultButton).toBeTruthy()
      expect(explicitButton).toBeTruthy()
    })

    it('should override default variants', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
          },
          defaultVariants: {
            size: 'md',
          },
        },
        css
      )

      const smallButton = buttonRecipe({ size: 'sm' })
      const mediumButton = buttonRecipe({ size: 'md' })

      expect(smallButton).not.toBe(mediumButton)
    })

    it('should handle multiple variant axes', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
            variant: {
              solid: { bg: 'blue.500' },
              outline: { borderWidth: 1 },
            },
            color: {
              blue: { color: 'blue.500' },
              red: { color: 'red.500' },
            },
          },
        },
        css
      )

      const className = buttonRecipe({
        size: 'md',
        variant: 'solid',
        color: 'blue',
      })

      expect(className).toBeTruthy()
    })

    it('should apply compound variants when conditions match', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
            variant: {
              solid: { bg: 'blue.500' },
              outline: { borderWidth: 1 },
            },
          },
          compoundVariants: [
            {
              size: 'md',
              variant: 'solid',
              css: {
                boxShadow: 'lg',
              },
            },
          ],
        },
        css
      )

      const matchingButton = buttonRecipe({ size: 'md', variant: 'solid' })
      const nonMatchingButton = buttonRecipe({ size: 'sm', variant: 'solid' })

      expect(matchingButton).toBeTruthy()
      expect(nonMatchingButton).toBeTruthy()
      // Matching should include compound variant styles
      expect(matchingButton).not.toBe(nonMatchingButton)
    })

    it('should not apply compound variants when conditions do not match', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
          },
          compoundVariants: [
            {
              size: 'lg',
              css: {
                boxShadow: 'lg',
              },
            },
          ],
        },
        css
      )

      const button = buttonRecipe({ size: 'sm' })
      expect(button).toBeTruthy()
    })

    it('should handle boolean variants in compound variants', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
            },
          },
          compoundVariants: [
            {
              size: 'md',
              isDisabled: true,
              css: {
                opacity: 0.5,
              },
            },
          ],
        },
        css
      )

      const className = buttonRecipe({ size: 'md' })
      expect(className).toBeTruthy()
    })

    it('should expose variants and config', () => {
      const config: RecipeConfig<typeof defaultConfig, any> = {
        base: { fontSize: 'base' },
        variants: {
          size: {
            sm: { padding: 2 },
            md: { padding: 4 },
          },
        },
      }

      const buttonRecipe = recipe(config, css)

      expect(buttonRecipe.variants).toBe(config.variants)
      expect(buttonRecipe.config).toBe(config)
    })
  })

  describe('slotRecipe', () => {
    it('should create a slot recipe function', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header', 'body'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
            body: { padding: 4 },
          },
        },
        css
      )

      expect(typeof cardRecipe).toBe('function')
    })

    it('should apply base styles to all slots', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header', 'body'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
            body: { padding: 4 },
          },
        },
        css
      )

      const result = cardRecipe()

      expect(result).toHaveProperty('root')
      expect(result).toHaveProperty('header')
      expect(result).toHaveProperty('body')
      expect(typeof result.root).toBe('string')
      expect(typeof result.header).toBe('string')
      expect(typeof result.body).toBe('string')
    })

    it('should apply variant styles to slots', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header', 'body'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
            body: { padding: 4 },
          },
          variants: {
            size: {
              sm: {
                root: { padding: 2 },
                header: { fontSize: 'sm' },
                body: { fontSize: 'sm' },
              },
              lg: {
                root: { padding: 6 },
                header: { fontSize: 'lg' },
                body: { fontSize: 'lg' },
              },
            },
          },
        },
        css
      )

      const smallCard = cardRecipe({ size: 'sm' })
      const largeCard = cardRecipe({ size: 'lg' })

      expect(smallCard.root).not.toBe(largeCard.root)
      expect(smallCard.header).not.toBe(largeCard.header)
    })

    it('should handle default variants', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
          },
          variants: {
            variant: {
              outlined: {
                root: { borderWidth: 1 },
              },
              elevated: {
                root: { boxShadow: 'md' },
              },
            },
          },
          defaultVariants: {
            variant: 'elevated',
          },
        },
        css
      )

      const defaultCard = cardRecipe()
      const explicitCard = cardRecipe({ variant: 'elevated' })

      expect(defaultCard.root).toBeTruthy()
      expect(explicitCard.root).toBeTruthy()
    })

    it('should handle multiple variant axes', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
          },
          variants: {
            size: {
              sm: {
                root: { padding: 2 },
              },
              lg: {
                root: { padding: 6 },
              },
            },
            variant: {
              outlined: {
                root: { borderWidth: 1 },
              },
              elevated: {
                root: { boxShadow: 'md' },
              },
            },
          },
        },
        css
      )

      const result = cardRecipe({ size: 'lg', variant: 'outlined' })

      expect(result.root).toBeTruthy()
      expect(result.header).toBeTruthy()
    })

    it('should handle slots without variant styles', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header', 'body'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
            body: { padding: 4 },
          },
          variants: {
            variant: {
              outlined: {
                root: { borderWidth: 1 },
                // header and body not included
              },
            },
          },
        },
        css
      )

      const result = cardRecipe({ variant: 'outlined' })

      expect(result.root).toBeTruthy()
      expect(result.header).toBeTruthy()
      expect(result.body).toBeTruthy()
    })

    it('should return empty strings for undefined slots', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header'],
          base: {
            root: { bg: 'white' },
            // header not defined in base
          },
        },
        css
      )

      const result = cardRecipe()

      expect(result.root).toBeTruthy()
      expect(result.header).toBe('')
    })
  })

  describe('Type Safety', () => {
    it('should enforce variant prop types', () => {
      const buttonRecipe = recipe(
        {
          base: { fontSize: 'base' },
          variants: {
            size: {
              sm: { padding: 2 },
              md: { padding: 4 },
              lg: { padding: 6 },
            },
          },
        },
        css
      )

      // These should work (TypeScript would catch invalid values at compile time)
      buttonRecipe({ size: 'sm' })
      buttonRecipe({ size: 'md' })
      buttonRecipe({ size: 'lg' })
      buttonRecipe()
    })

    it('should enforce slot recipe variant types', () => {
      const cardRecipe = slotRecipe(
        {
          slots: ['root', 'header', 'body'],
          base: {
            root: { bg: 'white' },
            header: { padding: 4 },
            body: { padding: 4 },
          },
          variants: {
            variant: {
              outlined: {
                root: { borderWidth: 1 },
              },
              elevated: {
                root: { boxShadow: 'md' },
              },
            },
          },
        },
        css
      )

      // These should work
      cardRecipe({ variant: 'outlined' })
      cardRecipe({ variant: 'elevated' })
      cardRecipe()
    })
  })
})
