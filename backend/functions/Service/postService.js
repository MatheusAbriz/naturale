import pool from "../Model/pool.js";

//CRUD DA ENTIDADE POST

//Ler todos os posts
export async function lerTodosPosts(){
    try{
        const results = await pool`SELECT * FROM post`;
        //Retornando o resultado
        if(results.length >=1 ) return results; else return false;
    }catch(err){
        console.log(err)
    }
}

//Atualizar Post por Curtida
export async function atualizarPostCurtida(idUsuario, idPost){
    try{
        const verificaLike = await pool`SELECT * FROM likes WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`;

        //Se já tiver likes...
        if(verificaLike.length > 0){
            await pool.query`DELETE FROM likes WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`;
            
            //Decrementando o like
            await pool`UPDATE post SET qtd_curtidas = qtd_curtidas - 1 WHERE id_post = ${idPost}`;

            return true;
        }

        //Se não tiver likes, vai adicionar
        await pool`INSERT INTO likes(id_usuario, id_post) VALUES (${idUsuario}, ${idPost})`;

        //Incrementando no a quantidade de likes
        const results = await pool`UPDATE post SET qtd_curtidas = qtd_curtidas + 1 WHERE id_post = ${idPost}`;
        if(results.length >= 1) return true; else return false;
    }catch(err){
        console.log(err)
    }
}