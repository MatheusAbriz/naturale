import express from 'express'
import { lerLike, lerTodosLikes } from '../Service/likesService.js'
const router = express.Router()
router.use(express.json())

router.get('/likes/lerTodosLikes', (req, res) =>{
    lerTodosLikes().then(resultado =>{
        if(resultado.status) return res.status(200).send(`${JSON.stringify(resultado.msg)}`); else return res.status(400).send(resultado.msg);
    }) 
})

router.get('/likes/lerLike/:idUsuario/:idPost', (req, res) =>{
    lerLike(req.params.idUsuario, req.params.idPost).then(resultado =>{
        //Aqui eu coloco 200 para permitir a entrada no frontend. Lá eu verifico que caso o res.data.length for 0, dá erro(pois nao ha um like)
        if(resultado.status) return res.status(200).send(`${JSON.stringify(resultado.msg)}`); else return res.status(200).send(0);
    })
})


export default router;