import pool from "../Model/pool.js";

export async function lerFavoritos(idUsuario) {
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
            WHERE f.id_usuario = ${idUsuario}
            ORDER BY p.id_post DESC
        `;
        
        if (results.count >= 1) {
            return { status: true, msg: results };
        }
        return { status: false, msg: "Sem favoritos disponíveis" };
    } catch (err) {
        console.error("Erro ao ler favoritos:", err);
        return {  status: false, msg: `${err}` };
    }
}

export async function inserirOuRemoverFavorito(idUsuario, idPost){
    try{
        const existingFavorite = await pool`SELECT * FROM favoritos WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`;

        if (existingFavorite.count > 0) {
            await pool`DELETE FROM favoritos WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`;
            return { status: true, msg: "Post removido dos favoritos" };
        }

        await pool`INSERT INTO favoritos(id_usuario, id_post) VALUES (${idUsuario}, ${idPost})`;

        return { status: true, msg: "" };
    }catch(err){
        console.error("Erro ao inserir favorito:", err);
        return {  status: false, msg: `${err}` };
    }
}