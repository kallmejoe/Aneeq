import { db } from "../../utils/db"
import { hash } from "bcrypt"

export default defineEventHandler(async (event) => {
  const contentType = getRequestHeader(event, 'content-type')
  console.log('[signup] Content-Type:', contentType)
  console.log('[signup] Method:', event.method)
  console.log('[signup] URL:', event.path)
  
  const body = await readBody(event)
  console.log('[signup] Parsed body:', JSON.stringify(body))
  
  if (!body || Object.keys(body).length === 0) {
    console.log('[signup] No body, returning empty object')
    return { success: false, message: 'Request body is required' }
  }
  
  try {
    const { email, password, name, role } = body
    console.log('[signup] Destructured:', { email, name, role })
    
    if (!email || !password || !name || !role) {
      return {
        success: false,
        message: "Missing required fields: email, password, name, role"
      }
    }

    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email)
    
    if (existingUser) {
      return { success: false, message: "User already exists" }
    }

    const hashedPassword = await hash(password, 10)
    
    const result = db.prepare(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)"
    ).run(email, hashedPassword, name, role)

    console.log('[signup] Success, userId:', result.lastInsertRowid)
    
    return {
      success: true,
      userId: result.lastInsertRowid
    }
  } catch (err:any) {
    console.error('[signup] Error:', err)
    return { success: false, message: err.message || 'Signup failed' }
  }
})
