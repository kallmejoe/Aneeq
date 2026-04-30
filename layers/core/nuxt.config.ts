import { fileURLToPath } from 'node:url'

// layers/core/nuxt.config.ts
export default defineNuxtConfig({
  // Disable SSR to avoid IPC connection issues in dev
  ssr: false,
  
  // Components are auto-imported from layers/core/components
  components: [
    { path: './components', pathPrefix: false }
  ],
  // Composables and middleware are auto-imported
  imports: {
    dirs: ['./composables', './middleware']
  },
  
  // Enable pages for page-based routing
  pages: true,

  // Share the repo-level server handlers across each app.
  serverDir: fileURLToPath(new URL('../../server', import.meta.url)),

  css: [
    '@core/app/assets/css/main.css',
  ],

  // Stable alias for shared layer imports.
  alias: {
    '@core': fileURLToPath(new URL('.', import.meta.url)),
  },
})