
import pool from "../Model/pool.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

//Criando minhas funções de CRUD para exportar
export async function selecionarUsuario(id) {
    try {
        const results = await pool`SELECT * FROM usuario WHERE id_usuario = ${id}`
        //Retornando o resultado
        if (results.count >= 1) {
            return results;
        }
        return false
    } catch (err) {
        console.log(err)
    }
}

//Selecionar nome_usuario pelo ID
export async function selecionarNomeUsuario(id) {
    try {
        const results = await pool`SELECT nome_usuario from usuario WHERE id_usuario = ${id}`
        //Retornando os resultados
        if (results.count >= 1) return results; else return false;
    } catch (err) {
        console.log(err)
    }
}

// Login de usuário com autenticação JWT
export async function logarUsuario(email, senha) {
    try {
        const results = await pool`SELECT id_usuario, nome_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario FROM usuario WHERE email_usuario = ${email}`;

        if (results.count === 0) {
            return { status: false, msg: "Usuário não encontrado" };
        }

        const usuario = results[0];

        // Verificar senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, usuario.senha_usuario);
        if (!senhaValida) {
            return { status: false, msg: "Senha incorreta" };
        }

        // Criar token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, tipo: usuario.tipo_usuario },
            SECRET,
            { expiresIn: "5h" }
        );

        return {
            status: true,
            msg: "Login realizado com sucesso",
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nome_usuario,
                tipo: usuario.tipo_usuario,
                avatar: usuario.avatar_usuario,
                token
            }
        };
    } catch (err) {
        console.log(err);
        return { status: false, msg: "Erro na requisição" };
    }
}

// Adicionar usuário com senha criptografada
export async function adicionarUsuario(usuario) {
    try {
        const { nome_usuario, apelido_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario } = usuario;

        // Verifica se o email já está cadastrado
        const existingUser = await pool`SELECT * FROM usuario WHERE email_usuario = ${email_usuario}`;
        if (existingUser.count > 0) {
            return { status: false, msg: "Email já cadastrado" };
        }

        // Criptografar a senha
        const hash = await bcrypt.hash(senha_usuario, 10);

        const result = await pool`INSERT INTO usuario (nome_usuario, apelido_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario) 
           VALUES (${nome_usuario}, ${apelido_usuario}, ${telefone_usuario}, ${cpf_usuario}, ${email_usuario}, ${hash}, ${tipo_usuario}, ${avatar_usuario})

            RETURNING id_usuario, apelido_usuario, email_usuario, tipo_usuario, avatar_usuario`

        const token = jwt.sign(
            {
                id: result.id_usuario,
                tipo: result.tipo_usuario
            },
            SECRET, {
            expiresIn: "5h"
        }
        );

        return {
            status: true, msg: { ...result, token }
        };
    } catch (err) {
        console.log(err);
        return { status: false, msg: `Erro ao cadastrar usuário ${err}` };
    }
}

// Atualizar senha (sempre criptografada)
export async function atualizarSenhaUsuario(id, usuario) {
    const { senha_usuario } = usuario;
    try {
        const hash = await bcrypt.hash(senha_usuario, 10);
        await pool`UPDATE usuario SET senha_usuario = ${hash} WHERE id_usuario = ${id}`;
        return true;
    } catch (err) {
        return false;
    }
}

export async function atualizarNomeUsuario(id, usuario) {
    const { nome_usuario } = usuario

    try {
        await pool`UPDATE usuario SET nome_usuario = ${nome_usuario} WHERE id_usuario = ${id}`
        return true
    } catch (err) {
        return false
    }
}

export async function atualizarApelidoUsuario(id, usuario) {
    const { apelido_usuario } = usuario

    try {
        await pool`UPDATE usuario SET apelido_usuario = ${apelido_usuario} WHERE id_usuario = ${id}`
        return true
    } catch (err) {
        return false
    }
}

export async function atualizarTelefoneUsuario(id, usuario) {
    const { telefone_usuario } = usuario

    try {
        await pool`UPDATE usuario SET telefone_usuario = ${telefone_usuario} WHERE id_usuario = ${id}`
        return true
    } catch (err) {
        return false
    }
}

export async function atualizarEmailUsuario(id, usuario) {
    const { email_usuario } = usuario

    try {
        await pool`UPDATE usuario SET email_usuario = ${email_usuario} WHERE id_usuario = ${id}`
        return true
    } catch (err) {
        return false
    }
}

export async function deletarUsuario(id) {
    try {
        const results = await pool`DELETE FROM usuario WHERE id_usuario = ${id}`
        results.count >= 1 ? true : false
    } catch (err) {
        return false
    }
}