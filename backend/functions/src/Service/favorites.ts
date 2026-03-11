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
        u.id AS "userId",
        u.name,
        u.username,
        u.avatar,
        u.type
      FROM favorites f
      INNER JOIN post p ON f.post_id = p.id
      INNER JOIN users u ON p.user_id = u.id
      WHERE f.user_id = ${userId}
      ORDER BY p.id DESC
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