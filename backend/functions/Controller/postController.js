import express from 'express';
import { lerTodosPosts, atualizarPostCurtida, lerPostPorTitulo } from '../Service/postService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(express.json());

// CRUD - POSTS
router.get('/post/lerTodosPosts/', verifyToken, (req, res) => {
    lerTodosPosts().then(resultado => {
        if (resultado) {
            return res.status(200).send(JSON.stringify(resultado));
        } else {
            return res.status(400).send("Erro! Não foi possível achar esse POST");
        }
    });
});

router.get('/post/lerPostsPorTitulo/:texto', verifyToken, (req, res) => {
    lerPostPorTitulo(req.params.texto).then(resultado => {
        if (resultado.status){
            return  res.status(200).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// CRUD - Posts - Atualizar Likes por Curtida
router.patch('/post/atualizarPostCurtida/:idUsuario/:idPost', verifyToken, (req, res) => {
    atualizarPostCurtida(req.params.idUsuario, req.params.idPost).then(resultado => {
        if (resultado) {
            return res.status(200).send("Sucesso! post atualizado com sucesso");
        } else {
            return res.status(400).send("Erro! post não encontrado");
        }
    });
});

export default router;
