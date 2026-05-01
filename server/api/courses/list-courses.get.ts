import { db } from "../../utils/db";

export default defineEventHandler(async (event) => {
  try {
    const courses = db
      .prepare(
        `SELECT c.id, c.name, c.professor_id, c.active, c.description, u.name as professor_name 
       FROM courses c
       LEFT JOIN users u ON c.professor_id = u.id`,
      )
      .all();

    return {
      success: true,
      courses: courses,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error fetching courses",
    };
  }
});
