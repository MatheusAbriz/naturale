import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

//Criando a conexão com o BD
const connectionString = "postgresql://postgres:HcRpARovWsBtSwGd@db.lgnanqqwuvnmhiernohc.supabase.co:5432/postgres"

const pool = postgres(connectionString);

export default pool;