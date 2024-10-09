// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {
        port: 3000, // default: 3000
        host: '127.0.0.1', // default: localhost
    },

    nitro: {
        devProxy: {
            '/api': { target: 'http://127.0.0.1:8787/api' },
            '/auth': { target: 'http://127.0.0.1:8787/auth' },
            '/data': { target: 'http://127.0.0.1:8787/data' },
            '/live': { target: 'http://127.0.0.1:8787/live' },
            '/1/live': { target: 'http://127.0.0.1:8787/1/live' },
            '/file': { target: 'http://127.0.0.1:8787/file' },
            '/hls': { target: 'http://127.0.0.1:8787/hls' },
        },
    },

    runtimeConfig: {
        public: {
            buildExperimental: process.env.NUXT_BUILD_EXPERIMENTAL,
        },
    },

    ignore: ['**/public/tv-media**', '**/public/Videos**', '**/public/live**', '**/public/home**'],
    ssr: false,

    // debug: true,

    app: {
        head: {
            title: 'LuckyHorn Playout Central MCR',
            meta: [
                {
                    charset: 'utf-8',
                },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Frontend for ffplayout, the 24/7 Rust and playlist based streaming solution.',
                },
            ],
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico',
                },
            ],
        },
    },

    modules: [
        '@nuxt/eslint',
        '@nuxtjs/color-mode',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@vueuse/nuxt',
    ],

    css: ['@/assets/scss/main.scss'],

    colorMode: {
        preference: 'dark', // default value of $colorMode.preference
        fallback: 'system', // fallback value if not system preference found
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        dataValue: 'theme',
        storageKey: 'theme',
    },

    i18n: {
        locales: [
            {
                code: 'it',
                name: 'Italiano',
                file: 'it-IT.js',
            },
            {
                code: 'en',
                name: 'English',
                file: 'en-US.js',
            },

        ],
        customRoutes: 'config',
        pages: {
            player: {
                en: '/player',
                it: '/palinsesto',
            },
            media: {
                en: '/storage',
                it: '/storage',
            },
            message: {
                en: '/messagge',
                it: '/messagi',
            },
            logging: {
                en: '/logging',
                it: '/logging',
            },
            configure: {
                en: '/configure',
                it: '/impostazioni',
            },
        },
        detectBrowserLanguage: {
            useCookie: true,
            alwaysRedirect: true,
        },
        // debug: true,
        langDir: 'i18n/locales',
        defaultLocale: 'it',

        compilation: {
            strictMessage: false,
        },
    },

    vite: {
        build: {
            chunkSizeWarningLimit: 800000,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
    },

    experimental: {
        payloadExtraction: false,
    },

    compatibilityDate: '2024-07-10',
})
