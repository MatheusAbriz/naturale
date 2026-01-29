import pool from "../Model/pool.js";
import { CreatePostDTO } from '../types/posts/index.js';

//CRUD DA ENTIDADE POST

//Ler todos os posts
export async function getAll() {
  try {
    const results = await pool`
      SELECT 
        p.id,
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
      INNER JOIN users u ON p.id = u.id
      ORDER BY p.id DESC
    `;

    if (results.count >= 1) {
      return results;
    }

    return false;
  } catch (err) {
    console.error("Erro ao ler posts:", err);
    return false;
  }
}

//Atualizar Post por Curtida
export async function toggleLike(userId: string | number, postId: string | number){
  try{
    const checkLike = await pool`
      SELECT * FROM likes 
      WHERE user_id = ${userId} AND post_id = ${postId}
    `;

    //Se já tiver likes...
    if(checkLike.count > 0){
      await pool`
        DELETE FROM likes 
        WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      
      //Decrementando o like
      await pool`
        UPDATE post 
        SET likes_count = likes_count - 1 
        WHERE id = ${postId}
      `;

      return true;
    }

    //Se não tiver likes, vai adicionar
    await pool`
      INSERT INTO likes(user_id, post_id) 
      VALUES (${userId}, ${postId})
    `;

    //Incrementando a quantidade de likes
    const results = await pool`
      UPDATE post 
      SET likes_count = likes_count + 1 
      WHERE id = ${postId}
    `;

    if(results.count >= 1) return true;
    return false;

  }catch(err){
    return console.log(err);
  }
}

export async function getByTitle(text: string){
  try{
    const results = await pool`
      SELECT 
        p.id,
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
      INNER JOIN usuario u ON p.id = u.id
      WHERE p.title ILIKE '%' || ${text} || '%' 
      ORDER BY p.id_post DESC
    `;

    if (results.count >= 1) {
      return { status: true, msg: results };
    }

    return { status: false, msg: "Nenhum post encontrado" };
  }catch(err){
    console.error("Erro ao selecionar post por título:", err);
    return { status: false, msg: "Erro ao selecionar post por título" };
  }
}

export async function getById(id: number | string){
  try{
    const results = await pool`
      SELECT 
        p.id_post,
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
      INNER JOIN usuario u ON p.id = u.id
      WHERE p.id_post = ${id}
      ORDER BY p.id_post DESC
    `;

    if (results.count >= 1) {
      return { status: true, msg: results };
    }

    return { status: false, msg: "Nenhum post encontrado!" };
  }catch(err){
    console.error("Erro ao selecionar post por título:", err);
    return { status: false, msg: "Erro ao selecionar post por título" };
  }
}

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
        id,
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