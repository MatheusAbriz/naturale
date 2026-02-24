import pool from "../Model/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDTO } from '../types/users/index.js';

const SECRET = process.env.JWT_SECRET;

// Criando minhas funções de CRUD para exportar
export async function getById(id: string | number) {
    try {
        const results = await pool`
            SELECT * FROM users WHERE id = ${id}
        `;

        // Retornando o resultado
        if (results.count >= 1) {
            return results;
        }
        return false;
    } catch (err) {
        return console.log(err);
    }
}

// Selecionar nome do usuário pelo ID
export async function getNameById(id: number | string) {
    try {
        const results = await pool`
            SELECT name FROM users WHERE id = ${id}
        `;

        // Retornando os resultados
        if (results.count >= 1) return results;
        else return false;
    } catch (err) {
        return console.log(err);
    }
}

// Login de usuário com autenticação JWT
export async function login(email: string, password: string) {
    try {
        const results = await pool`
            SELECT id, username, name, email, password, type, avatar
            FROM users
            WHERE email = ${email}
        `;

        if (results.count === 0) {
            return { status: false, msg: "Usuário não encontrado" };
        }

        const user = results[0];

        // Verificar senha com bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return { status: false, msg: "Senha incorreta" };
        }

        // Criar token JWT
        const token = jwt.sign(
            { id: user.id, tipo: user.type },
            SECRET!,
            { expiresIn: "5h" }
        );

        return {
            status: true,
            msg: "Login realizado com sucesso",
            usuario: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                type: user.type,
                avatar: user.avatar,
                token
            }
        };
    } catch (err) {
        console.log(err);
        return { status: false, msg: `Erro na requisição ${err}` };
    }
}

// Adicionar usuário com senha criptografada
export async function create(userData: UserDTO) {
    try {
        const { name, username, phone, cpf, email, password, type, avatar } = userData;

        // Verifica se o email já está cadastrado
        const existingUser = await pool`
            SELECT * FROM users WHERE email = ${email}
        `;

        if (existingUser.count > 0) {
            return { status: false, msg: "Email já cadastrado" };
        }

        // Criptografar a senha
        const hash = await bcrypt.hash(password, 10);

        const result = await pool`
            INSERT INTO users (name, username, phone, cpf, email, password, type, avatar)
            VALUES (${name}, ${username!}, ${phone}, ${cpf}, ${email}, ${hash}, ${type}, ${avatar})
            RETURNING id, username, email, type, avatar
        `;

        const user = result[0];

        const token = jwt.sign(
            {
                id: user.id,
                tipo: user.type
            },
            SECRET!,
            { expiresIn: "5h" }
        );

        return {
            status: true,
            msg: { ...user, token }
        };
    } catch (err) {
        console.log(err);
        return { status: false, msg: `Erro ao cadastrar usuário ${err}` };
    }
}

// Atualizar senha (sempre criptografada)
export async function updatePassword(id: string | number, userData: UserDTO) {
    const { password } = userData;

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool`
            UPDATE users SET password = ${hash} WHERE id = ${id}
        `;
        return { status: true, msg: "" }
    } catch (err) {
        return { status: false, msg: `${err}`};
    }
}

export async function updateName(id: number | string, userData: UserDTO) {
    const { name } = userData;

    try {
        await pool`
            UPDATE users SET name = ${name} WHERE id = ${id}
        `;
        return { status: true, msg: "" }
    } catch (err) {
        return { status: false, msg: err };
    }
}

export async function updateUsername(id: number | string, userData: UserDTO) {
    const { username } = userData;

    try {
        await pool`
            UPDATE users SET username = ${username!} WHERE id = ${id}
        `;
        return {status: true, msg: "" };
    } catch (err) {
        return { status: false, msg: err };
    }
}

export async function updatePhone(id: number | string, userData: UserDTO) {
    const { phone } = userData;

    try {
        await pool`
            UPDATE users SET phone = ${phone} WHERE id = ${id}
        `;
        return { status: true, msg: "" };
    } catch (err) {
        return { status: false, msg: err };
    }
}

export async function updateEmail(id: number | string, userData: UserDTO) {
    const { email } = userData;

    try {
        await pool`
            UPDATE users SET email = ${email} WHERE id = ${id}
        `;
        return { status: true, msg: "" };
    } catch (err) {
        return { status: false, msg: err };
    }
}

export async function deleteUser(id: number | string) {
    try {
        const results = await pool`
            DELETE FROM users WHERE id = ${id}
        `;
        return { status: true, msg: results.count >= 1 }
    } catch (err) {
        console.log("Erro ao deletar usuário:", err);
        return { status: false, msg: err };
    }
}
