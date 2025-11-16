import pool from "../Model/pool.js";

//CRUD DA ENTIDADE POST

//Ler todos os posts
export async function lerTodosPosts() {
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
      FROM post p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      ORDER BY p.id_post DESC
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
export async function atualizarPostCurtida(idUsuario, idPost){
    try{
        const verificaLike = await pool`SELECT * FROM likes WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`;

        //Se já tiver likes...
        if(verificaLike.count > 0){
            await pool`DELETE FROM likes WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`;
            
            //Decrementando o like
            await pool`UPDATE post SET qtd_curtidas = qtd_curtidas - 1 WHERE id_post = ${idPost}`;

            return true;
        }

        //Se não tiver likes, vai adicionar
        await pool`INSERT INTO likes(id_usuario, id_post) VALUES (${idUsuario}, ${idPost})`;

        //Incrementando no a quantidade de likes
        const results = await pool`UPDATE post SET qtd_curtidas = qtd_curtidas + 1 WHERE id_post = ${idPost}`;
        if(results.count >= 1) return true; else return false;
    }catch(err){
        console.log(err)
    }
}

export async function lerPostPorTitulo(texto){
  try{
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
      FROM post p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      where p.titulo_post ilike '%' || ${texto} || '%' 
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

export async function lerPostPorId(id){
  try{
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
      FROM post p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      where p.id_post = ${id} 
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

export async function adicionarPost(postData){
    const {
    idUsuario,
    tituloPost,
    textoPost,
    ingredientesPost,
    imgPost,
    tempoPost,
    statusPost = true
  } = postData;
  try{
    await pool`
      INSERT INTO post(id_usuario, titulo_post, texto_post, ingredientes_post, img_post, tempo_post, qtd_curtidas, status_post)
      VALUES (${idUsuario}, ${tituloPost}, ${textoPost}, ${ingredientesPost}, ${imgPost}, ${tempoPost}, 0, ${statusPost})
    `;
    return { status: true, msg: "Post criado com sucesso!" };
  }catch(err){
    console.log(err);
    return { status: false, msg: "Erro ao criar post" };
  }
}