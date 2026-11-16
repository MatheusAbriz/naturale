import pool from "../Model/pool.js";
import { Filters } from '../types/shared/index.js';
import { createNotification } from './notifications.js';

// Ler todos os posts
export async function getAll(
  filters: Filters,
  userId: string | number,
  search?: string,
  feedMode: 'discover' | 'following' | 'recommended' = 'discover',
  ingredient?: string,
  maxTime?: number,
  maxCalories?: number,
  minProtein?: number,
  maxCarbs?: number,
  maxFat?: number
) {
  const { page, limit } = filters;
  const offSet = (page - 1) * limit;

  try {
    const hasSearch = search && search.trim().length > 0;
    const isFollowingFeed = !hasSearch && feedMode === 'following';
    const isRecommended = !hasSearch && feedMode === 'recommended';

    // Filtros opcionais da busca avançada (Extra) — combinam com qualquer um dos modos de feed acima
    const ingredientFilter = ingredient ? pool`AND p.ingredients ILIKE ${'%' + ingredient + '%'}` : pool``;
    const maxTimeFilter = maxTime
      ? pool`AND p.time ~ '[0-9]+' AND (regexp_match(p.time, '[0-9]+'))[1]::int <= ${maxTime}`
      : pool``;
    // Um post sem o campo preenchido não entra num filtro nutricional (não dá pra confirmar que atende o critério)
    const nutritionFilter = pool`
      ${maxCalories ? pool`AND p.calories IS NOT NULL AND p.calories <= ${maxCalories}` : pool``}
      ${minProtein ? pool`AND p.protein_g IS NOT NULL AND p.protein_g >= ${minProtein}` : pool``}
      ${maxCarbs ? pool`AND p.carbs_g IS NOT NULL AND p.carbs_g <= ${maxCarbs}` : pool``}
      ${maxFat ? pool`AND p.fat_g IS NOT NULL AND p.fat_g <= ${maxFat}` : pool``}
    `;

    const results = hasSearch ? await pool`
      SELECT
        p.id AS "postId",
        p.title,
        p.text,
        p.ingredients,
        p.image,
        p.time,
        p.likes_count,
        p.status,
        p.calories,
        p.protein_g,
        p.carbs_g,
        p.fat_g,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${userId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${userId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type,
          'isFollowedByMe', EXISTS(SELECT 1 FROM follows fw WHERE fw.follower_id = ${userId} AND fw.followed_id = u.id)
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      WHERE p.title ILIKE ${'%' + search + '%'}
        ${ingredientFilter}
        ${maxTimeFilter}
        ${nutritionFilter}
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offSet}
    ` : isFollowingFeed ? await pool`
      SELECT
        p.id AS "postId",
        p.title,
        p.text,
        p.ingredients,
        p.image,
        p.time,
        p.likes_count,
        p.status,
        p.calories,
        p.protein_g,
        p.carbs_g,
        p.fat_g,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${userId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${userId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type,
          'isFollowedByMe', EXISTS(SELECT 1 FROM follows fw WHERE fw.follower_id = ${userId} AND fw.followed_id = u.id)
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      INNER JOIN follows fo ON fo.followed_id = p.user_id AND fo.follower_id = ${userId}
      WHERE TRUE
        ${ingredientFilter}
        ${maxTimeFilter}
        ${nutritionFilter}
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offSet}
    ` : isRecommended ? await pool`
      SELECT
        p.id AS "postId",
        p.title,
        p.text,
        p.ingredients,
        p.image,
        p.time,
        p.likes_count,
        p.status,
        p.calories,
        p.protein_g,
        p.carbs_g,
        p.fat_g,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${userId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${userId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type,
          'isFollowedByMe', EXISTS(SELECT 1 FROM follows fw WHERE fw.follower_id = ${userId} AND fw.followed_id = u.id)
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      LEFT JOIN follows fo ON fo.followed_id = p.user_id AND fo.follower_id = ${userId}
      WHERE TRUE
        ${ingredientFilter}
        ${maxTimeFilter}
        ${nutritionFilter}
      ORDER BY (fo.follower_id IS NOT NULL) DESC, p.likes_count DESC, p.id DESC
      LIMIT ${limit} OFFSET ${offSet}
    ` : await pool`
      SELECT
        p.id AS "postId",
        p.title,
        p.text,
        p.ingredients,
        p.image,
        p.time,
        p.likes_count,
        p.status,
        p.calories,
        p.protein_g,
        p.carbs_g,
        p.fat_g,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${userId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${userId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type,
          'isFollowedByMe', EXISTS(SELECT 1 FROM follows fw WHERE fw.follower_id = ${userId} AND fw.followed_id = u.id)
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      LEFT JOIN subscription sub ON sub.user_id = p.user_id
        AND sub.plan = 'deluxe'
        AND (
          (sub.status = 'active' AND (sub.current_period_end IS NULL OR sub.current_period_end > now()))
          OR (sub.status = 'canceled' AND sub.current_period_end > now())
        )
      WHERE TRUE
        ${ingredientFilter}
        ${maxTimeFilter}
        ${nutritionFilter}
      ORDER BY (sub.user_id IS NOT NULL) DESC, p.id DESC
      LIMIT ${limit} OFFSET ${offSet}
    `;

    const totalResult = hasSearch
      ? await pool`
          SELECT COUNT(*)
          FROM post p
          WHERE p.title ILIKE ${'%' + search + '%'}
            ${ingredientFilter}
            ${maxTimeFilter}
            ${nutritionFilter}
        `
      : isFollowingFeed
        ? await pool`
            SELECT COUNT(*)
            FROM post p
            INNER JOIN follows fo ON fo.followed_id = p.user_id AND fo.follower_id = ${userId}
            WHERE TRUE
              ${ingredientFilter}
              ${maxTimeFilter}
              ${nutritionFilter}
          `
        : await pool`
            SELECT COUNT(*)
            FROM post p
            WHERE TRUE
              ${ingredientFilter}
              ${maxTimeFilter}
              ${nutritionFilter}
          `;
    const total = Number(totalResult[0].count);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (err) {
    console.error("Erro ao ler posts:", err);
    return false;
  }
}

// Ler posts de um autor específico (usado na tela de perfil)
export async function getByUserId(authorId: string | number, viewerId: string | number, filters: Filters) {
  const { page, limit } = filters;
  const offSet = (page - 1) * limit;

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
        p.calories,
        p.protein_g,
        p.carbs_g,
        p.fat_g,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${viewerId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${viewerId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type,
          'isFollowedByMe', EXISTS(SELECT 1 FROM follows fw WHERE fw.follower_id = ${viewerId} AND fw.followed_id = u.id)
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ${authorId}
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offSet}
    `;

    const totalResult = await pool`
      SELECT COUNT(*) FROM post WHERE user_id = ${authorId}
    `;
    const total = Number(totalResult[0].count);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (err) {
    console.error("Erro ao ler posts do usuário:", err);
    return false;
  }
}

// Atualizar Post por Curtida
export async function toggleLike(userId: string | number, postId: string | number){
  try{
    const checkLike = await pool`
      SELECT * FROM likes 
      WHERE user_id = ${userId} AND post_id = ${postId}
    `;

    if(checkLike.length > 0){
      await pool`
        DELETE FROM likes 
        WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      
      await pool`
        UPDATE post 
        SET likes_count = likes_count - 1 
        WHERE id = ${postId}
      `;

      return true;
    }

    await pool`
      INSERT INTO likes(user_id, post_id) 
      VALUES (${userId}, ${postId})
    `;

    const results = await pool`
      UPDATE post
      SET likes_count = likes_count + 1
      WHERE id = ${postId}
      RETURNING id
    `;

    if (results.length > 0) {
      await createNotification({ type: "like", postId, actorId: userId });
    }

    return results.length > 0;
  }catch(err){
    console.log(err);
    return false;
  }
}

