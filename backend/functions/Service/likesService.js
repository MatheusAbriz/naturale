import pool from "../Model/pool.js";

//Pega todos os likes e posts
export async function lerTodosLikes(){
    try{
        const results = await pool`SELECT * FROM likes`
        
        if(results.count > 0){
            return { status: true, msg: results };
        }
        return { status: true, msg: 0 };
    }catch(err){
        console.log(err)
        return { status: false, msg: "Não há likes" };
    }
} 

//Verificar se o likes existe
export async function lerLike(idUsuario, idPost){
    try{
        const results = await pool`SELECT * FROM likes WHERE id_usuario = ${idUsuario} AND id_post = ${idPost}`

        if(results.count > 0){
            return { status: true, msg: results };
        }

        return { status: false, msg: "Sem likes disponíveis" };
    }catch(err){
        return { status: false, msg: "Error!" };
    }
}