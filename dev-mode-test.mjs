#!/usr/bin/env node

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';

console.log('🔍 Development Mode Consistency Test\n');
console.log('='.repeat(80));

const testCases = [
  { property: 'bg', value: 'red' },
  { property: 'bg', value: 'blue' },
  { property: 'p', value: '8' },
  { property: 'fontSize', value: '16px' },
  { property: 'color', value: 'white' },
  { property: 'maxWidth', value: '800px' },
  { property: 'borderRadius', value: '4px' },
  { property: 'fontWeight', value: 'bold' },
  { property: 'boxShadow', value: '0 2px 4px rgba(0,0,0,0.1)' },
  { property: 'transform', value: 'translateX(10px)' },
];

console.log('\n📦 Development Mode (production: false):');
console.log('-'.repeat(80));

const devConfig = { production: false, classPrefix: 'silk-' };
const results = [];

for (const { property, value } of testCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value.replace(/'/g, "\\'")}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, devConfig]],
  });

  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';

  // In dev mode, class names should be readable (property-value format)
  const isReadable = className.includes(property);
  const hasPrefix = className.startsWith('silk-');

  console.log(`${property}: '${value}'`);
  console.log(`  → ${className}`);
  console.log(`  ✓ Has prefix: ${hasPrefix}`);
  console.log(`  ✓ Readable: ${isReadable}`);
  console.log('');

  results.push({ property, value, className, hasPrefix, isReadable });
}

console.log('='.repeat(80));

const allHavePrefix = results.every(r => r.hasPrefix);
const allReadable = results.every(r => r.isReadable);

console.log(`\n✅ All have prefix: ${allHavePrefix} (${results.filter(r => r.hasPrefix).length}/${results.length})`);
console.log(`✅ All readable: ${allReadable} (${results.filter(r => r.isReadable).length}/${results.length})`);

if (!allHavePrefix || !allReadable) {
  console.log('\n⚠️  FAILED: Development mode output not as expected!');
  process.exit(1);
}

console.log('\n✅ Development mode test passed!\n');
