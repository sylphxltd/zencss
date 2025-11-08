import { withSilk } from '@sylphx/silk-nextjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we're using webpack, NOT turbopack
  experimental: {
    turbo: undefined
  }
};

export default withSilk(nextConfig, {
  srcDir: path.join(__dirname, 'src'),
  debug: true
});
