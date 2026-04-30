import { db } from "../../utils/db";
import { jwtVerify } from 'jose';
import { createError, defineEventHandler, getHeader } from 'h3';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  let studentId: number;
  
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: number; email: string; role: string };
    studentId = payload.userId;
  } catch (err) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

  try {
    const courses = db.prepare(
      `SELECT c.id, c.name, c.professor_id 
       FROM courses c 
       JOIN course_enrollments e ON c.id = e.course_id 
       WHERE e.student_id = ?`
    ).all(studentId);
    return {
      success: true,
      courses: courses
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error fetching active courses"
    }
  }
})
