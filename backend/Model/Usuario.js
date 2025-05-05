import express from 'express'
import connection from '../Service/Conexao.js'
import { selecionarUsuario } from '../Controller/usuarioController.js'
const router = express.Router()

router.use(express.json())



router.get('/usuario/', (req, res, next) =>{
    res.send(`Olá, deu tudo certo! ${connection}`)
})

//CRUD - Cria Usuario
router.post('/usuario/adicionaUsuario', (req, res) => {
    //const { nome, telefone, cpf, email, senha } = JSON.stringify(req.body)
    const nome = req.body.nome
    const telefone = req.body.telefone
    const cpf = req.body.cpf
    const email = req.body.email
    const senha = req.body.senha

    //const selecionaUsuario = selecionarUsuario(1)

    //Verificando se a query deu OK(verdadeira, exibir resultados) ou falsa(erro)
    res.send(`Olá ${nome}, tudo bem?`)
})

//Crud - Ler Usuario
router.get('/usuario/lerUsuario', (req, res) => {
    selecionarUsuario(1).then(usuario =>{

        //Verificando se a query deu OK(verdadeira, exibir resultados) ou falsa(erro)
        if(usuario){
            res.send(`${ JSON.stringify(usuario) }`)
        }else{
            res.send("Erro! Não foi possível achar usuário")
        }
    })
})

export default router