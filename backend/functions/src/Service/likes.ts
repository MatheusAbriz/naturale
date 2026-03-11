import pool from "../Model/pool.js";

// Pega todos os likes
export async function getAll() {
    try {
        const results = await pool`SELECT * FROM likes`;
        
        if (results.count > 0) {
            return { status: true, msg: results };
        }

        return { status: true, msg: 0 };

    } catch (err) {
        console.log(err);
        return { status: false, msg: "Não há likes" };
    }
}

// Verificar se o like existe
export async function get(userId: string | number, postId: string | number) {
    try {
        const results = await pool`
            SELECT * 
            FROM likes 
            WHERE user_id = ${userId} 
              AND post_id = ${postId}
        `;

        if (results.count > 0) {
            return { status: true, msg: results };
        }

        return { status: false, msg: "No likes available" };

    } catch (err) {
        return { status: false, msg: `Error! ${err}` };
    }
}