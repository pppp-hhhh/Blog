// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '无趣',
    },
    // 禁用页面过渡动画，避免切换卡顿
    // pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['python', 'javascript', 'typescript', 'vue', 'html', 'css', 'bash', 'json', 'yaml', 'markdown'],
        },
      },
    },
    database: {
      type: 'libsql',
      url: 'file:/tmp/content.db',
    }
  },

  runtimeConfig: {
    notionToken: process.env.NOTION_TOKEN,
    notionDatabaseIds: process.env.NOTION_DATABASE_IDS?.split(',') || [],
    notionDatabaseNames: process.env.NOTION_DATABASE_NAMES?.split(',') || [],
  },

  compatibilityDate: '2025-03-17',

  // 禁用 sourcemap 以避免 Tailwind CSS 警告
  sourcemap: {
    server: false,
    client: false,
  },
})
