import { db } from "./db"

db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY,
 email TEXT,
 password TEXT,
 name TEXT,
 role TEXT,
);
`)