// Buscar posts por título
export async function getByTitle(text: string, filters: Filters){
  const { page, limit } = filters;
  const offset = (page - 1) * limit;

  try{
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
        u.id,
        u.name,
        u.username,
        u.avatar,
        u.type
      FROM post p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.title ILIKE '%' || ${text} || '%' 
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await pool`
      SELECT COUNT(*) FROM post p
      WHERE p.title ILIKE '%' || ${text} || '%' 
    `;
    const total = Number(totalResult[0].count);

    if (results.length > 0) {
      return { 
        status: true, 
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        } 
      };
    }

    return { status: false, msg: "Nenhum post encontrado" };
  }catch(err){
    console.error("Erro ao selecionar post por título:", err);
    return { status: false, msg: "Erro ao selecionar post por título" };
  }
}

// Buscar post por ID
export async function getById(
  id: number | string,
  userId: number | string
) {
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
        p.calories,
        p.protein_g,
        p.carbs_g,
        p.fat_g,

        (SELECT COUNT(*)
          FROM comments c
          WHERE c.post_id = p.id 
          AND c.status = TRUE
        ) AS "commentCount",

        EXISTS(
          SELECT 1 
          FROM likes l 
          WHERE l.user_id = ${userId} 
          AND l.post_id = p.id
        ) AS "isLiked",

        EXISTS(
          SELECT 1 
          FROM favorites f 
          WHERE f.user_id = ${userId} 
          AND f.post_id = p.id
        ) AS "isFavorited",

        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type,
          'isFollowedByMe', EXISTS(SELECT 1 FROM follows fw WHERE fw.follower_id = ${userId} AND fw.followed_id = u.id)
        ) AS user

      FROM post p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.id = ${id}
      LIMIT 1
    `;

    if (results.length === 0) {
      return {
        status: false,
        msg: "Nenhum post encontrado!"
      };
    }

    return {
      status: true,
      data: results[0]
    };

  } catch (err) {
    console.error("Erro ao selecionar post por ID:", err);

    return {
      status: false,
      msg: "Erro ao selecionar post por ID"
    };
  }
}

// Criar novo post
export async function add(postData: Record<string, unknown>){
  const {
    user_id,
    title,
    text,
    ingredients,
    image,
    time,
    status = true,
    calories = null,
    protein_g = null,
    carbs_g = null,
    fat_g = null
  } = postData;

  try{
    await pool`
      INSERT INTO post(
        user_id,
        title,
        text,
        ingredients,
        image,
        time,
        likes_count,
        status,
        calories,
        protein_g,
        carbs_g,
        fat_g
      )
      VALUES (
        ${user_id as string | number},
        ${title as string},
        ${text as string},
        ${ingredients as string},
        ${image as string},
        ${time as string},
        0,
        ${status as boolean},
        ${calories as number | null},
        ${protein_g as number | null},
        ${carbs_g as number | null},
        ${fat_g as number | null}
      )
    `;

    return { status: true, msg: "Post criado com sucesso!" };
  }catch(err){
    console.log(err);
    return { status: false, msg: "Erro ao criar post" };
  }
}

// Editar post (somente o dono)
export async function update(postId: string | number, userId: string | number, postData: Record<string, unknown>) {
  const { title, text, ingredients, image, time, calories = null, protein_g = null, carbs_g = null, fat_g = null } = postData;

  try {
    const result = await pool`
      UPDATE post
      SET
        title = ${title as string},
        text = ${text as string},
        ingredients = ${ingredients as string},
        image = ${image as string},
        time = ${time as string},
        calories = ${calories as number | null},
        protein_g = ${protein_g as number | null},
        carbs_g = ${carbs_g as number | null},
        fat_g = ${fat_g as number | null}
      WHERE id = ${postId} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.count === 0) {
      return { status: false, msg: "Post não encontrado ou não autorizado" };
    }

    return { status: true, msg: "Post atualizado com sucesso!" };
  } catch (err) {
    console.log(err);
    return { status: false, msg: "Erro ao atualizar post" };
  }
}

// Excluir post (somente o dono)
export async function remove(postId: string | number, userId: string | number) {
  try {
    const owned = await pool`
      SELECT id FROM post WHERE id = ${postId} AND user_id = ${userId}
    `;

    if (owned.count === 0) {
      return { status: false, msg: "Post não encontrado ou não autorizado" };
    }

    // A FK de favorites.post_id não tem ON DELETE CASCADE (diferente de likes/comments),
    // então precisa apagar manualmente antes de excluir o post.
    await pool`
      DELETE FROM favorites WHERE post_id = ${postId}
    `;

    await pool`
      DELETE FROM post WHERE id = ${postId} AND user_id = ${userId}
    `;

    return { status: true, msg: "Post excluído com sucesso!" };
  } catch (err) {
    console.log(err);
    return { status: false, msg: "Erro ao excluir post" };
  }
}