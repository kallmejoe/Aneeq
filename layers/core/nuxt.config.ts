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
  serverDir: new URL('../../server', import.meta.url).pathname,

  css: [
    '@core/app/assets/css/main.css',
  ],

  // Stable alias for shared layer imports.
  alias: {
    '@core': new URL('../..', import.meta.url).pathname + 'layers/core',
  },
})