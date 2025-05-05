import mysql from 'mysql2/promise'

//Criando a conexão com o BD
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'naturale',
    password: '0505823513'
})

export default connection