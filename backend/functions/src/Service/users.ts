import pool from "../Model/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDTO } from '../types/users/index.js';
import { sendPasswordResetEmail } from "./mailer.js";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

// HARDENING: Garante que usa o nome unificado da variável de ambiente definida no Sprint 0
const SECRET = process.env.JWT_SECRET;

// Criando minhas funções de CRUD para exportar
export async function getById(id: string | number) {
    try {
        // HARDENING: Remove o campo 'password' e 'cpf' do SELECT para evitar exposição desnecessária
        const results = await pool`
            SELECT id, name, username, phone, email, type, avatar 
            FROM users 
            WHERE id = ${id}
        `;

        if (results.count >= 1) {
            return results[0];
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// Selecionar nome do usuário pelo ID
export async function getNameById(id: number | string) {
    try {
        const results = await pool`
            SELECT name FROM users WHERE id = ${id}
        `;

        if (results.count >= 1) return results[0];
        else return false;
    } catch (err) {
        console.log(err);
        return false;
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

        // Criar token JWT usando a chave secreta forte unificada
        const token = jwt.sign(
            { id: user.id, tipo: user.type },
            SECRET!,
            { expiresIn: "7d" }
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

export async function updateAvatar(id: number | string, avatar: string) {
    try {
        await pool`
            UPDATE users SET avatar = ${avatar} WHERE id = ${id}
        `;
        return { status: true, msg: "" };
    } catch (err) {
        return { status: false, msg: err };
    }
}

// Solicitar redefinição de senha: gera um código de 6 dígitos válido por 15 min e envia por e-mail
export async function forgotPassword(email: string) {
    try {
        const results = await pool`
            SELECT id FROM users WHERE email = ${email}
        `;

        // Não revela se o e-mail existe ou não (evita enumeração de contas)
        if (results.count === 0) {
            return { status: true, msg: "Se o e-mail existir, um código foi enviado" };
        }

        const user = results[0];
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

        await pool`
            UPDATE users
            SET reset_token = ${code}, reset_token_expires = ${expiresAt}
            WHERE id = ${user.id}
        `;

        await sendPasswordResetEmail(email, code);

        return { status: true, msg: "Se o e-mail existir, um código foi enviado" };
    } catch (err) {
        console.log("Erro ao solicitar redefinição de senha:", err);
        return { status: false, msg: "Erro ao solicitar redefinição de senha" };
    }
}

// Confirmar redefinição de senha com o código recebido por e-mail
export async function resetPassword(email: string, code: string, newPassword: string) {
    try {
        const results = await pool`
            SELECT id, reset_token, reset_token_expires FROM users WHERE email = ${email}
        `;

        if (results.count === 0) {
            return { status: false, msg: "Código inválido ou expirado" };
        }

        const user = results[0];
        const isExpired = !user.reset_token_expires || new Date(user.reset_token_expires) < new Date();

        if (!user.reset_token || user.reset_token !== code || isExpired) {
            return { status: false, msg: "Código inválido ou expirado" };
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await pool`
            UPDATE users
            SET password = ${hash}, reset_token = NULL, reset_token_expires = NULL
            WHERE id = ${user.id}
        `;

        return { status: true, msg: "Senha redefinida com sucesso" };
    } catch (err) {
        console.log("Erro ao redefinir senha:", err);
        return { status: false, msg: "Erro ao redefinir senha" };
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