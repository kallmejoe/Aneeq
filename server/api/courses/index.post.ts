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
      return { success: false, message: "Forbidden: only professors can create courses" };
    }

    professorId = payload.userId;
  } catch {
    setResponseStatus(event, 401);
    return { success: false, message: "Invalid or expired token" };
  }

  const body = await readBody(event);
  const { name, description, active } = body;

  if (!name) {
    setResponseStatus(event, 400);
    return { success: false, message: "Course name is required" };
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO courses (name, description, professor_id, active)
         VALUES (?, ?, ?, ?)`
      )
      .run(name, description || null, professorId, active === false ? 0 : 1);

    return { success: true, courseId: result.lastInsertRowid };
  } catch (err) {
    console.error("course post Error:", err);
    return { success: false, message: "Failed to create course" };
  }
});
