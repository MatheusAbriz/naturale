import express from 'express';
import {
    getAll,
    add,
    getByTitle,
    getById,
    toggleLike
} from '../Service/posts.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// CRUD - POSTS

// Ler todos os posts
router.get('/posts', verifyToken, (req, res) => {
    getAll().then(result => {
        if (result) {
            return res.status(200).json(result);
        }
        return res.status(400).send("Erro! Não foi possível achar esse POST");
    });
});

// Adicionar post
router.post('/posts', verifyToken, (req, res) => {
    add(req.body).then(result => {
        if (result) {
            return res.status(200).send("Sucesso! post adicionado com sucesso");
        }
        return res.status(400).send("Erro! post nao adicionado");
    });
});

// Ler posts por título
router.get('/posts/search/:text', verifyToken, (req, res) => {
    getByTitle(req.params.text).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Ler post por ID
router.get('/posts/:id', verifyToken, (req, res) => {
    getById(req.params.id).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// CRUD - Posts - Atualizar Likes por Curtida
router.patch('/posts/:postId/like/:userId', verifyToken, (req, res) => {
    toggleLike(req.params.userId, req.params.postId).then(result => {
        if (result) {
            return res.status(200).send("Sucesso! post atualizado com sucesso");
        }
        return res.status(400).send("Erro! post não encontrado");
    });
});

export default router;