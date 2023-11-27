export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-quasar-ui',
    '@nuxt/image',
    '@nuxt/devtools',
    '@zadigetvoltaire/nuxt-gtm'
  ],
  runtimeConfig: {
    // FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,

    // The private keys which are only available server-side
    // apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api',
      authCookieName: "__session",
      defaultUserDetail: {
        account: '',
        nickName: '',
        image: '',
        email: '',
        Instagram: '',
        Facebook: ''
      },
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
    }
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_colors.scss" as *;'
        }
      }
    }
  },
  app: {
    head: {
      title: '閱讀存摺 Read PassBook',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  typescript: {
    typeCheck: true
  },
  quasar: {
    plugins: [
      'Notify',
      'Loading',
      'Dialog'
    ],
    extras: {
      fontIcons: [
        'material-icons',
        'line-awesome'
      ]
    }
  },
  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2
    }
  },
  devtools: {
    enabled: true
  },
  image: {
    domains: [
      'firebasestorage.googleapis.com'
    ],
  },
  gtm: {
    id: 'GTM-W2B3NPGP'
  }
})
