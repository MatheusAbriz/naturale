import pool from "../model/pool.js";

//Pega todos os likes e posts
export async function lerTodosLikes(){
    try{
        const results = await pool.query("SELECT * FROM likes")
        
        if(results.rows.length > 0){
            return { status: true, msg: results.rows };
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
        const results = await pool.query("SELECT * FROM likes WHERE id_usuario = $1 AND id_post = $2", [idUsuario, idPost])

        if(results.rows.length > 0){
            return { status: true, msg: results.rows };
        }

        return { status: false, msg: "Sem likes disponíveis" };
    }catch(err){
        return { status: false, msg: "Error!" };
    }
}