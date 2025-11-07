/**
 * Comprehensive Benchmark Suite
 * Compare ZenCSS against Tailwind CSS and Panda CSS
 */

import { performance } from 'node:perf_hooks'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { gzipSync } from 'node:zlib'

/**
 * Benchmark metrics
 */
export interface BenchmarkMetrics {
  framework: string
  scenario: string
  buildTime: number // ms
  bundleSize: {
    original: number // bytes
    minified: number // bytes
    gzipped: number // bytes
  }
  treeShaking: {
    totalClasses: number
    usedClasses: number
    unusedClasses: number
    removalRate: number // percentage
  }
  memoryUsage: {
    heapUsed: number // bytes
    external: number // bytes
  }
  features: {
    typeInference: boolean
    zeroRuntime: boolean
    criticalCSS: boolean
    cascadeLayers: boolean
    whereSelector: boolean
    treeShaking: boolean
  }
  timestamp: number
}

/**
 * Benchmark scenario
 */
export interface BenchmarkScenario {
  name: string
  description: string
  components: number // Number of components
  classesPerComponent: number // Average classes per component
  totalClasses: number // Total unique classes
  usedClasses: number // Classes actually used
}

/**
 * Predefined benchmark scenarios
 */
export const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    name: 'small',
    description: 'Small app (Landing page)',
    components: 10,
    classesPerComponent: 8,
    totalClasses: 80,
    usedClasses: 60,
  },
  {
    name: 'medium',
    description: 'Medium app (Dashboard)',
    components: 50,
    classesPerComponent: 12,
    totalClasses: 600,
    usedClasses: 400,
  },
  {
    name: 'large',
    description: 'Large app (E-commerce)',
    components: 200,
    classesPerComponent: 15,
    totalClasses: 3000,
    usedClasses: 1800,
  },
  {
    name: 'xlarge',
    description: 'Enterprise app',
    components: 1000,
    classesPerComponent: 20,
    totalClasses: 20000,
    usedClasses: 12000,
  },
]

/**
 * Benchmark runner
 */
export class BenchmarkRunner {
  private results: BenchmarkMetrics[] = []
  private currentScenario: BenchmarkScenario | null = null

  /**
   * Run a benchmark
   */
  async run(
    framework: string,
    scenario: BenchmarkScenario,
    buildFn: () => Promise<{ css: string; usedClasses?: number }>
  ): Promise<BenchmarkMetrics> {
    this.currentScenario = scenario

    // Clear memory before benchmark
    if (global.gc) {
      global.gc()
    }

    const memBefore = process.memoryUsage()

    // Measure build time
    const startTime = performance.now()
    const result = await buildFn()
    const endTime = performance.now()

    const memAfter = process.memoryUsage()

    // Calculate bundle sizes
    const original = Buffer.byteLength(result.css, 'utf-8')
    const minified = this.minify(result.css)
    const minifiedSize = Buffer.byteLength(minified, 'utf-8')
    const gzipped = gzipSync(minified)
    const gzippedSize = gzipped.length

    // Calculate tree shaking metrics
    const usedClasses = result.usedClasses || scenario.usedClasses
    const unusedClasses = scenario.totalClasses - usedClasses
    const removalRate = (unusedClasses / scenario.totalClasses) * 100

    const metrics: BenchmarkMetrics = {
      framework,
      scenario: scenario.name,
      buildTime: endTime - startTime,
      bundleSize: {
        original,
        minified: minifiedSize,
        gzipped: gzippedSize,
      },
      treeShaking: {
        totalClasses: scenario.totalClasses,
        usedClasses,
        unusedClasses,
        removalRate,
      },
      memoryUsage: {
        heapUsed: memAfter.heapUsed - memBefore.heapUsed,
        external: memAfter.external - memBefore.external,
      },
      features: this.detectFeatures(framework),
      timestamp: Date.now(),
    }

    this.results.push(metrics)
    return metrics
  }

  /**
   * Run multiple scenarios
   */
  async runScenarios(
    framework: string,
    scenarios: BenchmarkScenario[],
    buildFn: (scenario: BenchmarkScenario) => Promise<{ css: string; usedClasses?: number }>
  ): Promise<BenchmarkMetrics[]> {
    const results: BenchmarkMetrics[] = []

    for (const scenario of scenarios) {
      console.log(`\n🏃 Running ${framework} - ${scenario.name} scenario...`)
      const result = await this.run(framework, scenario, () => buildFn(scenario))
      results.push(result)
    }

    return results
  }

