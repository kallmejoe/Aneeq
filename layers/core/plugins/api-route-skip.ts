export default defineNuxtPlugin((nuxtApp) => {
  // Server-side only plugin
  if (process.server) {
    nuxtApp.hook('vue:error', (error) => {
      // Suppress Vue Router warnings about API route 404s
      if (error.message && error.message.includes('No match found for location')) {
        console.log('[Vue Router]', error.message)
        // Don't throw - let Nitro handle it
        return
      }
    })
  }
})
