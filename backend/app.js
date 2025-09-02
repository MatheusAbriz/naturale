
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import usuario from './functions/Controller/usuarioController.js'
import post from './functions/Controller/postController.js'
import likes from './functions/Controller/likesController.js'
import pkg from 'swagger-ui-express'
import { readFileSync } from 'fs'
const swaggerUi = pkg

const app = express()
dotenv.config()
const port = process.env.PORT
const swaggerDocument = JSON.parse(readFileSync('./swagger/swagger-output.json'));

app.use(cors())
app.use(express.json())

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Permite o acesso do domínio do cliente
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Métodos permitidos
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})

//Porta da api
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(usuario)
app.use(post)
app.use(likes)

app.get('/', (req, res) => {
    res.json({ 
        message: 'API Naturale funcionando!',
        documentation: '/api-docs',
        status: 'OK'
    });
});

app.listen(port, () =>{
    console.log(`Servidor de exemplo iniciado na porta ${ port }`)
})
