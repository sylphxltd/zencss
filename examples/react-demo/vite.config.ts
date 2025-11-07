import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import zenCSS from '@sylphx/zencss-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    zenCSS({
      outputFile: 'zencss.css',
      inject: true,
      minify: true,
    }),
  ],
})
