import express from 'express'
import dotenv from 'dotenv'

//Configurando .env e porta
dotenv.config()
const app = express()
const port = process.env.PORT

app.use(express.json())

//CRUD - Usuario
app.post('/usuario/adicionaUsuario', (req, res) => {
    //const { nome, telefone, cpf, email, senha } = JSON.stringify(req.body)
    const nome = req.body.nome
    const telefone = req.body.telefone
    const cpf = req.body.cpf
    const email = req.body.email
    const senha = req.body.senha

    res.send(`Ola ${ nome } de telefone ${ telefone }`)
})

//Iniciando o servidor
app.listen(port, () =>{
    console.log(`Servidor rodando na porta ${port}`)
})