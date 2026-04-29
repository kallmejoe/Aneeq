import {db} from "../../utils/db"

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {name,description,professor_id,active}=body
    if (!name) {
        return {
            success: false,
            message: 'Course name is required'
        }
    }
    try{
        const result = db.prepare(`
            INSERT INTO courses (name, description, professor_id, active)
            VALUES (?, ?, ?, ?)
            `).run(name, description || null, professor_id || null, active ? 1 : 0)
        return {
        success: true,
        courseId: result.lastInsertRowid
        }
    }catch(err){
        console.error("course post Error:", err);
        return { success: false, message: "Invalid course upload " };
    }

})