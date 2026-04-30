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
      return { success: false, message: "Forbidden: only professors can view their assignments" };
    }

    professorId = payload.userId;
  } catch {
    setResponseStatus(event, 401);
    return { success: false, message: "Invalid or expired token" };
  }

  try {
    const assignments = db.prepare(
      `SELECT a.id, a.course_id, a.title, a.description, a.max_score, a.due_date, c.name as course_name
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       WHERE c.professor_id = ?
       ORDER BY a.due_date ASC`
    ).all(professorId);

    return {
      success: true,
      assignments
    };
  } catch (err) {
    console.error("professor-assignments get Error:", err);
    return { success: false, message: "Failed to fetch assignments" };
  }
});
