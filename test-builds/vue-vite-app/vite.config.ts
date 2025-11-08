import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [vue(), silk({ debug: true })]
})
