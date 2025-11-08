import { describe, it, expect, beforeEach } from 'bun:test'
import {
  CriticalCSSExtractor,
  CriticalCSSMeasurement,
  defaultCriticalCSSConfig,
  type CriticalCSSConfig,
} from './critical-css'

describe('Critical CSS', () => {
  describe('defaultCriticalCSSConfig', () => {
    it('should have correct defaults', () => {
      expect(defaultCriticalCSSConfig.enabled).toBe(false)
      expect(defaultCriticalCSSConfig.viewport).toEqual({ width: 1920, height: 1080 })
      expect(defaultCriticalCSSConfig.inline).toBe(true)
      expect(defaultCriticalCSSConfig.defer).toBe(true)
      expect(defaultCriticalCSSConfig.threshold).toBe(0)
      expect(defaultCriticalCSSConfig.forceInclude).toEqual([])
      expect(defaultCriticalCSSConfig.exclude).toEqual([])
    })
  })

  describe('CriticalCSSExtractor', () => {
    let extractor: CriticalCSSExtractor

    beforeEach(() => {
      extractor = new CriticalCSSExtractor({ enabled: true })
    })

    describe('Constructor', () => {
      it('should create with default config', () => {
        const defaultExtractor = new CriticalCSSExtractor()
        expect(defaultExtractor).toBeDefined()
      })

      it('should accept custom config', () => {
        const customExtractor = new CriticalCSSExtractor({
          enabled: true,
          viewport: { width: 1280, height: 720 },
          inline: false,
          defer: false,
        })
        expect(customExtractor).toBeDefined()
      })
    })

    describe('Marking Selectors', () => {
      it('should mark selector as critical', () => {
        extractor.markCritical('.header')
        expect(extractor.isCritical('.header')).toBe(true)
      })

      it('should mark selector as non-critical', () => {
        extractor.markNonCritical('.footer')
        expect(extractor.isCritical('.footer')).toBe(false)
      })

      it('should move selector from non-critical to critical', () => {
        extractor.markNonCritical('.nav')
        expect(extractor.isCritical('.nav')).toBe(false)

        extractor.markCritical('.nav')
        expect(extractor.isCritical('.nav')).toBe(true)
      })

      it('should move selector from critical to non-critical', () => {
        extractor.markCritical('.sidebar')
        expect(extractor.isCritical('.sidebar')).toBe(true)

        extractor.markNonCritical('.sidebar')
        expect(extractor.isCritical('.sidebar')).toBe(false)
      })
    })

    describe('Force Include/Exclude', () => {
      it('should force include matching selectors', () => {
        const forcedExtractor = new CriticalCSSExtractor({
          enabled: true,
          forceInclude: ['.critical-', 'header'],
        })

        expect(forcedExtractor.isCritical('.critical-button')).toBe(true)
        expect(forcedExtractor.isCritical('header.main')).toBe(true)
      })

      it('should force exclude matching selectors', () => {
        const forcedExtractor = new CriticalCSSExtractor({
          enabled: true,
          exclude: ['.non-critical-', 'footer'],
        })

        forcedExtractor.markCritical('.non-critical-button')
        expect(forcedExtractor.isCritical('.non-critical-button')).toBe(false)

        forcedExtractor.markCritical('footer.main')
        expect(forcedExtractor.isCritical('footer.main')).toBe(false)
      })
    })

    describe('CSS Extraction', () => {
      it('should extract critical CSS', () => {
        extractor.markCritical('.header')
        extractor.markCritical('.hero')
        extractor.markNonCritical('.footer')

        const css = `
          .header { color: red; }
          .hero { font-size: 2rem; }
          .footer { margin-top: 2rem; }
        `

        const { critical, nonCritical } = extractor.extract(css)

        expect(critical).toContain('.header')
        expect(critical).toContain('.hero')
        expect(nonCritical).toContain('.footer')
        expect(critical).not.toContain('.footer')
      })

      it('should return empty critical CSS when disabled', () => {
        const disabledExtractor = new CriticalCSSExtractor({ enabled: false })

        disabledExtractor.markCritical('.header')

        const css = `.header { color: red; }`

        const { critical, nonCritical } = disabledExtractor.extract(css)

        expect(critical).toBe('')
        expect(nonCritical).toBe(css)
      })

      it('should handle comma-separated selectors', () => {
        extractor.markCritical('.a')
        extractor.markNonCritical('.b')

        const css = `.a, .b { color: red; }`

        const { critical } = extractor.extract(css)

        // If any part is critical, the whole rule is critical
        expect(critical).toContain('.a, .b')
      })

      it('should handle CSS with invalid content between rules', () => {
        const css = `.valid { color: red; } .another { font-size: 1rem; }`

        extractor.markCritical('.valid')
        extractor.markCritical('.another')

        const { critical } = extractor.extract(css)

        expect(critical).toContain('.valid')
        expect(critical).toContain('.another')
      })
    })

    describe('HTML Generation', () => {
      it('should generate inline critical CSS', () => {
        const inlineExtractor = new CriticalCSSExtractor({
          enabled: true,
          inline: true,
        })

        const html = inlineExtractor.generateInlineHTML('.header { color: red; }')

        expect(html).toContain('<style')
        expect(html).toContain('critical-css')
        expect(html).toContain('.header { color: red; }')
      })

      it('should return empty when inline is false', () => {
        const noInlineExtractor = new CriticalCSSExtractor({
          enabled: true,
          inline: false,
        })

        const html = noInlineExtractor.generateInlineHTML('.header { color: red; }')

        expect(html).toBe('')
      })

      it('should return empty when critical CSS is empty', () => {
        const html = extractor.generateInlineHTML('')
        expect(html).toBe('')
      })

      it('should generate deferred loading script', () => {
        const deferExtractor = new CriticalCSSExtractor({
          enabled: true,
          defer: true,
        })

        const script = deferExtractor.generateDeferredLoad('/styles.css')

        expect(script).toContain('preload')
        expect(script).toContain('/styles.css')
        expect(script).toContain('noscript')
      })

      it('should generate regular link when defer is false', () => {
        const noDeferExtractor = new CriticalCSSExtractor({
          enabled: true,
          defer: false,
        })

        const link = noDeferExtractor.generateDeferredLoad('/styles.css')

        expect(link).toContain('<link rel="stylesheet"')
        expect(link).toContain('/styles.css')
        expect(link).not.toContain('preload')
      })
    })

    describe('Auto-detect', () => {
      it('should auto-detect reset and base styles', () => {
        const css = `
          * { margin: 0; }
          html { font-size: 16px; }
          body { line-height: 1.6; }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('*')).toBe(true)
        expect(extractor.isCritical('html')).toBe(true)
        expect(extractor.isCritical('body')).toBe(true)
      })

      it('should auto-detect layout selectors', () => {
        const css = `
          .container { max-width: 1200px; }
          .wrapper { padding: 0 1rem; }
          .layout { display: grid; }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('.container')).toBe(true)
        expect(extractor.isCritical('.wrapper')).toBe(true)
        expect(extractor.isCritical('.layout')).toBe(true)
      })

      it('should auto-detect header and navigation', () => {
        const css = `
          header { background: white; }
          nav { display: flex; }
          .header { padding: 1rem; }
          .navbar { height: 60px; }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('header')).toBe(true)
        expect(extractor.isCritical('nav')).toBe(true)
        expect(extractor.isCritical('.header')).toBe(true)
        expect(extractor.isCritical('.navbar')).toBe(true)
      })

      it('should auto-detect logo and branding', () => {
        const css = `
          .logo { width: 120px; }
          .brand { font-weight: bold; }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('.logo')).toBe(true)
        expect(extractor.isCritical('.brand')).toBe(true)
      })

      it('should auto-detect hero sections', () => {
        const css = `
          .hero { min-height: 100vh; }
          .banner { background: url('/hero.jpg'); }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('.hero')).toBe(true)
        expect(extractor.isCritical('.banner')).toBe(true)
      })

      it('should auto-detect headings', () => {
        const css = `
          h1 { font-size: 3rem; }
          .title { margin-bottom: 1rem; }
          .heading { font-weight: bold; }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('h1')).toBe(true)
        expect(extractor.isCritical('.title')).toBe(true)
        expect(extractor.isCritical('.heading')).toBe(true)
      })

      it('should mark non-critical selectors', () => {
        const css = `
          .footer { margin-top: 2rem; }
          .sidebar { width: 300px; }
        `

        extractor.autoDetect(css)

        expect(extractor.isCritical('.footer')).toBe(false)
        expect(extractor.isCritical('.sidebar')).toBe(false)
      })
    })

    describe('Statistics', () => {
      it('should return statistics', () => {
        extractor.markCritical('.header')
        extractor.markCritical('.hero')
        extractor.markNonCritical('.footer')
        extractor.markNonCritical('.sidebar')

        const stats = extractor.getStats()

        expect(stats.critical).toBe(2)
        expect(stats.nonCritical).toBe(2)
        expect(stats.total).toBe(4)
        expect(stats.criticalPercentage).toBe(50)
      })

      it('should handle zero selectors', () => {
        const stats = extractor.getStats()

        expect(stats.critical).toBe(0)
        expect(stats.nonCritical).toBe(0)
        expect(stats.total).toBe(0)
        expect(stats.criticalPercentage).toBe(0)
      })
    })

    describe('Report Generation', () => {
      it('should generate report', () => {
        extractor.markCritical('.header')
        extractor.markCritical('.hero')
        extractor.markNonCritical('.footer')

        const report = extractor.generateReport()

        expect(report).toContain('Critical CSS Report')
        expect(report).toContain('Critical selectors: 2')
        expect(report).toContain('Non-critical selectors: 1')
        expect(report).toContain('Total selectors: 3')
        expect(report).toContain('Critical percentage: 66.7%')
      })

      it('should include helpful messages', () => {
        extractor.markCritical('.header')

        const report = extractor.generateReport()

        expect(report).toContain('inlined in <head>')
        expect(report).toContain('deferred for faster first paint')
      })
    })

    describe('Reset', () => {
      it('should reset all selectors', () => {
        extractor.markCritical('.header')
        extractor.markNonCritical('.footer')

        extractor.reset()

        const stats = extractor.getStats()
        expect(stats.critical).toBe(0)
        expect(stats.nonCritical).toBe(0)
      })
    })
  })

  describe('CriticalCSSMeasurement', () => {
    describe('estimateImpact', () => {
      it('should estimate critical CSS impact', () => {
        const criticalCSS = '.header { color: red; }'
        const fullCSS = `
          .header { color: red; }
          .footer { margin-top: 2rem; }
          .sidebar { width: 300px; }
          .content { padding: 1rem; }
        `

        const impact = CriticalCSSMeasurement.estimateImpact(criticalCSS, fullCSS)

        expect(impact.criticalSize).toBeGreaterThan(0)
        expect(impact.fullSize).toBeGreaterThan(impact.criticalSize)
        expect(impact.criticalPercentage).toBeGreaterThan(0)
        expect(impact.criticalPercentage).toBeLessThan(100)
        expect(impact.estimatedSavings.firstPaint).toContain('ms')
        expect(impact.estimatedSavings.speedIndex).toContain('ms')
      })

      it('should handle 100% critical CSS', () => {
        const css = '.header { color: red; }'

        const impact = CriticalCSSMeasurement.estimateImpact(css, css)

        expect(impact.criticalPercentage).toBe(100)
      })

      it('should calculate time savings', () => {
        const criticalCSS = 'a'.repeat(1024) // 1KB
        const fullCSS = 'a'.repeat(10240) // 10KB

        const impact = CriticalCSSMeasurement.estimateImpact(criticalCSS, fullCSS)

        expect(impact.estimatedSavings.firstPaint).toMatch(/~\d+ms faster/)
        expect(impact.estimatedSavings.speedIndex).toMatch(/~\d+ms faster/)
      })
    })

    describe('formatSize', () => {
      it('should format bytes', () => {
        expect(CriticalCSSMeasurement.formatSize(512)).toBe('512B')
      })

      it('should format kilobytes', () => {
        expect(CriticalCSSMeasurement.formatSize(2048)).toBe('2.0KB')
        expect(CriticalCSSMeasurement.formatSize(5120)).toBe('5.0KB')
      })

      it('should format megabytes', () => {
        expect(CriticalCSSMeasurement.formatSize(1024 * 1024)).toBe('1.0MB')
        expect(CriticalCSSMeasurement.formatSize(2.5 * 1024 * 1024)).toBe('2.5MB')
      })

      it('should handle zero bytes', () => {
        expect(CriticalCSSMeasurement.formatSize(0)).toBe('0B')
      })

      it('should format decimal values', () => {
        expect(CriticalCSSMeasurement.formatSize(1536)).toBe('1.5KB')
      })
    })
  })
})
