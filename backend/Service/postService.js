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
export async function atualizarPostCurtida(id){
    try{
        const results = await pool.query("UPDATE post SET qtd_curtidas = qtd_curtidas + 1 WHERE id_post = $1", [id])
        if(results.rowCount >= 1) return true; else return false;
    }catch(err){
        console.log(err)
    }
}