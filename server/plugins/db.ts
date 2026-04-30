// Importing init triggers full database schema creation as a side effect
import "../utils/init"

export default defineNitroPlugin(() => {
  console.log('[Nitro Plugin] Database initialized successfully')
})
