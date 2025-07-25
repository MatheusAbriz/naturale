import pool from "../Model/pool.js";

//CRUD DA ENTIDADE POST

//Ler todos os posts
export async function lerTodosPosts(){
    try{
        const results = await pool.query("SELECT * FROM post")
        //Retornando o resultado
        if(results.rows.length >=1 ) return results.rows; else return false;
    }catch(err){
        console.log(err)
    }
}

//Atualizar Post por Curtida
export async function atualizarPostCurtida(idUsuario, idPost){
    try{
        const verificaLike = await pool.query("SELECT * FROM likes WHERE id_usuario = $1 AND id_post = $2", [idUsuario, idPost])

        //Se já tiver likes...
        if(verificaLike.rows.length > 0){
            await pool.query("DELETE FROM likes WHERE id_usuario = $1 AND id_post = $2", [idUsuario, idPost])
            
            //Decrementando o like
            await pool.query("UPDATE post SET qtd_curtidas = qtd_curtidas - 1 WHERE id_post = $1", [idPost])

            return true;
        }

        //Se não tiver likes, vai adicionar
        await pool.query("INSERT INTO likes(id_usuario, id_post) VALUES ($1, $2)", [idUsuario, idPost])
        //Incrementando no a quantidade de likes
        const results = await pool.query("UPDATE post SET qtd_curtidas = qtd_curtidas + 1 WHERE id_post = $1", [idPost])
        if(results.rowCount >= 1) return true; else return false;
    }catch(err){
        console.log(err)
    }
}