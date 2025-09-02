import pg from 'pg'
import dotenv from 'dotenv'

const { Pool  } = pg
dotenv.config()

//Criando a conexão com o BD
const connectionString = "postgresql://postgres:HcRpARovWsBtSwGd@db.lgnanqqwuvnmhiernohc.supabase.co:5432/postgres"
console.log("Database URL", connectionString)
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false, // necessário em provedores cloud
    },
})

export default pool;