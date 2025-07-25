import express from 'express'
import { lerTodosPosts, atualizarPostCurtida } from '../Service/postService.js'
const router = express.Router()

router.use(express.json())

//CRUD - POSTS
router.get('/post/lerTodosPosts/', (req, res) =>{
    lerTodosPosts().then(resultado =>{
        if(resultado) return res.status(200).send(`${JSON.stringify(resultado)}`); else return res.status(400).send("Erro! Não foi possível achar esse POST");
    })
})

//CRUD - Posts - Atualizar Likes por Curtida
router.patch('/post/atualizarPostCurtida/:idUsuario/:idPost', (req, res) =>{
    atualizarPostCurtida(req.params.idUsuario, req.params.idPost).then(resultado =>{
        if(resultado) return res.status(200).send("Sucesso! Usuário atualizado com sucesso"); else return res.status(400).send("Erro! Usuário não encontrado");
    })
})

export default router