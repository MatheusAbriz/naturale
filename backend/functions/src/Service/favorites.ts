import pool from "../Model/pool.js";

// Ler favoritos do usuário
export async function get(userId: number | string) {
    try {
        const results = await pool`
            SELECT 
                p.id_post,
                p.titulo_post,
                p.texto_post,
                p.ingredientes_post,
                p.img_post,
                p.tempo_post,
                p.qtd_curtidas,
                p.status_post,
                u.id_usuario,
                u.nome_usuario,
                u.apelido_usuario,
                u.avatar_usuario,
                u.tipo_usuario
            FROM favoritos f
            INNER JOIN post p ON f.id_post = p.id_post
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
            WHERE f.id_usuario = ${userId}
            ORDER BY p.id_post DESC
        `;
        
        if (results.count >= 1) {
            return { status: true, msg: results };
        }

        return { status: false, msg: "No favorites available" };

    } catch (err) {
        console.error("Erro ao ler favoritos:", err);
        return { status: false, msg: `${err}` };
    }
}

// Inserir ou remover favorito (toggle)
export async function toggle(userId: number | string, postId: number | string) {
    try {
        const exists = await pool`
            SELECT 1 
            FROM favoritos 
            WHERE id_usuario = ${userId} 
              AND id_post = ${postId}
        `;

        if (exists.count > 0) {
            await pool`
                DELETE FROM favoritos 
                WHERE id_usuario = ${userId} 
                  AND id_post = ${postId}
            `;
            return { status: true, msg: "Removed from favorites" };
        }

        await pool`
            INSERT INTO favoritos (id_usuario, id_post)
            VALUES (${userId}, ${postId})
        `;

        return { status: true, msg: "Added to favorites" };

    } catch (err) {
        console.error("Erro ao alternar favorito:", err);
        return { status: false, msg: `${err}` };
    }
}
