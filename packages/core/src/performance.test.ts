import { describe, it, expect, beforeEach } from 'vitest'
import {
  PerformanceMonitor,
  BuildReporter,
  Benchmarker,
  type PerformanceMetrics,
  type BuildReport,
} from './performance'

describe('Performance', () => {
  describe('PerformanceMonitor', () => {
    let monitor: PerformanceMonitor

    beforeEach(() => {
      monitor = new PerformanceMonitor()
    })

    describe('Build Timing', () => {
      it('should track build start and end', () => {
        monitor.startBuild()
        const start = Date.now()

        // Simulate some work
        let sum = 0
        for (let i = 0; i < 1000; i++) {
          sum += i
        }

        const duration = monitor.endBuild()
        const end = Date.now()

        expect(duration).toBeGreaterThanOrEqual(0)
        expect(duration).toBeLessThanOrEqual(end - start + 10)
      })

      it('should return 0 duration when not started', () => {
        const duration = monitor.getBuildDuration()
        expect(duration).toBe(0)
      })

      it('should return 0 duration when only started but not ended', () => {
        monitor.startBuild()
        const duration = monitor.getBuildDuration()
        expect(duration).toBe(0)
      })

      it('should calculate duration correctly', () => {
        monitor.startBuild()
        const duration = monitor.endBuild()
        expect(monitor.getBuildDuration()).toBe(duration)
      })
    })

    describe('Metrics Recording', () => {
      it('should record metrics', () => {
        const metrics: Omit<PerformanceMetrics, 'timestamp'> = {
          buildTime: 100,
          cssSize: {
            original: 1000,
            optimized: 500,
          },
          classStats: {
            total: 10,
            used: 8,
            unused: 2,
          },
          optimization: {
            merged: 3,
            deduplicated: 2,
            treeShaken: 2,
          },
        }

        monitor.recordMetrics(metrics)

        const latest = monitor.getLatestMetrics()
        expect(latest).toBeDefined()
        expect(latest?.buildTime).toBe(100)
        expect(latest?.cssSize.original).toBe(1000)
        expect(latest?.cssSize.optimized).toBe(500)
        expect(latest).toHaveProperty('timestamp')
      })

      it('should limit metrics to 100 builds', () => {
        for (let i = 0; i < 150; i++) {
          monitor.recordMetrics({
            buildTime: i,
            cssSize: { original: 1000, optimized: 500 },
            classStats: { total: 10, used: 8, unused: 2 },
            optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
          })
        }

        const allMetrics = monitor.getAllMetrics()
        expect(allMetrics.length).toBe(100)
      })

      it('should record metrics with gzipped size', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: {
            original: 1000,
            optimized: 500,
            gzipped: 200,
          },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const latest = monitor.getLatestMetrics()
        expect(latest?.cssSize.gzipped).toBe(200)
      })
    })

    describe('Statistics', () => {
      it('should calculate average build time', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        monitor.recordMetrics({
          buildTime: 200,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        monitor.recordMetrics({
          buildTime: 300,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        expect(monitor.getAverageBuildTime()).toBe(200)
      })

      it('should return 0 for average build time when no metrics', () => {
        expect(monitor.getAverageBuildTime()).toBe(0)
      })

      it('should calculate average CSS size', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 2000, optimized: 1000 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const avgSize = monitor.getAverageCSSSize()

        expect(avgSize.original).toBe(1500)
        expect(avgSize.optimized).toBe(750)
        expect(avgSize.savedPercentage).toBe(50)
      })

      it('should return zeros for average CSS size when no metrics', () => {
        const avgSize = monitor.getAverageCSSSize()

        expect(avgSize.original).toBe(0)
        expect(avgSize.optimized).toBe(0)
        expect(avgSize.savedPercentage).toBe(0)
      })

      it('should get latest metrics', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        monitor.recordMetrics({
          buildTime: 200,
          cssSize: { original: 2000, optimized: 1000 },
          classStats: { total: 20, used: 18, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const latest = monitor.getLatestMetrics()
        expect(latest?.buildTime).toBe(200)
        expect(latest?.cssSize.original).toBe(2000)
      })

      it('should return null for latest metrics when no data', () => {
        expect(monitor.getLatestMetrics()).toBeNull()
      })

      it('should get all metrics', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        monitor.recordMetrics({
          buildTime: 200,
          cssSize: { original: 2000, optimized: 1000 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const allMetrics = monitor.getAllMetrics()
        expect(allMetrics).toHaveLength(2)
        expect(allMetrics[0]?.buildTime).toBe(100)
        expect(allMetrics[1]?.buildTime).toBe(200)
      })
    })

    describe('Report Generation', () => {
      it('should generate performance report', () => {
        monitor.recordMetrics({
          buildTime: 1500,
          cssSize: {
            original: 10240,
            optimized: 5120,
            gzipped: 2048,
          },
          classStats: {
            total: 100,
            used: 80,
            unused: 20,
          },
          optimization: {
            merged: 10,
            deduplicated: 5,
            treeShaken: 20,
          },
        })

        const report = monitor.generateReport()

        expect(report).toContain('Performance Report')
        expect(report).toContain('BUILD TIME')
        expect(report).toContain('CSS SIZE')
        expect(report).toContain('CLASS USAGE')
        expect(report).toContain('OPTIMIZATION')
        expect(report).toContain('1.50s')
        expect(report).toContain('10.0KB')
        expect(report).toContain('5.0KB')
        expect(report).toContain('2.0KB')
        expect(report).toContain('80.0%')
      })

      it('should handle small file sizes in bytes', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: {
            original: 512,
            optimized: 256,
          },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const report = monitor.generateReport()
        expect(report).toContain('512B')
        expect(report).toContain('256B')
      })

      it('should handle large file sizes in MB', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: {
            original: 2 * 1024 * 1024,
            optimized: 1 * 1024 * 1024,
          },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const report = monitor.generateReport()
        expect(report).toContain('MB')
      })

      it('should handle time < 1 second', () => {
        monitor.recordMetrics({
          buildTime: 500,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const report = monitor.generateReport()
        expect(report).toContain('500ms')
      })

      it('should return message when no data', () => {
        const report = monitor.generateReport()
        expect(report).toBe('No performance data available')
      })

      it('should not include gzipped size when not provided', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: {
            original: 1000,
            optimized: 500,
          },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const report = monitor.generateReport()
        const gzippedLines = report.split('\n').filter((line) => line.includes('Gzipped'))
        expect(gzippedLines.length).toBe(0)
      })
    })

    describe('Export', () => {
      it('should export metrics as JSON', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        const json = monitor.exportJSON()
        const parsed = JSON.parse(json)

        expect(Array.isArray(parsed)).toBe(true)
        expect(parsed[0]).toHaveProperty('buildTime')
        expect(parsed[0]).toHaveProperty('cssSize')
        expect(parsed[0]).toHaveProperty('timestamp')
      })

      it('should export empty array when no metrics', () => {
        const json = monitor.exportJSON()
        const parsed = JSON.parse(json)
        expect(parsed).toEqual([])
      })
    })

    describe('Clear', () => {
      it('should clear all metrics', () => {
        monitor.recordMetrics({
          buildTime: 100,
          cssSize: { original: 1000, optimized: 500 },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        })

        monitor.startBuild()

        monitor.clear()

        expect(monitor.getAllMetrics()).toHaveLength(0)
        expect(monitor.getBuildDuration()).toBe(0)
      })
    })
  })

  describe('BuildReporter', () => {
    let monitor: PerformanceMonitor
    let reporter: BuildReporter

    beforeEach(() => {
      monitor = new PerformanceMonitor()
      reporter = new BuildReporter(monitor, false)
    })

    it('should create reporter with monitor', () => {
      expect(reporter).toBeDefined()
    })

    it('should report start when verbose', () => {
      const verboseReporter = new BuildReporter(monitor, true)
      const originalLog = console.log
      let logged = false

      console.log = () => {
        logged = true
      }

      verboseReporter.reportStart()

      console.log = originalLog
      expect(logged).toBe(true)
    })

    it('should not report start when not verbose', () => {
      const originalLog = console.log
      let logged = false

      console.log = () => {
        logged = true
      }

      reporter.reportStart()

      console.log = originalLog
      expect(logged).toBe(false)
    })

    it('should report completion', () => {
      const originalLog = console.log
      const logs: string[] = []

      console.log = (...args: any[]) => {
        logs.push(args.join(' '))
      }

      const report: BuildReport = {
        duration: 1000,
        cssGenerated: '5.0KB',
        classesUsed: 80,
        classesTotal: 100,
        optimization: {
          savings: 50,
          techniques: ['minification', 'tree-shaking'],
        },
      }

      reporter.reportComplete(report)

      console.log = originalLog

      const output = logs.join('\n')
      expect(output).toContain('build complete')
      expect(output).toContain('1000ms')
      expect(output).toContain('5.0KB')
      expect(output).toContain('80 / 100')
      expect(output).toContain('50.0%')
      expect(output).toContain('minification')
      expect(output).toContain('tree-shaking')
    })

    it('should report error', () => {
      const originalError = console.error
      const errors: string[] = []

      console.error = (...args: any[]) => {
        errors.push(args.join(' '))
      }

      reporter.reportError(new Error('Test error'))

      console.error = originalError

      expect(errors[0]).toContain('build failed')
      expect(errors[0]).toContain('Test error')
    })

    it('should report error with stack when verbose', () => {
      const verboseReporter = new BuildReporter(monitor, true)
      const originalError = console.error
      const errors: string[] = []

      console.error = (...args: any[]) => {
        errors.push(args.join(' '))
      }

      verboseReporter.reportError(new Error('Test error'))

      console.error = originalError

      expect(errors.length).toBeGreaterThan(1)
    })

    it('should report warning', () => {
      const originalWarn = console.warn
      let warned = ''

      console.warn = (msg: string) => {
        warned = msg
      }

      reporter.reportWarning('Test warning')

      console.warn = originalWarn

      expect(warned).toContain('Test warning')
      expect(warned).toContain('⚠️')
    })
  })

  describe('Benchmarker', () => {
    let benchmarker: Benchmarker

    beforeEach(() => {
      benchmarker = new Benchmarker()
    })

    it('should record benchmark results', () => {
      const metrics: PerformanceMetrics = {
        buildTime: 100,
        cssSize: { original: 1000, optimized: 500 },
        classStats: { total: 10, used: 8, unused: 2 },
        optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        timestamp: Date.now(),
      }

      benchmarker.record('test1', metrics)
      expect(benchmarker).toBeDefined()
    })

    it('should compare two benchmarks', () => {
      const metrics1: PerformanceMetrics = {
        buildTime: 200,
        cssSize: { original: 1000, optimized: 600 },
        classStats: { total: 10, used: 8, unused: 2 },
        optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        timestamp: Date.now(),
      }

      const metrics2: PerformanceMetrics = {
        buildTime: 100,
        cssSize: { original: 1000, optimized: 400 },
        classStats: { total: 10, used: 8, unused: 2 },
        optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        timestamp: Date.now(),
      }

      benchmarker.record('slow', metrics1)
      benchmarker.record('fast', metrics2)

      const comparison = benchmarker.compare('slow', 'fast')

      expect(comparison).toBeDefined()
      expect(comparison?.buildTime.faster).toBe('fast')
      expect(comparison?.buildTime.diff).toBe(50)
      expect(comparison?.cssSize.smaller).toBe('fast')
    })

    it('should return null when comparing non-existent benchmarks', () => {
      const comparison = benchmarker.compare('nonexistent1', 'nonexistent2')
      expect(comparison).toBeNull()
    })

    it('should return null when one benchmark does not exist', () => {
      const metrics: PerformanceMetrics = {
        buildTime: 100,
        cssSize: { original: 1000, optimized: 500 },
        classStats: { total: 10, used: 8, unused: 2 },
        optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        timestamp: Date.now(),
      }

      benchmarker.record('test', metrics)

      const comparison = benchmarker.compare('test', 'nonexistent')
      expect(comparison).toBeNull()
    })

    it('should generate comparison report', () => {
      const metrics1: PerformanceMetrics = {
        buildTime: 200,
        cssSize: { original: 1000, optimized: 600 },
        classStats: { total: 10, used: 8, unused: 2 },
        optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        timestamp: Date.now(),
      }

      const metrics2: PerformanceMetrics = {
        buildTime: 100,
        cssSize: { original: 1000, optimized: 400 },
        classStats: { total: 10, used: 8, unused: 2 },
        optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
        timestamp: Date.now(),
      }

      benchmarker.record('v1', metrics1)
      benchmarker.record('v2', metrics2)

      const report = benchmarker.generateComparisonReport()

      expect(report).toContain('Benchmark Comparison')
      expect(report).toContain('v1 vs v2')
      expect(report).toContain('faster')
      expect(report).toContain('smaller')
    })

    it('should return message when less than 2 benchmarks', () => {
      const report = benchmarker.generateComparisonReport()
      expect(report).toBe('Need at least 2 benchmarks to compare')
    })

    it('should handle multiple benchmarks in report', () => {
      for (let i = 1; i <= 3; i++) {
        benchmarker.record(`v${i}`, {
          buildTime: 100 * i,
          cssSize: { original: 1000, optimized: 500 * i },
          classStats: { total: 10, used: 8, unused: 2 },
          optimization: { merged: 0, deduplicated: 0, treeShaken: 0 },
          timestamp: Date.now(),
        })
      }

      const report = benchmarker.generateComparisonReport()

      expect(report).toContain('v1 vs v2')
      expect(report).toContain('v2 vs v3')
    })
  })
})
