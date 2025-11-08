import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Next.js config - silence Turbopack warning (Silk uses webpack)
  turbopack: {},
}, {
  // Silk config
  outputFile: 'silk.css',
  babelOptions: {
    production: true,  // Production mode - optimal compression
    // No classPrefix = 6-7 char class names (best compression)
  }
})
