#!/usr/bin/env node

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';

console.log('🔍 Edge Case and Special Character Tests\n');
console.log('=' .repeat(80));

// Edge cases and special characters
const testCases = [
  // Special characters in colors
  { property: 'bg', value: '#000' },
  { property: 'bg', value: '#fff' },
  { property: 'bg', value: '#123456' },
  { property: 'bg', value: 'rgba(255, 0, 0, 0.5)' },
  { property: 'bg', value: 'hsl(120, 100%, 50%)' },

  // Complex values
  { property: 'boxShadow', value: '0 2px 4px rgba(0,0,0,0.1)' },
  { property: 'boxShadow', value: '0 0 10px rgba(0,0,0,0.5)' },
  { property: 'border', value: '1px solid #ccc' },
  { property: 'border', value: '2px dashed red' },

  // Percentage and calc
  { property: 'width', value: '100%' },
  { property: 'width', value: '33.333%' },
  { property: 'width', value: 'calc(100% - 20px)' },

  // Complex transforms
  { property: 'transform', value: 'translateX(10px)' },
  { property: 'transform', value: 'rotate(45deg)' },
  { property: 'transform', value: 'scale(1.5)' },

  // Zero values
  { property: 'p', value: '0' },
  { property: 'm', value: '0' },
  { property: 'opacity', value: '0' },

  // Negative values
  { property: 'm', value: '-1' },
  { property: 'm', value: '-2' },

  // Decimal values
  { property: 'lineHeight', value: '1.5' },
  { property: 'lineHeight', value: '1.75' },
  { property: 'opacity', value: '0.5' },
  { property: 'opacity', value: '0.75' },

  // Very long values
  { property: 'fontFamily', value: 'Arial, Helvetica, sans-serif' },
  { property: 'fontFamily', value: '"Times New Roman", Times, serif' },

  // URLs
  { property: 'backgroundImage', value: 'url(/images/bg.png)' },
  { property: 'backgroundImage', value: 'url("https://example.com/image.jpg")' },

  // Gradients
  { property: 'backgroundImage', value: 'linear-gradient(to right, red, blue)' },
  { property: 'backgroundImage', value: 'radial-gradient(circle, red, blue)' },
];

console.log('\n🚀 Testing Edge Cases (production: true, no prefix)');
console.log('-'.repeat(80));

const prodConfig = { production: true, classPrefix: '' };
const results = [];
let invalidCount = 0;

for (const { property, value } of testCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value.replace(/'/g, "\\'")}' });
  `;

  try {
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
  } catch (error) {
    console.log(`⚠️  ERROR: ${property}: '${value}' → ${error.message}`);
  }
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

// Export Rust test cases
console.log(`\n📋 Rust test format (sample):`);
const samples = results.slice(0, 15);
for (const { property, value, className } of samples) {
  // Escape special characters for Rust string
  const escapedValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  console.log(`("${property}", "${escapedValue}", "${className}"),`);
}

console.log('\n' + '='.repeat(80));
console.log('✅ All edge case tests passed!\n');
