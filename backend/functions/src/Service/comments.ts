import postgres from "postgres";
import pool from "../Model/pool.js";
import { Comments } from '../types/comments/index.js';

// Ler todos os comentários de um post
export async function getByPost(postId: string | number) {
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
    `;

    if (!results.length) {
      return { status: true, msg: [] };
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

    return { status: true, msg: roots };

  } catch (err) {
    console.log("Erro ao buscar comentários:", err);
    return { status: false, msg: "Erro na requisição" };
  }
}

// Adicionar um comentário
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

// Editar um comentário
export async function edit(commentId: number | string, newText: string) {
  try {
    const result = await pool`
      UPDATE comments
      SET text = ${newText}, edited = TRUE
      WHERE id = ${commentId}
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
export async function remove(commentId: number | string) {
  try {
    await pool`
      WITH RECURSIVE comments_to_delete AS (
        -- 1. Começa com o comentário que queremos excluir
        SELECT id
        FROM comments
        WHERE id = ${commentId}

        UNION ALL

        -- 2. Encontra recursivamente todos os filhos
        SELECT c.id
        FROM comments c
        INNER JOIN comments_to_delete cte
          ON c.parent_comment_id = cte.id
      )
      -- 3. Deleta todos os IDs encontrados
      DELETE FROM comments
      WHERE id IN (SELECT id FROM comments_to_delete)
    `;

    return { status: true, msg: "Comentário e suas respostas excluídos com sucesso" };

  } catch (err) {
    console.log("Erro ao excluir comentário:", err);
    return { status: false, msg: "Erro ao excluir comentário" };
  }
}

// Adicionar resposta
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

// Listar respostas
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

// Editar resposta
export async function editReply(commentId: number | string, newText: number | string) {
  try {
    const result = await pool`
      UPDATE comments
      SET text = ${newText}, edited = TRUE
      WHERE id = ${commentId}
        AND parent_comment_id IS NOT NULL
      RETURNING *
    `;

    if (result.count >= 1) {
      return { status: true, msg: result[0] };
    }

    return {
      status: false,
      msg: "Resposta não encontrada ou não é uma resposta"
    };
  } catch (err) {
    console.log("Erro ao editar resposta:", err);
    return { status: false, msg: "Erro ao editar resposta" };
  }
}

// Excluir resposta
export async function deleteReply(commentId: number | string) {
  try {
    await pool`
      DELETE FROM comments
      WHERE id = ${commentId}
        AND parent_comment_id IS NOT NULL
    `;

    return { status: true, msg: "Resposta excluída com sucesso" };
  } catch (err) {
    console.log("Erro ao excluir resposta:", err);
    return { status: false, msg: "Erro ao excluir resposta" };
  }
}
