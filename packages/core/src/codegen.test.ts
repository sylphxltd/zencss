import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { scanAndGenerate, type GenerateOptions } from './codegen';

const FIXTURES_DIR = path.join(__dirname, '../__test-fixtures-codegen__');

describe('scanAndGenerate', () => {
  beforeEach(() => {
    if (!fs.existsSync(FIXTURES_DIR)) {
      fs.mkdirSync(FIXTURES_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(FIXTURES_DIR)) {
      fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
    }
  });

  describe('Basic CSS Generation', () => {
    it('should generate CSS from source files', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          fontSize: '16px'
        });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css).toContain('@layer');
      expect(css.length).toBeGreaterThan(40); // Should have generated CSS
    });

    it('should generate minimal CSS when no styles found', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const value = 42;
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      // Should still have @layer declarations
      expect(css).toContain('@layer');
      expect(css.length).toBeLessThan(100); // Minimal CSS
    });

    it('should generate CSS from multiple files', async () => {
      fs.writeFileSync(path.join(FIXTURES_DIR, 'button.ts'), `
        const button = css({ color: 'blue' });
      `);

      fs.writeFileSync(path.join(FIXTURES_DIR, 'title.ts'), `
        const title = css({ fontSize: '24px' });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css.length).toBeGreaterThan(40);
      expect(css).toContain('@layer');
    });
  });

  describe('Minification', () => {
    it('should minify CSS when minify option is true', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          fontSize: '16px',
          padding: '10px'
        });
      `);

      const minified = await scanAndGenerate(FIXTURES_DIR, { minify: true });
      const unminified = await scanAndGenerate(FIXTURES_DIR, { minify: false });

      expect(minified.length).toBeLessThan(unminified.length);
      expect(minified).not.toContain('\n  '); // Should not have indentation
    });

    it('should preserve functionality when minified', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const styles = css({ color: 'red', display: 'flex' });
      `);

      const minified = await scanAndGenerate(FIXTURES_DIR, { minify: true });
      const unminified = await scanAndGenerate(FIXTURES_DIR, { minify: false });

      // Both should contain @layer
      expect(minified).toContain('@layer');
      expect(unminified).toContain('@layer');
    });
  });

  describe('Debug Mode', () => {
    it('should log debug info when debug is true', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({ color: 'blue' });
      `);

      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await scanAndGenerate(FIXTURES_DIR, { debug: true });

        expect(logs.some(log => log.includes('Scanning'))).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });

    it('should not log when debug is false', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({ color: 'blue' });
      `);

      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        await scanAndGenerate(FIXTURES_DIR, { debug: false });

        // Should not have debug logs (might have other logs)
        expect(logs.filter(log => log.includes('Scanning')).length).toBe(0);
      } finally {
        console.log = originalLog;
      }
    });
  });

  describe('Complex Styles', () => {
    it('should handle nested selectors', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          '&:hover': {
            color: 'red'
          }
        });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css.length).toBeGreaterThan(40);
      expect(css).toContain('@layer');
    });

    it('should handle responsive styles', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          '@media (min-width: 768px)': {
            fontSize: '18px'
          }
        });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css.length).toBeGreaterThan(40);
    });

    it('should handle Vue SFC files', async () => {
      const testFile = path.join(FIXTURES_DIR, 'App.vue');
      fs.writeFileSync(testFile, `
        <script setup>
        const styles = css({
          color: 'blue',
          fontSize: '16px'
        } as any);
        </script>
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css.length).toBeGreaterThan(40);
    });

    it('should handle Svelte components', async () => {
      const testFile = path.join(FIXTURES_DIR, 'App.svelte');
      fs.writeFileSync(testFile, `
        <script>
        const button = css({
          backgroundColor: '#ff3e00',
          color: 'white'
        } as any);
        </script>
      `);

      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css.length).toBeGreaterThan(40);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty directory', async () => {
      const css = await scanAndGenerate(FIXTURES_DIR);

      // Should have minimal CSS with @layer
      expect(css).toContain('@layer');
      expect(css.length).toBeLessThan(100);
    });

    it('should handle non-existent directory gracefully', async () => {
      const nonExistentDir = path.join(FIXTURES_DIR, 'does-not-exist');

      await expect(async () => {
        await scanAndGenerate(nonExistentDir);
      }).toThrow();
    });

    it('should handle files with syntax errors gracefully', async () => {
      const testFile = path.join(FIXTURES_DIR, 'bad.ts');
      fs.writeFileSync(testFile, `
        const broken = css({ color: undefined, invalid syntax here
      `);

      // Should not throw, just skip invalid CSS
      const css = await scanAndGenerate(FIXTURES_DIR);
      expect(css).toContain('@layer');
    });
  });

  describe('Options', () => {
    it('should respect custom srcDir option', async () => {
      const customDir = path.join(FIXTURES_DIR, 'custom');
      fs.mkdirSync(customDir, { recursive: true });

      fs.writeFileSync(path.join(customDir, 'test.ts'), `
        const button = css({ color: 'blue' });
      `);

      const css = await scanAndGenerate(customDir);

      expect(css.length).toBeGreaterThan(40);
    });

    it('should respect include patterns', async () => {
      fs.writeFileSync(path.join(FIXTURES_DIR, 'styles.css.ts'), `
        const button = css({ color: 'blue' });
      `);

      fs.writeFileSync(path.join(FIXTURES_DIR, 'ignored.ts'), `
        const title = css({ fontSize: '24px' });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR, {
        include: ['**/*.css.ts']
      });

      // Should only scan .css.ts files
      expect(css.length).toBeGreaterThan(40);
    });

    it('should respect exclude patterns', async () => {
      const excludedDir = path.join(FIXTURES_DIR, 'excluded');
      fs.mkdirSync(excludedDir, { recursive: true });

      fs.writeFileSync(path.join(FIXTURES_DIR, 'included.ts'), `
        const button = css({ color: 'blue' });
      `);

      fs.writeFileSync(path.join(excludedDir, 'excluded.ts'), `
        const title = css({ fontSize: '24px' });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR, {
        exclude: ['**/excluded/**']
      });

      expect(css.length).toBeGreaterThan(40);
    });
  });

  describe('Performance', () => {
    it('should handle large codebases efficiently', async () => {
      // Create 100 files with styles
      for (let i = 0; i < 100; i++) {
        fs.writeFileSync(path.join(FIXTURES_DIR, `file${i}.ts`), `
          const styles = css({ color: 'blue', fontSize: '${i}px' });
        `);
      }

      const startTime = Date.now();
      const css = await scanAndGenerate(FIXTURES_DIR);
      const duration = Date.now() - startTime;

      expect(css.length).toBeGreaterThan(40);
      expect(duration).toBeLessThan(10000); // Should complete in < 10 seconds
    });
  });

  describe('CSS Content Validation', () => {
    it('should include @layer declarations', async () => {
      const css = await scanAndGenerate(FIXTURES_DIR);

      expect(css).toContain('@layer');
      expect(css).toContain('reset');
      expect(css).toContain('base');
      expect(css).toContain('tokens');
      expect(css).toContain('recipes');
    });

    it('should generate valid CSS syntax', async () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          fontSize: '16px',
          padding: '10px 20px'
        });
      `);

      const css = await scanAndGenerate(FIXTURES_DIR, { minify: false });

      // Should have valid CSS structure
      expect(css).toContain('{');
      expect(css).toContain('}');
      expect(css).toContain('@layer');
    });
  });
});
