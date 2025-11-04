import pool from "../Model/pool.js";

// Ler todos os comentários de um post
export async function lerComentariosPorPost(idPost) {
    try {
        const results = await pool`
            SELECT 
                c.id_comentario,
                c.texto_comentario,
                c.data_comentario,
                c.editado,
                u.id_usuario,
                u.nome_usuario,
                u.apelido_usuario,
                u.avatar_usuario
            FROM comentarios c
            INNER JOIN usuario u ON c.id_usuario = u.id_usuario
            WHERE c.id_post = ${idPost}
            ORDER BY c.data_comentario DESC
        `;

        if (results.count >= 1) {
            return { status: true, msg: results };
        }

        return { status: true, msg: "Nenhum comentário encontrado" };
    } catch (err) {
        console.log("Erro ao buscar comentários:", err);
        return { status: false, msg: "Erro na requisição" };
    }
}

// Adicionar um comentário
export async function adicionarComentario(idUsuario, idPost, texto) {
    try {
        const result = await pool`
            INSERT INTO comentarios (id_usuario, id_post, texto_comentario)
            VALUES (${idUsuario}, ${idPost}, ${texto})
            RETURNING *
        `;

        return { status: true, msg: result[0] };
    } catch (err) {
        console.log("Erro ao adicionar comentário:", err);
        return { status: false, msg: "Erro ao adicionar comentário" };
    }
}

// Editar um comentário
export async function editarComentario(idComentario, novoTexto) {
    try {
        const result = await pool`
            UPDATE comentarios
            SET texto_comentario = ${novoTexto}, editado = true
            WHERE id_comentario = ${idComentario}
            RETURNING *
        `;

        if (result.count >= 1) {
            return { status: true, msg: result[0] };
        }

        return { status: false, msg: "Comentário não encontrado" };
    } catch (err) {
        console.log("Erro ao editar comentário:", err);
        return { status: false, msg: "Erro ao editar comentário" };
    }
}

// Excluir um comentário
export async function excluirComentario(idComentario) {
    try {
        await pool`DELETE FROM comentarios WHERE id_comentario = ${idComentario}`;
        return { status: true, msg: "Comentário excluído com sucesso" };
    } catch (err) {
        console.log("Erro ao excluir comentário:", err);
        return { status: false, msg: "Erro ao excluir comentário" };
    }
}

// Adicionar resposta
export async function adicionarResposta(id_post, id_usuario, texto_comentario, id_comentario_pai) {
    try {
        const result = await pool`
            INSERT INTO comentarios (id_post, id_usuario, texto_comentario, id_comentario_pai, data_comentario)
            VALUES (${id_post}, ${id_usuario}, ${texto_comentario}, ${id_comentario_pai}, NOW())
            RETURNING *
        `;
        return { status: true, msg: result[0] };
    } catch (err) {
        console.log("Erro ao adicionar resposta:", err);
        return { status: false, msg: "Erro ao adicionar resposta" };
    }
}

// Listar respostas
export async function lerRespostasPorComentario(idComentarioPai) {
    try {
        const results = await pool`
            SELECT 
                c.id_comentario,
                c.texto_comentario,
                c.data_comentario,
                c.editado,
                u.id_usuario,
                u.nome_usuario,
                u.apelido_usuario,
                u.avatar_usuario
            FROM comentarios c
            INNER JOIN usuario u ON c.id_usuario = u.id_usuario
            WHERE c.id_comentario_pai = ${idComentarioPai}
            ORDER BY c.data_comentario ASC
        `;
        if (results.count >= 1) {
            return { status: true, msg: results };
        }
        return { status: false, msg: "Nenhuma resposta encontrada" };
    } catch (err) {
        console.log("Erro ao buscar respostas:", err);
        return { status: false, msg: "Erro na requisição" };
    }
}

// Editar resposta
export async function editarResposta(idComentario, novoTexto) {
    try {
        const result = await pool`
            UPDATE comentarios
            SET texto_comentario = ${novoTexto}, editado = true
            WHERE id_comentario = ${idComentario} AND id_comentario_pai IS NOT NULL
            RETURNING *
        `;
        if (result.count >= 1) {
            return { status: true, msg: result[0] };
        }
        return { status: false, msg: "Resposta não encontrada ou não é uma resposta" };
    } catch (err) {
        console.log("Erro ao editar resposta:", err);
        return { status: false, msg: "Erro ao editar resposta" };
    }
}

// Excluir resposta
export async function excluirResposta(idComentario) {
    try {
        await pool`
            DELETE FROM comentarios
            WHERE id_comentario = ${idComentario} AND id_comentario_pai IS NOT NULL
        `;
        return { status: true, msg: "Resposta excluída com sucesso" };
    } catch (err) {
        console.log("Erro ao excluir resposta:", err);
        return { status: false, msg: "Erro ao excluir resposta" };
    }
}