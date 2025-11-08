#!/usr/bin/env node

import { transformSync } from '@babel/core';
import babelPluginSilk from './packages/babel-plugin-silk/dist/index.js';

const testCases = [
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
  // Typography
  { property: 'fontSize', value: '12px' },
  { property: 'fontSize', value: '14px' },
  { property: 'fontSize', value: '16px' },
  { property: 'fontWeight', value: 'bold' },
  { property: 'fontWeight', value: '400' },
  // Layout
  { property: 'width', value: '100%' },
  { property: 'width', value: '50%' },
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
];

const config = { production: true, classPrefix: '' };

console.log('// Rust test case format:');
for (const { property, value } of testCases) {
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

  console.log(`("${property}", "${value}", "${className}"),`);
}