  /**
   * Compare frameworks
   */
  compare(frameworkA: string, frameworkB: string, scenario: string): {
    buildTime: { winner: string; percentage: number }
    bundleSize: { winner: string; percentage: number }
    treeShaking: { winner: string; percentage: number }
    memoryUsage: { winner: string; percentage: number }
  } | null {
    const resultsA = this.results.filter((r) => r.framework === frameworkA && r.scenario === scenario)
    const resultsB = this.results.filter((r) => r.framework === frameworkB && r.scenario === scenario)

    if (resultsA.length === 0 || resultsB.length === 0) {
      return null
    }

    const a = resultsA[0]
    const b = resultsB[0]

    if (!a || !b) return null

    const buildTimeDiff = ((a.buildTime - b.buildTime) / a.buildTime) * 100
    const bundleSizeDiff =
      ((a.bundleSize.gzipped - b.bundleSize.gzipped) / a.bundleSize.gzipped) * 100
    const treeShakingDiff =
      ((a.treeShaking.removalRate - b.treeShaking.removalRate) / a.treeShaking.removalRate) * 100
    const memoryDiff =
      ((a.memoryUsage.heapUsed - b.memoryUsage.heapUsed) / a.memoryUsage.heapUsed) * 100

    return {
      buildTime: {
        winner: buildTimeDiff > 0 ? frameworkB : frameworkA,
        percentage: Math.abs(buildTimeDiff),
      },
      bundleSize: {
        winner: bundleSizeDiff > 0 ? frameworkB : frameworkA,
        percentage: Math.abs(bundleSizeDiff),
      },
      treeShaking: {
        winner: treeShakingDiff < 0 ? frameworkB : frameworkA,
        percentage: Math.abs(treeShakingDiff),
      },
      memoryUsage: {
        winner: memoryDiff > 0 ? frameworkB : frameworkA,
        percentage: Math.abs(memoryDiff),
      },
    }
  }

  /**
   * Generate comparison report
   */
  generateReport(): string {
    if (this.results.length === 0) {
      return 'No benchmark results available'
    }

    const lines: string[] = [
      '╔════════════════════════════════════════════════════════════════╗',
      '║         ZenCSS vs Tailwind vs Panda CSS - Benchmark          ║',
      '╚════════════════════════════════════════════════════════════════╝',
      '',
    ]

    // Group by scenario
    const scenarios = [...new Set(this.results.map((r) => r.scenario))]

    for (const scenario of scenarios) {
      const scenarioResults = this.results.filter((r) => r.scenario === scenario)
      const scenarioInfo = BENCHMARK_SCENARIOS.find((s) => s.name === scenario)

      lines.push(
        '',
        `📊 ${scenarioInfo?.description || scenario.toUpperCase()}`,
        '─'.repeat(64),
        ''
      )

      // Build time comparison
      lines.push('⏱️  BUILD TIME')
      for (const result of scenarioResults) {
        lines.push(`  ${result.framework.padEnd(15)} ${this.formatTime(result.buildTime)}`)
      }

      // Bundle size comparison
      lines.push('')
      lines.push('📦 BUNDLE SIZE (gzipped)')
      for (const result of scenarioResults) {
        lines.push(
          `  ${result.framework.padEnd(15)} ${this.formatSize(result.bundleSize.gzipped)}`
        )
      }

      // Tree shaking comparison
      lines.push('')
      lines.push('🌲 TREE SHAKING')
      for (const result of scenarioResults) {
        lines.push(
          `  ${result.framework.padEnd(15)} ${result.treeShaking.removalRate.toFixed(1)}% removed (${result.treeShaking.unusedClasses}/${result.treeShaking.totalClasses} classes)`
        )
      }

      // Memory usage
      lines.push('')
      lines.push('💾 MEMORY USAGE')
      for (const result of scenarioResults) {
        lines.push(
          `  ${result.framework.padEnd(15)} ${this.formatSize(result.memoryUsage.heapUsed)}`
        )
      }

      // Features comparison
      if (scenarioResults.length > 0) {
        lines.push('')
        lines.push('✨ FEATURES')
        const features = [
          'typeInference',
          'zeroRuntime',
          'criticalCSS',
          'cascadeLayers',
          'whereSelector',
          'treeShaking',
        ] as const
        const featureNames = {
          typeInference: 'Type Inference',
          zeroRuntime: 'Zero Runtime',
          criticalCSS: 'Critical CSS',
          cascadeLayers: 'Cascade Layers',
          whereSelector: ':where() Selector',
          treeShaking: 'Tree Shaking',
        }

        for (const feature of features) {
          const support = scenarioResults.map((r) => ({
            framework: r.framework,
            supported: r.features[feature],
          }))
          const supportStr = support
            .map((s) => `${s.framework}: ${s.supported ? '✅' : '❌'}`)
            .join('  ')
          lines.push(`  ${featureNames[feature].padEnd(20)} ${supportStr}`)
        }
      }
    }

    // Overall winner
    lines.push('')
    lines.push('═'.repeat(64))
    lines.push('')
    lines.push('🏆 OVERALL COMPARISON')
    lines.push('')

    const frameworks = [...new Set(this.results.map((r) => r.framework))]
    if (frameworks.length >= 2) {
      for (let i = 0; i < frameworks.length - 1; i++) {
        for (let j = i + 1; j < frameworks.length; j++) {
          const fwA = frameworks[i]
          const fwB = frameworks[j]

          if (!fwA || !fwB) continue

          lines.push(`${fwA} vs ${fwB}:`)

          for (const scenario of scenarios) {
            const comparison = this.compare(fwA, fwB, scenario)
            if (comparison) {
              lines.push(`  ${scenario}:`)
              lines.push(
                `    Build Time:    ${comparison.buildTime.winner} is ${comparison.buildTime.percentage.toFixed(1)}% faster`
              )
              lines.push(
                `    Bundle Size:   ${comparison.bundleSize.winner} is ${comparison.bundleSize.percentage.toFixed(1)}% smaller`
              )
              lines.push(
                `    Tree Shaking:  ${comparison.treeShaking.winner} removes ${comparison.treeShaking.percentage.toFixed(1)}% more`
              )
              lines.push(
                `    Memory Usage:  ${comparison.memoryUsage.winner} uses ${comparison.memoryUsage.percentage.toFixed(1)}% less`
              )
            }
          }
          lines.push('')
        }
      }
    }

    lines.push('═'.repeat(64))

    return lines.join('\n')
  }

