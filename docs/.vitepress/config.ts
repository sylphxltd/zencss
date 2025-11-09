import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Silk',
  description: 'Zero-runtime CSS-in-TypeScript with build-time extraction',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/configuration' },
      { text: 'GitHub', link: 'https://github.com/sylphxltd/silk' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Silk?', link: '/guide/what-is-silk' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Framework Guides',
        items: [
          { text: 'Next.js', link: '/guide/nextjs' },
          { text: 'Vite + React', link: '/guide/vite-react' },
          { text: 'Nuxt 3', link: '/guide/nuxt' },
          { text: 'Other Frameworks', link: '/guide/other-frameworks' }
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'CSS API', link: '/guide/css-api' },
          { text: 'Responsive Design', link: '/guide/responsive' },
          { text: 'Theming', link: '/guide/theming' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: '/api/configuration' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sylphxltd/silk' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 SylphX Ltd'
    }
  }
})
