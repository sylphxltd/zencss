/**
 * Tests for benchmarking utilities
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { BenchmarkRunner, BENCHMARK_SCENARIOS, generateMockCSS } from './benchmark'

describe('Benchmark Utilities', () => {
  describe('BENCHMARK_SCENARIOS', () => {
    it('should have 4 predefined scenarios', () => {
      expect(BENCHMARK_SCENARIOS).toHaveLength(4)
    })

    it('should have small scenario', () => {
      const small = BENCHMARK_SCENARIOS.find((s) => s.name === 'small')
      expect(small).toBeDefined()
      expect(small?.components).toBe(10)
      expect(small?.totalClasses).toBe(80)
    })

    it('should have medium scenario', () => {
      const medium = BENCHMARK_SCENARIOS.find((s) => s.name === 'medium')
      expect(medium).toBeDefined()
      expect(medium?.components).toBe(50)
      expect(medium?.totalClasses).toBe(600)
    })

    it('should have large scenario', () => {
      const large = BENCHMARK_SCENARIOS.find((s) => s.name === 'large')
      expect(large).toBeDefined()
      expect(large?.components).toBe(200)
      expect(large?.totalClasses).toBe(3000)
    })

    it('should have xlarge scenario', () => {
      const xlarge = BENCHMARK_SCENARIOS.find((s) => s.name === 'xlarge')
      expect(xlarge).toBeDefined()
      expect(xlarge?.components).toBe(1000)
      expect(xlarge?.totalClasses).toBe(20000)
    })
  })

  describe('generateMockCSS', () => {
    it('should generate CSS for used classes', () => {
      const scenario = BENCHMARK_SCENARIOS[0]
      const css = generateMockCSS(scenario, true)

      expect(css).toContain('.silk-class-')
      const classCount = (css.match(/\.silk-class-/g) || []).length
      expect(classCount).toBe(scenario.usedClasses)
    })

    it('should generate CSS for all classes', () => {
      const scenario = BENCHMARK_SCENARIOS[0]
      const css = generateMockCSS(scenario, false)

      const classCount = (css.match(/\.silk-class-/g) || []).length
      expect(classCount).toBe(scenario.totalClasses)
    })
  })

  describe('BenchmarkRunner', () => {
    let runner: BenchmarkRunner

    beforeEach(() => {
      runner = new BenchmarkRunner()
    })

    it('should run a single benchmark', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      const result = await runner.run('TestFramework', scenario, async () => {
        const css = generateMockCSS(scenario, true)
        return { css, usedClasses: scenario.usedClasses }
      })

      expect(result.framework).toBe('TestFramework')
      expect(result.scenario).toBe('small')
      expect(result.buildTime).toBeGreaterThan(0)
      expect(result.bundleSize.original).toBeGreaterThan(0)
      expect(result.bundleSize.minified).toBeGreaterThan(0)
      expect(result.bundleSize.gzipped).toBeGreaterThan(0)
      expect(result.treeShaking.totalClasses).toBe(scenario.totalClasses)
      expect(result.treeShaking.usedClasses).toBe(scenario.usedClasses)
    })

    it('should calculate tree shaking metrics', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      const result = await runner.run('TestFramework', scenario, async () => {
        const css = generateMockCSS(scenario, true)
        return { css, usedClasses: scenario.usedClasses }
      })

      expect(result.treeShaking.unusedClasses).toBe(
        scenario.totalClasses - scenario.usedClasses
      )
      expect(result.treeShaking.removalRate).toBeGreaterThan(0)
      expect(result.treeShaking.removalRate).toBeLessThan(100)
    })

    it('should detect framework features', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      const zencss = await runner.run('ZenCSS', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      expect(zencss.features.typeInference).toBe(true)
      expect(zencss.features.zeroRuntime).toBe(true)
      expect(zencss.features.criticalCSS).toBe(true)
      expect(zencss.features.cascadeLayers).toBe(true)
      expect(zencss.features.whereSelector).toBe(true)
      expect(zencss.features.treeShaking).toBe(true)
    })

    it('should run multiple scenarios', async () => {
      const scenarios = BENCHMARK_SCENARIOS.slice(0, 2)

      const results = await runner.runScenarios('TestFramework', scenarios, async (scenario) => {
        const css = generateMockCSS(scenario, true)
        return { css, usedClasses: scenario.usedClasses }
      })

      expect(results).toHaveLength(2)
      expect(results[0].scenario).toBe('small')
      expect(results[1].scenario).toBe('medium')
    })

    it('should compare two frameworks', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      await runner.run('FrameworkA', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      await runner.run('FrameworkB', scenario, async () => {
        // Simulate smaller/faster bundle
        const css = generateMockCSS(scenario, true).substring(0, 1000)
        return { css, usedClasses: scenario.usedClasses }
      })

      const comparison = runner.compare('FrameworkA', 'FrameworkB', 'small')

      expect(comparison).not.toBeNull()
      expect(comparison?.buildTime.winner).toBeDefined()
      expect(comparison?.bundleSize.winner).toBeDefined()
      expect(comparison?.treeShaking.winner).toBeDefined()
      expect(comparison?.memoryUsage.winner).toBeDefined()
    })

    it('should generate report', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      await runner.run('ZenCSS', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      await runner.run('Tailwind', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      const report = runner.generateReport()

      expect(report).toContain('ZenCSS')
      expect(report).toContain('Tailwind')
      expect(report).toContain('BUILD TIME')
      expect(report).toContain('BUNDLE SIZE')
      expect(report).toContain('TREE SHAKING')
      expect(report).toContain('MEMORY USAGE')
      expect(report).toContain('FEATURES')
    })

    it('should export JSON', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      await runner.run('TestFramework', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      const json = runner.exportJSON()
      const parsed = JSON.parse(json)

      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed[0].framework).toBe('TestFramework')
      expect(parsed[0].scenario).toBe('small')
    })

    it('should export CSV', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      await runner.run('TestFramework', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      const csv = runner.exportCSV()

      expect(csv).toContain('Framework')
      expect(csv).toContain('Scenario')
      expect(csv).toContain('Build Time')
      expect(csv).toContain('TestFramework')
      expect(csv).toContain('small')
    })

    it('should save results to files', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      await runner.run('TestFramework', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      // Save to temp directory
      const tmpDir = `/tmp/zencss-benchmark-test-${Date.now()}`
      await runner.saveResults(tmpDir)

      // Verify files exist
      const fs = await import('node:fs')
      expect(fs.existsSync(`${tmpDir}/benchmark-results.json`)).toBe(true)
      expect(fs.existsSync(`${tmpDir}/benchmark-results.csv`)).toBe(true)
      expect(fs.existsSync(`${tmpDir}/benchmark-report.txt`)).toBe(true)

      // Cleanup
      await fs.promises.rm(tmpDir, { recursive: true })
    })

    it('should clear results', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]

      await runner.run('TestFramework', scenario, async () => {
        return { css: generateMockCSS(scenario, true) }
      })

      expect(runner.getResults()).toHaveLength(1)

      runner.clear()

      expect(runner.getResults()).toHaveLength(0)
    })

    it('should handle minification correctly', async () => {
      const scenario = BENCHMARK_SCENARIOS[0]
      // Generate larger CSS so gzip is effective (gzip has overhead for tiny files)
      const css = `
        /* Comment */
        .test { color: red; }
        .other { padding: 1rem; }
      `.repeat(100)

      const result = await runner.run('TestFramework', scenario, async () => {
        return { css }
      })

      expect(result.bundleSize.minified).toBeLessThan(result.bundleSize.original)
      expect(result.bundleSize.gzipped).toBeLessThanOrEqual(result.bundleSize.minified)
    })
  })
})
