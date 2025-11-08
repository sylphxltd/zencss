import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [svelte(), silk({ debug: true })]
})
