import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import usuario from './Controller/usuarioController.js'
import post from './Controller/postController.js'
import likes from './Controller/likesController.js'


const app = express()
dotenv.config()
const port = process.env.PORT

app.use(cors())
app.use(usuario)
app.use(post)
app.use(likes)

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Permite o acesso do domínio do cliente
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Métodos permitidos
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

app.listen(port, () =>{
    console.log(`Servidor de exemplo iniciado na porta ${ port }`)
})
