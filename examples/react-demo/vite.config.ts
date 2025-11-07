import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    // TODO: Fix ESM module resolution for vite plugin
    // silk({
    //   outputFile: 'silk.css',
    //   inject: true,
    //   minify: true,
    // }),
  ],
  optimizeDeps: {
    exclude: ['@sylphx/silk'],
  },
})
