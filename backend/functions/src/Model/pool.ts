import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// 1. Obtém a string de conexão a partir da variável de ambiente segura (.env)
const connectionString = process.env.DATABASE_URL;

// 2. Validação estrita para evitar que a aplicação suba sem conexão ou quebre em produção
if (!connectionString) {
  throw new Error("ERRO CRÍTICO DE BANCO DE DADOS: A variável de ambiente DATABASE_URL não foi definida!");
}

// Criando a conexão com o BD de forma segura
const pool = postgres(connectionString);

export default pool;