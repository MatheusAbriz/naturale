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
    getByPost(req.params.postId).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Adicionar comentário
router.post('/comments', verifyToken, (req, res) => {
    const { user_id, post_id, comment_text } = req.body;

    if (!user_id || !post_id || !comment_text) {
        return res.status(400).send("Campos obrigatórios não preenchidos");
    }

    add(user_id, post_id, comment_text).then(result => {
        if (result.status) {
            return res.status(201).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Editar comentário
router.patch('/comments/:commentId', verifyToken, (req, res) => {
    const { comment_text } = req.body;

    if (!comment_text) {
        return res.status(400).send("Texto do comentário é obrigatório");
    }

    edit(req.params.commentId, comment_text).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Excluir comentário
router.delete('/comments/:commentId', verifyToken, (req, res) => {
    remove(req.params.commentId).then(result => {
        if (result.status) {
            return res.status(200).send(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Adicionar resposta
router.post('/comments/reply', verifyToken, (req, res) => {
    const { post_id, user_id, comment_text, parent_comment_id } = req.body;

    if (!post_id || !user_id || !comment_text || !parent_comment_id) {
        return res.status(400).send("Campos obrigatórios não preenchidos");
    }

    addReply(post_id, user_id, comment_text, parent_comment_id)
        .then(result => {
            if (result.status) {
                return res.status(201).json(result.msg);
            }
            return res.status(400).send(result.msg);
        });
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

// Editar resposta
router.patch('/comments/reply/:commentId', verifyToken, (req, res) => {
    const { comment_text } = req.body;

    if (!comment_text) {
        return res.status(400).send("Texto da resposta é obrigatório");
    }

    editReply(req.params.commentId, comment_text).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

// Excluir resposta
router.delete('/comments/reply/:commentId', verifyToken, (req, res) => {
    deleteReply(req.params.commentId).then(result => {
        if (result.status) {
            return res.status(200).send(result.msg);
        }
        return res.status(400).send(result.msg);
    });
});

export default router;
