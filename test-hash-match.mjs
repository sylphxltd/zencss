/**
 * Test: CLI and Babel plugin generate same class names
 */

import { generateClassName } from './packages/core/dist/production.js';
import { hashPropertyValue } from './packages/babel-plugin-silk/dist/utils/hash.js';
import { generateClassName as babelGenerateClassName } from './packages/babel-plugin-silk/dist/generators/class-name.js';

// Test case 1: Simple property
const prop1 = 'display';
const value1 = 'flex';

// CLI hash (runtime)
const styleId1 = `${prop1}-${value1}`;
const cliClassName1 = generateClassName(styleId1, { production: true, shortClassNames: false });

// Babel plugin hash (use production: true to match CLI)
const babelClassName1 = babelGenerateClassName(prop1, value1, { production: true });

console.log('Test 1: display: flex');
console.log('CLI class name:', cliClassName1);
console.log('Babel class name:', babelClassName1);
console.log('Match:', cliClassName1 === babelClassName1 ? '✅' : '❌');
console.log();

// Test case 2: Complex value
const prop2 = 'backgroundColor';
const value2 = '#f0f0f0';

const styleId2 = `${prop2}-${value2}`;
const cliClassName2 = generateClassName(styleId2, { production: true, shortClassNames: false });
const babelClassName2 = babelGenerateClassName(prop2, value2, { production: true });

console.log('Test 2: backgroundColor: #f0f0f0');
console.log('CLI class name:', cliClassName2);
console.log('Babel class name:', babelClassName2);
console.log('Match:', cliClassName2 === babelClassName2 ? '✅' : '❌');
console.log();

// Test case 3: With variant
const prop3 = 'color';
const value3 = 'blue';
const variant3 = 'hover';

const styleId3 = `${prop3}-${value3}${variant3}`;
const cliClassName3 = generateClassName(styleId3, { production: true, shortClassNames: false });
const babelClassName3 = babelGenerateClassName(prop3, value3, { production: true }, variant3);

console.log('Test 3: color: blue (hover)');
console.log('CLI class name:', cliClassName3);
console.log('Babel class name:', babelClassName3);
console.log('Match:', cliClassName3 === babelClassName3 ? '✅' : '❌');
