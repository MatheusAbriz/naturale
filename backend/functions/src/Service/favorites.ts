import pool from "../Model/pool.js";

// Ler favoritos do usuário
export async function get(userId: number | string) {
  try {
    const results = await pool`
      SELECT 
        p.id AS "postId",
        p.title,
        p.text,
        p.ingredients,
        p.image,
        p.time,
        p.likes_count,
        p.status,
        (SELECT COUNT(*) FROM comments c 
          WHERE c.post_id = p.id AND c.status = TRUE
        ) AS "commentCount",
        TRUE AS "isFavorited",
        EXISTS(
          SELECT 1 FROM likes l 
          WHERE l.user_id = ${userId} AND l.post_id = p.id
        ) AS "isLiked",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type
        ) AS user
      FROM favorites f
      INNER JOIN post p ON f.post_id = p.id
      INNER JOIN users u ON p.user_id = u.id
      WHERE f.user_id = ${userId}
      ORDER BY p.id DESC
    `;

    return {
      data: results,
    };

  } catch (err) {
    console.error("Erro ao ler favoritos:", err);
    return false;
  }
}

// Inserir ou remover favorito (toggle)
export async function toggle(userId: number | string, postId: number | string) {
  try {
    const exists = await pool`
      SELECT 1 
      FROM favorites 
      WHERE user_id = ${userId} 
        AND post_id = ${postId}
    `;

    if (exists.count > 0) {
      await pool`
        DELETE FROM favorites 
        WHERE user_id = ${userId} 
          AND post_id = ${postId}
      `;
      return { status: true, msg: "Removed from favorites" };
    }

    await pool`
      INSERT INTO favorites (user_id, post_id)
      VALUES (${userId}, ${postId})
    `;

    return { status: true, msg: "Added to favorites" };

  } catch (err) {
    console.error("Erro ao alternar favorito:", err);
    return { status: false, msg: `${err}` };
  }
}