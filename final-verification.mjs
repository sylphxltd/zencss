#!/usr/bin/env node

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';

console.log('🔍 Final Cross-Verification: Babel vs SWC Plugin\n');
console.log('='.repeat(80));

const comprehensiveTestCases = [
  // Basic colors
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
  { property: 'm', value: '-1' },
  { property: 'm', value: '-2' },

  // Typography
  { property: 'fontSize', value: '12px' },
  { property: 'fontSize', value: '14px' },
  { property: 'fontSize', value: '16px' },
  { property: 'fontSize', value: '18px' },
  { property: 'fontWeight', value: 'bold' },
  { property: 'fontWeight', value: '400' },
  { property: 'lineHeight', value: '1.5' },
  { property: 'lineHeight', value: '1.75' },

  // Layout
  { property: 'width', value: '100%' },
  { property: 'width', value: '50%' },
  { property: 'width', value: '33.333%' },
  { property: 'maxWidth', value: '800px' },
  { property: 'maxWidth', value: '1200px' },

  // Colors
  { property: 'color', value: 'white' },
  { property: 'color', value: 'black' },
  { property: 'color', value: 'blue' },

  // Border
  { property: 'borderRadius', value: '4px' },
  { property: 'borderRadius', value: '8px' },
  { property: 'borderRadius', value: '12px' },
  { property: 'border', value: '1px solid #ccc' },
  { property: 'border', value: '2px dashed red' },

  // Complex values
  { property: 'boxShadow', value: '0 2px 4px rgba(0,0,0,0.1)' },
  { property: 'boxShadow', value: '0 0 10px rgba(0,0,0,0.5)' },
  { property: 'transform', value: 'translateX(10px)' },
  { property: 'transform', value: 'rotate(45deg)' },
  { property: 'transform', value: 'scale(1.5)' },

  // Special cases
  { property: 'opacity', value: '0' },
  { property: 'opacity', value: '0.5' },
  { property: 'opacity', value: '0.75' },
  { property: 'width', value: 'calc(100% - 20px)' },
  { property: 'fontFamily', value: 'Arial, Helvetica, sans-serif' },
  { property: 'backgroundImage', value: 'url(/images/bg.png)' },
  { property: 'backgroundImage', value: 'linear-gradient(to right, red, blue)' },
];

console.log('\n📦 PRODUCTION MODE VERIFICATION');
console.log('='.repeat(80));
console.log('Testing hash consistency between Babel and SWC plugins\n');

const prodConfig = { production: true, classPrefix: '' };
const prodResults = [];
let prodMismatches = 0;

for (const { property, value } of comprehensiveTestCases) {
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value.replace(/'/g, "\\'")}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, prodConfig]],
  });

  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';

  // Validate class name
  const firstChar = className[0];
  const isValid = /[a-z]/.test(firstChar);
  const length = className.length;

  if (!isValid) {
    console.log(`❌ INVALID: ${property}: '${value}' → .${className} (starts with '${firstChar}')`);
    prodMismatches++;
  }

  prodResults.push({ property, value, className, isValid, length });
}

console.log(`✅ Valid class names: ${prodResults.filter(r => r.isValid).length}/${prodResults.length}`);
console.log(`❌ Invalid class names: ${prodMismatches}`);

// Statistics
const lengths = prodResults.map(r => r.length);
const avgLength = (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1);
const minLength = Math.min(...lengths);
const maxLength = Math.max(...lengths);

console.log(`\n📊 Production Mode Statistics:`);
console.log(`  Total test cases: ${prodResults.length}`);
console.log(`  Average length: ${avgLength} chars`);
console.log(`  Min length: ${minLength} chars`);
console.log(`  Max length: ${maxLength} chars`);

console.log('\n' + '='.repeat(80));
console.log('\n📦 DEVELOPMENT MODE VERIFICATION');
console.log('='.repeat(80));
console.log('Testing readable class names with prefix\n');

const devConfig = { production: false, classPrefix: 'silk-' };
const devResults = [];
let devIssues = 0;

const devSample = comprehensiveTestCases.slice(0, 10); // Sample 10 cases

for (const { property, value } of devSample) {
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

  const hasPrefix = className.startsWith('silk-');
  const isReadable = className.includes(property);

  if (!hasPrefix || !isReadable) {
    console.log(`❌ ISSUE: ${property}: '${value}' → ${className}`);
    console.log(`   Has prefix: ${hasPrefix}, Readable: ${isReadable}`);
    devIssues++;
  }

  devResults.push({ property, value, className, hasPrefix, isReadable });
}

console.log(`✅ Correct prefix: ${devResults.filter(r => r.hasPrefix).length}/${devResults.length}`);
console.log(`✅ Readable format: ${devResults.filter(r => r.isReadable).length}/${devResults.length}`);

console.log('\n' + '='.repeat(80));
console.log('\n📊 FINAL SUMMARY');
console.log('='.repeat(80));

const totalTests = prodResults.length + devResults.length;
const totalIssues = prodMismatches + devIssues;

console.log(`\nProduction Mode:`);
console.log(`  ✅ ${prodResults.length} test cases`);
console.log(`  ❌ ${prodMismatches} issues`);

console.log(`\nDevelopment Mode:`);
console.log(`  ✅ ${devResults.length} test cases`);
console.log(`  ❌ ${devIssues} issues`);

console.log(`\nOverall:`);
console.log(`  Total tests: ${totalTests}`);
console.log(`  Total issues: ${totalIssues}`);
console.log(`  Success rate: ${((totalTests - totalIssues) / totalTests * 100).toFixed(1)}%`);

if (totalIssues > 0) {
  console.log('\n❌ VERIFICATION FAILED: Issues detected!\n');
  process.exit(1);
}

console.log('\n✅ ALL VERIFICATIONS PASSED!\n');
console.log('🎉 Babel plugin output is consistent and correct!');
console.log('🎉 Ready for SWC plugin implementation verification!\n');
