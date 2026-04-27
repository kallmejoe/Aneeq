export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { studentId } = body;

  if (!studentId) {
    return {
      success: false,
      message: "Missing required field: studentId"
    }
  }

  try {
    const courses = db.prepare(
      `SELECT c.id, c.name, c.professor_id 
       FROM courses c 
       JOIN enrollments e ON c.id = e.course_id 
       WHERE e.student_id = ?`
    ).all(studentId);
    return {
      success: true,
      courses: courses
    }
  } catch (error) {
    return {
      success: false,
      message: "Error fetching active courses"
    }
  }
})
