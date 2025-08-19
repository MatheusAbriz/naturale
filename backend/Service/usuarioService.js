import pool from "../model/pool.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = "minha_chave_secreta"; // ideal usar process.env.JWT_SECRET

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
        const { nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario } = usuario;

        // Criptografar a senha
        const hash = await bcrypt.hash(senha_usuario, 10);

        const result = await pool.query(
            `INSERT INTO usuario (nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario, tipo_usuario, avatar_usuario) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id_usuario, nome_usuario, email_usuario, tipo_usuario, avatar_usuario`,
            [nome_usuario, telefone_usuario, cpf_usuario, email_usuario, hash, tipo_usuario, avatar_usuario]
        );

        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
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
