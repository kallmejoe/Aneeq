interface course {
    id: string;
    name: string;
    professorID: string;
}



export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const {  name, professorID } = body;
    if (!name || !professorID) {
        return {
            success: false,
            message: "Missing required fields: id, name, professorID"
        }
    }

    try {
        const course: course = {
            id: crypto.randomUUID(),
            name,
            professorID
        }

        const result = db.prepare(
            "INSERT INTO courses (name, professor_id) VALUES (?, ?)"
        ).run(course.name, course.professorID)

        return {
            success: true,
            courseId: result.lastInsertRowid
        }

    }
    catch (err) {
        console.error('[create course] Error:', err)
        return { success: false, message: err || 'Course creation failed' }
    }

})
