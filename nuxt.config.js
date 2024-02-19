const APP_TITLE = 'Anaga Pixel'
const DESCRIPTION = 'Create pixel art on any device.'

export default defineNuxtConfig({
  extends: [process.env.PIXEL_LAYER || './base'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: APP_TITLE,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: DESCRIPTION },
        { hid: 'name', property: 'name', content: APP_TITLE },
        { hid: 'description', property: 'description', content: DESCRIPTION },
        { hid: 'image', property: 'image', content: '/og.jpg' },
        { hid: 'og:title', property: 'og:title', content: APP_TITLE },
        { hid: 'og:type', property: 'og:type', content: 'app' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://pixel.anaga.dev'
        },
        { hid: 'og:image', property: 'og:image', content: '/og.png' },
        { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
        { hid: 'og:image:height', property: 'og:image:height', content: '630' },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: `${APP_TITLE} - ${DESCRIPTION}`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: DESCRIPTION
        },
        { hid: 'og:locale', property: 'og:locale', content: 'en_US' },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          property: 'og:title',
          content: APP_TITLE
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: DESCRIPTION
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  },
  plugins: [
    '~/plugins/directives.client',
  ],
  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n',
      redirectOn: 'root'
    },
    strategy: 'prefix_and_default',
  },
  css: [
    '/styles/reset.css',
    '/styles/fonts.css',
    '/styles/global.css',
    '/styles/variables.css'
  ],
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate', 'storeToRefs']
  },
  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    manifest: {
      name: 'Anaga Pixel',
      lang: 'en',
      short_name: 'AnagaPixel',
      description: 'Create pixel art on any device',
      background_color: '#292929',
      theme_color: '#292929',
      homepage_url: 'https://pixel.anaga.dev/',
      id: '/studio',
      start_url: '/studio',
      scope: '/studio',
      display: 'standalone',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      file_handlers: [
        {
          action: '/studio',
          accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'image/openraster': ['.ora']
          }
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,json,svg,png,webp}'],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'NetworkFirst',
        }
      ]
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  }
})
