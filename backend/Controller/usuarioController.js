import connection from "../Service/Conexao.js";

//Criando minhas funções de CRUD para exportar
export async function selecionarUsuario(id){
    try{
        const [ results ] = await connection.query(
            'SELECT * from `usuario` where `id_usuario` = ?',
            [ id ]
        )

        //Retornando o resultado
        if(results.length >= 1){
            return results
        }
        return false
    }catch(err){
        console.log(err)
    }
}

export async function inserirUsuario(valores){
    
}