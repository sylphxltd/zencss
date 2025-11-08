import { sveltekit } from '@sveltejs/kit/vite'
import silk from '@sylphx/silk-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit(), silk({ debug: true })]
})
