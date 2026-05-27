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
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 20);
  const search = req.query.search?.toString();

  const filters = { page, limit };
  const userId = req?.user?.id;

  getAll(filters, userId!, search).then(result => {
    if (result) return res.status(200).json(result);
    return res.status(400).send("Erro!");
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
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };

    getByTitle(req.params.text, filters).then(result => {
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).send(result.msg);
    });
});

// Ler post por ID
router.get('/posts/:postId/:userId', verifyToken, async (req, res) => {

  const result = await getById(req.params.postId, req.params.userId);
  if (result.status) {
    return res.status(200).json(result.data);
  }
  return res.status(400).json({
    message: result.msg
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