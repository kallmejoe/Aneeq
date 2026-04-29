import { db } from '../../utils/db'

export default defineEventHandler(async (event) => {
    try{
        const courses = db.prepare(`
                SELECT id,name,description,professor_id,active,created_at
                FROM courses
                WHERE active=1
                ORDER BY created_at
            `).all()
        return {
            success: true,
            courses
        }
    }catch(err){
        console.error('course get Error:', err);
        return { success: false, message: 'Invalid course read' };
    }
})