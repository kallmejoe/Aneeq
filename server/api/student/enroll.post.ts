import { db } from "../../utils/db";
import { jwtVerify } from 'jose';

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

  const body = await readBody(event);
  const { courseIds } = body;

  if (!courseIds || !Array.isArray(courseIds)) {
    return {
      success: false,
      message: "Missing or invalid required field: courseIds (must be an array)"
    };
  }

  try {
    // We use a transaction for batch insert
    const insertEnrollment = db.prepare(
      `INSERT OR IGNORE INTO course_enrollments (student_id, course_id) VALUES (?, ?)`
    );
    
    const enrollMany = db.transaction((ids: number[]) => {
      let count = 0;
      for (const id of ids) {
         const result = insertEnrollment.run(studentId, id);
         count += result.changes;
      }
      return count;
    });

    const addedCount = enrollMany(courseIds);

    return {
      success: true,
      message: `Successfully enrolled in ${addedCount} courses.`,
      addedCount
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error enrolling in courses"
    };
  }
});