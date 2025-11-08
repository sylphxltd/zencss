#!/usr/bin/env node

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';

console.log('🔍 Extended Hash Consistency Tests\n');
console.log('=' .repeat(80));

// Extended test cases including edge cases
const testCases = [
  // Basic properties
  { property: 'bg', value: 'red' },
  { property: 'bg', value: 'blue' },
  { property: 'bg', value: '#ff0000' },
  { property: 'bg', value: 'rgb(255, 0, 0)' },

  // Spacing
  { property: 'p', value: '0' },
  { property: 'p', value: '1' },
  { property: 'p', value: '2' },
  { property: 'p', value: '4' },
  { property: 'p', value: '8' },
  { property: 'p', value: '16' },
  { property: 'm', value: '0' },
  { property: 'm', value: '2' },
  { property: 'm', value: '4' },

  // Typography
  { property: 'fontSize', value: '12px' },
  { property: 'fontSize', value: '14px' },
  { property: 'fontSize', value: '16px' },
  { property: 'fontSize', value: '1rem' },
  { property: 'fontWeight', value: 'bold' },
  { property: 'fontWeight', value: '400' },
  { property: 'fontWeight', value: '700' },
  { property: 'lineHeight', value: '1.5' },

  // Layout
  { property: 'width', value: '100%' },
  { property: 'width', value: '50%' },
  { property: 'width', value: '200px' },
  { property: 'maxWidth', value: '800px' },
  { property: 'maxWidth', value: '1200px' },
  { property: 'minWidth', value: '300px' },

  // Colors
  { property: 'color', value: 'white' },
  { property: 'color', value: 'black' },
  { property: 'color', value: 'blue' },
  { property: 'color', value: '#333' },
  { property: 'color', value: '#000000' },

  // Border
  { property: 'borderRadius', value: '4px' },
  { property: 'borderRadius', value: '8px' },
  { property: 'borderRadius', value: '12px' },
  { property: 'border', value: '1px solid black' },
  { property: 'borderWidth', value: '2px' },

  // Display
  { property: 'display', value: 'flex' },
  { property: 'display', value: 'block' },
  { property: 'display', value: 'inline' },
  { property: 'display', value: 'none' },

  // Position
  { property: 'position', value: 'relative' },
  { property: 'position', value: 'absolute' },
  { property: 'position', value: 'fixed' },

  // Opacity
  { property: 'opacity', value: '0' },
  { property: 'opacity', value: '0.5' },
  { property: 'opacity', value: '1' },

  // Z-index
  { property: 'zIndex', value: '1' },
  { property: 'zIndex', value: '10' },
  { property: 'zIndex', value: '100' },
];

console.log('\n🚀 Production Mode Tests (production: true, no prefix)');
console.log('-'.repeat(80));

const prodConfig = { production: true, classPrefix: '' };
const results = [];
let invalidCount = 0;

for (const { property, value } of testCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, prodConfig]],
  });

  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';
  const firstChar = className[0];
  const isValid = /[a-z]/.test(firstChar);
  const length = className.length;

  if (!isValid) {
    invalidCount++;
    console.log(`❌ INVALID: ${property}: '${value}' → .${className} (starts with '${firstChar}')`);
  }

  results.push({ property, value, className, firstChar, isValid, length });
}

console.log(`\n✅ Valid identifiers: ${results.length - invalidCount}/${results.length}`);
console.log(`❌ Invalid identifiers: ${invalidCount}`);

if (invalidCount > 0) {
  console.log('\n⚠️  FAILED: Some class names are invalid!');
  process.exit(1);
}

// Statistics
const lengths = results.map(r => r.length);
const avgLength = (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1);
const minLength = Math.min(...lengths);
const maxLength = Math.max(...lengths);

console.log(`\n📊 Statistics:`);
console.log(`  Average length: ${avgLength} chars`);
console.log(`  Min length: ${minLength} chars`);
console.log(`  Max length: ${maxLength} chars`);

// Length distribution
const lengthDist = {};
for (const len of lengths) {
  lengthDist[len] = (lengthDist[len] || 0) + 1;
}

console.log(`\n📈 Length distribution:`);
for (const [len, count] of Object.entries(lengthDist).sort((a, b) => a[0] - b[0])) {
  const percent = ((count / results.length) * 100).toFixed(1);
  console.log(`  ${len} chars: ${count} (${percent}%)`);
}

// Export for Rust comparison
console.log(`\n📋 Sample class names for SWC comparison:`);
const samples = results.slice(0, 10);
for (const { property, value, className } of samples) {
  console.log(`  ${property.padEnd(15)} : "${value.padEnd(20)}" → "${className}"`);
}

console.log('\n' + '='.repeat(80));
console.log('✅ All extended tests passed!\n');
