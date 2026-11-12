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
import { createNotification } from '../Service/notifications.js';
import { getIdsByUsernames } from '../Service/users.js';

const router = express.Router();
router.use(express.json());

// Extrai usernames únicos mencionados (@username) num texto de comentário
function extractMentionedUsernames(text: string): string[] {
    const matches = text.matchAll(/@([\w.]+)/g);
    return [...new Set(Array.from(matches, (m) => m[1]))];
}

// Notifica cada usuário mencionado num comentário/resposta recém-criado
async function notifyMentions(text: string, postId: number | string, actorId: number, commentId: number) {
    const usernames = extractMentionedUsernames(text);
    if (usernames.length === 0) return;

    const mentionedUsers = await getIdsByUsernames(usernames);
    for (const u of mentionedUsers) {
        createNotification({ type: 'mention', recipientId: u.id, actorId, postId, commentId });
    }
}

// Percorre a árvore de comentários/respostas coletando usernames mencionados
function collectMentionedUsernames(comments: { text: string; replies?: unknown[] }[], acc: Set<string>) {
    for (const c of comments) {
        for (const username of extractMentionedUsernames(c.text)) acc.add(username);
        if (c.replies?.length) collectMentionedUsernames(c.replies as typeof comments, acc);
    }
}

// Ler todos os comentários de um post
router.get('/comments/post/:postId', verifyToken, (req, res) => {
    const fetchAll = req.query.all === 'true';
    const page = fetchAll ? 1 : (Number(req.query.page) || 1);
    const limit = fetchAll ? 1000 : Math.min(Number(req.query.limit) || 10, 20);
    const filters = { page, limit };

    getByPost(req.params.postId, filters).then(async result => {
        if (result.status) {
            const usernames = new Set<string>();
            collectMentionedUsernames(result.msg as { text: string; replies?: unknown[] }[], usernames);

            let mentions: Record<string, number> = {};
            if (usernames.size > 0) {
                const resolved = await getIdsByUsernames([...usernames]);
                mentions = Object.fromEntries(resolved.map((u) => [u.username, u.id]));
            }

            return res.status(200).json({ ...result, mentions });
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
            const commentId = (result.msg as { id: number }).id;
            createNotification({ type: 'comment', postId: post_id, actorId: userIdFromToken!, commentId });
            notifyMentions(comment_text, post_id, userIdFromToken!, commentId);
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
                const commentId = (result.msg as { id: number }).id;
                createNotification({ type: 'comment', postId: post_id, actorId: userIdFromToken!, commentId });
                notifyMentions(comment_text, post_id, userIdFromToken!, commentId);
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