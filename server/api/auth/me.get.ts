import { jwtVerify } from 'jose';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'Unauthorized' };
  }

  const token = authHeader.substring(7);

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: number; email: string; role: string };
    
    const userData = await db.prepare(
      'SELECT id, email, name, role FROM users WHERE id = ?'
    ).get(payload.userId) as Omit<User, 'password'> | null;

    if (!userData) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, user: userData };
  } catch (err) {
    console.error('[me] Error:', err);
    return { success: false, message: 'Invalid token' };
  }
});