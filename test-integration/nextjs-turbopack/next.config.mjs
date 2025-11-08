import { withSilk } from '@sylphx/silk-nextjs'

export default withSilk({
  // Next.js config - Turbopack enabled via --turbo flag
}, {
  // Silk config
  outputFile: 'silk.css',
  minify: true,
})
