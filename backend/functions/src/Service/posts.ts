import pool from "../Model/pool.js";
import { CreatePostDTO } from '../types/posts/index.js';
import { Filters } from '../types/shared/index.js';

// CRUD DA ENTIDADE POST

// Ler todos os posts
export async function getAll(filters: Filters, userId: string | number, search?: string) {
  const { page, limit } = filters;
  const offSet = (page - 1) * limit;

  try {
    const hasSearch = search && search.trim().length > 0;

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
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${userId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${userId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      ORDER BY p.id DESC
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
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = TRUE) AS "commentCount",
        EXISTS(SELECT 1 FROM likes l WHERE l.user_id = ${userId} AND l.post_id = p.id) AS "isLiked",
        EXISTS(SELECT 1 FROM favorites f WHERE f.user_id = ${userId} AND f.post_id = p.id) AS "isFavorited",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'type', u.type
        ) AS user
      FROM post p
      INNER JOIN users u ON u.id = p.user_id
      ORDER BY p.id DESC
      LIMIT ${limit} OFFSET ${offSet}
    `;

    const totalResult = hasSearch
      ? await pool`
          SELECT COUNT(*) 
          FROM post p
          WHERE p.title ILIKE ${'%' + search + '%'}
        `
      : await pool`
          SELECT COUNT(*) FROM post
        `;
    const total = Number(totalResult[0].count);

    if (results.length > 0) {
      return {
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

    return false;
  } catch (err) {
    console.error("Erro ao ler posts:", err);
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
          'type', u.type
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
export async function add(postData: CreatePostDTO){
  const {
    userId,
    title,
    text,
    ingredients,
    image,
    time,
    status = true
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
        status
      )
      VALUES (
        ${userId},
        ${title},
        ${text},
        ${ingredients},
        ${image},
        ${time},
        0,
        ${status}
      )
    `;

    return { status: true, msg: "Post criado com sucesso!" };
  }catch(err){
    console.log(err);
    return { status: false, msg: "Erro ao criar post" };
  }
}
