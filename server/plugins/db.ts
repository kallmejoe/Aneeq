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
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      professor_id INTEGER,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `)
    console.log('[Nitro Plugin] Database initialized successfully')
  } catch (err) {
    console.error('[Nitro Plugin] Database error:', err)
  }
})
