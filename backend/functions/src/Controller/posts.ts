import express from 'express';
import {
    getAll,
    add,
    getByTitle,
    getById,
    toggleLike,
    update,
    remove
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

  const userId = req.user?.id;

  getAll(filters, userId!, search).then(result => {
    if (result) return res.status(200).json(result);
    return res.status(400).send("Erro!");
  });
});

// Adicionar post
router.post('/posts', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;

    const postData = { ...req.body, user_id: userIdFromToken! };

    add(postData).then(result => {
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

router.get('/posts/:postId', verifyToken, async (req, res) => {
  const userIdFromToken = req.user?.id;

  const result = await getById(req.params.postId, userIdFromToken!);
  if (result.status) {
    return res.status(200).json(result.data);
  }
  return res.status(400).json({
    message: result.msg
  });
});

// Editar post (somente o dono)
router.put('/posts/:postId', verifyToken, async (req, res) => {
    const userIdFromToken = req.user?.id;

    const result = await update(req.params.postId, userIdFromToken!, req.body);
    if (result.status) {
        return res.status(200).json({ message: result.msg });
    }
    return res.status(403).json({ message: result.msg });
});

// Excluir post (somente o dono)
router.delete('/posts/:postId', verifyToken, async (req, res) => {
    const userIdFromToken = req.user?.id;

    const result = await remove(req.params.postId, userIdFromToken!);
    if (result.status) {
        return res.status(200).json({ message: result.msg });
    }
    return res.status(403).json({ message: result.msg });
});

// CRUD - Posts - Atualizar Likes por Curtida (HARDENING: userId sai da URL e entra o ID do token)
router.patch('/posts/:postId/like', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;

    toggleLike(userIdFromToken!, req.params.postId).then(result => {
        if (result) {
            return res.status(200).send("Sucesso! post updated com sucesso");
        }
        return res.status(400).send("Erro! post não encontrado");
    });
});

export default router;