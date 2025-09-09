import pool from "../model/pool.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET

// Selecionar usuário pelo ID
export async function selecionarUsuario(id) {    
    try {
        const results = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id]);
        if (results.rows.length >= 1) return results.rows;
        return false;
    } catch (err) {
        console.log(err);
    }
}

// Selecionar apenas o nome do usuário
export async function selecionarNomeUsuario(id) {
    try {
        const results = await pool.query("SELECT nome_usuario FROM usuario WHERE id_usuario = $1", [id]);
        if (results.rows.length >= 1) return results.rows;
        return false;
    } catch (err) {
        console.log(err);
    }
}

// Login de usuário com autenticação JWT
export async function logarUsuario(email, senha) {
    try {
        const results = await pool.query(
            "SELECT id_usuario, nome_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario FROM usuario WHERE email_usuario = $1",
            [email]
        );

        if (results.rows.length === 0) {
            return { status: false, msg: "Usuário não encontrado" };
        }

        const usuario = results.rows[0];

        // Verificar senha com bcrypt
        const senhaValida = await bcrypt.compare(senha, usuario.senha_usuario);
        if (!senhaValida) {
            return { status: false, msg: "Senha incorreta" };
        }

        // Criar token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, tipo: usuario.tipo_usuario },
            SECRET,
            { expiresIn: "1h" }
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
        const existingUser = await pool.query("SELECT * FROM usuario WHERE email_usuario = $1", [email_usuario]);
        if(existingUser.rows.length > 0) {
            return { status: false, msg: "Email já cadastrado" };
        }

        // Criptografar a senha
        const hash = await bcrypt.hash(senha_usuario, 10);

        const result = await pool.query(
            `INSERT INTO usuario (nome_usuario, apelido_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id_usuario, apelido_usuario, email_usuario, tipo_usuario, avatar_usuario`,
            [nome_usuario, apelido_usuario, telefone_usuario, cpf_usuario, email_usuario, hash, tipo_usuario, avatar_usuario]
        );

        const token = jwt.sign(
            { id: result.rows[0].id_usuario, tipo: result.rows[0].tipo_usuario },
            SECRET,
            { expiresIn: "1h" }
        );

        return {
            status: true,
            usuario: {
                ...result.rows[0],
                token
            }
        };
    } catch (err) {
        console.log(err);
        return { status: false, msg: "Erro ao cadastrar usuário" };
    }
}

// Atualizar senha (sempre criptografada)
export async function atualizarSenhaUsuario(id, usuario) {
    const { senha_usuario } = usuario;
    try {
        const hash = await bcrypt.hash(senha_usuario, 10);
        await pool.query("UPDATE usuario SET senha_usuario = $1 WHERE id_usuario = $2", [hash, id]);
        return true;
    } catch (err) {
        return false;
    }
}

// Demais funções de update/delete podem ficar iguais
export async function atualizarNomeUsuario(id, usuario) {
    const { nome_usuario } = usuario;
    try {
        await pool.query("UPDATE usuario SET nome_usuario = $1 WHERE id_usuario = $2", [nome_usuario, id]);
        return true;
    } catch (err) {
        return false;
    }
}

export async function atualizarApelidoUsuario(id, usuario) {
    const { apelido_usuario } = usuario;
    try {
        await pool.query("UPDATE usuario SET apelido_usuario = $1 WHERE id_usuario = $2", [apelido_usuario, id]);
        return true;
    } catch (err) {
        return false;
    }
}

export async function atualizarTelefoneUsuario(id, usuario) {
    const { telefone_usuario } = usuario;
    try {
        await pool.query("UPDATE usuario SET telefone_usuario = $1 WHERE id_usuario = $2", [telefone_usuario, id]);
        return true;
    } catch (err) {
        return false;
    }
}

export async function atualizarEmailUsuario(id, usuario) {
    const { email_usuario } = usuario;
    try {
        await pool.query("UPDATE usuario SET email_usuario = $1 WHERE id_usuario = $2", [email_usuario, id]);
        return true;
    } catch (err) {
        return false;
    }
}

export async function deletarUsuario(id) {
    try {
        const results = await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);
        return results.rowCount >= 1;
    } catch (err) {
        return false;
    }
}
