/**
 * Tests for animations and keyframes
 */

import { describe, it, expect } from 'vitest'
import {
  generateKeyframes,
  generateAllKeyframes,
  defaultKeyframes,
  defaultAnimations,
} from './animations'

describe('Animations', () => {
  describe('generateKeyframes', () => {
    it('should generate keyframes CSS', () => {
      const keyframe = {
        from: { opacity: '0' },
        to: { opacity: '1' },
      }

      const css = generateKeyframes('fadeIn', keyframe)

      expect(css).toContain('@keyframes fadeIn {')
      expect(css).toContain('from {')
      expect(css).toContain('opacity: 0;')
      expect(css).toContain('to {')
      expect(css).toContain('opacity: 1;')
    })

    it('should handle percentage keyframes', () => {
      const keyframe = {
        '0%': { transform: 'translateX(0)' },
        '50%': { transform: 'translateX(50%)' },
        '100%': { transform: 'translateX(100%)' },
      }

      const css = generateKeyframes('slide', keyframe)

      expect(css).toContain('0% {')
      expect(css).toContain('50% {')
      expect(css).toContain('100% {')
      expect(css).toContain('transform: translateX(0);')
      expect(css).toContain('transform: translateX(50%);')
      expect(css).toContain('transform: translateX(100%);')
    })

    it('should convert camelCase to kebab-case', () => {
      const keyframe = {
        from: { backgroundColor: 'red' },
        to: { backgroundColor: 'blue' },
      }

      const css = generateKeyframes('colorChange', keyframe)

      expect(css).toContain('background-color: red;')
      expect(css).toContain('background-color: blue;')
    })

    it('should handle multiple properties per step', () => {
      const keyframe = {
        from: {
          opacity: '0',
          transform: 'scale(0.8)',
        },
        to: {
          opacity: '1',
          transform: 'scale(1)',
        },
      }

      const css = generateKeyframes('scaleIn', keyframe)

      expect(css).toContain('opacity: 0;')
      expect(css).toContain('transform: scale(0.8);')
      expect(css).toContain('opacity: 1;')
      expect(css).toContain('transform: scale(1);')
    })

    it('should handle numeric values', () => {
      const keyframe = {
        from: { opacity: 0 },
        to: { opacity: 1 },
      }

      const css = generateKeyframes('fade', keyframe)

      expect(css).toContain('opacity: 0;')
      expect(css).toContain('opacity: 1;')
    })

    it('should properly format output', () => {
      const keyframe = {
        from: { opacity: '0' },
        to: { opacity: '1' },
      }

      const css = generateKeyframes('test', keyframe)

      expect(css).toMatch(/@keyframes test \{/)
      expect(css).toMatch(/\}/)
      // Should have proper structure
      expect(css).toContain('from {')
      expect(css).toContain('opacity: 0;')
    })
  })

  describe('generateAllKeyframes', () => {
    it('should generate CSS for all keyframes', () => {
      const keyframes = {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      }

      const css = generateAllKeyframes(keyframes)

      expect(css).toContain('@keyframes fadeIn {')
      expect(css).toContain('@keyframes slideIn {')
      expect(css).toContain('opacity: 0;')
      expect(css).toContain('transform: translateX(-100%);')
    })

    it('should return empty string for empty keyframes', () => {
      const css = generateAllKeyframes({})
      expect(css).toBe('')
    })

    it('should join multiple keyframes with newlines', () => {
      const keyframes = {
        one: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        two: {
          from: { transform: 'scale(0)' },
          to: { transform: 'scale(1)' },
        },
      }

      const css = generateAllKeyframes(keyframes)

      // Should have two separate @keyframes blocks
      const matches = css.match(/@keyframes/g)
      expect(matches).toHaveLength(2)

      // Should be separated by newlines
      expect(css).toContain('\n\n')
    })
  })

  describe('defaultKeyframes', () => {
    it('should include common animation keyframes', () => {
      expect(defaultKeyframes).toHaveProperty('spin')
      expect(defaultKeyframes).toHaveProperty('fadeIn')
      expect(defaultKeyframes).toHaveProperty('fadeOut')
      expect(defaultKeyframes).toHaveProperty('slideInUp')
      expect(defaultKeyframes).toHaveProperty('slideInDown')
      expect(defaultKeyframes).toHaveProperty('slideInLeft')
      expect(defaultKeyframes).toHaveProperty('slideInRight')
    })

    it('should have valid keyframe structure', () => {
      // Check spin animation
      expect(defaultKeyframes.spin).toHaveProperty('from')
      expect(defaultKeyframes.spin).toHaveProperty('to')
      expect(defaultKeyframes.spin.from).toHaveProperty('transform')

      // Check fadeIn animation
      expect(defaultKeyframes.fadeIn).toHaveProperty('from')
      expect(defaultKeyframes.fadeIn).toHaveProperty('to')
      expect(defaultKeyframes.fadeIn.from).toHaveProperty('opacity')
    })

    it('should generate valid CSS', () => {
      const css = generateAllKeyframes(defaultKeyframes)

      // Should not throw and should contain keyframes
      expect(css).toContain('@keyframes')
      expect(css.length).toBeGreaterThan(0)
    })
  })

  describe('defaultAnimations', () => {
    it('should include common animations', () => {
      expect(defaultAnimations).toHaveProperty('spin')
      expect(defaultAnimations).toHaveProperty('fadeIn')
      expect(defaultAnimations).toHaveProperty('fadeOut')
      expect(defaultAnimations).toHaveProperty('slideInUp')
      expect(defaultAnimations).toHaveProperty('pulse')
      expect(defaultAnimations).toHaveProperty('bounce')
    })

    it('should have valid animation values', () => {
      // Check structure: "keyframeName duration timing-function [iteration-count]"
      expect(defaultAnimations.spin).toMatch(/spin.*linear.*infinite/)
      expect(defaultAnimations.fadeIn).toMatch(/fadeIn.*ease-in/)
      expect(defaultAnimations.pulse).toMatch(/pulse.*cubic-bezier.*infinite/)
    })

    it('should reference existing keyframes', () => {
      // All animations should reference keyframes that exist
      const animationKeys = Object.keys(defaultAnimations)

      for (const key of animationKeys) {
        const animation = defaultAnimations[key]
        const keyframeName = animation.split(' ')[0] // First word is keyframe name

        expect(defaultKeyframes).toHaveProperty(keyframeName)
      }
    })
  })

  describe('Integration - Keyframes with CSS Generation', () => {
    it('should generate complete animation CSS', () => {
      const allKeyframes = {
        ...defaultKeyframes,
        customAnimation: {
          from: { opacity: '0', transform: 'scale(0)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      }

      const css = generateAllKeyframes(allKeyframes)

      // Should include all default animations
      expect(css).toContain('@keyframes spin')
      expect(css).toContain('@keyframes fadeIn')

      // Should include custom animation
      expect(css).toContain('@keyframes customAnimation')
    })

    it('should handle complex multi-step animations', () => {
      const keyframe = {
        '0%': {
          opacity: '0',
          transform: 'scale(0.8) translateY(-20px)',
        },
        '50%': {
          opacity: '1',
          transform: 'scale(1.1) translateY(0)',
        },
        '100%': {
          opacity: '1',
          transform: 'scale(1) translateY(0)',
        },
      }

      const css = generateKeyframes('complexEnter', keyframe)

      expect(css).toContain('0% {')
      expect(css).toContain('50% {')
      expect(css).toContain('100% {')
      expect(css).toContain('opacity: 0;')
      expect(css).toContain('transform: scale(0.8) translateY(-20px);')
      expect(css).toContain('transform: scale(1.1) translateY(0);')
      expect(css).toContain('transform: scale(1) translateY(0);')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty keyframe steps', () => {
      const keyframe = {
        from: {},
        to: { opacity: '1' },
      }

      const css = generateKeyframes('partial', keyframe)

      expect(css).toContain('from {')
      expect(css).toContain('to {')
      expect(css).toContain('opacity: 1;')
    })

    it('should handle special characters in animation names', () => {
      const css = generateKeyframes('fade-in-up', {
        from: { opacity: '0' },
        to: { opacity: '1' },
      })

      expect(css).toContain('@keyframes fade-in-up {')
    })

    it('should handle transforms with complex values', () => {
      const keyframe = {
        from: { transform: 'translateX(-100%) rotate(0deg) scale(1)' },
        to: { transform: 'translateX(0) rotate(360deg) scale(1.2)' },
      }

      const css = generateKeyframes('complexTransform', keyframe)

      expect(css).toContain('transform: translateX(-100%) rotate(0deg) scale(1);')
      expect(css).toContain('transform: translateX(0) rotate(360deg) scale(1.2);')
    })

    it('should handle colors in various formats', () => {
      const keyframe = {
        '0%': { color: '#ff0000' },
        '33%': { color: 'rgb(0, 255, 0)' },
        '66%': { color: 'hsl(240, 100%, 50%)' },
        '100%': { color: 'blue' },
      }

      const css = generateKeyframes('colorCycle', keyframe)

      expect(css).toContain('color: #ff0000;')
      expect(css).toContain('color: rgb(0, 255, 0);')
      expect(css).toContain('color: hsl(240, 100%, 50%);')
      expect(css).toContain('color: blue;')
    })
  })

  describe('Performance', () => {
    it('should handle large number of keyframes efficiently', () => {
      const largeKeyframes: Record<string, Record<string, Record<string, string>>> = {}

      // Generate 100 keyframes
      for (let i = 0; i < 100; i++) {
        largeKeyframes[`animation${i}`] = {
          from: { opacity: '0' },
          to: { opacity: '1' },
        }
      }

      const startTime = performance.now()
      const css = generateAllKeyframes(largeKeyframes)
      const endTime = performance.now()

      expect(css).toContain('@keyframes')
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
    })

    it('should handle complex keyframes with many steps', () => {
      const complexKeyframe: Record<string, Record<string, string>> = {}

      // Generate keyframe with 20 steps
      for (let i = 0; i <= 100; i += 5) {
        complexKeyframe[`${i}%`] = {
          opacity: String(i / 100),
          transform: `translateX(${i}px)`,
        }
      }

      const css = generateKeyframes('complexProgress', complexKeyframe)

      expect(css).toContain('@keyframes complexProgress')
      expect(css).toContain('0% {')
      expect(css).toContain('100% {')
    })
  })
})
