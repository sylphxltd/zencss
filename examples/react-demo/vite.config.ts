import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import zenCSS from '@sylphx/zencss-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    // TODO: Fix ESM module resolution for vite plugin
    // zenCSS({
    //   outputFile: 'zencss.css',
    //   inject: true,
    //   minify: true,
    // }),
  ],
  optimizeDeps: {
    exclude: ['@sylphx/zencss'],
  },
})
