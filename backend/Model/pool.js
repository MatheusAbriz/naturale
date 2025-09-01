import pg from 'pg'
import dotenv from 'dotenv'

const { Pool  } = pg
dotenv.config()

//Criando a conexão com o BD
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // necessário em provedores cloud
    },
})

export default pool;