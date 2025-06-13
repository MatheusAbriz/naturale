import pg from 'pg'
import dotenv from 'dotenv'

const { Pool  } = pg
dotenv.config()

//Criando a conexão com o BD
const pool = new Pool({
    user: process.env.USER_POSTGRES,
    host: 'localhost',
    database: process.env.DATABASE_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
    port: process.env.PORT_POSTGRES
})

export default pool;