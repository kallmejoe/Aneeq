import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
// Root config for monorepo - actual app config is in layers/core
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/seo",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt"
  ],

  nitro: {
    preset: 'node'
  },

  alias: {
    '@core': fileURLToPath(new URL('./layers/core', import.meta.url)),
  },

  imports: {
    dirs: ['./layers/core/composables']
  }
});