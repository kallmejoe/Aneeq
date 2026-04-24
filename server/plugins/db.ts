import { db } from "../utils/db"

export default defineNitroPlugin(() => {
  console.log('[Nitro Plugin] Initializing database...')
  try {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    );
    `)
    console.log('[Nitro Plugin] Database initialized successfully')
  } catch (err) {
    console.error('[Nitro Plugin] Database error:', err)
  }
})
