import pool from "../Model/pool.js"

//Criando minhas funções de CRUD para exportar
export async function selecionarUsuario(id){    
            try{
                const results = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id])
                    //Retornando o resultado
                    if(results.rows.length >= 1){
                        return results.rows;
                    }
                    return false
            }catch(err){
                console.log(err)
            }
}

export async function adicionarUsuario(usuario){
    try{
        const { nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario } = usuario
        await pool.query("INSERT INTO usuario(nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario])
        return true
    }catch(err){
        console.log(err)
    }
}

export async function atualizarNomeUsuario(id, usuario){
    const { nome_usuario } = usuario

    try{
        await pool.query("UPDATE usuario SET nome_usuario = $1 WHERE id_usuario = $2", [nome_usuario, id]) 
        return true
    }catch(err){
        return false
    }
}

export async function atualizarTelefoneUsuario(id, usuario){
    const { telefone_usuario } = usuario

    try{
        await pool.query("UPDATE usuario SET telefone_usuario = $1 WHERE id_usuario = $2", [telefone_usuario, id]) 
        return true
    }catch(err){
        return false
    }
}

export async function atualizarEmailUsuario(id, usuario){
    const { email_usuario } = usuario

    try{
        await pool.query("UPDATE usuario SET email_usuario = $1 WHERE id_usuario = $2", [email_usuario, id]) 
        return true
    }catch(err){
        return false
    }
}

export async function atualizarSenhaUsuario(id, usuario){
    const { senha_usuario } = usuario

    try{
        await pool.query("UPDATE usuario SET senha_usuario = $1 WHERE id_usuario = $2", [senha_usuario, id]) 
        return true
    }catch(err){
        return false
    }
}


export async function deletarUsuario(id){
    try{
        const results = await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id])
        results.rowCount >= 1 ? true : false
    }catch(err){
        return false
    }
}