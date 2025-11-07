import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [
    silk({
      babelOptions: {
        production: false, // Use dev mode for now
      },
    }),
    react(),
  ],
  build: {
    commonjsOptions: {
      exclude: ['@babel/core', '@sylphx/babel-plugin-silk', '@sylphx/silk'],
    },
  },
  optimizeDeps: {
    exclude: ['@babel/core', '@sylphx/babel-plugin-silk', '@sylphx/silk', 'lightningcss'],
  },
})