  /**
   * Export results as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.results, null, 2)
  }

  /**
   * Export results as CSV
   */
  exportCSV(): string {
    const headers = [
      'Framework',
      'Scenario',
      'Build Time (ms)',
      'Bundle Size (bytes)',
      'Gzipped (bytes)',
      'Total Classes',
      'Used Classes',
      'Removal Rate (%)',
      'Memory (bytes)',
    ]

    const rows = this.results.map((r) => [
      r.framework,
      r.scenario,
      r.buildTime.toFixed(2),
      r.bundleSize.original,
      r.bundleSize.gzipped,
      r.treeShaking.totalClasses,
      r.treeShaking.usedClasses,
      r.treeShaking.removalRate.toFixed(2),
      r.memoryUsage.heapUsed,
    ])

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  }

  /**
   * Save results to file
   */
  async saveResults(outputDir: string): Promise<void> {
    await fs.promises.mkdir(outputDir, { recursive: true })

    // Save JSON
    await fs.promises.writeFile(
      path.join(outputDir, 'benchmark-results.json'),
      this.exportJSON(),
      'utf-8'
    )

    // Save CSV
    await fs.promises.writeFile(
      path.join(outputDir, 'benchmark-results.csv'),
      this.exportCSV(),
      'utf-8'
    )

    // Save report
    await fs.promises.writeFile(
      path.join(outputDir, 'benchmark-report.txt'),
      this.generateReport(),
      'utf-8'
    )
  }

  /**
   * Get all results
   */
  getResults(): BenchmarkMetrics[] {
    return [...this.results]
  }

  /**
   * Clear results
   */
  clear(): void {
    this.results = []
  }

  // Helper methods

  private minify(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove whitespace
      .replace(/;}/g, '}') // Remove unnecessary semicolons
      .trim()
  }

  private detectFeatures(framework: string): BenchmarkMetrics['features'] {
    const features: Record<string, BenchmarkMetrics['features']> = {
      ZenCSS: {
        typeInference: true,
        zeroRuntime: true,
        criticalCSS: true,
        cascadeLayers: true,
        whereSelector: true,
        treeShaking: true,
      },
      Tailwind: {
        typeInference: false,
        zeroRuntime: true,
        criticalCSS: false,
        cascadeLayers: true, // v4+
        whereSelector: true, // v4+
        treeShaking: true,
      },
      'Panda CSS': {
        typeInference: true,
        zeroRuntime: true,
        criticalCSS: false,
        cascadeLayers: true,
        whereSelector: true,
        treeShaking: true,
      },
    }

    return (
      features[framework] || {
        typeInference: false,
        zeroRuntime: false,
        criticalCSS: false,
        cascadeLayers: false,
        whereSelector: false,
        treeShaking: false,
      }
    )
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`
  }

  private formatTime(ms: number): string {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`
    if (ms < 1000) return `${ms.toFixed(2)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }
}

/**
 * Helper to generate mock CSS for testing
 */
export function generateMockCSS(scenario: BenchmarkScenario, used = true): string {
  const classes: string[] = []
  const numClasses = used ? scenario.usedClasses : scenario.totalClasses

  for (let i = 0; i < numClasses; i++) {
    classes.push(`.silk-class-${i} { color: red; padding: 1rem; }`)
  }

  return classes.join('\n')
}
