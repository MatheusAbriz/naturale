import express from 'express'
import dotenv from 'dotenv'
import usuario from './Model/Usuario.js'

const app = express()
dotenv.config()
const port = process.env.PORT

app.use(usuario)

app.listen(port, () =>{
    console.log(`Servidor de exemplo iniciado na porta ${ port }`)
})
