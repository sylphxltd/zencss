/**
 * Test lightningcss-wasm integration
 * Verifies that WASM optimization works correctly
 */

import { optimizeCSSWithLightning } from './dist/production-node.js'

const testCSS = `
.button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  padding: 0px;
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.button:hover {
  background-color: #ff0000;
}

.card {
  display: flex;
  flex-direction: column;
}
`

async function test() {
  console.log('🧪 Testing lightningcss-wasm optimization...\n')

  try {
    const result = await optimizeCSSWithLightning(testCSS, {
      minify: true,
      production: true,
    })

    console.log('✅ WASM optimization successful!\n')
    console.log('📊 Results:')
    console.log(`   Original size: ${result.savings.originalSize} bytes`)
    console.log(`   Optimized size: ${result.savings.optimizedSize} bytes`)
    console.log(`   Savings: ${result.savings.percentage.toFixed(2)}%\n`)
    console.log('📝 Optimized CSS:')
    console.log(result.optimized)
    console.log('\n✨ Test passed!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

test()
