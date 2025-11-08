import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { scanSourceFiles } from './scan';

// Test fixtures directory
const FIXTURES_DIR = path.join(__dirname, '../__test-fixtures__');

describe('scanSourceFiles', () => {
  beforeEach(() => {
    // Create fixtures directory
    if (!fs.existsSync(FIXTURES_DIR)) {
      fs.mkdirSync(FIXTURES_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up fixtures
    if (fs.existsSync(FIXTURES_DIR)) {
      fs.rmSync(FIXTURES_DIR, { recursive: true, force: true });
    }
  });

  describe('File Pattern Matching', () => {
    it('should scan .ts files by default', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        import { css } from '@sylphx/silk';
        const styles = css({ color: 'red' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should scan .tsx files by default', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.tsx');
      fs.writeFileSync(testFile, `
        const styles = css({ color: 'blue' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should scan .vue files by default', () => {
      const testFile = path.join(FIXTURES_DIR, 'App.vue');
      fs.writeFileSync(testFile, `
        <script setup>
        const styles = css({ color: 'green' });
        </script>
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should scan .svelte files by default', () => {
      const testFile = path.join(FIXTURES_DIR, 'App.svelte');
      fs.writeFileSync(testFile, `
        <script>
        const styles = css({ color: 'purple' });
        </script>
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should exclude node_modules by default', () => {
      const nodeModulesDir = path.join(FIXTURES_DIR, 'node_modules');
      fs.mkdirSync(nodeModulesDir, { recursive: true });
      fs.writeFileSync(path.join(nodeModulesDir, 'test.ts'), `
        const styles = css({ color: 'red' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(0);
    });

    it('should exclude .next directory by default', () => {
      const nextDir = path.join(FIXTURES_DIR, '.next');
      fs.mkdirSync(nextDir, { recursive: true });
      fs.writeFileSync(path.join(nextDir, 'test.ts'), `
        const styles = css({ color: 'red' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(0);
    });

    it('should support custom include patterns', () => {
      const testFile = path.join(FIXTURES_DIR, 'custom.css.ts');
      fs.writeFileSync(testFile, `
        const styles = css({ color: 'red' });
      `);

      const results = scanSourceFiles({
        srcDir: FIXTURES_DIR,
        include: ['**/*.css.ts']
      });

      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('CSS Extraction', () => {
    it('should extract css() calls', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          fontSize: '16px'
        });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules).toHaveLength(1);
      expect(results[0].cssRules[0].styles).toEqual({
        color: 'blue',
        fontSize: '16px'
      });
    });

    it('should extract css() with "as any" type assertion', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'red',
          padding: '10px'
        } as any);
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules).toHaveLength(1);
      expect(results[0].cssRules[0].styles.color).toBe('red');
    });

    it('should extract css() with "as const" type assertion', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'green'
        } as const);
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules[0].styles.color).toBe('green');
    });

    it('should extract multiple css() calls from one file', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({ color: 'blue' });
        const title = css({ fontSize: '24px' });
        const container = css({ display: 'flex' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules).toHaveLength(3);
    });

    it('should handle nested objects in css()', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue',
          '&:hover': {
            color: 'red'
          }
        });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules[0].styles).toHaveProperty('&:hover');
    });

    it('should skip invalid css() calls gracefully', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const invalid = css({ color: undefined });
        const valid = css({ color: 'blue' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      // Should still extract the valid one
      expect(results).toHaveLength(1);
      expect(results[0].cssRules.length).toBeGreaterThanOrEqual(1);
    });

    it('should extract from Vue SFC', () => {
      const testFile = path.join(FIXTURES_DIR, 'App.vue');
      fs.writeFileSync(testFile, `
        <script setup lang="ts">
        import { css } from '@sylphx/silk'

        const styles = {
          container: css({
            display: 'flex',
            flexDirection: 'column'
          } as any),
          title: css({
            fontSize: '2rem',
            color: '#333'
          } as any)
        }
        </script>

        <template>
          <div :class="styles.container.className">
            <h1 :class="styles.title.className">Hello Vue</h1>
          </div>
        </template>
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules).toHaveLength(2);
      expect(results[0].cssRules[0].styles.display).toBe('flex');
      expect(results[0].cssRules[1].styles.fontSize).toBe('2rem');
    });

    it('should extract from Svelte component', () => {
      const testFile = path.join(FIXTURES_DIR, 'App.svelte');
      fs.writeFileSync(testFile, `
        <script lang="ts">
          import { css } from '@sylphx/silk'

          const button = css({
            backgroundColor: '#ff3e00',
            color: 'white'
          } as any)
        </script>

        <button class={button.className}>
          Click me
        </button>
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules).toHaveLength(1);
      expect(results[0].cssRules[0].styles.backgroundColor).toBe('#ff3e00');
    });
  });

  describe('Location Tracking', () => {
    it('should track line numbers for css() calls', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `// Line 1
// Line 2
const button = css({ color: 'blue' });
// Line 4
const title = css({ fontSize: '24px' });
`);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results[0].cssRules[0].loc?.line).toBeGreaterThan(0);
      expect(results[0].cssRules[1].loc?.line).toBeGreaterThan(results[0].cssRules[0].loc!.line);
    });
  });

  describe('Debug Mode', () => {
    it('should log debug information when enabled', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const styles = css({ color: 'red' });
      `);

      // Capture console output
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => logs.push(args.join(' '));

      try {
        scanSourceFiles({ srcDir: FIXTURES_DIR, debug: true });

        // Should have logged scanning info
        expect(logs.some(log => log.includes('Scanning'))).toBe(true);
        expect(logs.some(log => log.includes('Found'))).toBe(true);
        expect(logs.some(log => log.includes('Extracted'))).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty directory', () => {
      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(0);
    });

    it('should handle files without css() calls', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const value = 42;
        console.log('No CSS here');
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(0);
    });

    it('should handle nested directories', () => {
      const nestedDir = path.join(FIXTURES_DIR, 'components', 'buttons');
      fs.mkdirSync(nestedDir, { recursive: true });

      fs.writeFileSync(path.join(nestedDir, 'Button.tsx'), `
        const styles = css({ color: 'blue' });
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle "satisfies" type assertion', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const button = css({
          color: 'blue'
        } satisfies StyleObject);
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules[0].styles.color).toBe('blue');
    });

    it('should handle whitespace variations', () => {
      const testFile = path.join(FIXTURES_DIR, 'test.ts');
      fs.writeFileSync(testFile, `
        const a = css({color:'red'});
        const b = css(  {  color  :  'blue'  }  );
        const c = css(
          {
            color: 'green'
          }
        );
      `);

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      expect(results).toHaveLength(1);
      expect(results[0].cssRules).toHaveLength(3);
    });
  });

  describe('Performance', () => {
    it('should handle large number of files efficiently', () => {
      const startTime = Date.now();

      // Create 50 test files
      for (let i = 0; i < 50; i++) {
        fs.writeFileSync(path.join(FIXTURES_DIR, `test${i}.ts`), `
          const styles = css({ color: 'blue' });
        `);
      }

      const results = scanSourceFiles({ srcDir: FIXTURES_DIR });
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(50);
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });
  });
});
