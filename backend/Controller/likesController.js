import express from 'express'
import { lerLike, lerTodosLikes } from '../Service/likesService.js'
const router = express.Router()
router.use(express.json())

router.get('/likes/lerTodosLikes', (req, res) =>{
    lerTodosLikes().then(resultado =>{
        if(resultado) return res.status(200).send(`${JSON.stringify(resultado)}`); else return res.status(400).send("ERRO! Não há likes");
    }) 
})

router.get('/likes/lerLike/:idUsuario/:idPost', (req, res) =>{
    lerLike(req.params.idUsuario, req.params.idPost).then(resultado =>{
        if(resultado.status) return res.status(200).send(`${JSON.stringify(resultado.msg)}`); else return res.status(400).send(`${resultado.msg}`);
    })
})


export default router;