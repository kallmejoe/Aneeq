import { db } from '../../utils/db'

export default defineEventHandler(async () => {
    try{
        const courses = db.prepare(`
                SELECT
                    c.id,
                    c.name,
                    c.description,
                    c.active,
                    c.created_at,
                    u.id AS professor_id,
                    u.name AS professor_name,
                    u.email AS professor_email,
                    pi.department AS professor_department
                FROM courses c
                JOIN users u ON u.id = c.professor_id
                LEFT JOIN professors_info pi ON pi.user_id = c.professor_id
                WHERE c.active = 1
                ORDER BY c.created_at
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