import express from 'express'
import { adicionarUsuario, atualizarEmailUsuario, atualizarNomeUsuario, atualizarSenhaUsuario, atualizarTelefoneUsuario, deletarUsuario, logarUsuario, selecionarNomeUsuario, selecionarUsuario } from '../Service/usuarioService.js'
const router = express.Router()

router.use(express.json())



router.get('/usuario/', (req, res, next) =>{
    res.send(`Olá, deu tudo certo! ${connection}`)
})

//CRUD - Cria Usuario
router.post('/usuario/adicionarUsuario', (req, res) => {
    //Verificando se a query deu OK(verdadeira, exibir resultados) ou falsa(erro)
    adicionarUsuario(req.body).then(resultado =>{
        resultado ? res.status(200).send() : res.status(400).send("Erro! Verifique as informações corretamente")
    })
})

//Crud - Ler Usuario
router.get('/usuario/lerUsuario/:id', (req, res) => {
    selecionarUsuario(req.params.id).then(usuario =>{

        //Verificando se a query deu OK(verdadeira, exibir resultados) ou falsa(erro)
        if(usuario){
            res.status(200).send(`${ JSON.stringify(usuario) }`)
        }else{
            res.status(400).send("Erro! Não foi possível achar usuário")
        }
    })
})

//CRUD - Ler nome_usuario pelo ID
router.get('/usuario/lerNomeUsuario/:id', (req, res) =>{
    selecionarNomeUsuario(req.params.id).then(usuario =>{
        //Caso ache...
        if(usuario) return res.status(200).send(`${ JSON.stringify(usuario) }`); else return res.status(400).send("Erro! Não foi possível achar o usuário");
    })
})

//CRUD - Login usuario
router.get('/usuario/logarUsuario/:email/:senha', (req, res) => {
    logarUsuario(req.params.email, req.params.senha).then(usuario =>{
        if(usuario.status) return res.status(200).send(`${JSON.stringify(usuario.msg)}`); else return res.status(400).send("Erro! Não foi possível logar o usuário");
    })
})

//CRUD - Atualizar Usuario
router.put('/usuario/atualizarNomeUsuario/:id', (req, res) =>{
    atualizarNomeUsuario(req.params.id, req.body).then(resultado =>{
        //Verificando se a query deu certo ou nao
        if (resultado) return res.status(200).send("Usuário atualizado com sucesso!"); else return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    })
})

router.put('/usuario/atualizarTelefoneUsuario/:id', (req, res) =>{
    atualizarTelefoneUsuario(req.params.id, req.body).then(resultado =>{
        //Verificando se a query deu certo ou nao
        if (resultado) return res.status(200).send("Usuário atualizado com sucesso!"); else return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    })
})

router.put('/usuario/atualizarEmailUsuario/:id', (req, res) =>{
    atualizarEmailUsuario(req.params.id, req.body).then(resultado =>{
        //Verificando se a query deu certo ou nao
        if (resultado) return res.status(200).send("Usuário atualizado com sucesso!"); else return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    })
})

router.put('/usuario/atualizarSenhaUsuario/:id', (req, res) =>{
    atualizarSenhaUsuario(req.params.id, req.body).then(resultado =>{
        //Verificando se a query deu certo ou nao
        if (resultado) return res.status(200).send("Usuário atualizado com sucesso!"); else return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    })
})

router.delete('/usuario/deletarUsuario/:id', (req, res) =>{
    deletarUsuario(req.params.id).then(resultado =>{
        if(resultado) return res.status(200).send(); else return res.status(400).send("Erro! Não foi possível deletar o usuário com esse ID");
    })
})

export default router