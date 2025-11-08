import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  ClassUsageTracker,
  CSSMinifier,
  CSSDeduplicator,
  ProductionOptimizer,
  defaultTreeShakingConfig,
} from './tree-shaking'

const FIXTURES_DIR = path.join(__dirname, '../__test-fixtures-tree-shaking__')

describe('Tree Shaking', () => {
  beforeEach(() => {
    if (!fs.existsSync(FIXTURES_DIR)) {
      fs.mkdirSync(FIXTURES_DIR, { recursive: true })
    }
  })

  afterEach(() => {
    if (fs.existsSync(FIXTURES_DIR)) {
      fs.rmSync(FIXTURES_DIR, { recursive: true, force: true })
    }
  })

  describe('defaultTreeShakingConfig', () => {
    it('should have correct defaults', () => {
      expect(defaultTreeShakingConfig.scanDirs).toEqual(['./src'])
      expect(defaultTreeShakingConfig.extensions).toContain('.ts')
      expect(defaultTreeShakingConfig.extensions).toContain('.tsx')
      expect(defaultTreeShakingConfig.extensions).toContain('.vue')
      expect(defaultTreeShakingConfig.extensions).toContain('.svelte')
      expect(defaultTreeShakingConfig.exclude).toContain('node_modules')
      expect(defaultTreeShakingConfig.exclude).toContain('dist')
      expect(defaultTreeShakingConfig.reportUnused).toBe(false)
    })
  })

  describe('ClassUsageTracker', () => {
    describe('Configuration', () => {
      it('should accept custom config', () => {
        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./custom'],
          reportUnused: true,
        })
        expect(tracker).toBeDefined()
      })

      it('should use default config when none provided', () => {
        const tracker = new ClassUsageTracker()
        expect(tracker).toBeDefined()
      })
    })

    describe('Class Marking', () => {
      it('should mark classes as generated', () => {
        const tracker = new ClassUsageTracker()
        tracker.markGenerated('silk-abc123')
        tracker.markGenerated('silk-def456')

        const generated = tracker.getGeneratedClasses()
        expect(generated.has('silk-abc123')).toBe(true)
        expect(generated.has('silk-def456')).toBe(true)
        expect(generated.size).toBe(2)
      })

      it('should track multiple generated classes', () => {
        const tracker = new ClassUsageTracker()
        tracker.markGenerated('silk-1')
        tracker.markGenerated('silk-2')
        tracker.markGenerated('silk-3')

        expect(tracker.getGeneratedClasses().size).toBe(3)
      })
    })

    describe('isUsed()', () => {
      it('should return true when disabled', () => {
        const tracker = new ClassUsageTracker({ enabled: false })
        expect(tracker.isUsed('any-class')).toBe(true)
      })

      it('should return false for unused classes when enabled', () => {
        const tracker = new ClassUsageTracker({ enabled: true })
        expect(tracker.isUsed('silk-unused')).toBe(false)
      })
    })

    describe('File Scanning', () => {
      it('should scan files with className strings', async () => {
        const srcDir = path.join(FIXTURES_DIR, 'src')
        fs.mkdirSync(srcDir, { recursive: true })

        fs.writeFileSync(
          path.join(srcDir, 'component.tsx'),
          `
          const MyComponent = () => {
            return <div className="silk-abc123 silk-def456">Hello</div>
          }
        `
        )

        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./src'],
        })

        await tracker.scan(FIXTURES_DIR)

        const used = tracker.getUsedClasses()
        expect(used.has('silk-abc123')).toBe(true)
        expect(used.has('silk-def456')).toBe(true)
      })

      it('should scan files with template literals', async () => {
        const srcDir = path.join(FIXTURES_DIR, 'src')
        fs.mkdirSync(srcDir, { recursive: true })

        fs.writeFileSync(
          path.join(srcDir, 'component.tsx'),
          `
          const MyComponent = ({ active }) => {
            return <div className={\`silk-base \${active ? 'silk-active' : ''}\`}>Hello</div>
          }
        `
        )

        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./src'],
        })

        await tracker.scan(FIXTURES_DIR)

        const used = tracker.getUsedClasses()
        expect(used.has('silk-base')).toBe(true)
        expect(used.has('silk-active')).toBe(true)
      })

      it('should scan css() calls', async () => {
        const srcDir = path.join(FIXTURES_DIR, 'src')
        fs.mkdirSync(srcDir, { recursive: true })

        fs.writeFileSync(
          path.join(srcDir, 'styles.ts'),
          `
          const button = css({
            color: 'red',
            padding: '10px'
          })
        `
        )

        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./src'],
        })

        await tracker.scan(FIXTURES_DIR)
        expect(tracker.getUsedClasses()).toBeDefined()
      })

      it('should exclude node_modules', async () => {
        const nodeModulesDir = path.join(FIXTURES_DIR, 'src', 'node_modules')
        fs.mkdirSync(nodeModulesDir, { recursive: true })

        fs.writeFileSync(
          path.join(nodeModulesDir, 'lib.ts'),
          `const x = "silk-should-not-be-scanned"`
        )

        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./src'],
        })

        await tracker.scan(FIXTURES_DIR)

        const used = tracker.getUsedClasses()
        expect(used.has('silk-should-not-be-scanned')).toBe(false)
      })

      it('should only scan configured extensions', async () => {
        const srcDir = path.join(FIXTURES_DIR, 'src')
        fs.mkdirSync(srcDir, { recursive: true })

        fs.writeFileSync(path.join(srcDir, 'valid.tsx'), `className="silk-valid"`)
        fs.writeFileSync(path.join(srcDir, 'invalid.txt'), `className="silk-invalid"`)

        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./src'],
          extensions: ['.tsx'],
        })

        await tracker.scan(FIXTURES_DIR)

        const used = tracker.getUsedClasses()
        expect(used.has('silk-valid')).toBe(true)
        expect(used.has('silk-invalid')).toBe(false)
      })

      it('should handle nested directories', async () => {
        const nestedDir = path.join(FIXTURES_DIR, 'src', 'components', 'buttons')
        fs.mkdirSync(nestedDir, { recursive: true })

        fs.writeFileSync(
          path.join(nestedDir, 'Button.tsx'),
          `<button className="silk-btn">Click</button>`
        )

        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./src'],
        })

        await tracker.scan(FIXTURES_DIR)

        const used = tracker.getUsedClasses()
        expect(used.has('silk-btn')).toBe(true)
      })

      it('should handle non-existent scan directory', async () => {
        const tracker = new ClassUsageTracker({
          enabled: true,
          scanDirs: ['./non-existent'],
        })

        await tracker.scan(FIXTURES_DIR)
        expect(tracker.getUsedClasses().size).toBe(0)
      })

      it('should skip scan when disabled', async () => {
        const srcDir = path.join(FIXTURES_DIR, 'src')
        fs.mkdirSync(srcDir, { recursive: true })

        fs.writeFileSync(path.join(srcDir, 'component.tsx'), `className="silk-test"`)

        const tracker = new ClassUsageTracker({ enabled: false })
        await tracker.scan(FIXTURES_DIR)

        expect(tracker.getUsedClasses().size).toBe(0)
      })
    })

    describe('Statistics', () => {
      it('should calculate unused classes', () => {
        const tracker = new ClassUsageTracker()

        tracker.markGenerated('silk-1')
        tracker.markGenerated('silk-2')
        tracker.markGenerated('silk-3')

        const unused = tracker.getUnusedClasses()
        expect(unused.size).toBe(3)
        expect(unused.has('silk-1')).toBe(true)
        expect(unused.has('silk-2')).toBe(true)
        expect(unused.has('silk-3')).toBe(true)
      })

      it('should calculate statistics', () => {
        const tracker = new ClassUsageTracker({ enabled: true })

        tracker.markGenerated('silk-1')
        tracker.markGenerated('silk-2')
        tracker.markGenerated('silk-3')

        const stats = tracker.getStats()

        expect(stats.generated).toBe(3)
        expect(stats.used).toBe(0)
        expect(stats.unused).toBe(3)
        expect(stats.savedPercentage).toBe(100)
      })

      it('should handle zero generated classes', () => {
        const tracker = new ClassUsageTracker()
        const stats = tracker.getStats()

        expect(stats.generated).toBe(0)
        expect(stats.used).toBe(0)
        expect(stats.unused).toBe(0)
        expect(stats.savedPercentage).toBe(0)
      })
    })

    describe('Report Generation', () => {
      it('should generate basic report', () => {
        const tracker = new ClassUsageTracker({ reportUnused: false })

        tracker.markGenerated('silk-1')
        tracker.markGenerated('silk-2')

        const report = tracker.generateReport()

        expect(report).toContain('Tree Shaking Report')
        expect(report).toContain('Generated classes: 2')
        expect(report).toContain('Unused classes: 2')
        expect(report).toContain('Saved: 100.0%')
      })

      it('should include unused classes when reportUnused is true', () => {
        const tracker = new ClassUsageTracker({ reportUnused: true })

        tracker.markGenerated('silk-unused-1')
        tracker.markGenerated('silk-unused-2')

        const report = tracker.generateReport()

        expect(report).toContain('Unused classes:')
        expect(report).toContain('silk-unused-1')
        expect(report).toContain('silk-unused-2')
      })

      it('should limit unused class list to 20 items', () => {
        const tracker = new ClassUsageTracker({ reportUnused: true })

        for (let i = 0; i < 30; i++) {
          tracker.markGenerated(`silk-unused-${i}`)
        }

        const report = tracker.generateReport()

        expect(report).toContain('and 10 more')
      })
    })

    describe('Reset', () => {
      it('should reset all tracked classes', () => {
        const tracker = new ClassUsageTracker()

        tracker.markGenerated('silk-1')
        tracker.markGenerated('silk-2')

        tracker.reset()

        expect(tracker.getGeneratedClasses().size).toBe(0)
        expect(tracker.getUsedClasses().size).toBe(0)
      })
    })
  })

  describe('CSSMinifier', () => {
    it('should remove comments', () => {
      const css = `/* Comment */ .class { color: red; }`
      const minified = CSSMinifier.minify(css)
      expect(minified).not.toContain('Comment')
      expect(minified).toContain('.class{color:red}')
    })

    it('should remove whitespace around special characters', () => {
      const css = `.class { color : red ; }`
      const minified = CSSMinifier.minify(css)
      expect(minified).toBe('.class{color:red}')
    })

    it('should remove unnecessary semicolons', () => {
      const css = `.class { color: red; }`
      const minified = CSSMinifier.minify(css)
      expect(minified).toBe('.class{color:red}')
    })

    it('should compress multiple spaces', () => {
      const css = `.class   {   color:   red;   }`
      const minified = CSSMinifier.minify(css)
      expect(minified).toBe('.class{color:red}')
    })

    it('should handle multi-line CSS', () => {
      const css = `
        .class {
          color: red;
          background: blue;
        }
      `
      const minified = CSSMinifier.minify(css)
      expect(minified).toBe('.class{color:red;background:blue}')
    })

    it('should calculate savings correctly', () => {
      const original = `.class { color: red; background: blue; }`
      const minified = CSSMinifier.minify(original)
      const savings = CSSMinifier.calculateSavings(original, minified)

      expect(savings.originalSize).toBeGreaterThan(savings.minifiedSize)
      expect(savings.savedBytes).toBeGreaterThan(0)
      expect(savings.savedPercentage).toBeGreaterThan(0)
      expect(savings.savedPercentage).toBeLessThanOrEqual(100)
    })

    it('should handle empty CSS', () => {
      const css = ''
      const minified = CSSMinifier.minify(css)
      expect(minified).toBe('')
    })

    it('should preserve important declarations', () => {
      const css = `.class { color: red !important; }`
      const minified = CSSMinifier.minify(css)
      expect(minified).toContain('!important')
    })
  })

  describe('CSSDeduplicator', () => {
    it('should combine selectors with same declarations', () => {
      const css = `
        .class1 { color: red; }
        .class2 { color: red; }
      `
      const deduplicated = CSSDeduplicator.deduplicate(css)

      expect(deduplicated).toContain('.class1, .class2')
      expect(deduplicated).toContain('color: red')
      expect((deduplicated.match(/color: red/g) || []).length).toBe(1)
    })

    it('should preserve different declarations', () => {
      const css = `
        .class1 { color: red; }
        .class2 { color: blue; }
      `
      const deduplicated = CSSDeduplicator.deduplicate(css)

      expect(deduplicated).toContain('.class1')
      expect(deduplicated).toContain('.class2')
      expect(deduplicated).toContain('color: red')
      expect(deduplicated).toContain('color: blue')
    })

    it('should handle multiple identical rules', () => {
      const css = `
        .a { color: red; }
        .b { color: red; }
        .c { color: red; }
      `
      const deduplicated = CSSDeduplicator.deduplicate(css)

      expect(deduplicated).toContain('.a, .b, .c')
      expect((deduplicated.match(/color: red/g) || []).length).toBe(1)
    })

    it('should calculate deduplication savings', () => {
      const css = `
        .a { color: red; }
        .b { color: red; }
        .c { color: red; }
      `
      const deduplicated = CSSDeduplicator.deduplicate(css)
      const savings = CSSDeduplicator.calculateSavings(css, deduplicated)

      expect(savings.originalRules).toBe(3)
      expect(savings.deduplicatedRules).toBe(1)
      expect(savings.savedRules).toBe(2)
      expect(savings.savedPercentage).toBeCloseTo(66.67, 1)
    })

    it('should handle empty CSS', () => {
      const css = ''
      const deduplicated = CSSDeduplicator.deduplicate(css)
      expect(deduplicated).toBe('')
    })

    it('should handle CSS with no duplicates', () => {
      const css = `.a { color: red; } .b { color: blue; }`
      const deduplicated = CSSDeduplicator.deduplicate(css)
      const savings = CSSDeduplicator.calculateSavings(css, deduplicated)

      expect(savings.savedRules).toBe(0)
      expect(savings.savedPercentage).toBe(0)
    })
  })

  describe('ProductionOptimizer', () => {
    it('should create optimizer with config', () => {
      const optimizer = new ProductionOptimizer({ enabled: true })
      expect(optimizer).toBeDefined()
    })

    it('should optimize CSS without scanning', async () => {
      const optimizer = new ProductionOptimizer({ enabled: false })

      const css = `
        .a { color: red; }
        .b { color: red; }
        /* Comment */
      `

      const result = await optimizer.optimize(css)

      expect(result.css).not.toContain('Comment')
      expect(result.stats).toHaveProperty('minification')
      expect(result.stats).toHaveProperty('deduplication')
      expect(result.stats).toHaveProperty('totalSavings')
    })

    it('should optimize CSS with scanning', async () => {
      const srcDir = path.join(FIXTURES_DIR, 'src')
      fs.mkdirSync(srcDir, { recursive: true })

      fs.writeFileSync(
        path.join(srcDir, 'component.tsx'),
        `<div className="silk-used">Hello</div>`
      )

      const optimizer = new ProductionOptimizer({
        enabled: true,
        scanDirs: ['./src'],
      })

      const css = `.silk-used { color: red; } .silk-unused { color: blue; }`

      const result = await optimizer.optimize(css, FIXTURES_DIR)

      expect(result.css).toBeDefined()
      expect(result.stats.treeShaking).toBeDefined()
      expect(result.stats.minification).toBeDefined()
      expect(result.stats.deduplication).toBeDefined()
    })

    it('should calculate total savings', async () => {
      const optimizer = new ProductionOptimizer({ enabled: false })

      const css = `
        .a { color: red; }
        .b { color: red; }
        /* Large comment that will be removed */
      `

      const result = await optimizer.optimize(css)

      expect(result.stats.totalSavings).toBeGreaterThan(0)
      expect(result.stats.totalSavings).toBeLessThanOrEqual(100)
    })

    it('should provide access to tracker', () => {
      const optimizer = new ProductionOptimizer()
      const tracker = optimizer.getTracker()

      expect(tracker).toBeDefined()
      expect(tracker).toBeInstanceOf(ClassUsageTracker)
    })

    it('should handle empty CSS', async () => {
      const optimizer = new ProductionOptimizer()
      const result = await optimizer.optimize('')

      expect(result.css).toBe('')
      // totalSavings is NaN when original size is 0 (0/0)
      expect(isNaN(result.stats.totalSavings) || result.stats.totalSavings === 0).toBe(true)
    })

    it('should combine all optimizations', async () => {
      const optimizer = new ProductionOptimizer({ enabled: false })

      const css = `
        /* Comment 1 */
        .class1 { color: red; padding: 10px; }
        /* Comment 2 */
        .class2 { color: red; padding: 10px; }
        /* Comment 3 */
      `

      const result = await optimizer.optimize(css)

      // Should remove comments
      expect(result.css).not.toContain('Comment')

      // Should deduplicate (minifier removes spaces after comma)
      expect(result.css).toMatch(/\.class1,\.class2|\.class2,\.class1/)

      // Should minify
      expect(result.css).not.toContain('\n')

      // Should have savings
      expect(result.stats.totalSavings).toBeGreaterThan(0)
    })
  })
})
