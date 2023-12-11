export default defineNuxtConfig({
  experimental: {
    inlineRouteRules: true
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-quasar-ui',
    '@nuxt/image',
    '@nuxt/devtools',
    'nuxt-gtag'
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
        profile: '',
        Instagram: '',
        Facebook: ''
      },
      firestoreImagePrefixUrl: 'https://firebasestorage.googleapis.com/v0/b/read-passbook.appspot.com/o/',
      googleBookImagePrefixUrl: 'http://books.google.com/books/',
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
  tailwindcss: {
    config: {
      theme: {
        screens: {
          'sm': '600px',
          'md': '1024px',
          'lg': '1440px',
          'xl': '1920px',
        }
      }
    }
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
    },
    config: {
      brand: {
        primary: '#0e7490'
      }
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
      'firebasestorage.googleapis.com',
      'books.google.com/books'
    ],
  },
  gtag: {
    id: 'G-VX9T7W0MSE'
  }
})
