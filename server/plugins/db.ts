import { db } from "../utils/db"

export default defineNitroPlugin(() => {
  console.log('[Nitro Plugin] Initializing database...')
  try {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('professor', 'student', 'admin'))
    );
    CREATE TABLE IF NOT EXISTS professors_info (
      user_id INTEGER PRIMARY KEY,
      department TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      professor_id INTEGER NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (professor_id) REFERENCES professors_info(user_id) ON DELETE RESTRICT
    );
    `)
    console.log('[Nitro Plugin] Database initialized successfully')
  } catch (err) {
    console.error('[Nitro Plugin] Database error:', err)
  }
})
