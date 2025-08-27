import pg from 'pg'
import dotenv from 'dotenv'

const { Pool  } = pg
dotenv.config()

//Criando a conexão com o BD
const pool = new Pool({
    user: process.env.USER_POSTGRES,
    host: process.env.HOST_POSTGRES,
    database: process.env.DATABASE_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
    port: process.env.PORT_POSTGRES,
    ssl: {
        rejectUnauthorized: false, // necessário em provedores cloud
    },
})

export default pool;