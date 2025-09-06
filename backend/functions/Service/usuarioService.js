import pool from "../Model/pool.js"

//Criando minhas funções de CRUD para exportar
export async function selecionarUsuario(id){    
            try{
                const results = await pool`SELECT * FROM usuario WHERE id_usuario = ${id}`
                    //Retornando o resultado
                    if(results.count >= 1){
                        return results;
                    }
                    return false
            }catch(err){
                console.log(err)
            }
}

//Selecionar nome_usuario pelo ID
export async function selecionarNomeUsuario(id){
    try{
        const results = await pool`SELECT nome_usuario from usuario WHERE id_usuario = ${id}`
        //Retornando os resultados
        if(results.count >= 1) return results; else return false;
    }catch(err){
        console.log(err)
    }
}

//Login de usuario - Obrigatoriamente trazer id, nome, token e avatar(imagem dele)
export async function logarUsuario(email, senha){
    try{
        const results = await pool`SELECT id_usuario, nome_usuario, email_usuario, tipo_usuario FROM usuario WHERE email_usuario = ${email} AND senha_usuario = ${senha}`

        if(results.count >= 1) return { status: true, msg: results }; else return { status: false, msg: "Usuario ou senha incorretos" };
    }catch(err){
        return { status: false, msg: "Erro na requisição" };
    }
}

export async function adicionarUsuario(usuario){
    try{
        const { nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario } = usuario

        await pool`INSERT INTO usuario(nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario) VALUES (${nome_usuario}, ${telefone_usuario}, ${cpf_usuario}, ${email_usuario}, ${senha_usuario})`
        return true
    }catch(err){
        console.log(err)
    }
}

export async function atualizarNomeUsuario(id, usuario){
    const { nome_usuario } = usuario

    try{
        await pool`UPDATE usuario SET nome_usuario = ${nome_usuario} WHERE id_usuario = ${id}` 
        return true
    }catch(err){
        return false
    }
}

export async function atualizarTelefoneUsuario(id, usuario){
    const { telefone_usuario } = usuario

    try{
        await pool`UPDATE usuario SET telefone_usuario = ${telefone_usuario} WHERE id_usuario = ${id}`
        return true
    }catch(err){
        return false
    }
}

export async function atualizarEmailUsuario(id, usuario){
    const { email_usuario } = usuario

    try{
        await pool`UPDATE usuario SET email_usuario = ${email_usuario} WHERE id_usuario = ${id}` 
        return true
    }catch(err){
        return false
    }
}

export async function atualizarSenhaUsuario(id, usuario){
    const { senha_usuario } = usuario

    try{
        await pool`UPDATE usuario SET senha_usuario = ${senha_usuario} WHERE id_usuario = ${id}` 
        return true
    }catch(err){
        return false
    }
}


export async function deletarUsuario(id){
    try{
        const results = await pool`DELETE FROM usuario WHERE id_usuario = ${id}`
        results.count >= 1 ? true : false
    }catch(err){
        return false
    }
}