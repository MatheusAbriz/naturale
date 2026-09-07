import postgres from "postgres";
import pool from "../Model/pool.js";
import { Comments } from '../types/comments/index.js';
import { Filters } from "../types/shared/index.js";

// Ler todos os comentários de um post (Não precisa de alteração)
export async function getByPost(postId: string | number, filters: Filters) {
  const { page, limit } = filters;
  const offset = (page - 1) * limit;
  
  try {
    const results = await pool`
      SELECT 
        c.id,
        c.text,
        c.created_at,
        c.edited,
        c.parent_comment_id,
        u.id AS user_id,
        u.name,
        u.username,
        u.avatar
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${postId} AND c.status = TRUE
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await pool`
      SELECT COUNT(*) 
      FROM comments c
      WHERE c.post_id = ${postId} AND c.status = TRUE
    `;

    const total = Number(totalResult[0].count);

    if (!results.length) {
      return { 
        status: true,  
        msg: [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    }

    const map = new Map();
    const roots: postgres.Row[] = [];

    results.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    results.forEach((c) => {
      const current = map.get(c.id);
      if (c.parent_comment_id && map.has(c.parent_comment_id)) {
        const parent = map.get(c.parent_comment_id);
        parent.replies.push(current);
      } else if (!c.parent_comment_id) {
        roots.push(current);
      }
    });

    const sortReplies = (comments: Comments[]) => {
      comments.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      comments.forEach(c => {
        if (c.replies && c.replies.length > 0) {
          sortReplies(c.replies);
        }
      });
    };

    roots.forEach(root => {
      if (root.replies.length > 0) {
        sortReplies(root.replies);
      }
    });

    roots.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { 
      status: true, 
      msg: roots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      } 
    };

  } catch (err) {
    console.log("Erro ao buscar comentários:", err);
    return { status: false, msg: "Erro na requisição" };
  }
}

// Adicionar um comentário (Não precisa de alteração)
export async function add(userId: number | string, postId: number | string, text: string) {
  try {
    const result = await pool`
      INSERT INTO comments (user_id, post_id, text)
      VALUES (${userId}, ${postId}, ${text})
      RETURNING *
    `;

    return { status: true, msg: result[0] };
  } catch (err) {
    console.log("Erro ao adicionar comentário:", err);
    return { status: false, msg: "Erro ao adicionar comentário" };
  }
}

// Editar um comentário (HARDENING: Adicionado userId para validar o dono do recurso)
export async function edit(commentId: number | string, newText: string, userId: number | string) {
  try {
    const result = await pool`
      UPDATE comments
      SET text = ${newText}, edited = TRUE
      WHERE id = ${commentId} AND user_id = ${userId}
      RETURNING *
    `;

    if (result.count >= 1) {
      return { status: true, msg: result[0] };
    }

    return { status: false, msg: "Comentário não encontrado ou não autorizado" };
  } catch (err) {
    console.log("Erro ao editar comentário:", err);
    return { status: false, msg: "Erro ao editar comentário" };
  }
}

// Excluir um comentário (HARDENING: Verifica se quem está a apagar o comentário pai é realmente o dono dele)
export async function remove(commentId: number | string, userId: number | string) {
  try {
    // Primeiro valida se o comentário de origem pertence ao utilizador
    const checkOwner = await pool`
      SELECT id FROM comments WHERE id = ${commentId} AND user_id = ${userId}
    `;

    if (checkOwner.length === 0) {
      return { status: false, msg: "Comentário não encontrado ou não autorizado" };
    }

    await pool`
      WITH RECURSIVE comments_to_delete AS (
        SELECT id
        FROM comments
        WHERE id = ${commentId}

        UNION ALL

        SELECT c.id
        FROM comments c
        INNER JOIN comments_to_delete cte
          ON c.parent_comment_id = cte.id
      )
      DELETE FROM comments
      WHERE id IN (SELECT id FROM comments_to_delete)
    `;

    return { status: true, msg: "Comentário e suas respostas excluídos com sucesso" };

  } catch (err) {
    console.log("Erro ao excluir comentário:", err);
    return { status: false, msg: "Erro ao excluir comentário" };
  }
}

// Adicionar resposta (Não precisa de alteração)
export async function addReply(postId: number | string, userId: number | string, text: string, parentCommentId: number | string) {
  try {
    const parent = await pool`
      SELECT id FROM comments WHERE id = ${parentCommentId}
    `;

    if (parent.length === 0) {
      return {
        status: false,
        msg: "Não é possível responder a um comentário que não existe."
      };
    }

    const result = await pool`
      INSERT INTO comments (post_id, user_id, text, parent_comment_id)
      VALUES (${postId}, ${userId}, ${text}, ${parentCommentId})
      RETURNING *
    `;

    return { status: true, msg: result[0] };

  } catch (err) {
    console.log("Erro ao adicionar resposta:", err);
    return { status: false, msg: "Erro ao adicionar resposta" };
  }
}

// Listar respostas (Não precisa de alteração)
export async function getReplies(parentCommentId: number | string) {
  try {
    const results = await pool`
      SELECT 
        c.id,
        c.text,
        c.created_at,
        c.edited,
        u.id AS user_id,
        u.name,
        u.username,
        u.avatar
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.parent_comment_id = ${parentCommentId}
      ORDER BY c.created_at ASC
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

// Editar resposta (HARDENING: Adicionado userId para validar dono da resposta)
export async function editReply(commentId: number | string, newText: number | string, userId: number | string) {
  try {
    const result = await pool`
      UPDATE comments
      SET text = ${newText}, edited = TRUE
      WHERE id = ${commentId}
        AND user_id = ${userId}
        AND parent_comment_id IS NOT NULL
      RETURNING *
    `;

    if (result.count >= 1) {
      return { status: true, msg: result[0] };
    }

    return {
      status: false,
      msg: "Resposta não encontrada ou não autorizada"
    };
  } catch (err) {
    console.log("Erro ao editar resposta:", err);
    return { status: false, msg: "Erro ao editar resposta" };
  }
}

// Excluir resposta (HARDENING: Adicionado userId para validar dono da resposta)
export async function deleteReply(commentId: number | string, userId: number | string) {
  try {
    const result = await pool`
      DELETE FROM comments
      WHERE id = ${commentId}
        AND user_id = ${userId}
        AND parent_comment_id IS NOT NULL
    `;

    if (result.count >= 1) {
      return { status: true, msg: "Resposta excluída com sucesso" };
    }

    return { status: false, msg: "Resposta não encontrada ou não autorizada" };
  } catch (err) {
    console.log("Erro ao excluir resposta:", err);
    return { status: false, msg: "Erro ao excluir resposta" };
  }
}
