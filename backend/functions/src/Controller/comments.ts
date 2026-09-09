import express from 'express';
import {
    getByPost,
    add,
    edit,
    remove,
    addReply,
    getReplies,
    editReply,
    deleteReply
} from '../Service/comments.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// Ler todos os comentários de um post
router.get('/comments/post/:postId', verifyToken, (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };

    getByPost(req.params.postId, filters).then(result => {
        if (result.status) {
            return res.status(200).json(result);
        }
        return res.status(400).send(result);
    });
});

// Adicionar comentário (HARDENING: usa o userId do token seguro)
router.post('/comments', verifyToken, (req, res) => {
    const { post_id, comment_text } = req.body;
    const userIdFromToken = req.user?.id;

    if (!post_id || !comment_text) {
        return res.status(400).send("Campos obrigatórios não preenchidos");
    }

    add(userIdFromToken!, post_id, comment_text).then(result => {
        if (result.status) {
            return res.status(201).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
    return;
});

// Editar comentário (HARDENING: passa o ID do token para bater com o Service)
router.patch('/comments/:commentId', verifyToken, (req, res) => {
    const { comment_text } = req.body;
    const userIdFromToken = req.user?.id;

    if (!comment_text) {
        return res.status(400).send("Texto do comentário é obrigatório");
    }

    edit(req.params.commentId, comment_text, userIdFromToken!).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
    return;
});

// Excluir comentário (HARDENING: passa o ID do token para bater com o Service)
router.delete('/comments/:commentId', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;

    remove(req.params.commentId, userIdFromToken!).then(result => {
        if (result.status) {
            return res.status(200).send(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Adicionar resposta (HARDENING: usa o userId do token seguro)
router.post('/comments/reply', verifyToken, (req, res) => {
    const { post_id, comment_text, parent_comment_id } = req.body;
    const userIdFromToken = req.user?.id;

    if (!post_id || !comment_text || !parent_comment_id) {
        return res.status(400).send("Campos obrigatórios não preenchidos");
    }

    addReply(post_id, userIdFromToken!, comment_text, parent_comment_id)
        .then(result => {
            if (result.status) {
                return res.status(201).json(result.msg);
            }
            return res.status(400).send(result.msg);
        });
    return;
});

// Listar respostas de um comentário
router.get('/comments/:commentId/replies', verifyToken, (req, res) => {
    getReplies(req.params.commentId).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Editar resposta (HARDENING: passa o ID do token para bater com o Service)
router.patch('/comments/reply/:commentId', verifyToken, (req, res) => {
    const { comment_text } = req.body;
    const userIdFromToken = req.user?.id;

    if (!comment_text) {
        return res.status(400).send("Texto da resposta é obrigatório");
    }

    editReply(req.params.commentId, comment_text, userIdFromToken!).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
    return;
});

// Excluir resposta (HARDENING: passa o ID do token para bater com o Service)
router.delete('/comments/reply/:commentId', verifyToken, (req, res) => {
    const userIdFromToken = req.user?.id;

    deleteReply(req.params.commentId, userIdFromToken!).then(result => {
        if (result.status) {
            return res.status(200).send(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

export default router;