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
      /*       script: [
        {
          children: `(function(window, document, dataLayerName, id) {
            window[dataLayerName]=window[dataLayerName]||[],window[dataLayerName].push({start:(new Date).getTime(),event:"stg.start"});var scripts=document.getElementsByTagName('script')[0],tags=document.createElement('script');
            function stgCreateCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString();f="; SameSite=Strict"}document.cookie=a+"="+b+d+f+"; path=/"}
            var isStgDebug=(window.location.href.match("stg_debug")||document.cookie.match("stg_debug"))&&!window.location.href.match("stg_disable_debug");stgCreateCookie("stg_debug",isStgDebug?1:"",isStgDebug?14:-1);
            var qP=[];dataLayerName!=="dataLayer"&&qP.push("data_layer_name="+dataLayerName),isStgDebug&&qP.push("stg_debug");var qPString=qP.length>0?("?"+qP.join("&")):"";
            tags.async=!0,tags.src="https://anaga.containers.piwik.pro/"+id+".js"+qPString,scripts.parentNode.insertBefore(tags,scripts);
            !function(a,n,i){a[n]=a[n]||{};for(var c=0;c<i.length;c++)!function(i){a[n][i]=a[n][i]||{},a[n][i].api=a[n][i].api||function(){var a=[].slice.call(arguments,0);"string"==typeof a[0]&&window[dataLayerName].push({event:n+"."+i+":"+a[0],parameters:[].slice.call(arguments,1)})}}(i[c])}(window,"ppms",["tm","cm"]);
            })(window, document, 'dataLayer', '${process.env.PIWIKPRO_ID}');`,
          async: true,
          body: true
        }
      ] */
    }
  },
  modules: [
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/i18n'
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
    debug: true
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
    devOptions: {
      enabled: false,
      type: 'module'
    }
  }
)
