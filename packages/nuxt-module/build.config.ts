import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/module'],
  declaration: true,
  rollup: {
    emitCJS: false
  },
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    '@sylphx/silk-vite-plugin'
  ]
})
