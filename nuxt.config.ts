import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    css: ['./app/assets/css/main.css'],
    fonts: {
        defaults: {
            weights: [400],
            styles: ['normal', 'italic'],
            subsets: ['cyrillic-ext', 'cyrillic', 'greek-ext', 'greek', 'vietnamese', 'latin-ext', 'latin'],
        },
        providers: {google: false, googleicons: false}
    },
    vite: {
        plugins: [tailwindcss(),],
    },
    modules: ['@nuxt/icon', '@nuxt/ui', '@nuxt/fonts', '@nuxt/content', '@nuxt/image',],
    content: {
        build: {
            markdown: {
                highlight: {
                    theme: {
                        // Default theme (same as single string)
                        default: 'github-light', // Theme used if `html.dark`
                        dark: 'github-dark', // Theme used if `html.sepia`
                        sepia: 'monokai'
                    }
                }
            }
        }, database: {
            type: 'sqlite', filename: '/tmp/content.sqlite'
        }
    }, routeRules: {
        // Use client-side rendering for this route
        '/client-side-route-example': {ssr: false},
    },
})