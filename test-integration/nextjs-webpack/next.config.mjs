import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Next.js config - using Webpack (default)
}, {
  // Silk config
  outputFile: 'silk.css',
  minify: true,
})
