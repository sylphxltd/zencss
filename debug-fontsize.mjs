#!/usr/bin/env node

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';
import { murmurHash2, hashPropertyValue } from './packages/babel-plugin-silk/dist/utils/hash.js';

console.log('🔍 Debugging fontSize hash generation\n');
console.log('=' .repeat(80));

const config = { production: true, classPrefix: '' };

const testCases = [
  { property: 'fontSize', value: '12px' },
  { property: 'fontSize', value: '14px' },
  { property: 'fontSize', value: '16px' },
  { property: 'fontSize', value: '18px' },
];

console.log('\n📦 Hash generation details:');
console.log('-'.repeat(80));

for (const { property, value } of testCases) {
  // Direct hash
  const content = `${property}:${JSON.stringify(value)}:`;
  const directHash = murmurHash2(content);
  const hashPropVal = hashPropertyValue(property, value);

  // Generate class name via transform
  const code = `
    import { css } from '@sylphx/silk';
    const test = css({ ${property}: '${value}' });
  `;

  const result = transformSync(code, {
    filename: 'test.tsx',
    plugins: [[babelPluginSilk, config]],
  });

  const match = result.code.match(/const test = "([^"]+)"/);
  const className = match ? match[1] : 'NOT_FOUND';

  console.log(`\nProperty: "${property}", Value: "${value}"`);
  console.log(`  Content: "${content}"`);
  console.log(`  murmurHash2(content): ${directHash}`);
  console.log(`  hashPropertyValue(): ${hashPropVal}`);
  console.log(`  generateClassName(): ${className}`);
  console.log(`  First 8 chars: ${directHash.slice(0, 8)}`);
  console.log(`  After mapping: ${className}`);
}

console.log('\n' + '='.repeat(80));
