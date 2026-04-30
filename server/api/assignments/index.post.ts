import { jwtVerify } from "jose";
import { db } from "../../utils/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return { success: false, message: "Unauthorized" };
  }

  const token = authHeader.substring(7);
  let professorId: number;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: number; email: string; role: string };

    if (payload.role !== "professor") {
      setResponseStatus(event, 403);
      return { success: false, message: "Forbidden: only professors can create assignments" };
    }

    professorId = payload.userId;
  } catch {
    setResponseStatus(event, 401);
    return { success: false, message: "Invalid or expired token" };
  }

  const body = await readBody(event);
  const { course_id, title, description, max_score, due_date } = body;

  if (!course_id || !title || max_score === undefined || !due_date) {
    setResponseStatus(event, 400);
    return { success: false, message: "Missing required fields" };
  }

  // Validate due_date is not in the past
  const dueDateObj = new Date(due_date);
  if (isNaN(dueDateObj.getTime())) {
    setResponseStatus(event, 400);
    return { success: false, message: "Invalid due_date format" };
  }
  
  if (dueDateObj < new Date()) {
    setResponseStatus(event, 400);
    return { success: false, message: "Due date cannot be in the past" };
  }

  try {
    // Verify the professor owns this course
    const course = db.prepare("SELECT id FROM courses WHERE id = ? AND professor_id = ?").get(course_id, professorId);
    
    if (!course) {
      setResponseStatus(event, 403);
      return { success: false, message: "Forbidden: you do not own this course or it doesn't exist" };
    }

    const result = db
      .prepare(
        `INSERT INTO assignments (course_id, title, description, max_score, due_date)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(course_id, title, description || null, max_score, due_date);

    return { success: true, assignmentId: result.lastInsertRowid };
  } catch (err) {
    console.error("assignment post Error:", err);
    return { success: false, message: "Failed to create assignment" };
  }
});
