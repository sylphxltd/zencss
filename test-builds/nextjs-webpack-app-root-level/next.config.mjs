import { withSilk } from '@sylphx/silk-nextjs';

export default withSilk({
  // Next.js config
}, {
  // Silk config - specify root-level app directory
  srcDir: './app',
  debug: true
});
