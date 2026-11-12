import pool from "../Model/pool.js";
import { Filters } from "../types/shared/index.js";

export type NotificationType = "like" | "comment" | "follow" | "mention";

type CreateNotificationInput =
  | { type: "follow"; followedId: number | string; actorId: number | string }
  | { type: "like" | "comment"; postId: number | string; actorId: number | string; commentId?: number | string }
  | { type: "mention"; recipientId: number | string; actorId: number | string; postId: number | string; commentId?: number | string };

export async function createNotification(input: CreateNotificationInput) {
  try {
    let recipientId: number;

    if (input.type === "follow") {
      recipientId = Number(input.followedId);
    } else if (input.type === "mention") {
      recipientId = Number(input.recipientId);
    } else {
      const postResult = await pool`SELECT user_id FROM post WHERE id = ${input.postId}`;
      if (postResult.length === 0) return;
      recipientId = Number(postResult[0].user_id);
    }

    if (recipientId === Number(input.actorId)) return;

    const postId = input.type === "follow" ? null : input.postId;
    const commentId = (input.type === "comment" || input.type === "mention") ? (input.commentId ?? null) : null;

    await pool`
      INSERT INTO notifications (recipient_id, actor_id, type, post_id, comment_id)
      VALUES (${recipientId}, ${input.actorId}, ${input.type}, ${postId}, ${commentId})
    `;
  } catch (err) {
    console.error("Erro ao criar notificação:", err);
  }
}

export async function getNotifications(userId: number | string, filters: Filters) {
  const { page, limit } = filters;
  const offSet = (page - 1) * limit;

  try {
    const results = await pool`
      SELECT
        n.id,
        n.type,
        n.post_id AS "postId",
        n.comment_id AS "commentId",
        n.read,
        n.created_at,
        json_build_object(
          'id', a.id,
          'name', a.name,
          'username', a.username,
          'avatar', a.avatar
        ) AS actor,
        p.title AS "postTitle"
      FROM notifications n
      INNER JOIN users a ON a.id = n.actor_id
      LEFT JOIN post p ON p.id = n.post_id
      WHERE n.recipient_id = ${userId}
      ORDER BY n.created_at DESC
      LIMIT ${limit} OFFSET ${offSet}
    `;

    const totalResult = await pool`SELECT COUNT(*) FROM notifications WHERE recipient_id = ${userId}`;
    const total = Number(totalResult[0].count);

    return {
      data: results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  } catch (err) {
    console.error("Erro ao listar notificações:", err);
    return false;
  }
}

export async function getUnreadCount(userId: number | string) {
  try {
    const result = await pool`
      SELECT COUNT(*) FROM notifications WHERE recipient_id = ${userId} AND read = FALSE
    `;
    return { count: Number(result[0].count) };
  } catch (err) {
    console.error("Erro ao contar notificações não lidas:", err);
    return false;
  }
}

export async function markAllAsRead(userId: number | string) {
  try {
    await pool`
      UPDATE notifications SET read = TRUE WHERE recipient_id = ${userId} AND read = FALSE
    `;
    return { status: true, msg: "Notificações marcadas como lidas" };
  } catch (err) {
    console.error("Erro ao marcar notificações como lidas:", err);
    return { status: false, msg: `${err}` };
  }
}

export async function deleteNotification(id: number | string, userId: number | string) {
  try {
    const result = await pool`
      DELETE FROM notifications WHERE id = ${id} AND recipient_id = ${userId}
    `;
    if (result.count >= 1) return { status: true, msg: "Notificação excluída" };
    return { status: false, msg: "Notificação não encontrada ou não autorizada" };
  } catch (err) {
    console.error("Erro ao excluir notificação:", err);
    return { status: false, msg: `${err}` };
  }
}

export async function deleteAllNotifications(userId: number | string) {
  try {
    await pool`DELETE FROM notifications WHERE recipient_id = ${userId}`;
    return { status: true, msg: "Notificações removidas" };
  } catch (err) {
    console.error("Erro ao excluir notificações:", err);
    return { status: false, msg: `${err}` };
  }
}
